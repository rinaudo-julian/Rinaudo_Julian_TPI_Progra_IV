import { useState } from 'react'

import { handleApiError } from '@/shared/api/handleApiError'
import EstadoError from '@/shared/components/EstadoError'
import EstadoVacio from '@/shared/components/EstadoVacio'
import Skeleton from '@/shared/components/Skeleton'
import Button from '@/shared/ui/Button'
import Modal from '@/shared/ui/Modal'
import FormularioCategoria from '@/features/categorias/components/FormularioCategoria'
import TablaCategorias from '@/features/categorias/components/TablaCategorias'
import { useActualizarCategoria } from '@/features/categorias/hooks/useActualizarCategoria'
import { useCategorias } from '@/features/categorias/hooks/useCategorias'
import { useCrearCategoria } from '@/features/categorias/hooks/useCrearCategoria'
import { useEliminarCategoria } from '@/features/categorias/hooks/useEliminarCategoria'
import type { Categoria, CategoriaDatos } from '@/features/categorias/types/categoria'

const AdminCategoriasPage = () => {
  const [formularioAbierto, setFormularioAbierto] = useState(false)
  const [categoriaEnEdicion, setCategoriaEnEdicion] = useState<Categoria | null>(null)
  const [categoriaAEliminar, setCategoriaAEliminar] = useState<Categoria | null>(null)

  const categorias = useCategorias()
  const crear = useCrearCategoria()
  const actualizar = useActualizarCategoria()
  const eliminar = useEliminarCategoria()

  const mutacionDelFormulario = categoriaEnEdicion ? actualizar : crear

  const abrirFormulario = (categoria: Categoria | null) => {
    crear.reset()
    actualizar.reset()
    setCategoriaEnEdicion(categoria)
    setFormularioAbierto(true)
  }

  const cerrarFormulario = () => {
    setFormularioAbierto(false)
    setCategoriaEnEdicion(null)
  }

  const guardar = (datos: CategoriaDatos) => {
    if (categoriaEnEdicion) {
      actualizar.mutate({ id: categoriaEnEdicion.id, datos }, { onSuccess: cerrarFormulario })
    } else {
      crear.mutate(datos, { onSuccess: cerrarFormulario })
    }
  }

  const abrirEliminacion = (categoria: Categoria) => {
    eliminar.reset()
    setCategoriaAEliminar(categoria)
  }

  const confirmarEliminacion = (categoria: Categoria) => {
    eliminar.mutate(categoria.id, { onSuccess: () => setCategoriaAEliminar(null) })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Categorías</h1>
        <Button onClick={() => abrirFormulario(null)}>Nueva categoría</Button>
      </div>

      {categorias.isPending && <Skeleton className="h-64" />}
      {categorias.isError && (
        <EstadoError
          mensaje={handleApiError(categorias.error)}
          onReintentar={() => void categorias.refetch()}
        />
      )}
      {categorias.isSuccess && categorias.data.length === 0 && (
        <EstadoVacio mensaje="Todavía no hay categorías." />
      )}
      {categorias.isSuccess && categorias.data.length > 0 && (
        <TablaCategorias
          categorias={categorias.data}
          onEditar={abrirFormulario}
          onEliminar={abrirEliminacion}
        />
      )}

      <Modal
        titulo={categoriaEnEdicion ? `Editar ${categoriaEnEdicion.nombre}` : 'Nueva categoría'}
        abierto={formularioAbierto}
        onCerrar={cerrarFormulario}
      >
        <FormularioCategoria
          key={categoriaEnEdicion?.id ?? 'nueva'}
          categoria={categoriaEnEdicion}
          guardando={mutacionDelFormulario.isPending}
          error={
            mutacionDelFormulario.isError ? handleApiError(mutacionDelFormulario.error) : null
          }
          onGuardar={guardar}
          onCancelar={cerrarFormulario}
        />
      </Modal>

      <Modal
        titulo={categoriaAEliminar ? `Eliminar ${categoriaAEliminar.nombre}` : ''}
        abierto={categoriaAEliminar !== null}
        onCerrar={() => setCategoriaAEliminar(null)}
      >
        {categoriaAEliminar && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-700">
              ¿Seguro que querés eliminar esta categoría? Sus productos siguen en el catálogo
              hasta que los des de baja.
            </p>
            {eliminar.isError && (
              <p className="text-sm text-red-600">{handleApiError(eliminar.error)}</p>
            )}
            <div className="flex gap-2">
              <Button
                variante="peligro"
                cargando={eliminar.isPending}
                onClick={() => confirmarEliminacion(categoriaAEliminar)}
              >
                Sí, eliminar
              </Button>
              <Button variante="secundario" onClick={() => setCategoriaAEliminar(null)}>
                Volver
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default AdminCategoriasPage
