import { ReactNode } from "react";

export interface Renta {
  event_title: ReactNode;
  event_theme: string;
  estado: string;
  clienteID: any;
  carritoID: string;
  status: string;  // Asegúrate de incluir este nuevo campo
  rentaID: number;
  clienteFK: number;
  carritoFK: number;
  vendedorFK: number;
  horaInicio: Date;
  horaFinal: Date;
  total: number;
}
