import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Carrito } from '../../services/CardRent/Car-interface';
import { LineChart } from 'react-native-chart-kit';

type DetallesCarritoRouteProp = RouteProp<{ DetallesCarrito: { carrito: Carrito } }, 'DetallesCarrito'>;

const DetallesCarrito: React.FC = () => {
  const route = useRoute<DetallesCarritoRouteProp>();
  const { carrito } = route.params;
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.leftColumn}>
          <View style={styles.detailsCard}>
            <Text style={styles.title}>{carrito.marca} {carrito.modelo}</Text>
            <Image source={{ uri: carrito.imgurl }} style={styles.image} />
            <Text style={styles.text}>Precio por Hora: ${carrito.precioHora}</Text>
            <Text style={styles.text}>{carrito.enrenta ? 'Disponible' : 'No Disponible'}</Text>
          </View>
        </View>
        <View style={styles.rightColumn}>
          <View style={styles.chartCard}>
            <Text style={styles.title}>Gráfica de Ejemplo</Text>
            <LineChart
              data={{
                labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
                datasets: [
                  {
                    data: [20, 45, 28, 80, 99, 43],
                  },
                ],
              }}
              width={screenWidth / 2.2} // from react-native
              height={screenHeight / 4}
              chartConfig={{
                backgroundColor: '#e26a00',
                backgroundGradientFrom: '#fb8c00',
                backgroundGradientTo: '#ffa726',
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
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
          <View style={styles.tableCard}>
            <Text style={styles.title}>Tabla de Ejemplo</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Columna 1</Text>
                <Text style={styles.tableCell}>Columna 2</Text>
                <Text style={styles.tableCell}>Columna 3</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Dato 1</Text>
                <Text style={styles.tableCell}>Dato 2</Text>
                <Text style={styles.tableCell}>Dato 3</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Dato 4</Text>
                <Text style={styles.tableCell}>Dato 5</Text>
                <Text style={styles.tableCell}>Dato 6</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    height: Dimensions.get('window').height,
  },
  leftColumn: {
    flex: 1,
    paddingRight: 10,
  },
  rightColumn: {
    flex: 1,
    paddingLeft: 10,
  },
  detailsCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
  },
  chartCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
  },
  tableCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  table: {
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
  },
});

export default DetallesCarrito;
