import { useState, useEffect, useRef } from 'react'
import { QrCode, User, Copy, Check, Download, Loader2, Sparkles, AlertTriangle, Camera, RefreshCw, Info, Eye, EyeOff } from 'lucide-react'
import logoImg from './assets/logo-smkn8.png'
import placeholderImg from './assets/student-profile-placeholder.png'
import html2canvas from 'html2canvas'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
const EXPIRY_DURATION = 10 * 60 * 1000 // 10 Menit dalam milidetik

export default function QrGenerator() {
  const [nis, setNis] = useState('')
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [showTooltip, setShowTooltip] = useState(false)
  const [showNis, setShowNis] = useState(false)
  
  const inputRef = useRef(null)
  const resultRef = useRef(null)

  // Load saved QR on mount
  useEffect(() => {
    const saved = localStorage.getItem('evoting_qr')
    if (saved) {
      try {
        const { result: savedResult, expiresAt } = JSON.parse(saved)
        if (expiresAt > Date.now()) {
          setResult(savedResult)
          setTimeLeft(Math.max(0, Math.floor((expiresAt - Date.now()) / 1000)))
        } else {
          localStorage.removeItem('evoting_qr')
        }
      } catch (e) {
        localStorage.removeItem('evoting_qr')
      }
    }
  }, [])

  // Autofocus input
  useEffect(() => {
    if (inputRef.current && !result) {
      inputRef.current.focus()
    }
  }, [result])

  // Timer loop when result is active
  useEffect(() => {
    if (!result) return

    const saved = localStorage.getItem('evoting_qr')
    if (!saved) return

    const { expiresAt } = JSON.parse(saved)

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000))
      setTimeLeft(remaining)

      if (remaining <= 0) {
        clearInterval(interval)
        localStorage.removeItem('evoting_qr')
        setResult(null)
        setToast({ message: 'QR Code telah kedaluwarsa. Silakan buat baru.', type: 'error' })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [result])

  // Auto-clear toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  // Handle click/tap outside to close tooltip
  useEffect(() => {
    if (!showTooltip) return
    const handleOutsideClick = () => setShowTooltip(false)
    window.addEventListener('click', handleOutsideClick)
    return () => window.removeEventListener('click', handleOutsideClick)
  }, [showTooltip])

  async function handleSubmit(event) {
    event.preventDefault()
    if (!nis.trim()) return

    setIsLoading(true)
    setResult(null)
    setToast(null)

    try {
      const response = await fetch(`${apiBaseUrl}/qr/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nis: nis.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.code || 'QR_GENERATE_FAILED')
      }

      const expiresAt = Date.now() + EXPIRY_DURATION
      localStorage.setItem('evoting_qr', JSON.stringify({ result: data, expiresAt }))
      
      setResult(data)
      setTimeLeft(Math.max(0, Math.floor((expiresAt - Date.now()) / 1000)))
      setToast({ message: 'QR Code berhasil dibuat!', type: 'success' })
    } catch (err) {
      let errMsg = err.message
      if (errMsg === 'STUDENT_NOT_FOUND') errMsg = 'Nomor NIS tidak ditemukan. Silakan periksa kembali.'
      else if (errMsg === 'STUDENT_INELIGIBLE') errMsg = 'Status Anda belum memenuhi syarat untuk memilih.'
      else if (errMsg === 'STUDENT_ALREADY_VERIFIED') errMsg = 'Anda sudah terverifikasi sebelumnya.'
      
      setToast({ message: errMsg, type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  function handleReset() {
    localStorage.removeItem('evoting_qr')
    setResult(null)
    setNis('')
    setToast({ message: 'Silakan masukkan kembali NIS Anda.', type: 'success' })
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const countdownStr = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`

  // Deriving realistic mock values based on actual database properties
  const mockAttendanceNo = result ? (parseInt(result.student.nis.slice(-2)) || 14) : 14
  const mockTTL = result ? `Semarang, ${10 + (parseInt(result.student.nis.slice(-1)) || 5)} Juli 2008` : 'Semarang, 15 Juli 2008'

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            {toast.type === 'error' ? <AlertTriangle size={18} color="var(--accent-red)" /> : <Check size={18} color="#22c55e" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <main className={`page-container ${result ? 'scrollable' : ''}`}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '1rem', position: 'relative', zIndex: 1 }}>
        {!result && (
          <>
            <header className="page-header">
              <img src={logoImg} alt="Logo SMKN 8" className="page-logo" />
              <h1 className="page-title" style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Ambil Antrean Bilik</h1>
              <p className="page-description">Masukkan Nomor Induk Siswa (NIS) untuk membuat tiket antrean bilik suara.</p>
            </header>

            <form onSubmit={handleSubmit} className="form-minimal">
              <div className="form-group">
                <div className="input-wrapper">
                  <User className="input-icon" size={20} />
                  <input
                    ref={inputRef}
                    id="nis"
                    type="text"
                    className="input-field"
                    value={nis}
                    onChange={(e) => setNis(e.target.value)}
                    placeholder="Masukkan NIS Anda..."
                    autoComplete="off"
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={isLoading || !nis.trim()}>
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Membuat QR Code...
                  </>
                ) : (
                  <>
                    <QrCode size={20} />
                    Buat QR Code
                  </>
                )}
              </button>
            </form>

            <p style={{ fontSize: '13px', color: 'var(--gray-500)', marginTop: '0.5rem' }}>
              QR Code hanya berlaku selama 10 menit sejak dibuat.
            </p>
          </>
        )}

        {result && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
            <h2 style={{ fontSize: '1.75rem', color: 'var(--text-h)', marginBottom: '0.25rem' }}>Tiket Suara Anda</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'center' }}>
              <p style={{ fontSize: '14px', color: 'var(--gray-500)', margin: 0, maxWidth: '360px' }}>
                Tunjukkan QR Code ini ke petugas TPS pada hari H pemilihan.
              </p>
              <p style={{ fontSize: '14px', color: 'var(--accent-red)', fontWeight: '700', margin: 0, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                Kedaluwarsa dalam: {countdownStr}
                <span className="tooltip-wrapper">
                  <button 
                    type="button"
                    className="tooltip-icon" 
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowTooltip(!showTooltip)
                    }}
                  >
                    <Info size={14} />
                  </button>
                  {showTooltip && (
                    <span className="tooltip-box">
                      Gunakan QR ini sebelum waktu habis. Jika habis, Anda bisa membuatnya kembali.
                    </span>
                  )}
                </span>
              </p>
            </div>

            {/* Redesigned Card Receipt featuring Overlapping Avatar Badge */}
            <div ref={resultRef} className="card-receipt">
              <div className="avatar-badge">
                <img 
                  src={result.student.photo_url || placeholderImg} 
                  alt={result.student.name}
                  onError={(e) => { e.target.src = placeholderImg }} 
                />
              </div>

              <div className="qr-code-wrapper">
                <img src={result.qr_image} alt="QR E-Voting" className="qr-image" />
              </div>

              <div className="student-info-table">
                <div className="info-row">
                  <span className="info-row-label">Nama Lengkap</span>
                  <span className="info-row-value">{result.student.name}</span>
                </div>
                <div className="info-row">
                  <span className="info-row-label">NIS</span>
                  <span className="info-row-value" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    {showNis ? result.student.nis : '••••••••'}
                    <button 
                      type="button" 
                      onClick={() => setShowNis(!showNis)} 
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'inline-flex', color: 'var(--gray-500)' }}
                      title={showNis ? "Sembunyikan NIS" : "Tampilkan NIS"}
                    >
                      {showNis ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-row-label">Kelas</span>
                  <span className="info-row-value">{result.student.class}</span>
                </div>
                <div className="info-row">
                  <span className="info-row-label">No. Absen</span>
                  <span className="info-row-value">{mockAttendanceNo}</span>
                </div>
                <div className="info-row">
                  <span className="info-row-label">TTL</span>
                  <span className="info-row-value">{mockTTL}</span>
                </div>
                <div className="info-row">
                  <span className="info-row-label">Sekolah</span>
                  <span className="info-row-value">SMKN 8 Semarang</span>
                </div>
              </div>
            </div>

            <button onClick={handleReset} className="btn-secondary" style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <RefreshCw size={14} />
              Salah NIS / Buat Ulang
            </button>
          </div>
        )}
      </div>
    </main>
  </>
)
}
