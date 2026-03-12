import { BrowserRouter } from 'react-router-dom'

import { AuthModal } from '../components/AuthModal'
import { AuthProvider } from '../shared/auth/AuthContext'
import { ModalProvider } from '../shared/ui/ModalContext'

import { AppRoutes } from './AppRoutes'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ModalProvider>
          <AppRoutes />
          <AuthModal />
        </ModalProvider>
      </BrowserRouter>
    </AuthProvider>
  )
}
