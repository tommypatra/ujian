// requests/UserRequest.js
const Joi = require('joi');

class SeleksiRequest {

    static store(data) {
        return Joi.object({
            nama: Joi.string().min(3).required(),
            waktu_mulai: Joi.date().required(),
            waktu_selesai: Joi.date().greater(Joi.ref('waktu_mulai')).required(),            
            prefix_nomor_peserta: Joi.string().min(3).required(),
            prefix_login: Joi.string().min(3).required(),
            keterangan: Joi.string().allow(null, '').optional(),
        }).validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

    static update(data) {
        return Joi.object({
            nama: Joi.string().min(3).required(),
            waktu_mulai: Joi.date().required(),
            waktu_selesai: Joi.date().greater(Joi.ref('waktu_mulai')).required(),            
            prefix_nomor_peserta: Joi.string().min(3).required(),
            prefix_login: Joi.string().min(3).required(),
            keterangan: Joi.string().allow(null, '').optional(),
        }).validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

}

module.exports = SeleksiRequest;
