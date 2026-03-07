// requests/PengawasSeleksiRequest.js
const Joi = require('joi');

class PengawasSeleksiRequest {

    static store(data) {
        return Joi.object({
            jadwal_seleksi_id: Joi.number().integer().positive().required(),
            user_id: Joi.number().integer().positive().required(),
        }).validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

    static update(data) {
        return Joi.object({
            jadwal_seleksi_id: Joi.number().integer().positive().optional(),
            user_id: Joi.number().integer().positive().optional(),
        })
        .min(1)
        .validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

}

module.exports = PengawasSeleksiRequest;
