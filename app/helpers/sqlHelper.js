/**
 * Build INSERT SQL secara dinamis
 * @param {Object} data - payload data
 * @param {Array} allowedColumns - kolom yang diizinkan
 * @param {Object} options
 */
function buildInsert(data, allowedColumns = [], options = {}) {
    const columns = [];
    const values = [];

    for (const col of allowedColumns) {
        if (data[col] !== undefined) {
            columns.push(col);
            values.push(data[col]);
        }
    }

    if (options.timestamps !== false) {
        columns.push('created_at');
        values.push(new Date());
    }

    return {
        columns: columns.join(', '),
        placeholders: columns.map(() => '?').join(', '),
        values
    };
}

/**
 * Build UPDATE SQL secara dinamis
 */
function buildUpdate(data, allowedColumns = [], options = {}) {
    const sets = [];
    const values = [];

    for (const col of allowedColumns) {
        if (data[col] !== undefined) {
            sets.push(`${col} = ?`);
            values.push(data[col]);
        }
    }

    if (sets.length === 0) return null;

    if (options.timestamps !== false) {
        sets.push('updated_at = ?');
        values.push(new Date());
    }

    return {
        setClause: sets.join(', '),
        values
    };
}

module.exports = {
    buildInsert,
    buildUpdate
};
