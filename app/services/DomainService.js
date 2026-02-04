// app/services/DomainService.js
const db = require('../../config/database');
const DomainModel = require('../models/DomainSoalModel');
const {pickFields} = require('../helpers/payloadHelper');

class DomainService {

    /**
     * Ambil semua Domain (paging + search)
     */
    static async getAll(query) {
        const page  = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const offset = (page - 1) * limit;

        const where = [];
        const params = [];

        // search umum
        if (query.search) {
            where.push(`(domain LIKE ? OR kode LIKE ?)`);
            params.push(`%${query.search}%`);
            params.push(`%${query.search}%`);
        }


        const whereSql = where.length
            ? `WHERE ${where.join(' AND ')}`
            : '';
        const conn = await db.getConnection();
        try {
            const data  = await DomainModel.findAll(conn, whereSql, params, limit, offset);
            const total = await DomainModel.countAll(conn, whereSql, params);

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
     * Detail Domain
     */
    static async findById(id) {
        const conn = await db.getConnection();
        try {
            const Domain = await DomainModel.findById(conn, id);
            if (!Domain) {
                throw new Error('Data tidak ditemukan');
            }
            return Domain;
        } finally {
            conn.release();
        }
    }

    /**
     * Simpan Domain baru + Domain default
     */
    static async store(data) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();
            const payload = pickFields(data,DomainModel.columns);

            const DomainId = await DomainModel.insert(conn, payload);

            await conn.commit();

            return await DomainModel.findById(conn, DomainId);

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    /**
     * Update Domain
     */
    static async update(id, data) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const payload = pickFields(data,DomainModel.columns);

            const affected = await DomainModel.update(conn, id, payload);
            if (affected === 0) {
                throw new Error('Data tidak ditemukan atau tidak ada perubahan');
            }

            await conn.commit();
            return await DomainModel.findById(conn, id);

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    /**
     * Hapus Domain + relasi Domain
     */
    static async destroy(id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const affected = await DomainModel.deleteById(conn, id);

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

module.exports = DomainService;
