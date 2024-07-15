export interface Renta {
  status: string;
  rentaID: number;
  clienteFK: string;
  carritoFK: string;
  vendedorFK: string;
  horaInicio: string;
  horaFinal: string;
  total: number;
}
