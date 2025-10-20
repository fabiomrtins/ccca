import { useState } from 'react'
import './App.css'

function App() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [document, setDocument] = useState('97456321558')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  async function handleSignup() {
    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, document, password })
      })

      const data = await response.json()

      if (data.accountId) {
        setMessage('success')
      } else if (response.status === 422) {
        setMessage(data.message)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
        <label style={{ display: 'flex', flexDirection: 'column' }}>
          Name
          <input
            className="input-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column' }}>
          Email
          <input
            className="input-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column' }}>
          Document
          <input
            className="input-document"
            value={document}
            onChange={(e) => setDocument(e.target.value)}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column' }}>
          Password
          <input
            className="input-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button className="button-signup" onClick={handleSignup}>
          Sign Up
        </button>

        {message && <span className="span-message">{message}</span>}
      </div>
    </>
  )
}

export default App