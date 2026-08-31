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
    console.log('createNewContact received body:', body);

    if (!body || !body.nama_lengkap || !body.no_whatsapp || !body.lokasi) {
        return res.status(400).json({
            message: 'Nama lengkap, nomor WhatsApp, dan lokasi proyek wajib diisi.',
            data: null
        });
    }

    const cleanNoWa = String(body.no_whatsapp).replace(/\D/g, '');
    if (cleanNoWa.length < 5) {
        return res.status(400).json({
            message: 'Nomor WhatsApp tidak valid.',
            data: null
        });
    }

    const cleanData = {
        nama_lengkap: String(body.nama_lengkap).trim(),
        no_whatsapp: cleanNoWa,
        lokasi: String(body.lokasi).trim(),
        keterangan: body.keterangan ? String(body.keterangan).trim() : '',
        kategori: Number(body.kategori) || 1
    };

    try {
        const [result] = await contactModel.createNewContact(cleanData);
        const insertId = result && result.insertId ? result.insertId : null;
        return res.status(201).json({
            message: "Create new contact success",
            data: insertId ? { id: insertId, ...cleanData } : cleanData
        });
    } catch (error) {
        console.error('createNewContact error:', error);
        return res.status(500).json({
            message: "Server Error",
            serverMessage: error.message || error,
        });
    }
};

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