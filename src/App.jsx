import { useState } from 'react'
import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'

const PASSWORD = 'butt'

export default function App() {
  const [authed, setAuthed] = useState(false)
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  if (!authed) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif', gap: 12 }}>
        <h2>my1es.com</h2>
        <input
          type="password"
          placeholder="password"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              input === PASSWORD ? setAuthed(true) : setError(true)
            }
          }}
          style={{ padding: '8px 12px', fontSize: 16 }}
        />
        {error && <p style={{ color: 'red', margin: 0 }}>wrong password</p>}
      </div>
    )
  }

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Tldraw
        licenseKey={import.meta.env.VITE_TLDRAW_LICENSE_KEY}
        persistenceKey="my1es-canvas"
      />
    </div>
  )
}
