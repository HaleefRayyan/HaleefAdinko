const dbPool = require('../config/database');

const getAllPortfolio = () => {
    const SQLQuery = `  SELECT portfolio.*, portfolio.idportfolio AS id, kategori_layanan.kategori_layanan
                        FROM portfolio 
                        LEFT JOIN kategori_layanan ON portfolio.kategori = kategori_layanan.idkategori_layanan
                        ORDER BY portfolio.idportfolio DESC`;
    return dbPool.execute(SQLQuery);
}

const createNewPortfolio = (body) => {
    const SQLQuery = `  INSERT INTO portfolio (nama_proyek, lokasi, kategori, tahun, deskripsi, image_url) 
                        VALUES (?, ?, ?, ?, ?, ?)`;
    const imagesJSON = typeof body.image_url === 'string' && (body.image_url.startsWith('[') || body.image_url.startsWith('{'))
        ? body.image_url
        : JSON.stringify(Array.isArray(body.image_url) ? body.image_url : [body.image_url].filter(Boolean));
    const values = [body.nama_proyek, body.lokasi, body.kategori, body.tahun, body.deskripsi, imagesJSON];
    
    return dbPool.execute(SQLQuery, values);
} 

const updatePortfolio = (body, idportfolio) => {
    const SQLQuery = `  UPDATE portfolio 
                        SET nama_proyek=?, lokasi=?, kategori=?, tahun=?, deskripsi=?, image_url=? 
                        WHERE idportfolio=?`;
    const imagesJSON = typeof body.image_url === 'string' && (body.image_url.startsWith('[') || body.image_url.startsWith('{'))
        ? body.image_url
        : JSON.stringify(Array.isArray(body.image_url) ? body.image_url : [body.image_url].filter(Boolean));
    const values = [body.nama_proyek, body.lokasi, body.kategori, body.tahun, body.deskripsi, imagesJSON, idportfolio];

    return dbPool.execute(SQLQuery, values);
}

const deletePortfolio = (idportfolio) => {
    const SQLQuery = `DELETE FROM portfolio WHERE idportfolio=?`;
    
    return dbPool.execute(SQLQuery, [idportfolio]);
}

module.exports = {
    getAllPortfolio,
    createNewPortfolio,
    updatePortfolio,
    deletePortfolio,
}