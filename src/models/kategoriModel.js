const dbPool = require('../config/database');

const getAllKategori = () => {
    const SQLQuery = 'SELECT * FROM kategori_layanan';
    return dbPool.execute(SQLQuery);
}

const createNewKategori = (body) => {
    const SQLQuery = `INSERT INTO kategori_layanan (kategori_layanan) VALUES (?)`;
    return dbPool.execute(SQLQuery, [body.kategori_layanan]);
} 

const updateKategori = (body, idkategori) => {
    const SQLQuery = `UPDATE kategori_layanan SET kategori_layanan=? WHERE id=?`;
    return dbPool.execute(SQLQuery, [body.kategori_layanan, idkategori]);
}

const deleteKategori = (idkategori) => {
    const SQLQuery = `DELETE FROM kategori_layanan WHERE id=?`;
    return dbPool.execute(SQLQuery, [idkategori]);
}

module.exports = {
    getAllKategori,
    createNewKategori,
    updateKategori,
    deleteKategori,
}