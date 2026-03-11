import type { Course } from '../types/fitness'

export const coursesMock: Course[] = [
  {
    id: 'yoga',
    title: 'Йога',
    description:
      'Мягкая практика для гибкости, осанки и спокойствия. Подходит для восстановления и снятия стресса.',
    level: 'beginner',
    durationDays: 20,
    dailyMinutesFrom: 20,
    dailyMinutesTo: 40,
    directions: ['Гибкость', 'Осанка', 'Дыхание'],
    fitting: ['Новичкам', 'Для восстановления', 'Для дома'],
    workoutIds: ['yoga-1', 'yoga-2', 'yoga-3'],
    coverColor: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'stretching',
    title: 'Стретчинг',
    description:
      'Комплекс на растяжку всего тела: больше подвижности, меньше зажатости и больше энергии каждый день.',
    level: 'medium',
    durationDays: 14,
    dailyMinutesFrom: 25,
    dailyMinutesTo: 45,
    directions: ['Растяжка', 'Мобилити', 'Суставы'],
    fitting: ['Тем, кто много сидит', 'После силовых', 'Для гибкости'],
    workoutIds: ['stretch-1', 'stretch-2'],
    coverColor: 'from-fuchsia-500 to-pink-500',
  },
  {
    id: 'power',
    title: 'Силовой',
    description:
      'Силовые тренировки с прогрессией нагрузки. Работаем над тонусом, выносливостью и формой.',
    level: 'hard',
    durationDays: 28,
    dailyMinutesFrom: 30,
    dailyMinutesTo: 60,
    directions: ['Сила', 'Выносливость', 'Тонус'],
    fitting: ['Продвинутым', 'С опытом тренировок', 'Для результата'],
    workoutIds: ['power-1', 'power-2', 'power-3', 'power-4'],
    coverColor: 'from-slate-900 to-indigo-700',
  },
]

export function getCourseLevelLabel(level: Course['level']) {
  switch (level) {
    case 'beginner':
      return 'начальный'
    case 'medium':
      return 'средний'
    case 'hard':
      return 'сложный'
  }
}
