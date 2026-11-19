export function validarNombreCategoria(nombre: string): string | undefined {
  const largo = nombre.trim().length
  if (largo === 0) return 'El nombre es obligatorio'
  if (largo < 2) return 'Mínimo 2 caracteres'
  if (largo > 100) return 'Máximo 100 caracteres'
  return undefined
}
