const adminAuthModel = require('../models/adminAuthModel');

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email dan password wajib diisi',
                data: null
            });
        }

        const user = await adminAuthModel.loginAdmin(email, password);

        if (!user) {
            return res.status(401).json({
                message: 'Email atau password salah',
                data: null
            });
        }

        return res.status(200).json({
            message: 'Login admin berhasil',
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Server Error',
            serverMessage: error.message
        });
    }
};

module.exports = {
    loginAdmin
};
