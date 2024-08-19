"use client";

import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { firebaseSDK } from "@/services/firebase";
import useAuth from "@/hooks/useAuth"; // Ensure correct import path
import Swal from "sweetalert2";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  useAuth(); // Check authentication
  const router = useRouter();
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
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await deleteDoc(doc(firestore, "wisata", id));
        setWisataData((prevData) =>
          prevData.filter((wisata) => wisata.id !== id),
        );

        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    } catch (error) {
      console.error("Error deleting document: ", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete the item. Please try again later.",
      });
    }
  };

  const handleEdit = (id) => {
    Swal.fire({
      title: "Edit Wisata",
      text: "This will navigate to the edit page.",
      icon: "info",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Go to Edit Page",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // Redirect to edit page
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
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="px-4 py-2 text-left text-xs font-medium tracking-wider text-black-2">
                    #
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium tracking-wider text-black-2">
                    Nama Wisata
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium tracking-wider text-black-2">
                    Kategori
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium tracking-wider text-black-2">
                    Alamat
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium tracking-wider text-black-2">
                    Waktu Operasional
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium tracking-wider text-black-2">
                    Harga Karcis
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium tracking-wider text-black-2">
                    Rating
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium tracking-wider text-black-2">
                    Deskripsi
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium tracking-wider text-black-2">
                    Gambar
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium tracking-wider text-black-2">
                    Lokasi
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium tracking-wider text-black-2">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-gray-200 divide-y bg-white">
                {wisataData.length > 0 ? (
                  wisataData.map((wisata, index) => (
                    <tr key={wisata.id} className="hover:bg-gray-100">
                      <td className="text-gray-500 whitespace-nowrap px-4 py-2 text-sm">
                        {index + 1}
                      </td>
                      <td className="text-gray-900 whitespace-nowrap text-wrap px-4 py-2 text-sm">
                        {wisata.nama_wisata}
                      </td>
                      <td className="text-gray-900 whitespace-nowrap px-4 py-2 text-sm">
                        {wisata.kategori}
                      </td>
                      <td className="text-gray-900 whitespace-nowrap px-4 py-2 text-sm">
                        {wisata.alamat}
                      </td>
                      <td className="text-gray-900 whitespace-nowrap px-4 py-2 text-sm">
                        {wisata.waktu_operasional}
                      </td>
                      <td className="text-gray-900 whitespace-nowrap px-4 py-2 text-sm">
                        {wisata.karcis}
                      </td>
                      <td className="text-gray-900 whitespace-nowrap px-4 py-2 text-sm">
                        {wisata.rating}
                      </td>
                      <td className="text-gray-900 whitespace-nowrap text-wrap px-4 py-2 text-sm">
                        {wisata.deskripsi}
                      </td>
                      <td className="text-gray-900 whitespace-nowrap px-4 py-2 text-sm">
                        <img
                          src={wisata.image}
                          alt={wisata.nama_wisata}
                          className="h-20 w-20 object-cover"
                        />
                      </td>
                      <td className="text-gray-900 whitespace-nowrap px-4 py-2 text-sm">
                        Lat: {wisata.lokasi.latitude}, Lon:{" "}
                        {wisata.lokasi.longitude}
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
                            class="bi bi-pencil"
                            viewBox="0 0 16 16"
                          >
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(wisata.id)}
                          className="text-red-500"
                        >
                          <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                              fill=""
                            />
                            <path
                              d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                              fill=""
                            />
                            <path
                              d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                              fill=""
                            />
                            <path
                              d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                              fill=""
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="text-gray-500 whitespace-nowrap px-4 py-2 text-sm"
                      colSpan="11"
                    >
                      No data available
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
