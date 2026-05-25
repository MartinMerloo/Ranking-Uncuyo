export function PulsingDot({ className }: { className?: string }) {
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full bg-chess-green pulse-dot ${className ?? ''}`}
      aria-hidden
    />
  )
}
