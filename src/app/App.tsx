import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../shared/auth/AuthContext'
import { ModalProvider } from '../shared/ui/ModalContext'
import { AppRoutes } from './AppRoutes'

export default function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ModalProvider>
    </AuthProvider>
  )
}