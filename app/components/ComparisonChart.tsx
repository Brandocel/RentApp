import React, { useEffect, useState } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import * as scale from 'd3-scale';
import { Text } from 'react-native-paper';
import { BarChart, LineChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import { Animated } from 'react-native';

const ComparisonCharts = ({ barData, lineData }: { barData: any, lineData: any }) => {
    const { width: screenWidth } = useWindowDimensions();
    const isLargeScreen = screenWidth >= 768;

    const [barAnimation] = useState(new Animated.Value(0));
    const [lineAnimation] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(barAnimation, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
        }).start();
        Animated.timing(lineAnimation, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
        }).start();
    }, []);

    const contentInset = { top: 20, bottom: 20 };

    if (!barData || barData.length === 0 || !lineData || lineData.length === 0) {
        return <Text style={styles.errorText}>No data available</Text>;
    }

    const AnimatedBarChart = Animated.createAnimatedComponent(BarChart);
    const AnimatedLineChart = Animated.createAnimatedComponent(LineChart);

    return (
        <View style={isLargeScreen ? styles.containerHorizontal : styles.containerVertical}>
            <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Comparación de Carritos Rentados</Text>
                <View style={{ height: 300, flexDirection: 'row' }}> {/* Adjust height for larger screens */}
                    <YAxis
                        data={barData[0].data}
                        contentInset={contentInset}
                        svg={{
                            fill: 'grey',
                            fontSize: 10,
                        }}
                        numberOfTicks={10}
                        formatLabel={(value) => `${value}`}
                    />
                    <AnimatedBarChart
                        style={{ flex: 1, marginLeft: 10 }}
                        data={barData}
                        yAccessor={({ item }) => item as number}
                        contentInset={contentInset}
                        spacingInner={0.2}
                        yMin={0}
                    >
                        <Grid />
                    </AnimatedBarChart>
                </View>
                <XAxis
                    style={{ marginHorizontal: -10 }}
                    data={barData[0].data}
                    formatLabel={(value, index) => index + 1}
                    contentInset={{ left: 10, right: 10 }}
                    svg={{ fontSize: 10, fill: 'grey' }}
                    scale={scale.scaleBand}
                />
            </View>

            <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Tráfico de Usuarios en el Tiempo</Text>
                <View style={{ height: 300, flexDirection: 'row' }}> {/* Adjust height for larger screens */}
                    <YAxis
                        data={lineData[0].data}
                        contentInset={contentInset}
                        svg={{
                            fill: 'grey',
                            fontSize: 10,
                        }}
                        numberOfTicks={10}
                        formatLabel={(value) => `${value}`}
                    />
                    <AnimatedLineChart
                        style={{ flex: 1, marginLeft: 10 }}
                        data={lineData}
                        yAccessor={({ item }) => item as number}
                        contentInset={contentInset}
                        curve={shape.curveNatural}
                        svg={{
                            strokeWidth: 2,
                            stroke: 'rgb(134, 65, 244)',
                            strokeDasharray: [10, 5],
                            strokeDashoffset: lineAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [200, 0],
                            }),
                        }}
                    >
                        <Grid />
                    </AnimatedLineChart>
                </View>
                <XAxis
                    style={{ marginHorizontal: -10 }}
                    data={lineData[0].data}
                    formatLabel={(value, index) => index + 1}
                    contentInset={{ left: 10, right: 10 }}
                    svg={{ fontSize: 10, fill: 'grey' }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    containerHorizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    containerVertical: {
        flexDirection: 'column',
    },
    chartContainer: {
        flex: 1,
        margin: 10,
    },
    chartTitle: {
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 10,
    },
    errorText: {
        textAlign: 'center',
        fontSize: 16,
        color: 'red',
    },
});

export default ComparisonCharts;
