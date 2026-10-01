import { describe, it, expect, vi } from 'vitest'
import {
  composeEncuadreLabel,
  loadWithTimeout,
  wrapLabelLines,
  LABEL_ART_SCALE,
  LABEL_METRICS,
} from '@services/encuadreLabelIcons'

function fakeCtx() {
  return {
    save: vi.fn(),
    restore: vi.fn(),
    clip: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    arcTo: vi.fn(),
    closePath: vi.fn(),
    fill: vi.fn(),
    fillRect: vi.fn(),
    drawImage: vi.fn(),
    fillText: vi.fn(),
    measureText: vi.fn((s: string) => ({ width: s.length * 10 })),
    getImageData: vi.fn((x: number, y: number, w: number, h: number) => ({
      data: new Uint8ClampedArray(Math.max(1, w * h * 4)),
    })),
    font: '',
    fillStyle: '',
    textAlign: '',
    textBaseline: '',
    shadowColor: '',
    shadowBlur: 0,
    shadowOffsetY: 0,
  }
}

function makeFactory() {
  const ctx = fakeCtx()
  const canvas = { width: 0, height: 0, getContext: () => ctx }
  return { ctx, factory: () => canvas as unknown as HTMLCanvasElement }
}

describe('wrapLabelLines', () => {
  const measure = (s: string) => s.length * 10

  it('respeta saltos explícitos con \\n', () => {
    expect(wrapLabelLines('Mosaico de\ncuencas y aguas', measure, 220)).toEqual([
      'Mosaico de',
      'cuencas y aguas',
    ])
  })

  it('envuelve por palabras al superar el ancho máximo', () => {
    expect(wrapLabelLines('uno dos tres cuatro', measure, 80)).toEqual(['uno dos', 'tres', 'cuatro'])
  })

  it('conserva entera una palabra más larga que el máximo', () => {
    expect(wrapLabelLines('supercalifragilistico', measure, 50)).toEqual(['supercalifragilistico'])
  })
})

describe('composeEncuadreLabel', () => {
  it('devuelve RGBA con padding y llama fillText por línea', () => {
    const { factory, ctx } = makeFactory()
    const result = composeEncuadreLabel('AB', {
      metrics: LABEL_METRICS,
      textColor: '#ffffff',
      bg: null,
      fallbackBg: '#0a2240',
      factory,
    })
    /* 'AB' → 20px contenido + 2*7*2 padding = 48; alto 1*16*2 + 2*7*2 = 60 */
    expect(result.width).toBe(48)
    expect(result.height).toBe(60)
    expect(result.data).toHaveLength(48 * 60 * 4)
    expect(ctx.fillText).toHaveBeenCalledTimes(1)
    expect(ctx.fillStyle).toBe('#ffffff')
  })

  it('dibuja el fondo cover cuando hay bg y sólido cuando no', () => {
    const withBg = makeFactory()
    const bg = { width: 100, height: 50 } as unknown as CanvasImageSource
    composeEncuadreLabel('AB', {
      metrics: LABEL_METRICS,
      textColor: '#ffffff',
      bg,
      fallbackBg: '#0a2240',
      factory: withBg.factory,
    })
    expect(withBg.ctx.drawImage).toHaveBeenCalled()

    const fallback = makeFactory()
    composeEncuadreLabel('AB', {
      metrics: LABEL_METRICS,
      textColor: '#ffffff',
      bg: null,
      fallbackBg: '#0a2240',
      factory: fallback.factory,
    })
    expect(fallback.ctx.drawImage).not.toHaveBeenCalled()
    expect(fallback.ctx.fillRect).toHaveBeenCalled()
  })

  it('usa fuente itálica Noto Sans al doble de escala', () => {
    const { factory, ctx } = makeFactory()
    composeEncuadreLabel('AB', {
      metrics: LABEL_METRICS,
      textColor: '#ffffff',
      bg: null,
      fallbackBg: '#0a2240',
      factory,
    })
    expect(ctx.font).toContain(`italic 500 ${LABEL_METRICS.fontPx * LABEL_ART_SCALE}px`)
    expect(ctx.font).toContain('Noto Sans')
  })

  it('lanza si no hay contexto 2d', () => {
    const factory = () => ({ width: 0, height: 0, getContext: () => null }) as unknown as HTMLCanvasElement
    expect(() =>
      composeEncuadreLabel('AB', { metrics: LABEL_METRICS, textColor: '#fff', bg: null, fallbackBg: '#000', factory }),
    ).toThrow()
  })
})

describe('loadWithTimeout', () => {
  it('resuelve null si la imagen nunca carga (tope)', async () => {
    /* jsdom: Image jamás dispara onload/onerror → debe ganar el timeout */
    await expect(loadWithTimeout('/no-existe.webp', 10)).resolves.toBeNull()
  })
})
