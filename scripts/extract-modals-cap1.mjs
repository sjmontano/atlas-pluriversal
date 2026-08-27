/**
 * 📤 EXTRACT MODALS CAP1 — Extrae highLight/texto/link de modalsData.jsx (v17)
 * ==============================================================================
 * Genera `src/content/modals/cap1-textos.generated.ts` con los textos LITERALES
 * de los modales del Capítulo 1 (presentaciones 0–7, cuencas 8–18, voz del
 * río 23–26). Correr una vez; el archivo generado se versiona.
 *
 * Uso: node scripts/extract-modals-cap1.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const SRC = resolve(
  process.cwd(),
  '../atlas_front/atlas_frontend_v17/src/components/Home/Modal/modalsData.jsx',
)
const OUT = resolve(process.cwd(), 'src/content/modals/cap1-textos.generated.ts')

const TARGET_IDS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 23, 24, 25, 26]

const src = readFileSync(SRC, 'utf8')

function extractBlock(id) {
  const start = src.indexOf(`id: ${id},`)
  if (start === -1) return null
  const next = src.slice(start + 1).search(/\n    id: \d+,/)
  const block = next === -1 ? src.slice(start) : src.slice(start, start + 1 + next)

  const highLight = block.match(/highLight:\s*"((?:[^"\\]|\\.)*)"/)?.[1] ?? null
  const textoRaw = block.match(/texto:\s*\n\s*"((?:[^"\\]|\\.)*)"/)?.[1] ?? null
  const link = block.match(/link:\s*"([^"]*)"/)?.[1] ?? ''

  const unescape = (s) => {
    try {
      return JSON.parse(`"${s}"`)
    } catch {
      return s
    }
  }

  return {
    id: String(id),
    highLight: highLight === null ? null : unescape(highLight),
    // texto null = era JSX en v17 (se porta a mano en el módulo de contenido)
    texto: textoRaw === null ? null : unescape(textoRaw),
    link,
  }
}

const entries = []
for (const id of TARGET_IDS) {
  const e = extractBlock(id)
  if (e === null) {
    console.error(`✗ id ${id}: no encontrado`)
    continue
  }
  if (e.texto === null) console.warn(`⚠ id ${id}: texto JSX (portar a mano) — highLight: ${e.highLight}`)
  entries.push(e)
}

const body = entries
  .map((e) => {
    const fields = [
      `  highLight: ${JSON.stringify(e.highLight)}`,
      `  texto: ${JSON.stringify(e.texto)}`,
      `  link: ${JSON.stringify(e.link)}`,
    ].join(',\n')
    return `  '${e.id}': {\n${fields},\n}`
  })
  .join(',\n')

const out = `/**
 * 📄 CAP1 TEXTOS (GENERADO) — Textos literales de modalsData.jsx de v17
 * ======================================================================
 * Generado por scripts/extract-modals-cap1.mjs — NO editar a mano:
 * los textos son el contenido editorial oficial del Capítulo 1.
 * texto: null = en v17 era JSX (ver chapter-1.ts para su port manual).
 */

export interface Cap1Texto {
  highLight: string | null
  texto: string | null
  link: string
}

export const CAP1_TEXTOS: Record<string, Cap1Texto> = {
${body},
}
`

writeFileSync(OUT, out, 'utf8')
console.log(`✓ ${entries.length} entradas → ${OUT}`)
