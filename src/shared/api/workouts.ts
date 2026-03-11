import { apiClient } from './client'

export type ApiExercise = {
  _id: string
  name: string
  quantity: number
}

export type ApiWorkout = {
  _id: string
  name: string
  video: string
  exercises: ApiExercise[]
}

export type WorkoutProgress = {
  workoutId: string
  workoutCompleted?: boolean
  progressData?: number[]
}

export type CourseProgress = {
  courseId: string
  courseCompleted?: boolean
  workoutsProgress?: WorkoutProgress[]
}

export function fetchWorkout(workoutId: string) {
  return apiClient.get<ApiWorkout>(`/workouts/${workoutId}`)
}

export function fetchCourseProgress(courseId: string, token: string) {
  return apiClient.get<CourseProgress>(
    `/users/me/progress?courseId=${encodeURIComponent(courseId)}`,
    token,
  )
}

export function fetchWorkoutProgress(courseId: string, workoutId: string, token: string) {
  return apiClient.get<WorkoutProgress>(
    `/users/me/progress?courseId=${encodeURIComponent(
      courseId,
    )}&workoutId=${encodeURIComponent(workoutId)}`,
    token,
  )
}

export function saveWorkoutProgress(
  courseId: string,
  workoutId: string,
  progressData: number[],
  token: string,
) {
  return apiClient.patch<{ message: string }>(
    `/courses/${courseId}/workouts/${workoutId}`,
    { progressData },
    token,
  )
}

export function resetWorkoutProgress(courseId: string, workoutId: string, token: string) {
  return apiClient.patch<{ message: string }>(
    `/courses/${courseId}/workouts/${workoutId}/reset`,
    {},
    token,
  )
}
