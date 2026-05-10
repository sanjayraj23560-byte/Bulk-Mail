import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Doll from "./Doll"

function Login() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [happy, setHappy] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const move = (e) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener("mousemove", move)
    return () => window.removeEventListener("mousemove", move)
  }, [])

  const handleLogin = () => {
    if (!email || !password) {
      alert("Please fill all fields")
      return false
    }
    navigate("/home")
  }

  return (
    <div className="auth-page">

      <div className="auth-dolls-panel">
        <div className="dolls-wrap">
          <Doll size={88}  mousePos={mousePos} happy={happy} color="pink"   />
          <Doll size={112} mousePos={mousePos} happy={happy} color="purple" />
          <Doll size={88}  mousePos={mousePos} happy={happy} color="blue"   />
        </div>
        <p className="dolls-label">We missed you! ✨</p>
      </div>

      <div className="auth-form-panel">
        <div className="auth-glass-card">

          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-sub">Login in to continue</p>

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
                placeholder="Enter password"
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

          <button
            className="auth-btn"
            onClick={handleLogin}
            onMouseEnter={() => setHappy(true)}
            onMouseLeave={() => setHappy(false)}
          >
            Login!
          </button>

          <p className="auth-switch">
            Don't have an account?{" "}
            <span onClick={() => navigate("/signup")}>Sign up</span>
          </p>

        </div>
      </div>

    </div>
  )
}

export default Login