// app/services/RoleService.js
const db = require('../../config/database');
const bcrypt = require('bcryptjs');
const RoleModel = require('../models/RoleModel');
const {pickFields} = require('../helpers/payloadHelper');

class RoleService {

    /**
     * Ambil semua Role (paging + search)
     */
    static async getAll(query) {
        const page  = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const offset = (page - 1) * limit;

        const where = [];
        const params = [];

        // search umum
        if (query.search) {
            where.push(`(role LIKE ?)`);
            params.push(`%${query.search}%`);
        }


        const whereSql = where.length
            ? `WHERE ${where.join(' AND ')}`
            : '';
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
            const payload = pickFields(data,RoleModel.columns);

            const RoleId = await RoleModel.insert(conn, payload);

            await conn.commit();

            return await RoleModel.findById(conn, RoleId);

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
     * Update Role
     */
    static async update(id, data) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const payload = pickFields(data,RoleModel.columns);

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
