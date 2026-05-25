'use client'

import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

const STARTING_POSITION = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
] as const

const UNICODE_PIECES: Record<string, string> = {
  K: '♔',
  Q: '♕',
  R: '♖',
  B: '♗',
  N: '♘',
  P: '♙',
  k: '♚',
  q: '♛',
  r: '♜',
  b: '♝',
  n: '♞',
  p: '♟',
}

const MOVE_SEQUENCE: [string, string][] = [
  ['e2', 'e4'],
  ['e7', 'e5'],
  ['f1', 'c4'],
  ['g8', 'f6'],
  ['g1', 'f3'],
]

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

function squareToCoords(square: string): { row: number; col: number } {
  const file = square.charCodeAt(0) - 'a'.charCodeAt(0)
  const rank = parseInt(square[1], 10)
  return { row: 8 - rank, col: file }
}

function isWhitePiece(piece: string) {
  return piece === piece.toUpperCase() && piece !== ''
}

export function ChessBoard({ className }: { className?: string }) {
  const [moveIndex, setMoveIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setMoveIndex((i) => (i + 1) % MOVE_SEQUENCE.length)
    }, 2500)
    return () => clearInterval(id)
  }, [])

  const highlighted = useMemo(() => {
    const [from, to] = MOVE_SEQUENCE[moveIndex]
    const a = squareToCoords(from)
    const b = squareToCoords(to)
    return new Set([`${a.row}-${a.col}`, `${b.row}-${b.col}`])
  }, [moveIndex])

  return (
    <div className={cn('relative mx-auto w-full max-w-[420px]', className)}>
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16"
        style={{
          background: 'linear-gradient(to right, #111827, transparent)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8"
        style={{
          background: 'linear-gradient(to bottom, #111827, transparent)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8"
        style={{
          background: 'linear-gradient(to top, #111827, transparent)',
        }}
      />

      <div className="overflow-hidden rounded-sm border border-[var(--chess-border)]">
        <div className="grid grid-cols-8">
          {STARTING_POSITION.map((row, rowIndex) =>
            row.map((piece, colIndex) => {
              const isLight = (rowIndex + colIndex) % 2 === 0
              const isHighlight = highlighted.has(`${rowIndex}-${colIndex}`)
              const showFile = rowIndex === 7
              const showRank = colIndex === 0

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="relative flex aspect-square items-center justify-center"
                  style={{
                    backgroundColor: isHighlight
                      ? 'rgba(109, 190, 69, 0.22)'
                      : isLight
                        ? '#2d3d52'
                        : '#1a2638',
                  }}
                >
                  {piece && (
                    <span
                      className="select-none text-[clamp(1.25rem,4.5vw,2rem)] leading-none"
                      style={{
                        color: isWhitePiece(piece) ? '#e8ded0' : '#6DBE45',
                      }}
                    >
                      {UNICODE_PIECES[piece]}
                    </span>
                  )}
                  {showFile && (
                    <span
                      className="absolute bottom-0.5 right-1 text-[9px]"
                      style={{ color: 'rgba(109, 190, 69, 0.4)' }}
                    >
                      {FILES[colIndex]}
                    </span>
                  )}
                  {showRank && (
                    <span
                      className="absolute left-1 top-0.5 text-[9px]"
                      style={{ color: 'rgba(109, 190, 69, 0.4)' }}
                    >
                      {8 - rowIndex}
                    </span>
                  )}
                </div>
              )
            }),
          )}
        </div>
      </div>
    </div>
  )
}
