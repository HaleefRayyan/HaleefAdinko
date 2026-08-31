const dbPool = require('../config/database');

const getAllContacts = () => {
    const SQLQuery = `  SELECT contact.*, contact.id AS id, kategori_layanan.kategori_layanan 
                        FROM contact 
                        LEFT JOIN kategori_layanan ON contact.kategori = kategori_layanan.idkategori_layanan
                        ORDER BY contact.id DESC`;
    return dbPool.execute(SQLQuery);
}

const createNewContact = (body) => {
    const SQLQuery = `  INSERT INTO contact (nama_lengkap, no_whatsapp, lokasi, keterangan, kategori) 
                        VALUES (?, ?, ?, ?, ?)`;
    const values = [body.nama_lengkap, body.no_whatsapp, body.lokasi, body.keterangan, body.kategori];
    
    return dbPool.execute(SQLQuery, values);
} 

const updateContact = (body, idcontact) => {
    const SQLQuery = `  UPDATE contact 
                        SET nama_lengkap=?, no_whatsapp=?, lokasi=?, keterangan=?, kategori=? 
                        WHERE id=?`;
    const values = [body.nama_lengkap, body.no_whatsapp, body.lokasi, body.keterangan, body.kategori, idcontact];
    
    return dbPool.execute(SQLQuery, values);
}

const deleteContact = (idcontact) => {
    const SQLQuery = `DELETE FROM contact WHERE id=?`;
    
    return dbPool.execute(SQLQuery, [idcontact]);
}

module.exports = {
    getAllContacts,
    createNewContact,
    updateContact,
    deleteContact,
}