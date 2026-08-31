require('dotenv').config()
const PORT = process.env.PORT || 4000;
const express = require('express');
const cors = require('cors');


const PortfolioRoutes = require('./routes/portfolioRoute');
const testimoniRoutes = require('./routes/testimoniRoute');
const contactRoutes = require('./routes/contactRoute');
const kategoriRoutes = require('./routes/kategoriRoute');
const adminRoutes = require('./routes/adminRoute');
const adminAuthRoute = require('./routes/adminAuthRoute');
const mediaRoutes = require('./routes/mediaRoute');

const middlewareLogRequest = require('./middleware/logs');
const upload = require('./middleware/multer');

const app = express();

const dbPool = require('./config/database');

app.use(middlewareLogRequest);
app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use('/assets', express.static('public/images'));

// Health check endpoint to verify DB connectivity
app.get('/health', async (req, res) => {
    try {
        const [rows] = await dbPool.execute('SELECT 1');
        return res.status(200).json({ ok: true });
    } catch (err) {
        console.error('Health check DB error:', err);
        return res.status(500).json({ ok: false, error: err.message });
    }
});

app.use('/portfolio', PortfolioRoutes);
app.use('/testimoni', testimoniRoutes);
app.use('/contact', contactRoutes);
app.use('/kategori', kategoriRoutes);
app.use('/admin', adminRoutes);
app.use('/admin-auth', adminAuthRoute);
app.use('/media', mediaRoutes);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        serverMessage: err.stack || err
    });
});


app.listen(PORT, () => {
    console.log(`Server berhasil di running di port ${PORT}`);
})