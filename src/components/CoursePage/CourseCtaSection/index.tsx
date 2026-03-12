import { Button } from '../../Button'

import styles from './style.module.css'

type Props = {
  ctaBullets: string[]
  description: string
  isOwned: boolean
  isAuthenticated: boolean
  adding: boolean
  addError: string | null
  onAddCourse: () => Promise<void>
  onRequireAuth: () => void
}

export function CourseCtaSection({
  ctaBullets,
  description,
  isOwned,
  isAuthenticated,
  adding,
  addError,
  onAddCourse,
  onRequireAuth,
}: Props) {
  return (
    <section className={styles.section}>
      <div className={styles.layout}>
        <div className={styles.content}>
          <h2 className={styles.title}>
            Начните путь
            <br />к новому телу
          </h2>
          {ctaBullets.length > 0 ? (
            <ul className={styles.bullets}>
              {ctaBullets.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className={styles.description}>{description}</p>
          )}
          <div className={styles.actions}>
            {isOwned ? (
              <Button disabled fullWidth className={styles.button}>
                Добавлен
              </Button>
            ) : (
              <Button
                fullWidth
                className={styles.button}
                onClick={() => (isAuthenticated ? void onAddCourse() : onRequireAuth())}
                disabled={adding}
              >
                {isAuthenticated ? 'Добавить курс' : 'Войдите, чтобы добавить курс'}
              </Button>
            )}
          </div>
          {addError && <p className={styles.error}>{addError}</p>}
        </div>
        <div className={styles.visualSlot} aria-hidden />
      </div>
    </section>
  )
}
