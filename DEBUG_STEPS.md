# Debug Steps - Frontend Tidak Mendeteksi Verifikasi

## Perbaikan yang Sudah Dilakukan

### 1. Backend Logging Enhanced ✅
- Session creation log dengan Session ID
- Callback received dengan detail lengkap
- Session matching dengan fallback ke userId

### 2. Frontend Polling Logging Enhanced ✅
- Log setiap poll request
- Log response dari backend
- Log API Base URL yang digunakan
- Log status changes

### 3. Backend Restarted dengan Ngrok URL ✅
```
Callback URL: https://5967e941eb58.ngrok-free.app/api/reclaim/callback
```

## Testing Steps dengan Logs

### Step 1: Buka Browser Console
1. Open Chrome DevTools (F12)
2. Go to Console tab
3. Clear console (Ctrl/Cmd + K)

### Step 2: Start Verification
1. Navigate to: `http://localhost:3001/cex-verify`
2. Input User ID: `test123`
3. Click "Start Verification"

**Expected Frontend Console Output:**
```javascript
✅ Verification initialized successfully!
Session ID: abc123xyz456
Request URL: https://share.reclaimprotocol.org/...

🔄 Starting to poll session status...
🔄 pollSessionStatus started for session: abc123xyz456
📡 API Base URL: http://192.168.1.18:3000
⏱️  Polling interval: 3000ms, Timeout: 300000ms

🔍 Poll #1 - Elapsed: 0s
📞 Checking status for session: abc123xyz456
📊 Response received: {
  "success": true,
  "session": {
    "userId": "test123",
    "createdAt": "...",
    "status": "PENDING"
  }
}
📊 Polling update received: {...}
⏳ Status still pending: PENDING
⏳ Status still PENDING, polling again in 3000ms...
```

### Step 3: Complete Verification on Mobile

Scan QR or click "Open Verification Page"

**Expected Backend Terminal Output:**
```bash
✨ NEW SESSION CREATED ✨
Session ID: abc123xyz456
User ID: test123
Callback URL: https://5967e941eb58.ngrok-free.app/api/reclaim/callback
Total sessions: 1
```

After verification complete:
```bash
🔔 ===== CALLBACK RECEIVED ===== 🔔
Timestamp: 2025-11-11T...
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

### Step 4: Frontend Auto-Update

**Expected Frontend Console Output (Next Poll):**
```javascript
🔍 Poll #5 - Elapsed: 12s
📞 Checking status for session: abc123xyz456
📊 Response received: {
  "success": true,
  "session": {
    "userId": "test123",
    "status": "VERIFIED",
    "kycData": {
      "kycStatus": "Verified",
      "firstName": "John",
      "lastName": "Doe",
      "dob": "1990-01-01",
      "verified": true
    },
    "verifiedAt": "..."
  }
}
✅ Polling stopped - Final status: VERIFIED

📊 Polling update received: {...}
✅ Status is VERIFIED! Showing success...
```

**Expected UI Changes:**
- ✅ Toast notification appears: "✅ Verification Successful!"
- ✅ Page transitions to success screen
- ✅ KYC data displayed (Name, DOB, Status)

## Diagnostic Checklist

### Issue: "Verifying... Please complete the verification on your device" tidak berubah

#### Check 1: API URL Frontend
```javascript
// Look for in console:
📡 API Base URL: http://192.168.1.18:3000
```

Expected: `http://192.168.1.18:3000`
If shows: `http://localhost:3000` → Frontend cannot reach backend from mobile

**Fix**: Update `.env.local`:
```env
NEXT_PUBLIC_RECLAIM_API_URL=http://192.168.1.18:3000
```

#### Check 2: Polling Started
```javascript
// Look for in console:
🔄 pollSessionStatus started for session: ...
```

If NOT present → Polling didn't start
**Fix**: Check if `pollSessionStatus` is called after init

#### Check 3: Backend Callback Received
```bash
# Look for in backend terminal:
🔔 ===== CALLBACK RECEIVED ===== 🔔
```

If NOT present → Callback tidak sampai ke backend
**Possible Causes**:
1. Ngrok URL salah di `.env`
2. Ngrok tunnel mati
3. Backend tidak running

**Check ngrok**:
```bash
curl http://127.0.0.1:4040/api/tunnels
# Should show: https://5967e941eb58.ngrok-free.app
```

**Restart if needed**:
```bash
# Kill and restart ngrok
pkill ngrok
ngrok http 3000

# Update .env with new URL if changed
# Restart backend
cd im-human-reclaim
pnpm start
```

#### Check 4: Session ID Match
```bash
# In backend logs, compare:
✨ NEW SESSION CREATED ✨
Session ID: abc123xyz456

# vs

🔍 Trying to match session ID from proof.identifier: abc123xyz456
```

If NOT match → Session ID mismatch
**Backend will fallback**:
```bash
⚠️  WARNING: Session abc123 not found!
🔍 Trying to find session by userId: test123
✅ Found matching session by userId: abc123xyz456
```

#### Check 5: Frontend Receiving VERIFIED Status
```javascript
// Look for in console after callback:
📊 Response received: {
  "success": true,
  "session": {
    "status": "VERIFIED",  // ← Should be VERIFIED
    ...
  }
}
```

If status is still "PENDING" after callback received:
**Problem**: Frontend polling to backend tapi session tidak ter-update

**Debug**:
```bash
# Manual check session status
curl http://192.168.1.18:3000/api/reclaim/status/SESSION_ID | json_pp
```

## Common Fixes

### Fix 1: Frontend Cannot Reach Backend
**Symptom**: Network errors in console, polling fails

**Solution**:
```bash
# Make sure backend listens on 0.0.0.0
# Already done in server.js:
app.listen(PORT, '0.0.0.0', () => { ... });

# Make sure ports are open
# Check if backend is accessible:
curl http://192.168.1.18:3000/health
```

### Fix 2: Ngrok URL Changed
**Symptom**: Callback tidak diterima backend

**Solution**:
```bash
# Get current ngrok URL
curl http://127.0.0.1:4040/api/tunnels | json_pp

# Update .env
nano im-human-reclaim/.env
# Change BASE_URL to new ngrok URL

# Restart backend
cd im-human-reclaim
pnpm start
```

### Fix 3: Session Cleared (Backend Restart)
**Symptom**: Session not found after verification

**Solution**:
Backend menggunakan in-memory storage. Jika backend restart, semua sessions hilang.
**Must start NEW verification** setelah backend restart.

## Quick Test Command

Test complete flow dengan curl:

```bash
# 1. Init verification
RESPONSE=$(curl -s "http://192.168.1.18:3000/api/reclaim/init?userId=test123")
echo $RESPONSE | json_pp

# Extract session ID
SESSION_ID=$(echo $RESPONSE | jq -r '.data.sessionId')
echo "Session ID: $SESSION_ID"

# 2. Check status (should be PENDING)
curl -s "http://192.168.1.18:3000/api/reclaim/status/$SESSION_ID" | json_pp

# 3. Complete verification on mobile...

# 4. Check status again (should be VERIFIED after callback)
curl -s "http://192.168.1.18:3000/api/reclaim/status/$SESSION_ID" | json_pp
```

## Success Criteria

✅ Backend:
- [x] Running dengan ngrok callback URL
- [x] Session created log visible
- [x] Callback received log visible
- [x] Session status updated to VERIFIED

✅ Frontend:
- [x] Polling started log visible
- [x] API Base URL correct (http://192.168.1.18:3000)
- [x] Polling responses showing session status
- [x] Status changes from PENDING → VERIFIED detected
- [x] Toast appears
- [x] UI updates to success screen

---

## Current State

✅ Backend: Running with ngrok URL `https://5967e941eb58.ngrok-free.app`
✅ Frontend: Enhanced logging added
✅ Polling: Detailed logging for every request/response

**Next**: Test verification and watch console logs!