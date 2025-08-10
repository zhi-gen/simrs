const mysql = require('mysql2/promise');

async function updateAdminPassword() {
    const pool = mysql.createPool({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'zhigen123',
        database: 'simrs_db'
    });

    try {
        const connection = await pool.getConnection();
        console.log('✅ Terhubung ke database');

        // Ganti dengan hash baru dari generate-hash.js
        const hashedPassword = '$2b$10$TVp9EJxxEbHHZR874iVKsepsQlF0e46vUeMvR6EIH/w.Gn/Drtj0S';

        const [result] = await connection.query(
            'UPDATE users SET password = ? WHERE username = ?',
            [hashedPassword, 'admin']
        );

        console.log('🔐 Password admin berhasil diperbarui!');
        connection.release();
    } catch (err) {
        console.error('❌ Gagal:', err.message);
    } finally {
        pool.end();
    }
}

updateAdminPassword();
