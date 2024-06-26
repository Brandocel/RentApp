import axios from 'axios';

const API_URL = 'https://localhost:7141'; // Reemplaza con la URL de tu API

const VendedorService = {
  obtenerVendedores: async () => {
    try {
      const response = await axios.get(`${API_URL}/Vendedor`);
      return response.data;
    } catch (error) {
      console.error('Error fetching vendors:', error);
      throw error;
    }
  },
  obtenerVendedorPorId: async (id: number) => {
    try {
      const response = await axios.get(`${API_URL}/Vendedor/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching vendor with ID ${id}:`, error);
      throw error;
    }
  },
};

export default VendedorService;
