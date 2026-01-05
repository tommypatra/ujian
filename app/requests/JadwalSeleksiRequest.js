// requests/JadwalSeleksiRequest.js
const Joi = require('joi');

class JadwalSeleksiRequest {

    static store(data) {
        return Joi.object({
            seleksi_id: Joi.number().integer().positive().required(),
            sesi: Joi.number().integer().positive().required(),
            tanggal: Joi.date().required(),
            jam_mulai: Joi.string().required(),            
            jam_selesai: Joi.string().required(),            
            lokasi_ujian: Joi.string().min(3).required(),
            status: Joi.string().min(3).required(),
        }).validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

    static update(data) {
        return Joi.object({
            seleksi_id: Joi.number().integer().positive().required(),
            sesi: Joi.number().integer().positive().required(),
            tanggal: Joi.date().required(),
            jam_mulai: Joi.string().required(),            
            jam_selesai: Joi.string().required(),            
            lokasi_ujian: Joi.string().min(3).required(),
            status: Joi.string().min(3).required(),
        }).validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

}

module.exports = JadwalSeleksiRequest;
