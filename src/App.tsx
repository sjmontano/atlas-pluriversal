import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import { ModalRenderer } from '@components/modal/shell/ModalRenderer'

import { DEV_TOOLS } from '@config'
import { CHAPTERS, chapterPath } from '@data/chapters/chapters.ts'

/* Páginas de desarrollo: sus rutas solo existen con DEV_TOOLS. @__PURE__ permite
 * que la build de producción descarte el lazy sin usar, de modo que ningún chunk
 * público referencie los de estas páginas. */
const DevMenu = /* @__PURE__ */ lazy(() =>
  import('@pages/DevMenu.tsx').then((m) => ({ default: m.DevMenu })),
)
const TestMapPage = /* @__PURE__ */ lazy(() =>
  import('@pages/TestMapPage.tsx').then((m) => ({ default: m.TestMapPage })),
)
const ModalDemoPage = /* @__PURE__ */ lazy(() =>
  import('@pages/ModalDemoPage.tsx').then((m) => ({ default: m.ModalDemoPage })),
)
const UiMockupPage = /* @__PURE__ */ lazy(() =>
  import('@pages/UiMockupPage.tsx').then((m) => ({ default: m.UiMockupPage })),
)
const InicioPage = lazy(() =>
  import('@pages/InicioPage.tsx').then((m) => ({ default: m.InicioPage })),
)
const IntroMapPage = lazy(() =>
  import('@pages/IntroMapPage.tsx').then((m) => ({ default: m.IntroMapPage })),
)
const ChapterEntry = lazy(() =>
  import('@pages/ChapterPage.tsx').then((m) => ({ default: m.ChapterEntry })),
)
const ChapterPage = lazy(() =>
  import('@pages/ChapterPage.tsx').then((m) => ({ default: m.ChapterPage })),
)
const LegacyChapterRedirect = lazy(() =>
  import('@pages/ChapterPage.tsx').then((m) => ({ default: m.LegacyChapterRedirect })),
)
const LegacyMapRedirect = lazy(() =>
  import('@pages/ChapterPage.tsx').then((m) => ({ default: m.LegacyMapRedirect })),
)
const EntramadosPage = lazy(() =>
  import('@pages/EntramadosPage.tsx').then((m) => ({ default: m.EntramadosPage })),
)
const CreditsPage = lazy(() =>
  import('@pages/CreditsPage.tsx').then((m) => ({ default: m.CreditsPage })),
)
const ShellMockupPage = /* @__PURE__ */ lazy(() =>
  import('@pages/ShellMockupPage.tsx').then((m) => ({ default: m.ShellMockupPage })),
)

function Fallback() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#03091e',
      color: 'rgba(5,153,183,0.5)',
      fontSize: 'var(--text-sm)',
    }}>
      Cargando...
    </div>
  )
}

export function App() {
  /* Precalienta el visor para la primera entrada a un mapa. */
  useEffect(() => {
    const timer = setTimeout(() => {
      void import('@components/map/AtlasMap.tsx')
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <BrowserRouter basename={import.meta.env.VITE_ATLAS_BASE ?? '/'}>
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route path="/" element={<InicioPage />} />
          <Route path="/intro" element={<IntroMapPage />} />
          {CHAPTERS.map((c) => (
            <Route key={c.id} path={chapterPath(c.id)}>
              <Route index element={<ChapterEntry chapterId={c.id} />} />
              <Route path=":slug" element={<ChapterPage chapterId={c.id} />} />
            </Route>
          ))}
          <Route path="/entramados" element={<EntramadosPage />} />
          <Route path="/creditos" element={<CreditsPage />} />
          {/* Enlaces anteriores: siguen funcionando y llevan a la URL actual. */}
          <Route path="/capitulo" element={<Navigate to="/intro" replace />} />
          <Route path="/capitulo/:chapterId" element={<LegacyChapterRedirect />} />
          <Route path="/capitulo/:chapterId/:mapId" element={<LegacyMapRedirect />} />
          <Route path="/credits" element={<Navigate to="/creditos" replace />} />
          {DEV_TOOLS && <Route path="/dev" element={<DevMenu />} />}
          {DEV_TOOLS && <Route path="/modales" element={<ModalDemoPage />} />}
          {DEV_TOOLS && <Route path="/dev/ui" element={<UiMockupPage />} />}
          {DEV_TOOLS && <Route path="/dev/shell" element={<ShellMockupPage />} />}
          {DEV_TOOLS && <Route path="/test/:mapId" element={<TestMapPage />} />}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ModalRenderer />
      </Suspense>
    </BrowserRouter>
  )
}
