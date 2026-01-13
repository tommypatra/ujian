// app/services/UserRoleService.js
const db = require('../../config/database');
const bcrypt = require('bcryptjs');
const UserRoleModel = require('../models/UserRoleModel');
const UserModel = require('../models/UserModel');
const RoleModel = require('../models/RoleModel');
const {pickFields} = require('../helpers/payloadHelper');

class UserRoleService {

    /**
     * Ambil semua UserRole (paging + search)
     */
    static async getAll(query) {
        const page  = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const offset = (page - 1) * limit;

        const where = [];
        const params = [];

        // search umum
        if (query.search) {
            where.push(`(u.name LIKE ? OR u.email LIKE ?)`);
            params.push(`%${query.search}%`);
            params.push(`%${query.search}%`);
        }

        // filter by role_id
        if (query.role_id) {
            where.push(`(ur.role_id = ?)`);
            params.push(parseInt(query.role_id));
        }

        // filter by role
        if (query.role) {
            where.push(`(r.role = ?)`);
            params.push(query.role);
        }

        const whereSql = where.length
            ? `WHERE ${where.join(' AND ')}`
            : '';

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

            const payload = pickFields(data,UserRoleModel.columns);

            const UserRoleId = await UserRoleModel.insert(conn, payload);

            await conn.commit();

            return await UserRoleModel.findById(conn, UserRoleId);

        } catch (err) {
            await conn.rollback();

            // FK constraint (referensi tidak ditemukan)
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {

                // ambil nama foreign key
                const match = err.message.match(/FOREIGN KEY \(`(.+?)`\)/);
                const field = match ? match[1] : 'referensi';

                throw new Error(`Referensi ${field} tidak ditemukan`);
            }

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

            const payload = pickFields(data,UserRoleModel.columns);

            const affected = await UserRoleModel.update(conn, id, payload);
            if (affected === 0) {
                throw new Error('Data tidak ditemukan atau tidak ada perubahan');
            }

            await conn.commit();
            return await UserRoleModel.findById(conn, id);

        } catch (err) {
            await conn.rollback();

                        // FK constraint (referensi tidak ditemukan)
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {

                // ambil nama foreign key
                const match = err.message.match(/FOREIGN KEY \(`(.+?)`\)/);
                const field = match ? match[1] : 'referensi';

                throw new Error(`Referensi ${field} tidak ditemukan`);
            }

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
