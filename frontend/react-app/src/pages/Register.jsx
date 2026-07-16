import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/Register.css'
function Register() {
  const [first_name, setFirstName] = useState('')
   const [last_name, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    const res = await fetch('http://localhost:8000/shop/api/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, first_name, last_name })
    })
    const data = await res.json()
    if (res.ok) {
      navigate('/login')  // redirect to login after register
    } else {
      setError(data.error)
    }
  }

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5" style={{ minHeight: '100vh' }}>
      <div className="card p-4" style={{ width: '600px' }}>
        <h3 className="text-center mb-4">Create Account</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label>First Name</label>
            <input type="text" className="form-control"
              value={first_name} onChange={e => setFirstName(e.target.value)} required />
          </div>

          <div className="mb-3">
            <label>Last Name</label>
            <input type="text" className="form-control"
              value={last_name} onChange={e => setLastName(e.target.value)} required />
          </div>

          <div className="mb-3">
            <label>Email</label>
            <input type="email" className="form-control"
              value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input type="password" className="form-control"
              value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label>Confirm Password</label>
            <input type="password" className="form-control"
              value={confirm} onChange={e => setConfirm(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-4">Register</button>
        </form>

        <p className="text-center mt-3">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register