const dbPool = require('../config/database');

const getAllPortfolio = () => {
    const SQLQuery = `  SELECT portfolio.*, kategori_layanan.nama_kategori 
                        FROM portfolio 
                        JOIN kategori_layanan ON portfolio.kategori_id = kategori_layanan.id`;
    return dbPool.execute(SQLQuery);
}

const createNewPortfolio = (body) => {
    const SQLQuery = `  INSERT INTO portfolio (nama_proyek, lokasi, kategori_id, tahun, deskripsi, image_url) 
                        VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [body.nama_proyek, body.lokasi, body.kategori_id, body.tahun, body.deskripsi, body.image_url];
    
    return dbPool.execute(SQLQuery, values);
} 

const updatePortfolio = (body, idPortfolio) => {
    const SQLQuery = `  UPDATE portfolio 
                        SET nama_proyek=?, lokasi=?, kategori_id=?, tahun=?, deskripsi=?, image_url=? 
                        WHERE id=?`;
    const values = [body.nama_proyek, body.lokasi, body.kategori_id, body.tahun, body.deskripsi, body.image_url, idPortfolio];
    
    return dbPool.execute(SQLQuery, values);
}

const deletePortfolio = (idPortfolio) => {
    const SQLQuery = `DELETE FROM portfolio WHERE id=?`;
    
    return dbPool.execute(SQLQuery, [idPortfolio]);
}

module.exports = {
    getAllPortfolio,
    createNewPortfolio,
    updatePortfolio,
    deletePortfolio,
}