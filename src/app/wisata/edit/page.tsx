"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore, uploadImages } from '@/services/firebase'; // Import uploadImages
import Swal from 'sweetalert2';
import DefaultLayout from '@/components/Layouts/DefaultLayout';

const EditWisata = () => {
  const [namaWisata, setNamaWisata] = useState<string>('');
  const [kategori, setKategori] = useState<string>('');
  const [alamat, setAlamat] = useState<string>('');
  const [waktuOperasional, setWaktuOperasional] = useState<string>('');
  const [karcis, setKarcis] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [deskripsi, setDeskripsi] = useState<string>('');
  const [lokasi, setLokasi] = useState<{ latitude: string; longitude: string }>({ latitude: '', longitude: '' });
  const [images, setImages] = useState<File[]>([]); // State untuk menyimpan beberapa gambar
  const [existingImages, setExistingImages] = useState<string[]>([]); // State untuk menyimpan URL gambar yang sudah ada
  const [isOpen, setIsOpen] = useState<string>('open');
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const docRef = doc(firestore, 'wisata', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setNamaWisata(data.nama_wisata);
            setKategori(data.kategori);
            setAlamat(data.alamat);
            setWaktuOperasional(data.waktu_operasional);
            setKarcis(data.karcis);
            setRating(data.rating);
            setDeskripsi(data.deskripsi);
            setLokasi(data.lokasi);
            setExistingImages(data.images || []); // Ambil URL gambar yang sudah ada
            setIsOpen(data.is_open || 'open');
          } else {
            console.log('No such document!');
          }
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchData();
  }, [id]);

  const isValidLatitude = (lat: number) => lat >= -90 && lat <= 90;
  const isValidLongitude = (lon: number) => lon >= -180 && lon <= 180;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const ratingParsed = parseFloat(rating.toString());
    const latitudeParsed = parseFloat(lokasi.latitude);
    const longitudeParsed = parseFloat(lokasi.longitude);

    if (!isValidLatitude(latitudeParsed) || !isValidLongitude(longitudeParsed)) {
      Swal.fire('Error', 'Latitude atau Longitude tidak valid', 'error');
      return;
    }

    if (isNaN(ratingParsed) || ratingParsed < 0 || ratingParsed > 5) {
      Swal.fire('Error', 'Rating harus berupa angka antara 0 dan 5', 'error');
      return;
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
        try {
          let imageUrls = [...existingImages]; // Mulai dengan gambar yang sudah ada

          if (images.length > 0) {
            const newImageUrls = await uploadImages(images);
            imageUrls = [...imageUrls, ...newImageUrls];
          }

          const docRef = doc(firestore, 'wisata', id || '');
          await updateDoc(docRef, {
            nama_wisata: namaWisata,
            kategori,
            alamat,
            waktu_operasional: waktuOperasional,
            karcis,
            rating: ratingParsed,
            deskripsi,
            lokasi: {
              latitude: latitudeParsed,
              longitude: longitudeParsed
            },
            images: imageUrls, // Simpan array URL gambar
            is_open: isOpen,
          });

          Swal.fire('Tersimpan!', 'Perubahan Anda telah disimpan.', 'success');
          router.push('/wisata');
        } catch (error) {
          Swal.fire('Error', 'Terjadi kesalahan saat menyimpan data.', 'error');
        }
      }
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  return (
    <DefaultLayout>
      <div className="max-w-md mx-auto my-10">
        <h1 className="text-2xl font-bold mb-5">Edit Wisata</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="namaWisata">Nama Wisata</label>
            <input 
              type="text" 
              id="namaWisata" 
              value={namaWisata} 
              onChange={(e) => setNamaWisata(e.target.value)} 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="kategori">Kategori</label>
            <input 
              type="text" 
              id="kategori" 
              value={kategori} 
              onChange={(e) => setKategori(e.target.value)} 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="alamat">Alamat</label>
            <input 
              type="text" 
              id="alamat" 
              value={alamat} 
              onChange={(e) => setAlamat(e.target.value)} 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="waktuOperasional">Waktu Operasional</label>
            <input 
              type="text" 
              id="waktuOperasional" 
              value={waktuOperasional} 
              onChange={(e) => setWaktuOperasional(e.target.value)} 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="karcis">Karcis</label>
            <input 
              type="text" 
              id="karcis" 
              value={karcis} 
              onChange={(e) => setKarcis(e.target.value)} 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rating">Rating</label>
            <input 
              type="number" 
              id="rating" 
              value={rating} 
              onChange={(e) => setRating(parseFloat(e.target.value))} 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
              min="0" 
              max="5"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deskripsi">Deskripsi</label>
            <textarea 
              id="deskripsi" 
              value={deskripsi} 
              onChange={(e) => setDeskripsi(e.target.value)} 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
              rows={4}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="latitude">Latitude</label>
            <input 
              type="text" 
              id="latitude" 
              value={lokasi.latitude} 
              onChange={(e) => setLokasi({ ...lokasi, latitude: e.target.value })} 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="longitude">Longitude</label>
            <input 
              type="text" 
              id="longitude" 
              value={lokasi.longitude} 
              onChange={(e) => setLokasi({ ...lokasi, longitude: e.target.value })} 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="isOpen">Status</label>
            <select
              id="isOpen"
              value={isOpen}
              onChange={(e) => setIsOpen(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="images">Gambar</label>
            <input 
              type="file" 
              id="images" 
              multiple
              onChange={handleFileChange} 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            />
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Submit</button>
        </form>
      </div>
    </DefaultLayout>
  );
};

export default EditWisata;
