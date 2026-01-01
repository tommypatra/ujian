// app/services/UserService.js
const db = require('../../config/database');
const bcrypt = require('bcryptjs');
const UserModel = require('../models/UserModel');
const UserRoleModel = require('../models/UserRoleModel');

class UserService {

    /**
     * Ambil semua user (paging + search)
     */
    static async getAll(query) {
        const page  = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const offset = (page - 1) * limit;

        let whereSql = '';
        let params = [];

        if (query.search) {
            whereSql = `WHERE name LIKE ? OR email LIKE ?`;
            params.push(`%${query.search}%`, `%${query.search}%`);
        }

        const conn = await db.getConnection();
        try {
            const data  = await UserModel.findAll(conn, whereSql, params, limit, offset);
            const total = await UserModel.countAll(conn, whereSql, params);

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
     * Detail user
     */
    static async findById(id) {
        const conn = await db.getConnection();
        try {
            const user = await UserModel.findById(conn, id);
            if (!user) {
                throw new Error('Data tidak ditemukan');
            }
            return user;
        } finally {
            conn.release();
        }
    }

    /**
     * Simpan user baru + role default
     */
    static async store(data) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const hashedPassword = await bcrypt.hash(data.password, 10);

            const userId = await UserModel.insert(conn, {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                created_at: new Date()
            });

            // role default (misal: pengguna = 2)
            await UserRoleModel.insert(conn, {
                user_id: userId,
                role_id: 2,
                created_at: new Date()
            });

            await conn.commit();

            return await UserModel.findById(conn, userId);

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    /**
     * Update user
     */
    static async update(id, data) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const payload = {};

            if (data.name !== undefined) payload.name = data.name;
            if (data.email !== undefined) payload.email = data.email;
            if (data.password !== undefined) {
                payload.password = await bcrypt.hash(data.password, 10);
            }

            const affected = await UserModel.update(conn, id, payload);
            if (affected === 0) {
                throw new Error('Data tidak ditemukan atau tidak ada perubahan');
            }

            await conn.commit();
            return await UserModel.findById(conn, id);

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    /**
     * Hapus user + relasi role
     */
    static async destroy(id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            await UserRoleModel.deleteByUserId(conn, id);
            const affected = await UserModel.deleteById(conn, id);

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

module.exports = UserService;
