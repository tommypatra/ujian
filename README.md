📘 DOKUMENTASI BACKEND API

Sistem Ujian & Seleksi Berbasis Komputer
Tech Stack: Node.js (Express) – MySQL – JWT – Joi

🔐 AUTENTIKASI
1️⃣ Login Admin / User

POST /api/auth/login

Request Body

{
"email": "admin@mail.com",
"password": "secret"
}

Response 200

{
"user": {
"id": 1,
"name": "Admin",
"email": "admin@mail.com",
"roles": ["admin"]
},
"token": "jwt_token_here"
}

Error

User tidak ditemukan

Password salah

2️⃣ Login Seleksi (Peserta / Pengawas)

POST /api/auth/login-seleksi

Request Body

{
"user_name": "24001001",
"password": "240101",
"login_sebagai": "peserta",
"seleksi_id": 1
}

Response

{
"user": {
"id": 10,
"user_name": "24001001",
"nama": "Budi",
"email": "budi@mail.com",
"roles": ["peserta"]
},
"token": "jwt_token"
}

Catatan

Peserta hanya bisa login 1 kali

Reset login dilakukan oleh pengawas

👤 USER & ROLE
User
Method Endpoint Keterangan
GET /api/users List user
POST /api/users Tambah user
GET /api/users/:id Detail
PUT /api/users/:id Update
DELETE /api/users/:id Hapus

Request (POST)

{
"name": "User Baru",
"email": "user@mail.com",
"password": "secret"
}

Role
Method Endpoint
GET /api/roles
POST /api/roles
PUT /api/roles/:id
DELETE /api/roles/:id
User Role
Method Endpoint
GET /api/user-roles
POST /api/user-roles
PUT /api/user-roles/:id
DELETE /api/user-roles/:id
🏁 SELEKSI
Seleksi
Method Endpoint
GET /api/seleksi
POST /api/seleksi
PUT /api/seleksi/:id
DELETE /api/seleksi/:id

Request

{
"nama": "Seleksi PMB 2026",
"waktu_mulai": "2026-05-01",
"waktu_selesai": "2026-05-30",
"tahun": 2026,
"keterangan": "Gelombang 1"
}

Catatan

prefix_app otomatis dibuat (berdasarkan tahun & urutan)

🕒 JADWAL SELEKSI
Method Endpoint
GET /api/seleksi/:seleksi_id/jadwal
POST /api/seleksi/:seleksi_id/jadwal
PUT /api/seleksi/:seleksi_id/jadwal/:id
DELETE /api/seleksi/:seleksi_id/jadwal/:id

Request

{
"sesi": 1,
"tanggal": "2026-06-01",
"jam_mulai": "08:00",
"jam_selesai": "10:00",
"lokasi_ujian": "Lab CBT 1"
}

Response Tambahan

{
"jadwal": {...},
"pengawas": {...},
"password_pengawas": "123456"
}

👨‍🏫 PENGAWAS
Pengawas Seleksi
Method Endpoint
GET /api/seleksi/:seleksi_id/pengawas
POST /api/seleksi/:seleksi_id/pengawas
PUT /api/seleksi/:seleksi_id/pengawas/:id
DELETE /api/seleksi/:seleksi_id/pengawas/:id

Catatan

Password default auto-generate 6 digit

Pengawas Ujian
Method Endpoint
GET /api/pengawas/ujian
PUT /api/pengawas/reset-login/:peserta_seleksi_id
PUT /api/pengawas/validasi/:peserta_seleksi_id
POST /api/pengawas/akhiri-sesi
👨‍🎓 PESERTA
Peserta
Method Endpoint
GET /api/seleksi/:seleksi_id/peserta
POST /api/seleksi/:seleksi_id/peserta
PUT /api/seleksi/:seleksi_id/peserta/:id
DELETE /api/seleksi/:seleksi_id/peserta/:id

Password Default

YYYYMMDD (tanggal lahir)

Peserta Seleksi
Method Endpoint
GET /api/seleksi/:seleksi_id/peserta-seleksi
POST /api/seleksi/:seleksi_id/peserta-seleksi
PUT /api/seleksi/:seleksi_id/peserta-seleksi/:id
DELETE /api/seleksi/:seleksi_id/peserta-seleksi/:id
🧠 BANK SOAL
Bank Soal
Method Endpoint
GET /api/bank-soal
POST /api/bank-soal
GET /api/bank-soal/:id
PUT /api/bank-soal/:id
DELETE /api/bank-soal/:id

Response

{
"id": 1,
"pertanyaan": "Apa itu Node.js?",
"opsi_pilihan_ganda": [],
"media": []
}

Pilihan Ganda
Method Endpoint
GET /api/bank-soal/:id/pilihan
POST /api/bank-soal/:id/pilihan
PUT /api/bank-soal/:id/pilihan/:pilihan_id
DELETE /api/bank-soal/:id/pilihan/:pilihan_id

Aturan

Jawaban benar maksimal 1

📝 UJIAN
Ambil Soal (Lazy Load)

GET /api/ujian/soal?start=1&limit=2

Response

{
"start": 1,
"limit": 2,
"count": 2,
"data": [...]
}

Simpan Jawaban

POST /api/ujian/jawaban

{
"bank_soal_id": 10,
"bank_soal_pilihan_id": 5
}

Catatan

Pilihan diverifikasi otomatis

Selesai Ujian

POST /api/ujian/selesai

{
"is_done": 1
}

🔄 RESCHEDULLE
Peserta
Method Endpoint
GET /api/reschedulle/peserta/:peserta_seleksi_id
POST /api/reschedulle/peserta/:peserta_seleksi_id
PUT /api/reschedulle/peserta/:peserta_seleksi_id/:id
DELETE /api/reschedulle/peserta/:peserta_seleksi_id/:id
Panitia
Method Endpoint
GET /api/reschedulle/panitia/:seleksi_id
PUT /api/reschedulle/panitia/:id/validasi
⚠️ ERROR UMUM
Error Keterangan
400 Validasi gagal
401 Token invalid
403 Tidak berhak
404 Data tidak ditemukan
409 Data duplikat
422 Relasi masih ada
🧩 CATATAN OPSIONAL

JWT expire default 6 hari

Random soal per domain

Pilihan PG bisa diacak

File upload dibersihkan saat rollback

Semua transaksi pakai DB Transaction

Kalau mau, selanjutnya aku bisa:

📄 Jadikan Markdown / PDF

🧪 Tambahkan contoh error response

🔐 Pisahkan dokumentasi per role

🧭 Buatkan diagram flow ujian

Tinggal bilang saja 👌

kalau bisa Jadikan mudah dicopy paste ke readme di git ya dan Tambahkan contoh error response.

Siap 👍
Di bawah ini aku susun dokumentasi versi README.md yang:

✅ Mudah di–copy paste ke Git

✅ Sudah rapi Markdown

✅ Ada contoh error response

✅ Konsisten dengan service + request (Joi) kamu

❌ Tanpa hal teknis internal (SQL / model)

Kamu bisa langsung copy seluruh isi mulai dari bawah ini ke README.md.

# 📘 Backend API – Sistem Ujian & Seleksi

Backend API untuk sistem seleksi & ujian berbasis komputer (CBT).

Tech Stack:

- Node.js (Express)
- MySQL
- JWT Authentication
- Joi Validation

---

## 🔐 AUTENTIKASI

### Login User (Admin / Panitia)

**POST** `/api/auth/login`

#### Request

```json
{
  "email": "admin@mail.com",
  "password": "secret"
}

Response 200
{
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@mail.com",
    "roles": ["admin"]
  },
  "token": "jwt_token"
}

Error Response
{
  "message": "User tidak ditemukan"
}

{
  "message": "Password salah"
}

Login Seleksi (Peserta / Pengawas)

POST /api/auth/login-seleksi

Request
{
  "user_name": "24001001",
  "password": "240101",
  "login_sebagai": "peserta",
  "seleksi_id": 1
}

Response
{
  "user": {
    "id": 10,
    "user_name": "24001001",
    "nama": "Budi",
    "email": "budi@mail.com",
    "roles": ["peserta"]
  },
  "token": "jwt_token"
}

Error
{
  "message": "Reset login akun anda terlebih dahulu pada pengawas ujian"
}

👤 USER
Method	Endpoint
GET	/api/users
POST	/api/users
GET	/api/users/:id
PUT	/api/users/:id
DELETE	/api/users/:id
Request (POST)
{
  "name": "User Baru",
  "email": "user@mail.com",
  "password": "secret"
}

Error (Duplicate)
{
  "message": "Data sudah ada / duplikat"
}

🏁 SELEKSI
Method	Endpoint
GET	/api/seleksi
POST	/api/seleksi
PUT	/api/seleksi/:id
DELETE	/api/seleksi/:id
Request
{
  "nama": "Seleksi PMB 2026",
  "waktu_mulai": "2026-05-01",
  "waktu_selesai": "2026-05-30",
  "tahun": 2026,
  "keterangan": "Gelombang 1"
}

Error
{
  "message": "Referensi data tidak valid / tidak ditemukan"
}

🕒 JADWAL SELEKSI
Method	Endpoint
GET	/api/seleksi/:seleksi_id/jadwal
POST	/api/seleksi/:seleksi_id/jadwal
PUT	/api/seleksi/:seleksi_id/jadwal/:id
DELETE	/api/seleksi/:seleksi_id/jadwal/:id
Request
{
  "sesi": 1,
  "tanggal": "2026-06-01",
  "jam_mulai": "08:00",
  "jam_selesai": "10:00",
  "lokasi_ujian": "Lab CBT 1"
}

Response Tambahan
{
  "jadwal": {...},
  "pengawas": {...},
  "password_pengawas": "123456"
}

👨‍🎓 PESERTA
Peserta
Method	Endpoint
GET	/api/seleksi/:seleksi_id/peserta
POST	/api/seleksi/:seleksi_id/peserta
PUT	/api/seleksi/:seleksi_id/peserta/:id
DELETE	/api/seleksi/:seleksi_id/peserta/:id
Catatan

Username otomatis: prefix_app + nomor_peserta

Password default: YYYYMMDD (tanggal lahir)

🧠 BANK SOAL
Bank Soal
Method	Endpoint
GET	/api/bank-soal
POST	/api/bank-soal
GET	/api/bank-soal/:id
PUT	/api/bank-soal/:id
DELETE	/api/bank-soal/:id
Response
{
  "id": 1,
  "pertanyaan": "Apa itu Node.js?",
  "media": [],
  "opsi_pilihan_ganda": []
}

Pilihan Ganda
Method	Endpoint
POST	/api/bank-soal/:id/pilihan
PUT	/api/bank-soal/:id/pilihan/:pilihan_id
DELETE	/api/bank-soal/:id/pilihan/:pilihan_id
Error
{
  "message": "Jawaban benar tidak boleh lebih dari 1"
}

📝 UJIAN
Ambil Soal (Lazy Load)

GET /api/ujian/soal?start=1&limit=2

{
  "start": 1,
  "limit": 2,
  "count": 2,
  "data": []
}

Simpan Jawaban

POST /api/ujian/jawaban

{
  "bank_soal_id": 10,
  "bank_soal_pilihan_id": 5
}

Error
{
  "message": "Pilihan jawaban tidak valid untuk soal ini"
}

Selesai Ujian

POST /api/ujian/selesai

{
  "is_done": 1
}

🔄 RESCHEDULLE
Reschedulle Peserta
Method	Endpoint
GET	/api/reschedulle/peserta/:peserta_seleksi_id
POST	/api/reschedulle/peserta/:peserta_seleksi_id
PUT	/api/reschedulle/peserta/:peserta_seleksi_id/:id
DELETE	/api/reschedulle/peserta/:peserta_seleksi_id/:id
Validasi Panitia

PUT /api/reschedulle/panitia/:id/validasi

{
  "status": "ditolak",
  "catatan_verifikasi": "Dokumen tidak valid"
}

⚠️ FORMAT ERROR UMUM
{
  "message": "Data tidak ditemukan"
}

{
  "message": "Data tidak bisa dihapus karena masih memiliki relasi."
}

{
  "message": "Validasi gagal",
  "errors": [
    {
      "field": "email",
      "message": "email wajib diisi"
    }
  ]
}

🧩 CATATAN TEKNIS

Semua endpoint (kecuali login) menggunakan JWT

Expired token default: 6 hari

Semua operasi tulis menggunakan transaction

File upload akan dihapus otomatis saat rollback

Random soal dilakukan per domain
```
