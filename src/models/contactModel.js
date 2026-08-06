const dbPool = require('../config/database');

const getAllContacts = () => {
    const SQLQuery = `  SELECT contacts.*, kategori_layanan.nama_kategori 
                        FROM contacts 
                        JOIN kategori_layanan ON contacts.kategori_id = kategori_layanan.id`;
    return dbPool.execute(SQLQuery);
}

const createNewContact = (body) => {
    const SQLQuery = `  INSERT INTO contacts (nama_lengkap, no_hp, lokasi, kategori_id) 
                        VALUES (?, ?, ?, ?)`;
    const values = [body.nama_lengkap, body.no_hp, body.lokasi, body.kategori_id];
    
    return dbPool.execute(SQLQuery, values);
} 

const updateContact = (body, idContact) => {
    const SQLQuery = `  UPDATE contacts 
                        SET nama_lengkap=?, no_hp=?, lokasi=?, kategori_id=? 
                        WHERE id=?`;
    const values = [body.nama_lengkap, body.no_hp, body.lokasi, body.kategori_id, idContact];
    
    return dbPool.execute(SQLQuery, values);
}

const deleteContact = (idContact) => {
    const SQLQuery = `DELETE FROM contacts WHERE id=?`;
    
    return dbPool.execute(SQLQuery, [idContact]);
}

module.exports = {
    getAllContacts,
    createNewContact,
    updateContact,
    deleteContact,
}