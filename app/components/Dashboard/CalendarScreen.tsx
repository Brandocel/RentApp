import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import RentaService from '../../services/Renta/RentaService';
import ClienteService from '../../services/Cliente/ClienteService';
import VendedorService from '../../services/Vendedor/VendedorService';
import GolfService from '../../services/GolfService';
import { Renta } from '../../services/Renta/typesR';
import { Cliente } from '../../services/Cliente/typesC';
import { Vendedor } from '../../services/Vendedor/typesV';
import EventModal from '../EventModal';

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface Carrito {
  carritoID: number;
  modelo: string;
  marca: string;
  precioHora: number;
  imgurl: string;
  enrenta: boolean;
}

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
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [carritos, setCarritos] = useState<Carrito[]>([]);

  useEffect(() => {
    fetchRentas();
    fetchClientes();
    fetchVendedores();
    fetchCarritos();
    getNoOfDays();
  }, [month, year]);

  const fetchRentas = async () => {
    try {
      const rentas = await RentaService.obtenerRentas();
      if (rentas) {
        const formattedRentas = rentas.map((renta: Renta) => ({
          ...renta,
          horaInicio: new Date(renta.horaInicio),
          horaFinal: new Date(renta.horaFinal),
        }));
        setEvents(formattedRentas);
      }
    } catch (error) {
      console.error('Error fetching rentals:', error);
    }
  };

  const fetchClientes = async () => {
    try {
      const response = await ClienteService.obtenerClientes();
      if (response.suceded) {
        setClientes(response.result);
      } else {
        console.error('Error fetching clients:', response.message);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchVendedores = async () => {
    try {
      const response = await VendedorService.obtenerVendedores();
      setVendedores(response.result);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  const fetchCarritos = async () => {
    try {
      const response = await GolfService.obtenerCarritos();
      const availableCarritos = response.filter((carrito: Carrito) => !carrito.enrenta);
      setCarritos(availableCarritos);
    } catch (error) {
      console.error('Error fetching carts:', error);
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

  const getEventColor = (status: string) => {
    switch (status) {
      case 'En progreso':
        return '#32CD32';
      case 'Completado':
        return '#1E90FF';
      case 'Cancelado':
        return '#FF4500';
      case 'Próxima renta':
        return '#FFD700';
      default:
        return '#e2e8f0';
    }
  };

  const renderEventItem = (event: Renta) => {
    const cliente = clientes.find(c => c.clienteID === parseInt(event.clienteFK));
    const carrito = carritos.find(c => c.carritoID === parseInt(event.carritoFK));

    return (
      <View key={event.rentaID} style={[styles.eventItem, { backgroundColor: getEventColor(event.status) }]}>
        <Text numberOfLines={1} style={styles.eventText}>
          {cliente ? cliente.nombre : 'Cliente desconocido'} - {carrito ? carrito.modelo : 'Modelo desconocido'}
        </Text>
      </View>
    );
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
              <View style={[styles.dateCircle, isToday(date) && styles.todayCircle]}>
                <Text style={styles.dateText}>{date}</Text>
              </View>
              <ScrollView style={styles.eventScroll}>
                {events
                  .filter(event => new Date(event.horaInicio).getDate() === date && new Date(event.horaInicio).getMonth() === month && new Date(event.horaInicio).getFullYear() === year)
                  .map((event, index) => (
                    renderEventItem(event)
                  ))}
              </ScrollView>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <EventModal
        visible={showOptionsModal}
        onClose={() => setShowOptionsModal(false)}
        onViewReservations={() => {}}
        onCreateClient={() => {}}
        selectedDate={selectedDate}
        carritos={carritos}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f3f4f6', //
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
    height: 100,
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
  todayCircle: {
    backgroundColor: '#FFD700', // Color para el día de hoy
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937', 
  },
  eventScroll: {
    maxHeight: 60,
    width: '100%',
  },
  eventItem: {
    marginTop: 4,
    padding: 4,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventText: {
    fontSize: 12,
    color: '#1f2937', 
  },
});

export default CalendarScreen;
