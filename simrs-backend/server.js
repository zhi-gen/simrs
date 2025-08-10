const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files (HTML, CSS, JS)

// Koneksi Database
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Cek koneksi
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database SIMRS TERHUBUNG via TCP!');
        connection.release();
    } catch (err) {
        console.error('❌ Koneksi database GAGAL:', err.message);
    }
})();

// 🏠 Route Utama: Redirect ke login.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/login.html'); // Mengarahkan ke halaman login
});

// API Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Wajib diisi' });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Username salah' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Password salah' });
        }

        const token = jwt.sign(
            { id: user.id, nama: user.nama_lengkap, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );

        res.json({
            success: true,
            message: 'Login berhasil',
            token,
            user: { nama: user.nama_lengkap, role: user.role }
        });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Error', error: err.message });
    } finally {
        if (connection) connection.release();
    }
});

// ➕ API Tambah Pasien
app.post('/api/pasien', async (req, res) => {
    const { nomor_rm, nama, jenis_kelamin, tanggal_lahir, alamat, no_telepon } = req.body;

    if (!nomor_rm || !nama || !jenis_kelamin || !tanggal_lahir) {
        return res.status(400).json({ success: false, message: 'Semua field wajib diisi' });
    }

    let connection;
    try {
        connection = await pool.getConnection();

        const [result] = await connection.query(
            `INSERT INTO pasien (nomor_rm, nama, jenis_kelamin, tanggal_lahir, alamat, no_telepon)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [nomor_rm, nama, jenis_kelamin, tanggal_lahir, alamat, no_telepon]
        );

        res.json({
            success: true,
            message: 'Pasien berhasil ditambahkan',
            id: result.insertId
        });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Gagal simpan', error: err.message });
    } finally {
        if (connection) connection.release();
    }
});

// 📋 API: Ambil Semua Pasien
app.get('/api/pasien', async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM pasien ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Gagal ambil data', error: err.message });
    } finally {
        if (connection) connection.release();
    }
});

// Jalankan server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🔥 Server berjalan di http://0.0.0.0:${PORT}`);
    console.log(`📱 Buka di browser: http://localhost:${PORT}`);
});
