import { Link } from 'react-router-dom'

import styles from './style.module.css'

type Props = {
  message: string
}

export function CourseNotFoundState({ message }: Props) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Курс не найден</h1>
      <p className={styles.description}>{message}</p>
      <div className={styles.actions}>
        <Link className={styles.link} to="/">
          Перейти к курсам
        </Link>
      </div>
    </div>
  )
}
