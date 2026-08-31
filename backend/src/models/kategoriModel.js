const dbPool = require('../config/database');

const getAllKategori = () => {
    const SQLQuery = 'SELECT idkategori_layanan AS id, idkategori_layanan, kategori_layanan FROM kategori_layanan ORDER BY idkategori_layanan ASC';
    return dbPool.execute(SQLQuery);
}

const createNewKategori = (body) => {
    const SQLQuery = `INSERT INTO kategori_layanan (kategori_layanan) VALUES (?)`;
    return dbPool.execute(SQLQuery, [body.kategori_layanan]);
} 

const updateKategori = (body, idkategori) => {
    const SQLQuery = `UPDATE kategori_layanan SET kategori_layanan=? WHERE idkategori_layanan=?`;
    return dbPool.execute(SQLQuery, [body.kategori_layanan, idkategori]);
}

const deleteKategori = (idkategori) => {
    const SQLQuery = `DELETE FROM kategori_layanan WHERE idkategori_layanan=?`;
    return dbPool.execute(SQLQuery, [idkategori]);
}

module.exports = {
    getAllKategori,
    createNewKategori,
    updateKategori,
    deleteKategori,
}