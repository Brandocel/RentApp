import axios from 'axios';

const API_URL = 'https://localhost:7141'; // Reemplaza con la URL de tu API

const GolfService = {
  obtenerCarritos: async () => {
    try {
      const response = await axios.get(`${API_URL}/Carritos`);
      console.log('API response:', response.data);
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.result && Array.isArray(response.data.result)) {
        return response.data.result;
      } else {
        console.error('Unexpected response format:', response.data);
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      const err = error as any; // Aquí se hace casting del error a 'any'
      if (err.response) {
        console.error('Error fetching carts:', err.response.data);
      } else if (err.request) {
        console.error('No response received:', err.request);
      } else {
        console.error('Error setting up request:', err.message);
      }
      throw error;
    }
  },

  obtenerCarritoPorId: async (id: number) => {
    try {
      const response = await axios.get(`${API_URL}/Carritos/${id}`);
      return response.data;
    } catch (error) {
      const err = error as any; // Aquí se hace casting del error a 'any'
      if (err.response) {
        console.error(`Error fetching cart with ID ${id}:`, err.response.data);
      } else if (err.request) {
        console.error('No response received:', err.request);
      } else {
        console.error('Error setting up request:', err.message);
      }
      throw error;
    }
  },

  crearCarrito: async (carritoData: any) => {
    try {
      const response = await axios.post(`${API_URL}/Carritos`, carritoData);
      return response.data;
    } catch (error) {
      const err = error as any; // Aquí se hace casting del error a 'any'
      if (err.response) {
        console.error('Error creating cart:', err.response.data);
      } else if (err.request) {
        console.error('No response received:', err.request);
      } else {
        console.error('Error setting up request:', err.message);
      }
      throw error;
    }
  },

  actualizarCarrito: async (id: number, carritoData: any) => {
    try {
      const response = await axios.put(`${API_URL}/Carritos/${id}`, carritoData);
      return response.data;
    } catch (error) {
      const err = error as any; // Aquí se hace casting del error a 'any'
      if (err.response) {
        console.error(`Error updating cart with ID ${id}:`, err.response.data);
      } else if (err.request) {
        console.error('No response received:', err.request);
      } else {
        console.error('Error setting up request:', err.message);
      }
      throw error;
    }
  },

  eliminarCarrito: async (id: number) => {
    try {
      const response = await axios.delete(`${API_URL}/Carritos/${id}`);
      return response.data;
    } catch (error) {
      const err = error as any; // Aquí se hace casting del error a 'any'
      if (err.response) {
        console.error(`Error deleting cart with ID ${id}:`, err.response.data);
      } else if (err.request) {
        console.error('No response received:', err.request);
      } else {
        console.error('Error setting up request:', err.message);
      }
      throw error;
    }
  }
};

export default GolfService;
