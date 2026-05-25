'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 chess-pattern opacity-5" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      
      {/* Chess Piece Silhouettes */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.05, scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] hidden lg:block"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full text-foreground">
          <path
            fill="currentColor"
            d="M50 5 L55 15 L60 15 L60 20 L58 25 L62 35 L70 40 L70 50 L65 55 L68 80 L75 85 L75 95 L25 95 L25 85 L32 80 L35 55 L30 50 L30 40 L38 35 L42 25 L40 20 L40 15 L45 15 Z"
          />
        </svg>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Temporada 2026 Activa</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
        >
          <span className="text-gold-gradient">Ranking UnCuyo</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          Sistema oficial de clasificación de ajedrez universitario de la Universidad Nacional de Cuyo
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button asChild size="lg" className="group px-8">
            <Link href="/ranking">
              Ver Ranking
              <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="px-8 border-border/50 hover:bg-secondary">
            <Link href="/tournaments">
              Explorar Torneos
            </Link>
          </Button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ height: ['20%', '40%', '20%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1 bg-primary rounded-full"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
