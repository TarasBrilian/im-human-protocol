# Setup Ngrok untuk Reclaim Protocol

## Mengapa Perlu Ngrok?

Reclaim Protocol SDK di mobile device memerlukan URL publik yang bisa diakses dari internet untuk mengirim callback. URL `localhost` atau IP lokal `192.168.1.18` **tidak bisa diakses** dari Reclaim Protocol's infrastructure.

Ngrok membuat tunnel dari URL publik (https://xxx.ngrok.io) ke localhost:3000 di komputer Anda.

## Langkah Setup Ngrok

### 1. Daftar Akun Ngrok (GRATIS)

1. Buka: https://dashboard.ngrok.com/signup
2. Daftar dengan email atau Google account
3. Verifikasi email Anda

### 2. Dapatkan Authtoken

1. Login ke dashboard: https://dashboard.ngrok.com
2. Pergi ke: https://dashboard.ngrok.com/get-started/your-authtoken
3. Copy authtoken Anda (format: `2xxx...`)

### 3. Setup Authtoken

Jalankan command berikut di terminal (replace `YOUR_AUTHTOKEN` dengan authtoken Anda):

```bash
ngrok config add-authtoken YOUR_AUTHTOKEN
```

Contoh:
```bash
ngrok config add-authtoken 2xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4. Start Ngrok Tunnel

Setelah authtoken di-setup, jalankan:

```bash
ngrok http 3000
```

Anda akan melihat output seperti ini:
```
Session Status                online
Account                       Your Name (Plan: Free)
Version                       3.31.0
Region                        Asia Pacific (ap)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://xxxx-xxx-xxx-xxx.ngrok-free.app -> http://localhost:3000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

### 5. Copy URL Ngrok

Dari output di atas, copy URL forwarding (yang dimulai dengan `https://`):
```
https://xxxx-xxx-xxx-xxx.ngrok-free.app
```

### 6. Update `.env` File

Edit file `im-human-reclaim/.env`:

```env
RECLAIM_APP_ID=0x55030129D4f54fb140B6FF8ff15fF425311b7a6c
RECLAIM_APP_SECRET=0xccf4e5229467f4b9cd426dc800f1c622258ccdff2c8c0ae72da8ca1832a1fbdf
RECLAIM_PROVIDER_ID=7d43d323-2c24-4f4c-9cce-dd4aa57301fb
PORT=3000

# Ganti dengan URL ngrok Anda
BASE_URL=https://xxxx-xxx-xxx-xxx.ngrok-free.app
```

### 7. Restart Backend Server

```bash
cd im-human-reclaim
pnpm start
```

Backend sekarang akan menggunakan ngrok URL sebagai callback:
```
Callback URL: https://xxxx-xxx-xxx-xxx.ngrok-free.app/api/reclaim/callback
```

### 8. Test dari Mobile

Sekarang Anda bisa test verifikasi dari:
- Computer browser: `http://localhost:3001/cex-verify`
- Mobile browser: `http://192.168.1.18:3001/cex-verify`

Callback akan dikirim ke ngrok URL yang bisa diakses dari mana saja!

## Monitoring Requests

Ngrok menyediakan web interface untuk melihat semua requests:
```
http://127.0.0.1:4040
```

Buka di browser untuk melihat:
- Semua incoming requests
- Request/response details
- Timing information

Ini sangat berguna untuk debugging!

## Alternative: Menggunakan Serveo (Tanpa Registrasi)

Jika tidak ingin mendaftar ngrok, bisa gunakan serveo (tapi kurang stabil):

```bash
ssh -R 80:localhost:3000 serveo.net
```

Output akan memberikan URL publik:
```
Forwarding HTTP traffic from https://xxxxx.serveo.net
```

Gunakan URL tersebut sebagai BASE_URL.

## Troubleshooting

### Ngrok Error: ERR_NGROK_4018
**Masalah**: Authtoken belum di-setup
**Solusi**: Jalankan `ngrok config add-authtoken YOUR_AUTHTOKEN`

### Callback masih gagal
**Masalah**: Backend belum restart setelah update BASE_URL
**Solusi**:
1. Stop backend (Ctrl+C)
2. Update `.env` dengan ngrok URL
3. Restart: `pnpm start`
4. Pastikan log menunjukkan ngrok URL di Callback URL

### Ngrok URL berubah
**Catatan**: Ngrok free plan memberikan URL random setiap kali restart. Anda perlu:
1. Stop ngrok
2. Start lagi: `ngrok http 3000`
3. Copy URL baru
4. Update `.env` dengan URL baru
5. Restart backend

**Solusi**: Upgrade ke ngrok paid plan untuk mendapat URL tetap (custom domain)

## Next Steps

Setelah ngrok setup:

1. ✅ Ngrok running: `ngrok http 3000`
2. ✅ Copy ngrok URL
3. ✅ Update `im-human-reclaim/.env` → `BASE_URL`
4. ✅ Restart backend
5. ✅ Test verification dari mobile
6. ✅ Monitor requests di `http://127.0.0.1:4040`

Sekarang callback dari Reclaim Protocol akan berhasil dikirim!