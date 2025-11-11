# I'm Human Protocol

Platform verifikasi identitas manusia menggunakan Reclaim Protocol dan Binance KYC untuk Web3.

## 🚀 Fitur

- **Binance KYC Verification**: Verifikasi KYC pengguna melalui Reclaim Protocol
- **Zero-Knowledge Proofs**: Privasi data pengguna terjaga
- **QR Code Support**: Verifikasi mudah via mobile
- **Real-time Status**: Auto-update status verifikasi
- **Modern UI**: Next.js 16 dengan Tailwind CSS 4

## 📦 Struktur Project

```
im-human/
├── im-human-reclaim/      # Backend Express.js + Reclaim Protocol
│   ├── server.js          # Main server
│   ├── .env               # Environment variables (jangan commit!)
│   └── package.json
│
├── im-human-frontend/     # Frontend Next.js
│   ├── app/
│   │   ├── cex-verify/   # Halaman verifikasi Binance KYC
│   │   └── components/
│   ├── lib/
│   │   └── reclaim-api.ts # API client untuk backend
│   └── package.json
│
└── README.md
```

## 🛠️ Setup & Installation

### Prerequisites

- Node.js 18+
- pnpm (recommended) atau npm
- Reclaim Protocol credentials dari [dev.reclaimprotocol.org](https://dev.reclaimprotocol.org)

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd im-human
```

### 2. Setup Backend (Reclaim Protocol)

```bash
cd im-human-reclaim

# Install dependencies
pnpm install

# Copy environment example dan isi credentials
cp .env.example .env
# Edit .env dengan credentials Anda
```

**Konfigurasi `.env`:**

```env
# Reclaim Protocol (REQUIRED)
RECLAIM_APP_ID=your_app_id
RECLAIM_APP_SECRET=your_app_secret
RECLAIM_PROVIDER_ID=your_provider_id

# Server
PORT=3000
BASE_URL=http://localhost:3000
```

**Jalankan backend:**

```bash
pnpm start
```

Backend akan berjalan di `http://localhost:3000`

### 3. Setup Frontend (Next.js)

Buka terminal baru:

```bash
cd im-human-frontend

# Install dependencies
pnpm install

# Environment sudah dikonfigurasi di .env.local
```

**Jalankan frontend:**

```bash
pnpm dev
```

Frontend akan berjalan di `http://localhost:3001`

## 🎯 Cara Menggunakan

### Flow Verifikasi KYC:

1. **Buka halaman CEX Verify**: `http://localhost:3001/cex-verify`
2. **Input User ID**: Masukkan ID unik pengguna (contoh: telegram_id)
3. **Wallet Address (Optional)**: Masukkan alamat wallet jika ada
4. **Klik "Start Verification"**: QR code akan muncul
5. **Scan QR atau klik "Open Verification Page"**
6. **Complete verification di Reclaim Protocol**
7. **Halaman auto-update** ketika verifikasi selesai
8. **Data KYC ditampilkan**: Nama, DOB, Status

### Testing dengan cURL:

```bash
# Test health check
curl http://localhost:3000/health

# Initialize verification
curl "http://localhost:3000/api/reclaim/init?userId=test123"

# Check session status
curl "http://localhost:3000/api/reclaim/status/<SESSION_ID>"

# Verify user KYC
curl "http://localhost:3000/api/verify-kyc/test123"
```

## 🔧 API Endpoints

### Backend (Port 3000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/reclaim/init` | Initialize proof request |
| POST | `/api/reclaim/callback` | Webhook dari Reclaim |
| GET | `/api/reclaim/status/:sessionId` | Check session status |
| GET | `/api/verify-kyc/:userId` | Verify user KYC |

### Frontend (Port 3001)

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/cex-verify` | Binance KYC Verification |
| `/onchain-verify` | On-chain Verification (Coming soon) |

## 📝 Environment Variables

### Backend (`im-human-reclaim/.env`)

```env
RECLAIM_APP_ID=          # App ID dari Reclaim DevTool
RECLAIM_APP_SECRET=      # App Secret dari Reclaim DevTool
RECLAIM_PROVIDER_ID=     # Provider ID (Binance KYC)
PORT=3000
BASE_URL=http://localhost:3000
```

### Frontend (`im-human-frontend/.env.local`)

```env
NEXT_PUBLIC_RECLAIM_API_URL=http://localhost:3000
```

## 🔐 Security Notes

- ❌ **JANGAN commit file `.env`** - sudah ada di `.gitignore`
- ✅ Gunakan `.env.example` sebagai template
- ✅ Credentials Reclaim Protocol harus di-encrypt
- ✅ Gunakan HTTPS di production
- ✅ Implement rate limiting untuk production

## 🎨 Tech Stack

### Backend
- Express.js 5
- Reclaim Protocol JS SDK 4.5
- Node.js Crypto
- CORS
- dotenv

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- Axios
- QRCode.react

## 📚 Documentation

- [Reclaim Protocol Docs](https://docs.reclaimprotocol.org)
- [Reclaim DevTool](https://dev.reclaimprotocol.org)
- [Next.js Docs](https://nextjs.org/docs)

## 🚀 Deployment

### Backend Deployment

Recommended: Railway, Render, atau Fly.io

```bash
# Set environment variables di platform
# Deploy dengan:
pnpm start
```

### Frontend Deployment

Recommended: Vercel

```bash
# Set NEXT_PUBLIC_RECLAIM_API_URL ke production backend URL
# Deploy otomatis via Git push
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - feel free to use this project!

## 👥 Authors

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

## 🙏 Acknowledgments

- [Reclaim Protocol](https://reclaimprotocol.org) - Zero-knowledge proof infrastructure
- [Binance](https://binance.com) - KYC provider
- [Next.js Team](https://nextjs.org) - Amazing framework

---

Made with ❤️ for Web3 Identity Verification