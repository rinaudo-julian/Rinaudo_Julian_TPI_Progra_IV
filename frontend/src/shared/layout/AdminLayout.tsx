import { NavLink, Outlet } from 'react-router-dom'

const SECCIONES_DEL_PANEL = [
  { ruta: '/admin/resumen', etiqueta: 'Resumen' },
  { ruta: '/admin/pedidos', etiqueta: 'Pedidos' },
  { ruta: '/admin/categorias', etiqueta: 'Categorías' },
  { ruta: '/admin/productos', etiqueta: 'Productos' },
  { ruta: '/admin/usuarios', etiqueta: 'Usuarios' },
]

function claseDePestania({ isActive }: { isActive: boolean }): string {
  return `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-100'}`
}

const AdminLayout = () => {
  return (
    <div className="flex flex-col gap-6">
      <nav aria-label="Secciones del panel" className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {SECCIONES_DEL_PANEL.map((seccion) => (
          <NavLink key={seccion.ruta} to={seccion.ruta} className={claseDePestania}>
            {seccion.etiqueta}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  )
}

export default AdminLayout
