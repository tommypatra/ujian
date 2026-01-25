// requests/PengawasSeleksiRequest.js
const Joi = require('joi');

class PengawasSeleksiRequest {

    static store(data) {
        return Joi.object({
            jadwal_seleksi_id: Joi.number().integer().positive().required(),
            name: Joi.string().min(3).required(),
            user_name: Joi.string().min(3).required(),
            password: Joi.string().min(6).optional(),
        }).validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

    static update(data) {
        return Joi.object({
            jadwal_seleksi_id: Joi.number().integer().positive().optional(),
            name: Joi.string().min(3).optional(),
            user_name: Joi.string().min(3).optional(),
            password: Joi.string().min(6).optional()
        })
        .min(1)
        .validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

}

module.exports = PengawasSeleksiRequest;
