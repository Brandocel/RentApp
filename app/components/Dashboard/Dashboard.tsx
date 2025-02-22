import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, useWindowDimensions, Animated, Image } from 'react-native';
import { Card, Paragraph, Title, DataTable, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GolfService from '../../services/GolfService';
import ClienteService from '../../services/Cliente/ClienteService';
import RentaService from '../../services/Renta/RentaService';
import { Carrito } from '../../services/types';
import { Cliente } from '../../services/Cliente/typesC';
import { Renta } from '../../services/Renta/typesR';
import ProgressCircle from '../ProgressCircle';
import ComparisonCharts from '../ComparisonChart';
import * as Network from 'expo-network';
import axios from 'axios'; // Para las solicitudes HTTP

interface WeatherData {
    main: {
        temp: number;
    };
    weather: {
        description: string;
    }[];
}

interface Event {
    name: { text: string };
    description: { text: string };
    start: { local: string };
}

const DashboardScreen = () => {
    const { width: screenWidth } = useWindowDimensions();
    const isLargeScreen = screenWidth >= 768;

    const [isConnected, setIsConnected] = useState<boolean | undefined>(false);
    const [carritos, setCarritos] = useState<{ [key: string]: Carrito }>({});
    const [clientes, setClientes] = useState<{ [key: string]: Cliente }>({});
    const [rentas, setRentas] = useState<Renta[]>([]);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [time, setTime] = useState('');
    const [exchangeRate, setExchangeRate] = useState<number | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [animValuesDisplay, setAnimValuesDisplay] = useState({
        totalCarritos: 0,
        freeCarritos: 0,
        occupiedCarritos: 0,
        nuevosClientes: 0,
    });
    const [remainingTimes, setRemainingTimes] = useState<{ [key: string]: string }>({});
    const [page, setPage] = useState(0);
    const itemsPerPage = 10;

    const animValues = {
        totalCarritos: new Animated.Value(0),
        freeCarritos: new Animated.Value(0),
        occupiedCarritos: new Animated.Value(0),
        nuevosClientes: new Animated.Value(0),
    };

    const checkNetwork = async () => {
        const networkState = await Network.getNetworkStateAsync();
        setIsConnected(networkState.isConnected && networkState.isInternetReachable);
    };

    const fetchCarritos = async () => {
        try {
            const response = await GolfService.obtenerCarritos();
            if (Array.isArray(response)) {
                const carritosMap = response.reduce((acc: { [key: string]: Carrito }, carrito: Carrito) => {
                    acc[carrito.carritoID.toString()] = carrito;
                    return acc;
                }, {});
                setCarritos(carritosMap);
            } else {
                console.error('Unexpected response format:', response);
            }
        } catch (error: any) {
            console.error('Error fetching carritos:', error.message || error);
        }
    };

    const fetchClientes = async () => {
        try {
            const response = await ClienteService.obtenerClientes();
            if (response && response.suceded) {
                const clientesMap = response.result.reduce((acc: { [key: string]: Cliente }, cliente: Cliente) => {
                    acc[cliente.clienteID.toString()] = cliente;
                    return acc;
                }, {});
                setClientes(clientesMap);
            } else {
                console.error('Error fetching clientes:', response?.message || 'Respuesta no válida');
            }
        } catch (error: any) {
            console.error('Error fetching clientes:', error.message || error);
        }
    };

    const fetchRentas = async () => {
        try {
            const response = await RentaService.obtenerRentas();
            if (response && response.length) {
                setRentas(response);
            }
        } catch (error: any) {
            console.error('Error fetching rentas:', error.message || error);
        }
    };

    const fetchWeather = async () => {
        try {
            const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
                params: {
                    q: 'Cancun', // Reemplaza con tu ciudad
                    appid: '0db9e08a7d9a5e36d96b384d84586084', // Reemplaza con tu API key de OpenWeatherMap
                    units: 'metric'
                }
            });
            setWeather(response.data);
        } catch (error: any) {
            console.error('Error fetching weather data:', error.message || error);
        }
    };

    const fetchTime = () => {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        setTime(timeString);
    };

    const fetchExchangeRate = async () => {
        try {
            const response = await axios.get('https://open.er-api.com/v6/latest/USD');
            if (response.data && response.data.rates && response.data.rates.MXN) {
                setExchangeRate(response.data.rates.MXN);
            } else {
                console.error('Unexpected response format:', response);
            }
        } catch (error: any) {
            console.error('Error fetching exchange rate:', error.message || error);
        }
    };

    const fetchEvents = async (organizationId: string) => {
        try {
            const response = await axios.get(`https://www.eventbriteapi.com/v3/organizations/${organizationId}/events/`, {
                headers: {
                    Authorization: `UYTTP7YNGPWHOV3FMJBR`
                }
            });
            if (response.data && response.data.events) {
                setEvents(response.data.events);
            } else {
                console.error('Unexpected response format:', response);
            }
        } catch (error: any) {
            console.error('Error fetching events:', error.message || error);
        }
    };

    useEffect(() => {
        checkNetwork();
        fetchCarritos();
        fetchClientes();
        fetchRentas();
        fetchWeather();
        fetchTime();
        fetchExchangeRate();
        fetchEvents('948474902967'); // Reemplaza con el ID de tu organización

        const timeInterval = setInterval(fetchTime, 1000); // Actualizar la hora cada segundo
        return () => clearInterval(timeInterval);
    }, []);

    useEffect(() => {
        const totalCarritosCount = Object.keys(carritos).length;
        const freeCarritosCount = Object.values(carritos).filter(carrito => !carrito.enrenta).length;
        const occupiedCarritosCount = totalCarritosCount - freeCarritosCount;
        const nuevosClientesCount = Object.keys(clientes).length;

        const totalCarritosPercentage = totalCarritosCount ? (totalCarritosCount / totalCarritosCount) * 100 : 0;
        const freeCarritosPercentage = totalCarritosCount ? (freeCarritosCount / totalCarritosCount) * 100 : 0;
        const occupiedCarritosPercentage = totalCarritosCount ? (occupiedCarritosCount / totalCarritosCount) * 100 : 0;
        const nuevosClientesPercentage = 100; // Assume a maximum of 100 clients for simplicity

        Animated.timing(animValues.totalCarritos, {
            toValue: totalCarritosCount,
            duration: 2000,
            useNativeDriver: false,
        }).start();
        Animated.timing(animValues.freeCarritos, {
            toValue: freeCarritosPercentage,
            duration: 2000,
            useNativeDriver: false,
        }).start();
        Animated.timing(animValues.occupiedCarritos, {
            toValue: occupiedCarritosPercentage,
            duration: 2000,
            useNativeDriver: false,
        }).start();
        Animated.timing(animValues.nuevosClientes, {
            toValue: nuevosClientesCount,
            duration: 2000,
            useNativeDriver: false,
        }).start();

        animValues.totalCarritos.addListener(({ value }) => {
            setAnimValuesDisplay(prev => ({ ...prev, totalCarritos: Number(value.toFixed(0)) }));
        });
        animValues.freeCarritos.addListener(({ value }) => {
            setAnimValuesDisplay(prev => ({ ...prev, freeCarritos: Number(value.toFixed(0)) }));
        });
        animValues.occupiedCarritos.addListener(({ value }) => {
            setAnimValuesDisplay(prev => ({ ...prev, occupiedCarritos: Number(value.toFixed(0)) }));
        });
        animValues.nuevosClientes.addListener(({ value }) => {
            setAnimValuesDisplay(prev => ({ ...prev, nuevosClientes: Number(value.toFixed(0)) }));
        });

        return () => {
            animValues.totalCarritos.removeAllListeners();
            animValues.freeCarritos.removeAllListeners();
            animValues.occupiedCarritos.removeAllListeners();
            animValues.nuevosClientes.removeAllListeners();
        };
    }, [carritos, clientes, rentas]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const updatedRemainingTimes = rentas.reduce((acc, renta) => {
                acc[renta.rentaID.toString()] = getRemainingTime(renta.horaFinal);
                return acc;
            }, {} as { [key: string]: string });
            setRemainingTimes(updatedRemainingTimes);
        }, 1000); // Update every second

        return () => clearInterval(intervalId);
    }, [rentas]);

    const getStatus = (renta: Renta) => {
        const currentDate = new Date();
        if (new Date(renta.horaFinal) < currentDate) {
            return "Completed";
        } else if (new Date(renta.horaInicio) > currentDate) {
            return "Delayed";
        } else {
            return "On going";
        }
    };

    const getProgress = (renta: Renta) => {
        const totalDuration = new Date(renta.horaFinal).getTime() - new Date(renta.horaInicio).getTime();
        const elapsedTime = new Date().getTime() - new Date(renta.horaInicio).getTime();
        if (totalDuration === 0) {
            return 0;
        }
        return (elapsedTime / totalDuration) * 100;
    };

    const getStatusStyle = (renta: Renta) => {
        const status = getStatus(renta);
        switch (status) {
            case 'Completed':
                return styles.statusCompleted;
            case 'Delayed':
                return styles.statusDelayed;
            case 'On going':
                return styles.statusOngoing;
            default:
                return {};
        }
    };

    const handleUpdate = (rentaId: number) => {
        // Lógica para actualizar la renta
    };

    const handleDelete = (rentaId: number) => {
        // Lógica para eliminar la renta
    };

    const handleViewReservation = (rentaId: number) => {
        // Lógica para ver la reservación
    };

    const popularCarritosData = rentas.reduce((acc: any, renta: Renta) => {
        const carrito = acc.find((c: any) => c.carrito === renta.carritoFK);
        if (carrito) {
            carrito.count += 1;
        } else {
            acc.push({ carrito: renta.carritoFK, count: 1 });
        }
        return acc;
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <Title style={styles.overviewTitle}>Overview</Title>
                <View style={[styles.cardsRow, isLargeScreen ? styles.cardsRowLarge : styles.cardsRowSmall]}>
                    <Card style={[styles.card, isLargeScreen ? styles.cardLarge : styles.cardSmall, styles.card1]}>
                        <Card.Content>
                            <View style={styles.iconContainer}>
                                <Image source={require('../../../assets/carrito.png')} style={styles.image} />
                            </View>
                            <Title style={styles.cardTitle}>Total Carritos</Title>
                            <ProgressCircle percentage={animValuesDisplay.totalCarritos} color="#3498db" />
                            <Paragraph style={styles.cardText}>{animValuesDisplay.totalCarritos}</Paragraph>
                            <Text style={styles.cardSubText}>Total de carritos disponibles</Text>
                        </Card.Content>
                    </Card>
                    <Card style={[styles.card, isLargeScreen ? styles.cardLarge : styles.cardSmall, styles.card2]}>
                        <Card.Content>
                            <View style={styles.iconContainer}>
                                <Image source={require('../../../assets/carrito.png')} style={styles.image} />
                            </View>
                            <Title style={styles.cardTitle}>Free Carritos</Title>
                            <ProgressCircle percentage={animValuesDisplay.freeCarritos} color="#e74c3c" />
                            <Paragraph style={styles.cardText}>{animValuesDisplay.freeCarritos}</Paragraph>
                            <Text style={styles.cardSubText}>Carritos disponibles para rentar</Text>
                        </Card.Content>
                    </Card>
                    <Card style={[styles.card, isLargeScreen ? styles.cardLarge : styles.cardSmall, styles.card3]}>
                        <Card.Content>
                            <View style={styles.iconContainer}>
                                <Image source={require('../../../assets/carrito.png')} style={styles.image} />
                            </View>
                            <Title style={styles.cardTitle}>Occupied Carritos</Title>
                            <ProgressCircle percentage={animValuesDisplay.occupiedCarritos} color="#2ecc71" />
                            <Paragraph style={styles.cardText}>{animValuesDisplay.occupiedCarritos}</Paragraph>
                            <Text style={styles.cardSubText}>Carritos actualmente en renta</Text>
                        </Card.Content>
                    </Card>
                    <Card style={[styles.card, isLargeScreen ? styles.cardLarge : styles.cardSmall, styles.card4]}>
                        <Card.Content>
                            <View style={styles.iconContainer}>
                                <Image source={require('../../../assets/carrito.png')} style={styles.image} />
                            </View>
                            <Title style={styles.cardTitle}>Nuevos Clientes</Title>
                            <ProgressCircle percentage={animValuesDisplay.nuevosClientes} color="#f39c12" />
                            <Paragraph style={styles.cardText}>{animValuesDisplay.nuevosClientes}</Paragraph>
                            <Text style={styles.cardSubText}>Clientes registrados recientemente</Text>
                        </Card.Content>
                    </Card>
                </View>
                
                <View style={styles.chartsContainer}>
                    <ComparisonCharts />
                    <ComparisonCharts />
                </View>

                <View style={styles.summaryContainer}>
                    <View style={[styles.tableContainer, isLargeScreen ? styles.tableContainerLarge : styles.tableContainerSmall]}>
                        <Title style={styles.sectionTitle}>Project Summary</Title>
                        <DataTable style={styles.dataTable}>
                            <DataTable.Header style={styles.dataTableHeader}>
                                <DataTable.Title>Cliente</DataTable.Title>
                                <DataTable.Title>Vendedor</DataTable.Title>
                                <DataTable.Title>Carrito de Golf</DataTable.Title>
                                <DataTable.Title>Inicio</DataTable.Title>
                                <DataTable.Title>Final</DataTable.Title>
                                <DataTable.Title>Status</DataTable.Title>
                                {isLargeScreen && <DataTable.Title>Progreso</DataTable.Title>}
                        
                            </DataTable.Header>
                            {rentas.slice(page * itemsPerPage, (page + 1) * itemsPerPage).map((renta) => (
                                <DataTable.Row key={renta.rentaID} style={styles.dataTableRow}>
                                    <DataTable.Cell>{clientes[renta.clienteFK]?.nombre || renta.clienteFK}</DataTable.Cell>
                                    <DataTable.Cell>{renta.vendedorFK}</DataTable.Cell>
                                    <DataTable.Cell>{carritos[renta.carritoFK]?.modelo || renta.carritoFK}</DataTable.Cell>
                                    <DataTable.Cell>{new Date(renta.horaInicio).toLocaleDateString()}</DataTable.Cell>
                                    <DataTable.Cell>{new Date(renta.horaFinal).toLocaleDateString()}</DataTable.Cell>
                                    <DataTable.Cell style={styles.statusCell}><Text style={[styles.statusText, getStatusStyle(renta)]}>{getStatus(renta)}</Text></DataTable.Cell>
                                    {isLargeScreen && <DataTable.Cell>{remainingTimes[renta.rentaID.toString()]}</DataTable.Cell>}
                                </DataTable.Row>
                            ))}
                            <DataTable.Pagination
                                page={page}
                                numberOfPages={Math.ceil(rentas.length / itemsPerPage)}
                                onPageChange={page => setPage(page)}
                                label={`Page ${page + 1} of ${Math.ceil(rentas.length / itemsPerPage)}`}
                            />
                        </DataTable>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const getRemainingTime = (horaFinal: string | number | Date) => {
    const currentTime = new Date().getTime();
    const endTime = new Date(horaFinal).getTime();
    const remainingTime = endTime - currentTime;

    if (remainingTime <= 0) {
        return "0 horas 0 minutos";
    }

    const hours = Math.floor(remainingTime / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours} horas ${minutes} minutos`;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF9F6',
    },
    scrollView: {
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    overviewTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#1A1A1A',
    },
    cardsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    cardsRowLarge: {
        justifyContent: 'space-between',
    },
    cardsRowSmall: {
        justifyContent: 'space-around',
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    cardLarge: {
        flexBasis: '23%',
    },
    cardSmall: {
        flexBasis: '48%',
    },
    card1: {
        backgroundColor: '#E3F2FD',
    },
    card2: {
        backgroundColor: '#FFEBEE',
    },
    card3: {
        backgroundColor: '#E8F5E9',
    },
    card4: {
        backgroundColor: '#FFF3E0',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#1A1A1A',
    },
    cardText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    cardSubText: {
        fontSize: 14,
        color: '#757575',
    },
    iconContainer: {
        marginBottom: 10,
        alignItems: 'center',
    },
    image: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        color: '#1A1A1A',
    },
    chartsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20,
    },
    summaryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    tableContainer: {
        flex: 1,
        marginRight: 10,
    },
    tableContainerLarge: {
        flexBasis: '58%',
    },
    tableContainerSmall: {
        flexBasis: '100%',
    },
    dataTable: {
        borderRadius: 10,
        overflow: 'hidden',
    },
    dataTableHeader: {
        backgroundColor: '#f2f2f2',
    },
    dataTableRow: {
        backgroundColor: '#fff',
    },
    statusCell: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    statusText: {
        fontWeight: 'bold'
    },
    statusCompleted: {
        color: '#2ecc71',
    },
    statusDelayed: {
        color: '#f1c40f',
    },
    statusOngoing: {
        color: '#e67e22',
    },
});

export default DashboardScreen;
