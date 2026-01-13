function mapDbError(err) {
    // Foreign key constraint
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        const match = err.message.match(/FOREIGN KEY \(`(.+?)`\)/);
        const field = match ? match[1] : 'referensi';
        return new Error(`Referensi ${field} tidak ditemukan`);
    }

    // Duplicate entry
if (err.code === 'ER_DUP_ENTRY') {
        const match = err.message.match(
            /Duplicate entry '(.+?)' for key '(.+?)'/
        );

        if (match) {
            const value = match[1];
            const key = match[2];

            // Optional: rapikan nama key
            const cleanKey = key
                .replace(/_unique$/i, '')
                .replace(/_/g, ' ');

            return new Error(
                `Data duplikat (${value}) pada ${cleanKey}`
            );
        }

        return new Error('Data sudah ada / duplikat');
    }
    return err;
}

module.exports = { mapDbError };
