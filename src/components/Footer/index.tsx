import styles from './style.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>© {new Date().getFullYear()} SkyFitnessPro</div>
    </footer>
  )
}
