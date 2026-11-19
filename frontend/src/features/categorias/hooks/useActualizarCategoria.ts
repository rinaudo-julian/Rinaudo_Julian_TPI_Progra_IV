import { useMutation, useQueryClient } from '@tanstack/react-query'

import { actualizarCategoria } from '@/features/categorias/api/categorias'

export function useActualizarCategoria() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: actualizarCategoria,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['categorias'] })
    },
  })
}
