const formateadorDeFecha = new Intl.DateTimeFormat('es-AR', {
  dateStyle: 'short',
  timeStyle: 'short',
})

export function formatearFecha(fechaIso: string): string {
  return formateadorDeFecha.format(new Date(fechaIso))
}
