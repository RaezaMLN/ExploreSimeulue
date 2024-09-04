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
  const [selectedCategory, setSelectedCategory] = useState("all"); // New state for category filter

  useEffect(() => {
    const fetchData = async () => {
      const wisataCollection = collection(firestore, "wisata");
      let wisataQuery = wisataCollection;

      // Add category filter if selected
      if (selectedCategory !== "all") {
        wisataQuery = query(wisataCollection, where("kategori", "==", selectedCategory));
      }

      // Add search filter
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
  }, [firestore, searchQuery, selectedCategory]); // Add selectedCategory to dependencies

  const handleSearch = (event) => {
    event.preventDefault();
    const query = event.target.searchInput.value;
    setSearchQuery(query);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value); // Update selectedCategory
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
                        <img src={wisata.image} alt={wisata.nama_wisata} className="h-20 w-20 object-cover" />
                      </td>
                      <td className="text-gray-900 whitespace-nowrap px-4 py-2 text-sm">
                        Lat: {wisata.lokasi.latitude}, Lon: {wisata.lokasi.longitude}
                      </td>
                      <td className="text-gray-900 whitespace-nowrap px-4 py-2 text-sm">
                        {wisata.is_open === "open" ? "Buka" : "Tutup"}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleEdit(wisata.id)}
                          className="mr-2 text-blue-500"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-pencil"
                            viewBox="0 0 16 16"
                          >
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zm1.207 3L10 1.707 3.5 8.207V11h2.793l7.647-7.646-1.647-1.647zM1 13.5V16h2.5L14.915 4.5l-2.5-2.5L1 13.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(wisata.id)}
                          className="text-red-500"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-trash"
                            viewBox="0 0 16 16"
                          >
                            <path d="M5.5 5.5A.5.5 0 0 1 6 5h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5zm3.5-1a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5V4H5V3.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5-.5zM7.5 1a1 1 0 0 1 1 1H6.5a1 1 0 0 1 1-1zM1 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2H1zm13 0v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5h12zm-2 0H3v9a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V5z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" className="text-center py-4">
                    Data wisata tidak tersedia.
                    </td>
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
