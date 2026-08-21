const dbPool = require('../config/database');

const categoryNames = [
  'Taman',
  'Lapangan Futsal',
  'Minisoccer',
  'Vertical Garden',
  'Olahraga Lainnya',
  'Rumput Sintetis',
  'Instalasi Jaring',
  'Mini Golf',
  'Padel & Tenis',
  'Lainnya'
];

async function seedCategories() {
  try {
    const [existingRows] = await dbPool.execute('SELECT idkategori_layanan AS id, kategori_layanan FROM kategori_layanan');
    const existingMap = new Map(existingRows.map(row => [row.kategori_layanan.trim().toLowerCase(), row.id]));

    for (const name of categoryNames) {
      const key = name.trim().toLowerCase();
      if (!existingMap.has(key)) {
        const [result] = await dbPool.execute('INSERT INTO kategori_layanan (kategori_layanan) VALUES (?)', [name]);
        existingMap.set(key, result.insertId);
        console.log(`Inserted category: ${name} => id ${result.insertId}`);
      } else {
        console.log(`Category already exists: ${name} => id ${existingMap.get(key)}`);
      }
    }
  } catch (err) {
    console.error('Seed categories failed:', err);
    process.exitCode = 1;
  } finally {
    process.exit();
  }
}

seedCategories();
