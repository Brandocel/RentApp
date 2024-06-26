export interface Carrito {
  clienteFK(clienteFK: any): import("react").ReactNode;
  vendedorFK(vendedorFK: any): import("react").ReactNode;
  carritoID: number;
  modelo: string;
  marca: string;
  precioHora: number;
  imgurl: string;
  enrenta: boolean;
}