import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TextInput, Pressable, Dimensions, ActivityIndicator, Alert, Modal, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Carrito } from './Car-interface';
import { obtenerCarritos, eliminarCarrito, editarCarrito } from './CarService';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../App';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');
const isMobile = width <= 768;
const numColumns = isMobile ? 1 : 3; // Cambiado a 1 para mostrar solo una tarjeta por fila en pantallas pequeñas
const itemWidth = isMobile ? width - 40 : (width - 60 - 10 * (numColumns - 1)) / numColumns;

type CarScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CarScreen'>;

const CarScreen: React.FC = () => {
  const [carritos, setCarritos] = useState<Carrito[]>([]);
  const [filteredCarritos, setFilteredCarritos] = useState<Carrito[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [searchActive, setSearchActive] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Loading state for initial data fetch
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [carritoEdit, setCarritoEdit] = useState<Carrito>({
    carritoID: 0,
    modelo: '',
    marca: '',
    precioHora: 0,
    imgurl: '',
    enrenta: false,
  });

  const navigation = useNavigation<CarScreenNavigationProp>();

  useEffect(() => {
    const fetchCarritos = async () => {
      try {
        const data = await obtenerCarritos();
        setCarritos(data);
        setFilteredCarritos(data);
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error('Error al obtener los carritos en el useEffect:', error);
        setLoading(false); // Handle loading state in case of error
      }
    };
    fetchCarritos();
  }, []);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text) {
      const filtered = carritos.filter((carrito) =>
        carrito.modelo.toLowerCase().includes(text.toLowerCase()) ||
        carrito.marca.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCarritos(filtered);
    } else {
      setFilteredCarritos(carritos);
    }
  };

  const handlePress = (carrito: Carrito) => {
    navigation.navigate('DetallesCarrito', { carrito });
  };

  const handleHighlight = (index: number) => {
    setSelectedItem(index);
  };

  const handleUnhighlight = () => {
    setSelectedItem(null);
  };

  const handleDelete = async (carritoID: number) => {
    try {
      await eliminarCarrito(carritoID);
      const updatedCarritos = carritos.filter(carrito => carrito.carritoID !== carritoID);
      setCarritos(updatedCarritos);
      setFilteredCarritos(updatedCarritos);
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el carrito');
    }
  };

  const handleEdit = (carrito: Carrito) => {
    setCarritoEdit(carrito);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (carritoEdit) {
      try {
        const editedCarrito = await editarCarrito(carritoEdit);
        const updatedCarritos = carritos.map(carrito => carrito.carritoID === editedCarrito.carritoID ? editedCarrito : carrito);
        setCarritos(updatedCarritos);
        setFilteredCarritos(updatedCarritos);
        setEditModalVisible(false);
      } catch (error) {
        Alert.alert('Error', 'No se pudo editar el carrito');
      }
    }
  };

  const renderItem = ({ item, index }: { item: Carrito; index: number }) => (
    <Animatable.View animation="fadeInUp" delay={index * 100} useNativeDriver>
      <Pressable
        style={({ pressed }) => [
          styles.card,
          { width: itemWidth },
          pressed && { backgroundColor: '#fed6fa' }, // Example of changing style on press
          selectedItem === index && { backgroundColor: '#fed6fa' }, // Maintain selected style
        ]}
        onPress={() => handlePress(item)}
      >
        <>
          <Pressable onPress={() => handleDelete(item.carritoID)} style={styles.deleteButton}>
            <Ionicons name="trash" size={24} color="red" />
          </Pressable>
          <Pressable onPress={() => handleEdit(item)} style={styles.editButton}>
            <Ionicons name="pencil" size={24} color="blue" />
          </Pressable>
          <View style={styles.cardImageWrapper}>
            <Image source={{ uri: item.imgurl }} style={styles.cardImage} />
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>{item.marca}</Text>
            <Text style={styles.cardModelo}>{item.modelo}</Text>
            <Text style={styles.cardDescription}>Precio por hora: ${item.precioHora}</Text>
            <View style={styles.cardStatus}>
              <Ionicons name={item.enrenta ? 'checkmark-circle-outline' : 'close-circle-outline'} size={20} color={item.enrenta ? 'green' : 'red'} />
              <Text style={[styles.statusText, { color: item.enrenta ? 'green' : 'red', fontWeight: 'bold' }]}>
                {item.enrenta ? 'Disponible' : 'No Disponible'}
              </Text>
            </View>
          </View>
        </>
      </Pressable>
    </Animatable.View>
  );

  const toggleSearch = () => {
    setSearchActive(!searchActive);
    if (!searchActive) {
      setSearchText('');
      setFilteredCarritos(carritos);
    }
  };

  const renderFooter = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#800080" />
          <Text style={styles.loadingText}>Cargando carritos...</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={['#e0e0e0', '#f8f8f8']} style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Carritos</Text>
            <Pressable
              style={[styles.searchButton, searchActive && styles.searchButtonActive]}
              onPress={toggleSearch}
            >
              <Ionicons name="search" size={18} color="#888" />
            </Pressable>
          </View>
          {searchActive && (
            <View style={styles.searchContainer}>
              <View style={styles.searchIcon}>
                <Ionicons name="search" size={18} color="#888" />
              </View>
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar por Marca o Modelo"
                value={searchText}
                onChangeText={handleSearch}
              />
            </View>
          )}
          <FlatList
            data={filteredCarritos}
            keyExtractor={(item) => item.carritoID.toString()}
            renderItem={renderItem}
            numColumns={numColumns}
            contentContainerStyle={styles.flatListContent}
            ListFooterComponent={renderFooter} // Render loading indicator or other footer components
          />
        </View>
      </LinearGradient>
      {editModalVisible && (
        <Modal
        visible={editModalVisible}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
        transparent
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Carrito</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Marca"
              value={carritoEdit.marca}
              onChangeText={(text) => setCarritoEdit({ ...carritoEdit, marca: text })}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Modelo"
              value={carritoEdit.modelo}
              onChangeText={(text) => setCarritoEdit({ ...carritoEdit, modelo: text })}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Precio por hora"
              value={carritoEdit.precioHora.toString()}
              onChangeText={(text) => setCarritoEdit({ ...carritoEdit, precioHora: text ? parseFloat(text) : 0 })}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="URL de la Imagen"
              value={carritoEdit.imgurl}
              onChangeText={(text) => setCarritoEdit({ ...carritoEdit, imgurl: text })}
            />
            <View style={styles.modalButtonContainer}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveEdit}
              >
                <Text style={styles.buttonText}>Guardar Cambios</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
    maxWidth: 1200,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  searchButtonActive: {
    backgroundColor: '#ccc',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
    maxWidth: 1200,
  },
  searchIcon: {
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    height: 30,
    fontSize: 16,
  },
  flatListContent: {
    paddingBottom: 10,
    paddingTop: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginVertical: 10,
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
    maxWidth: '90%',
  },
  cardImageWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 5,
    borderColor: '#800080',
  },
  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cardBody: {
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  cardModelo: {
    fontSize: 16,
    color: '#888',
    marginBottom: 5,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
    textAlign: 'center',
  },
  cardStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  statusText: {
    fontSize: 16,
    marginLeft: 5,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  editButton: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#888',
  },
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
    width: '80%',
  },
  modalInner: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalInput: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  modalButton: {
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  saveButton: {
    backgroundColor: '#317F43', // Morado para el botón de guardar cambios
    borderColor: '#317F43',
  },
  cancelButton: {
    backgroundColor: 'red', // Rojo para el botón de cancelar
    borderColor: 'red',
  },
  buttonText: {
    fontSize: 16,
    color: 'white', // Texto blanco para mejor contraste
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default CarScreen;
