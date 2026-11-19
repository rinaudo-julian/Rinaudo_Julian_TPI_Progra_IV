interface EstadoVacioProps {
  mensaje: string
}

const EstadoVacio = ({ mensaje }: EstadoVacioProps) => {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
      <p className="text-gray-500">{mensaje}</p>
    </div>
  )
}

export default EstadoVacio
