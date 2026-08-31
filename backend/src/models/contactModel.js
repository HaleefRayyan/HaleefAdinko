const dbPool = require('../config/database');

// Cache the detected PK column name (could be 'id' or 'idcontact' depending on schema)
let _pkCol = null;

const getPkCol = async () => {
    if (_pkCol) return _pkCol;
    try {
        const [cols] = await dbPool.execute(`SHOW COLUMNS FROM contact`);
        const pk = cols.find(c => c.Key === 'PRI');
        _pkCol = pk ? pk.Field : 'id';
    } catch (e) {
        _pkCol = 'id';
    }
    return _pkCol;
};

const ensureContactTable = async () => {
    try {
        await dbPool.execute(`
            CREATE TABLE IF NOT EXISTS contact (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nama_lengkap VARCHAR(255) NOT NULL,
                no_whatsapp VARCHAR(50) NOT NULL,
                lokasi VARCHAR(255) NOT NULL,
                keterangan TEXT,
                kategori INT DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        _pkCol = null; // reset cache after table creation
    } catch (e) {
        console.warn('ensureContactTable warning:', e.message);
    }
};

const getAllContacts = async () => {
    await ensureContactTable();
    const pk = await getPkCol();
    const SQLQuery = `
        SELECT 
            c.*,
            c.${pk} AS id,
            kl.kategori_layanan 
        FROM contact c
        LEFT JOIN kategori_layanan kl ON c.kategori = kl.idkategori_layanan
        ORDER BY c.${pk} DESC`;
    return dbPool.execute(SQLQuery);
};

const createNewContact = async (body) => {
    await ensureContactTable();
    const SQLQuery = `INSERT INTO contact (nama_lengkap, no_whatsapp, lokasi, keterangan, kategori) 
                      VALUES (?, ?, ?, ?, ?)`;
    const values = [
        body.nama_lengkap,
        body.no_whatsapp,
        body.lokasi,
        body.keterangan || '',
        Number(body.kategori) || 1
    ];
    return dbPool.execute(SQLQuery, values);
};

const updateContact = async (body, idcontact) => {
    const pk = await getPkCol();
    const SQLQuery = `UPDATE contact 
                      SET nama_lengkap=?, no_whatsapp=?, lokasi=?, keterangan=?, kategori=? 
                      WHERE ${pk}=?`;
    const values = [
        body.nama_lengkap,
        body.no_whatsapp,
        body.lokasi,
        body.keterangan || '',
        Number(body.kategori) || 1,
        idcontact
    ];
    return dbPool.execute(SQLQuery, values);
};

const deleteContact = async (idcontact) => {
    const pk = await getPkCol();
    return dbPool.execute(`DELETE FROM contact WHERE ${pk}=?`, [idcontact]);
};

module.exports = {
    getAllContacts,
    createNewContact,
    updateContact,
    deleteContact,
};