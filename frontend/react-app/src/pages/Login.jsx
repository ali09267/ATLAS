import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext' 


function getCookie(name) {
  let cookieValue = null;

  if (document.cookie && document.cookie !== "") {
    document.cookie.split(";").forEach((cookie) => {
      cookie = cookie.trim();
      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
      }
    });
  }
  return cookieValue;
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
   const { login } = useAuth() 

  const handleLogin = async (e) => {
    e.preventDefault()
   
    const res = await fetch('http://localhost:8000/shop/api/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json','X-CSRFToken': getCookie('csrftoken'), },
      credentials:'include',
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if (res.ok) {
    localStorage.setItem('token', data.token);
    localStorage.setItem("token", data.token);

login(data);   // update AuthContext

if (data.role === "admin") {
    navigate("/admin/dashboard");
} else {
    navigate("/");
}
  } 
    else {
      setError(data.error)
    }
  }

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card p-4" style={{ width: '400px' }}>
        <h3 className="text-center mb-4">Login</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label>Email</label>
            <input type="email" className="form-control email"
              value={email}  onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input type="password" className="form-control password"
              value={password} onChange={e => setPassword(e.target.value)} required />
            <div className="text-start mt-2">
              <small><a href="#" style={{textDecoration:"none",color:"#9b9ea3"}}   onMouseEnter={e => {
        e.target.style.color = "#f7f7f7"
        e.target.style.textDecoration = "none"
      }}
      onMouseLeave={e => {
        e.target.style.color = "#87898c"
        e.target.style.textDecoration = "none"
      }}>Forgot Password?</a></small>
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>

        <p className="text-center mt-3">
          Don't have an account? <Link to="/register" style={{ textDecoration: "none", color: "#87898c" }}
    onMouseEnter={e => {
      e.target.style.color = "#f7f7f7"
      e.target.style.textDecoration = "none"
    }}
    onMouseLeave={e => {
      e.target.style.color = "#87898c"
      e.target.style.textDecoration = "none"
    }}>Sign Up</Link>
        </p>
      </div>
    </div>
  )
}

export default Login