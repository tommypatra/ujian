// requests/SeleksiRequest.js
const Joi = require('joi');

class SeleksiRequest {

    static store(data) {
        return Joi.object({
            nama: Joi.string().min(3).required(),
            wajib_validasi_foto: Joi.number().integer().valid(0, 1).required(),            
            waktu_mulai: Joi.date().required(),
            waktu_selesai: Joi.date().greater(Joi.ref('waktu_mulai')).required(),            
            reschedule_mulai: Joi.date().required(),
            reschedule_selesai: Joi.date().greater(Joi.ref('reschedule_mulai')).required(),            
            tahun: Joi.number().integer().min(2000).max(2100).required(),
            keterangan: Joi.string().allow(null, '').optional(),
        }).validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

    static update(data) {
        return Joi.object({
            nama: Joi.string().min(3).optional(),
            wajib_validasi_foto: Joi.number().integer().valid(0, 1).optional(),            
            waktu_mulai: Joi.date().optional(),
            waktu_selesai: Joi.date().greater(Joi.ref('waktu_mulai')).optional(),            
            reschedule_mulai: Joi.date().required(),
            reschedule_selesai: Joi.date().greater(Joi.ref('reschedule_mulai')).required(),            
            tahun: Joi.number().integer().min(2000).max(2100).optional(),
            keterangan: Joi.string().allow(null, '').optional(),
        })
        .min(1)
        .validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

}

module.exports = SeleksiRequest;
