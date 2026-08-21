const testimoniModel = require('../models/testimoniModel');

const testimonialsData = [
  {
    name: 'Ajo WW',
    time: '2020-08-18 00:00:00',
    rating: 5,
    text: 'Rekomendet banget ini.. hasilnya rapih, rumputnya berkualitas ngk mengecewakan... ditunggu kerjasama selanjutnya, sukses selalu.. :)'
  },
  {
    name: 'Badriah Official',
    time: '2025-09-18 00:00:00',
    rating: 5,
    text: 'Pelayanan bagus banget trus juga harganya itu lohh wow dehh, berkualitas juga and rumput nya sintetis rapih pula pekerjaan nya sukaaa dehhh😍🥰 ...'
  },
  {
    name: 'Yoga Jundirwan',
    time: '2023-08-18 00:00:00',
    rating: 5,
    text: 'Rumputnya cakep, dan pemasangannya rapi.. terimakasih adinko rumput sintetis PEKANBARU'
  },
  {
    name: 'Ilham Akbar Sirait',
    time: '2026-05-18 00:00:00',
    rating: 5,
    text: 'Pelayanan nya super exelent, pengerjaan lapangan mini soccer selesai tepat waktu dan jaring terpasang sangat kokoh.'
  },
  {
    name: 'Aditya Mustika',
    time: '2026-01-18 00:00:00',
    rating: 5,
    text: 'Pelayanan baik dan harga terjangkau 👍 ... taman sintetis di cafe kami sekarang jadi spot foto favorit pelanggan.'
  },
  {
    name: 'Zakira Mardian',
    time: '2026-01-18 00:00:00',
    rating: 5,
    text: 'Mantull dan orgnya ramah Kerja rapi, recommended untuk siapa saja di Pekanbaru yang mau pasang rumput sintetis.'
  }
];

async function seedTestimoni() {
  try {
    for (const item of testimonialsData) {
      const body = {
        nama_klien: item.name,
        waktu: item.time,
        rating: item.rating,
        deskripsi: item.text
      };

      const [result] = await testimoniModel.createNewTestimoni(body);
      console.log('Inserted testimonial id=', result.insertId, 'name=', item.name, 'time=', item.time);
    }
  } catch (err) {
    console.error('Seed testimonial failed:', err);
    process.exitCode = 1;
  } finally {
    process.exit();
  }
}

seedTestimoni();
