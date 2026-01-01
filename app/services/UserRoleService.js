// app/services/UserRoleService.js
const db = require('../../config/database');
const bcrypt = require('bcryptjs');
const UserRoleModel = require('../models/UserRoleModel');
const UserModel = require('../models/UserModel');
const RoleModel = require('../models/RoleModel');

class UserRoleService {

    /**
     * Ambil semua UserRole (paging + search)
     */
    static async getAll(query) {
        const page  = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const offset = (page - 1) * limit;

        let whereSql = '';
        let params = [];

        if (query.search) {
            whereSql = `WHERE r.role LIKE ? u.name LIKE ? OR u.email LIKE ?`;
            params.push(`%${query.search}%`, `%${query.search}%`, `%${query.search}%`);
        }

        const conn = await db.getConnection();
        try {
            const data  = await UserRoleModel.findAll(conn, whereSql, params, limit, offset);
            const total = await UserRoleModel.countAll(conn, whereSql, params);

            return {
                data,
                meta: {
                    page,
                    limit,
                    total
                }
            };
        } finally {
            conn.release();
        }
    }

    /**
     * Detail UserRole
     */
    static async findById(id) {
        const conn = await db.getConnection();
        try {
            const exec_query = await UserRoleModel.findById(conn, id);
            if (!exec_query) {
                throw new Error('Data tidak ditemukan');
            }
            return exec_query;
        } finally {
            conn.release();
        }
    }

    /**
     * Simpan UserRole baru + UserRole default
     */
    static async store(data) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const user = await UserModel.findById(conn, data.user_id);
            if (!user) {
                throw new Error('User tidak ditemukan');
            }

            const role = await RoleModel.findById(conn, data.role_id);
            if (!role) {
                throw new Error('Role tidak ditemukan');
            }            

            const UserRoleId = await UserRoleModel.insert(conn, {
                user_id: data.user_id,
                role_id: data.role_id,
                created_at: new Date()
            });

            await conn.commit();

            return await UserRoleModel.findById(conn, UserRoleId);

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    /**
     * Update UserRole
     */
    static async update(id, data) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();
            const payload = {};

            if (data.user_id !== undefined){ 
                const user = await UserModel.findById(conn, data.user_id);
                if (!user) {
                    throw new Error('User tidak ditemukan');
                }

                payload.user_id = data.user_id;
            }
            if (data.role_id !== undefined){ 
                const role = await RoleModel.findById(conn, data.role_id);
                if (!role) {
                    throw new Error('Role tidak ditemukan');
                }            

                payload.role_id = data.role_id;
            }
            const affected = await UserRoleModel.update(conn, id, payload);
            if (affected === 0) {
                throw new Error('Data tidak ditemukan atau tidak ada perubahan');
            }

            await conn.commit();
            return await UserRoleModel.findById(conn, id);

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    /**
     * Hapus UserRole + relasi UserRole
     */
    static async destroy(id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const affected = await UserRoleModel.deleteById(conn, id);

            if (affected === 0) {
                throw new Error('Data tidak ditemukan');
            }

            await conn.commit();
            return { id };

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }
}

module.exports = UserRoleService;
