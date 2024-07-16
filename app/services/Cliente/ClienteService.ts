import axios from 'axios';
import { Cliente } from './typesC';

const obtenerClientes = async (): Promise<{
  map(arg0: (cliente: { registradoEn: any; }) => any): unknown; suceded: boolean, result: Cliente[], message?: string 
}> => {
  try {
    const response = await axios.get('https://localhost:7141/Cliente');
    if (response.status !== 200) {
      throw new Error('Error fetching clientes');
    }
    return response.data;
  } catch (error: any) {
    console.error('Error fetching clientes:', error.message || error);
    throw error;
  }
};

const crearCliente = async (cliente: { nombre: string, email: string, telefono: string }): Promise<{ succeeded: boolean, result: Cliente, message?: string }> => {
  try {
    const response = await axios.post('https://localhost:7141/Cliente', cliente);
    if (response.status !== 201) {
      throw new Error(`Error creating cliente: ${response.statusText}`);
    }
    return response.data;
  } catch (error: any) {
    console.error('Error creating cliente:', error.response?.data || error.message || error);
    throw error;
  }
};

// Otras funciones como actualizarCliente y eliminarCliente

export default { obtenerClientes, crearCliente };
