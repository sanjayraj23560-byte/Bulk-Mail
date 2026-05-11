import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function History() {

  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // =========================
  // FETCH HISTORY
  // =========================

  useEffect(() => {
    axios.delete("https://bulk-mail-zklf.onrender.com/history")
      .then((res) => {
        setHistory(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
  }, [])

  // =========================
  // DELETE SINGLE
  // =========================

  const DeleteEntry = (id) => {
    axios.delete(`https://bulk-mail-zklf.onrender.com/history/${id}`)
      .then(() => {
        setHistory((prev) => prev.filter((item) => item._id !== id))
      })
      .catch((err) => console.log(err))
  }

  // =========================
  // DELETE ALL
  // =========================

  const DeleteAll = () => {
    axios.delete("http://localhost:3000/history")
      .then(() => setHistory([]))
      .catch((err) => console.log(err))
  }

  // =========================
  // FORMAT TIME
  // =========================

  const formatTime = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const timeAgo = (dateStr) => {
    const now = new Date()
    const past = new Date(dateStr)
    const diff = Math.floor((now - past) / 1000)

    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  return (
    <div className="history-page">

      <div className="history-container">

        {/* HEADER */}

        <div className="history-header">
          <button className="back-btn" onClick={() => navigate("/home")}>
            ← Back
          </button>
          <h1>Mail History</h1>
          {history.length > 0 && (
            <button className="delete-all-btn" onClick={DeleteAll}>
              Clear All
            </button>
          )}
        </div>

        {/* COUNT BADGE */}

        {!loading && (
          <div className="history-count">
            {history.length} {history.length === 1 ? "record" : "records"} found
          </div>
        )}

        {/* LOADING */}

        {loading && (
          <div className="history-loading">
            <div className="spinner" />
            <p>Fetching history...</p>
          </div>
        )}

        {/* EMPTY */}

        {!loading && history.length === 0 && (
          <div className="history-empty">
            <p className="empty-icon">📭</p>
            <p>No mail history yet</p>
          </div>
        )}

        {/* LIST */}

        <div className="history-list">
          {history.map((item, index) => (
            <div key={item._id} className="history-card">

              <div className="card-left">
                <div className="card-index">#{index + 1}</div>
                <div className="card-body">
                  <p className="card-emails">{item.email}</p>
                  {item.createdAt && (
                    <div className="card-time">
                      <span className="time-full">{formatTime(item.createdAt)}</span>
                      <span className="time-ago">{timeAgo(item.createdAt)}</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                className="delete-btn"
                onClick={() => DeleteEntry(item._id)}
              >
                Delete
              </button>

            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default History