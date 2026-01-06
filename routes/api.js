const express = require('express')

const AuthMiddleware = require('../app/middlewares/AuthMiddleware');
const RequireRoleMiddleware = require('../app/middlewares/RequireRoleMiddleware');
const PengelolaSeleksiMiddleware = require('../app/middlewares/PengelolaSeleksiMiddleware');
const PesertaSeleksiMiddleware = require('../app/middlewares/PesertaSeleksiMiddleware');
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
const ReschedulleController = require('../app/controllers/ReschedulleController');
const ReschedulleSeleksiController = require('../app/controllers/ReschedulleSeleksiController');

const router = express.Router()

router.post('/login',  AuthController.login)
router.post('/login-peserta',  PesertaController.login)

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

//route roles
router.post('/user-role', AuthMiddleware, RequireRoleMiddleware('admin'), UserRoleController.store);
router.get('/user-role', AuthMiddleware, RequireRoleMiddleware('admin'), UserRoleController.index);
router.get('/user-role/:id', AuthMiddleware, RequireRoleMiddleware('admin'), UserRoleController.show);
router.put('/user-role/:id', AuthMiddleware, RequireRoleMiddleware('admin'), UserRoleController.update);
router.delete('/user-role/:id', AuthMiddleware, RequireRoleMiddleware('admin'), UserRoleController.destroy);

//route seleksi
router.post('/seleksi', AuthMiddleware, RequireRoleMiddleware('admin'), SeleksiController.store);
router.get('/seleksi', AuthMiddleware, RequireRoleMiddleware('admin'), SeleksiController.index);
router.get('/seleksi/:id', AuthMiddleware, RequireRoleMiddleware('admin'), SeleksiController.show);
router.put('/seleksi/:id', AuthMiddleware, RequireRoleMiddleware('admin'), SeleksiController.update);
router.delete('/seleksi/:id', AuthMiddleware, RequireRoleMiddleware('admin'), SeleksiController.destroy);

// ------------- AKHIR ROUTE ADMIN --------------


// ------------- AWAL ROUTE PENGELOLA SELEKSI --------------

//route seleksi-jadwal untuk pengelola {index untuk getall dan update sesuai :seleksi_id}
router.get('/seleksi/:seleksi_id/jadwal', AuthMiddleware, PengelolaSeleksiMiddleware, SeleksiController.index);
router.put('/seleksi/:seleksi_id/jadwal/:id', AuthMiddleware, PengelolaSeleksiMiddleware, SeleksiController.update);

//route pengelola-seleksi sesuai :seleksi_id
router.get('/pengelola/:seleksi_id/seleksi', AuthMiddleware, PengelolaSeleksiMiddleware, PengelolaSeleksiController.index);
router.post('/pengelola/:seleksi_id/seleksi', AuthMiddleware, PengelolaSeleksiMiddleware, PengelolaSeleksiController.store);
router.get('/pengelola/:seleksi_id/seleksi/:id', AuthMiddleware, PengelolaSeleksiMiddleware, PengelolaSeleksiController.show);
router.put('/pengelola/:seleksi_id/seleksi/:id', AuthMiddleware, PengelolaSeleksiMiddleware, PengelolaSeleksiController.update);
router.delete('/pengelola/:seleksi_id/seleksi/:id', AuthMiddleware, PengelolaSeleksiMiddleware, PengelolaSeleksiController.destroy);

//route jadwal-seleksi sesuai :seleksi_id
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
router.get('/reschedulle/:seleksi_id/peserta', AuthMiddleware, PengelolaSeleksiMiddleware, ReschedulleSeleksiController.index);
router.get('/reschedulle/:seleksi_id/peserta/:id', AuthMiddleware, PengelolaSeleksiMiddleware, ReschedulleSeleksiController.show);
router.put('/reschedulle/:seleksi_id/peserta/:id', AuthMiddleware, PengelolaSeleksiMiddleware, ReschedulleSeleksiController.update);

// ------------- AKHIR ROUTE PENGELOLA SELEKSI --------------

// ------------- AWAL ROUTE PESERTA --------------

// lihat reschedulle yg mereka input, bisa tambah, hapus, ganti, finalisasi
// kalau sudah finalisasi tidak bisa hapus atau ganti
router.get('/peserta/:peserta_seleksi_id/reschedulle', AuthMiddleware, PesertaSeleksiMiddleware, ReschedulleController.index);
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
    ReschedulleController.store
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
    ReschedulleController.update);
router.get('/peserta/:peserta_seleksi_id/reschedulle/:id', AuthMiddleware, PesertaSeleksiMiddleware, ReschedulleController.show);
router.delete('/peserta/:peserta_seleksi_id/reschedulle/:id', AuthMiddleware, PesertaSeleksiMiddleware, ReschedulleController.destroy);

// ------------- AKHIR ROUTE PESERTA --------------


module.exports = router