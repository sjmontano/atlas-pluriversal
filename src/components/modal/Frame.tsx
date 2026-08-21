/**
 * 🖼️ FRAME — Marcos del IconButton (identidad visual por sección)
 * ===============================================================
 * Placeholders vectoriales de los 4 frames de v17 (icon-frame-1..4).
 * Sustituir por los SVGs oficiales sin cambiar la API.
 */

const FRAME_VARIANTS: Record<string, { fill: string; stroke: string }> = {
  '1': { fill: '#0599b7', stroke: '#f2eee7' },
  '2': { fill: '#046c81', stroke: '#f2eee7' },
  '3': { fill: '#b98a5e', stroke: '#f2eee7' },
  '4': { fill: '#2f4f38', stroke: '#f2eee7' },
}

export interface FrameProps {
  variant?: string
}

export function Frame({ variant = '1' }: FrameProps) {
  const c = FRAME_VARIANTS[variant] ?? FRAME_VARIANTS['1']
  if (!c) return null
  return (
    <svg viewBox="0 0 115 117" fill="none" aria-hidden="true">
      <rect x="6" y="8" width="103" height="103" rx="26" fill={c.fill} />
      <rect
        x="10"
        y="12"
        width="95"
        height="95"
        rx="22"
        fill="none"
        stroke={c.stroke}
        strokeWidth="2"
      />
    </svg>
  )
}