/**
 * Маппинг названия курса (nameRU) на slug и опционально — на имена файлов.
 * Если для курса задано имя файла — используется оно, иначе {slug}.jpg.
 */
const COURSE_SLUG: Record<string, string> = {
  йога: 'yoga',
  стретчинг: 'stretching',
  фитнес: 'fitness',
  'степ-аэробика': 'step-aerobics',
  бодифлекс: 'bodyflex',
}

/** Опциональные имена файлов по slug (banner, card, cta). Если нет — баннер {slug}.png, карточка/cta — по умолчанию .jpg */
const COURSE_FILES: Record<string, { banner?: string; card?: string; cta?: string }> = {
  yoga: { card: 'card_1.png' },
  stretching: { card: 'card_2.png' },
  fitness: { card: 'card_3.png' },
  'step-aerobics': { card: 'card_4.png' },
  bodyflex: { card: 'card_5.png' },
}

const BASE = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || ''
const IMAGE_BASE = `${BASE.replace(/\/$/, '')}/images/courses`
const DEFAULT_EXT = '.jpg'

function getSlug(nameRU: string): string {
  const key = nameRU.toLowerCase().trim()
  return COURSE_SLUG[key] ?? key.replace(/\s+/g, '-')
}

const FOLDERS: Record<'banner' | 'card' | 'cta', string> = {
  banner: 'banners',
  card: 'cards',
  cta: 'cta',
}

function pathFor(type: 'banner' | 'card' | 'cta', slug: string): string {
  const files = COURSE_FILES[slug]?.[type]
  const ext = type === 'banner' ? '.png' : DEFAULT_EXT
  const filename = files ?? `${slug}${ext}`
  return `${IMAGE_BASE}/${FOLDERS[type]}/${encodeURIComponent(filename)}`
}

/**
 * Путь к картинке баннера курса (страница курса — верхний блок).
 * Явный путь из public, чтобы загрузка не зависела от BASE_URL.
 */
export function getCourseBannerImagePath(nameRU: string): string {
  const slug = getSlug(nameRU)
  return `/images/courses/banners/${encodeURIComponent(`${slug}.png`)}`
}

/**
 * Путь к картинке карточки курса (главная, профиль).
 * Явный путь из public.
 */
export function getCourseCardImagePath(nameRU: string): string {
  const slug = getSlug(nameRU)
  const filename = COURSE_FILES[slug]?.card ?? `${slug}.jpg`
  return `/images/courses/cards/${encodeURIComponent(filename)}`
}

/**
 * Путь к картинке блока CTA на странице курса («Начните путь к новому телу»).
 */
export function getCourseCtaImagePath(nameRU: string): string {
  return pathFor('cta', getSlug(nameRU))
}

export type CourseImageType = 'banner' | 'card' | 'cta'

const GETTERS: Record<CourseImageType, (nameRU: string) => string> = {
  banner: getCourseBannerImagePath,
  card: getCourseCardImagePath,
  cta: getCourseCtaImagePath,
}

export function getCourseImagePath(nameRU: string, type: CourseImageType): string {
  return GETTERS[type](nameRU)
}
