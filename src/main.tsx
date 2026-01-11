import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  immediate: true,
  onRegistered(r) {
    // Check for updates every hour
    if (r) {
      setInterval(() => {
        r.update();
      }, 60 * 60 * 1000);
    }
  },
  onNeedRefresh() {
    // This will be called when autoUpdate is off, 
    // but with autoUpdate: true, the page should reload automatically.
    // We can still force it here just in case.
    if (confirm('发现新版本，是否立即更新？')) {
      updateSW(true);
    }
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

