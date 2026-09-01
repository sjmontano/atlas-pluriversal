/**
 * 🖼️ FRAME — Marcos del IconButton (identidad visual por sección)
 * ===============================================================
 * Arte oficial de v17: icon-frame-1..4 (bitmap PNG embebido en SVG,
 * servido desde /assets/ui/frames/). Se renderiza como <img> porque
 * el arte es bitmap, no vectorial — igual que el icon-background de v17.
 * API intacta: `variant='1'..'4'` con fallback '1'.
 */

const FRAME_ASSETS: Record<string, string> = {
  '1': '/assets/ui/frames/icon-frame-1.svg',
  '2': '/assets/ui/frames/icon-frame-2.svg',
  '3': '/assets/ui/frames/icon-frame-3.svg',
  '4': '/assets/ui/frames/icon-frame-4.svg',
}

export interface FrameProps {
  variant?: string
}

export function Frame({ variant = '1' }: FrameProps) {
  const src = FRAME_ASSETS[variant] ?? FRAME_ASSETS['1']
  if (!src) return null
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      draggable={false}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  )
}
