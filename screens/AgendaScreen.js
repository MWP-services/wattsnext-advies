import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { auth, db } from "../firebaseConfig";
import { isEmailConfigured, sendAppointmentEmails } from "../support/email";
import AppointmentCalendar from "../components/AppointmentCalendar";
import ScreenBackground from "../components/ScreenBackground";
import {
  collection,
  doc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";

const OFFICE_ADDRESS = "Industrieweg 6, Stolwijk";

function toLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDateLabel(dateString) {
  if (!dateString) return "";
  try {
    const formatter = new Intl.DateTimeFormat("nl-NL", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return formatter.format(new Date(`${dateString}T12:00:00`));
  } catch (_error) {
    return dateString;
  }
}

const TIME_SLOTS = (() => {
  const slots = [];
  for (let hour = 9; hour <= 17; hour += 1) {
    for (let minute = 0; minute < 60; minute += 30) {
      if (hour === 17 && minute > 0) break;
      slots.push(
        `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
      );
    }
  }
  return slots;
})();

export default function AgendaScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const today = useMemo(() => new Date(), []);

  const todayString = useMemo(() => toLocalDateKey(today), [today]);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [locationType, setLocationType] = useState("office");
  const [customAddress, setCustomAddress] = useState("");
  const [contactName, setContactName] = useState(
    auth.currentUser?.displayName || "",
  );
  const [bookedSlots, setBookedSlots] = useState({});
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const userEmail = auth.currentUser?.email || "";

  useEffect(() => {
    const appointmentsRef = collection(db, "appointments");

    const unsubscribe = onSnapshot(
      appointmentsRef,
      (snapshot) => {
        const nextSlots = {};
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (!data?.date || !data?.time) return;
          if (!nextSlots[data.date]) nextSlots[data.date] = new Set();
          nextSlots[data.date].add(data.time);
        });

        const formatted = Object.fromEntries(
          Object.entries(nextSlots).map(([dateKey, value]) => [
            dateKey,
            Array.from(value).sort(),
          ]),
        );

        setBookedSlots(formatted);
        setLoadingSlots(false);
      },
      (error) => {
        console.error("Fout bij het ophalen van afspraken", error);
        setBookedSlots({});
        setLoadingSlots(false);
      },
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    setSelectedTime("");
  }, [selectedDate]);

  const availableTimes = useMemo(() => {
    if (!selectedDate) return [];
    const bookedForDay = bookedSlots[selectedDate] || [];
    const now = new Date();

    return TIME_SLOTS.filter((slot) => {
      if (bookedForDay.includes(slot)) return false;

      if (selectedDate === todayString) {
        const [hour, minute] = slot.split(":").map(Number);
        const slotDate = new Date();
        slotDate.setHours(hour, minute, 0, 0);
        if (slotDate <= now) return false;
      }

      return true;
    });
  }, [bookedSlots, selectedDate, todayString]);

  const locationLabel = locationType === "home" ? "Thuis" : "Bij WattsNext";
  const appointmentAddress =
    locationType === "home" && customAddress.trim()
      ? customAddress.trim()
      : OFFICE_ADDRESS;
  const formattedDate = formatDateLabel(selectedDate);

  const canSubmit =
    Boolean(
      selectedDate &&
        selectedTime &&
        contactName.trim() &&
        userEmail &&
        (locationType === "office" || customAddress.trim()),
    ) && !submitting;

  const handleSubmitAppointment = async () => {
    if (!canSubmit) return;

    const trimmedName = contactName.trim();
    const trimmedAddress =
      locationType === "home" ? customAddress.trim() : OFFICE_ADDRESS;

    if (locationType === "home" && !trimmedAddress) {
      Alert.alert(
        "Adres ontbreekt",
        "Voer een adres in voor de afspraak thuis.",
      );
      return;
    }

    const slotId = `${selectedDate}_${selectedTime.replace(":", "-")}`;
    const appointmentRef = doc(db, "appointments", slotId);

    setSubmitting(true);
    try {
      await runTransaction(db, async (transaction) => {
        const snapshot = await transaction.get(appointmentRef);
        if (snapshot.exists()) {
          throw new Error("slot-taken");
        }
        transaction.set(appointmentRef, {
          date: selectedDate,
          time: selectedTime,
          location: locationType,
          address: trimmedAddress,
          contactName: trimmedName,
          contactEmail: userEmail,
          createdAt: serverTimestamp(),
        });
      });

      const emailResult = await sendAppointmentEmails({
        clientEmail: userEmail,
        clientName: trimmedName,
        formattedDate,
        time: selectedTime,
        locationLabel,
        address: trimmedAddress,
      });

      if (!emailResult.success) {
        const firstErr =
          emailResult.results.find((result) => !result.ok)?.error ||
          "onbekende fout";
        console.log("EmailJS failure", emailResult);
        Alert.alert(
          "Afspraak ingepland",
          isEmailConfigured()
            ? `Bevestigingsmail verzenden mislukt:\n${firstErr}`
            : "De afspraak is ingepland. Configureer de EXPO_PUBLIC_EMAILJS_* variabelen om automatische e-mails te versturen.",
        );
      } else {
        Alert.alert(
          "Afspraak ingepland",
          "Je ontvangt zo een bevestiging in de mail. WattsNext wordt ook op de hoogte gebracht.",
        );
      }

      setSelectedDate("");
      setSelectedTime("");
      setCustomAddress("");
      setLocationType("office");
    } catch (error) {
      if (error?.message === "slot-taken") {
        Alert.alert(
          "Tijdslot niet beschikbaar",
          "Dit tijdslot is zojuist geboekt. Kies een andere tijd.",
        );
      } else {
        console.error("Fout bij het plannen van een afspraak", error);
        Alert.alert(
          "Er ging iets mis",
          "Het is niet gelukt om de afspraak te plannen. Probeer het later opnieuw.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenBackground
        style={styles.backgroundWrapper}
        imageStyle={styles.backgroundImage}
      >
        <SafeAreaView style={styles.safeArea}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backTopLeft}
            accessibilityRole="button"
            accessibilityLabel="Ga terug naar het vorige scherm"
          >
            <Text style={styles.backText}>← Terug</Text>
          </TouchableOpacity>

          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { paddingHorizontal: width > 768 ? 48 : 24 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              <Image
                source={require("../assets/logo.png")}
                style={[
                  styles.logo,
                  {
                    width: width > 768 ? 240 : 180,
                    height: width > 768 ? 96 : 72,
                  },
                ]}
                resizeMode="contain"
              />

              <Text style={[styles.title, { fontSize: width > 768 ? 32 : 22 }]}>
                Plan een afspraak
              </Text>

              <View
                style={[
                  styles.schedulerCard,
                  { width: width > 992 ? "70%" : "100%" },
                ]}
              >
                <Text style={styles.schedulerTitle}>
                  Plan direct een afspraak
                </Text>
                <Text style={styles.schedulerSubtitle}>
                  Kies een datum, selecteer een tijd tussen 09:00 en 17:00 en
                  geef aan of we bij jou langskomen of dat je liever op kantoor
                  afspreekt.
                </Text>

                {loadingSlots ? (
                  <View style={styles.loadingWrapper}>
                    <ActivityIndicator size="large" color="#f7941e" />
                    <Text style={styles.loadingText}>
                      Beschikbaarheid laden…
                    </Text>
                  </View>
                ) : (
                  <>
                    <AppointmentCalendar
                      today={today}
                      selectedDate={selectedDate}
                      onSelectDate={(dateString) => setSelectedDate(dateString)}
                      bookedSlots={bookedSlots}
                      totalSlotsPerDay={TIME_SLOTS.length}
                    />

                    {selectedDate ? (
                      <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                          Beschikbare tijden
                        </Text>
                        {availableTimes.length === 0 ? (
                          <Text style={styles.emptyMessage}>
                            Alle tijdsloten zijn bezet op deze dag. Kies een
                            andere datum.
                          </Text>
                        ) : (
                          <View style={styles.timeGrid}>
                            {availableTimes.map((time) => {
                              const isSelected = selectedTime === time;
                              return (
                                <TouchableOpacity
                                  key={time}
                                  style={[
                                    styles.timeSlot,
                                    isSelected && styles.timeSlotSelected,
                                  ]}
                                  onPress={() => setSelectedTime(time)}
                                  accessibilityRole="button"
                                  accessibilityLabel={`Kies tijdstip ${time}`}
                                >
                                  <Text
                                    style={[
                                      styles.timeSlotText,
                                      isSelected && styles.timeSlotTextSelected,
                                    ]}
                                  >
                                    {time}
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        )}
                      </View>
                    ) : (
                      <Text style={styles.emptyMessage}>
                        Selecteer eerst een datum in de kalender om beschikbare
                        tijden te zien.
                      </Text>
                    )}

                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Voorkeurslocatie</Text>
                      <View style={styles.locationRow}>
                        <TouchableOpacity
                          style={[
                            styles.locationButton,
                            locationType === "office" &&
                              styles.locationButtonActive,
                          ]}
                          onPress={() => setLocationType("office")}
                        >
                          <Text
                            style={[
                              styles.locationButtonText,
                              locationType === "office" &&
                                styles.locationButtonTextActive,
                            ]}
                          >
                            WattsNext kantoor
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.locationButton,
                            locationType === "home" &&
                              styles.locationButtonActive,
                          ]}
                          onPress={() => setLocationType("home")}
                        >
                          <Text
                            style={[
                              styles.locationButtonText,
                              locationType === "home" &&
                                styles.locationButtonTextActive,
                            ]}
                          >
                            Afspraak thuis
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.locationInfo}>
                        {locationType === "home"
                          ? "Vul het adres in waar we mogen langskomen."
                          : `Het gesprek vindt plaats op ons kantoor: ${OFFICE_ADDRESS}.`}
                      </Text>
                      {locationType === "home" && (
                        <TextInput
                          style={styles.input}
                          placeholder="Straat, huisnummer, woonplaats"
                          placeholderTextColor="#999"
                          value={customAddress}
                          onChangeText={setCustomAddress}
                          autoCapitalize="words"
                        />
                      )}
                      {locationType === "office" && (
                        <Text style={styles.readonlyInput}>
                          {OFFICE_ADDRESS}
                        </Text>
                      )}
                    </View>

                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Jouw gegevens</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Voor- en achternaam"
                        placeholderTextColor="#999"
                        value={contactName}
                        onChangeText={setContactName}
                        autoCapitalize="words"
                      />
                      <Text style={styles.readonlyInput}>{userEmail}</Text>
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.submitButton,
                        !canSubmit && styles.submitButtonDisabled,
                      ]}
                      onPress={handleSubmitAppointment}
                      accessibilityRole="button"
                      accessibilityLabel="Bevestig afspraak"
                      disabled={!canSubmit}
                    >
                      <Text style={styles.submitButtonText}>
                        {submitting ? "Versturen…" : "Bevestig afspraak"}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ScreenBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "#f0f4f8",
  },
  backgroundWrapper: {
    flex: 1,
  },
  backgroundImage: {
    resizeMode: "cover",
  },
  safeArea: {
    flex: 1,
  },
  backTopLeft: {
    position: "absolute",
    top: 10,
    left: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#ffffffcc",
    borderRadius: 10,
    zIndex: 10,
  },
  backText: {
    color: "#1a73e8",
    fontSize: 16,
    fontWeight: "500",
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
    paddingBottom: 80,
    alignItems: "center",
    gap: 32,
  },
  content: {
    width: "100%",
    maxWidth: 900,
    alignItems: "center",
    gap: 24,
  },
  logo: {
    marginBottom: 12,
  },
  title: {
    fontWeight: "700",
    color: "#1f6f34",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  schedulerCard: {
    backgroundColor: "#ffffffee",
    borderRadius: 18,
    padding: 24,
    width: "100%",
    maxWidth: 900,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
    gap: 20,
  },
  schedulerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f6f34",
  },
  schedulerSubtitle: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
  },
  loadingWrapper: {
    alignItems: "center",
    gap: 12,
    paddingVertical: 20,
  },
  loadingText: {
    color: "#333",
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f6f34",
  },
  emptyMessage: {
    color: "#555",
    fontStyle: "italic",
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  timeSlot: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1f6f34",
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  timeSlotSelected: {
    backgroundColor: "#1f6f34",
  },
  timeSlotText: {
    color: "#1f6f34",
    fontWeight: "600",
  },
  timeSlotTextSelected: {
    color: "#fff",
  },
  locationRow: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
  },
  locationButton: {
    flexGrow: 1,
    borderWidth: 1,
    borderColor: "#f7941e",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  locationButtonActive: {
    backgroundColor: "#f7941e",
  },
  locationButtonText: {
    color: "#f7941e",
    fontWeight: "600",
    textAlign: "center",
  },
  locationButtonTextActive: {
    color: "#fff",
  },
  locationInfo: {
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#c7c7c7",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#fff",
    color: "#000",
  },
  readonlyInput: {
    marginTop: 8,
    color: "#555",
  },
  submitButton: {
    marginTop: 12,
    backgroundColor: "#1f6f34",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
