import crypto from 'node:crypto'
import QRCode from 'qrcode'

const QR_DATA_SEPARATOR = ':'

export function createSalt() {
  return crypto.randomBytes(16).toString('hex')
}

export function createQrHash(nis, salt) {
  const secret = process.env.QR_SECRET_KEY

  if (!secret) {
    throw new Error('Missing QR_SECRET_KEY')
  }

  return crypto.createHash('sha256').update(`${nis}${salt}${secret}`).digest('hex')
}

export function createQrData(nis, hash, salt) {
  return [nis, hash, salt].join(QR_DATA_SEPARATOR)
}

export function parseQrData(qrData) {
  if (typeof qrData !== 'string') {
    return { valid: false, errorCode: 'QR_INVALID_FORMAT' }
  }

  const parts = qrData.trim().split(QR_DATA_SEPARATOR)

  if (parts.length !== 3) {
    return { valid: false, errorCode: 'QR_INVALID_FORMAT' }
  }

  const [nis, hash, salt] = parts

  if (!nis || !hash || !salt || hash.length !== 64 || salt.length !== 32) {
    return { valid: false, errorCode: 'QR_INVALID_FORMAT' }
  }

  return { valid: true, nis, hash, salt }
}

export async function createQrImage(qrData) {
  return QRCode.toDataURL(qrData, {
    type: 'image/png',
    errorCorrectionLevel: 'M',
    margin: 2,
    width: 320,
  })
}
