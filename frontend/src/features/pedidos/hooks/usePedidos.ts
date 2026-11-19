import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { obtenerPedidos } from '@/features/pedidos/api/pedidos'
import type { FiltrosPedidos } from '@/features/pedidos/types/pedido'

export function usePedidos(filtros: FiltrosPedidos) {
  return useQuery({
    queryKey: ['pedidos', filtros],
    queryFn: () => obtenerPedidos(filtros),
    placeholderData: keepPreviousData,
  })
}
