import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { obtenerPedidos } from '../api/pedidos'
import type { FiltrosPedidos } from '../types/pedido'

export function usePedidos(filtros: FiltrosPedidos) {
  return useQuery({
    queryKey: ['pedidos', filtros],
    queryFn: () => obtenerPedidos(filtros),
    placeholderData: keepPreviousData,
  })
}
