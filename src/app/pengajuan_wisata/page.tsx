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
  karcis: string;
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
  const [pengajuanData, setPengajuanData] = useState<Pengajuan[]>([]); // Gunakan tipe data Pengajuan

  useEffect(() => {
    const fetchPengajuan = async () => {
      try {
        const pengajuanCollection = collection(firestore, "pengajuan_wisata");
        const pengajuanSnapshot = await getDocs(pengajuanCollection);
        const pengajuanList = pengajuanSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Pengajuan[]; // Cast ke tipe Pengajuan
        setPengajuanData(pengajuanList);
      } catch (error:any) {
        console.error("Error fetching documents: ", error);
      }
    };

    fetchPengajuan();
  }, [firestore]);

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
        await updateDoc(doc(firestore, "pengajuan_wisata", id), { status: "approved" });
        await setDoc(doc(firestore, "wisata", id), { ...data, status: "approved" });
        setPengajuanData((prevData) =>
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
              {pengajuanData.length > 0 ? (
                pengajuanData.map((pengajuan, index) => (
                  <tr key={pengajuan.id} className="hover:bg-gray-100">
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{pengajuan.nama_wisata}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{pengajuan.kategori}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{pengajuan.alamat}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{pengajuan.waktu_operasional}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{pengajuan.karcis}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{pengajuan.rating}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{pengajuan.deskripsi}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      <img src={pengajuan.image} alt={pengajuan.nama_wisata} className="w-32 h-20 object-cover" />
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {pengajuan.lokasi.latitude}, {pengajuan.lokasi.longitude}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{pengajuan.status || "Pending"}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleApprove(pengajuan.id, pengajuan)}
                        className="text-green-600 hover:text-green-900 mr-4"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-check-circle" viewBox="0 0 16 16">
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                          <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleReject(pengajuan.id)}
                        className="text-red-600 hover:text-red-900 mr-4"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="red" className="bi bi-x-circle" viewBox="0 0 16 16">
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(pengajuan.id)}
                        className="text-red-600 hover:text-red-900"
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
                  <td colSpan={11} className="px-4 py-2 text-center text-sm text-gray-500">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </DefaultLayout>
  );
}
