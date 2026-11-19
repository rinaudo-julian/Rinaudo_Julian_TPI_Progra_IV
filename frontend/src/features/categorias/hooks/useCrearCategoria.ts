import { useMutation, useQueryClient } from '@tanstack/react-query'

import { crearCategoria } from '@/features/categorias/api/categorias'

export function useCrearCategoria() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: crearCategoria,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['categorias'] })
    },
  })
}
