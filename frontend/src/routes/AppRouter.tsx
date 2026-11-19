import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import UnauthorizedPage from '../features/auth/pages/UnauthorizedPage'

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <h1 className="p-8 text-3xl font-bold text-gray-800">Food Store</h1>
          }
        />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
