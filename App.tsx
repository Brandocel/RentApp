import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Dashboard from './app/components/Dashboard/Dashboard';
import CalendarScreen from './app/components/Dashboard/CalendarScreen';
import CarScreen from './app/components/Rent-Car/CarScreen';
import DetallesCarrito from './app/components/Rent-Car/DetallesCarrito';
import Login from './app/components/login/login';
import { PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProtectedRoute from './app/services/guards/ProtectedRoute';
import { Carrito } from './app/components/Rent-Car/Car-interface';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Definición de tipos de navegación
export type RootStackParamList = {
  CarScreen: undefined;
  DetallesCarrito: { carrito: Carrito };
};


function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Dashboard">
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      <Drawer.Screen name="Calendar" component={CalendarScreen} />
      <Drawer.Screen name="CartRent" component={CarScreen} />
      <Drawer.Screen name="Detalles" component={DetallesCarrito} />
      <Drawer.Screen name="Cerrar sesion" component={Login} />
    </Drawer.Navigator>
  );
}

function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="ProtectedRoute">
          <Stack.Screen name="ProtectedRoute" component={ProtectedRoute} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="App" component={DrawerNavigator} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;
