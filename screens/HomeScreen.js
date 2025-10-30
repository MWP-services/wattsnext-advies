import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  ScrollView,
  SafeAreaView,
} from "react-native";

import { getAuth } from "firebase/auth";

const auth = getAuth();

const OFFICE_ADDRESS = "WattsNext Kantoor, Voorbeeldstraat 1, 1234 AB";

export default function HomeScreen({ navigation }) {
  const { width } = useWindowDimensions();



  const today = useMemo(() => new Date(), []);

  // Helper: produce a local date key in YYYY-MM-DD format (uses local timezone)
  function toLocalDateKey(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

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
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.gridButton, styles.secondaryButton]}
                onPress={() => navigation.navigate("AccountBeheren")}
                accessibilityRole="button"
                accessibilityLabel="Account beheren"
              >
                <Text style={[styles.secondaryButtonText, { fontSize: width > 768 ? 18 : 16 }]}>Account beheren</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.gridButton, styles.secondaryButton]}
                onPress={() => navigation.navigate("SavedAdvices")}
                accessibilityRole="button"
                accessibilityLabel="Bekijk opgeslagen adviezen"
              >
                <Text style={[styles.secondaryButtonText, { fontSize: width > 768 ? 18 : 16 }]}>Opgeslagen adviezen</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.gridButton, styles.secondaryButton]}
                onPress={() => navigation.navigate("Agenda")}
                accessibilityRole="button"
                accessibilityLabel="Ga naar agenda"
              >
                <Text style={[styles.secondaryButtonText, { fontSize: width > 768 ? 18 : 16 }]}>Agenda</Text>
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
    flexGrow: 1,
    paddingTop: 40,
    paddingBottom: 60,
    alignItems: "center",
    gap: 32,
  },
  content: {
    width: "100%",
    maxWidth: 1200,
    alignItems: "center",
    gap: 32,
    paddingTop: 32,
  },
  logo: {
    marginBottom: 20,
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
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "#ffffffdd",
    borderWidth: 1,
    borderColor: "#1f6f34",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  secondaryButtonText: {
    color: "#1f6f34",
    fontWeight: "600",
    textAlign: "center",
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
});
