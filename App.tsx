// App.js
import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Dashboard from './app/components/Dashboard/Dashboard';
import CalendarScreen from './app/components/Dashboard/CalendarScreen';
import { PaperProvider } from 'react-native-paper';
import Toast, { ToastRef } from 'react-native-toast-message';
import CarScreen from './app/components/Rent-Car/CarScreen';
import DetallesCarrito from './app/components/Rent-Car/DetallesCarrito';

// Add the following type definition
declare module 'react-native-toast-message' {
  export function setRef(ref: ToastRef): void;
}

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <PaperProvider>
      <Drawer.Navigator initialRouteName="Dashboard">
        <Drawer.Screen name="Dashboard" component={Dashboard} />
        <Drawer.Screen name="Calendar" component={CalendarScreen} />
        <Drawer.Screen name="CartRent" component={CarScreen} />
        <Drawer.Screen name="Detalles" component={DetallesCarrito} />
      </Drawer.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
  
}




