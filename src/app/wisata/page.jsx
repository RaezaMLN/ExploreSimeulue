"use client";

import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, query, where, orderBy, doc, deleteDoc, writeBatch } from "firebase/firestore";
import { firebaseSDK } from "@/services/firebase";
import useAuth from "@/hooks/useAuth";
import Swal from "sweetalert2";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  useAuth(); // Check authentication
  const router = useRouter();
  const firestore = getFirestore(firebaseSDK);
  const [wisataData, setWisataData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      const wisataCollection = collection(firestore, "wisata");
      let wisataQuery = wisataCollection;

      if (selectedCategory !== "all") {
        wisataQuery = query(wisataCollection, where("kategori", "==", selectedCategory));
      }

      if (searchQuery) {
        wisataQuery = query(
          wisataQuery,
          orderBy("nama_wisata"),
          where("nama_wisata", ">=", searchQuery.toLowerCase()),
          where("nama_wisata", "<=", searchQuery.toLowerCase() + "\uf8ff")
        );
      }

      const wisataSnapshot = await getDocs(wisataQuery);
      const wisataList = wisataSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWisataData(wisataList);
    };

    fetchData();
  }, [firestore, searchQuery, selectedCategory]);

  const handleSearch = (event) => {
    event.preventDefault();
    const query = event.target.searchInput.value;
    setSearchQuery(query);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleDelete = async (id) => {
    const batch = writeBatch(firestore);
    try {
      const result = await Swal.fire({
        title: "Apakah Anda yakin?",
        text: "Anda tidak akan dapat mengembalikan ini!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, hapus!",
      });

      if (result.isConfirmed) {
        const feedbackCollection = collection(firestore, "feedback");
        const feedbackQuery = query(feedbackCollection, where("id_wisata", "==", id));
        const feedbackSnapshot = await getDocs(feedbackQuery);

        feedbackSnapshot.docs.forEach((feedbackDoc) => {
          batch.delete(doc(firestore, "feedback", feedbackDoc.id));
        });

        batch.delete(doc(firestore, "wisata", id));
        await batch.commit();
        setWisataData((prevData) => prevData.filter((wisata) => wisata.id !== id));

        Swal.fire("Dihapus!", "File Anda telah dihapus.", "success");
      }
    } catch (error) {
      console.error("Error deleting document: ", error);
      Swal.fire({
        icon: "error",
        title: "Kesalahan",
        text: `Gagal menghapus item. Kesalahan: ${error.message}`,
      });
    }
  };

  const handleEdit = (id) => {
    Swal.fire({
      title: "Edit Wisata",
      text: "Ini akan mengarahkan Anda ke halaman edit.",
      icon: "info",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Pergi ke Halaman Edit",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        router.push(`/wisata/edit?id=${id}`);
      }
    });
  };

  return (
    <>
      <DefaultLayout>
        <main className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto">
            <Link
              href="/wisata/add"
              className="mb-4 inline-block rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Tambah Wisata
            </Link>

            {/* <form onSubmit={handleSearch} className="mb-4">
              <input
                type="text"
                name="searchInput"
                placeholder="Type to search..."
                className="border p-2 rounded"
              />
              <button
                type="submit"
                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Search
              </button>
            </form> */}

            <div className="mb-4">
              <label htmlFor="categoryFilter" className="mr-2">Filter berdasarkan kategory:</label>
              <select
                id="categoryFilter"
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="border p-2 rounded"
              >
                <option value="all">All</option>
                <option value="alam">Alam</option>
                <option value="religi">Religi</option>
                <option value="kuliner">Kuliner</option>
              </select>
            </div>

            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="px-4 py-2 text-left text-xs font-medium tracking-wider text-black-2">#</th>
                  <th className="px-4 py-2 text-left text-xs font-medium tracking-wider text-black-2">Nama Wisata</th>
                  <th className="px-4 py-2 text-left text-xs font-medium tracking-wider text-black-2">Kategori</th>
                  <th className="px-4 py-2 text-left text-xs font-medium tracking-wider text-black-2">Alamat</th>
                  <th className="px-4 py-2 text-left text-xs font-medium tracking-wider text-black-2">Waktu Operasional</th>
                  <th className="px-4 py-2 text-left text-xs font-medium tracking-wider text-black-2">Harga Karcis</th>
                  <th className="px-4 py-2 text-left text-xs font-medium tracking-wider text-black-2">Rating</th>
                  <th className="px-4 py-2 text-left text-xs font-medium tracking-wider text-black-2">Deskripsi</th>
                  <th className="px-4 py-2 text-left text-xs font-medium tracking-wider text-black-2">Gambar</th>
                  <th className="px-4 py-2 text-left text-xs font-medium tracking-wider text-black-2">Lokasi</th>
                  <th className="px-4 py-2 text-left text-xs font-medium tracking-wider text-black-2">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium tracking-wider text-black-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-gray-200 divide-y bg-white">
                {wisataData.length > 0 ? (
                  wisataData.map((wisata, index) => (
                    <tr key={wisata.id} className="hover:bg-gray-100">
                      <td className="text-gray-500 whitespace-nowrap px-4 py-2 text-sm">{index + 1}</td>
                      <td className="text-gray-900 whitespace-nowrap text-wrap px-4 py-2 text-sm">{wisata.nama_wisata}</td>
                      <td className="text-gray-900 whitespace-nowrap px-4 py-2 text-sm">{wisata.kategori}</td>
                      <td className="text-gray-900 whitespace-nowrap px-4 py-2 text-sm">{wisata.alamat}</td>
                      <td className="text-gray-900 whitespace-nowrap px-4 py-2 text-sm">{wisata.waktu_operasional}</td>
                      <td className="text-gray-900 whitespace-nowrap px-4 py-2 text-sm">{wisata.karcis}</td>
                      <td className="text-gray-900 whitespace-nowrap px-4 py-2 text-sm">{wisata.rating}</td>
                      <td className="text-gray-900 px-4 py-2 overflow-hidden text-ellipsis max-w-xs">
                        <div className="line-clamp-3">{wisata.deskripsi}</div>
                      </td>
                      <td className="text-gray-900 whitespace-nowrap px-4 py-2 text-sm">
                        {/* Periksa apakah wisata.image adalah array atau string */}
                        {Array.isArray(wisata.images) ? (
                          wisata.images.length > 0 ? (
                            <div className="flex space-x-2 overflow-x-auto">
                              {wisata.images.map((imgUrl, index) => (
                                <img
                                  key={index}
                                  src={imgUrl}
                                  alt={`Gambar ${index + 1}`}
                                  className="h-20 w-20 object-cover"
                                />
                              ))}
                            </div>
                          ) : (
                            <p>No images available</p>
                          )
                        ) : typeof wisata.image === 'string' ? (
                          <img
                            src={wisata.image}
                            alt={wisata.nama_wisata}
                            className="h-20 w-20 object-cover"
                          />
                        ) : (
                          <p>No images available</p>
                        )}
                      </td>

                      <td className="text-gray-900 whitespace-nowrap px-4 py-2 text-sm">{`${wisata.lokasi.latitude}, ${wisata.lokasi.longitude}`}</td>
                      <td className="text-gray-900 whitespace-nowrap px-4 py-2 text-sm">{wisata.is_open}</td>
                      <td className="text-gray-900 whitespace-nowrap px-4 py-2 text-sm">
                        <button
                          onClick={() => handleEdit(wisata.id)}
                          className="mr-2 bg-yellow-500 px-4 py-2 text-white rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(wisata.id)}
                          className="bg-red-500 px-4 py-2 text-white rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" className="text-center px-4 py-2 text-sm text-gray-500">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </DefaultLayout>
    </>
  );
}
