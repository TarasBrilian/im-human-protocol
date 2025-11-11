# Testing Guide - Verifikasi dengan Logging

## Persiapan

Pastikan semua service berjalan:

1. **Backend** (Port 3000):
   ```bash
   cd im-human-reclaim
   pnpm start
   ```

   Pastikan terlihat:
   ```
   ✅ Reclaim Protocol configured:
   - Callback URL: https://5967e941eb58.ngrok-free.app/api/reclaim/callback
   ```

2. **Frontend** (Port 3001):
   ```bash
   cd im-human-frontend
   PORT=3001 pnpm dev
   ```

3. **Ngrok**:
   ```bash
   ngrok http 3000
   ```

   Copy URL ngrok dan pastikan sudah di-update di `.env`

## Flow Testing dengan Logging

### Step 1: Buka Browser Console

1. Buka browser (Chrome/Firefox)
2. Buka DevTools (F12 atau Cmd+Option+I)
3. Pergi ke tab **Console**
4. Akses: `http://localhost:3001/cex-verify`

### Step 2: Start Verification

1. Input User ID (contoh: `test123`)
2. Optional: Input Wallet Address
3. Klik **"Start Verification"**

**Expected Console Output:**
```
✅ Verification initialized successfully!
Session ID: abc123xyz456
Request URL: https://share.reclaimprotocol.org/...
🔄 Starting to poll session status...
⏳ Status still pending: PENDING
⏳ Status still pending: PENDING
```

### Step 3: Complete Verification on Mobile

1. Scan QR code atau klik "Open Verification Page"
2. Complete verification di Reclaim Protocol
3. Wait for Binance login and data extraction

**Expected Backend Terminal Output:**
```
✨ NEW SESSION CREATED ✨
Session ID: abc123xyz456
User ID: test123
Callback URL: https://5967e941eb58.ngrok-free.app/api/reclaim/callback
Total sessions: 1
```

### Step 4: Callback Received

Setelah verification complete di mobile:

**Expected Backend Terminal Output:**
```
🔔 ===== CALLBACK RECEIVED ===== 🔔
Timestamp: 2025-11-11T12:00:00.000Z
Request body: {
  "claimData": {...},
  "identifier": "abc123xyz456",
  ...
}
Current sessions: [ 'abc123xyz456' ]

🔍 Trying to match session ID from proof.identifier: abc123xyz456
📋 Available sessions: [ 'abc123xyz456' ]
✅ Session abc123xyz456 VERIFIED and updated!
📊 KYC Data: {
  kycStatus: 'Verified',
  firstName: 'John',
  lastName: 'Doe',
  dob: '1990-01-01',
  verified: true
}
```

### Step 5: Frontend Auto-Update

**Expected Frontend Console Output:**
```
⏳ Status still pending: PENDING
📊 Polling update received: {
  success: true,
  session: {
    userId: 'test123',
    status: 'VERIFIED',
    kycData: {...}
  }
}
✅ Status is VERIFIED! Showing success...
```

**Expected UI:**
- ✅ Toast notification muncul: "✅ Verification Successful!"
- ✅ Page berubah ke success screen
- ✅ Menampilkan KYC data (Name, DOB, Status)

## Troubleshooting

### Problem 1: Toast Tidak Muncul

**Symptom:**
- Backend menunjukkan session VERIFIED
- Frontend console menunjukkan `⏳ Status still pending: PENDING` terus menerus

**Diagnosis:**
```bash
# Cek backend logs untuk session ID yang dibuat
# vs session ID yang diterima di callback
```

**Kemungkinan Penyebab:**
1. **Session ID Mismatch**:
   - Session ID dari `proof.identifier` tidak match dengan session yang disimpan
   - Backend log akan menunjukkan: `⚠️ WARNING: Session abc123 not found in sessions map!`

2. **Fallback ke userId Matching**:
   - Backend akan mencoba match by userId
   - Log: `🔍 Trying to find session by userId: test123`

**Solution:**
Backend sudah diperbaiki untuk:
- Log session ID saat dibuat
- Log session ID dari proof callback
- Fallback ke userId jika session ID tidak match

### Problem 2: Callback Tidak Diterima

**Symptom:**
- Frontend polling terus
- Tidak ada log `🔔 CALLBACK RECEIVED` di backend

**Diagnosis:**
```bash
# Cek ngrok web interface
open http://127.0.0.1:4040
```

**Kemungkinan Penyebab:**
1. Ngrok URL salah di `.env`
2. Backend tidak berjalan
3. Firewall blocking

**Solution:**
1. Restart ngrok dan update `.env`
2. Restart backend: `cd im-human-reclaim && pnpm start`

### Problem 3: Polling Berhenti Terlalu Cepat

**Symptom:**
- Polling stops before verification complete
- No error messages

**Diagnosis:**
Check console for:
```
❌ Error received: Verification timeout
```

**Solution:**
Polling timeout default: 5 minutes (300000ms)
Sudah cukup untuk normal verification flow.

## Debug Commands

### Check Session Status Manual

```bash
# Replace SESSION_ID with actual session ID
curl http://localhost:3000/api/reclaim/status/SESSION_ID | json_pp
```

### Check ngrok Tunnels

```bash
curl http://127.0.0.1:4040/api/tunnels
```

### Test Callback Endpoint

```bash
curl -X POST http://localhost:3000/api/reclaim/callback \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

## Success Criteria

✅ Backend:
- Session created dengan session ID
- Callback received dari Reclaim
- Session ID match dan di-update ke VERIFIED
- KYC data extracted

✅ Frontend:
- Polling dimulai setelah init
- Polling detect status change ke VERIFIED
- Toast notification muncul
- UI update ke success screen
- KYC data ditampilkan

## Monitoring Tools

1. **Backend Logs**: Terminal running `pnpm start`
2. **Frontend Console**: Browser DevTools Console
3. **Ngrok Inspector**: `http://127.0.0.1:4040`
4. **Network Tab**: Browser DevTools Network tab

## Next Steps After Success

Setelah verification berhasil dan toast muncul:

1. ✅ Verify data di success screen
2. ✅ Test "Verify Another Account" button
3. ✅ Test dengan user ID berbeda
4. ✅ Verify session persistence (optional)

---

## Quick Test Checklist

- [ ] Backend running dengan ngrok callback URL
- [ ] Frontend running di port 3001
- [ ] Browser console terbuka
- [ ] Backend terminal visible untuk monitoring
- [ ] Ngrok inspector terbuka (optional)
- [ ] Input test user ID
- [ ] Click Start Verification
- [ ] Complete verification di mobile
- [ ] Watch backend logs untuk callback
- [ ] Watch frontend console untuk polling updates
- [ ] Verify toast muncul
- [ ] Verify success screen dengan KYC data

Good luck testing! 🚀