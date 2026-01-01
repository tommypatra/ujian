// app/services/RoleService.js
const db = require('../../config/database');
const bcrypt = require('bcryptjs');
const RoleModel = require('../models/RoleModel');

class RoleService {

    /**
     * Ambil semua Role (paging + search)
     */
    static async getAll(query) {
        const page  = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const offset = (page - 1) * limit;

        let whereSql = '';
        let params = [];

        if (query.search) {
            whereSql = `WHERE role LIKE ?`;
            params.push(`%${query.search}%`);
        }

        const conn = await db.getConnection();
        try {
            const data  = await RoleModel.findAll(conn, whereSql, params, limit, offset);
            const total = await RoleModel.countAll(conn, whereSql, params);

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
     * Detail Role
     */
    static async findById(id) {
        const conn = await db.getConnection();
        try {
            const Role = await RoleModel.findById(conn, id);
            if (!Role) {
                throw new Error('Data tidak ditemukan');
            }
            return Role;
        } finally {
            conn.release();
        }
    }

    /**
     * Simpan Role baru + role default
     */
    static async store(data) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const RoleId = await RoleModel.insert(conn, {
                role: data.role,
                created_at: new Date()
            });

            await conn.commit();

            return await RoleModel.findById(conn, RoleId);

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    /**
     * Update Role
     */
    static async update(id, data) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const payload = {};

            if (data.role !== undefined) payload.role = data.role;

            const affected = await RoleModel.update(conn, id, payload);
            if (affected === 0) {
                throw new Error('Data tidak ditemukan atau tidak ada perubahan');
            }

            await conn.commit();
            return await RoleModel.findById(conn, id);

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    /**
     * Hapus Role + relasi role
     */
    static async destroy(id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const affected = await RoleModel.deleteById(conn, id);

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

module.exports = RoleService;
