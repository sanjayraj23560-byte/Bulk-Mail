import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Signup() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPass, setShowPass] = useState(false)
  const navigate = useNavigate()

  const handleSignup = () => {
    if (!name || !email || !password || !confirm) {
      alert("Please fill all fields")
      return
    }
    if (password !== confirm) {
      alert("Passwords do not match")
      return
    }
    navigate("/")
  }
  return (
    <div className="auth-page auth-page--center">
      <div className="auth-glass-card">

        <div className="signup-dolls-top">
          <span className="signup-doll-emoji">🎀</span>
          <span className="signup-doll-emoji">⭐</span>
          <span className="signup-doll-emoji">🎀</span>
        </div>

        <h1 className="auth-title">Create account</h1>
        <p className="auth-sub">Join us — the dolls are excited!</p>

        <div className="auth-field">
          <label>Full name</label>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="auth-field">
          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="auth-field">
          <label>Password</label>
          <div className="pass-wrap">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="pass-toggle"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="auth-field">
          <label>Confirm password</label>
          <input
            type="password"
            placeholder="Repeat your password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        <button className="auth-btn" onClick={handleSignup}>
          Create account
        </button>

        <p className="auth-switch">
          Already have an account?{" "}
          <span onClick={() => navigate("/")}>Login in</span>
        </p>

      </div>
    </div>
  )
}

export default Signup