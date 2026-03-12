import { useState } from 'react'

import { cn } from '../../shared/lib/cn'
import { Button } from '../Button'

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
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleChange = (index: number, value: string) => {
    const numeric = Number(value.replace(/\D/g, ''))
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
      <div className="relative w-full max-h-[90vh] max-w-lg overflow-hidden rounded-t-2xl border border-[#D9D9D9] bg-white shadow-xl sm:max-h-none sm:rounded-[30px]">
        <div className="border-b border-[#D9D9D9] p-4 sm:p-6">
          <h2 className="pr-8 text-lg font-bold text-[#202020] sm:text-xl">
            Мой прогресс
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 text-2xl text-[#202020]/50 hover:text-[#202020]"
            aria-label="Закрыть"
          >
            &times;
          </button>
        </div>

        {noCourseId ? (
          <div className="p-4 sm:p-6">
            <p className="text-sm text-[#202020]/80">
              Чтобы сохранять прогресс, откройте тренировку из раздела «Профиль».
            </p>
            <Button className="mt-4" fullWidth onClick={onClose}>
              Закрыть
            </Button>
          </div>
        ) : exercises.length === 0 ? (
          <div className="p-4 sm:p-6">
            <p className="text-sm text-[#202020]/80">
              В этой тренировке нет упражнений с повторениями.
            </p>
            <Button className="mt-4" fullWidth onClick={onClose}>
              Закрыть
            </Button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              void handleSubmit(e)
            }}
            className="max-h-[60vh] overflow-y-auto p-4 sm:p-6"
          >
            <div className="space-y-4">
              {exercises.map((ex, idx) => (
                <div key={ex._id} className="space-y-1">
                  <label
                    htmlFor={`progress-${ex._id}`}
                    className="block text-sm font-medium text-[#202020]"
                  >
                    Сколько раз вы сделали {ex.name.toLowerCase()}?
                  </label>
                  <input
                    id={`progress-${ex._id}`}
                    type="number"
                    min={0}
                    className="w-full rounded-lg border border-[#D9D9D9] bg-white px-3 py-2 text-sm text-[#202020] outline-none focus:border-[#BCEC30]"
                    value={progress[idx] ?? 0}
                    onChange={(e) => handleChange(idx, e.target.value)}
                  />
                </div>
              ))}
            </div>
            {message && <div className={cn('mt-4 text-sm text-rose-600')}>{message}</div>}
            <div className="mt-6">
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
