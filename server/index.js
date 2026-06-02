import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { supabase } from './supabase.js'
import { createQrData, createQrHash, createQrImage, createSalt, parseQrData } from './qr.js'

const app = express()
const port = process.env.PORT || 3000

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }))
app.use(express.json({ limit: '1mb' }))

function getClientMeta(req) {
  return {
    ip_address: req.ip,
    device_fingerprint: req.get('user-agent') || null,
  }
}

async function logAudit(event) {
  await supabase.from('audit_logs').insert({
    event_type: event.event_type,
    actor_type: event.actor_type || 'system',
    actor_id: event.actor_id || null,
    resource_type: event.resource_type || null,
    resource_id: event.resource_id || null,
    action: event.action,
    status: event.status || 'success',
    error_code: event.error_code || null,
    error_message: event.error_message || null,
    metadata: event.metadata || {},
    ip_address: event.ip_address || null,
    device_fingerprint: event.device_fingerprint || null,
  })
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.post('/api/qr/generate', async (req, res) => {
  const nis = String(req.body?.nis || '').trim()
  const meta = getClientMeta(req)

  if (!nis) {
    return res.status(400).json({ status: 'error', code: 'NIS_REQUIRED' })
  }

  const { data: student, error: studentError } = await supabase
    .from('students')
    .select('id, nis, name, class, photo_url, registration_status')
    .eq('nis', nis)
    .maybeSingle()

  if (studentError) {
    return res.status(500).json({ status: 'error', code: 'STUDENT_LOOKUP_FAILED' })
  }

  if (!student) {
    await logAudit({
      ...meta,
      event_type: 'qr_generate',
      actor_type: 'student',
      actor_id: nis,
      resource_type: 'qr_codes',
      action: 'generate_qr',
      status: 'failure',
      error_code: 'STUDENT_NOT_FOUND',
    })

    return res.status(404).json({ status: 'error', code: 'STUDENT_NOT_FOUND' })
  }

  if (student.registration_status === 'ineligible') {
    return res.status(403).json({ status: 'error', code: 'STUDENT_INELIGIBLE' })
  }

  if (student.registration_status === 'verified') {
    return res.status(409).json({ status: 'error', code: 'STUDENT_ALREADY_VERIFIED' })
  }

  const salt = createSalt()
  const hash = createQrHash(nis, salt)
  const qrData = createQrData(nis, hash, salt)
  const qrImage = await createQrImage(qrData)

  const { error: upsertError } = await supabase.from('qr_codes').upsert(
    {
      nis,
      hash,
      salt,
      qr_data: qrData,
      status: 'active',
      generated_by: 'public',
      metadata: { student_id: student.id },
    },
    { onConflict: 'nis' },
  )

  if (upsertError) {
    return res.status(500).json({ status: 'error', code: 'QR_SAVE_FAILED' })
  }

  await supabase
    .from('students')
    .update({ registration_status: 'qr_generated', updated_at: new Date().toISOString() })
    .eq('nis', nis)

  await logAudit({
    ...meta,
    event_type: 'qr_generate',
    actor_type: 'student',
    actor_id: nis,
    resource_type: 'qr_codes',
    resource_id: nis,
    action: 'generate_qr',
  })

  res.json({
    status: 'success',
    qr_data: qrData,
    qr_image: qrImage,
    hash,
    salt,
    student: {
      nis: student.nis,
      name: student.name,
      class: student.class,
    },
  })
})

app.post('/api/staff/qr/validate', async (req, res) => {
  const qrData = String(req.body?.qr_data || '').trim()
  const staffId = req.body?.staff_id ? String(req.body.staff_id) : null
  const meta = getClientMeta(req)
  const parsed = parseQrData(qrData)

  if (!parsed.valid) {
    return res.status(400).json({ status: 'invalid', code: parsed.errorCode })
  }

  const expectedHash = createQrHash(parsed.nis, parsed.salt)

  if (expectedHash !== parsed.hash) {
    await logAudit({
      ...meta,
      event_type: 'qr_validate',
      actor_type: 'staff',
      actor_id: staffId,
      resource_type: 'qr_codes',
      resource_id: parsed.nis,
      action: 'validate_qr',
      status: 'failure',
      error_code: 'QR_HASH_MISMATCH',
    })

    return res.status(400).json({ status: 'invalid', code: 'QR_HASH_MISMATCH' })
  }

  const { data: qrCode, error: qrError } = await supabase
    .from('qr_codes')
    .select('id, nis, hash, salt, qr_data, status')
    .eq('nis', parsed.nis)
    .maybeSingle()

  if (qrError) {
    return res.status(500).json({ status: 'error', code: 'QR_LOOKUP_FAILED' })
  }

  if (!qrCode) {
    return res.status(404).json({ status: 'invalid', code: 'QR_NOT_FOUND' })
  }

  if (qrCode.status === 'used') {
    return res.status(409).json({ status: 'invalid', code: 'QR_ALREADY_USED' })
  }

  if (qrCode.status === 'revoked') {
    return res.status(409).json({ status: 'invalid', code: 'QR_REVOKED' })
  }

  if (qrCode.hash !== parsed.hash || qrCode.salt !== parsed.salt || qrCode.qr_data !== qrData) {
    return res.status(400).json({ status: 'invalid', code: 'QR_HASH_MISMATCH' })
  }

  const { data: student, error: studentError } = await supabase
    .from('students')
    .select('id, nis, name, class, photo_url, registration_status, verified_at')
    .eq('nis', parsed.nis)
    .maybeSingle()

  if (studentError) {
    return res.status(500).json({ status: 'error', code: 'STUDENT_LOOKUP_FAILED' })
  }

  if (!student) {
    return res.status(404).json({ status: 'invalid', code: 'QR_NOT_FOUND' })
  }

  const { error: updateError } = await supabase
    .from('students')
    .update({ registration_status: 'verified', verified_at: new Date().toISOString() })
    .eq('nis', parsed.nis)

  if (updateError) {
    return res.status(500).json({ status: 'error', code: 'STUDENT_UPDATE_FAILED' })
  }

  const { error: qrUpdateError } = await supabase
    .from('qr_codes')
    .update({ status: 'used' })
    .eq('nis', parsed.nis)

  if (qrUpdateError) {
    return res.status(500).json({ status: 'error', code: 'QR_UPDATE_FAILED' })
  }

  await logAudit({
    ...meta,
    event_type: 'qr_validate',
    actor_type: 'staff',
    actor_id: staffId,
    resource_type: 'qr_codes',
    resource_id: qrCode.id,
    action: 'validate_qr',
    metadata: { nis: parsed.nis },
  })

  res.json({
    status: 'valid',
    student: {
      id: student.id,
      nis: student.nis,
      name: student.name,
      class: student.class,
      photo_url: student.photo_url,
      registration_status: student.registration_status,
      verified_at: student.verified_at,
    },
  })
})

app.use((req, res) => {
  res.status(404).json({ status: 'error', code: 'NOT_FOUND' })
})

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`)
})
