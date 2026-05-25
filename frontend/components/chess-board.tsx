'use client'

import { useEffect, useRef, useState } from 'react'

const SQUARE_SIZE = 60

const PIECE_IMAGES: Record<string, string> = {
  'K': 'wK.svg', 'Q': 'wQ.svg', 'R': 'wR.svg',
  'B': 'wB.svg', 'N': 'wN.svg', 'P': 'wP.svg',
  'k': 'bK.svg', 'q': 'bQ.svg', 'r': 'bR.svg',
  'b': 'bB.svg', 'n': 'bN.svg', 'p': 'bP.svg',
}
const BASE_URL = 'https://lichess1.org/assets/piece/cburnett/'

const STARTING_POSITION = [
  ['r','n','b','q','k','b','n','r'],
  ['p','p','p','p','p','p','p','p'],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['P','P','P','P','P','P','P','P'],
  ['R','N','B','Q','K','B','N','R'],
]

const MOVE_SEQUENCE: Array<{ from: string; to: string }> = [
  { from: 'e2', to: 'e4' },
  { from: 'e7', to: 'e5' },
  { from: 'g1', to: 'f3' },
  { from: 'b8', to: 'c6' },
  { from: 'f1', to: 'c4' },
  { from: 'f8', to: 'c5' },
]

function squareToCoords(sq: string): [number, number] {
  const col = sq.charCodeAt(0) - 97
  const row = 8 - parseInt(sq[1])
  return [row, col]
}

export function ChessBoard() {
  const [board, setBoard] = useState(() =>
    STARTING_POSITION.map(row => [...row])
  )
  const [highlighted, setHighlighted] = useState<string[]>([])
  const moveIndexRef = useRef(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const current = moveIndexRef.current

      if (current >= MOVE_SEQUENCE.length) {
        setBoard(STARTING_POSITION.map(row => [...row]))
        setHighlighted([])
        moveIndexRef.current = 0
        return
      }

      const move = MOVE_SEQUENCE[current]
      const [fromR, fromC] = squareToCoords(move.from)
      const [toR, toC] = squareToCoords(move.to)

      setBoard(b => {
        const next = b.map(row => [...row])
        next[toR][toC] = next[fromR][fromC]
        next[fromR][fromC] = ''
        return next
      })
      setHighlighted([move.from, move.to])
      moveIndexRef.current = current + 1
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: 480,
      aspectRatio: '1',
      borderRadius: 4,
      overflow: 'hidden',
      border: '2px solid rgba(109,190,69,0.20)',
      boxShadow: '0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(109,190,69,0.06)',
    }}>
      <svg
        viewBox={`0 0 ${8 * SQUARE_SIZE} ${8 * SQUARE_SIZE}`}
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        {board.map((row, ri) =>
          row.map((piece, ci) => {
            const isLight = (ri + ci) % 2 === 0
            const file = String.fromCharCode(97 + ci)
            const rank = 8 - ri
            const sqName = `${file}${rank}`
            const isHighlit = highlighted.includes(sqName)

            return (
              <g key={`${ri}-${ci}`}>
                <rect
                  x={ci * SQUARE_SIZE}
                  y={ri * SQUARE_SIZE}
                  width={SQUARE_SIZE}
                  height={SQUARE_SIZE}
                  fill={isLight ? '#b8c9a3' : '#6a8f5a'}
                />
                {isHighlit && (
                  <rect
                    x={ci * SQUARE_SIZE}
                    y={ri * SQUARE_SIZE}
                    width={SQUARE_SIZE}
                    height={SQUARE_SIZE}
                    fill="rgba(255, 220, 0, 0.45)"
                  />
                )}
                {piece && PIECE_IMAGES[piece] && (
                  <image
                    href={`${BASE_URL}${PIECE_IMAGES[piece]}`}
                    x={ci * SQUARE_SIZE + 3}
                    y={ri * SQUARE_SIZE + 3}
                    width={SQUARE_SIZE - 6}
                    height={SQUARE_SIZE - 6}
                  />
                )}
                {ci === 0 && (
                  <text
                    x={2}
                    y={ri * SQUARE_SIZE + 13}
                    fontSize={10}
                    fill={isLight ? '#6a8f5a' : '#b8c9a3'}
                    fontFamily="monospace"
                    fontWeight="600"
                  >
                    {8 - ri}
                  </text>
                )}
                {ri === 7 && (
                  <text
                    x={ci * SQUARE_SIZE + SQUARE_SIZE - 11}
                    y={ri * SQUARE_SIZE + SQUARE_SIZE - 3}
                    fontSize={10}
                    fill={isLight ? '#6a8f5a' : '#b8c9a3'}
                    fontFamily="monospace"
                    fontWeight="600"
                  >
                    {file}
                  </text>
                )}
              </g>
            )
          })
        )}
      </svg>

      {/* Left fade only — blend with hero background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to right, #0d1117 0%, transparent 15%)',
        pointerEvents: 'none',
      }} />
    </div>
  )
}
