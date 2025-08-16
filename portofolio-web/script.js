// Mengaktifkan mode ketat untuk penulisan kode yang lebih baik
'use strict';

// Inisialisasi AOS (Animate On Scroll)
AOS.init({
    duration: 1000, // Durasi animasi dalam milidetik
    once: true,     // Animasi hanya berjalan sekali saat scroll
    offset: 50,     // Memicu animasi sedikit lebih awal
});

// Opsi untuk animasi mengetik (Typed.js)
const typedOptions = {
    strings: ['Junior Developer', 'Tech Enthusiast', 'Problem Solver'],
    typeSpeed: 50,  // Kecepatan mengetik
    backSpeed: 30,  // Kecepatan menghapus
    backDelay: 2000, // Jeda sebelum mulai menghapus
    startDelay: 500, // Jeda sebelum mulai mengetik
    loop: true,     // Mengulang animasi
    showCursor: true,
    cursorChar: '|',
};

// Inisialisasi Typed.js pada elemen dengan id 'typed-text'
const typed = new Typed('#typed-text', typedOptions);
