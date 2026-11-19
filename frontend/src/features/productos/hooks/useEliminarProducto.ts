import { useMutation, useQueryClient } from '@tanstack/react-query'

import { eliminarProducto } from '@/features/productos/api/productos'

export function useEliminarProducto() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: eliminarProducto,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['productos'] })
    },
  })
}
