const contactModel = require('../models/contactModel');

const getAllContacts = async (req, res) => {
    try {
        const [data] = await contactModel.getAllContacts();
        res.status(200).json({
            message: "Get all contacts success",
            data: data
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            serverMessage: error,
        });
    }
}

const createNewContact = async (req, res) => {
    const { body } = req;
    try {
        await contactModel.createNewContact(body);
        res.status(201).json({
            message: "Create new contact success",
            data: body
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            serverMessage: error,
        });
    }
}

const updateContact = async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    try {
        await contactModel.updateContact(body, id);
        res.status(200).json({
            message: "Update contact success",
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

const deleteContact = async (req, res) => {
    const { id } = req.params;
    try {
        await contactModel.deleteContact(id);
        res.status(200).json({
            message: "Delete contact success",
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
    getAllContacts,
    createNewContact,
    updateContact,
    deleteContact,
}