import { useState } from 'react'

import { cn } from '../../shared/lib/cn'
import { Button } from '../Button'

import styles from './style.module.css'

import type { ApiExercise } from '../../shared/api/workouts'

type Props = {
  exercises: ApiExercise[]
  initialProgress: number[]
  onSave: (progress: number[]) => Promise<void>
  onClose: () => void
  noCourseId?: boolean
}

export function ProgressModal({
  exercises,
  initialProgress,
  onSave,
  onClose,
  noCourseId,
}: Props) {
  const [progress, setProgress] = useState<number[]>(initialProgress)
  const [inputValues, setInputValues] = useState<string[]>(
    initialProgress.map((value) => (value > 0 ? String(value) : '')),
  )
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, '')
    setInputValues((prev) => prev.map((item, idx) => (idx === index ? cleaned : item)))
    const numeric = cleaned === '' ? 0 : Number(cleaned)
    if (Number.isNaN(numeric)) return
    setProgress((prev) => prev.map((item, idx) => (idx === index ? numeric : item)))
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setMessage(null)
    try {
      setSaving(true)
      await onSave(progress)
      onClose()
    } catch {
      setMessage('Не удалось сохранить прогресс')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Мой прогресс</h2>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Закрыть"
          >
            &times;
          </button>
        </div>

        {noCourseId ? (
          <div className={styles.stateBlock}>
            <p className={styles.stateText}>
              Чтобы сохранять прогресс, откройте тренировку из раздела «Профиль».
            </p>
            <Button className={styles.stateAction} fullWidth onClick={onClose}>
              Закрыть
            </Button>
          </div>
        ) : exercises.length === 0 ? (
          <div className={styles.stateBlock}>
            <p className={styles.stateText}>
              В этой тренировке нет упражнений с повторениями.
            </p>
            <Button className={styles.stateAction} fullWidth onClick={onClose}>
              Закрыть
            </Button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              void handleSubmit(e)
            }}
            className={styles.form}
          >
            <div className={styles.exerciseList}>
              {exercises.map((ex, idx) => (
                <div key={ex._id} className={styles.exerciseItem}>
                  <label htmlFor={`progress-${ex._id}`} className={styles.label}>
                    Сколько раз вы сделали {ex.name.toLowerCase()}?
                  </label>
                  <input
                    id={`progress-${ex._id}`}
                    type="number"
                    min={0}
                    className={styles.input}
                    value={inputValues[idx] ?? ''}
                    placeholder="Введите число"
                    onChange={(e) => handleChange(idx, e.target.value)}
                  />
                </div>
              ))}
            </div>
            {message && <div className={cn(styles.message)}>{message}</div>}
            <div className={styles.submitWrap}>
              <Button type="submit" fullWidth disabled={saving}>
                {saving ? 'Сохранение…' : 'Сохранить'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
