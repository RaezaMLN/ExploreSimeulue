"use client";

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { firestore, uploadImage } from '@/services/firebase';
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
  const [image, setImage] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [lokasi, setLokasi] = useState<{ latitude: number; longitude: number }>({
    latitude: 0.0,
    longitude: 0.0,
  });
  const [isOpen, setIsOpen] = useState("open"); // New state for status

  const router = useRouter(); // Initialize the router

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try { 
        const url = await uploadImage(file);
        setImageURL(url);
      } catch (error) {
        console.error("Error uploading image: ", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    // Validate latitude and longitude
    if (!isValidLatitude(lokasi.latitude) || !isValidLongitude(lokasi.longitude)) {
      showAlert("Error", "Latitude or Longitude is invalid", "error");
  
      // Reset latitude and longitude inputs
      setLokasi({ latitude: 0.0, longitude: 0.0 });
  
      return; // Prevent form submission
    }
  
    try {
      const wisataRef = collection(firestore, "wisata");
      await addDoc(wisataRef, {
        nama_wisata: namaWisata,
        kategori,
        alamat,
        waktu_operasional: waktuOperasional,
        karcis,
        rating: parseFloat(rating), // Rating dikonversi ke number
        deskripsi,
        image: imageURL, // Simpan URL gambar
        lokasi: {
          latitude: lokasi.latitude,
          longitude: lokasi.longitude,
        },
        is_open: isOpen, // Save the status
      });
  
      showAlert("Sukses", "Data wisata berhasil ditambahkan", "success");
  
      // Redirect to /wisata
      setTimeout(() => {
        router.push('/wisata');
      }, 1500); // Delay before redirect to allow alert to be visible
  
      // Optionally, clear form
      setNamaWisata("");
      setKategori("");
      setAlamat("");
      setWaktuOperasional("");
      setKarcis("");
      setRating("");
      setDeskripsi("");
      setImage(null);
      setImageURL(null);
      setLokasi({ latitude: 0.0, longitude: 0.0 });
      setIsOpen("open"); // Reset the status
    } catch (error) {
      console.error("Error adding document: ", error);
      showAlert("Error", "Gagal menambahkan data wisata", "error");
    }
  };
  
  const isValidLatitude = (lat: number) => lat >= -90 && lat <= 90;
  const isValidLongitude = (lon: number) => lon >= -180 && lon <= 180;
  
  return (
    <>
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
              onChange={handleImageUpload}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {imageURL && (
              <div className="mt-2">
                <img src={imageURL} alt="Preview" className="w-48 h-48 object-cover" />
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="open">Buka</option>
              <option value="closed">Tutup</option>
            </select>
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Tambah Wisata
          </button>
        </form>
      </div>
    </main>
    </DefaultLayout>
    </>
  );
}
