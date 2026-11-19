import { useMutation, useQueryClient } from '@tanstack/react-query'

import { cambiarEstadoPedido } from '@/features/pedidos/api/pedidos'

export function useCambiarEstadoPedido() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: cambiarEstadoPedido,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['pedidos'] })
      void queryClient.invalidateQueries({ queryKey: ['productos'] })
    },
  })
}
