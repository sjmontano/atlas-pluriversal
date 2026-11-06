import { useEffect } from 'react'

const SITE = 'Atlas Pluriversal'

/** Título de la pestaña: «Mosaico de cuencas y aguas · Atlas Pluriversal». */
export function useDocumentTitle(title?: string | null): void {
  useEffect(() => {
    /* Las etiquetas de mapa pueden traer saltos de línea para el diseño. */
    const clean = title?.replace(/\s+/g, ' ').trim()
    document.title = clean ? `${clean} · ${SITE}` : SITE
  }, [title])
}
