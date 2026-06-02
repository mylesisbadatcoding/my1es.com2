import { useState, useRef } from 'react'
import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'

const PASSWORD = 'butthole'
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const CLOUDINARY_UPLOAD_PRESET = 'tldraw_assets'
const REPO = 'mylesisbadatcoding/my1es.com2'
const FILE_PATH = 'public/canvas.json'

async function uploadImageToCloudinary(file) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  )
  const data = await res.json()
  return data.secure_url
}

async function loadCanvasFromGitHub() {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
    headers: { Authorization: `Bearer ${GITHUB_TOKEN}` }
  })
  const data = await res.json()
  const content = JSON.parse(decodeURIComponent(escape(atob(data.content))))
  return { snapshot: content, sha: data.sha }
}

async function saveCanvasToGitHub(snapshot, sha) {
  const content = btoa(unescape(encodeURIComponent(JSON.stringify(snapshot))))
  await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: 'update canvas',
      content,
      sha,
    })
  })
}

export default function App() {
  const [authed, setAuthed] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const [saving, setSaving] = useState(false)
  const editorRef = useRef(null)
  const shaRef = useRef(null)

  async function handleMount(editor) {
    editorRef.current = editor
    editor.updateInstanceState({ isReadonly: true })

    // Override asset uploads to use Cloudinary
    editor.registerExternalAssetHandler('file', async ({ file }) => {
      const url = await uploadImageToCloudinary(file)
      return {
        id: `asset:${Date.now()}`,
        typeName: 'asset',
        type: 'image',
        props: {
          name: file.name,
          src: url,
          w: 0,
          h: 0,
          mimeType: file.type,
          isAnimated: false,
          fileSize: file.size,
        },
        meta: {},
      }
    })

    const { snapshot, sha } = await loadCanvasFromGitHub()
    shaRef.current = sha
    if (snapshot && Object.keys(snapshot).length > 0) {
      editor.loadSnapshot(snapshot)
    }

    editor.setCamera({ x: 0, y: 0, z: 1 })
  }

  function handleLogin() {
    if (input === PASSWORD) {
      setAuthed(true)
      setShowLogin(false)
      setError(false)
      editorRef.current?.updateInstanceState({ isReadonly: false })
    } else {
      setError(true)
    }
  }

  async function handleSave() {
    setSaving(true)
    const snapshot = editorRef.current.getSnapshot()
    await saveCanvasToGitHub(snapshot, shaRef.current)
    const { sha } = await loadCanvasFromGitHub()
    shaRef.current = sha
    setSaving(false)
  }

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Tldraw
        persistenceKey="my1es-canvas"
        licenseKey={import.meta.env.VITE_TLDRAW_LICENSE_KEY}
        onMount={handleMount}
      />

      {!authed && !showLogin && (
        <button
          onClick={() => setShowLogin(true)}
          style={{
            position: 'fixed', bottom: 16, right: 16, zIndex: 1000,
            padding: '6px 12px', fontSize: 12, opacity: 0.4,
            cursor: 'pointer', background: '#000', color: '#fff',
            border: 'none', borderRadius: 6,
          }}
        >
          edit
        </button>
      )}

      {authed && (
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            position: 'fixed', bottom: 16, left: 16, zIndex: 1000,
            padding: '6px 12px', fontSize: 12,
            cursor: 'pointer', background: '#000', color: '#fff',
            border: 'none', borderRadius: 6,
            opacity: saving ? 0.5 : 1,
          }}
        >
          {saving ? 'saving...' : 'save'}
        </button>
      )}

      {showLogin && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.4)',
        }}>
          <div style={{
            background: '#fff', padding: 24, borderRadius: 12,
            display: 'flex', flexDirection: 'column', gap: 12, minWidth: 240,
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
