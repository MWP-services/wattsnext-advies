// screens/HomeScreen.js
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  useWindowDimensions,
  Platform,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
codex/add-interactive-appointment-calendar-to-homepage-cq2wdm

import { Calendar, LocaleConfig } from 'react-native-calendars';
codex/fix-runtime-error-for-compare-property
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

import { auth, db } from '../firebaseConfig';
import {
  isEmailConfigured,
  sendAppointmentEmails,
} from '../support/email';
codex/add-interactive-appointment-calendar-to-homepage-cq2wdm
import AppointmentCalendar from '../components/AppointmentCalendar';


LocaleConfig.locales.nl = {
  monthNames: [
    'januari',
    'februari',
    'maart',
    'april',
    'mei',
    'juni',
    'juli',
    'augustus',
    'september',
    'oktober',
    'november',
    'december',
  ],
  monthNamesShort: [
    'jan',
    'feb',
    'mrt',
    'apr',
    'mei',
    'jun',
    'jul',
    'aug',
    'sep',
    'okt',
    'nov',
    'dec',
  ],
  dayNames: [
    'zondag',
    'maandag',
    'dinsdag',
    'woensdag',
    'donderdag',
    'vrijdag',
    'zaterdag',
  ],
  dayNamesShort: ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'],
  today: 'Vandaag',
};
LocaleConfig.defaultLocale = 'nl';
codex/fix-runtime-error-for-compare-property

const TIME_SLOTS = (() => {
  const slots = [];
  for (let hour = 9; hour <= 17; hour += 1) {
    for (let minute = 0; minute < 60; minute += 30) {
      if (hour === 17 && minute > 0) {
        break;
      }
      slots.push(
        `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
      );
    }
  }
  return slots;
})();

const OFFICE_ADDRESS = 'Industrieweg 6, Stolwijk';

function formatDateLabel(dateString) {
  if (!dateString) {
    return '';
  }

  try {
    const formatter = new Intl.DateTimeFormat('nl-NL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return formatter.format(new Date(`${dateString}T12:00:00`));
  } catch (error) {
    return dateString;
  }
}

export default function HomeScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const today = useMemo(() => new Date(), []);
  const todayString = useMemo(() => today.toISOString().split('T')[0], [today]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [locationType, setLocationType] = useState('office');
  const [customAddress, setCustomAddress] = useState('');
  const [contactName, setContactName] = useState(auth.currentUser?.displayName || '');
  const [bookedSlots, setBookedSlots] = useState({});
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const userEmail = auth.currentUser?.email || '';

  useEffect(() => {
    const appointmentsRef = collection(db, 'appointments');
    const unsubscribe = onSnapshot(
      appointmentsRef,
      (snapshot) => {
        const nextSlots = {};

        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (!data?.date || !data?.time) {
            return;
          }

          if (!nextSlots[data.date]) {
            nextSlots[data.date] = new Set();
          }
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
        console.error('Fout bij het ophalen van afspraken', error);
        setBookedSlots({});
        setLoadingSlots(false);
      }
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    setSelectedTime('');
  }, [selectedDate]);

  const availableTimes = useMemo(() => {
    if (!selectedDate) {
      return [];
    }

    const bookedForDay = bookedSlots[selectedDate] || [];
    const now = new Date();

    return TIME_SLOTS.filter((slot) => {
      if (bookedForDay.includes(slot)) {
        return false;
      }

      if (selectedDate === todayString) {
        const [hour, minute] = slot.split(':').map(Number);
        const slotDate = new Date();
        slotDate.setHours(hour, minute, 0, 0);
        if (slotDate <= now) {
          return false;
        }
      }

      return true;
    });
  }, [bookedSlots, selectedDate, todayString]);

 codex/add-interactive-appointment-calendar-to-homepage-cq2wdm

  const markedDates = useMemo(() => {
    const marks = {};

    Object.entries(bookedSlots).forEach(([date, times]) => {
      const fullyBooked = times.length >= TIME_SLOTS.length;
      if (fullyBooked) {
        marks[date] = {
          disabled: true,
          disableTouchEvent: true,
          marked: true,
          dotColor: '#d9534f',
        };
      } else {
        marks[date] = {
          ...(marks[date] || {}),
          marked: true,
          dotColor: '#1f6f34',
        };
      }
    });

    if (selectedDate) {
      marks[selectedDate] = {
        ...(marks[selectedDate] || {}),
        selected: true,
        selectedColor: '#f7941e',
        selectedTextColor: '#fff',
      };
    }

    return marks;
  }, [bookedSlots, selectedDate]);

  const locationLabel = locationType === 'home' ? 'Thuis' : 'Bij WattsNext';
  const appointmentAddress =
    locationType === 'home' && customAddress.trim()
      ? customAddress.trim()
      : OFFICE_ADDRESS;

  const formattedDate = formatDateLabel(selectedDate);

  const canSubmit =
    Boolean(
      selectedDate &&
        selectedTime &&
        contactName.trim() &&
        userEmail &&
        (locationType === 'office' || customAddress.trim())
    ) && !submitting;

  const handleSubmitAppointment = async () => {
    if (!canSubmit) {
      return;
    }

    const trimmedName = contactName.trim();
    const trimmedAddress =
      locationType === 'home' ? customAddress.trim() : OFFICE_ADDRESS;

    if (locationType === 'home' && !trimmedAddress) {
      Alert.alert('Adres ontbreekt', 'Voer een adres in voor de afspraak thuis.');
      return;
    }

    const slotId = `${selectedDate}_${selectedTime.replace(':', '-')}`;
    const appointmentRef = doc(db, 'appointments', slotId);

    setSubmitting(true);

    try {
      const existing = await getDoc(appointmentRef);
      if (existing.exists()) {
        Alert.alert(
          'Tijdslot niet beschikbaar',
          'Dit tijdslot is zojuist geboekt. Kies een andere tijd.'
        );
        return;
      }

      await setDoc(appointmentRef, {
        date: selectedDate,
        time: selectedTime,
        location: locationType,
        address: trimmedAddress,
        contactName: trimmedName,
        contactEmail: userEmail,
        createdAt: serverTimestamp(),
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
        const message = isEmailConfigured()
          ? 'De afspraak is ingepland, maar het versturen van de bevestigingsmail is mislukt.'
          :
            'De afspraak is ingepland. Configureer de EXPO_PUBLIC_EMAILJS_* variabelen om automatische e-mails te versturen.';
        Alert.alert('Afspraak ingepland', message);
      } else {
        Alert.alert(
          'Afspraak ingepland',
          'Je ontvangt zo een bevestiging in de mail. WattsNext wordt ook op de hoogte gebracht.'
        );
      }

      setSelectedDate('');
      setSelectedTime('');
      setCustomAddress('');
      setLocationType('office');
    } catch (error) {
      console.error('Fout bij het plannen van een afspraak', error);
      Alert.alert(
        'Er ging iets mis',
        'Het is niet gelukt om de afspraak te plannen. Probeer het later opnieuw.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Achtergrondlaag */}
      <Image
        source={require('../assets/achtergrond.png')}
        style={styles.backgroundImage}
      />

      {/* Voorgrond: content */}
      <SafeAreaView style={styles.safeArea}>
        {/* Terugknop */}
        <TouchableOpacity
          onPress={() => navigation.replace('LoginScreen')}
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
            source={require('../assets/logo.png')}
            style={[
              styles.logo,
              {
                width: width > 768 ? 300 : 200,
                height: width > 768 ? 120 : 80,
              },
            ]}
            resizeMode="contain"
          />

          <Text style={[styles.title, { fontSize: width > 768 ? 36 : 24 }]}>
            WattsNext Advies
          </Text>

          {/* Start Advies */}
          <TouchableOpacity
            style={[styles.button, { width: width > 768 ? 300 : '80%' }]}
            onPress={() => navigation.navigate('Stap 1')}
            accessibilityRole="button"
            accessibilityLabel="Start Advies"
          >
            <Text style={[styles.buttonText, { fontSize: width > 768 ? 20 : 18 }]}>
              Start Advies
            </Text>
          </TouchableOpacity>

          {/* Spacing */}
          <View style={{ height: 16 }} />

          {/* NIEUW: Account beheren */}
          <TouchableOpacity
            style={[styles.secondaryButton, { width: width > 768 ? 300 : '80%' }]}
            onPress={() => navigation.navigate('AccountBeheren')}
            accessibilityRole="button"
            accessibilityLabel="Account beheren"
          >
            <Text style={[styles.secondaryButtonText, { fontSize: width > 768 ? 18 : 16 }]}>
              Account beheren
            </Text>
          </TouchableOpacity>

          <View style={{ height: 16 }} />

          <TouchableOpacity
            style={[styles.secondaryButton, { width: width > 768 ? 300 : '80%' }]}
            onPress={() => navigation.navigate('SavedAdvices')}
            accessibilityRole="button"
            accessibilityLabel="Bekijk opgeslagen adviezen"
          >
            <Text style={[styles.secondaryButtonText, { fontSize: width > 768 ? 18 : 16 }]}>Opgeslagen adviezen</Text>
          </TouchableOpacity>
          </View>

          <View
            style={[
              styles.schedulerCard,
              { width: width > 992 ? '70%' : '100%' },
            ]}
          >
            <Text style={styles.schedulerTitle}>Plan direct een afspraak</Text>
            <Text style={styles.schedulerSubtitle}>
              Kies een datum, selecteer een tijd tussen 09:00 en 17:00 en geef aan of we
              bij jou langskomen of dat je liever op kantoor afspreekt.
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
=======
                <Calendar
                  minDate={todayString}
                  markedDates={markedDates}
                  onDayPress={(day) => setSelectedDate(day.dateString)}
                  enableSwipeMonths
                  theme={{
                    todayTextColor: '#f7941e',
                    arrowColor: '#f7941e',
                    textDayFontFamily: Platform.select({
                      ios: 'System',
                      android: 'Roboto',
                      default: 'sans-serif',
                    }),
                    textMonthFontWeight: '600',
                    textDayHeaderFontWeight: '600',
                  }}

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
                        locationType === 'office' && styles.locationButtonActive,
                      ]}
                      onPress={() => setLocationType('office')}
                    >
                      <Text
                        style={[
                          styles.locationButtonText,
                          locationType === 'office' && styles.locationButtonTextActive,
                        ]}
                      >
                        WattsNext kantoor
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.locationButton,
                        locationType === 'home' && styles.locationButtonActive,
                      ]}
                      onPress={() => setLocationType('home')}
                    >
                      <Text
                        style={[
                          styles.locationButtonText,
                          locationType === 'home' && styles.locationButtonTextActive,
                        ]}
                      >
                        Afspraak thuis
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.locationInfo}>
                    {locationType === 'home'
                      ? 'Vul het adres in waar we mogen langskomen.'
                      : `Het gesprek vindt plaats op ons kantoor: ${OFFICE_ADDRESS}.`}
                  </Text>
                  {locationType === 'home' && (
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
                  <Text style={styles.readonlyInput}>E-mail: {userEmail || 'onbekend'}</Text>
                  {!userEmail && (
                    <Text style={styles.warningText}>
                      We konden geen e-mailadres vinden. Log opnieuw in om een afspraak te kunnen plannen.
                    </Text>
                  )}
                </View>

                <View style={styles.summaryCard}>
                  <Text style={styles.summaryTitle}>Overzicht afspraak</Text>
                  <Text style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Datum:</Text>{' '}
                    <Text style={styles.summaryValue}>
                      {formattedDate || 'Nog niet gekozen'}
                    </Text>
                  </Text>
                  <Text style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Tijd:</Text>{' '}
                    <Text style={styles.summaryValue}>
                      {selectedTime || 'Nog niet gekozen'}
                    </Text>
                  </Text>
                  <Text style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Locatie:</Text>{' '}
                    <Text style={styles.summaryValue}>{locationLabel}</Text>
                  </Text>
                  <Text style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Adres:</Text>{' '}
                    <Text style={styles.summaryValue}>{appointmentAddress}</Text>
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
                  onPress={handleSubmitAppointment}
                  disabled={!canSubmit}
                  accessibilityRole="button"
                  accessibilityLabel="Bevestig afspraak"
                >
                  {submitting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.submitButtonText}>Afspraak bevestigen</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    // Op web liever 'contain' om uitrekken te voorkomen, native 'cover' voor full-bleed
    resizeMode: Platform.OS === 'web' ? 'contain' : 'cover',
    zIndex: -1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 48,
    gap: 32,
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 1200,
    alignItems: 'center',
    gap: 16,
    paddingTop: 32,
  },
  logo: {
    marginBottom: 40,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#3eaf4f',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#f7941e',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#ffffffee',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f7941e',
  },
  secondaryButtonText: {
    color: '#f7941e',
    fontWeight: '600',
  },
  backTopLeft: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#ffffffcc',
    borderRadius: 10,
    zIndex: 10,
  },
  backText: {
    color: '#1a73e8',
    fontSize: 16,
    fontWeight: '500',
  },
  schedulerCard: {
    backgroundColor: '#ffffffee',
    borderRadius: 18,
    padding: 24,
    width: '100%',
    maxWidth: 900,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
    gap: 20,
  },
  schedulerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f6f34',
  },
  schedulerSubtitle: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  loadingWrapper: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 20,
  },
  loadingText: {
    color: '#333',
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f6f34',
  },
  emptyMessage: {
    color: '#555',
    fontStyle: 'italic',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeSlot: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1f6f34',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  timeSlotSelected: {
    backgroundColor: '#1f6f34',
  },
  timeSlotText: {
    color: '#1f6f34',
    fontWeight: '600',
  },
  timeSlotTextSelected: {
    color: '#fff',
  },
  locationRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  locationButton: {
    flexGrow: 1,
    borderWidth: 1,
    borderColor: '#f7941e',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  locationButtonActive: {
    backgroundColor: '#f7941e',
  },
  locationButtonText: {
    color: '#f7941e',
    fontWeight: '600',
    textAlign: 'center',
  },
  locationButtonTextActive: {
    color: '#fff',
  },
  locationInfo: {
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#c7c7c7',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#fff',
    color: '#000',
  },
  readonlyInput: {
    marginTop: 8,
    color: '#555',
  },
  warningText: {
    color: '#d9534f',
    marginTop: 6,
  },
  summaryCard: {
    backgroundColor: '#f7f9f8',
    borderRadius: 12,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#dfe7e3',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f6f34',
  },
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    color: '#333',
  },
  summaryLabel: {
    fontWeight: '600',
    color: '#1f6f34',
  },
  summaryValue: {
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#1f6f34',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#9fb7a6',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
