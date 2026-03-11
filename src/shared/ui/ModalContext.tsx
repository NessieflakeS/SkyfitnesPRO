import { createContext, useContext, useState, type ReactNode } from 'react'

type ModalContextValue = {
  isAuthModalOpen: boolean
  openAuthModal: (courseId?: string) => void
  closeAuthModal: () => void
  pendingCourseId: string | null
}

const ModalContext = createContext<ModalContextValue | null>(null)

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [pendingCourseId, setPendingCourseId] = useState<string | null>(null)

  const openAuthModal = (courseId?: string) => {
    setPendingCourseId(courseId ?? null)
    setIsAuthModalOpen(true)
  }

  const closeAuthModal = () => {
    setIsAuthModalOpen(false)
    setPendingCourseId(null)
  }

  return (
    <ModalContext.Provider
      value={{
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        pendingCourseId,
      }}
    >
      {children}
    </ModalContext.Provider>
  )
}

export function useModal() {
  const ctx = useContext(ModalContext)
  if (!ctx) {
    throw new Error('useModal must be used within ModalProvider')
  }
  return ctx
}