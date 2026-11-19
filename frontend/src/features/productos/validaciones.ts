export function validarNombreProducto(nombre: string): string | undefined {
  const largo = nombre.trim().length
  if (largo === 0) return 'El nombre es obligatorio'
  if (largo < 2) return 'Mínimo 2 caracteres'
  if (largo > 100) return 'Máximo 100 caracteres'
  return undefined
}

export function validarPrecio(precio: number): string | undefined {
  if (Number.isNaN(precio)) return 'Ingresá un número'
  if (precio < 0) return 'El precio no puede ser negativo'
  return undefined
}

export function validarCategoria(categoriaId: number): string | undefined {
  if (categoriaId === 0) return 'Elegí una categoría'
  return undefined
}

export function validarStock(stock: number): string | undefined {
  if (!Number.isInteger(stock)) return 'Ingresá un número entero'
  if (stock < 0) return 'El stock no puede ser negativo'
  return undefined
}
