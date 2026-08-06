// // 1. Panggil konfigurasi database yang sudah kita buat tadi
// const db = require('./config/database.js');

// // 2. Buat fungsi async untuk mencoba koneksi
// async function cekDatabase() {
//   try {
//     // 3. Coba kirim perintah sederhana ke database: "SELECT 1"
//     const [hasil] = await db.query('SELECT 1');
    
//     // 4. Jika berhasil melewati baris di atas, berarti koneksi sukses!
//     console.log("✅ BERHASIL: Node.js sudah terhubung ke MySQL Workbench!");
    
//   } catch (error) {
//     // 5. Jika gagal (password salah, database mati, dll), kode akan melompat ke sini
//     console.error("❌ GAGAL MENGHUBUNGKAN KE DATABASE:");
//     console.error(error.message);
//   } finally {
//     // 6. Matikan script agar terminal tidak terus menyala
//     process.exit();
//   }
// }

// // Jalankan fungsinya
// cekDatabase();