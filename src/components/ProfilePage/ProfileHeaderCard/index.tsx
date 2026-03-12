import { Button } from '../../Button'

import styles from './style.module.css'

const IconPerson = () => (
  <svg
    className={styles.icon}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
  </svg>
)

type Props = {
  displayName: string
  email: string
  onLogout: () => void
}

export function ProfileHeaderCard({ displayName, email, onLogout }: Props) {
  return (
    <section className={styles.card}>
      <div className={styles.layout}>
        <div className={styles.avatar}>
          <IconPerson />
        </div>
        <div className={styles.content}>
          <div className={styles.name}>{displayName}</div>
          <div className={styles.email}>Логин: {email}</div>
          <div className={styles.actions}>
            <Button
              variant="secondary"
              onClick={onLogout}
              className={styles.logoutButton}
            >
              Выйти
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
