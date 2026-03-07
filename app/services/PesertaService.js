    // app/services/PesertaService.js
    const jwt = require('jsonwebtoken');
    const db = require('../../config/database');
    const bcrypt = require('bcryptjs');

    const PesertaModel = require('../models/PesertaModel');
    const SeleksiModel = require('../models/SeleksiModel');
    const PesertaSeleksiModel = require('../models/PesertaSeleksiModel');

    const {pickFields} = require('../helpers/payloadHelper');
    const {dateToString} = require('../helpers/webHelper');
const JadwalSeleksiModel = require('../models/JadwalSeleksiModel');


    class PesertaService {

        /**
         * Ambil semua Peserta (paging + search)
         */
        static async getAll(dataWeb) {
            const query = dataWeb.query;
            const seleksi_id = parseInt(dataWeb.params.seleksi_id) || null;

            const page  = parseInt(query.page) || 1;
            const limit = query.limit != null ? parseInt(query.limit) : 10;
            const offset = (page - 1) * limit;

            const where = [];
            const params = [];

            // search umum
            if (query.search) {
                // p.hp, p.email, p.nama, p.nomor_peserta, p.user_name
                where.push(`(p.email LIKE ? OR p.nama LIKE ? OR p.nomor_peserta LIKE ? OR p.hp LIKE ?)`);
                params.push(`%${query.search}%`);
                params.push(`%${query.search}%`);
                params.push(`%${query.search}%`);
                params.push(`%${query.search}%`);
            }

            // filter by seleksi_id
            where.push(`(p.seleksi_id = ?)`);
            params.push(`${seleksi_id}`);

            const whereSql = where.length
                ? `WHERE ${where.join(' AND ')}`
                : '';

            const conn = await db.getConnection();
            try {
                const data  = await PesertaModel.findAll(conn, whereSql, params, limit, offset);
                const total = await PesertaModel.countAll(conn, whereSql, params);

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
         * Detail Peserta
         */
        static async findById(id) {
            const conn = await db.getConnection();
            try {
                const Peserta = await PesertaModel.findById(conn, id);
                if (!Peserta) {
                    throw new Error('Data tidak ditemukan');
                }
                return Peserta;
            } finally {
                conn.release();
            }
        }

        /**
         * Detail Peserta
         */
        static async findBySesi(sesi) {
            const conn = await db.getConnection();
            try {
                const Peserta = await PesertaModel.findBySesi(conn, sesi);
                if (!Peserta) {
                    throw new Error('Data tidak ditemukan');
                }
                return Peserta;
            } finally {
                conn.release();
            }
        }

        static async buildPesertaPayload(conn, dataPeserta, seleksi_id) {
            const seleksi = await SeleksiModel.findById(conn, seleksi_id);
            if (!seleksi) {
                throw new Error(`Maaf, seleksi id ${seleksi_id} tidak ditemukan`);
            }

            const prefix = seleksi.prefix_app;

            const payload = pickFields(dataPeserta, PesertaModel.columns);
            payload.seleksi_id = seleksi_id;

            // if (!payload.user_name) {
            payload.user_name = `${prefix}-${dataPeserta.nomor_peserta}`;
            // }

            const tanggal_lahir = dateToString(dataPeserta.tanggal_lahir);
            payload.tanggal_lahir = tanggal_lahir;

            // default password dari tanggal lahir
            let plainPassword = tanggal_lahir.replace(/\D/g, '');

            if (dataPeserta.password && dataPeserta.password.trim() !== '') {
                plainPassword = dataPeserta.password;
            }

            payload.password = await bcrypt.hash(plainPassword, 10);

            // console.log(payload);

            return { payload, plainPassword };
        }

        /**
         * Simpan Peserta baru
         */

        static async store(data, seleksi_id) {
            const conn = await db.getConnection();
            try {
                await conn.beginTransaction();

                const { payload, plainPassword } = await this.buildPesertaPayload(conn, data, seleksi_id);

                const cariPeserta = await PesertaModel.findUserPeserta(conn, payload.user_name);

                let pesertaId = cariPeserta?.id;
                if(!pesertaId){
                    pesertaId= await PesertaModel.insert(conn, payload);
                }
                
                await conn.commit();
                const dataPeserta = await PesertaModel.findById(conn, pesertaId);

                return {
                    ...dataPeserta,
                    password: plainPassword
                };

            } catch (err) {
                await conn.rollback();
                throw err;
            } finally {
                conn.release();
            }
        }

        /**
         * Simpan Peserta baru
         */
        static async storePesertaSeleksi(conn, dataPeserta, seleksi_id, jadwal_seleksi_id) {

            const { payload } = await this.buildPesertaPayload(conn, dataPeserta, seleksi_id);
            // const peserta_id = await PesertaModel.insert(conn, payload);
            const cariPeserta = await PesertaModel.findUserPeserta(conn, payload.user_name);

            let peserta_id = cariPeserta?.id;
            if(!peserta_id){
                peserta_id= await PesertaModel.insert(conn, payload);
            }

            await PesertaSeleksiModel.insert(conn, {
                peserta_id,
                jadwal_seleksi_id
            });

            return peserta_id;
        }

        /**
         * Update Peserta
         */
        static async update(id, data,seleksi_id) {
            const conn = await db.getConnection();
            try {
                await conn.beginTransaction();

                const payload = pickFields(data,PesertaModel.columns);
                payload.seleksi_id=seleksi_id;
                let plainPassword='';
                if (data.password && data.password.trim() !== '') {
                    plainPassword=data.password;
                    payload.password = await bcrypt.hash(plainPassword, 10);
                }
                
                const affected = await PesertaModel.updateByKeys(conn, id, seleksi_id, payload);
                if (affected === 0) {
                    throw new Error('Data tidak ditemukan atau tidak ada perubahan');
                }

                await conn.commit();

                const result = await PesertaModel.findById(conn, id);

                return {
                    ...result,
                    password: plainPassword
                };            

            } catch (err) {
                await conn.rollback();
                throw err;
            } finally {
                conn.release();
            }
        }

        static async storeJadwalSeleksi(data, seleksi_id, jadwal_seleksi_id) {
            const conn = await db.getConnection();
            try {
                await conn.beginTransaction();
                await this.storePesertaSeleksi(
                    conn,
                    data,
                    seleksi_id,
                    jadwal_seleksi_id
                );
                await conn.commit();
                return {
                    success: true,
                    data
                };

            } catch (err) {
                await conn.rollback();
                throw err;
            } finally {
                conn.release();
            }        
        }


        // static async updateJadwalSeleksi(seleksi_id, peserta_id, peserta_seleksi_id, jadwal_seleksi_id, data) {
        //     const conn = await db.getConnection();
        //     try {
        //         await conn.beginTransaction();


        //         const payload = pickFields(data,PesertaModel.columns);
        //         payload.seleksi_id=seleksi_id;
        //         let plainPassword='';
        //         if (data.password && data.password.trim() !== '') {
        //             plainPassword=data.password;
        //             payload.password = await bcrypt.hash(plainPassword, 10);
        //         }
                
        //         const affected = await PesertaModel.updateByKeys(conn, peserta_id, seleksi_id, payload);

        //         if (affected === 0) {
        //             throw new Error('Data tidak ditemukan atau tidak ada perubahan');
        //         }

        //         //untuk proses update jadwal 

        //         const isValidPesertaSeleksi = await PesertaSeleksiModel.isValidPesertaSeleksi(conn, id, seleksi_id)
        //         const isValidJadwalSeleksi = await PesertaSeleksiModel.isValidJadwalSeleksi(conn, jadwal_seleksi_id, seleksi_id)

        //         if(!isValidPesertaSeleksi){
        //             throw new Error('Peserta tersebut tidak ditemukan dalam seleksi ini');
        //         }else if(!isValidJadwalSeleksi){
        //             throw new Error('Jadwal tersebut tidak ditemukan dalam seleksi ini');
        //         }

        //         const affectedPesertaSeleksi =
        //             await PesertaSeleksiModel.update(
        //                 conn,
        //                 peserta_seleksi_id,
        //                 {
        //                     peserta_id,
        //                     jadwal_seleksi_id
        //                 },
        //                 seleksi_id
        //             );

        //         if (affectedPesertaSeleksi === 0) {
        //             throw new Error('Data tidak ditemukan atau tidak ada perubahan');
        //         }

        //         await conn.commit();
        //         return await PesertaSeleksiModel.findById(conn, id);

        //     } catch (err) {
        //         await conn.rollback();
        //         throw err;
        //     } finally {
        //         conn.release();
        //     }        
        // }

        static async importBatch(rows = [], seleksi_id) {

            const conn = await db.getConnection();
            const errors = [];
            let inserted = 0;

            try {

                await conn.beginTransaction();

                const sesiUnik = [
                    ...new Set(
                        rows
                            .map(r => Number(r.sesi))
                            .filter(s => !isNaN(s))
                    )
                ];

                if (!sesiUnik.length) {
                    return { success: false, message: 'Tidak ada sesi valid' };
                }

                const jadwalRows = await JadwalSeleksiModel.cariIdJadwal(
                    conn,
                    seleksi_id,
                    sesiUnik
                );

                const jadwalMap = {};
                jadwalRows.forEach(j => {
                    jadwalMap[Number(j.sesi)] = j.id;
                });


                const sesiTidakAda = sesiUnik.filter(s => !jadwalMap[s]);
                // console.log(jadwalMap);

                if (sesiTidakAda.length > 0) {
                    return {
                        success: false,
                        message: `Sesi tidak ditemukan: ${sesiTidakAda.join(', ')}`
                    };
                }

                for (let i = 0; i < rows.length; i++) {

                    const { error, value } =
                        require('../requests/PesertaRequest').storeImport(rows[i]);

                    if (error) {
                        errors.push({
                            sesi: value?.sesi,
                            message: error.details[0].message
                        });
                        continue;
                    }

                    const jadwal_seleksi_id = jadwalMap[Number(value.sesi)];
                    if (!jadwal_seleksi_id) {
                        errors.push({
                            sesi: value?.sesi,
                            message: `peserta ${value?.nama} tidak ada jadwal seleksi ditemukan`
                        });
                        continue;
                    }


                    try {
                        await this.storePesertaSeleksi(
                            conn,
                            value,
                            seleksi_id,
                            jadwal_seleksi_id
                        );
                        inserted++;
                    } catch (err) {
                        errors.push({
                            sesi: value.sesi,
                            message: err.message
                        });
                    }
                }

                await conn.commit();

                return {
                    success: true,
                    inserted,
                    errors
                };

            } catch (err) {
                await conn.rollback();
                throw err;
            } finally {
                conn.release();
            }
        }        

        /**
         * Hapus Peserta
         */
        static async destroy(id,seleksi_id) {
            const conn = await db.getConnection();
            try {
                await conn.beginTransaction();

                const affected = await PesertaModel.deleteByKeys(conn, id, seleksi_id);

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

    module.exports = PesertaService;
