import { useForm } from '@tanstack/react-form'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import { handleApiError } from '../../../shared/api/handleApiError'
import Button from '../../../shared/ui/Button'
import Card from '../../../shared/ui/Card'
import Input from '../../../shared/ui/Input'
import { useAuthStore } from '../../../store/authStore'
import { useRegistrar } from '../hooks/useRegistrar'
import type { EstadoNavegacionLogin } from '../types/usuario'
import {
  validarEmail,
  validarNombreCompleto,
  validarPassword,
  validarUsername,
} from '../validaciones'

function RegisterPage() {
  const usuario = useAuthStore((estado) => estado.usuario)
  const registrar = useRegistrar()
  const navigate = useNavigate()

  const formulario = useForm({
    defaultValues: { username: '', full_name: '', email: '', password: '' },
    onSubmit: ({ value }) => {
      registrar.mutate(
        {
          username: value.username.trim(),
          full_name: value.full_name.trim(),
          email: value.email.trim(),
          password: value.password,
        },
        {
          onSuccess: () => {
            const estado: EstadoNavegacionLogin = { registrado: true }
            navigate('/login', { replace: true, state: estado })
          },
        },
      )
    },
  })

  if (usuario) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Crear cuenta</h1>
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
            validators={{ onChange: ({ value }) => validarUsername(value) }}
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
            name="full_name"
            validators={{ onChange: ({ value }) => validarNombreCompleto(value) }}
            children={(campo) => (
              <Input
                id={campo.name}
                label="Nombre completo"
                autoComplete="name"
                value={campo.state.value}
                onChange={(evento) => campo.handleChange(evento.target.value)}
                onBlur={campo.handleBlur}
                error={campo.state.meta.isTouched ? campo.state.meta.errors[0] : undefined}
              />
            )}
          />
          <formulario.Field
            name="email"
            validators={{ onChange: ({ value }) => validarEmail(value) }}
            children={(campo) => (
              <Input
                id={campo.name}
                label="Email"
                type="email"
                autoComplete="email"
                value={campo.state.value}
                onChange={(evento) => campo.handleChange(evento.target.value)}
                onBlur={campo.handleBlur}
                error={campo.state.meta.isTouched ? campo.state.meta.errors[0] : undefined}
              />
            )}
          />
          <formulario.Field
            name="password"
            validators={{ onChange: ({ value }) => validarPassword(value) }}
            children={(campo) => (
              <Input
                id={campo.name}
                label="Contraseña"
                type="password"
                autoComplete="new-password"
                value={campo.state.value}
                onChange={(evento) => campo.handleChange(evento.target.value)}
                onBlur={campo.handleBlur}
                error={campo.state.meta.isTouched ? campo.state.meta.errors[0] : undefined}
              />
            )}
          />
          {registrar.isError && (
            <p className="text-sm text-red-600">{handleApiError(registrar.error)}</p>
          )}
          <Button type="submit" cargando={registrar.isPending}>
            Registrarme
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="text-orange-600 hover:underline">
            Iniciá sesión
          </Link>
        </p>
      </Card>
    </div>
  )
}

export default RegisterPage
