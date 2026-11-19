import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import {
  cerrarSesion,
  iniciarSesion,
  obtenerUsuarioActual,
} from '@/features/auth/api/auth'
import type { Usuario } from '@/features/auth/types/usuario'
import { useCartStore } from '@/store/cartStore'

interface AuthState {
  usuario: Usuario | null
  cargando: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkSession: () => Promise<void>
  limpiarSesion: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      cargando: true,
      login: async (username, password) => {
        await iniciarSesion(username, password)
        const usuario = await obtenerUsuarioActual()
        set({ usuario })
      },
      logout: async () => {
        try {
          await cerrarSesion()
        } finally {
          set({ usuario: null })
          useCartStore.getState().vaciar()
        }
      },
      checkSession: async () => {
        set({ cargando: true })
        try {
          const usuario = await obtenerUsuarioActual()
          set({ usuario })
        } catch {
          set({ usuario: null })
        } finally {
          set({ cargando: false })
        }
      },
      limpiarSesion: () => set({ usuario: null }),
    }),
    {
      name: 'auth',
      partialize: (estado) => ({ usuario: estado.usuario }),
    },
  ),
)
