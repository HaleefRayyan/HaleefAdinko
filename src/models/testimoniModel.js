const dbPool = require('../config/database');

const getAllTestimoni = () => {
    const SQLQuery = 'SELECT * FROM testimoni';
    return dbPool.execute(SQLQuery);
}

const createNewTestimoni = (body) => {
    const SQLQuery = `  INSERT INTO testimoni (nama_klien, peran_klien, isi_testimoni, rating) 
                        VALUES (?, ?, ?, ?)`;
    const values = [body.nama_klien, body.peran_klien, body.isi_testimoni, body.rating];
    
    return dbPool.execute(SQLQuery, values);
} 

const updateTestimoni = (body, idTestimoni) => {
    const SQLQuery = `  UPDATE testimoni 
                        SET nama_klien=?, peran_klien=?, isi_testimoni=?, rating=? 
                        WHERE id=?`;
    const values = [body.nama_klien, body.peran_klien, body.isi_testimoni, body.rating, idTestimoni];
    
    return dbPool.execute(SQLQuery, values);
}

const deleteTestimoni = (idTestimoni) => {
    const SQLQuery = `DELETE FROM testimoni WHERE id=?`;
    
    return dbPool.execute(SQLQuery, [idTestimoni]);
}

module.exports = {
    getAllTestimoni,
    createNewTestimoni,
    updateTestimoni,
    deleteTestimoni,
}