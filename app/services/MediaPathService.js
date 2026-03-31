// app/services/MediaPathService.js
const db = require('../../config/database');
const crypto = require('crypto');
const MediaPathModel = require('../models/MediaPathModel');
const {pickFields} = require('../helpers/payloadHelper');

class MediaPathService {

    /**
     * Ambil semua MediaPath (paging + search)
     */
    static async getAll(query) {
        const page  = parseInt(query.page) || 1;
        const limit = query.limit != null ? parseInt(query.limit) : 10;
        const offset = (page - 1) * limit;

        const where = [];
        const params = [];

        // search umum
        if (query.search) {
            where.push(`(judul LIKE ? OR jenis LIKE ?)`);
            params.push(`%${query.search}%`);
            params.push(`%${query.search}%`);
        }

        const whereSql = where.length
            ? `WHERE ${where.join(' AND ')}`
            : '';
        const conn = await db.getConnection();
        try {
            const data  = await MediaPathModel.findAll(conn, whereSql, params, limit, offset);
            const total = await MediaPathModel.countAll(conn, whereSql, params);

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
     * Detail MediaPath
     */
    static async findByUuid(uuid) {
        const conn = await db.getConnection();
        try {
            const MediaPath = await MediaPathModel.findByUuid(conn, uuid);
            if (!MediaPath) {
                throw new Error('Data tidak ditemukan');
            }
            return MediaPath;
        } finally {
            conn.release();
        }
    }

    /**
     * Detail MediaPath
     */
    static async findById(id) {
        const conn = await db.getConnection();
        try {
            const MediaPath = await MediaPathModel.findById(conn, id);
            if (!MediaPath) {
                throw new Error('Data tidak ditemukan');
            }
            return MediaPath;
        } finally {
            conn.release();
        }
    }

    static async generateUniqueKey(conn) {
        while (true) {
            const uuid = crypto.randomBytes(32).toString('hex');

            const exists = await MediaPathModel.findByKey(conn,'uuid', uuid);
            if (!exists) return uuid;
        }
    }

    /**
     * Simpan MediaPath baru + MediaPath default
     */
    static async store(data) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();
            const payload = pickFields(data,MediaPathModel.columns);

            const uuid = await this.generateUniqueKey(conn);  
            // console.log(uuid);      
            payload.uuid = uuid;

            const MediaPathId = await MediaPathModel.insert(conn, payload);
            await conn.commit();

            return await MediaPathModel.findById(conn, MediaPathId);

        } catch (err) {            
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    /**
     * Update MediaPath
     */
    static async update(id, data) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const payload = pickFields(data,MediaPathModel.columns);

            const affected = await MediaPathModel.update(conn, id, payload);
            if (affected === 0) {
                throw new Error('Data tidak ditemukan atau tidak ada perubahan');
            }

            await conn.commit();
            return await MediaPathModel.findById(conn, id);

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    /**
     * Hapus MediaPath + relasi MediaPath
     */
    static async destroy(id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const data=this.findById(id);
            const affected = await MediaPathModel.deleteById(conn, id);

            if (affected === 0) {
                throw new Error('Data tidak ditemukan');
            }

            await conn.commit();
            if (data && data.path) {
                try {
                    await fs.unlink(data.path);
                } catch (e) {
                    console.error('Gagal hapus file:', data.path, e.message);
                }
            
            }
            return { id };

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }
}

module.exports = MediaPathService;
