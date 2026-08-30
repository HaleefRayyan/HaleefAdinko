const dbPool = require('../config/database');

const ensureAdminTable = async () => {
    await dbPool.execute(`
        CREATE TABLE IF NOT EXISTS admin_users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    const [rows] = await dbPool.execute('SELECT * FROM admin_users WHERE email = ?', ['admin@haleefadinko.com']);
    if (!rows.length) {
        await dbPool.execute(
            'INSERT INTO admin_users (email, password, name) VALUES (?, ?, ?)',
            ['admin@haleefadinko.com', 'admin123', 'Administrator']
        );
    }
};

const loginAdmin = async (email, password) => {
    await ensureAdminTable();
    const [rows] = await dbPool.execute(
        'SELECT * FROM admin_users WHERE email = ? AND password = ? LIMIT 1',
        [email, password]
    );

    if (!rows.length) {
        return null;
    }

    const user = rows[0];
    return {
        id: user.id,
        email: user.email,
        name: user.name
    };
};

module.exports = {
    loginAdmin
};
