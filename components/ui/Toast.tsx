'use client'

import { useEffect, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface ToastItem {
  id: number
  message: string
  type?: 'success' | 'error' | 'info'
}

let toastId = 0
let addToastFn: ((msg: string, type?: 'success' | 'error' | 'info') => void) | null = null

export function showToast(message: string, type?: 'success' | 'error' | 'info') {
  addToastFn?.(message, type)
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const addToast = useCallback((message: string, type?: 'success' | 'error' | 'info') => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3200)
  }, [])

  useEffect(() => {
    addToastFn = addToast
    return () => { addToastFn = null }
  }, [addToast])

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'px-5 py-2.5 rounded-md text-sm font-medium shadow-lg transition-all duration-200',
            toast.type === 'error' && 'bg-red-600 text-white',
            toast.type === 'success' && 'bg-green-600 text-white',
            (!toast.type || toast.type === 'info') && 'bg-[var(--text)] text-[var(--bg)]',
          )}
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}
