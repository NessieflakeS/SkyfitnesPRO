import { apiClient } from './client'

export type ApiCourse = {
  _id: string
  nameRU: string
  nameEN: string
  description: string
  directions: string[]
  fitting: string[]
  difficulty: string
  durationInDays: number
  dailyDurationInMinutes: {
    from: number
    to: number
  }
  workouts: string[]
}

export type ApiWorkoutShort = {
  _id: string
  name: string
  video: string
  exercises: unknown[]
}

export function fetchCourses(token?: string | null) {
  return apiClient.get<ApiCourse[]>('/courses', token)
}

export function fetchCourse(courseId: string, token?: string | null) {
  return apiClient.get<ApiCourse>(`/courses/${courseId}`, token)
}

export function fetchCourseWorkouts(courseId: string, token?: string | null) {
  return apiClient.get<ApiWorkoutShort[]>(`/courses/${courseId}/workouts`, token)
}

export function addCourseForUser(courseId: string, token: string) {
  return apiClient.post<{ message: string }>('/users/me/courses', { courseId }, token)
}

export function removeCourseForUser(courseId: string, token: string) {
  return apiClient.delete<{ message: string }>(`/users/me/courses/${courseId}`, token)
}

export function resetCourseProgress(courseId: string, token: string) {
  return apiClient.patch<{ message: string }>(`/courses/${courseId}/reset`, {}, token)
}
