'use client'

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export function AdminLoading({ label = 'Cargando...' }: { label?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground"
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm">{label}</p>
    </motion.div>
  )
}
