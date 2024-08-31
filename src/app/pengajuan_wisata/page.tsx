"use client";
import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc, setDoc } from 'firebase/firestore';
import { firebaseSDK } from "@/services/firebase";
import Swal from "sweetalert2";
import useAuth from "@/hooks/useAuth";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

// Definisikan interface untuk data pengajuan
interface Pengajuan {
  id: string;
  nama_wisata: string;
  kategori: string;
  alamat: string;
  waktu_operasional: string;
  karcis: string; // Tetap sebagai string
  rating: string;
  deskripsi: string;
  image: string;
  lokasi: {
    latitude: number;
    longitude: number;
  };
  status?: string;
}

export default function PengajuanWisata() {
  useAuth(); // Cek autentikasi

  const firestore = getFirestore(firebaseSDK);
  const [pengajuanData, setPengajuanData] = useState<Pengajuan[]>([]);
  const [filteredData, setFilteredData] = useState<Pengajuan[]>([]);
  const [kategoriFilter, setKategoriFilter] = useState<string>('All');
  const [categories, setCategories] = useState<string[]>(['All']); // Daftar kategori

  useEffect(() => {
    const fetchPengajuan = async () => {
      try {
        const pengajuanCollection = collection(firestore, "pengajuan_wisata");
        const pengajuanSnapshot = await getDocs(pengajuanCollection);
        const pengajuanList = pengajuanSnapshot.docs.map((doc) => {
          const data = doc.data() as Pengajuan;
          return {
            ...data,
            id: doc.id,
            karcis: data.karcis,
            rating: data.rating,
            lokasi: {
              latitude: data.lokasi.latitude,
              longitude: data.lokasi.longitude,
            },
          };
        }) as Pengajuan[];

        // Update state kategori
        const uniqueCategories = Array.from(new Set(pengajuanList.map(p => p.kategori)));
        setCategories(['All', ...uniqueCategories]);

        // Set data awal
        setPengajuanData(pengajuanList);
        setFilteredData(pengajuanList);
      } catch (error:any) {
        console.error("Error fetching documents: ", error);
      }
    };

    fetchPengajuan();
  }, [firestore]);

  useEffect(() => {
    if (kategoriFilter === 'All') {
      setFilteredData(pengajuanData);
    } else {
      setFilteredData(
        pengajuanData.filter(pengajuan => pengajuan.kategori.toLowerCase().includes(kategoriFilter.toLowerCase()))
      );
    }
  }, [kategoriFilter, pengajuanData]);

  const handleApprove = async (id: string, data: Pengajuan) => {
    const result = await Swal.fire({
      title: 'Approve this submission?',
      text: "Are you sure you want to approve this submission?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, approve it!',
    });

    if (result.isConfirmed) {
      try {
        const formattedData = {
          ...data,
          rating: parseFloat(data.rating), // Convert rating to number
          lokasi: {
            latitude: data.lokasi.latitude, // latitude is already a number
            longitude: data.lokasi.longitude, // longitude is already a number
          },
          status: "approved",
          is_open: "open", // Tambahkan field is_open dengan value "open"
        };

        // Update status pengajuan di koleksi pengajuan_wisata
        await updateDoc(doc(firestore, "pengajuan_wisata", id), { status: "approved" });

        // Simpan data yang di-approve ke koleksi wisata
        await setDoc(doc(firestore, "wisata", id), formattedData);

        // Hapus pengajuan dari daftar setelah disetujui
        setPengajuanData((prevData) =>
          prevData.filter((pengajuan) => pengajuan.id !== id)
        );
        setFilteredData((prevData) =>
          prevData.filter((pengajuan) => pengajuan.id !== id)
        );

        Swal.fire('Approved!', 'The submission has been approved and added to wisata.', 'success');
      } catch (error:any) {
        console.error("Error approving document: ", error);
        Swal.fire('Error!', `There was an error approving the submission: ${error.message}`, 'error');
      }
    }
  };

  const handleReject = async (id: string) => {
    const result = await Swal.fire({
      title: 'Reject this submission?',
      text: "Are you sure you want to reject this submission?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reject it!',
    });

    if (result.isConfirmed) {
      try {
        await updateDoc(doc(firestore, "pengajuan_wisata", id), { status: "rejected" });
        setPengajuanData((prevData) =>
          prevData.filter((pengajuan) => pengajuan.id !== id)
        );
        setFilteredData((prevData) =>
          prevData.filter((pengajuan) => pengajuan.id !== id)
        );
        Swal.fire('Rejected!', 'The submission has been rejected.', 'success');
      } catch (error:any) {
        console.error("Error rejecting document: ", error);
        Swal.fire('Error!', `There was an error rejecting the submission: ${error.message}`, 'error');
      }
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Delete this submission?',
      text: "Are you sure you want to delete this submission? This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(firestore, "pengajuan_wisata", id));
        setPengajuanData((prevData) =>
          prevData.filter((pengajuan) => pengajuan.id !== id)
        );
        setFilteredData((prevData) =>
          prevData.filter((pengajuan) => pengajuan.id !== id)
        );
        Swal.fire('Deleted!', 'The submission has been deleted.', 'success');
      } catch (error) {
        console.error("Error deleting document: ", error);
        Swal.fire('Error!', 'There was an error deleting the submission.', 'error');
      }
    }
  };

  return (
    <DefaultLayout>
      <main className="h-screen p-4 bg-gray-100">
        <div className="container mx-auto bg-white shadow-md rounded-lg p-6 overflow-x-auto">
          <h1 className="text-2xl font-bold mb-5">Pengajuan Wisata</h1>

          {/* Filter Kategori */}
          <div className="mb-4">
            <label htmlFor="kategoriFilter" className="block text-sm font-medium text-gray-700">
              Filter by Kategori:
            </label>
            <select
              id="kategoriFilter"
              value={kategoriFilter}
              onChange={(e) => setKategoriFilter(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {categories.map((kategori) => (
                <option key={kategori} value={kategori}>
                  {kategori}
                </option>
              ))}
            </select>
          </div>

          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Wisata</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alamat</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu Operasional</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga Karcis</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gambar</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.length > 0 ? (
                filteredData.map((pengajuan, index) => (
                  <tr key={pengajuan.id} className="hover:bg-gray-100">
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{pengajuan.nama_wisata}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{pengajuan.kategori}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{pengajuan.alamat}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{pengajuan.waktu_operasional}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{pengajuan.karcis}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{pengajuan.rating}</td>
                    <td className="text-gray-900 px-4 py-2 overflow-hidden text-ellipsis max-w-xs">
                        <div className="line-clamp-3">
                          {pengajuan.deskripsi}
                        </div>
                      </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      <img src={pengajuan.image} alt={pengajuan.nama_wisata} className="w-32 h-20 object-cover" />
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      Lat: {pengajuan.lokasi.latitude}, Lon: {pengajuan.lokasi.longitude}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{pengajuan.status || "Pending"}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 space-x-2">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded-md"
                        onClick={() => handleApprove(pengajuan.id, pengajuan)}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded-md"
                        onClick={() => handleReject(pengajuan.id)}
                      >
                        Reject
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded-md"
                        onClick={() => handleDelete(pengajuan.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={12} className="px-4 py-2 text-center text-sm text-gray-500">
                    No submissions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </DefaultLayout>
  );
}
