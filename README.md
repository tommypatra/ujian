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

**POST** `/api/login`

```json
#### Request
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
```

Login Seleksi (Peserta / Pengawas)

- POST `/api/login-seleksi`

```json
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
```

👤 USER
Method Endpoint

- GET `/api/users`
- POST `/api/users`
- GET `/api/users/:id`
- PUT `/api/users/:id`
- DELETE `/api/users/:id`

```json
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
```

🏁 SELEKSI
Method Endpoint

- GET `/api/seleksi`
- POST `/api/seleksi`
- PUT `/api/seleksi/:id`
- DELETE `/api/seleksi/:id`

```json
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
```

🕒 JADWAL SELEKSI
Method Endpoint

- GET `/api/seleksi/:seleksi_id/jadwal`
- POST `/api/seleksi/:seleksi_id/jadwal`
- PUT `/api/seleksi/:seleksi_id/jadwal/:id`
- DELETE `/api/seleksi/:seleksi_id/jadwal/:id`

```json
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
```

👨‍🎓 PESERTA
Peserta
Method Endpoint

- GET `/api/seleksi/:seleksi_id/peserta`
- POST `/api/seleksi/:seleksi_id/peserta`
- PUT `/api/seleksi/:seleksi_id/peserta/:id`
- DELETE `/api/seleksi/:seleksi_id/peserta/:id`

Catatan

- Username otomatis: prefix_app + nomor_peserta
- Password default: YYYYMMDD (tanggal lahir)

🧠 BANK SOAL
Bank Soal
Method Endpoint

- GET `/api/bank-soal`
- POST `/api/bank-soal`
- GET `/api/bank-soal/:id`
- PUT `/api/bank-soal/:id`
- DELETE `/api/bank-soal/:id`

```json
Response
{
  "id": 1,
  "pertanyaan": "Apa itu Node.js?",
  "media": [],
  "opsi_pilihan_ganda": []
}
```

Pilihan Ganda
Method Endpoint

- POST `/api/bank-soal/:id/pilihan`
- PUT `/api/bank-soal/:id/pilihan/:pilihan_id`
- DELETE `/api/bank-soal/:id/pilihan/:pilihan_id`

```json
Error
{
  "message": "Jawaban benar tidak boleh lebih dari 1"
}
```

📝 UJIAN
Ambil Soal (Lazy Load)

- GET `/api/ujian/soal?start=1&limit=2`

```json
{
  "start": 1,
  "limit": 2,
  "count": 2,
  "data": []
}
```

Simpan Jawaban

- POST `/api/ujian/jawaban`

```json
{
  "bank_soal_id": 10,
  "bank_soal_pilihan_id": 5
}

Error
{
  "message": "Pilihan jawaban tidak valid untuk soal ini"
}
```

Selesai Ujian

- POST `/api/ujian/selesai`

```json
{
  "is_done": 1
}
```

🔄 RESCHEDULLE
Reschedulle Peserta
Method Endpoint

- GET `/api/reschedulle/peserta/:peserta_seleksi_id`
- POST `/api/reschedulle/peserta/:peserta_seleksi_id`
- PUT `/api/reschedulle/peserta/:peserta_seleksi_id/:id`
- DELETE `/api/reschedulle/peserta/:peserta_seleksi_id/:id`

Validasi Panitia

- PUT `/api/reschedulle/panitia/:id/validasi`

```json
{
  "status": "ditolak",
  "catatan_verifikasi": "Dokumen tidak valid"
}
```

⚠️ FORMAT ERROR UMUM

```json
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
```

🧩 CATATAN TEKNIS

Semua endpoint (kecuali login) menggunakan JWT

Expired token default: 6 hari

Semua operasi tulis menggunakan transaction

File upload akan dihapus otomatis saat rollback

Random soal dilakukan per domain
