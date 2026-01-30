// requests/UjianRequest.js
const Joi = require('joi');

class UjianRequest {

static simpanJawaban(data) {
        return Joi.object({
            bank_soal_id: Joi.number().integer().positive().required(),
            bank_soal_pilihan_id: Joi.number().integer().positive().optional(),

            jawaban_text: Joi.number().integer().positive().optional(),
            nilai: Joi.number().integer().positive().optional(),
        })
        .or('jawaban_text', 'bank_soal_pilihan_id') // wajib salah satu
        .validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

}

module.exports = UjianRequest;
