const dbPool = require('../config/database');

const getAllPortfolio = () => {
    const SQLQuery = `  SELECT portfolio.*, kategori_layanan.kategori_layanan
                        FROM portfolio 
                        JOIN kategori_layanan ON portfolio.kategori = idkategori_layanan`;
    return dbPool.execute(SQLQuery);
}

const createNewPortfolio = (body) => {
    const SQLQuery = `  INSERT INTO portfolio (nama_proyek, lokasi, kategori, tahun, deskripsi, image_url) 
                        VALUES (?, ?, ?, ?, ?, ?)`;
    const imagesJSON = JSON.stringify(body.image_url);
    const values = [body.nama_proyek, body.lokasi, body.kategori, body.tahun, body.deskripsi, imagesJSON];
    
    return dbPool.execute(SQLQuery, values);
} 

const updatePortfolio = (body, idportfolio) => {
    const SQLQuery = `  UPDATE portfolio 
                        SET nama_proyek=?, lokasi=?, kategori=?, tahun=?, deskripsi=?, image_url=? 
                        WHERE id=?`;
    const imagesJSON = JSON.stringify(body.image_url);
    const values = [body.nama_proyek, body.lokasi, body.kategori, body.tahun, body.deskripsi, imagesJSON, idportfolio];

    return dbPool.execute(SQLQuery, values);
}

const deletePortfolio = (idportfolio) => {
    const SQLQuery = `DELETE FROM portfolio WHERE id=?`;
    
    return dbPool.execute(SQLQuery, [idportfolio]);
}

module.exports = {
    getAllPortfolio,
    createNewPortfolio,
    updatePortfolio,
    deletePortfolio,
}