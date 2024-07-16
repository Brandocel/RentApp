// ProtectedRoute.js
import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ProtectedRoute = ({ navigation }) => {
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          navigation.navigate('App'); // Navega al área protegida si hay un token
        } else {
          navigation.navigate('Login'); // Navega a la pantalla de login si no hay token
        }
      } catch (error) {
        console.error('Error al obtener el token:', error.message);
        // Manejar el error apropiadamente, por ejemplo, mostrando un mensaje de error
      }
    };

    checkToken();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#A162F7" />
    </View>
  );
};

export default function(props) {
  const navigation = useNavigation();
  return <ProtectedRoute {...props} navigation={navigation} />;
}
