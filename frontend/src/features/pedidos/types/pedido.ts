export const ESTADOS_PEDIDO = {
  PENDIENTE: 'PENDIENTE',
  EN_PREPARACION: 'EN_PREPARACION',
  ENTREGADO: 'ENTREGADO',
  CANCELADO: 'CANCELADO',
} as const

export type EstadoPedido = (typeof ESTADOS_PEDIDO)[keyof typeof ESTADOS_PEDIDO]

export const FORMAS_PAGO = {
  EFECTIVO: 'EFECTIVO',
  TRANSFERENCIA: 'TRANSFERENCIA',
} as const

export type FormaPago = (typeof FORMAS_PAGO)[keyof typeof FORMAS_PAGO]

export interface DetallePedido {
  producto_id: number
  nombre_producto: string
  precio_unitario: number
  cantidad: number
  subtotal: number
}

export interface Pedido {
  id: number
  usuario_id: number
  estado: EstadoPedido
  forma_pago: FormaPago
  direccion_entrega: string
  notas: string | null
  total: number
  created_at: string
  updated_at: string
  items: DetallePedido[]
}

export interface PedidosPaginados {
  total: number
  items: Pedido[]
}

export interface ItemPedidoCreate {
  producto_id: number
  cantidad: number
}

export interface PedidoCreate {
  items: ItemPedidoCreate[]
  forma_pago: FormaPago
  direccion_entrega: string
  notas: string | null
}

export interface FiltrosPedidos {
  skip: number
  limit: number
  estado?: EstadoPedido
}
