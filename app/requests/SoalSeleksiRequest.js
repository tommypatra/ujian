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

    static storeBulkInsert(data) {
        return Joi.object({
            bank_soal_id: Joi.array()
                .items(
                    Joi.number()
                        .integer()
                        .positive()
                        .required()
                )
                .min(1)
                .required(),
        }).validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

    static bulkDelete(data) {
        return Joi.object({
            soal_seleksi_id: Joi.array()
                .items(
                    Joi.number()
                        .integer()
                        .positive()
                        .required()
                )
                .min(1)
                .unique()
                .required(),
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