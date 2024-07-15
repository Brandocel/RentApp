import axios from 'axios';

const API_URL = 'https://localhost:7141'; // Reemplaza con la URL de tu API

const VendedorService = {
  obtenerVendedores: async () => {
    try {
      const response = await axios.get(`${API_URL}/Vendedor`);
      if (response.data && response.data.suceded) {
        return response.data.result;
      } else {
        throw new Error('API response not successful');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching vendors:', error.response?.data);
      } else {
        console.error('Unknown error:', error);
      }
      throw error;
    }
  },
  obtenerVendedorPorId: async (id: number) => {
    try {
      const response = await axios.get(`${API_URL}/Vendedor/${id}`);
      if (response.data && response.data.suceded) {
        return response.data.result;
      } else {
        throw new Error('API response not successful');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`Error fetching vendor with ID ${id}:`, error.response?.data);
      } else {
        console.error('Unknown error:', error);
      }
      throw error;
    }
  },
};

export default VendedorService;
