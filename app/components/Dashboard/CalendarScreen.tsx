import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, TextInput, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import RentaService from '../../services/Renta/RentaService';  // Ajusta la ruta según la ubicación real del archivo
import { Renta } from '../../services/Renta/typesR'; // Ajusta la ruta según la ubicación real del archivo
import NotificationModal from '../NotificationModal';  // Ajusta la ruta según la ubicación real del archivo

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarScreen: React.FC = () => {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [noOfDays, setNoOfDays] = useState<number[]>([]);
  const [blankDays, setBlankDays] = useState<number[]>([]);
  const [events, setEvents] = useState<Renta[]>([]);
  const [openEventModal, setOpenEventModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<Renta[]>([]);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showCreateEventForm, setShowCreateEventForm] = useState(false);
  const [clienteFK, setClienteFK] = useState('');
  const [carritoFK, setCarritoFK] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [total, setTotal] = useState('');
  const [estado, setEstado] = useState('En progreso');
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationType, setNotificationType] = useState<'help' | 'success' | 'warning' | 'error'>('success');

  useEffect(() => {
    fetchRentas();
    getNoOfDays();
  }, [month, year]);

  const fetchRentas = async () => {
    const rentas = await RentaService.obtenerRentas();
    if (rentas) {
      const formattedRentas = rentas.map((renta: Renta) => ({
        ...renta,
        horaInicio: new Date(renta.horaInicio),
        horaFinal: new Date(renta.horaFinal),
      }));
      setEvents(formattedRentas);
    }
  };

  const isToday = (date: number) => {
    const today = new Date();
    const d = new Date(year, month, date);
    return today.toDateString() === d.toDateString();
  };

  const showEventModal = (date: number) => {
    setSelectedDate(date);
    const selectedDayEvents = events.filter(e => {
      const eventDate = new Date(e.horaInicio);
      return (
        eventDate.getDate() === date &&
        eventDate.getMonth() === month &&
        eventDate.getFullYear() === year
      );
    });
    setSelectedEvents(selectedDayEvents);
    setShowOptionsModal(true);
  };

  const addEvent = async () => {
    if (!clienteFK || !carritoFK || !horaInicio || !total) {
      setNotificationType('warning');
      setNotificationVisible(true);
      return;
    }

    const startDateTime = new Date(year, month, selectedDate || 1, ...horaInicio.split(':').map(Number));
    const totalHours = parseFloat(total);
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(endDateTime.getHours() + totalHours);

    const newRenta: Renta = {
      rentaID: Math.random(),
      clienteFK: parseInt(clienteFK),
      carritoFK: parseInt(carritoFK),
      vendedorFK: 0,
      horaInicio: startDateTime,
      horaFinal: endDateTime,
      total: totalHours,
      estado: estado,
      clienteID: undefined,
      carritoID: '',
      status: '',
      event_title: undefined,
      event_theme: ''
    };

    const result = await RentaService.agregarRenta(newRenta);
    if (result) {
      setEvents([...events, newRenta]);
      setClienteFK('');
      setCarritoFK('');
      setHoraInicio('');
      setTotal('');
      setEstado('En progreso');
      setOpenEventModal(false);
      setShowCreateEventForm(false);
      setNotificationType('success');
      setNotificationVisible(true);
    } else {
      setNotificationType('error');
      setNotificationVisible(true);
    }
  };

  const getNoOfDays = () => {
    let daysInMonth = new Date(year, month + 1, 0).getDate();
    let dayOfWeek = new Date(year, month).getDay();
    let blankdaysArray = [];
    for (var i = 1; i <= dayOfWeek; i++) {
      blankdaysArray.push(i);
    }

    let daysArray = [];
    for (var i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }

    setBlankDays(blankdaysArray);
    setNoOfDays(daysArray);
  };

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const handlePrevYear = () => {
    setYear(year - 1);
  };

  const handleNextYear = () => {
    setYear(year + 1);
  };

  const getEventColor = (date: number) => {
    const event = events.find(e => {
      const eventDate = new Date(e.horaInicio);
      return (
        eventDate.getDate() === date &&
        eventDate.getMonth() === month &&
        eventDate.getFullYear() === year
      );
    });

    if (event) {
      switch (event.status?.trim()) {
        case 'En progreso':
          return { backgroundColor: 'rgba(0, 128, 0, 0.2)', color: 'green' };
        case 'Próximamente':
          return { backgroundColor: 'rgba(0, 0, 255, 0.2)', color: 'blue' };
        case 'Cancelado':
          return { backgroundColor: 'rgba(255, 0, 0, 0.2)', color: 'red' };
        case 'Retrasado':
          return { backgroundColor: 'rgba(255, 165, 0, 0.2)', color: 'orange' };
        default:
          return {};
      }
    }
    return {};
  };

  const getEventStyle = (event: Renta) => {
    switch (event.status?.trim()) {
      case 'En progreso':
        return styles.eventInProgress;
      case 'Próximamente':
        return styles.eventUpcoming;
      case 'Cancelado':
        return styles.eventCancelled;
      case 'Retrasado':
        return styles.eventDelayed;
      default:
        return {};
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.navigation}>
          <TouchableOpacity onPress={handlePrevYear} style={styles.navButton}>
            <Text style={styles.navButtonText}>{'<<'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
            <Text style={styles.navButtonText}>{'<'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.monthYearContainer}>
          <Text style={styles.monthText}>{MONTH_NAMES[month]}</Text>
          <Text style={styles.yearText}>{year}</Text>
        </View>
        <View style={styles.navigation}>
          <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
            <Text style={styles.navButtonText}>{'>'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNextYear} style={styles.navButton}>
            <Text style={styles.navButtonText}>{'>>'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.daysContainer}>
        {DAYS.map((day, index) => (
          <View key={index} style={styles.dayItem}>
            <Text style={styles.dayText}>{day}</Text>
          </View>
        ))}
      </View>

      <ScrollView style={styles.datesContainer}>
        <View style={styles.flexWrap}>
          {blankDays.map((blank, index) => (
            <View key={index} style={styles.blankDay}></View>
          ))}

          {noOfDays.map((date, index) => (
            <TouchableOpacity
              key={index}
              style={styles.dateItem}
              onPress={() => showEventModal(date)}
            >
              <View style={[styles.dateCircle, getEventColor(date)]}>
                <Text style={[styles.dateText, getEventColor(date)]}>{date}</Text>
              </View>
              {events
                .filter(event => new Date(event.horaInicio).getDate() === date && new Date(event.horaInicio).getMonth() === month && new Date(event.horaInicio).getFullYear() === year)
                .map((event, index) => (
                  <View key={index} style={[styles.eventItem, getEventStyle(event)]}>
                    <Text numberOfLines={1} style={styles.eventText}>
                      {event.carritoFK} - {event.status}
                    </Text>
                  </View>
                ))}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal visible={showOptionsModal} transparent={true} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowOptionsModal(false)}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select an option for {selectedDate} {MONTH_NAMES[month]} {year}</Text>
            <View style={styles.modalButtons}>
              <Button title="View Reservations" onPress={() => { setShowOptionsModal(false); setShowCreateEventForm(false); setOpenEventModal(true); }} />
              <Button title="Create Reservation" onPress={() => { setShowOptionsModal(false); setShowCreateEventForm(true); setOpenEventModal(true); }} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={openEventModal} transparent={true} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={() => { setOpenEventModal(false); setShowCreateEventForm(false); }}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
            {showCreateEventForm ? (
              <>
                <Text style={styles.modalTitle}>Create Reservation for {selectedDate} {MONTH_NAMES[month]} {year}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Cliente FK"
                  value={clienteFK}
                  onChangeText={setClienteFK}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Carrito FK"
                  value={carritoFK}
                  onChangeText={setCarritoFK}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Hora Inicio (HH:MM)"
                  value={horaInicio}
                  onChangeText={setHoraInicio}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Total Horas"
                  value={total}
                  onChangeText={setTotal}
                />
                <Picker
                  selectedValue={estado}
                  style={styles.picker}
                  onValueChange={(itemValue, itemIndex) => setEstado(itemValue)}
                >
                  <Picker.Item label="En progreso" value="En progreso" />
                  <Picker.Item label="Próximamente" value="Próximamente" />
                  <Picker.Item label="Cancelado" value="Cancelado" />
                  <Picker.Item label="Retrasado" value="Retrasado" />
                </Picker>
                <Button title="Save Event" onPress={addEvent} />
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>Reservations for {selectedDate} {MONTH_NAMES[month]} {year}</Text>
                <ScrollView>
                  {selectedEvents.length === 0 ? (
                    <View style={styles.noEvent}>
                      <Text>There are no events planned for {MONTH_NAMES[month]} {selectedDate}.</Text>
                    </View>
                  ) : (
                    selectedEvents.map((event, index) => (
                      <View key={index} style={styles.eventCard}>
                        <View style={[styles.eventStatus, { backgroundColor: event.status === 'En progreso' ? 'green' : event.status === 'Próximamente' ? 'blue' : event.status === 'Cancelado' ? 'red' : 'orange' }]} />
                        <Text style={styles.eventText}>Client: {event.clienteFK}</Text>
                        <Text style={styles.eventText}>Cart: {event.carritoFK}</Text>
                        <Text style={styles.eventText}>Start: {new Date(event.horaInicio).toLocaleTimeString()}</Text>
                        <Text style={styles.eventText}>End: {new Date(event.horaFinal).toLocaleTimeString()}</Text>
                        <Text style={styles.eventText}>Status: {event.status}</Text>
                      </View>
                    ))
                  )}
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>

      <NotificationModal
        visible={notificationVisible}
        onClose={() => setNotificationVisible(false)}
        type={notificationType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f3f4f6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
  },
  monthYearContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  yearText: {
    fontSize: 20,
    fontWeight: 'normal',
    color: '#4b5563',
    marginLeft: 4,
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navButton: {
    padding: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
  },
  navButtonText: {
    fontSize: 18,
    color: '#6b7280',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
  },
  dayItem: {
    width: '14.28%',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4b5563',
  },
  datesContainer: {
    flex: 1,
  },
  flexWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  blankDay: {
    width: '14.28%',
    height: 80,
    borderColor: '#e5e7eb',
    borderWidth: 1,
  },
  dateItem: {
    width: '14.28%',
    height: 80,
    borderColor: '#e5e7eb',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dateCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  today: {
    backgroundColor: '#3b82f6',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDate: {
    backgroundColor: '#3b82f6',
  },
  selectedDateText: {
    color: '#fff',
  },
  eventItem: {
    marginTop: 4,
    padding: 2,
    borderRadius: 4,
    backgroundColor: '#e2e8f0',
  },
  eventText: {
    fontSize: 12,
    color: '#1f2937',
  },
  eventInProgress: {
    backgroundColor: 'rgba(0, 128, 0, 0.2)',
  },
  eventUpcoming: {
    backgroundColor: 'rgba(0, 0, 255, 0.2)',
  },
  eventCancelled: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
  },
  eventDelayed: {
    backgroundColor: 'rgba(255, 165, 0, 0.2)',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    height: '70%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#1f2937',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1f2937',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
    color: '#1f2937',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  noEvent: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
  },
  eventCard: {
    padding: 4,
    borderRadius: 4,
    marginBottom: 4,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventStatus: {
    width: 8,
    height: '100%',
    borderRadius: 4,
  },
});

export default CalendarScreen;
