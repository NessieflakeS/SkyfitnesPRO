import styles from './style.module.css'

type Props = {
  courseTitle?: string
}

function getMobileTopClass(courseTitle: string): string {
  const key = courseTitle.toLowerCase().trim()
  if (key === 'йога') return styles.mobileTopYoga
  if (key === 'стретчинг') return styles.mobileTopStretching
  if (key === 'бодифлекс') return styles.mobileTopBodyflex
  if (key === 'фитнес') return styles.mobileTopFitness
  return styles.mobileTopStep
}

export function GreenStripeLayer({ courseTitle = '' }: Props) {
  return (
    <div className={styles.container}>
      <img
        src="/images/courses/cta/Vector%206084.svg"
        alt=""
        className={`${styles.stripe} ${getMobileTopClass(courseTitle)}`}
        aria-hidden
      />
    </div>
  )
}
