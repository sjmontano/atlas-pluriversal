/**
 * 🧪 MAQUETA SHELL (dev-only) — Chrome completo con datos de prueba
 * ==================================================================
 * Ruta `/dev/shell` (solo VITE_DEV_TOOLS=true). Monta ShellLayout real
 * sobre un "mapa" falso para refinar posición/tamaños/estados de los
 * widgets sin cargar MapLibre. Los datos falsos viven AQUÍ, nunca en
 * content/.
 */

import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useChapterStore } from '@stores/chapterStore'
import { ShellLayout } from '@components/shell/ShellLayout'
import type { ToolRailItem } from '@components/shell/ToolRail'
import styles from './ShellMockupPage.module.css'

const ENABLE_DEV_TOOLS = import.meta.env.VITE_DEV_TOOLS === 'true'

const RAIL_ITEMS: ToolRailItem[] = [
  { id: 'm-presentacion', icon: 'presentation', label: 'Presentación', frame: '1', action: { kind: 'modal', modalId: 'cuenca-cauca' } },
  { id: 'm-ficha', icon: 'fichatecnica', label: 'Ficha técnica', frame: '3', action: { kind: 'modal', modalId: 'ficha-tecnica' } },
  { id: 'm-galeria', icon: 'gallery', label: 'Galería', frame: '2', action: { kind: 'modal', modalId: 'galeria-ejemplo' } },
  { id: 'm-aviso', icon: 'info', label: 'Aviso', frame: '3', action: { kind: 'modal', modalId: 'en-construccion' } },
  { id: 'm-descarga', icon: 'download', label: 'Descargar', frame: '3', action: { kind: 'link', href: 'about:blank' } },
  { id: 'm-goto', icon: 'datos', label: 'Ir a Cap. II', frame: '4', action: { kind: 'goto', to: '/capitulo/2' } },
]

function ShellMockup() {
  useEffect(() => {
    useChapterStore.getState().goToChapter(1)
  }, [])

  return (
    <div className={styles.stage}>
      <p className={styles.note}>
        Maqueta <strong>/dev/shell</strong> · chrome real (header, ToolRail,
        ChapterTabs, MiniMap, norte, HomeNav) sobre un mapa falso ·{' '}
        <Link to="/dev" className={styles.link}>volver al menú</Link>
      </p>
    </div>
  )
}

export function ShellMockupPage() {
  if (!ENABLE_DEV_TOOLS) {
    return (
      <div className={styles.devOff}>
        <p>Maqueta del shell desactivada. Ejecuta el dev con <code>VITE_DEV_TOOLS=true</code>.</p>
        <Link to="/dev">← Menú</Link>
      </div>
    )
  }
  return (
    <ShellLayout
      title="Iniciamos nuestro recorrido"
      backTo="/"
      railItems={RAIL_ITEMS}
      minimap="cuenca"
    >
      <ShellMockup />
    </ShellLayout>
  )
}
