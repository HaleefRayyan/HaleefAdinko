const kategoriModel = require('../models/kategoriModel');

const getKategori = async (req, res) => {
    try {
        const [data] = await kategoriModel.getAllKategori();
        res.status(200).json({
            message: "Get all kategori success",
            data: data
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            serverMessage: error,
        });
    }
}

const createNewKategori = async (req, res) => {
    const { body } = req;
    try {
        await kategoriModel.createNewKategori(body);
        res.status(201).json({
            message: "Create new kategori success",
            data: body
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            serverMessage: error,
        });
    }
}

const updateKategori = async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    try {
        await kategoriModel.updateKategori(body, id);
        res.status(200).json({
            message: "Update kategori success",
            data: {
                id: id,
                ...body
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            serverMessage: error,
        });
    }
}

const deleteKategori = async (req, res) => {
    const { id } = req.params;
    try {
        await kategoriModel.deleteKategori(id);
        res.status(200).json({
            message: "Delete kategori success",
            data: null
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            serverMessage: error,
        });
    }
}

module.exports = {
    getKategori,
    createNewKategori,
    updateKategori,
    deleteKategori,
}