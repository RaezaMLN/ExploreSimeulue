"use client";

import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="h-screen p-4 bg-gray-100">
      <div className="container mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Tentang Kami</h1>
        <p className="text-lg mb-4 text-gray-600">
          Selamat datang di <span className="font-semibold text-blue-600">WisataApp</span>, aplikasi manajemen destinasi wisata yang dirancang untuk mempermudah penjelajahan dan pengelolaan tempat wisata di seluruh Indonesia.
        </p>
        <h2 className="text-2xl font-semibold mb-2 text-gray-700">Visi Kami</h2>
        <p className="text-lg mb-4 text-gray-600">
          Visi kami adalah untuk menyediakan platform yang efisien dan terintegrasi, memungkinkan pengelola wisata dan wisatawan untuk terhubung dengan cara yang lebih baik. Kami berkomitmen untuk membantu Anda menemukan tempat wisata yang paling sesuai dengan minat dan kebutuhan Anda.
        </p>
        <h2 className="text-2xl font-semibold mb-2 text-gray-700">Fitur Utama</h2>
        <ul className="list-disc list-inside mb-4 text-gray-600">
          <li><strong>Pengelolaan Destinasi Wisata:</strong> Tambah, edit, dan hapus informasi destinasi wisata dengan mudah.</li>
          <li><strong>Umpan Balik Pengunjung:</strong> Terima dan kelola umpan balik dari pengunjung untuk meningkatkan kualitas layanan.</li>
          <li><strong>Pengajuan Wisata:</strong> Fitur pengajuan wisata memungkinkan pengguna untuk mengusulkan tempat wisata baru untuk ditambahkan ke sistem.</li>
          <li><strong>Rekomendasi dan Rating:</strong> Sistem rating dan rekomendasi untuk membantu pengunjung menemukan tempat wisata terbaik.</li>
        </ul>
        <h2 className="text-2xl font-semibold mb-2 text-gray-700">Tim Kami</h2>
        <p className="text-lg mb-4 text-gray-600">
          Kami adalah tim profesional yang berdedikasi untuk menghadirkan solusi terbaik untuk industri pariwisata. Dengan pengalaman dan keahlian di bidang teknologi dan manajemen wisata, kami bekerja keras untuk memastikan platform ini memberikan nilai terbaik bagi pengguna.
        </p>
        <p className="text-lg mb-4 text-gray-600">
          Untuk pertanyaan atau informasi lebih lanjut, jangan ragu untuk menghubungi kami melalui <Link href="/contact" className="text-blue-600 hover:underline">halaman kontak</Link>.
        </p>
      </div>
    </main>
  );
}
