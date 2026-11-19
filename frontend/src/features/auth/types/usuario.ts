export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const

export type Rol = (typeof ROLES)[keyof typeof ROLES]

export interface Usuario {
  id: number
  username: string
  full_name: string
  email: string
  role: Rol
  disabled: boolean
  created_at: string
}

export interface MensajeRespuesta {
  message: string
}

export interface UsuarioCreate {
  username: string
  full_name: string
  email: string
  password: string
}

export interface EstadoNavegacionLogin {
  desde?: string
  registrado?: boolean
}
