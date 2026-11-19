import { axiosInstance } from '../../../shared/api/axiosInstance'
import type { Pedido, PedidoCreate } from '../types/pedido'

export async function crearPedido(datos: PedidoCreate): Promise<Pedido> {
  const { data } = await axiosInstance.post<Pedido>('/pedidos', datos)
  return data
}
