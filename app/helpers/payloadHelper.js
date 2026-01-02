/**
 * Ambil hanya field yang diizinkan dari payload
 * @param {Object} data
 * @param {Array} allowedFields
 */
function pickFields(data, allowedFields = []) {
    const payload = {};

    for (const field of allowedFields) {
        if (data[field] !== undefined) {
            payload[field] = data[field];
        }
    }

    return payload;
}

module.exports = {
    pickFields
};
