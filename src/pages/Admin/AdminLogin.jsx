import { useState } from 'react'

import { SITE } from '@/constants/site'
import { logIn } from '@/services/productStore'

import { FieldError } from './AdminFields'

export function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      onLogin(await logIn(password))
    } catch (failure) {
      setError(failure.message)
      setBusy(false)
    }
  }

  return (
    <div className="admin admin-login">
      <form onSubmit={submit} className={error ? 'has-error' : undefined}>
        <p className="admin-brand">{SITE.name}</p>
        <h1>Atelier admin</h1>
        <label className="admin-field">
          <span className="admin-label">Password</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <FieldError message={error} />
        <button type="submit" className="admin-button admin-primary" disabled={busy || !password}>
          {busy ? 'Checking…' : 'Log in'}
        </button>
      </form>
    </div>
  )
}
