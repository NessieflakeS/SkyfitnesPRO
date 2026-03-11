import { Navigate, Route, Routes } from 'react-router-dom'

import { Layout } from '../components/Layout'
import { AuthPage } from '../pages/AuthPage'
import { CoursePage } from '../pages/CoursePage'
import { CoursesPage } from '../pages/CoursesPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { ProfilePage } from '../pages/ProfilePage'
import { WorkoutPage } from '../pages/WorkoutPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<CoursesPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/courses/:courseId" element={<CoursePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/workouts/:workoutId" element={<WorkoutPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  )
}
