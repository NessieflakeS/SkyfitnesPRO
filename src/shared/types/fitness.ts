export type CourseId = string
export type WorkoutId = string

export type Course = {
  id: CourseId
  title: string
  description: string
  level: 'beginner' | 'medium' | 'hard'
  durationDays: number
  dailyMinutesFrom: number
  dailyMinutesTo: number
  directions: string[]
  fitting: string[]
  workoutIds: WorkoutId[]
  coverColor: string
}

export type Exercise = {
  id: string
  name: string
  quantity: number
}

export type Workout = {
  id: WorkoutId
  courseId: CourseId
  title: string
  youtubeEmbedUrl: string
  exercises: Exercise[]
}
