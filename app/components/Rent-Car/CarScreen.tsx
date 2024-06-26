import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TextInput, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Carrito } from '../../services/CardRent/Car-interface';
import { obtenerCarritos } from '../../services/CardRent/CarService';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../App';

const { width } = Dimensions.get('window');
const isMobile = width <= 768; // Define el ancho máximo para dispositivos móviles

const numColumns = isMobile ? 2 : 3; // Número de columnas basado en el tipo de dispositivo
const itemWidth = (width - 60 - 10 * (numColumns - 1)) / numColumns; // Calcula el ancho de cada tarjeta

type CarScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CarScreen'>;

const CarScreen: React.FC = () => {
  const [carritos, setCarritos] = useState<Carrito[]>([]);
  const [filteredCarritos, setFilteredCarritos] = useState<Carrito[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [searchActive, setSearchActive] = useState<boolean>(false);

  const navigation = useNavigation<CarScreenNavigationProp>();

  useEffect(() => {
    const fetchCarritos = async () => {
      try {
        const data = await obtenerCarritos();
        setCarritos(data);
        setFilteredCarritos(data); // Inicialmente, mostrar todos los carritos
      } catch (error) {
        console.error('Error al obtener los carritos en el useEffect:', error);
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

  const renderItem = ({ item }: { item: Carrito }) => (
    <TouchableOpacity style={[styles.card, { width: itemWidth }]} onPress={() => handlePress(item)}>
      <View style={styles.header}>
        <Text style={styles.carritoMarca}>{item.marca}</Text>
        <Text style={styles.carritoModelo}>{item.modelo}</Text>
      </View>
      <Image source={{ uri: item.imgurl }} style={styles.cardImage} />
      <View style={styles.footer}>
        <Text style={styles.carritoPrecio}>${item.precioHora}/Hora</Text>
        <Text style={item.enrenta ? styles.enRenta : styles.noRenta}>
          {item.enrenta ? 'Disponible' : 'No Disponible'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const toggleSearch = () => {
    setSearchActive(!searchActive);
    if (!searchActive) {
      setSearchText('');
      setFilteredCarritos(carritos);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Carritos</Text>
        <TouchableOpacity style={[styles.searchButton, searchActive && styles.searchButtonActive]} onPress={toggleSearch}>
          <Ionicons name="search" size={18} color="#888" />
        </TouchableOpacity>
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
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  searchButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  searchButtonActive: {
    backgroundColor: '#ddd',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginBottom: 20,
  },
  searchIcon: {
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: 30,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    color: '#333',
  },
  card: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderBottomColor: '#eee',
  },
  cardImage: {
    marginTop: 10,
    width: '100%',
    aspectRatio: 16 / 9,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
  },
  carritoModelo: {
    fontSize: 16,
  },
  carritoMarca: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  carritoPrecio: {
    fontSize: 16,
    color: '#888',
  },
  enRenta: {
    fontSize: 14,
    color: 'green',
    fontWeight: 'bold',
  },
  noRenta: {
    fontSize: 14,
    color: 'red',
    fontWeight: 'bold',
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 1,
  },
  flatListContent: {
    alignItems: 'center',
  },
});

export default CarScreen;
