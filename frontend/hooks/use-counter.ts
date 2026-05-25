'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

export function useCounter(target: number, duration = 1400) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView || target === 0) return

    const startTime = Date.now()
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))

      if (progress >= 1) {
        clearInterval(timer)
        setCount(target)
      }
    }, 16)

    return () => clearInterval(timer)
  }, [isInView, target, duration])

  return { count, ref }
}
