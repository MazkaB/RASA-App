import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
  TouchableOpacity, Alert, Dimensions, Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function GuideCalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [showTimeModal, setShowTimeModal] = useState(false);
  
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00'
  ];
  
  // Mock data for booked slots
  const bookedSlots = {
    '2025-01-19': ['09:00', '10:00', '11:00', '14:00', '15:00'],
    '2025-01-20': ['09:00', '10:00'],
    '2025-01-21': ['14:00', '15:00', '16:00'],
  };
  
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };
  
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };
  
  const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const isDateBooked = (day) => {
    if (!day) return false;
    const date = new Date(currentYear, currentMonth, day);
    const dateKey = formatDateKey(date);
    return bookedSlots[dateKey] && bookedSlots[dateKey].length > 0;
  };
  
  const handleDateSelect = (day) => {
    if (day) {
      const newDate = new Date(currentYear, currentMonth, day);
      setSelectedDate(newDate);
      setShowTimeModal(true);
    }
  };
  
  const handleTimeSlotToggle = (time) => {
    const dateKey = formatDateKey(selectedDate);
    const isBooked = bookedSlots[dateKey] && bookedSlots[dateKey].includes(time);
    
    if (isBooked) {
      Alert.alert('Unavailable', 'This time slot is already booked');
      return;
    }
    
    setSelectedTimeSlots(prev => {
      if (prev.includes(time)) {
        return prev.filter(t => t !== time);
      } else {
        return [...prev, time];
      }
    });
  };
  
  const handleSaveAvailability = () => {
    if (selectedTimeSlots.length === 0) {
      Alert.alert('No Selection', 'Please select at least one time slot');
      return;
    }
    
    Alert.alert(
      'Save Availability',
      `Set ${selectedTimeSlots.length} time slots as available for ${formatDateKey(selectedDate)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: () => {
            Alert.alert('Success', 'Availability saved successfully');
            setShowTimeModal(false);
            setSelectedTimeSlots([]);
          }
        }
      ]
    );
  };
  
  const navigateMonth = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Calendar</Text>
        <TouchableOpacity style={styles.todayButton}>
          <Text style={styles.todayButtonText}>Today</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Month Navigation */}
        <View style={styles.monthNavigation}>
          <TouchableOpacity onPress={() => navigateMonth(-1)}>
            <Ionicons name="chevron-back" size={24} color="#2E7D32" />
          </TouchableOpacity>
          <Text style={styles.monthTitle}>
            {monthNames[currentMonth]} {currentYear}
          </Text>
          <TouchableOpacity onPress={() => navigateMonth(1)}>
            <Ionicons name="chevron-forward" size={24} color="#2E7D32" />
          </TouchableOpacity>
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarContainer}>
          <View style={styles.weekDays}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <Text key={day} style={styles.weekDayText}>{day}</Text>
            ))}
          </View>
          
          <View style={styles.calendarGrid}>
            {generateCalendarDays().map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.calendarDay,
                  day && styles.activeDay,
                  isDateBooked(day) && styles.bookedDay,
                  day === selectedDate.getDate() && styles.selectedDay,
                ]}
                onPress={() => handleDateSelect(day)}
                disabled={!day}
              >
                {day && (
                  <>
                    <Text style={[
                      styles.dayText,
                      isDateBooked(day) && styles.bookedDayText,
                      day === selectedDate.getDate() && styles.selectedDayText,
                    ]}>
                      {day}
                    </Text>
                    {isDateBooked(day) && (
                      <View style={styles.bookingIndicator} />
                    )}
                  </>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#2E7D32' }]} />
            <Text style={styles.legendText}>Available</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FF6B35' }]} />
            <Text style={styles.legendText}>Booked</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#9aa0a6' }]} />
            <Text style={styles.legendText}>Unavailable</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>This Month's Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Total Bookings</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>8</Text>
              <Text style={styles.statLabel}>Available Days</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>85%</Text>
              <Text style={styles.statLabel}>Occupancy Rate</Text>
            </View>
          </View>
        </View>

        {/* Upcoming Bookings */}
        <View style={styles.upcomingSection}>
          <Text style={styles.sectionTitle}>Upcoming Bookings</Text>
          <View style={styles.upcomingCard}>
            <View style={styles.upcomingDate}>
              <Text style={styles.upcomingDay}>19</Text>
              <Text style={styles.upcomingMonth}>JAN</Text>
            </View>
            <View style={styles.upcomingInfo}>
              <Text style={styles.upcomingTitle}>John Smith</Text>
              <Text style={styles.upcomingTime}>09:00 - 13:00 • Borobudur Temple</Text>
            </View>
          </View>
          <View style={styles.upcomingCard}>
            <View style={styles.upcomingDate}>
              <Text style={styles.upcomingDay}>19</Text>
              <Text style={styles.upcomingMonth}>JAN</Text>
            </View>
            <View style={styles.upcomingInfo}>
              <Text style={styles.upcomingTitle}>Sarah Johnson</Text>
              <Text style={styles.upcomingTime}>14:00 - 18:00 • Prambanan Temple</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Time Slot Selection Modal */}
      <Modal
        visible={showTimeModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowTimeModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowTimeModal(false)}>
              <Ionicons name="close" size={24} color="#5f6368" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              Set Availability for {formatDateKey(selectedDate)}
            </Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalSectionTitle}>Select Available Time Slots</Text>
            <View style={styles.timeSlotGrid}>
              {timeSlots.map((time) => {
                const dateKey = formatDateKey(selectedDate);
                const isBooked = bookedSlots[dateKey] && bookedSlots[dateKey].includes(time);
                const isSelected = selectedTimeSlots.includes(time);
                
                return (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeSlot,
                      isBooked && styles.bookedTimeSlot,
                      isSelected && styles.selectedTimeSlot,
                    ]}
                    onPress={() => handleTimeSlotToggle(time)}
                    disabled={isBooked}
                  >
                    <Text style={[
                      styles.timeSlotText,
                      isBooked && styles.bookedTimeSlotText,
                      isSelected && styles.selectedTimeSlotText,
                    ]}>
                      {time}
                    </Text>
                    {isBooked && (
                      <Text style={styles.bookedLabel}>Booked</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.selectAllButton}
                onPress={() => {
                  const dateKey = formatDateKey(selectedDate);
                  const availableSlots = timeSlots.filter(time => 
                    !bookedSlots[dateKey] || !bookedSlots[dateKey].includes(time)
                  );
                  setSelectedTimeSlots(availableSlots);
                }}
              >
                <Text style={styles.selectAllText}>Select All Available</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setSelectedTimeSlots([])}
              >
                <Text style={styles.clearText}>Clear Selection</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.saveButton, selectedTimeSlots.length === 0 && styles.disabledButton]}
              onPress={handleSaveAvailability}
              disabled={selectedTimeSlots.length === 0}
            >
              <Text style={styles.saveButtonText}>
                Save Availability ({selectedTimeSlots.length} slots)
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e8eaed',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#202124',
  },
  todayButton: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  todayButtonText: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
  },
  calendarContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#5f6368',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: (width - 72) / 7,
    height: (width - 72) / 7,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  activeDay: {
    backgroundColor: '#f8f9fa',
  },
  bookedDay: {
    backgroundColor: '#FFF3E0',
  },
  selectedDay: {
    backgroundColor: '#2E7D32',
  },
  dayText: {
    fontSize: 14,
    color: '#202124',
  },
  bookedDayText: {
    color: '#FF6B35',
    fontWeight: '600',
  },
  selectedDayText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  bookingIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FF6B35',
    marginTop: 2,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#5f6368',
  },
  statsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#5f6368',
    textAlign: 'center',
  },
  upcomingSection: {
    padding: 20,
  },
  upcomingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  upcomingDate: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginRight: 16,
  },
  upcomingDay: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2E7D32',
  },
  upcomingMonth: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
  },
  upcomingInfo: {
    flex: 1,
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 4,
  },
  upcomingTime: {
    fontSize: 14,
    color: '#5f6368',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e8eaed',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
    flex: 1,
    textAlign: 'center',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 16,
  },
  timeSlotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeSlot: {
    width: (width - 64) / 4,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  bookedTimeSlot: {
    backgroundColor: '#ffebee',
    borderColor: '#ffcdd2',
  },
  selectedTimeSlot: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#202124',
  },
  bookedTimeSlotText: {
    color: '#d32f2f',
  },
  selectedTimeSlotText: {
    color: '#ffffff',
  },
  bookedLabel: {
    fontSize: 10,
    color: '#d32f2f',
    marginTop: 2,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  selectAllButton: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectAllText: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#f1f3f4',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearText: {
    color: '#5f6368',
    fontWeight: '600',
  },
  modalFooter: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e8eaed',
  },
  saveButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#9aa0a6',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});