// requests/PengawasUjianRequest.js
const Joi = require('joi');

class PengawasUjianRequest {

    static validasiPeserta(data) {
        return Joi.object({
            is_allow: Joi.number().valid(0, 1).required()
        })
        .validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

}

module.exports = PengawasUjianRequest;
