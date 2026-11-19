import { useMutation, useQueryClient } from '@tanstack/react-query'

import { actualizarStockProducto } from '@/features/productos/api/productos'

export function useActualizarStockProducto() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: actualizarStockProducto,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['productos'] })
    },
  })
}
