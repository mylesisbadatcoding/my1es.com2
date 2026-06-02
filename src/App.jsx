import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'

export default function App() {
  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Tldraw licenseKey={import.meta.env.VITE_TLDRAW_LICENSE_KEY} />
    </div>
  )
}
