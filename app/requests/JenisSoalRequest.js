// requests/JenisSoalRequest.js
const Joi = require('joi');

class JenisSoalRequest {

    static store(data) {
        return Joi.object({
            kode: Joi.string().min(3).required(),
            jenis: Joi.string().min(3).required(),
        }).validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

    static update(data) {
        return Joi.object({
            kode: Joi.string().min(3).optional(),
            jenis: Joi.string().min(3).optional(),
        })
        .min(1)
        .validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

}

module.exports = JenisSoalRequest;
