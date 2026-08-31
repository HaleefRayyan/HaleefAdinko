const dbPool = require('../config/database');

const defaultSiteSettings = {
    site_name: 'Haleef Adinko & GhaziSportsHub',
    tagline: 'Penyedia solusi rumput sintetis dan fasilitas olahraga profesional terbaik di Pekanbaru & Riau.',
    email: 'hello@haleefadinko.com',
    whatsapp: '6282187515651',
    address: 'Jl. Todak No.113 Tangkerang Barat, Kec. Marpoyan Damai, Kota Pekanbaru, Riau',
    primary_color: '#1d4d2d',
    secondary_color: '#d4a72c',
    seo_title: 'Haleef Adinko | Solusi Lapangan & Taman Modern',
    seo_description: 'Menyediakan layanan instalasi, rumput sintetis, taman, dan project olahraga yang modern.'
};

const defaultHomeSettings = {
    hero_title: 'Bangun ruang luar yang lebih indah dan fungsional',
    hero_subtitle: 'Kita membantu Anda menghadirkan taman, lapangan, dan ruang olahraga yang modern, kuat, dan nyaman digunakan.',
    cta_primary: 'Konsultasi Gratis',
    cta_secondary: 'Lihat Portofolio',
    feature_title: 'Layanan utama kami'
};

const ensureTables = async () => {
    await dbPool.execute(`
        CREATE TABLE IF NOT EXISTS site_settings (
            id INT PRIMARY KEY,
            site_name VARCHAR(255) NOT NULL,
            tagline VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            whatsapp VARCHAR(255) NOT NULL,
            address TEXT NOT NULL,
            primary_color VARCHAR(32) NOT NULL,
            secondary_color VARCHAR(32) NOT NULL,
            seo_title VARCHAR(255) NOT NULL,
            seo_description TEXT NOT NULL
        )
    `);

    await dbPool.execute(`
        CREATE TABLE IF NOT EXISTS home_settings (
            id INT PRIMARY KEY,
            hero_title VARCHAR(255) NOT NULL,
            hero_subtitle TEXT NOT NULL,
            cta_primary VARCHAR(255) NOT NULL,
            cta_secondary VARCHAR(255) NOT NULL,
            feature_title VARCHAR(255) NOT NULL
        )
    `);
};

const getSiteSettings = async () => {
    await ensureTables();

    const [rows] = await dbPool.execute('SELECT * FROM site_settings WHERE id = 1 LIMIT 1');
    if (!rows.length) {
        await dbPool.execute(`
            INSERT INTO site_settings (id, site_name, tagline, email, whatsapp, address, primary_color, secondary_color, seo_title, seo_description)
            VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            defaultSiteSettings.site_name,
            defaultSiteSettings.tagline,
            defaultSiteSettings.email,
            defaultSiteSettings.whatsapp,
            defaultSiteSettings.address,
            defaultSiteSettings.primary_color,
            defaultSiteSettings.secondary_color,
            defaultSiteSettings.seo_title,
            defaultSiteSettings.seo_description
        ]);

        return defaultSiteSettings;
    }

    const row = rows[0];
    return {
        site_name: row.site_name,
        tagline: row.tagline,
        email: row.email,
        whatsapp: row.whatsapp,
        address: row.address,
        primary_color: row.primary_color,
        secondary_color: row.secondary_color,
        seo_title: row.seo_title,
        seo_description: row.seo_description
    };
};

const updateSiteSettings = async (payload) => {
    await ensureTables();
    const merged = { ...defaultSiteSettings, ...payload };

    await dbPool.execute(`
        INSERT INTO site_settings (id, site_name, tagline, email, whatsapp, address, primary_color, secondary_color, seo_title, seo_description)
        VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            site_name = VALUES(site_name),
            tagline = VALUES(tagline),
            email = VALUES(email),
            whatsapp = VALUES(whatsapp),
            address = VALUES(address),
            primary_color = VALUES(primary_color),
            secondary_color = VALUES(secondary_color),
            seo_title = VALUES(seo_title),
            seo_description = VALUES(seo_description)
    `, [
        merged.site_name,
        merged.tagline,
        merged.email,
        merged.whatsapp,
        merged.address,
        merged.primary_color,
        merged.secondary_color,
        merged.seo_title,
        merged.seo_description
    ]);

    return merged;
};

const getHomeSettings = async () => {
    await ensureTables();

    const [rows] = await dbPool.execute('SELECT * FROM home_settings WHERE id = 1 LIMIT 1');
    if (!rows.length) {
        await dbPool.execute(`
            INSERT INTO home_settings (id, hero_title, hero_subtitle, cta_primary, cta_secondary, feature_title)
            VALUES (1, ?, ?, ?, ?, ?)
        `, [
            defaultHomeSettings.hero_title,
            defaultHomeSettings.hero_subtitle,
            defaultHomeSettings.cta_primary,
            defaultHomeSettings.cta_secondary,
            defaultHomeSettings.feature_title
        ]);

        return defaultHomeSettings;
    }

    const row = rows[0];
    return {
        hero_title: row.hero_title,
        hero_subtitle: row.hero_subtitle,
        cta_primary: row.cta_primary,
        cta_secondary: row.cta_secondary,
        feature_title: row.feature_title
    };
};

const updateHomeSettings = async (payload) => {
    await ensureTables();
    const merged = { ...defaultHomeSettings, ...payload };

    await dbPool.execute(`
        INSERT INTO home_settings (id, hero_title, hero_subtitle, cta_primary, cta_secondary, feature_title)
        VALUES (1, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            hero_title = VALUES(hero_title),
            hero_subtitle = VALUES(hero_subtitle),
            cta_primary = VALUES(cta_primary),
            cta_secondary = VALUES(cta_secondary),
            feature_title = VALUES(feature_title)
    `, [
        merged.hero_title,
        merged.hero_subtitle,
        merged.cta_primary,
        merged.cta_secondary,
        merged.feature_title
    ]);

    return merged;
};

module.exports = {
    getSiteSettings,
    updateSiteSettings,
    getHomeSettings,
    updateHomeSettings
};
