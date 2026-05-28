import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Ranking UNCuyo - Liga de Ajedrez Universitaria'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#111827',
          position: 'relative',
        }}
      >
        {/* Subtle grid pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(109,190,69,0.08) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          display: 'flex',
        }} />

        {/* Green accent top bar */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 4,
          background: '#6DBE45',
          display: 'flex',
        }} />

        {/* Logo circle */}
        <div style={{
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'rgba(109,190,69,0.12)',
          border: '2px solid rgba(109,190,69,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 32,
          fontSize: 52,
        }}>
          ♟
        </div>

        {/* Title */}
        <div style={{
          fontSize: 72,
          fontWeight: 700,
          color: '#f0ede8',
          letterSpacing: '-1px',
          marginBottom: 12,
          display: 'flex',
        }}>
          Ranking{' '}
          <span style={{ color: '#6DBE45', marginLeft: 16, display: 'flex' }}>UNCuyo</span>
        </div>

        {/* Subtitle */}
        <div style={{
          fontSize: 28,
          color: '#6b7f99',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          marginBottom: 48,
          display: 'flex',
        }}>
          Liga de Ajedrez Universitaria
        </div>

        {/* URL pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(109,190,69,0.08)',
          border: '1px solid rgba(109,190,69,0.25)',
          borderRadius: 100,
          padding: '10px 28px',
        }}>
          <div style={{
            width: 8, height: 8,
            borderRadius: '50%',
            background: '#6DBE45',
            display: 'flex',
          }} />
          <span style={{ fontSize: 22, color: '#6DBE45', display: 'flex' }}>
            ranking-uncuyo.vercel.app
          </span>
        </div>

        {/* Bottom: UNCuyo branding */}
        <div style={{
          position: 'absolute',
          bottom: 32,
          fontSize: 18,
          color: 'rgba(107,127,153,0.6)',
          display: 'flex',
        }}>
          Universidad Nacional de Cuyo · Mendoza, Argentina
        </div>
      </div>
    ),
    { ...size }
  )
}
