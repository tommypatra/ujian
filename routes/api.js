const express = require('express')
//controller
const AuthController = require('../app/controllers/AuthController');
const UserController = require('../app/controllers/UserController');
const RoleController = require('../app/controllers/RoleController');
const UserRoleController = require('../app/controllers/UserRoleController');
const SeleksiController = require('../app/controllers/SeleksiController');
const PengelolaSeleksiController = require('../app/controllers/PengelolaSeleksiController');
const JadwalSeleksiController = require('../app/controllers/JadwalSeleksiController');

const AuthMiddleware = require('../app/middlewares/AuthMiddleware');
const RequireRoleMiddleware = require('../app/middlewares/RequireRoleMiddleware');
const RequirePengelolaSeleksi = require('../app/middlewares/RequirePengelolaSeleksi');

const router = express.Router()

router.post('/login',  AuthController.login)
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
router.get('/seleksi/:seleksi_id/jadwal', AuthMiddleware, RequirePengelolaSeleksi, SeleksiController.index);
router.put('/seleksi/:seleksi_id/jadwal/:id', AuthMiddleware, RequirePengelolaSeleksi, SeleksiController.update);

//route pengelola-seleksi sesuai :seleksi_id
router.get('/pengelola/:seleksi_id/seleksi', AuthMiddleware, RequirePengelolaSeleksi, PengelolaSeleksiController.index);
router.post('/pengelola/:seleksi_id/seleksi', AuthMiddleware, RequirePengelolaSeleksi, PengelolaSeleksiController.store);
router.get('/pengelola/:seleksi_id/seleksi/:id', AuthMiddleware, RequirePengelolaSeleksi, PengelolaSeleksiController.show);
router.put('/pengelola/:seleksi_id/seleksi/:id', AuthMiddleware, RequirePengelolaSeleksi, PengelolaSeleksiController.update);
router.delete('/pengelola/:seleksi_id/seleksi/:id', AuthMiddleware, RequirePengelolaSeleksi, PengelolaSeleksiController.destroy);

//route jadwal-seleksi sesuai :seleksi_id
router.get('/jadwal/:seleksi_id/seleksi', AuthMiddleware, RequirePengelolaSeleksi, JadwalSeleksiController.index);
router.post('/jadwal/:seleksi_id/seleksi', AuthMiddleware, RequirePengelolaSeleksi, JadwalSeleksiController.store);
router.get('/jadwal/:seleksi_id/seleksi/:id', AuthMiddleware, RequirePengelolaSeleksi, JadwalSeleksiController.show);
router.put('/jadwal/:seleksi_id/seleksi/:id', AuthMiddleware, RequirePengelolaSeleksi, JadwalSeleksiController.update);
router.delete('/jadwal/:seleksi_id/seleksi/:id', AuthMiddleware, RequirePengelolaSeleksi, JadwalSeleksiController.destroy);

// ------------- AKHIR ROUTE PENGELOLA SELEKSI --------------

module.exports = router