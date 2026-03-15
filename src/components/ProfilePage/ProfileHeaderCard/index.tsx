import { Button } from '../../Button'

import styles from './style.module.css'

const IconPerson = () => (
  <svg className={styles.icon} viewBox="0 0 240 240" fill="none" aria-hidden>
    <circle cx="120" cy="77" r="43" fill="#FFFFFF" />
    <path
      d="M0 240C8 170 55 130 120 130C185 130 232 170 240 240H0Z"
      fill="#FFFFFF"
    />
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
          <div className={styles.avatarInner}>
            <IconPerson />
          </div>
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
