/* eslint-disable import/order */
import { BrowserRouter } from 'react-router-dom'

import { AuthProvider } from '../shared/auth/AuthContext'
import { AppRoutes } from './AppRoutes'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
