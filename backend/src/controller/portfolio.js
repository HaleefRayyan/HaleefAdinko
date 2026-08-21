const portfolioModel = require('../models/portfolioModel');

const getAllPortfolio = async (req, res) => {
    try {
        const [data] = await portfolioModel.getAllPortfolio();
        res.status(200).json({
            message: "Get all portfolio success",
            data: data
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            serverMessage: error,
        });
    }
}

const createNewPortfolio = async (req, res) => {
    const { body } = req;
    try {
        await portfolioModel.createNewPortfolio(body);
        res.status(201).json({
            message: "Create new portfolio success",
            data: body
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            serverMessage: error,
        });
    }
}

const updatePortfolio = async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    try {
        await portfolioModel.updatePortfolio(body, id);
        res.status(200).json({
            message: "Update portfolio success",
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

const deletePortfolio = async (req, res) => {
    const { id } = req.params;
    try {
        await portfolioModel.deletePortfolio(id);
        res.status(200).json({
            message: "Delete portfolio success",
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
    getAllPortfolio,
    createNewPortfolio,
    updatePortfolio,
    deletePortfolio,
}