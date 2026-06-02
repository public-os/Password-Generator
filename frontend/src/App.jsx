import { useState } from 'react'
import './App.css'

const STRENGTH_CONFIG = {
  'Very Weak':   { color: '#e24b4a', pct: 14 },
  'Weak':        { color: '#ef9f27', pct: 28 },
  'Fair':        { color: '#ba7517', pct: 43 },
  'Good':        { color: '#639922', pct: 57 },
  'Strong':      { color: '#1d9e75', pct: 72 },
  'Very Strong': { color: '#0f6e56', pct: 87 },
  'Excellent':   { color: '#185fa5', pct: 100 },
}

export default function App() {
  const [length, setLength] = useState(16)
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
  })
  const [password, setPassword] = useState('')
  const [strength, setStrength] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const activeCount = Object.values(options).filter(Boolean).length

  function toggleOption(key) {
    if (options[key] && activeCount === 1) return
    setOptions(prev => ({ ...prev, [key]: !prev[key] }))
  }

  async function generate() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(
        'https://password-generator-9hto.onrender.com/generate',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            length,
            ...options,
          }),
        }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to generate')
      setPassword(data.password)
      setStrength(data.strength)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function copyPassword() {
    if (!password) return
    await navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const strengthCfg = STRENGTH_CONFIG[strength]

  const TOGGLES = [
    { key: 'uppercase', label: 'Uppercase', example: 'A–Z' },
    { key: 'lowercase', label: 'Lowercase', example: 'a–z' },
    { key: 'numbers',   label: 'Numbers',   example: '0–9' },
    { key: 'symbols',   label: 'Symbols',   example: '!@#$' },
  ]

  return (
    <div className="card">
      <div className="card-header">
        {/* <div className="lock-icon">🔐</div> */}
        <h1>Password Generator</h1>
        <p>Generate a secure, random password</p>
      </div>

      <div className="pw-display">
        <span className={`pw-text ${!password ? 'placeholder' : ''}`}>
          {password || 'Click generate…'}
        </span>
        <div className="pw-actions">
          <button
            className={`icon-btn ${copied ? 'success' : ''}`}
            onClick={copyPassword}
            disabled={!password}
            title="Copy"
          >
            {copied ? '✓' : '⎘'}
          </button>
          <button
            className="icon-btn"
            onClick={generate}
            disabled={loading || !password}
            title="Regenerate"
          >↺</button>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="controls">
        <div className="slider-row">
          <span className="ctrl-label">Length</span>
          <input
            type="range" min="6" max="64" step="1"
            value={length}
            onChange={e => setLength(Number(e.target.value))}
          />
          <span className="ctrl-val">{length}</span>
        </div>

        <div className="toggle-grid">
          {TOGGLES.map(({ key, label, example }) => (
            <button
              key={key}
              className={`toggle-btn ${options[key] ? 'active' : ''}`}
              onClick={() => toggleOption(key)}
            >
              <span className="toggle-label">{label}</span>
              <span className="toggle-example">{example}</span>
              <span className="toggle-check">{options[key] ? '✓' : ''}</span>
            </button>
          ))}
        </div>

        {strength && strengthCfg && (
          <div className="strength-wrap">
            <div className="strength-header">
              <span>Strength</span>
              <span style={{ color: strengthCfg.color, fontWeight: 500 }}>{strength}</span>
            </div>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{ width: strengthCfg.pct + '%', background: strengthCfg.color }}
              />
            </div>
          </div>
        )}
      </div>

      <button className="generate-btn" onClick={generate} disabled={loading}>
        {loading ? 'Generating…' : 'Generate Password'}
      </button>
    </div>
  )
}
