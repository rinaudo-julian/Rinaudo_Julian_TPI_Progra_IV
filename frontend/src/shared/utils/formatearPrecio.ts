const formateadorDePrecio = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
})

export function formatearPrecio(monto: number): string {
  return formateadorDePrecio.format(monto)
}
