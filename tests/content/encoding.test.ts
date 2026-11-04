import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/** UTF-8 leído como cp1252: "Ã³" por "ó", "Ã±" por "ñ", "â€" por comillas. */
const MOJIBAKE = /[ÃÂ][\u0080-¿]|â€/

function archivos(dir: string): string[] {
  return readdirSync(dir).flatMap((nombre) => {
    const ruta = join(dir, nombre)
    if (statSync(ruta).isDirectory()) return archivos(ruta)
    return ruta.endsWith('.ts') ? [ruta] : []
  })
}

describe('codificación del contenido de los mapas', () => {
  const raiz = join(process.cwd(), 'src', 'content')
  const capitulos = readdirSync(raiz)
    .filter((nombre) => nombre.startsWith('chapter-'))
    .flatMap((nombre) => archivos(join(raiz, nombre)))

  it('encuentra archivos de contenido', () => {
    expect(capitulos.length).toBeGreaterThan(0)
  })

  it.each(capitulos)('%s no tiene tildes dañadas', (ruta) => {
    const dañadas = readFileSync(ruta, 'utf-8')
      .split('\n')
      .filter((linea) => MOJIBAKE.test(linea))
    expect(dañadas).toEqual([])
  })
})
