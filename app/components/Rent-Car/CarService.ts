// CarService.js
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

export async function eliminarCarrito(carritoID: number): Promise<void> {
  try {
    const response = await axios.delete(`${API_URL}/${carritoID}`);
    if (response.status !== 200) {
      throw new Error('No se pudo eliminar el carrito');
    }
  } catch (error) {
    console.error('Error al eliminar el carrito:', error);
    throw error;
  }
}

export async function editarCarrito(carrito: Carrito): Promise<Carrito> {
  try {
    const response = await axios.put(`${API_URL}/${carrito.carritoID}`, carrito);
    if (response.status === 200 && response.data.suceded && response.data.result) {
      return response.data.result as Carrito;
    } else {
      throw new Error('No se pudo editar el carrito');
    }
  } catch (error) {
    console.error('Error al editar el carrito:', error);
    throw error;
  }
}
