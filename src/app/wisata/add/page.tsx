"use client";

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { firestore, uploadImages } from '@/services/firebase';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { showAlert } from '@/services/sweetalert';
import { useRouter } from 'next/navigation';

export default function AddWisata() {
  const [namaWisata, setNamaWisata] = useState("");
  const [kategori, setKategori] = useState("");
  const [alamat, setAlamat] = useState("");
  const [waktuOperasional, setWaktuOperasional] = useState("");
  const [karcis, setKarcis] = useState("");
  const [rating, setRating] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imageURLs, setImageURLs] = useState<string[]>([]);
  const [lokasi, setLokasi] = useState<{ latitude: number; longitude: number }>({
    latitude: 0.0,
    longitude: 0.0,
  });
  const [isOpen, setIsOpen] = useState("open");

  const router = useRouter();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      try {
        const fileArray = Array.from(files);
        const urls = await uploadImages(fileArray);
        setImageURLs(urls);
        setImages(fileArray); // Update images state
      } catch (error) {
        console.error("Error uploading images: ", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const ratingValue = parseFloat(rating);
    if (ratingValue > 5) {
      showAlert("Error", "Rating tidak boleh lebih dari 5", "error");
      return;
    }

    if (!isValidLatitude(lokasi.latitude) || !isValidLongitude(lokasi.longitude)) {
      showAlert("Error", "Latitude atau Longitude yang Anda masukkan salah", "error");
      setLokasi({ latitude: 0.0, longitude: 0.0 });
      return;
    }

    try {
      const wisataRef = collection(firestore, "wisata");
      await addDoc(wisataRef, {
        nama_wisata: namaWisata,
        kategori,
        alamat,
        waktu_operasional: waktuOperasional,
        karcis,
        rating: ratingValue,
        deskripsi,
        images: imageURLs, // Simpan URL gambar
        lokasi: {
          latitude: lokasi.latitude,
          longitude: lokasi.longitude,
        },
        is_open: isOpen,
      });

      showAlert("Sukses", "Data wisata berhasil ditambahkan", "success");

      setTimeout(() => {
        router.push('/wisata');
      }, 1500);

      setNamaWisata("");
      setKategori("");
      setAlamat("");
      setWaktuOperasional("");
      setKarcis("");
      setRating("");
      setDeskripsi("");
      setImages([]);
      setImageURLs([]);
      setLokasi({ latitude: 0.0, longitude: 0.0 });
      setIsOpen("open");
    } catch (error) {
      console.error("Error adding document: ", error);
      showAlert("Error", "Gagal menambahkan data wisata", "error");
    }
  };

  const isValidLatitude = (lat: number) => lat >= -90 && lat <= 90;
  const isValidLongitude = (lon: number) => lon >= -180 && lon <= 180;

  return (
    <DefaultLayout>
      <main className="p-4 bg-gray-100 min-h-screen">
        <div className="container mx-auto bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-semibold mb-4">Tambah Data Wisata</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Form fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama Wisata</label>
              <input
                type="text"
                value={namaWisata}
                onChange={(e) => setNamaWisata(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Kategori</label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Pilih kategori</option>
                <option value="alam">Alam</option>
                <option value="religi">Religi</option>
                <option value="kuliner">Kuliner</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Alamat</label>
              <input
                type="text"
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Waktu Operasional</label>
              <input
                type="text"
                value={waktuOperasional}
                onChange={(e) => setWaktuOperasional(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Harga Karcis</label>
              <input
                type="text"
                value={karcis}
                onChange={(e) => setKarcis(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Rating</label>
              <input
                type="number"
                step="0.1"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
              <textarea
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                required
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gambar</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {imageURLs.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {imageURLs.map((url, index) => (
                    <img key={index} src={url} alt={`Preview ${index}`} className="w-32 h-32 object-cover" />
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Lokasi</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  step="0.0001"
                  placeholder="Latitude"
                  value={lokasi.latitude}
                  onChange={(e) => setLokasi((prev) => ({ ...prev, latitude: parseFloat(e.target.value) }))}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <input
                  type="number"
                  step="0.0001"
                  placeholder="Longitude"
                  value={lokasi.longitude}
                  onChange={(e) => setLokasi((prev) => ({ ...prev, longitude: parseFloat(e.target.value) }))}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={isOpen}
                onChange={(e) => setIsOpen(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Tambah Wisata
            </button>
          </form>
        </div>
      </main>
    </DefaultLayout>
  );
}
