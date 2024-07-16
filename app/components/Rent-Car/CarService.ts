// CarService
import axios from 'axios';
import { Carrito } from './Car-interface';

const API_URL = 'https://localhost:7141/Carritos';

export async function obtenerCarritos(): Promise<Carrito[]> {
  try {
    const response = await axios.get(API_URL);
    if (response.data.suceded && response.data.result) {
      return response.data.result as Carrito[];
    } else {
      throw new Error('No se pudieron obtener los datos de los carritos');
    }
  } catch (error) {
    console.error('Error al obtener los carritos:', error);
    throw error;
  }
}
