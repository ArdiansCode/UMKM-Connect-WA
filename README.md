# UMKM Connect WA

Asisten digital berbasis **Next.js** dan **AI Gemini** untuk membantu operasional UMKM melalui WhatsApp. Sistem ini membantu UMKM dalam mencatat keuangan, merancang strategi pemasaran, dan memberikan layanan pelanggan otomatis.

## 🚀 Fitur Utama

1. **WhatsApp Integration:** Otomatis memproses dan membalas pesan pelanggan menggunakan API [Fonnte](https://fonnte.com).
2. **AI Assistant (Gemini):** Memberikan saran cerdas untuk pengembangan bisnis UMKM.
3. **Pencatatan Keuangan:** Membantu UMKM dalam mencatat transaksi keuangan secara terstruktur melalui chat.
4. **Strategi Pemasaran:** Memberikan ide dan strategi pemasaran yang relevan dengan jenis bisnis UMKM.
5. **Context-Aware:** Menyimpan histori percakapan (via Supabase) sehingga asisten memahami konteks diskusi sebelumnya.
6. **Menu Sistem:** Navigasi mudah dengan perintah slash:
    - `/menu` : Melihat opsi layanan.
    - `/pemasaran` : Meminta saran/strategi pemasaran.
    - `/keuangan` : Mencatat atau meminta saran keuangan.
    - `/bantuan` : Melihat panduan penggunaan.

## 🛠 Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Database:** Supabase (PostgreSQL)
- **AI Engine:** Google Generative AI (Gemini)
- **Communication:** Fonnte API
- **UI:** Chakra UI & Tailwind CSS

## 📋 Konfigurasi Proyek

Pastikan kamu memiliki file `.env` di root direktori dengan variabel berikut:

```env
GEMINI_API_KEY=
FONNTE_API_TOKEN=
FONNTE_API_URL=https://api.fonnte.com
SUPABASE_URL=
SUPABASE_ANON_KEY=
PORT=3000
```

## 📦 Cara Menjalankan

1. **Install dependensi:**
   ```bash
   npm install
   ```
2. **Jalankan mode development:**
   ```bash
   npm run dev
   ```
3. **Webhook Testing (Local):**
   Gunakan `localtunnel` agar Fonnte dapat mengirim pesan ke localhost:
   ```bash
   npx localtunnel --port 3000 --subdomain umkm-conect-wa
   ```

## 🌐 Deployment (Vercel)

Aplikasi ini dioptimalkan untuk Vercel:
1. Hubungkan repository GitHub kamu ke Vercel.
2. Tambahkan semua variabel dari `.env` ke **Settings > Environment Variables** di dashboard Vercel.
3. Lakukan *Deploy*.
4. Update **Webhook URL** di dashboard Fonnte ke: 
   `https://[DOMAIN-ANDA].vercel.app/api/chat/receive-message`

## 💬 Panduan Penggunaan
- **Pendaftaran:** Sistem akan otomatis mendeteksi nomor WhatsApp yang terdaftar di database Supabase.
- **Interaksi AI:** Cukup kirim pesan dengan format alami. AI akan merespons berdasarkan profil bisnis (Nama UMKM & Jenis Usaha) yang tersimpan.
- **Pencatatan Keuangan:** Gunakan `/keuangan` diikuti detail transaksi (misal: "Catat pengeluaran beli stok 50rb").

---
*Dibuat untuk membantu digitalisasi UMKM Indonesia.* 🦀
