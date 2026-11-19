import { Link } from 'react-router-dom'

function UnauthorizedPage() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold text-gray-800">Sin permiso</h1>
      <p className="text-gray-600">No tenés permisos para ver esta página.</p>
      <Link to="/" className="text-orange-600 hover:underline">
        Volver al inicio
      </Link>
    </div>
  )
}

export default UnauthorizedPage
