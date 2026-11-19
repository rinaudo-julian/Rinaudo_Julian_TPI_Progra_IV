const LARGO_MAXIMO_PASSWORD_BYTES = 72
const PATRON_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validarUsername(username: string): string | undefined {
  const largo = username.trim().length
  if (largo < 3) return 'Mínimo 3 caracteres'
  if (largo > 50) return 'Máximo 50 caracteres'
  return undefined
}

export function validarNombreCompleto(nombre: string): string | undefined {
  const largo = nombre.trim().length
  if (largo === 0) return 'El nombre es obligatorio'
  if (largo > 100) return 'Máximo 100 caracteres'
  return undefined
}

export function validarEmail(email: string): string | undefined {
  if (!PATRON_EMAIL.test(email.trim())) return 'Ingresá un email válido'
  return undefined
}

export function validarPassword(password: string): string | undefined {
  if (password.length < 8) return 'Mínimo 8 caracteres'
  if (new TextEncoder().encode(password).length > LARGO_MAXIMO_PASSWORD_BYTES) {
    return 'La contraseña es demasiado larga'
  }
  return undefined
}

export function validarObligatorio(valor: string): string | undefined {
  if (valor.trim().length === 0) return 'Campo obligatorio'
  return undefined
}
