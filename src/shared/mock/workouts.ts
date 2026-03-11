import type { Workout } from '../types/fitness'

export const workoutsMock: Workout[] = [
  {
    id: 'yoga-1',
    courseId: 'yoga',
    title: 'Урок 1. Дыхание и мягкая разминка',
    youtubeEmbedUrl: 'https://www.youtube.com/embed/gJPs7b8SpVw',
    exercises: [
      { id: 'ex-1', name: 'Дыхание (циклы)', quantity: 10 },
      { id: 'ex-2', name: 'Кошка-корова (повторы)', quantity: 12 },
      { id: 'ex-3', name: 'Собака мордой вниз (сек.)', quantity: 40 },
    ],
  },
  {
    id: 'yoga-2',
    courseId: 'yoga',
    title: 'Урок 2. Основные движения',
    youtubeEmbedUrl: 'https://www.youtube.com/embed/gJPs7b8SpVw',
    exercises: [
      { id: 'ex-4', name: 'Крендель (повторы)', quantity: 15 },
      { id: 'ex-5', name: 'Планка (сек.)', quantity: 30 },
      { id: 'ex-6', name: 'Скрутки (повторы)', quantity: 20 },
    ],
  },
  {
    id: 'yoga-3',
    courseId: 'yoga',
    title: 'Урок 3. Восстановление',
    youtubeEmbedUrl: 'https://www.youtube.com/embed/gJPs7b8SpVw',
    exercises: [
      { id: 'ex-7', name: 'Растяжка спины (сек.)', quantity: 60 },
      { id: 'ex-8', name: 'Поза ребёнка (сек.)', quantity: 60 },
    ],
  },
  {
    id: 'stretch-1',
    courseId: 'stretching',
    title: 'Урок 1. Стретчинг всего тела',
    youtubeEmbedUrl: 'https://www.youtube.com/embed/gJPs7b8SpVw',
    exercises: [
      { id: 'ex-9', name: 'Наклоны (повторы)', quantity: 12 },
      { id: 'ex-10', name: 'Выпады (сек.)', quantity: 30 },
      { id: 'ex-11', name: 'Плечи (сек.)', quantity: 30 },
    ],
  },
  {
    id: 'stretch-2',
    courseId: 'stretching',
    title: 'Урок 2. Мобилити',
    youtubeEmbedUrl: 'https://www.youtube.com/embed/gJPs7b8SpVw',
    exercises: [
      { id: 'ex-12', name: 'Тазобедренные (сек.)', quantity: 40 },
      { id: 'ex-13', name: 'Грудной отдел (повторы)', quantity: 10 },
    ],
  },
  {
    id: 'power-1',
    courseId: 'power',
    title: 'Урок 1. Ноги и ягодицы',
    youtubeEmbedUrl: 'https://www.youtube.com/embed/gJPs7b8SpVw',
    exercises: [
      { id: 'ex-14', name: 'Приседания (повторы)', quantity: 15 },
      { id: 'ex-15', name: 'Выпады (повторы)', quantity: 12 },
      { id: 'ex-16', name: 'Мостик (повторы)', quantity: 20 },
    ],
  },
  {
    id: 'power-2',
    courseId: 'power',
    title: 'Урок 2. Верх тела',
    youtubeEmbedUrl: 'https://www.youtube.com/embed/gJPs7b8SpVw',
    exercises: [
      { id: 'ex-17', name: 'Отжимания (повторы)', quantity: 10 },
      { id: 'ex-18', name: 'Тяга (повторы)', quantity: 12 },
    ],
  },
  {
    id: 'power-3',
    courseId: 'power',
    title: 'Урок 3. Кор',
    youtubeEmbedUrl: 'https://www.youtube.com/embed/gJPs7b8SpVw',
    exercises: [
      { id: 'ex-19', name: 'Скручивания (повторы)', quantity: 20 },
      { id: 'ex-20', name: 'Планка (сек.)', quantity: 40 },
    ],
  },
  {
    id: 'power-4',
    courseId: 'power',
    title: 'Урок 4. Интервалы',
    youtubeEmbedUrl: 'https://www.youtube.com/embed/gJPs7b8SpVw',
    exercises: [
      { id: 'ex-21', name: 'Берпи (повторы)', quantity: 10 },
      { id: 'ex-22', name: 'Скалолаз (сек.)', quantity: 30 },
    ],
  },
]

export function getWorkoutById(workoutId: string) {
  return workoutsMock.find((w) => w.id === workoutId) ?? null
}
