import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image, ScrollView, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import RentaService from '../services/Renta/RentaService';
import ClienteService from '../services/Cliente/ClienteService';
import GolfService from '../services/GolfService';
import VendedorService from '../services/Vendedor/VendedorService';
import { Carrito } from '../services/CardRent/Car-interface';
import NotificationModal from './NotificationModal'; // Importa el modal de notificaciones

interface Props {
  carritos: Carrito[];
  visible: boolean;
  onCreateClient : () => void;
  onClose: () => void;
  onViewReservations: () => void;
  selectedDate: number | null;
}

const EventModal: React.FC<Props> = ({ visible, onClose, onViewReservations, selectedDate }) => {
  const [clientes, setClientes] = useState<{ clienteID: string; nombre: string; }[]>([]);
  const [carritos, setCarritos] = useState<{ carritoID: string; nombre: string; }[]>([]);
  const [vendedores, setVendedores] = useState<{ vendedorID: string; nombre: string; }[]>([]);
  const [selectedCliente, setSelectedCliente] = useState('');
  const [selectedCarrito, setSelectedCarrito] = useState('');
  const [selectedVendedor, setSelectedVendedor] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFinal, setHoraFinal] = useState('');
  const [total, setTotal] = useState('');
  const [status, setStatus] = useState('En progreso');
  const [activeSection, setActiveSection] = useState<'reservations' | 'createClient' | 'createReservation'>('reservations');
  const [newClient, setNewClient] = useState({ nombre: '', email: '', telefono: '' });
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationType, setNotificationType] = useState<'help' | 'success' | 'warning' | 'error'>('success');
  
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const today = new Date();
      const month = today.getMonth();
      const selectedDay = new Date(new Date().getFullYear(), month, selectedDate);
      setHoraInicio(new Date(selectedDay.setHours(today.getHours(), today.getMinutes(), today.getSeconds())).toISOString());
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

  const handleCreateReservation = async () => {
    if (!selectedCliente || !selectedCarrito || !selectedVendedor || !total) {
      alert('Por favor seleccione todos los campos.');
      return;
    }

    const parsedTotal = parseFloat(total);
    if (isNaN(parsedTotal)) {
      alert('El total debe ser un número válido.');
      return;
    }

    const finalTime = new Date(new Date(horaInicio).getTime() + parsedTotal * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString();

    const newReservation = {
      clienteFK: parseInt(selectedCliente),
      carritoFK: parseInt(selectedCarrito),
      vendedorFK: parseInt(selectedVendedor),
      status,
      horaInicio,
      horaFinal: finalTime,
      total: parsedTotal
    };
    console.log('Datos enviados:', newReservation);
    const result = await RentaService.agregarRenta(newReservation);
    if (result) {
      setNotificationType('success');
      setNotificationVisible(true);
      onClose();
    } else {
      setNotificationType('error');
      setNotificationVisible(true);
    }
  };

  const handleCreateClient = async () => {
    if (!newClient.nombre || !newClient.email || !newClient.telefono) {
      alert('Por favor complete todos los campos.');
      return;
    }

    try {
      const result = await ClienteService.crearCliente(newClient);
      if (result.succeeded) {
        setNotificationType('success');
        setNotificationVisible(true);
        fetchData();
        setActiveSection('reservations');
      } else {
        setNotificationType('error');
        setNotificationVisible(true);
      }
    } catch (error) {
      console.error('Error creating client:', error);
      setNotificationType('success');
      setNotificationVisible(true);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <ScrollView contentContainerStyle={styles.modalContent}>
          {activeSection === 'reservations' && (
            <View style={styles.cardsContainer}>
              <View style={styles.cardColumn}>
                <View style={styles.cardDetails}>
                  <View style={styles.cardIcons}>
                    <Image source={{ uri: 'https://imgpanda.com/upload/ib/1yIWjyG41o.png' }} style={styles.iconImage} />
                  </View>
                  <Text style={styles.cardTitle}>Ver Reservaciones</Text>
                  <Text style={styles.cardDescription}>Lorem ipsum dolor sit amet, consectne auctor aliquet. Aenean sollicitudi bibendum auctor.</Text>
                  <TouchableOpacity onPress={onViewReservations} style={styles.readMoreBtn}>
                    <Text style={styles.readMoreBtnText}>Ver</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.cardColumn}>
                <View style={styles.cardDetails}>
                  <View style={styles.cardIcons}>
                    <Image source={{ uri: 'https://imgpanda.com/upload/ib/Q4tSh2ctkH.png' }} style={styles.iconImage} />
                  </View>
                  <Text style={styles.cardTitle}>Crear Cliente</Text>
                  <Text style={styles.cardDescription}>Lorem ipsum dolor sit amet, consectne auctor aliquet. Aenean sollicitudi bibendum auctor.</Text>
                  <TouchableOpacity onPress={() => setActiveSection('createClient')} style={styles.readMoreBtn}>
                    <Text style={styles.readMoreBtnText}>Crear</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.cardColumn}>
                <View style={styles.cardDetails}>
                  <View style={styles.cardIcons}>
                    <Image source={{ uri: 'https://imgpanda.com/upload/ib/YQdOwN6IDJ.png' }} style={styles.iconImage} />
                  </View>
                  <Text style={styles.cardTitle}>Crear Reservación</Text>
                  <Text style={styles.cardDescription}>Lorem ipsum dolor sit amet, consectne auctor aliquet. Aenean sollicitudi bibendum auctor.</Text>
                  <TouchableOpacity onPress={() => setActiveSection('createReservation')} style={styles.readMoreBtn}>
                    <Text style={styles.readMoreBtnText}>Crear</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {activeSection === 'createClient' && (
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Crear Cliente</Text>
              <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={newClient.nombre}
                onChangeText={(text) => setNewClient({ ...newClient, nombre: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={newClient.email}
                onChangeText={(text) => setNewClient({ ...newClient, email: text })}
              />
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
              <Text style={styles.formTitle}>Crear Reservación</Text>
              <Text style={styles.label}>Cliente</Text>
              <Picker
                selectedValue={selectedCliente}
                onValueChange={(itemValue) => setSelectedCliente(itemValue)}
                style={styles.picker}
              >
                {clientes.map(cliente => (
                  <Picker.Item key={cliente.clienteID} label={cliente.nombre} value={cliente.clienteID} />
                ))}
              </Picker>

              <Text style={styles.label}>Carrito</Text>
              <Picker
                selectedValue={selectedCarrito}
                onValueChange={(itemValue) => setSelectedCarrito(itemValue)}
                style={styles.picker}
              >
                {carritos.map(carrito => (
                  <Picker.Item key={carrito.carritoID} label={carrito.nombre} value={carrito.carritoID} />
                ))}
              </Picker>

              <Text style={styles.label}>Vendedor</Text>
              <Picker
                selectedValue={selectedVendedor}
                onValueChange={(itemValue) => setSelectedVendedor(itemValue)}
                style={styles.picker}
              >
                {vendedores.map(vendedor => (
                  <Picker.Item key={vendedor.vendedorID} label={vendedor.nombre} value={vendedor.vendedorID} />
                ))}
              </Picker>

              <TextInput
                style={styles.input}
                placeholder="Total de horas"
                value={total}
                onChangeText={setTotal}
              />

              <Text style={styles.label}>Estado</Text>
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

              <TouchableOpacity onPress={handleCreateReservation} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Crear Reservación</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setActiveSection('reservations')} style={styles.backButton}>
                <Text style={styles.backButtonText}>Regresar</Text>
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      <NotificationModal
        visible={notificationVisible}
        onClose={() => setNotificationVisible(false)}
        type={notificationType}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardColumn: {
    width: 300,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  cardDetails: {
    width: '100%',
    padding: 20,
    backgroundColor: '#f7f6f2',
    borderRadius: 10,
    alignItems: 'center',
    position: 'relative',
  },
  cardIcons: {
    width: 140,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ffee02',
    backgroundColor: '#fff',
  },
  iconImage: {
    width: 70,
    height: 70,
  },
  cardTitle: {
    marginBottom: 15,
    marginTop: 50,
    fontWeight: '700',
    fontSize: 24,
    lineHeight: 1.2,
  },
  cardDescription: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 20,
  },
  readMoreBtn: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 25,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ffee02',
  },
  readMoreBtnText: {
    color: '#000',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#6c757d',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default EventModal;
