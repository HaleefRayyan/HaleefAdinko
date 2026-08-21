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
    console.log('createNewContact body:', body);
    const required = ['nama_lengkap', 'no_whatsapp', 'lokasi', 'kategori'];
    const missing = required.filter(k => !body || body[k] === undefined || body[k] === null || String(body[k]).trim() === '');
    if (missing.length) {
        return res.status(400).json({
            message: 'Missing required fields',
            missing
        });
    }
    try {
        const [result] = await contactModel.createNewContact(body);
        const insertId = result && result.insertId ? result.insertId : null;
        res.status(201).json({
            message: "Create new contact success",
            data: insertId ? { id: insertId, ...body } : body
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