import { useState, useEffect, useRef } from 'react'
import { QrCode, User, Copy, Check, Download, Loader2, Sparkles, AlertTriangle } from 'lucide-react'
import logoImg from './assets/logo-smkn8.webp'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

export default function QrGenerator() {
  const [nis, setNis] = useState('')
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [toast, setToast] = useState(null)
  
  const inputRef = useRef(null)

  // Autofocus input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Auto-clear toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  async function handleSubmit(event) {
    event.preventDefault()
    if (!nis.trim()) return

    setIsLoading(true)
    setResult(null)
    setIsCopied(false)
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

      setResult(data)
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

  function handleCopy() {
    if (!result) return
    navigator.clipboard.writeText(result.qr_data)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  function handleDownload() {
    if (!result) return
    const link = document.createElement('a')
    link.href = result.qr_image
    link.download = `QR-${result.student.nis}-${result.student.name.replace(/\s+/g, '_')}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <main className="page-container">
      {/* Toast Notification */}
      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            {toast.type === 'error' ? <AlertTriangle size={18} color="var(--accent-red)" /> : <Check size={18} color="#22c55e" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '1rem' }}>
        <header className="page-header">
          <img src={logoImg} alt="Logo SMKN 8" className="page-logo" />
          <p className="page-eyebrow">E-Voting OSIS SMKN 8 Semarang</p>
          <h1 className="page-title">Pembuat QR Code</h1>
          <p className="page-description">Silakan masukkan Nomor Induk Siswa (NIS) untuk mengaktifkan akses bilik suara Anda.</p>
        </header>

        <form onSubmit={handleSubmit} className="form-minimal">
          <div className="form-group">
            <label htmlFor="nis" className="form-label">Nomor Induk Siswa (NIS)</label>
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

        {/* Friendly UX Info */}
        <div className="playful-info">
          <div className="playful-title">
            <Sparkles size={16} color="var(--secondary-600)" />
            <span>Informasi Penting</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.825rem', lineHeight: '1.4' }}>
            Harap jaga kerahasiaan QR Code Anda. QR Code ini hanya dapat digunakan satu kali oleh pemilik yang sah untuk memberikan hak suara di bilik pemungutan suara.
          </p>
        </div>

        {result && (
          <div className="sub-card">
            <div className="qr-result-grid">
              <div className="qr-code-wrapper">
                <img src={result.qr_image} alt="QR E-Voting" className="qr-image" />
                <button onClick={handleDownload} className="btn-secondary" style={{ width: '100%' }}>
                  <Download size={16} />
                  Unduh Gambar QR
                </button>
              </div>

              <div className="student-info-section">
                <div>
                  <span className="info-label">Nama Lengkap</span>
                  <div className="info-val">{result.student.name}</div>
                </div>
                <div>
                  <span className="info-label">Kelas</span>
                  <div className="info-val">{result.student.class}</div>
                </div>
                <div>
                  <span className="info-label">Token Kode QR</span>
                  <div className="token-box">
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '240px' }}>
                      {result.qr_data}
                    </span>
                    <button
                      onClick={handleCopy}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                      title="Salin Token"
                    >
                      {isCopied ? <Check size={16} color="green" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
