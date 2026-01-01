const express = require('express')
//controller
const AuthController = require('../app/controllers/AuthController');
const UserController = require('../app/controllers/UserController');
const RoleController = require('../app/controllers/RoleController');
const UserRoleController = require('../app/controllers/UserRoleController');
const SeleksiController = require('../app/controllers/SeleksiController');

const AuthMiddleware = require('../app/middlewares/AuthMiddleware');
const RequireRoleMiddleware = require('../app/middlewares/RequireRoleMiddleware');

const router = express.Router()

router.post('/login',  AuthController.login)

//route users
router.post('/users', AuthMiddleware, RequireRoleMiddleware('admin'), UserController.store);
router.get('/users', AuthMiddleware, RequireRoleMiddleware('admin'), UserController.index);
router.get('/users/:id', AuthMiddleware, RequireRoleMiddleware('admin'), UserController.show);
router.put('/users/:id', AuthMiddleware, RequireRoleMiddleware('admin'), UserController.update);
router.delete('/users/:id', AuthMiddleware, RequireRoleMiddleware('admin'), UserController.destroy);

//route roles
router.post('/roles', AuthMiddleware, RequireRoleMiddleware('admin'), RoleController.store);
router.get('/roles', AuthMiddleware, RequireRoleMiddleware('admin'), RoleController.index);
router.get('/roles/:id', AuthMiddleware, RequireRoleMiddleware('admin'), RoleController.show);
router.put('/roles/:id', AuthMiddleware, RequireRoleMiddleware('admin'), RoleController.update);
router.delete('/roles/:id', AuthMiddleware, RequireRoleMiddleware('admin'), RoleController.destroy);

//route roles
router.post('/user-roles', AuthMiddleware, RequireRoleMiddleware('admin'), UserRoleController.store);
router.get('/user-roles', AuthMiddleware, RequireRoleMiddleware('admin'), UserRoleController.index);
router.get('/user-roles/:id', AuthMiddleware, RequireRoleMiddleware('admin'), UserRoleController.show);
router.put('/user-roles/:id', AuthMiddleware, RequireRoleMiddleware('admin'), UserRoleController.update);
router.delete('/user-roles/:id', AuthMiddleware, RequireRoleMiddleware('admin'), UserRoleController.destroy);

//route seleksi
router.post('/seleksi', AuthMiddleware, RequireRoleMiddleware('admin'), SeleksiController.store);
router.get('/seleksi', AuthMiddleware, RequireRoleMiddleware('admin'), SeleksiController.index);
router.get('/seleksi/:id', AuthMiddleware, RequireRoleMiddleware('admin'), SeleksiController.show);
router.put('/seleksi/:id', AuthMiddleware, RequireRoleMiddleware('admin'), SeleksiController.update);
router.delete('/seleksi/:id', AuthMiddleware, RequireRoleMiddleware('admin'), SeleksiController.destroy);

module.exports = router