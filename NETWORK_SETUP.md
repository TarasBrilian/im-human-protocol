# Network Setup untuk Mobile Access

## Masalah yang Diperbaiki

Sebelumnya, backend menggunakan `http://localhost:3000` sebagai callback URL. Ini menyebabkan masalah karena:
- Mobile device tidak bisa mengakses `localhost` dari komputer Anda
- Reclaim Protocol SDK di mobile tidak bisa mengirim callback ke backend
- Verifikasi gagal karena proof tidak bisa dikirim

## Solusi yang Diterapkan

### 1. Backend Server (Port 3000)
- Server sekarang mendengarkan di `0.0.0.0` (semua network interfaces)
- Menggunakan IP lokal `192.168.1.18` untuk callback URL
- Callback URL: `http://192.168.1.18:3000/api/reclaim/callback`

### 2. Frontend (Port 3001)
- API URL diubah ke `http://192.168.1.18:3000`
- Frontend dapat diakses di:
  - Komputer: `http://localhost:3001`
  - Mobile: `http://192.168.1.18:3001`

## Cara Menggunakan

### Akses dari Komputer
```bash
# Frontend
http://localhost:3001/cex-verify

# Backend API
http://localhost:3000/health
```

### Akses dari Mobile (Harus WiFi yang Sama!)
```bash
# Frontend
http://192.168.1.18:3001/cex-verify

# Backend API
http://192.168.1.18:3000/health
```

## Testing

### 1. Test Backend Health
```bash
curl http://192.168.1.18:3000/health
```

### 2. Test Callback Endpoint
```bash
curl -X POST http://192.168.1.18:3000/api/reclaim/callback \
  -H "Content-Type: application/json" \
  -d '{"test": "ping"}'
```

### 3. Test dari Mobile
Buka browser di mobile device (yang terhubung ke WiFi yang sama), akses:
```
http://192.168.1.18:3001/cex-verify
```

## Catatan Penting

1. **WiFi yang Sama**: Pastikan mobile device terhubung ke WiFi yang sama dengan komputer development
2. **IP Address**: IP `192.168.1.18` adalah IP lokal komputer Anda. Jika berubah, update di:
   - `im-human-reclaim/.env` → `NETWORK_IP` dan `BASE_URL`
   - `im-human-frontend/.env.local` → `NEXT_PUBLIC_RECLAIM_API_URL`

3. **Firewall**: Pastikan firewall tidak memblokir koneksi di port 3000 dan 3001

## Troubleshooting

### Callback masih gagal?
1. Cek IP address komputer:
   ```bash
   ipconfig getifaddr en0  # macOS
   # atau
   ipconfig  # Windows
   ```

2. Update IP di `.env` files jika berbeda

3. Restart backend server:
   ```bash
   cd im-human-reclaim
   pnpm start
   ```

### Mobile tidak bisa akses?
1. Pastikan mobile dan komputer di WiFi yang sama
2. Test ping dari mobile ke IP komputer
3. Cek firewall settings

## Flow Verifikasi Lengkap

1. **User buka frontend** di `http://192.168.1.18:3001/cex-verify`
2. **Input User ID** dan klik "Start Verification"
3. **QR Code muncul** atau klik "Open Verification Page"
4. **Reclaim SDK di mobile**:
   - Load Binance login page
   - Intercept network requests
   - Generate zero-knowledge proof
5. **Kirim proof ke callback**: `http://192.168.1.18:3000/api/reclaim/callback`
6. **Backend verify proof** dan update session status
7. **Frontend polling status** dan menampilkan hasil

## File yang Diubah

1. **im-human-reclaim/server.js**
   - Server listen di `0.0.0.0` instead of default
   - Menampilkan network IP di console log
   - Enhanced callback logging

2. **im-human-reclaim/.env**
   ```env
   NETWORK_IP=192.168.1.18
   BASE_URL=http://192.168.1.18:3000
   ```

3. **im-human-frontend/.env.local**
   ```env
   NEXT_PUBLIC_RECLAIM_API_URL=http://192.168.1.18:3000
   ```

## Server Status

✅ Backend: Running on `http://192.168.1.18:3000`
✅ Frontend: Running on `http://192.168.1.18:3001`
✅ Callback URL: Configured to `http://192.168.1.18:3000/api/reclaim/callback`
✅ Network access: Enabled (listening on 0.0.0.0)

Sekarang mobile device Anda dapat mengirim callback proof ke backend!