import axios from 'axios';

const baseURL = 'https://localhost:7141';

const RentaService = {
  obtenerRentas: async () => {
    try {
      const response = await axios.get(`${baseURL}/Renta`);
      if (response.data.suceded) {
        return response.data.result;
      } else {
        throw new Error(response.data.message || 'Error desconocido al obtener rentas');
      }
    } catch (error: any) {
      console.error('Error fetching rentas:', error.message);
      return [];
    }
  },

  agregarRenta: async (renta: any) => {
    try {
      const response = await axios.post(`${baseURL}/Renta`, renta);
      if (response.data.suceded) {
        return response.data.result;
      } else {
        throw new Error(response.data.message || 'Error desconocido al agregar renta');
      }
    } catch (error: any) {
      console.error('Error adding renta:', error.message);
      return null;
    }
  },

  eliminarRenta: async (rentaID: number) => {
    try {
      const response = await axios.delete(`${baseURL}/Renta/${rentaID}`);
      if (response.data.suceded) {
        return response.data.result;
      } else {
        throw new Error(response.data.message || 'Error desconocido al eliminar renta');
      }
    } catch (error: any) {
      console.error('Error deleting renta:', error.message);
      return null;
    }
  },
};

export default RentaService;
