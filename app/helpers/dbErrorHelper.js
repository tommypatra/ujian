function mapDbError(err) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        return new Error('Data tidak bisa dihapus karena masih memiliki relasi.');
    }

    // Foreign key constraint
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return new Error(`Referensi data tidak valid / tidak ditemukan`);
    }

    // Duplicate entry
    if (err.code === 'ER_DUP_ENTRY') {
        return new Error('Data sudah ada / duplikat');
    }
    return err;
}

module.exports = { mapDbError };
