const express = require('express');
const cors = require('cors');
const { createCanvas, loadImage, registerFont } = require('canvas');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

// 🔗 Link RAW database JSON kamu di GitHub
const DB_URL = "https://raw.githubusercontent.com/[USERNAME]/[NAMA-REPO]/main/data.json";

// Pengaturan ukuran & gaya tulisan (sesuai gambar kamu)
const WIDTH = 1000;
const HEIGHT = 1000;
const FONT_SIZE = 120;
const FONT_FAMILY = "Serif"; // Gaya tulisan lengkung kayak contoh

// Fungsi buat efek warna pelangi/holografik
function getGradient(ctx, x, y, width, height) {
  const grad = ctx.createLinearGradient(x, y, x + width, y + height);
  grad.addColorStop(0, '#ffb3e6'); // pink muda
  grad.addColorStop(0.3, '#b3e6ff'); // biru muda
  grad.addColorStop(0.6, '#e6b3ff'); // ungu muda
  grad.addColorStop(1, '#ffffb3'); // kuning muda
  return grad;
}

// 🎨 ENDPOINT UTAMA: Buat gambar sesuai nama pengunjung
app.get('/api/gambar', async (req, res) => {
  const namaCustom = req.query.nama || "MFARELS"; // Kalau kosong, pakai default

  try {
    // Bikin kanvas hitam
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');

    // Latar belakang hitam
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Pengaturan tulisan
    ctx.font = `bold ${FONT_SIZE}px ${FONT_FAMILY}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Baris 1: HARTA
    ctx.fillStyle = getGradient(ctx, 0, 250, WIDTH, 150);
    ctx.fillText("HARTA", WIDTH/2, 250);

    // Baris 2: TAHTA
    ctx.fillStyle = getGradient(ctx, 0, 450, WIDTH, 150);
    ctx.fillText("TAHTA", WIDTH/2, 450);

    // Baris 3: Nama CUSTOM (dari pengunjung)
    ctx.fillStyle = getGradient(ctx, 0, 650, WIDTH, 150);
    ctx.fillText(namaCustom.toUpperCase(), WIDTH/2, 650);

    // Kirim gambar jadi ke pengunjung
    res.setHeader('Content-Type', 'image/png');
    canvas.pngStream().pipe(res);

  } catch (err) {
    res.status(500).json({ pesan: "Gagal buat gambar", error: err.message });
  }
});

// 📂 ENDPOINT: Ambil data dari database GitHub (sebelumnya)
app.get('/api/pemain', async (req, res) => {
  try {
    const { data } = await axios.get(DB_URL);
    res.json(data.pemain);
  } catch (err) {
    res.status(500).json({ pesan: "Gagal ambil data", error: err.message });
  }
});

app.get('/api/pemain/:id', async (req, res) => {
  try {
    const { data } = await axios.get(DB_URL);
    const hasil = data.pemain.find(p => p.id === parseInt(req.params.id));
    if (!hasil) return res.status(404).json({ pesan: "Pemain tidak ditemukan" });
    res.json(hasil);
  } catch (err) {
    res.status(500).json({ pesan: "Gagal ambil data", error: err.message });
  }
});

module.exports = app;
