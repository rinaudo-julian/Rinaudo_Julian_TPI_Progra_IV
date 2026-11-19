import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import LoginPage from '../features/auth/pages/LoginPage'
import RegisterPage from '../features/auth/pages/RegisterPage'
import UnauthorizedPage from '../features/auth/pages/UnauthorizedPage'
import CarritoPage from '../features/pedidos/pages/CarritoPage'
import CheckoutPage from '../features/pedidos/pages/CheckoutPage'
import CatalogoPage from '../features/productos/pages/CatalogoPage'
import MainLayout from '../shared/layout/MainLayout'
import ProtectedRoute from './ProtectedRoute'

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<CatalogoPage />} />
          <Route path="/carrito" element={<CarritoPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<CheckoutPage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
