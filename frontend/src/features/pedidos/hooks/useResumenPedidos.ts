import { useQuery } from '@tanstack/react-query'

import { obtenerResumenPedidos } from '@/features/pedidos/api/pedidos'

export function useResumenPedidos() {
  return useQuery({
    queryKey: ['pedidos', 'resumen'],
    queryFn: obtenerResumenPedidos,
  })
}
