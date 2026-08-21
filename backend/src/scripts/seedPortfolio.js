const dbPool = require('../config/database');
const portfolioModel = require('../models/portfolioModel');

const portfolioData = [
  { title: 'Taman Sintetis Perumahan Elit', location: 'Tampan, Pekanbaru 2024', description: 'Taman depan dan belakang rumah dengan rumput sintetis premium, tampak natural, bebas perawatan.', image: 'https://images.unsplash.com/photo-1558904541-efa8c4a08931?auto=format&fit=crop&w=800&q=80', category: 'Taman', year: 2024 },
  { title: 'Futsal Arena Pekanbaru Pusat', location: 'Pekanbaru Kota, 2024', description: 'Lapangan Futsal indoor berstandar profesional dengan vinyl kualitas, marking presisi.', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80', category: 'Lapangan Futsal', year: 2024 },
  { title: 'Mini Soccer Park Rumbai', location: 'Rumbai, Pekanbaru 2024', description: 'Lapangan min soccer outdoor dengan rumput sintetis standard premium, pagar pengaman.', image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=800&q=80', category: 'Minisoccer', year: 2024 },
  { title: 'Green Wall Cafe & Resto', location: 'Sukajadi, Pekanbaru 2024', description: 'Vertical garden sintetis interior mewah dengan tanaman rambat artifisial tahan lama.', image: 'https://images.unsplash.com/photo-1534710961216-75c88202f43e?auto=format&fit=crop&w=800&q=80', category: 'Vertical Garden', year: 2024 },
  { title: 'Halaman Belakang Villa Sejahtera', location: 'Marpoyan Damai, Pekanbaru 2024', description: 'Instalasi rumput sintetis drainase cepat untuk area bermain keluarga santai.', image: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80', category: 'Taman', year: 2024 },
  { title: 'Stadium Futsal Bukit Raya', location: 'Bukit Raya, Pekanbaru 2024', description: 'Pemasangan rumput sintetis lapangan futsal monofilament tebal 50mm dengan rubber infill.', image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80', category: 'Lapangan Futsal', year: 2024 },
  { title: 'Playground TK & Sekolah Islam', location: 'Payung Sekaki, Pekanbaru 2024', description: 'Area bermain anak dengan rumput sintetis lembut, aman, anti-slip, dan bergaransi.', image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80', category: 'Taman', year: 2024 },
  { title: 'Lapangan Tenis & Padel Eksklusif', location: 'Tuah Madani, Pekanbaru 2024', description: 'Konstruksi lapangan olahraga serbaguna dengan jaring pengaman keliling.', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80', category: 'Olahraga Lainnya', year: 2024 },
  { title: 'Mini Soccer Arena Garuda', location: 'Senapelan, Pekanbaru 2024', description: 'Pembangunan komprehensif mini soccer 7 vs 7 lengkap dengan sistem lampu & drainase.', image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=800&q=80', category: 'Minisoccer', year: 2024 }
];

async function seed() {
  try {
    const [rows] = await dbPool.execute('SELECT idkategori_layanan AS id, kategori_layanan FROM kategori_layanan');
    const categoryMap = new Map(rows.map(row => [row.kategori_layanan.trim().toLowerCase(), row.id]));

    for (const item of portfolioData) {
      const categoryKey = item.category.trim().toLowerCase();
      const categoryId = categoryMap.get(categoryKey);

      if (!categoryId) {
        console.warn(`No category id found for ${item.category}; skipping item ${item.title}`);
        continue;
      }

      const body = {
        nama_proyek: item.title,
        lokasi: item.location,
        kategori: categoryId,
        tahun: item.year,
        deskripsi: item.description,
        image_url: [item.image]
      };

      const [result] = await portfolioModel.createNewPortfolio(body);
      console.log('Inserted portfolio id=', result.insertId, 'title=', item.title, 'categoryId=', categoryId);
    }
  } catch (err) {
    console.error('Seed portfolio failed:', err);
    process.exitCode = 1;
  } finally {
    process.exit();
  }
}

seed();
