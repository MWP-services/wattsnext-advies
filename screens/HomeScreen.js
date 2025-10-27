
import React from "react";


// screens/HomeScreen.js
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useMemo, useRef, useState } from "react";


import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  ScrollView,
} from "react-native";


export default function HomeScreen({ navigation }) {
  const { width } = useWindowDimensions();



  const today = useMemo(() => new Date(), []);
  const todayString = useMemo(() => toLocalDateKey(today), [today]);

  const scrollViewRef = useRef(null);
  const schedulerPositionRef = useRef(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [locationType, setLocationType] = useState("office");
  const [customAddress, setCustomAddress] = useState("");
  const [contactName, setContactName] = useState(
    auth.currentUser?.displayName || ""
  );

  const [bookedSlots, setBookedSlots] = useState({});
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const userEmail = auth.currentUser?.email || "";

  // Realtime beschikbaarheid inladen
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
          Object.entries(nextSlots).map(([date, value]) => [
            date,
            Array.from(value).sort(),
          ])
        );

        setBookedSlots(formatted);
        setLoadingSlots(false);
      },
      (error) => {
        console.error("Fout bij het ophalen van afspraken", error);
        setBookedSlots({});
        setLoadingSlots(false);
      }
    );

    return unsubscribe;
  }, []);

  // reset tijd bij datumwissel
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
        (locationType === "office" || customAddress.trim())
    ) && !submitting;

  const handleSubmitAppointment = async () => {
    if (!canSubmit) return;

    const trimmedName = contactName.trim();
    const trimmedAddress =
      locationType === "home" ? customAddress.trim() : OFFICE_ADDRESS;

    if (locationType === "home" && !trimmedAddress) {
      Alert.alert("Adres ontbreekt", "Voer een adres in voor de afspraak thuis.");
      return;
    }

    const slotId = `${selectedDate}_${selectedTime.replace(":", "-")}`;
    const appointmentRef = doc(db, "appointments", slotId);

    setSubmitting(true);
    try {
      // Atomisch reserveren via transactie
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(appointmentRef);
        if (snap.exists()) {
          throw new Error("slot-taken");
        }
        tx.set(appointmentRef, {
          date: selectedDate,
          time: selectedTime,
          location: locationType,
          address: trimmedAddress,
          contactName: trimmedName,
          contactEmail: userEmail,
          createdAt: serverTimestamp(),
        });
      });

      // E-mails buiten de transactie
    const emailResult = await sendAppointmentEmails({
  clientEmail: userEmail,
  clientName: trimmedName,
  formattedDate,
  time: selectedTime,
  locationLabel,
  address: trimmedAddress,
});

if (!emailResult.success) {
  const firstErr = emailResult.results.find(r => !r.ok)?.error || 'onbekende fout';
  console.log('EmailJS failure', emailResult);
  Alert.alert(
    "Afspraak ingepland",
    isEmailConfigured()
      ? `Bevestigingsmail verzenden mislukt:\n${firstErr}`
      : "De afspraak is ingepland. Configureer de EXPO_PUBLIC_EMAILJS_* variabelen om automatische e-mails te versturen."
  );
} else {
  Alert.alert(
    "Afspraak ingepland",
    "Je ontvangt zo een bevestiging in de mail. WattsNext wordt ook op de hoogte gebracht."
  );
}

      // Form reset
      setSelectedDate("");
      setSelectedTime("");
      setCustomAddress("");
      setLocationType("office");
    } catch (error) {
      if (error?.message === "slot-taken") {
        Alert.alert(
          "Tijdslot niet beschikbaar",
          "Dit tijdslot is zojuist geboekt. Kies een andere tijd."
        );
      } else {
        console.error("Fout bij het plannen van een afspraak", error);
        Alert.alert(
          "Er ging iets mis",
          "Het is niet gelukt om de afspraak te plannen. Probeer het later opnieuw."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };



  const handleScrollToAgenda = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: Math.max(schedulerPositionRef.current - 16, 0),
        animated: true,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/achtergrond.png")} style={styles.backgroundImage} />

      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity
          onPress={() => navigation.replace("LoginScreen")}
          style={styles.backTopLeft}
          accessibilityRole="button"
          accessibilityLabel="Terug naar log-in"
        >
          <Text style={styles.backText}>← Terug naar log-in</Text>
        </TouchableOpacity>

        <ScrollView
          ref={scrollViewRef}
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
                  width: width > 768 ? 300 : 200,
                  height: width > 768 ? 120 : 80,
                },
              ]}
              resizeMode="contain"
            />

            <Text style={[styles.title, { fontSize: width > 768 ? 36 : 24 }]}>WattsNext Advies</Text>

            <View style={styles.buttonGrid}>
              <TouchableOpacity
                style={[styles.gridButton, styles.button]}
                onPress={() => navigation.navigate("Stap 1")}
                accessibilityRole="button"
                accessibilityLabel="Start Advies"
              >

                <Text style={[styles.buttonText, { fontSize: width > 768 ? 20 : 18 }]}>Start Advies</Text>

                <Text
                  style={[styles.buttonText, { fontSize: width > 768 ? 20 : 18 }]}
                >
                  Start Advies
                </Text>

              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.gridButton, styles.secondaryButton]}
                onPress={() => navigation.navigate("AccountBeheren")}
                accessibilityRole="button"
                accessibilityLabel="Account beheren"

              >
                <Text
                  style={[styles.secondaryButtonText, { fontSize: width > 768 ? 18 : 16 }]}


              >
                <Text
                  style={[styles.secondaryButtonText, { fontSize: width > 768 ? 18 : 16 }]}
                >
                  Account beheren

              >
                <Text
                  style={[
                    styles.secondaryButtonText,
                    { fontSize: width > 768 ? 18 : 16 },
                  ]}
                >
                  Account beheren
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.gridButton, styles.secondaryButton]}
                onPress={() => navigation.navigate("SavedAdvices")}
                accessibilityRole="button"
                accessibilityLabel="Bekijk opgeslagen adviezen"
              >
                <Text
                  style={[
                    styles.secondaryButtonText,
                    { fontSize: width > 768 ? 18 : 16 },
                  ]}
                >
                  Opgeslagen adviezen

                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.gridButton, styles.secondaryButton]}

                onPress={() => navigation.navigate("SavedAdvices")}
                accessibilityRole="button"
                accessibilityLabel="Bekijk opgeslagen adviezen"
              >
                <Text
                  style={[styles.secondaryButtonText, { fontSize: width > 768 ? 18 : 16 }]}
                >
                  Opgeslagen adviezen
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.gridButton, styles.secondaryButton]}
                onPress={() => navigation.navigate("Agenda")}
                accessibilityRole="button"
                accessibilityLabel="Ga naar agenda"
              >
                <Text
                  style={[styles.secondaryButtonText, { fontSize: width > 768 ? 18 : 16 }]}

                onPress={handleScrollToAgenda}
                accessibilityRole="button"
                accessibilityLabel="Ga naar agenda"
              >                <Text style={[styles.secondaryButtonText, { fontSize: width > 768 ? 18 : 16 }]}>
                  Agenda
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={[styles.schedulerCard, { width: width > 992 ? "70%" : "100%" }]}
            onLayout={(event) => {
              schedulerPositionRef.current = event.nativeEvent.layout.y;
            }}
          >
            <Text style={styles.schedulerTitle}>Plan direct een afspraak</Text>
            <Text style={styles.schedulerSubtitle}>
              Kies een datum, selecteer een tijd tussen 09:00 en 17:00 en geef
              aan of we bij jou langskomen of dat je liever op kantoor afspreekt.
            </Text>

            {loadingSlots ? (
              <View style={styles.loadingWrapper}>
                <ActivityIndicator size="large" color="#f7941e" />
                <Text style={styles.loadingText}>Beschikbaarheid laden…</Text>
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
                    <Text style={styles.sectionTitle}>Beschikbare tijden</Text>
                    {availableTimes.length === 0 ? (
                      <Text style={styles.emptyMessage}>
                        Alle tijdsloten zijn bezet op deze dag. Kies een andere datum.
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
                    Selecteer eerst een datum in de kalender om beschikbare tijden te zien.
                  </Text>
                )}

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Voorkeurslocatie</Text>
                  <View style={styles.locationRow}>
                    <TouchableOpacity
                      style={[
                        styles.locationButton,
                        locationType === "office" && styles.locationButtonActive,
                      ]}
                      onPress={() => setLocationType("office")}
                    >
                      <Text
                        style={[
                          styles.locationButtonText,
                          locationType === "office" && styles.locationButtonTextActive,
                        ]}
                      >
                        WattsNext kantoor
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.locationButton,
                        locationType === "home" && styles.locationButtonActive,
                      ]}
                      onPress={() => setLocationType("home")}
                    >
                      <Text
                        style={[
                          styles.locationButtonText,
                          locationType === "home" && styles.locationButtonTextActive,
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
                      value={customAddress}
                      onChangeText={setCustomAddress}
                      placeholderTextColor="#666"
                      accessibilityLabel="Adres voor afspraak"
                    />
                  )}
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Contactgegevens</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Naam"
                    value={contactName}
                    onChangeText={setContactName}
                    placeholderTextColor="#666"
                    accessibilityLabel="Naam contactpersoon"
                  />
                  <Text style={styles.readonlyInput}>
                    E-mail: {userEmail || "onbekend"}
                  </Text>
                  {!userEmail && (
                    <Text style={styles.warningText}>
                      We konden geen e-mailadres vinden. Log opnieuw in om een afspraak
                      te kunnen plannen.
                    </Text>
                  )}
                </View>

                <View style={styles.summaryCard}>
                  <Text style={styles.summaryTitle}>Overzicht afspraak</Text>
                  <Text style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Datum:</Text>{" "}
                    <Text style={styles.summaryValue}>
                      {formattedDate || "Nog niet gekozen"}
                    </Text>
                  </Text>
                  <Text style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Tijd:</Text>{" "}
                    <Text style={styles.summaryValue}>
                      {selectedTime || "Nog niet gekozen"}
                    </Text>
                  </Text>
                  <Text style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Locatie:</Text>{" "}
                    <Text style={styles.summaryValue}>{locationLabel}</Text>
                  </Text>
                  <Text style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Adres:</Text>{" "}
                    <Text style={styles.summaryValue}>{appointmentAddress}</Text>
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    !canSubmit && styles.submitButtonDisabled,
                  ]}
                  onPress={handleSubmitAppointment}
                  disabled={!canSubmit}
                  accessibilityRole="button"
                  accessibilityLabel="Bevestig afspraak"
                  
                >
                  Agenda
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    resizeMode: "cover",
  },
  safeArea: {
    flex: 1,
  },


  scrollContent: {
    paddingBottom: 48,
    gap: 32,
    alignItems: "center",
  },
  content: {
    width: "100%",
    maxWidth: 1200,
    alignItems: "center",
    gap: 16,
    paddingTop: 32,
  },
  logo: {
    marginBottom: 40,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 20,
    color: "#3eaf4f",
    textAlign: "center",
  },
  buttonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 12,
  },
  gridButton: {
    width: "45%",
    minWidth: 140,
    maxWidth: 240,
    marginHorizontal: 8,
    marginVertical: 8,
    justifyContent: "center",
    alignSelf: "center",
  },
  button: {
    backgroundColor: "#f7941e",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#ffffffee",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f7941e",
  },
  secondaryButtonText: {
    color: "#f7941e",
    fontWeight: "600",
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
    paddingTop: 40,
    paddingBottom: 60,
    alignItems: "center",
    gap: 32,
  },
  content: {
    width: "100%",
    maxWidth: 900,
    alignItems: "center",
    gap: 32,
  },
  logo: {
    marginBottom: 12,
  },
  title: {
    fontWeight: "700",
    color: "#1f6f34",
    textAlign: "center",
  },
  buttonGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "center",
  },
  gridButton: {
    flexBasis: "45%",
    minWidth: 160,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#1f6f34",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "#ffffffdd",
    borderWidth: 1,
    borderColor: "#1f6f34",
  },
  secondaryButtonText: {
    color: "#1f6f34",
    fontWeight: "600",
    textAlign: "center",
  },
});
