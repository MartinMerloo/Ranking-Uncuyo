'use client'

import { useEffect, useState } from 'react'

const INITIAL_BOARD: (string | null)[][] = [
  ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
  ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
  ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'],
]

const MOVE_SEQUENCE: [number, number, number, number][] = [
  [6, 4, 4, 4], // e2-e4
  [1, 4, 3, 4], // e7-e5
  [7, 6, 5, 5], // Nf3
  [0, 1, 2, 2], // Nc6
  [7, 5, 3, 1], // Bb5
  [1, 0, 2, 0], // a6
  [7, 3, 4, 0], // Qa4
  [0, 6, 2, 5], // Nf6
]

export function ChessBoard() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((s) => (s + 1) % MOVE_SEQUENCE.length)
    }, 2500)
    return () => clearInterval(timer)
  }, [])

  const [fromRow, fromCol, toRow, toCol] = MOVE_SEQUENCE[step]
  const flat = INITIAL_BOARD.flat()

  return (
    <div className="relative w-full aspect-square max-w-md mx-auto select-none">
      <div className="absolute inset-0 grid grid-cols-8 rounded-xl overflow-hidden border border-white/10 shadow-2xl">
        {flat.map((piece, i) => {
          const row = Math.floor(i / 8)
          const col = i % 8
          const isLight = (row + col) % 2 === 0
          const isHighlighted =
            (row === fromRow && col === fromCol) ||
            (row === toRow && col === toCol)

          return (
            <div
              key={i}
              className="flex items-center justify-center"
              style={{
                background: isHighlighted
                  ? 'rgba(109, 190, 69, 0.45)'
                  : isLight
                  ? '#eeeed2'
                  : '#769656',
                transition: 'background 0.4s ease',
              }}
            >
              {piece !== null && (
                <span
                  className="text-lg leading-none"
                  style={{
                    color: piece <= '♙' ? '#ffffff' : '#1a1a1a',
                    textShadow:
                      piece <= '♙'
                        ? '0 1px 3px rgba(0,0,0,0.9)'
                        : '0 1px 2px rgba(255,255,255,0.3)',
                  }}
                >
                  {piece}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Left fade */}
      <div
        className="absolute inset-y-0 left-0 w-1/5 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to right, var(--background) 0%, transparent 100%)',
        }}
      />
      {/* Top fade */}
      <div
        className="absolute inset-x-0 top-0 h-1/5 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to bottom, var(--background) 0%, transparent 100%)',
        }}
      />
      {/* Bottom fade */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/5 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to top, var(--background) 0%, transparent 100%)',
        }}
      />
    </div>
  )
}
