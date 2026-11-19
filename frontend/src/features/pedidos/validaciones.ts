export function validarDireccion(direccion: string): string | undefined {
  const largo = direccion.trim().length
  if (largo < 5) return 'Mínimo 5 caracteres'
  if (largo > 200) return 'Máximo 200 caracteres'
  return undefined
}
