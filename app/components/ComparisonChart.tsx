import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { BarChart, LineChart, ProgressChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const data = [
    { y: '2014', a: 50, b: 90 },
    { y: '2015', a: 65, b: 75 },
    { y: '2016', a: 50, b: 50 },
    { y: '2017', a: 75, b: 60 },
    { y: '2018', a: 80, b: 65 },
    { y: '2019', a: 90, b: 70 },
    { y: '2020', a: 100, b: 75 },
    { y: '2021', a: 115, b: 75 },
    { y: '2022', a: 120, b: 85 },
    { y: '2023', a: 145, b: 85 },
    { y: '2024', a: 160, b: 95 }
];

const lineData = {
    labels: data.map(item => item.y),
    datasets: [
        {
            data: data.map(item => item.a),
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
            strokeWidth: 2
        },
        {
            data: data.map(item => item.b),
            color: (opacity = 1) => `rgba(244, 65, 65, ${opacity})`,
            strokeWidth: 2
        }
    ],
    legend: ['Total Income', 'Total Outcome']
};

const barData = {
    labels: data.map(item => item.y),
    datasets: [
        {
            data: data.map(item => item.a)
        },
        {
            data: data.map(item => item.b)
        }
    ],
    legend: ['Total Income', 'Total Outcome']
};

const progressData = {
    labels: ["Swim", "Bike", "Run"],
    data: [0.4, 0.6, 0.8]
};

const chartConfig = {
    backgroundColor: '#1B213B',
    backgroundGradientFrom: '#1B213B',
    backgroundGradientTo: '#1B213B',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
        borderRadius: 16
    },
    propsForDots: {
        r: '6',
        strokeWidth: '2',
        stroke: '#ffa726'
    }
};

const ComparisonCharts = () => {
    const [currentChart, setCurrentChart] = useState('line');
    const [lineAnimation] = useState(new Animated.Value(0));
    const [barAnimation] = useState(new Animated.Value(0));
    const [progressAnimation] = useState(new Animated.Value(0));

    useEffect(() => {
        switch (currentChart) {
            case 'line':
                Animated.timing(lineAnimation, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }).start();
                break;
            case 'bar':
                Animated.timing(barAnimation, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }).start();
                break;
            case 'progress':
                Animated.timing(progressAnimation, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }).start();
                break;
            default:
                break;
        }
    }, [currentChart]);

    const renderChart = () => {
        switch (currentChart) {
            case 'line':
                return (
                    <Animated.View style={{ opacity: lineAnimation }}>
                        <LineChart
                            data={lineData}
                            width={screenWidth - 30}
                            height={220}
                            chartConfig={chartConfig}
                            bezier
                        />
                    </Animated.View>
                );
            case 'bar':
                return (
                    <Animated.View style={{ opacity: barAnimation }}>
                        <BarChart
                            data={barData}
                            width={screenWidth - 30}
                            height={220}
                            chartConfig={chartConfig}
                            yAxisLabel="$"
                            yAxisSuffix="k"
                        />
                    </Animated.View>
                );
            case 'progress':
                return (
                    <Animated.View style={{ opacity: progressAnimation }}>
                        <ProgressChart
                            data={progressData}
                            width={screenWidth - 30}
                            height={220}
                            chartConfig={chartConfig}
                        />
                    </Animated.View>
                );
            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => setCurrentChart('line')}>
                    <Text style={styles.buttonText}>Line Chart</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => setCurrentChart('bar')}>
                    <Text style={styles.buttonText}>Bar Chart</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => setCurrentChart('progress')}>
                    <Text style={styles.buttonText}>Progress Chart</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.chartContainer}>
                {renderChart()}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1B213B',
        padding: 20,
        borderRadius: 10
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10
    },
    button: {
        backgroundColor: '#007bff',
        borderRadius: 5,
        padding: 10,
        marginHorizontal: 5
    },
    buttonText: {
        color: '#fff',
        fontSize: 14
    },
    chartContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default ComparisonCharts;
