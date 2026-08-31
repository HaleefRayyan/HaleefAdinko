const dbPool = require('../config/database');

const getAllTestimoni = () => {
    const SQLQuery = 'SELECT testimoni.*, testimoni.id AS id FROM testimoni ORDER BY testimoni.id DESC';
    return dbPool.execute(SQLQuery);
}

const createNewTestimoni = (body) => {
    const SQLQuery = `  INSERT INTO testimoni (nama_klien, waktu, rating, deskripsi) 
                        VALUES (?, ?, ?, ?)`;
    const values = [body.nama_klien, body.waktu, body.rating, body.deskripsi];
    
    return dbPool.execute(SQLQuery, values);
} 

const updateTestimoni = (body, idtestimoni) => {
    const SQLQuery = `  UPDATE testimoni 
                        SET nama_klien=?, waktu=?, rating=?, deskripsi=? 
                        WHERE id=?`;
    const values = [body.nama_klien, body.waktu, body.rating, body.deskripsi, idtestimoni];
    
    return dbPool.execute(SQLQuery, values);
}

const deleteTestimoni = (idtestimoni) => {
    const SQLQuery = `DELETE FROM testimoni WHERE id=?`;
    
    return dbPool.execute(SQLQuery, [idtestimoni]);
}

module.exports = {
    getAllTestimoni,
    createNewTestimoni,
    updateTestimoni,
    deleteTestimoni,
}