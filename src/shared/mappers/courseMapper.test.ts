import { getCourseBannerColor, mapApiCourseToCourse } from './courseMapper'

import type { ApiCourse } from '../api/courses'

const createApiCourse = (overrides: Partial<ApiCourse> = {}): ApiCourse => ({
  _id: 'course-1',
  nameRU: 'Йога',
  nameEN: 'Yoga',
  description: 'Описание курса',
  directions: ['Гибкость'],
  fitting: ['Новичкам'],
  difficulty: 'легкий',
  durationInDays: 14,
  dailyDurationInMinutes: { from: 20, to: 30 },
  workouts: ['w1', 'w2'],
  ...overrides,
})

describe('courseMapper', () => {
  it('maps api course fields into domain model', () => {
    const apiCourse = createApiCourse({
      _id: 'abc123',
      nameRU: 'Стретчинг',
      difficulty: 'средний',
      durationInDays: 21,
      dailyDurationInMinutes: { from: 15, to: 45 },
    })

    const mapped = mapApiCourseToCourse(apiCourse)

    expect(mapped).toMatchObject({
      id: 'abc123',
      title: 'Стретчинг',
      description: 'Описание курса',
      level: 'medium',
      durationDays: 21,
      dailyMinutesFrom: 15,
      dailyMinutesTo: 45,
      directions: ['Гибкость'],
      fitting: ['Новичкам'],
      workoutIds: ['w1', 'w2'],
      coverColor: 'from-slate-900 to-indigo-700',
    })
  })

  it('maps known russian difficulty levels', () => {
    expect(mapApiCourseToCourse(createApiCourse({ difficulty: 'сложный' })).level).toBe('hard')
    expect(mapApiCourseToCourse(createApiCourse({ difficulty: 'средний' })).level).toBe(
      'medium',
    )
    expect(mapApiCourseToCourse(createApiCourse({ difficulty: 'легкий' })).level).toBe(
      'beginner',
    )
  })

  it('returns configured banner color by course title', () => {
    expect(getCourseBannerColor('Йога')).toBe('bg-[#FFC700]')
    expect(getCourseBannerColor('  фитнес  ')).toBe('bg-[#F7A012]')
  })

  it('returns default banner color for unknown title', () => {
    expect(getCourseBannerColor('Неизвестный курс')).toBe('bg-[#facc15]')
  })
})
