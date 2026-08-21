const testimoniModel = require('../models/testimoniModel');

const getAllTestimoni = async (req, res) => {
    try {
        const [data] = await testimoniModel.getAllTestimoni();
        res.status(200).json({
            message: "Get all testimoni success",
            data: data
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            serverMessage: error,
        });
    }
}

const createNewTestimoni = async (req, res) => {
    const { body } = req;
    try {
        await testimoniModel.createNewTestimoni(body);
        res.status(201).json({
            message: "Create new testimoni success",
            data: body
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            serverMessage: error,
        });
    }
}

const updateTestimoni = async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    try {
        await testimoniModel.updateTestimoni(body, id);
        res.status(200).json({
            message: "Update testimoni success",
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

const deleteTestimoni = async (req, res) => {
    const { id } = req.params;
    try {
        await testimoniModel.deleteTestimoni(id);
        res.status(200).json({
            message: "Delete testimoni success",
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
    getAllTestimoni,
    createNewTestimoni,
    updateTestimoni,
    deleteTestimoni,
}