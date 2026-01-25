// requests/SoalSeleksiRequest.js
const Joi = require('joi');

class SoalSeleksiRequest {

    static store(data) {
        return Joi.object({
            bank_soal_id: Joi.number().integer().positive().required(),
        }).validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

    static update(data) {
        return Joi.object({
            bank_soal_id: Joi.number().integer().positive().required(),
        })
        .validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

}

module.exports = SoalSeleksiRequest;