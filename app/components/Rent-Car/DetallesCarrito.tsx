import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Carrito } from './Car-interface';
import { LineChart } from 'react-native-chart-kit';

type DetallesCarritoRouteProp = RouteProp<{ DetallesCarrito: { carrito: Carrito } }, 'DetallesCarrito'>;

const DetallesCarrito: React.FC = () => {
  const route = useRoute<DetallesCarritoRouteProp>();
  const { carrito } = route.params;
  const screenWidth = Dimensions.get('window').width;

  const [chartWidth, setChartWidth] = useState(screenWidth * 0.60);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const updateChartWidth = () => {
      const newWidth = Dimensions.get('window').width * 0.60;
      setChartWidth(newWidth);
    };

    Dimensions.addEventListener('change', updateChartWidth);
  }, []);

  const handleImagePress = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.leftColumn}>
          <View style={styles.detailsCard}>
            <View style={styles.row}>
              <View style={styles.cell}>
                <Text style={styles.label}>Marca</Text>
                <Text style={styles.value}>{carrito.marca}</Text>
              </View>
              <View style={styles.separator}>
                <Text style={styles.separatorText}>|</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.label}>Modelo</Text>
                <Text style={styles.value}>{carrito.modelo}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cell}>
                <Text style={styles.label}>Costo</Text>
                <Text style={styles.value}>${carrito.precioHora}</Text>
              </View>
              <View style={styles.separator}>
                <Text style={styles.separatorText}>|</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.label}>Disponibilidad</Text>
                <Text style={styles.value}>{carrito.enrenta ? 'Disponible' : 'No Disponible'}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.imageContainer}
              onPress={handleImagePress}
            >
              <Image source={{ uri: carrito.imgurl }} style={styles.image} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.rightColumn}>
          <View style={styles.activityCard}>
            <Text style={styles.title}>Activity</Text>
            <View style={{ width: '100%' }}>
              <LineChart
                data={{
                  labels: ['12/9', '12/9', '12/9', '12/9', '12/9', '12/9'],
                  datasets: [
                    {
                      data: [0, 10, 20, 30, 40, 50],
                    },
                  ],
                }}
                width={chartWidth}
                height={220}
                yAxisSuffix=" Km"
                chartConfig={{
                  backgroundColor: '#FFFFFF',
                  backgroundGradientFrom: '#FFFFFF',
                  backgroundGradientTo: '#FFFFFF',
                  decimalPlaces: 2,
                  color: (opacity = 1) => `rgba(87, 155, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(87, 155, 255, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '6',
                    strokeWidth: '2',
                    stroke: '#ffa726',
                  },
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
            </View>
          </View>
          <View style={styles.usersCard}>
            <Text style={styles.title}>Users</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableHeader}>Name</Text>
                <Text style={styles.tableHeader}>Entry</Text>
                <Text style={styles.tableHeader}>Output</Text>
                <Text style={styles.tableHeader}>Extra Charge</Text>
                <Text style={styles.tableHeader}>Status</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Brando Antonio Cel</Text>
                <Text style={styles.tableCell}>06/04/2022 11:39 a.m.</Text>
                <Text style={styles.tableCell}>08/04/2022 12:50 a.m.</Text>
                <Text style={styles.tableCell}>$500</Text>
                <Text style={styles.tableCell}>Completed</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Alejandro Martinez</Text>
                <Text style={styles.tableCell}>06/04/2022 05:39 p.m.</Text>
                <Text style={styles.tableCell}>08/04/2022 06:38 p.m.</Text>
                <Text style={styles.tableCell}>$0</Text>
                <Text style={styles.tableCell}>Completed</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <Modal
        visible={isModalVisible}
        onRequestClose={handleCloseModal}
        transparent={true}
      >
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Image source={{ uri: carrito.imgurl }} style={styles.modalImage} />
            <TouchableOpacity onPress={handleCloseModal}>
              <Text style={styles.closeText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flexDirection: 'row',
    padding: 20,
  },
  leftColumn: {
    flex: 1,
    paddingRight: 10,
    flexBasis: '35%',
  },
  rightColumn: {
    flex: 3,
    paddingLeft: 10,
    flexBasis: '65%',
  },
  detailsCard: {
    backgroundColor: '#8A2BE2',
    borderRadius: 10,
    padding: 20,
    height: '100%',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
  },
  separator: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  separatorText: {
    color: '#579BFF',
    fontSize: 24,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 10,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    position: 'relative',
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 5,
    borderColor: '#FFFFFF',
    resizeMode: 'cover',
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    overflow: 'hidden',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  usersCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
  },
  table: {
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tableHeader: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    padding: 5,
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    padding: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalImage: {
    width: 500,
    height: 400,
    resizeMode: 'contain',
  },
  closeText: {
    marginTop: 10,
    color: '#8A2BE2',
    fontWeight: 'bold',
  },
});

export default DetallesCarrito;
