import { useState, useEffect, useRef } from 'react'
import { CheckCircle2, AlertTriangle, Loader2, RefreshCw, Check, Sparkles } from 'lucide-react'
import { BrowserQRCodeReader } from '@zxing/library'
import placeholderImg from './assets/student-profile-placeholder.png'
import logoImg from './assets/logo-smkn8.webp'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

export default function StaffValidate() {
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [cameraError, setCameraError] = useState(false)
  const [toast, setToast] = useState(null)
  
  const videoRef = useRef(null)
  const codeReaderRef = useRef(null)

  // Clear toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  // Function to submit validation to backend
  async function validateQr(text) {
    if (!text || isLoading) return
    
    setIsLoading(true)
    setResult(null)
    setToast(null)

    try {
      const response = await fetch(`${apiBaseUrl}/staff/qr/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qr_data: text.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.code || 'VALIDATE_FAILED')
      }

      setResult(data)
      setToast({ message: 'Siswa berhasil terverifikasi!', type: 'success' })
    } catch (err) {
      let errMsg = err.message
      if (errMsg === 'QR_ALREADY_USED') errMsg = 'QR Code ini sudah pernah digunakan.'
      else if (errMsg === 'QR_REVOKED') errMsg = 'QR Code ini telah dibatalkan.'
      else if (errMsg === 'QR_HASH_MISMATCH' || errMsg === 'INVALID_FORMAT') errMsg = 'Token QR tidak cocok atau tidak valid.'
      
      setToast({ message: errMsg, type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  // Effect to manage QR Scanner Webcam
  useEffect(() => {
    let codeReader;
    setCameraError(false)

    async function startCamera() {
      try {
        codeReader = new BrowserQRCodeReader()
        codeReaderRef.current = codeReader
        
        await codeReader.decodeFromVideoDevice(undefined, videoRef.current, (decodeResult, err) => {
          if (decodeResult) {
            const scannedText = decodeResult.getText()
            validateQr(scannedText)
          }
        })
      } catch (err) {
        console.error('Failed to bind camera', err)
        setCameraError(true)
      }
    }

    const timer = setTimeout(() => {
      startCamera()
    }, 100)

    return () => {
      clearTimeout(timer)
      if (codeReader) {
        codeReader.reset()
      }
    }
  }, [])

  function handleReset() {
    setResult(null)
    setToast(null)
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

      <header className="page-header">
        <img src={logoImg} alt="Logo SMKN 8" className="page-logo" />
        <p className="page-eyebrow">Staff Panel SMKN 8 Semarang</p>
        <h1 className="page-title">Validator QR</h1>
        <p className="page-description">Verifikasi data pemilih secara cepat.</p>
      </header>

      {/* Tab Content Box with Fixed Height wrapper */}
      <div className="tab-content-area">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
          <div className="scanner-container">
            <video 
              ref={videoRef} 
              id="scanner-video" 
              className="scanner-video"
              muted 
              playsInline
            />
            {isLoading && (
              <div style={{
                position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff'
              }}>
                <Loader2 className="animate-spin" size={40} />
              </div>
            )}
          </div>
          {cameraError && (
            <div className="error-alert" style={{ maxWidth: '400px', alignSelf: 'center', margin: 0 }}>
              <AlertTriangle size={18} />
              Kamera tidak dapat diakses. Harap periksa izin browser Anda.
            </div>
          )}
        </div>
      </div>

      {/* Info Panduan Petugas */}
      <p style={{ fontSize: '14px', color: 'var(--gray-500)', marginTop: '0.75rem', maxWidth: '360px', alignSelf: 'center', margin: '0.75rem 0 0 0' }}>
        Arahkan QR Code siswa ke kamera dengan pencahayaan yang cukup.
      </p>

      {/* Validation Result Box */}
      {result && result.status === 'valid' && (
        <div className="sub-card">
          <div className="success-alert">
            <CheckCircle2 size={18} />
            Pemilih terverifikasi. Silakan persilakan menuju bilik suara.
          </div>

          <div className="profile-card">
            <div className="profile-avatar-wrapper">
              <img 
                src={result.student.photo_url || placeholderImg} 
                alt={result.student.name} 
                className="profile-avatar"
                onError={(e) => {
                  e.target.src = placeholderImg
                }}
              />
            </div>
            
            <div className="profile-details">
              <span className="info-label">NIS: {result.student.nis}</span>
              <h3 style={{ margin: '0.25rem 0' }}>{result.student.name}</h3>
              <span className="muted" style={{ fontSize: '0.875rem' }}>Kelas {result.student.class}</span>
              <span className="badge-verified">Terverifikasi</span>
            </div>
          </div>
          
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <button onClick={handleReset} className="btn-secondary" style={{ height: '38px' }}>
              <RefreshCw size={14} />
              Reset & Validasi Baru
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
