import { useState, useRef } from 'react'
import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'

const PASSWORD = 'butt'

export default function App() {
  const [authed, setAuthed] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const editorRef = useRef(null)

  function handleLogin() {
    if (input === PASSWORD) {
      setAuthed(true)
      setShowLogin(false)
      setError(false)
      // Directly tell the editor to leave readonly mode
      if (editorRef.current) {
        editorRef.current.updateInstanceState({ isReadonly: false })
      }
    } else {
      setError(true)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0 }}>

      <Tldraw
        persistenceKey="my1es-canvas"
        licenseKey={import.meta.env.VITE_TLDRAW_LICENSE_KEY}
        onMount={(editor) => {
          editorRef.current = editor
          editor.updateInstanceState({ isReadonly: true })
        }}
      />

      {!authed && !showLogin && (
        <button
          onClick={() => setShowLogin(true)}
          style={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000,
            padding: '6px 12px',
            fontSize: 12,
            opacity: 0.4,
            cursor: 'pointer',
            background: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
          }}
        >
          edit
        </button>
      )}

      {showLogin && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.4)',
        }}>
          <div style={{
            background: '#fff',
            padding: 24,
            borderRadius: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            minWidth: 240,
          }}>
            <input
              autoFocus
              type="password"
              placeholder="password"
              value={input}
              onChange={e => { setInput(e.target.value); setError(false) }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{ padding: '8px 12px', fontSize: 16, borderRadius: 6, border: '1px solid #ccc' }}
            />
            {error && <p style={{ color: 'red', margin: 0, fontSize: 13 }}>wrong password</p>}
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleLogin} style={{ flex: 1, padding: '8px', cursor: 'pointer' }}>login</button>
              <button onClick={() => { setShowLogin(false); setError(false) }} style={{ flex: 1, padding: '8px', cursor: 'pointer' }}>cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
