import { useMutation, useQueryClient } from '@tanstack/react-query'

import { crearProducto } from '@/features/productos/api/productos'

export function useCrearProducto() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: crearProducto,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['productos'] })
    },
  })
}
