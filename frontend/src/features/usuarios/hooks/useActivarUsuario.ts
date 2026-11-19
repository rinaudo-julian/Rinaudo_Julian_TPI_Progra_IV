import { useMutation, useQueryClient } from '@tanstack/react-query'

import { activarUsuario } from '@/features/usuarios/api/usuarios'

export function useActivarUsuario() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: activarUsuario,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['usuarios'] })
    },
  })
}
