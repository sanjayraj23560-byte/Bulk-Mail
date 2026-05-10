import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import History from './History.jsx'
import Login from './login.jsx'
import Signup from './signup.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path='/home' element={<App/>}></Route>
      <Route path='/history' element={<History/>}></Route>
      <Route path='/' element={<Login/>}></Route>
      <Route path="/signup" element={<Signup/>}></Route>
    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
