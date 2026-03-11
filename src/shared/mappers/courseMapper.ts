import type { ApiCourse } from '../api/courses'
import type { Course } from '../types/fitness'

export function mapApiCourseToCourse(api: ApiCourse): Course {
  return {
    id: api._id,
    title: api.nameRU,
    description: api.description,
    level:
      api.difficulty === 'сложный'
        ? 'hard'
        : api.difficulty === 'средний'
          ? 'medium'
          : 'beginner',
    durationDays: api.durationInDays,
    dailyMinutesFrom: api.dailyDurationInMinutes.from,
    dailyMinutesTo: api.dailyDurationInMinutes.to,
    directions: api.directions,
    fitting: api.fitting,
    workoutIds: api.workouts,
    coverColor: 'from-slate-900 to-indigo-700',
  }
}
