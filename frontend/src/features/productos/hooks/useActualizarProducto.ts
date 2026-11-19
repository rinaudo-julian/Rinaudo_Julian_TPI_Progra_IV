import { useMutation, useQueryClient } from '@tanstack/react-query'

import { actualizarProducto } from '@/features/productos/api/productos'

export function useActualizarProducto() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: actualizarProducto,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['productos'] })
    },
  })
}
