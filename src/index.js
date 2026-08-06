require('dotenv').config()
const PORT = process.env.PORT || 3306;
const express = require('express');

const PortfolioRoutes = require('./routes/portfolioRoute');
const testimoniRoutes = require('./routes/testimoniRoute');
const contactRoutes = require('./routes/contactRoute');
const kategoriRoutes = require('./routes/kategoriRoute');

const middlewareLogRequest = require('./middleware/logs');
const upload = require('./middleware/multer');

const app = express();

app.use(middlewareLogRequest);
app.use(express.json());
app.use('/assets', express.static('public/images'));

app.use('/portfolio', PortfolioRoutes);
app.use('/testimoni', testimoniRoutes);
app.use('/contact', contactRoutes);
app.use('/kategori', kategoriRoutes);

app.use((err, req, res, next) => {
    res.json({
        message: err.message
    })
})

app.listen(PORT, () => {
    console.log(`Server berhasil di running di port ${PORT}`);
})