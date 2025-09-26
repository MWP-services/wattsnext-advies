import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const MONTH_NAMES = [
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
];

const WEEKDAY_LABELS = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getMonthStart(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(base, amount) {
  return new Date(base.getFullYear(), base.getMonth() + amount, 1);
}

function normalizeDate(date) {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

export default function AppointmentCalendar({
  today,
  selectedDate,
  onSelectDate,
  bookedSlots,
  totalSlotsPerDay,
}) {
  const normalizedToday = useMemo(() => normalizeDate(today), [today]);
  const [visibleMonth, setVisibleMonth] = useState(() => getMonthStart(normalizedToday));

  const monthMatrix = useMemo(() => {
    const startOfMonth = getMonthStart(visibleMonth);
    const firstWeekday = (startOfMonth.getDay() + 6) % 7; // Monday as first day
    const calendarStart = new Date(startOfMonth);
    calendarStart.setDate(calendarStart.getDate() - firstWeekday);

    const weeks = [];
    const cursor = new Date(calendarStart);
    for (let weekIndex = 0; weekIndex < 6; weekIndex += 1) {
      const week = [];
      for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
        const cellDate = new Date(cursor);
        const dateKey = toDateKey(cellDate);
        const normalizedCellDate = normalizeDate(cellDate);
        const bookings = bookedSlots[dateKey] || [];
        const isCurrentMonth = cellDate.getMonth() === visibleMonth.getMonth();
        const isBeforeToday = normalizedCellDate < normalizedToday;
        const isFullyBooked = bookings.length >= totalSlotsPerDay;
        const isPartiallyBooked = !isFullyBooked && bookings.length > 0;

        week.push({
          dateKey,
          label: cellDate.getDate(),
          isCurrentMonth,
          isBeforeToday,
          isFullyBooked,
          isPartiallyBooked,
        });

        cursor.setDate(cursor.getDate() + 1);
      }
      weeks.push(week);
    }

    return weeks;
  }, [visibleMonth, bookedSlots, totalSlotsPerDay, normalizedToday]);

  const canGoPrev = useMemo(() => {
    const previousMonth = addMonths(visibleMonth, -1);
    return previousMonth >= new Date(normalizedToday.getFullYear(), normalizedToday.getMonth(), 1);
  }, [visibleMonth, normalizedToday]);

  const goToPrevMonth = () => {
    if (canGoPrev) {
      setVisibleMonth((current) => addMonths(current, -1));
    }
  };

  const goToNextMonth = () => {
    setVisibleMonth((current) => addMonths(current, 1));
  };

  const handleSelectDate = (cell) => {
    if (!cell.isCurrentMonth || cell.isBeforeToday || cell.isFullyBooked) {
      return;
    }

    onSelectDate(cell.dateKey);
  };

  return (
    <View style={styles.calendarContainer}>
      <View style={styles.calendarHeader}>
        <TouchableOpacity
          onPress={goToPrevMonth}
          disabled={!canGoPrev}
          style={[styles.navButton, !canGoPrev && styles.navButtonDisabled]}
          accessibilityRole="button"
          accessibilityLabel="Ga naar vorige maand"
        >
          <Text style={[styles.navButtonText, !canGoPrev && styles.navButtonTextDisabled]}>
            ‹
          </Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {MONTH_NAMES[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}
        </Text>
        <TouchableOpacity
          onPress={goToNextMonth}
          style={styles.navButton}
          accessibilityRole="button"
          accessibilityLabel="Ga naar volgende maand"
        >
          <Text style={styles.navButtonText}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.weekdayRow}>
        {WEEKDAY_LABELS.map((day) => (
          <Text key={day} style={styles.weekdayLabel}>
            {day}
          </Text>
        ))}
      </View>

      {monthMatrix.map((week, weekIndex) => (
        <View key={`week-${weekIndex}`} style={styles.weekRow}>
          {week.map((cell) => {
            const isSelected = selectedDate === cell.dateKey;
            const isToday = cell.dateKey === toDateKey(normalizedToday);
            const disabled = cell.isBeforeToday || cell.isFullyBooked || !cell.isCurrentMonth;
            const showAvailableDot =
              !disabled && !cell.isPartiallyBooked && !cell.isFullyBooked;

            return (
              <TouchableOpacity
                key={cell.dateKey}
                onPress={() => handleSelectDate(cell)}
                disabled={disabled}
                style={[styles.dayCell, !cell.isCurrentMonth && styles.dayCellMuted, isSelected && styles.dayCellSelected, isToday && !isSelected && styles.dayCellToday, disabled && styles.dayCellDisabled]}
                accessibilityRole="button"
                accessibilityLabel={`Kies ${cell.dateKey}`}
              >
                <Text
                  style={[
                    styles.dayLabel,
                    !cell.isCurrentMonth && styles.dayLabelMuted,
                    disabled && styles.dayLabelDisabled,
                    isSelected && styles.dayLabelSelected,
                  ]}
                >
                  {cell.label}
                </Text>
                {cell.isFullyBooked && <View style={[styles.dot, styles.dotBusy]} />}
                {cell.isPartiallyBooked && !cell.isFullyBooked && (
                  <View style={[styles.dot, styles.dotPartial]} />
                )}
                {showAvailableDot && <View style={[styles.dot, styles.dotAvailable]} />}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, styles.dotAvailable]} />
          <Text style={styles.legendText}>Beschikbaar</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, styles.dotPartial]} />
          <Text style={styles.legendText}>Gedeeltelijk vol</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, styles.dotBusy]} />
          <Text style={styles.legendText}>Vol</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  calendarContainer: {
    borderWidth: 1,
    borderColor: '#dfe7e3',
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#fff',
    gap: 12,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f6f34',
    textTransform: 'capitalize',
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f4f2',
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  navButtonText: {
    fontSize: 20,
    color: '#1f6f34',
    fontWeight: '600',
  },
  navButtonTextDisabled: {
    color: '#7a8b80',
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekdayLabel: {
    width: 36,
    textAlign: 'center',
    fontWeight: '600',
    color: '#7a8b80',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCell: {
    width: 36,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  dayCellMuted: {
    opacity: 0.4,
  },
  dayCellDisabled: {
    backgroundColor: '#f4f4f4',
  },
  dayCellSelected: {
    backgroundColor: '#f7941e',
  },
  dayCellToday: {
    borderWidth: 1,
    borderColor: '#f7941e',
  },
  dayLabel: {
    fontSize: 16,
    color: '#1f6f34',
    fontWeight: '600',
  },
  dayLabelMuted: {
    color: '#7a8b80',
  },
  dayLabelDisabled: {
    color: '#9ca7a1',
  },
  dayLabelSelected: {
    color: '#fff',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotAvailable: {
    backgroundColor: '#1f6f34',
  },
  dotPartial: {
    backgroundColor: '#f7b733',
  },
  dotBusy: {
    backgroundColor: '#d9534f',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendText: {
    color: '#55635b',
    fontSize: 12,
  },
});
