import axios from 'axios';

const API_URL = 'https://localhost:7141'; // Reemplaza con la URL de tu API

const GolfService = {
  obtenerCarritos: async () => {
    try {
      const response = await axios.get(`${API_URL}/Carritos`);
      console.log('API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching carts:', error);
      throw error;
    }
  },
  obtenerCarritoPorId: async (id: number) => {
    try {
      const response = await axios.get(`${API_URL}/Carritos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching cart with ID ${id}:`, error);
      throw error;
    }
  },
  crearCarrito: async (carritoData: any) => {
    try {
      const response = await axios.post(`${API_URL}/Carritos`, carritoData);
      return response.data;
    } catch (error) {
      console.error('Error creating cart:', error);
      throw error;
    }
  },
  actualizarCarrito: async (id: number, carritoData: any) => {
    try {
      const response = await axios.put(`${API_URL}/Carritos/${id}`, carritoData);
      return response.data;
    } catch (error) {
      console.error(`Error updating cart with ID ${id}:`, error);
      throw error;
    }
  },
  eliminarCarrito: async (id: number) => {
    try {
      const response = await axios.delete(`${API_URL}/Carritos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting cart with ID ${id}:`, error);
      throw error;
    }
  }
};

export default GolfService;
