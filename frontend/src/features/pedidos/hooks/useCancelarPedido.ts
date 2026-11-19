import { useMutation, useQueryClient } from '@tanstack/react-query'

import { cancelarPedido } from '@/features/pedidos/api/pedidos'

export function useCancelarPedido() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: cancelarPedido,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['pedidos'] })
      void queryClient.invalidateQueries({ queryKey: ['productos'] })
    },
  })
}
