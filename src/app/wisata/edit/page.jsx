"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore, storage } from '@/services/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Swal from 'sweetalert2';
import DefaultLayout from '@/components/Layouts/DefaultLayout';

const EditWisata = () => {
  const [namaWisata, setNamaWisata] = useState('');
  const [kategori, setKategori] = useState('');
  const [alamat, setAlamat] = useState('');
  const [waktuOperasional, setWaktuOperasional] = useState('');
  const [karcis, setKarcis] = useState('');
  const [rating, setRating] = useState(0); // Set initial rating as number
  const [deskripsi, setDeskripsi] = useState('');
  const [lokasi, setLokasi] = useState({ latitude: '', longitude: '' });
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState('');
  const [isOpen, setIsOpen] = useState('open'); // New state for status
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(firestore, 'wisata', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setNamaWisata(data.nama_wisata);
          setKategori(data.kategori);
          setAlamat(data.alamat);
          setWaktuOperasional(data.waktu_operasional);
          setKarcis(data.karcis);
          setRating(data.rating); // Set rating value from data
          setDeskripsi(data.deskripsi);
          setLokasi(data.lokasi);
          setExistingImage(data.image);
          setIsOpen(data.is_open || 'open'); // Set the is_open value from data
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const isValidLatitude = (lat) => lat >= -90 && lat <= 90;
  const isValidLongitude = (lon) => lon >= -180 && lon <= 180;

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const ratingParsed = parseFloat(rating);
    const latitudeParsed = parseFloat(lokasi.latitude);
    const longitudeParsed = parseFloat(lokasi.longitude);
  
    if (!isValidLatitude(latitudeParsed) || !isValidLongitude(longitudeParsed)) {
      Swal.fire('Error', 'Latitude atau Longitude tidak valid', 'error');
      return; // Menghentikan pengiriman form
    }
  
    if (isNaN(ratingParsed) || ratingParsed < 0 || ratingParsed > 5) {
      Swal.fire('Error', 'Rating harus berupa angka antara 0 dan 5', 'error');
      return; // Menghentikan pengiriman form
    }
  
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Apakah Anda ingin menyimpan perubahan ini?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, simpan!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        let imageUrl = existingImage;
  
        if (image) {
          const storageRef = ref(storage, `images/${image.name}`);
          await uploadBytes(storageRef, image);
          imageUrl = await getDownloadURL(storageRef);
        }
  
        const docRef = doc(firestore, 'wisata', id);
        await updateDoc(docRef, {
          nama_wisata: namaWisata,
          kategori,
          alamat,
          waktu_operasional: waktuOperasional,
          karcis,
          rating: ratingParsed, // Gunakan rating yang sudah divalidasi
          deskripsi,
          lokasi: {
            latitude: latitudeParsed, // Gunakan latitude yang sudah divalidasi
            longitude: longitudeParsed // Gunakan longitude yang sudah divalidasi
          },
          image: imageUrl,
          is_open: isOpen, // Simpan status
        });
  
        Swal.fire('Tersimpan!', 'Perubahan Anda telah disimpan.', 'success');
        router.push('/wisata');
      }
    });
  };
  

  return (
    <DefaultLayout>
      <div className="max-w-md mx-auto my-10">
        <h1 className="text-2xl font-bold mb-5">Edit Wisata</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="namaWisata">Nama Wisata</label>
            <input type="text" id="namaWisata" value={namaWisata} onChange={(e) => setNamaWisata(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="kategori">Kategori</label>
            <input type="text" id="kategori" value={kategori} onChange={(e) => setKategori(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="alamat">Alamat</label>
            <input type="text" id="alamat" value={alamat} onChange={(e) => setAlamat(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="waktuOperasional">Waktu Operasional</label>
            <input type="text" id="waktuOperasional" value={waktuOperasional} onChange={(e) => setWaktuOperasional(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="karcis">Harga Karcis</label>
            <input type="text" id="karcis" value={karcis} onChange={(e) => setKarcis(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rating">Rating</label>
            <input type="number" step="0.1" id="rating" value={rating} onChange={(e) => setRating(parseFloat(e.target.value))} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deskripsi">Deskripsi</label>
            <textarea id="deskripsi" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="latitude">Latitude</label>
            <input type="number" step="0.0001" id="latitude" value={lokasi.latitude} onChange={(e) => setLokasi({ ...lokasi, latitude: e.target.value })} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="longitude">Longitude</label>
            <input type="number" step="0.0001" id="longitude" value={lokasi.longitude} onChange={(e) => setLokasi({ ...lokasi, longitude: e.target.value })} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="isOpen">Status</label>
            <select
              id="isOpen"
              value={isOpen}
              onChange={(e) => setIsOpen(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="open">Buka</option>
              <option value="closed">Tutup</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">Image</label>
            <input type="file" id="image" onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Submit</button>
        </form>
      </div>
    </DefaultLayout>
  );
};

export default EditWisata;
