const express = require('express');
const mysql = require('mysql2');
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

// Koneksi Database via TCP (localhost:3306)
const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'zhigen123',
    database: 'simrs_db'
});

db.connect(err => {
    if (err) {
        console.error('❌ Koneksi database GAGAL:', err.message);
        return;
    }
    console.log('✅ Database SIMRS TERHUBUNG via TCP!');
});

// Route: Cek API
app.get('/', (req, res) => {
    res.json({ success: true, message: "🚀 SIMRS Backend Berjalan!" });
});

// API Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Username dan password wajib diisi" });
    }

    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], async (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Error server", error: err.message });

        if (results.length === 0) {
            return res.status(401).json({ success: false, message: "Username tidak ditemukan" });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Password salah" });
        }

        const token = jwt.sign(
            { id: user.id, nama: user.nama_lengkap, role: user.role },
            'rahasia_kuat_simrs_2025',
            { expiresIn: '12h' }
        );

        res.json({
            success: true,
            message: "Login berhasil",
            token,
            user: { nama: user.nama_lengkap, role: user.role }
        });
    });
});

// Jalankan server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🔥 Server berjalan di http://0.0.0.0:${PORT}`);
    console.log(`📱 Akses dari HP: http://localhost:${PORT}`);
});
