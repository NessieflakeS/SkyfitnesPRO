import { Link } from 'react-router-dom'

import styles from './style.module.css'

export function NotFoundPage() {
  return (
    <div className={styles.card}>
      <div className={styles.code}>404</div>
      <div className={styles.title}>Страница не найдена</div>
      <p className={styles.description}>Такой страницы нет. Вернитесь к списку курсов.</p>
      <div className={styles.actions}>
        <Link to="/" className={styles.link}>
          На главную
        </Link>
      </div>
    </div>
  )
}
