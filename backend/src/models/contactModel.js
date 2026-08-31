const dbPool = require('../config/database');

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
    } catch (e) {
        console.warn('ensureContactTable warning:', e.message);
    }
};

const getAllContacts = async () => {
    await ensureContactTable();
    const SQLQuery = `  SELECT contact.*, contact.id AS id, kategori_layanan.kategori_layanan 
                        FROM contact 
                        LEFT JOIN kategori_layanan ON contact.kategori = kategori_layanan.idkategori_layanan
                        ORDER BY contact.id DESC`;
    return dbPool.execute(SQLQuery);
};

const createNewContact = async (body) => {
    await ensureContactTable();
    const SQLQuery = `  INSERT INTO contact (nama_lengkap, no_whatsapp, lokasi, keterangan, kategori) 
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
    await ensureContactTable();
    const SQLQuery = `  UPDATE contact 
                        SET nama_lengkap=?, no_whatsapp=?, lokasi=?, keterangan=?, kategori=? 
                        WHERE id=?`;
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
    await ensureContactTable();
    const SQLQuery = `DELETE FROM contact WHERE id=?`;
    
    return dbPool.execute(SQLQuery, [idcontact]);
};

module.exports = {
    getAllContacts,
    createNewContact,
    updateContact,
    deleteContact,
}
