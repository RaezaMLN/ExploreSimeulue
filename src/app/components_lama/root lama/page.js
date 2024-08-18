"use client";

import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { firebaseSDK } from "@/services/firebase";
import useAuth from "@/hooks/useAuth"; // Ensure correct import path
import Swal from "sweetalert2";

export default function Home() {
  useAuth(); // Check authentication

  const firestore = getFirestore(firebaseSDK);
  const [wisataData, setWisataData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const wisataCollection = collection(firestore, "wisata");
      const wisataSnapshot = await getDocs(wisataCollection);
      const wisataList = wisataSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWisataData(wisataList);
    };

    fetchData();
  }, [firestore]);

  const handleDelete = async (id) => {
    try {
      // Show confirmation dialog
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      });

      if (result.isConfirmed) {
        await deleteDoc(doc(firestore, "wisata", id));
        setWisataData((prevData) => prevData.filter((wisata) => wisata.id !== id));

        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        );
      }
    } catch (error) {
      console.error("Error deleting document: ", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete the item. Please try again later.',
      });
    }
  };

  const handleEdit = (id) => {
    Swal.fire({
      title: 'Edit Wisata',
      text: 'This will navigate to the edit page.',
      icon: 'info',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Go to Edit Page',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        // Redirect to edit page
        window.location.href = `/edit-wisata?id=${id}`;
      }
    });
  };

  return (
    <main className="h-screen p-4 bg-gray-100">
      <div className="container mx-auto bg-white shadow-md rounded-lg p-6 overflow-x-auto">
        <a href="/add-wisata" className="inline-block mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Tambah Wisata
        </a>
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
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {wisataData.length > 0 ? (
              wisataData.map((wisata, index) => (
                <tr key={wisata.id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{wisata.nama_wisata}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{wisata.kategori}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{wisata.alamat}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{wisata.waktu_operasional}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{wisata.karcis}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{wisata.rating}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{wisata.deskripsi}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                    <img src={wisata.image} alt={wisata.nama_wisata} className="w-20 h-20 object-cover" />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                    Lat: {wisata.lokasi.latitude}, Lon: {wisata.lokasi.longitude}
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleEdit(wisata.id)}
                      className="text-blue-500 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(wisata.id)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500" colSpan="11">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
