// requests/JadwalSeleksiRequest.js
const Joi = require('joi');

class JadwalSeleksiRequest {

    static store(data) {
        return Joi.object({
            sesi: Joi.number().integer().positive().required(),
            tanggal: Joi.date().required(),
            jam_mulai: Joi.string().required(),            
            jam_selesai: Joi.string().required(),            
            lokasi_ujian: Joi.string().min(3).required(),
            status: Joi.string().min(3).optional(),
        }).validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

    static update(data) {
        return Joi.object({
            sesi: Joi.number().integer().positive().required(),
            tanggal: Joi.date().required(),
            jam_mulai: Joi.string().optional(),            
            jam_selesai: Joi.string().optional(),            
            lokasi_ujian: Joi.string().min(3).optional(),
            status: Joi.string().min(3).optional(),
        }).validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

}

module.exports = JadwalSeleksiRequest;
