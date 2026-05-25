'use client'

import { motion, type Variants } from 'framer-motion'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ChessBoard } from '@/components/chess-board'

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 chess-pattern opacity-5" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 pt-32 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="inline-flex w-fit">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                <span className="text-sm font-medium text-primary">Temporada 2026 Activa</span>
              </div>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={itemVariants}
              className="font-display text-7xl md:text-8xl lg:text-9xl leading-none"
            >
              <span className="text-foreground">RANKING</span>
              <br />
              <span className="text-primary">UNCUYO</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-lg text-muted-foreground max-w-md leading-relaxed"
            >
              Sistema oficial de clasificación de ajedrez universitario de la
              Universidad Nacional de Cuyo.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="group px-8">
                <Link href="/ranking">
                  Ver Ranking
                  <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-8 border-border/50 hover:bg-secondary"
              >
                <Link href="/tournaments">Explorar Torneos</Link>
              </Button>
            </motion.div>

            {/* Branding */}
            <motion.div variants={itemVariants} className="flex items-center gap-3 pt-2">
              <img
                src="https://ajedrezenmendoza.com.ar/uploads/content/club/49b58-uncuio.jpg"
                alt="UNCuyo"
                width={32}
                height={32}
                className="rounded-lg object-cover opacity-80"
              />
              <span className="text-xs text-muted-foreground">
                Universidad Nacional de Cuyo
              </span>
            </motion.div>
          </motion.div>

          {/* Right: Chess board */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="hidden lg:block"
          >
            <ChessBoard />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
