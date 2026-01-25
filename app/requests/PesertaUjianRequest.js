// requests/PesertaUjianRequest.js
const Joi = require('joi');

class PesertaUjianRequest {

    static enterUjian(data) {
        return Joi.object({
            enter_foto: Joi.number().valid(0, 1).required()
        })
        .validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

}

module.exports = PesertaUjianRequest;
