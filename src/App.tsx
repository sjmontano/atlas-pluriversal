import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ModalRenderer } from '@components/modal/ModalRenderer'

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

const ENABLE_DEV_TOOLS = import.meta.env.VITE_DEV_TOOLS === 'true'

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
    <BrowserRouter>
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route path="/" element={<Navigate to="/dev" replace />} />
          <Route path="/dev" element={<DevMenu />} />
          <Route path="/modales" element={<ModalDemoPage />} />
          {ENABLE_DEV_TOOLS && <Route path="/dev/ui" element={<UiMockupPage />} />}
          <Route path="/test/:mapId" element={<TestMapPage />} />
        </Routes>
        <ModalRenderer />
      </Suspense>
    </BrowserRouter>
  )
}
