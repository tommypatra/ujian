const express = require('express')

const AuthMiddleware = require('../app/middlewares/AuthMiddleware');
const RequireRoleMiddleware = require('../app/middlewares/RequireRoleMiddleware');
const PengelolaSeleksiMiddleware = require('../app/middlewares/PengelolaSeleksiMiddleware');
const PesertaSeleksiMiddleware = require('../app/middlewares/PesertaSeleksiMiddleware');
const PembuatSoalMiddleware = require('../app/middlewares/PembuatSoalMiddleware');
const RolePesertaMiddleware = require('../app/middlewares/RolePesertaMiddleware');
const PemilikSoalPGMiddleware = require('../app/middlewares/PemilikSoalPGMiddleware');
const PengawasUjianMiddleware = require('../app/middlewares/PengawasUjianMiddleware');
const RolePengelolaMiddleware = require('../app/middlewares/RolePengelolaMiddleware');

const UploadMiddleware = require('../app/middlewares/UploadMiddleware');

//controller
const AuthController = require('../app/controllers/AuthController');
const UserController = require('../app/controllers/UserController');
const RoleController = require('../app/controllers/RoleController');
const UserRoleController = require('../app/controllers/UserRoleController');
const SeleksiController = require('../app/controllers/SeleksiController');
const PengelolaSeleksiController = require('../app/controllers/PengelolaSeleksiController');
const JadwalSeleksiController = require('../app/controllers/JadwalSeleksiController');
const PengawasSeleksiController = require('../app/controllers/PengawasSeleksiController');
const PesertaController = require('../app/controllers/PesertaController');
const PesertaSeleksiController = require('../app/controllers/PesertaSeleksiController');
const ReschedullePesertaController = require('../app/controllers/ReschedullePesertaController');
const ReschedullePanitiaController = require('../app/controllers/ReschedullePanitiaController');
const BankSoalController = require('../app/controllers/BankSoalController');
const BankSoalPilihanController = require('../app/controllers/BankSoalPilihanController');
const PengawasUjianController = require('../app/controllers/PengawasUjianController');
const SoalSeleksiController = require('../app/controllers/SoalSeleksiController');
const JumlahSoalController = require('../app/controllers/JumlahSoalController');
const UjianController = require('../app/controllers/UjianController');
const DomainController = require('../app/controllers/DomainController');
const JenisSoalController = require('../app/controllers/JenisSoalController');

const router = express.Router()

//wajib email, password
router.post('/login',  AuthController.login);
//wajib user_name, password, seleksi_id dan login_sebagai (peserta atau pengawas)
router.post('/login-seleksi',  AuthController.loginSeleksi);

// ------------- endpoint global cek token --------------
router.get('/cek-token', AuthMiddleware, AuthController.cekToken);

// ------------- AWAL ROUTE ADMIN --------------
//route users
router.post('/user', AuthMiddleware, RequireRoleMiddleware('admin'), UserController.store);
router.get('/user', AuthMiddleware, RequireRoleMiddleware('admin'), UserController.index);
router.get('/user/:id', AuthMiddleware, RequireRoleMiddleware('admin'), UserController.show);
router.put('/user/:id', AuthMiddleware, RequireRoleMiddleware('admin'), UserController.update);
router.delete('/user/:id', AuthMiddleware, RequireRoleMiddleware('admin'), UserController.destroy);

//route roles
router.post('/role', AuthMiddleware, RequireRoleMiddleware('admin'), RoleController.store);
router.get('/role', AuthMiddleware, RequireRoleMiddleware('admin'), RoleController.index);
router.get('/role/:id', AuthMiddleware, RequireRoleMiddleware('admin'), RoleController.show);
router.put('/role/:id', AuthMiddleware, RequireRoleMiddleware('admin'), RoleController.update);
router.delete('/role/:id', AuthMiddleware, RequireRoleMiddleware('admin'), RoleController.destroy);

//route domain soal
router.post('/domain-soal', AuthMiddleware, RequireRoleMiddleware('admin'), DomainController.store);
router.get('/domain-soal', AuthMiddleware, RequireRoleMiddleware('admin'), DomainController.index);
router.get('/domain-soal/:id', AuthMiddleware, RequireRoleMiddleware('admin'), DomainController.show);
router.put('/domain-soal/:id', AuthMiddleware, RequireRoleMiddleware('admin'), DomainController.update);
router.delete('/domain-soal/:id', AuthMiddleware, RequireRoleMiddleware('admin'), DomainController.destroy);

//route jenis soal
router.post('/jenis-soal', AuthMiddleware, RequireRoleMiddleware('admin'), JenisSoalController.store);
router.get('/jenis-soal', AuthMiddleware, RequireRoleMiddleware('admin'), JenisSoalController.index);
router.get('/jenis-soal/:id', AuthMiddleware, RequireRoleMiddleware('admin'), JenisSoalController.show);
router.put('/jenis-soal/:id', AuthMiddleware, RequireRoleMiddleware('admin'), JenisSoalController.update);
router.delete('/jenis-soal/:id', AuthMiddleware, RequireRoleMiddleware('admin'), JenisSoalController.destroy);


//route user roles
router.post('/user-role', AuthMiddleware, RequireRoleMiddleware('admin'), UserRoleController.store);
router.get('/user-role', AuthMiddleware, RequireRoleMiddleware('admin'), UserRoleController.index);
router.get('/user-role/:id', AuthMiddleware, RequireRoleMiddleware('admin'), UserRoleController.show);
router.put('/user-role/:id', AuthMiddleware, RequireRoleMiddleware('admin'), UserRoleController.update);
router.delete('/user-role/:id', AuthMiddleware, RequireRoleMiddleware('admin'), UserRoleController.destroy);

// ------------- AKHIR ROUTE ADMIN --------------


//
//route seleksi
router.post('/seleksi', AuthMiddleware, RequireRoleMiddleware('admin,pembuat-soal'), SeleksiController.store);
router.get('/seleksi', AuthMiddleware, RequireRoleMiddleware('admin,pembuat-soal'), SeleksiController.index);
router.get('/seleksi/:id', AuthMiddleware, RequireRoleMiddleware('admin,pembuat-soal'), SeleksiController.show);
router.put('/seleksi/:id', AuthMiddleware, RequireRoleMiddleware('admin,pembuat-soal'), SeleksiController.update);
router.delete('/seleksi/:id', AuthMiddleware, RequireRoleMiddleware('admin,pembuat-soal'), SeleksiController.destroy);



// ------------- AWAL ROUTE PENGELOLA SELEKSI --------------

//route seleksi-jadwal untuk pengelola {index untuk getall dan update sesuai :seleksi_id}
//route ini datanya di awali dengan insert terlebih dahulu di seleksi
//route untuk pengelola seleksi, ketika ingin melihat seleksi dan mengubah seleksi (tidak bisa insert atau delete seleksi)
router.get('/seleksi/:seleksi_id/jadwal', AuthMiddleware, PengelolaSeleksiMiddleware, SeleksiController.index);
router.put('/seleksi/:seleksi_id/jadwal/:id', AuthMiddleware, PengelolaSeleksiMiddleware, SeleksiController.update);

//route pengelola-seleksi sesuai :seleksi_id
router.get('/pengelola/:seleksi_id/seleksi', AuthMiddleware, PengelolaSeleksiMiddleware, PengelolaSeleksiController.index);
router.post('/pengelola/:seleksi_id/seleksi', AuthMiddleware, PengelolaSeleksiMiddleware, PengelolaSeleksiController.store);
router.get('/pengelola/:seleksi_id/seleksi/:id', AuthMiddleware, PengelolaSeleksiMiddleware, PengelolaSeleksiController.show);
router.put('/pengelola/:seleksi_id/seleksi/:id', AuthMiddleware, PengelolaSeleksiMiddleware, PengelolaSeleksiController.update);
router.delete('/pengelola/:seleksi_id/seleksi/:id', AuthMiddleware, PengelolaSeleksiMiddleware, PengelolaSeleksiController.destroy);

//route jadwal-seleksi sesuai :seleksi_id
//saat store ini otomatis juga buat akun pengawas
//jika password lupa maka dilakukan perubahan password manual pakai put pada endpoint pengawas
router.get('/jadwal/:seleksi_id/seleksi', AuthMiddleware, PengelolaSeleksiMiddleware, JadwalSeleksiController.index);
router.post('/jadwal/:seleksi_id/seleksi', AuthMiddleware, PengelolaSeleksiMiddleware, JadwalSeleksiController.store);
router.get('/jadwal/:seleksi_id/seleksi/:id', AuthMiddleware, PengelolaSeleksiMiddleware, JadwalSeleksiController.show);
router.put('/jadwal/:seleksi_id/seleksi/:id', AuthMiddleware, PengelolaSeleksiMiddleware, JadwalSeleksiController.update);
router.delete('/jadwal/:seleksi_id/seleksi/:id', AuthMiddleware, PengelolaSeleksiMiddleware, JadwalSeleksiController.destroy);

//route pengawas-seleksi sesuai :seleksi_id
router.get('/pengawas/:seleksi_id/seleksi', AuthMiddleware, PengelolaSeleksiMiddleware, PengawasSeleksiController.index);
router.post('/pengawas/:seleksi_id/seleksi', AuthMiddleware, PengelolaSeleksiMiddleware, PengawasSeleksiController.store);
router.get('/pengawas/:seleksi_id/seleksi/:id', AuthMiddleware, PengelolaSeleksiMiddleware, PengawasSeleksiController.show);
router.put('/pengawas/:seleksi_id/seleksi/:id', AuthMiddleware, PengelolaSeleksiMiddleware, PengawasSeleksiController.update);
router.delete('/pengawas/:seleksi_id/seleksi/:id', AuthMiddleware, PengelolaSeleksiMiddleware, PengawasSeleksiController.destroy);

//route peserta seleksi sesuai :seleksi_id
//bisa menyesuaikan data import
router.get('/peserta/:seleksi_id/seleksi', AuthMiddleware, PengelolaSeleksiMiddleware, PesertaController.index);
router.post('/peserta/:seleksi_id/seleksi', AuthMiddleware, PengelolaSeleksiMiddleware, PesertaController.store);
router.get('/peserta/:seleksi_id/seleksi/:id', AuthMiddleware, PengelolaSeleksiMiddleware, PesertaController.show);
router.put('/peserta/:seleksi_id/seleksi/:id', AuthMiddleware, PengelolaSeleksiMiddleware, PesertaController.update);
router.delete('/peserta/:seleksi_id/seleksi/:id', AuthMiddleware, PengelolaSeleksiMiddleware, PesertaController.destroy);

//route peserta seleksi jadwal sesuai :seleksi_id
router.get('/peserta/:seleksi_id/jadwal', AuthMiddleware, PengelolaSeleksiMiddleware, PesertaSeleksiController.index);
router.post('/peserta/:seleksi_id/jadwal', AuthMiddleware, PengelolaSeleksiMiddleware, PesertaSeleksiController.store);
router.get('/peserta/:seleksi_id/jadwal/:id', AuthMiddleware, PengelolaSeleksiMiddleware, PesertaSeleksiController.show);
router.put('/peserta/:seleksi_id/jadwal/:id', AuthMiddleware, PengelolaSeleksiMiddleware, PesertaSeleksiController.update);
router.delete('/peserta/:seleksi_id/jadwal/:id', AuthMiddleware, PengelolaSeleksiMiddleware, PesertaSeleksiController.destroy);

//route reschedulle seleksi sesuai :seleksi_id
//melihat daftar reschedulle sesuai seleksi_id dan mengubah status reschedulle
router.get('/pengelola/:seleksi_id/reschedulle', AuthMiddleware, PengelolaSeleksiMiddleware, ReschedullePanitiaController.index);
router.get('/pengelola/:seleksi_id/reschedulle/:id', AuthMiddleware, PengelolaSeleksiMiddleware, ReschedullePanitiaController.show);
router.put('/pengelola/:seleksi_id/reschedulle/:id', AuthMiddleware, PengelolaSeleksiMiddleware, ReschedullePanitiaController.update);

//untuk jumlah domain soal tiap seleksi
router.get('/jumlah/:seleksi_id/soal', AuthMiddleware, RolePengelolaMiddleware, JumlahSoalController.index);
router.post('/jumlah/:seleksi_id/soal', AuthMiddleware, RolePengelolaMiddleware, JumlahSoalController.store);
router.get('/jumlah/:seleksi_id/soal/:id', AuthMiddleware, RolePengelolaMiddleware, JumlahSoalController.show);
router.put('/jumlah/:seleksi_id/soal/:id', AuthMiddleware, RolePengelolaMiddleware, JumlahSoalController.update);
router.delete('/jumlah/:seleksi_id/soal/:id', AuthMiddleware, RolePengelolaMiddleware, JumlahSoalController.destroy);

//untuk pembuat soal
router.get('/bank-soal', AuthMiddleware, RolePengelolaMiddleware, BankSoalController.index);
router.post('/bank-soal', AuthMiddleware, RolePengelolaMiddleware, BankSoalController.store);
router.get('/bank-soal/:id', AuthMiddleware, RolePengelolaMiddleware, BankSoalController.show);
router.put('/bank-soal/:id', AuthMiddleware, RolePengelolaMiddleware, BankSoalController.update);
router.delete('/bank-soal/:id', AuthMiddleware, RolePengelolaMiddleware, BankSoalController.destroy);

//untuk pilihan ganda soal PG
router.get('/bank-soal/:bank_soal_id/pg', AuthMiddleware, PemilikSoalPGMiddleware, BankSoalPilihanController.index);
router.get('/bank-soal/:bank_soal_id/pg/:id', AuthMiddleware, PemilikSoalPGMiddleware, BankSoalPilihanController.show);
router.post('/bank-soal/:bank_soal_id/pg', AuthMiddleware, PemilikSoalPGMiddleware, BankSoalPilihanController.store);
router.put('/bank-soal/:bank_soal_id/pg/:id', AuthMiddleware, PemilikSoalPGMiddleware, BankSoalPilihanController.update);
router.delete('/bank-soal/:bank_soal_id/pg/:id', AuthMiddleware, PemilikSoalPGMiddleware, BankSoalPilihanController.destroy);
router.delete('/bank-soal/:bank_soal_id/pg', AuthMiddleware, PemilikSoalPGMiddleware, BankSoalPilihanController.destroyBySoalId);

//route soal seleksi jadwal sesuai :seleksi_id
router.get('/soal/:seleksi_id/seleksi', AuthMiddleware, PembuatSoalMiddleware, SoalSeleksiController.index);
router.post('/soal/:seleksi_id/seleksi', AuthMiddleware, PembuatSoalMiddleware, SoalSeleksiController.store);
router.get('/soal/:seleksi_id/seleksi/:id', AuthMiddleware, PembuatSoalMiddleware, SoalSeleksiController.show);
router.put('/soal/:seleksi_id/seleksi/:id', AuthMiddleware, PembuatSoalMiddleware, SoalSeleksiController.update);
router.delete('/soal/:seleksi_id/seleksi/:id', AuthMiddleware, PembuatSoalMiddleware, SoalSeleksiController.destroy);
// ------------- AKHIR ROUTE PENGELOLA SELEKSI --------------

// ------------- AWAL ROUTE PENGAWAS --------------
router.get('/pengawas/:seleksi_id/peserta', AuthMiddleware, PengawasUjianMiddleware, PengawasUjianController.index);
router.get('/pengawas/:seleksi_id/detail', AuthMiddleware, PengawasUjianMiddleware, PengawasUjianController.show);

router.post('/pengawas/:seleksi_id/akhiri-ujian/:jadwal_seleksi_id', AuthMiddleware, PengawasUjianMiddleware, PengawasUjianController.akhiriSesiUjian);

router.put('/pengawas/:seleksi_id/validasi-enter/:jadwal_seleksi_id/:peserta_seleksi_id', AuthMiddleware, PengawasUjianMiddleware, PengawasUjianController.validasiPeserta);
router.put('/pengawas/:seleksi_id/reset-login/:peserta_seleksi_id', AuthMiddleware, PengawasUjianMiddleware, PengawasUjianController.resetLogin);
// ------------- AKHIR ROUTE PENGAWAS --------------

// ------------- AWAL ROUTE PESERTA --------------

//untuk lihat jadwal yang dimiliki
router.get('/jadwal-peserta-seleksi', AuthMiddleware, RolePesertaMiddleware, PesertaSeleksiController.cariJadwal);
router.post('/enter-ujian/:jadwal_seleksi_id',
    AuthMiddleware, 
    RolePesertaMiddleware, 
    ...UploadMiddleware({
        folder: () => {
            const now = new Date();
            const tahun = now.getFullYear();
            const bulan = String(now.getMonth() + 1).padStart(2, '0');
            return `storage/enter_foto/${tahun}/${bulan}`;
        },
        maxSize: 4 * 1024 * 1024,
        allowed: ['jpg', 'jpeg', 'png'],
        fieldName: 'enter_foto'
    }),        
    PesertaSeleksiController.enterUjian
);

// lihat reschedulle yg mereka input, bisa tambah, hapus, ganti, finalisasi
// kalau sudah finalisasi tidak bisa hapus atau ganti
router.get('/peserta/:peserta_seleksi_id/reschedulle', AuthMiddleware, PesertaSeleksiMiddleware, ReschedullePesertaController.index);
router.post('/peserta/:peserta_seleksi_id/reschedulle', 
    AuthMiddleware, 
    PesertaSeleksiMiddleware, 
    ...UploadMiddleware({
        folder: () => {
            const now = new Date();
            const tahun = now.getFullYear();
            const bulan = String(now.getMonth() + 1).padStart(2, '0');
            return `storage/reschedulle/${tahun}/${bulan}`;
        },
        maxSize: 0.5 * 1024 * 1024,
        // allowed: ['pdf', 'jpg', 'jpeg', 'png', 'docx', 'xlsx'],
        allowed: ['pdf'],
        fieldName: 'dokumen_pendukung'
    }),    
    ReschedullePesertaController.store
);
router.put('/peserta/:peserta_seleksi_id/reschedulle/:id', 
    AuthMiddleware, 
    PesertaSeleksiMiddleware,
    ...UploadMiddleware({
        folder: () => {
            const now = new Date();
            const tahun = now.getFullYear();
            const bulan = String(now.getMonth() + 1).padStart(2, '0');
            return `storage/reschedulle/${tahun}/${bulan}`;
        },
        maxSize: 1 * 1024 * 1024,
        // allowed: ['pdf', 'jpg', 'jpeg', 'png', 'docx', 'xlsx'],
        allowed: ['pdf'],
        fieldName: 'dokumen_pendukung'
    }),
    ReschedullePesertaController.update);
router.get('/peserta/:peserta_seleksi_id/reschedulle/:id', AuthMiddleware, PesertaSeleksiMiddleware, ReschedullePesertaController.show);
router.delete('/peserta/:peserta_seleksi_id/reschedulle/:id', AuthMiddleware, PesertaSeleksiMiddleware, ReschedullePesertaController.destroy);



router.get('/ujian/:peserta_seleksi_id/soal', AuthMiddleware, PesertaSeleksiMiddleware, UjianController.index);
router.post('/ujian/:peserta_seleksi_id/simpan-jawaban', AuthMiddleware, PesertaSeleksiMiddleware, UjianController.simpanJawaban);
router.post('/ujian/:peserta_seleksi_id/selesai-ujian', AuthMiddleware, PesertaSeleksiMiddleware, UjianController.selesaiUjian);

// ------------- AKHIR ROUTE PESERTA --------------


module.exports = router