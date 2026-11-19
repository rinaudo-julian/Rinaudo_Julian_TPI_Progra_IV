import { useMutation, useQueryClient } from '@tanstack/react-query'

import { eliminarCategoria } from '@/features/categorias/api/categorias'

export function useEliminarCategoria() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: eliminarCategoria,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['categorias'] })
    },
  })
}
