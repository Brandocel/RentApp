import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import RentaService from '../services/Renta/RentaService';
import ClienteService from '../services/Cliente/ClienteService';
import GolfService from '../services/GolfService';
import VendedorService from '../services/Vendedor/VendedorService';
import { Carrito } from '../services/CardRent/Car-interface';
import NotificationModal from './NotificationModal';

interface Props {
  carritos: Carrito[];
  visible: boolean;
  onClose: () => void;
  selectedDate: number | null;
}

const EventModal: React.FC<Props> = ({ visible, onClose, selectedDate }) => {
  const [clientes, setClientes] = useState<{ clienteID: string; nombre: string; }[]>([]);
  const [carritos, setCarritos] = useState<{ carritoID: string; nombre: string; }[]>([]);
  const [vendedores, setVendedores] = useState<{ vendedorID: string; nombre: string; }[]>([]);
  const [selectedCliente, setSelectedCliente] = useState('');
  const [selectedCarrito, setSelectedCarrito] = useState('');
  const [selectedVendedor, setSelectedVendedor] = useState('');
  const [total, setTotal] = useState('');
  const [status, setStatus] = useState('En progreso');
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationType, setNotificationType] = useState<'help' | 'success' | 'warning' | 'error'>('success');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [activeSection, setActiveSection] = useState<'reservations' | 'createClient' | 'createReservation'>('reservations');
  const [newClient, setNewClient] = useState({ nombre: '', email: '', telefono: '' });
  const [reservations, setReservations] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedDate !== null) {
      fetchReservationsForDate(selectedDate);
    }
  }, [selectedDate]);

  const fetchData = async () => {
    try {
      const fetchedClientes = await ClienteService.obtenerClientes();
      setClientes(fetchedClientes.result.map(cliente => ({
        clienteID: cliente.clienteID.toString(),
        nombre: cliente.nombre
      })));
    } catch (error) {
      console.error('Error fetching clients:', error);
      setClientes([]);
    }

    try {
      const fetchedCarritos = await GolfService.obtenerCarritos();
      if (Array.isArray(fetchedCarritos)) {
        setCarritos(fetchedCarritos.filter((carrito: { enrenta: boolean; }) => !carrito.enrenta).map((carrito: { carritoID: number; modelo: string; }) => ({
          carritoID: carrito.carritoID.toString(),
          nombre: carrito.modelo
        })));
      } else {
        console.error('Unexpected carritos format:', fetchedCarritos);
        setCarritos([]);
      }
    } catch (error) {
      console.error('Error fetching carts:', error);
      setCarritos([]);
    }

    try {
      const fetchedVendedores = await VendedorService.obtenerVendedores();
      setVendedores(fetchedVendedores.map((vendedor: { vendedorID: { toString: () => any; }; nombre: any; }) => ({
        vendedorID: vendedor.vendedorID.toString(),
        nombre: vendedor.nombre
      })));
    } catch (error) {
      console.error('Error fetching vendors:', error);
      setVendedores([]);
    }
  };

  const fetchReservationsForDate = async (date: number) => {
    try {
      const fetchedReservations = await RentaService.obtenerRentas();
      const filteredReservations = fetchedReservations.filter(reservation => {
        const reservationDate = new Date(reservation.horaInicio);
        return (
          reservationDate.getDate() === date &&
          reservationDate.getMonth() === new Date().getMonth() &&
          reservationDate.getFullYear() === new Date().getFullYear()
        );
      });
      setReservations(filteredReservations);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const handleCreateReservation = async () => {
    if (!selectedCliente || !selectedCarrito || !selectedVendedor || !total) {
      setNotificationType('error');
      setNotificationMessage('Por favor seleccione todos los campos.');
      setNotificationVisible(true);
      return;
    }

    const parsedTotal = parseFloat(total);
    if (isNaN(parsedTotal)) {
      setNotificationType('error');
      setNotificationMessage('El total debe ser un número válido.');
      setNotificationVisible(true);
      return;
    }

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + parsedTotal * 60 * 60 * 1000);

    const newReservation = {
      clienteFK: parseInt(selectedCliente),
      carritoFK: parseInt(selectedCarrito),
      vendedorFK: parseInt(selectedVendedor),
      status,
      horaInicio: startTime.toISOString(),
      horaFinal: endTime.toISOString(),
      total: parsedTotal
    };

    const result = await RentaService.agregarRenta(newReservation);
    if (result) {
      setNotificationType('success');
      setNotificationMessage('Renta creada exitosamente.');
      setNotificationVisible(true);
    } else {
      setNotificationType('error');
      setNotificationMessage('Error al crear la renta.');
      setNotificationVisible(true);
    }
  };

  const handleCreateClient = async () => {
    if (!newClient.nombre || !newClient.email || !newClient.telefono) {
      setNotificationType('error');
      setNotificationMessage('Por favor complete todos los campos.');
      setNotificationVisible(true);
      return;
    }

    try {
      const result = await ClienteService.crearCliente(newClient);
      if (result.succeeded) {
        setNotificationType('success');
        setNotificationMessage('Cliente creado exitosamente.');
        setNotificationVisible(true);
        fetchData();
        setActiveSection('reservations');
      } else {
        setNotificationType('error');
        setNotificationMessage('Error al crear el cliente.');
        setNotificationVisible(true);
      }
    } catch (error) {
      console.error('Error creating client:', error);
      setNotificationType('error');
      setNotificationMessage('Error al crear el cliente.');
      setNotificationVisible(true);
    }
  };

  const getStatusColor = (status: string) => {
    if (!status || status.trim() === "") {
      return '#808080'; // Gris
    }
    switch (status.trim()) {
      case 'En progreso':
        return '#FFD700'; // Amarillo
      case 'Completado':
        return '#4CAF50'; // Verde
      case 'Cancelado':
        return '#FF0000'; // Rojo
      case 'Próxima renta':
        return '#00BFFF'; // Azul
      default:
        return '#808080'; // Gris para cualquier otro valor no esperado
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Opciones</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.modalContent}>
          {activeSection === 'reservations' && (
            <View style={styles.cardsContainer}>
              <TouchableOpacity style={styles.card} onPress={() => setActiveSection('reservations')}>
                <View style={[styles.iconContainer, styles.bgPrimary]}>
                  <CalendarIcon style={styles.icon} />
                </View>
                <Text style={styles.cardTitle}>Ver reservaciones</Text>
                <Text style={styles.cardDescription}>Revisa todas las reservaciones realizadas por tus clientes.</Text>
                <Text style={styles.cardButton}>Ver reservaciones</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.card} onPress={() => setActiveSection('createClient')}>
                <View style={[styles.iconContainer, styles.bgSecondary]}>
                  <UserIcon style={styles.icon} />
                </View>
                <Text style={styles.cardTitle}>Crear cliente</Text>
                <Text style={styles.cardDescription}>Agrega nuevos clientes a tu sistema de reservaciones.</Text>
                <Text style={styles.cardButton}>Crear cliente</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.card} onPress={() => setActiveSection('createReservation')}>
                <View style={[styles.iconContainer, styles.bgAccent]}>
                  <ClipboardIcon style={styles.icon} />
                </View>
                <Text style={styles.cardTitle}>Crear renta</Text>
                <Text style={styles.cardDescription}>Registra nuevas rentas para tus clientes.</Text>
                <Text style={styles.cardButton}>Crear renta</Text>
              </TouchableOpacity>
            </View>
          )}

          {activeSection === 'createClient' && (
            <View style={styles.formContainer}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={newClient.nombre}
                onChangeText={(text: any) => setNewClient({ ...newClient, nombre: text })}
              />
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={newClient.email}
                onChangeText={(text) => setNewClient({ ...newClient, email: text })}
              />
              <Text style={styles.label}>Teléfono</Text>
              <TextInput
                style={styles.input}
                placeholder="Teléfono"
                value={newClient.telefono}
                onChangeText={(text) => setNewClient({ ...newClient, telefono: text })}
              />
              <TouchableOpacity onPress={handleCreateClient} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Crear Cliente</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setActiveSection('reservations')} style={styles.backButton}>
                <Text style={styles.backButtonText}>Regresar</Text>
              </TouchableOpacity>
            </View>
          )}

          {activeSection === 'createReservation' && (
            <View style={styles.formContainer}>
              <Text style={styles.description}>Fill out the details for your rental.</Text>
              <View style={styles.formRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Client</Text>
                  <Picker
                    selectedValue={selectedCliente}
                    onValueChange={(itemValue) => setSelectedCliente(itemValue)}
                    style={styles.picker}
                  >
                    {clientes.map(cliente => (
                      <Picker.Item key={cliente.clienteID} label={cliente.nombre} value={cliente.clienteID} />
                    ))}
                  </Picker>
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Cart</Text>
                  <Picker
                    selectedValue={selectedCarrito}
                    onValueChange={(itemValue) => setSelectedCarrito(itemValue)}
                    style={styles.picker}
                  >
                    {carritos.map(carrito => (
                      <Picker.Item key={carrito.carritoID} label={carrito.nombre} value={carrito.carritoID} />
                    ))}
                  </Picker>
                </View>
              </View>
              <View style={styles.formRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Seller</Text>
                  <Picker
                    selectedValue={selectedVendedor}
                    onValueChange={(itemValue) => setSelectedVendedor(itemValue)}
                    style={styles.picker}
                  >
                    {vendedores.map(vendedor => (
                      <Picker.Item key={vendedor.vendedorID} label={vendedor.nombre} value={vendedor.vendedorID} />
                    ))}
                  </Picker>
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Total Hours</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter total hours"
                    value={total}
                    onChangeText={setTotal}
                    keyboardType="numeric"
                  />
                </View>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Status</Text>
                <Picker
                  selectedValue={status}
                  onValueChange={(itemValue) => setStatus(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="En progreso" value="En progreso" />
                  <Picker.Item label="Completado" value="Completado" />
                  <Picker.Item label="Cancelado" value="Cancelado" />
                  <Picker.Item label="Próxima renta" value="Próxima renta" />
                </Picker>
              </View>
              <View style={styles.buttonRow}>
                <TouchableOpacity onPress={() => setActiveSection('reservations')} style={[styles.button, styles.cancelButton]}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCreateReservation} style={[styles.button, styles.submitButton]}>
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {activeSection === 'reservations' && (
            <View style={styles.reservationsContainer}>
              {reservations.length > 0 ? (
                reservations.map((reservation) => (
                  <View key={reservation.rentaID} style={[styles.reservationCard, { borderLeftColor: getStatusColor(reservation.status), borderLeftWidth: 5 }]}>
                    <Text style={styles.reservationTitle}>{reservation.cliente?.nombre}</Text>
                    <Text style={styles.reservationDetail}>Carrito: {reservation.carrito?.nombre}</Text>
                    <Text style={styles.reservationDetail}>Vendedor: {reservation.vendedor?.nombre}</Text>
                    <Text style={styles.reservationDetail}>Inicio: {reservation.horaInicio}</Text>
                    <Text style={styles.reservationDetail}>Fin: {reservation.horaFinal}</Text>
                    <Text style={styles.reservationDetail}>Estado: {reservation.status ? reservation.status.trim() : 'Sin estado'}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noReservationsText}>No hay reservaciones disponibles para este día.</Text>
              )}
            </View>
          )}
        </ScrollView>
        <NotificationModal
          visible={notificationVisible}
          onClose={() => setNotificationVisible(false)}
          type={notificationType}
          message={notificationMessage}
        />
      </View>
    </Modal>
  );
};

const CalendarIcon = (props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </svg>
);

const ClipboardIcon = (props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
  </svg>
);

const UserIcon = (props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    width: '100%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  card: {
    flex: 1,
    margin: 10,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  iconContainer: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgPrimary: {
    backgroundColor: '#2196f3',
  },
  bgSecondary: {
    backgroundColor: '#e91e63',
  },
  bgAccent: {
    backgroundColor: '#97dc47',
  },
  icon: {
    width: 24,
    height: 24,
    color: '#fff',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 14,
    marginBottom: 20,
    color: '#666',
  },
  cardButton: {
    fontSize: 14,
    color: '#2196f3',
    fontWeight: 'bold',
  },
  reservationsContainer: {
    marginTop: 20,
  },
  reservationCard: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginBottom: 10,
    borderLeftWidth: 5,
  },
  reservationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  reservationDetail: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
  noReservationsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  formContainer: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  submitButton: {
    backgroundColor: '#4caf50',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EventModal;
