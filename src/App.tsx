import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ModalRenderer } from '@components/modal/shell/ModalRenderer'

import { DEV_TOOLS } from '@config'

const DevMenu = lazy(() =>
  import('@pages/DevMenu.tsx').then((m) => ({ default: m.DevMenu })),
)
const TestMapPage = lazy(() =>
  import('@pages/TestMapPage.tsx').then((m) => ({ default: m.TestMapPage })),
)
const ModalDemoPage = lazy(() =>
  import('@pages/ModalDemoPage.tsx').then((m) => ({ default: m.ModalDemoPage })),
)
const UiMockupPage = lazy(() =>
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
const ShellMockupPage = lazy(() =>
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
  useEffect(() => {
    const timer = setTimeout(() => {
      void import('@pages/TestMapPage.tsx')
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <BrowserRouter basename={import.meta.env.VITE_ATLAS_BASE ?? '/'}>
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route path="/" element={<InicioPage />} />
          <Route path="/intro" element={<IntroMapPage />} />
          <Route path="/capitulo/:chapterId" element={<ChapterEntry />} />
          <Route path="/capitulo/:chapterId/:mapId" element={<ChapterPage />} />
          <Route path="/dev" element={<DevMenu />} />
          <Route path="/modales" element={<ModalDemoPage />} />
          {DEV_TOOLS && <Route path="/dev/ui" element={<UiMockupPage />} />}
          {DEV_TOOLS && <Route path="/dev/shell" element={<ShellMockupPage />} />}
          <Route path="/test/:mapId" element={<TestMapPage />} />
        </Routes>
        <ModalRenderer />
      </Suspense>
    </BrowserRouter>
  )
}
