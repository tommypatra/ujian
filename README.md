# 📘 Dokumentasi API – Sistem Ujian Berbasis Seleksi (Express.js)

Dokumentasi ini menjelaskan seluruh endpoint API pada sistem ujian berbasis seleksi yang dibangun menggunakan **Express.js**, **JWT Authentication**, dan **middleware berbasis peran (role & state)**.

API ini dirancang **state-based**, bukan session-based, sehingga seluruh kontrol ujian ditentukan oleh **status di database** (mis. `is_login`, `is_done`, waktu ujian).

---

## 🧠 Konsep Umum

* **Authentication**: JWT
* **Authorization**: Middleware berbasis role & kepemilikan data
* **Kontrol ujian**: Database state (`peserta_seleksis`, `pesertas`)
* **Ujian selesai**: oleh waktu, pengawas, atau state
* **Reschedule**: flow terpisah (exception flow)

---

## 🔐 Authentication

### Login User (Admin / Panitia)

`POST /login`

**Body:**

```json
{
  "email": "user@email.com",
  "password": "secret"
}
```

---

### Login Seleksi (Peserta / Pengawas)

`POST /login-seleksi`

**Body:**

```json
{
  "user_name": "peserta01",
  "password": "secret",
  "seleksi_id": 1,
  "login_sebagai": "peserta"
}
```

---

## 👑 API ADMIN

> Role: `admin`

### User Management

* `POST   /user`
* `GET    /user`
* `GET    /user/:id`
* `PUT    /user/:id`
* `DELETE /user/:id`

### Role Management

* `POST   /role`
* `GET    /role`
* `GET    /role/:id`
* `PUT    /role/:id`
* `DELETE /role/:id`

### User Role

* `POST   /user-role`
* `GET    /user-role`
* `GET    /user-role/:id`
* `PUT    /user-role/:id`
* `DELETE /user-role/:id`

---

## 🧩 API SELEKSI (Admin / Pembuat Soal)

* `POST   /seleksi`
* `GET    /seleksi`
* `GET    /seleksi/:id`
* `PUT    /seleksi/:id`
* `DELETE /seleksi/:id`

---

## 🧑‍💼 API PENGELOLA SELEKSI

> Middleware: `PengelolaSeleksiMiddleware`

### Jadwal Seleksi

* `GET    /jadwal/:seleksi_id/seleksi`
* `POST   /jadwal/:seleksi_id/seleksi`
* `GET    /jadwal/:seleksi_id/seleksi/:id`
* `PUT    /jadwal/:seleksi_id/seleksi/:id`
* `DELETE /jadwal/:seleksi_id/seleksi/:id`

### Pengawas Seleksi

* `GET    /pengawas/:seleksi_id/seleksi`
* `POST   /pengawas/:seleksi_id/seleksi`
* `PUT    /pengawas/:seleksi_id/seleksi/:id`
* `DELETE /pengawas/:seleksi_id/seleksi/:id`

### Peserta Seleksi

* `GET    /peserta/:seleksi_id/seleksi`
* `POST   /peserta/:seleksi_id/seleksi`
* `PUT    /peserta/:seleksi_id/seleksi/:id`
* `DELETE /peserta/:seleksi_id/seleksi/:id`

---

## 📚 API BANK SOAL

### Bank Soal

* `GET    /bank-soal`
* `POST   /bank-soal`
* `GET    /bank-soal/:id`
* `PUT    /bank-soal/:id`
* `DELETE /bank-soal/:id`

### Pilihan Ganda

* `GET    /bank-soal/:bank_soal_id/pg`
* `POST   /bank-soal/:bank_soal_id/pg`
* `PUT    /bank-soal/:bank_soal_id/pg/:id`
* `DELETE /bank-soal/:bank_soal_id/pg/:id`

---

## 👮 API PENGAWAS UJIAN

> Middleware: `PengawasUjianMiddleware`

* `GET  /pengawas/:seleksi_id/peserta`
* `GET  /pengawas/:seleksi_id/detail`
* `POST /pengawas/:seleksi_id/akhiri-ujian/:jadwal_seleksi_id`
* `PUT  /pengawas/:seleksi_id/validasi-enter/:jadwal_seleksi_id/:peserta_seleksi_id`
* `PUT  /pengawas/:seleksi_id/reset-login/:peserta_seleksi_id`

---

## 🎓 API PESERTA

### Jadwal Peserta

`GET /jadwal-peserta-seleksi`

### Enter Ujian

`POST /enter-ujian/:jadwal_seleksi_id`

Upload:

* `enter_foto` (jpg/png, max 4MB)

### Ujian

* `GET  /ujian/:peserta_seleksi_id/soal`
* `POST /ujian/:peserta_seleksi_id/simpan-jawaban`
* `POST /ujian/:peserta_seleksi_id/selesai-ujian`

> ⚠️ Catatan: endpoint ujian selalu divalidasi oleh state (`is_login`, `is_done`, waktu ujian)

---

## 🔁 API RESCHEDULE (Exception Flow)

### Peserta

* `GET    /peserta/:peserta_seleksi_id/reschedulle`
* `POST   /peserta/:peserta_seleksi_id/reschedulle`
* `PUT    /peserta/:peserta_seleksi_id/reschedulle/:id`
* `DELETE /peserta/:peserta_seleksi_id/reschedulle/:id`

Upload:

* dokumen PDF (0.5–1MB)

### Panitia

* `GET /pengelola/:seleksi_id/reschedulle`
* `PUT /pengelola/:seleksi_id/reschedulle/:id`

---

## 🔐 Catatan Keamanan

* JWT **bukan** kontrol ujian
* Akses ujian ditentukan oleh:

  * `is_login`
  * `is_done`
  * waktu jadwal
* Setelah ujian selesai, token boleh valid tapi **tidak berguna**

---

## ✅ Status Project

* Backend: **Selesai & Stabil**
* Architecture: **State-based, production-ready**
* Frontend: **Vue.js (Next step)**

---
