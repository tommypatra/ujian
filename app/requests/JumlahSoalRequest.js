// requests/JumlahSoalRequest.js
const Joi = require('joi');

class JumlahSoalRequest {

    static store(data) {
        return Joi.object({
            domain_soal_id: Joi.number().integer().positive().required(),
            jumlah: Joi.number().integer().positive().required(),
        }).validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

    static update(data) {
        return Joi.object({
            domain_soal_id: Joi.number().integer().positive().optional(),
            jumlah: Joi.number().integer().positive().optional(),
        })
        .min(1)
        .validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

}

module.exports = JumlahSoalRequest;