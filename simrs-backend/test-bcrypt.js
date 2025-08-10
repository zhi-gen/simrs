const bcrypt = require('bcryptjs');

async function test() {
    const password = 'admin123';
    const hash = '$2a$10$G9sNYdaCW1YOyW4IJT7oIuJnq.6U3qF6L8V7J4Y5Z6X7C8V9B0N1O';

    const match = await bcrypt.compare(password, hash);
    console.log('Password cocok:', match);
}

test();
