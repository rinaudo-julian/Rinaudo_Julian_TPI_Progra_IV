import { useMutation, useQueryClient } from '@tanstack/react-query'

import { crearPedido } from '@/features/pedidos/api/pedidos'

export function useCrearPedido() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: crearPedido,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['pedidos'] })
      void queryClient.invalidateQueries({ queryKey: ['productos'] })
    },
  })
}
