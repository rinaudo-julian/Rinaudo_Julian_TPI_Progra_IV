import { useMutation, useQueryClient } from '@tanstack/react-query'

import { desactivarUsuario } from '@/features/usuarios/api/usuarios'

export function useDesactivarUsuario() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: desactivarUsuario,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['usuarios'] })
    },
  })
}
