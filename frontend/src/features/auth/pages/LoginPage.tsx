import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'

import { handleApiError } from '../../../shared/api/handleApiError'
import Button from '../../../shared/ui/Button'
import Card from '../../../shared/ui/Card'
import Input from '../../../shared/ui/Input'
import { useAuthStore } from '../../../store/authStore'
import { ROLES, type EstadoNavegacionLogin, type Usuario } from '../types/usuario'
import { validarObligatorio } from '../validaciones'

function destinoDespuesDeLogin(usuario: Usuario, desde?: string): string {
  if (desde) return desde
  return usuario.role === ROLES.ADMIN ? '/admin/resumen' : '/'
}

function LoginPage() {
  const usuario = useAuthStore((estado) => estado.usuario)
  const login = useAuthStore((estado) => estado.login)
  const location = useLocation()
  const estadoNavegacion = location.state as EstadoNavegacionLogin | null
  const [errorDeLogin, setErrorDeLogin] = useState<string | null>(null)

  const formulario = useForm({
    defaultValues: { username: '', password: '' },
    onSubmit: async ({ value }) => {
      setErrorDeLogin(null)
      try {
        await login(value.username.trim(), value.password)
      } catch (error) {
        setErrorDeLogin(handleApiError(error))
      }
    },
  })

  if (usuario) {
    return <Navigate to={destinoDespuesDeLogin(usuario, estadoNavegacion?.desde)} replace />
  }

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Iniciar sesión</h1>
        {estadoNavegacion?.registrado && (
          <p className="mb-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
            Cuenta creada. Ya podés iniciar sesión.
          </p>
        )}
        <form
          noValidate
          className="flex flex-col gap-4"
          onSubmit={(evento) => {
            evento.preventDefault()
            void formulario.handleSubmit()
          }}
        >
          <formulario.Field
            name="username"
            validators={{ onChange: ({ value }) => validarObligatorio(value) }}
            children={(campo) => (
              <Input
                id={campo.name}
                label="Usuario"
                autoComplete="username"
                value={campo.state.value}
                onChange={(evento) => campo.handleChange(evento.target.value)}
                onBlur={campo.handleBlur}
                error={campo.state.meta.isTouched ? campo.state.meta.errors[0] : undefined}
              />
            )}
          />
          <formulario.Field
            name="password"
            validators={{ onChange: ({ value }) => validarObligatorio(value) }}
            children={(campo) => (
              <Input
                id={campo.name}
                label="Contraseña"
                type="password"
                autoComplete="current-password"
                value={campo.state.value}
                onChange={(evento) => campo.handleChange(evento.target.value)}
                onBlur={campo.handleBlur}
                error={campo.state.meta.isTouched ? campo.state.meta.errors[0] : undefined}
              />
            )}
          />
          {errorDeLogin && <p className="text-sm text-red-600">{errorDeLogin}</p>}
          <formulario.Subscribe
            selector={(estado) => estado.isSubmitting}
            children={(enviando) => (
              <Button type="submit" cargando={enviando}>
                Ingresar
              </Button>
            )}
          />
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          ¿No tenés cuenta?{' '}
          <Link to="/register" className="text-orange-600 hover:underline">
            Registrate
          </Link>
        </p>
      </Card>
    </div>
  )
}

export default LoginPage
