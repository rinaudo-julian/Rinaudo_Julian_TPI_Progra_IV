import { axiosInstance } from '../../../shared/api/axiosInstance'
import type {
  FiltrosPedidos,
  Pedido,
  PedidoCreate,
  PedidosPaginados,
} from '../types/pedido'

export async function crearPedido(datos: PedidoCreate): Promise<Pedido> {
  const { data } = await axiosInstance.post<Pedido>('/pedidos', datos)
  return data
}

export async function obtenerPedidos(
  filtros: FiltrosPedidos,
): Promise<PedidosPaginados> {
  const { data } = await axiosInstance.get<PedidosPaginados>('/pedidos', {
    params: filtros,
  })
  return data
}

export async function cancelarPedido(id: number): Promise<Pedido> {
  const { data } = await axiosInstance.patch<Pedido>(`/pedidos/${id}/cancelar`)
  return data
}
