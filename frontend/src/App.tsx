import { useEffect } from 'react'

import AppRouter from './routes/AppRouter'
import { useAuthStore } from './store/authStore'

const App = () => {
  const checkSession = useAuthStore((estado) => estado.checkSession)

  useEffect(() => {
    void checkSession()
  }, [checkSession])

  return <AppRouter />
}

export default App
