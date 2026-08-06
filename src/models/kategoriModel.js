const dbPool = require('../config/database');

const getAllKategori = () => {
    const SQLQuery = 'SELECT * FROM kategori_layanan';
    return dbPool.execute(SQLQuery);
}

const createNewKategori = (body) => {
    const SQLQuery = `INSERT INTO kategori_layanan (nama_kategori) VALUES (?)`;
    return dbPool.execute(SQLQuery, [body.nama_kategori]);
} 

const updateKategori = (body, idKategori) => {
    const SQLQuery = `UPDATE kategori_layanan SET nama_kategori=? WHERE id=?`;
    return dbPool.execute(SQLQuery, [body.nama_kategori, idKategori]);
}

const deleteKategori = (idKategori) => {
    const SQLQuery = `DELETE FROM kategori_layanan WHERE id=?`;
    return dbPool.execute(SQLQuery, [idKategori]);
}

module.exports = {
    getAllKategori,
    createNewKategori,
    updateKategori,
    deleteKategori,
}