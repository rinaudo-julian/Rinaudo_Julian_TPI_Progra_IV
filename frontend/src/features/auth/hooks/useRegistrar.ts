import { useMutation } from '@tanstack/react-query'

import { registrarUsuario } from '@/features/auth/api/auth'

export function useRegistrar() {
  return useMutation({ mutationFn: registrarUsuario })
}
