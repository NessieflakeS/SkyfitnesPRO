import styles from './style.module.css'

export function CtaRunnerImage() {
  return (
    <div className={styles.container}>
      <img
        src="/images/courses/cta/Vector%206094.svg"
        alt=""
        className={styles.stripeMobile}
        aria-hidden
      />
      <img
        src="/images/courses/cta/Vector%206094.svg"
        alt=""
        className={styles.stripeDesktop}
        aria-hidden
      />
      <img
        src="/images/courses/cta/runner.png"
        alt=""
        className={styles.runner}
        aria-hidden
      />
    </div>
  )
}
