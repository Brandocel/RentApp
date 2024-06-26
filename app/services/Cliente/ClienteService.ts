// ClienteService.ts
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

export default { obtenerClientes };
