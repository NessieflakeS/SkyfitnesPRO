import type { ApiCourse } from '../api/courses'
import type { Course } from '../types/fitness'

/** Цвета фона баннера — по макетам */
const BANNER_COLORS: Record<string, string> = {
  йога: 'bg-[#FFC700]',
  стретчинг: 'bg-[#2491D2]',
  фитнес: 'bg-[#F7A012]',
  'степ-аэробика': 'bg-[#FF7E65]',
  бодифлекс: 'bg-[#7D458C]',
}

export function getCourseBannerColor(nameRU: string): string {
  const key = nameRU.toLowerCase().trim()
  return BANNER_COLORS[key] ?? 'bg-[#facc15]'
}

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
