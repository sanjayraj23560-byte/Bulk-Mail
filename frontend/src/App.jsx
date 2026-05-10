import axios from "axios"
import { useState } from "react"
import * as XLSX from "xlsx"
import { useNavigate } from "react-router-dom"

function App() {

  const [EmailInp, setEmailInp] = useState("")
  const [inp, setinp] = useState("")
  const [email, setemail] = useState([])
  const [subInp, setSubInp] = useState("")
  const [status, setStatus] = useState(false)
  const [emailvalidation, setEmailvalidation] = useState(true)
  const navigate = useNavigate()

  // =========================
  // EMAIL VALIDATION
  // =========================

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // =========================
  // HANDLE INPUT CHANGE
  // =========================

  const handleEmailChange = (e) => {

    const value = e.target.value

    setEmailInp(value)

    setEmailvalidation(validateEmail(value))
  }

  // =========================
  // ADD SINGLE EMAIL
  // =========================

  const AddEmail = () => {

    if (!EmailInp) {
      alert("Please enter an email")
      return
    }

    if (!validateEmail(EmailInp)) {
      alert("Invalid Email")
      return
    }

    // prevent duplicates
    if (email.includes(EmailInp)) {
      alert("Email already added")
      return
    }

    setemail([...email, EmailInp])

    setEmailInp("")
  }

  // =========================
  // READ EXCEL FILE
  // =========================

  const ReadExcel = (fileData) => {

    const reader = new FileReader()

    reader.onload = function (e) {

      const data = e.target.result

      const WorkBook = XLSX.read(data, {
        type: "binary"
      })

      const SheetName = WorkBook.SheetNames[0]

      const WorkSheet = WorkBook.Sheets[SheetName]

      const EmailList = XLSX.utils.sheet_to_json(
        WorkSheet,
        {
          header: "A"
        }
      )

      const TotalEmails = EmailList
        .map((item) => item.A)
        .filter((mail) => mail)

      // remove duplicates
      setemail((prev) => {

        const combined = [...prev, ...TotalEmails]

        return [...new Set(combined)]
      })
    }

    reader.readAsBinaryString(fileData)
  }

  //===========================
  // LOG OUT FUNCTION 
  // =========================
  // Add this function inside App()
  const handleLogout = () => {
    navigate("/")
  }

  // =========================
  // FILE INPUT
  // =========================

  const Emails = (e) => {

    const fileData = e.target.files[0]

    if (!fileData) return

    ReadExcel(fileData)
  }

  // =========================
  // DRAG & DROP
  // =========================

  const handleDrop = (e) => {

    e.preventDefault()

    const fileData = e.dataTransfer.files[0]

    if (!fileData) return

    ReadExcel(fileData)
  }

  // =========================
  // SEND MAIL
  // =========================

  const SendMail = () => {

    if (email.length === 0) {
      alert("No emails added")
      return
    }

    if (!subInp || !inp) {
      alert("Please fill all fields")
      return
    }

    setStatus(true)

    axios.post("http://localhost:3000/sending", {

      text: inp,
      subject: subInp,
      email: email

    })
      .then((res) => {

        if (res.data) {

          alert("Your mail has been sent!")

          setStatus(false)

          setinp("")
          setSubInp("")
          setemail([])

        } else {

          setStatus(false)

          alert("Failed to send mail")
        }
      })
      .catch((err) => {

        console.log(err)

        setStatus(false)

        alert("Server Error")
      })
  }

  // =========================
  // REMOVE EMAIL
  // =========================

  const RemoveEmail = (index) => {

    const filtered = email.filter((_, i) => i !== index)

    setemail(filtered)
  }

  // =========================
  // HISTORY PAGE
  // =========================

  const handleHistory = () => {

    navigate("/history")
  }

  return (
    <>

      <div className="input-container">

        <h1>Send Mail</h1>

        {/* SUBJECT */}

        <input
          type="text"
          placeholder="Enter subject here..."
          value={subInp}
          onChange={(e) => setSubInp(e.target.value)}
        />

        {/* MESSAGE */}

        <textarea
          value={inp}
          onChange={(e) => setinp(e.target.value)}
          placeholder="Enter your message here..."
        />

        {/* EMAIL INPUT */}

        <div className="email-input-box">

          <input
            placeholder="Enter Email"
            value={EmailInp}
            onChange={handleEmailChange}
            type="email"
          />

          <button onClick={AddEmail}>
            Add Email
          </button>

        </div>

        {/* VALIDATION */}

        {
          !emailvalidation &&
          <p style={{ color: "red" }}>
            Invalid Email Format
          </p>
        }

        {/* DRAG DROP */}

        <div
          className="drag-drop"

          onDragOver={(e) => e.preventDefault()}

          onDrop={handleDrop}
        >

          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={Emails}
          />

          <p className="p-E">
            Emails chosen: {email.length}
          </p>

          <p>
            Drag and drop Excel file here
          </p>

        </div>

        {/* EMAIL LIST */}

        <div className="email-list">

          {
            email.map((mail, index) => (

              <div
                key={index}
                className="email-item"
              >

                <p>{mail}</p>

                <button
                  onClick={() => RemoveEmail(index)}
                >
                  Remove
                </button>

              </div>
            ))
          }

        </div>

        {/* BUTTONS */}

        {/* BUTTONS */}
        <div className="buttons">
          <button onClick={SendMail}>
            {status ? "Sending..." : "Send"}
          </button>
          <button onClick={handleHistory}>
            History
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Log out
          </button>
        </div>


      </div>

    </>
  )
}

export default App