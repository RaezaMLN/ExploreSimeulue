"use client";
import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc, setDoc } from 'firebase/firestore';
import { firebaseSDK } from "@/services/firebase";
import Swal from "sweetalert2";
import useAuth from "@/hooks/useAuth"; // Ensure correct import path
import DefaultLayout from "@/components/Layouts/DefaultLayout";


export default function PengajuanWisata() {
  useAuth(); // Check authentication

  const firestore = getFirestore(firebaseSDK);
  const [pengajuanData, setPengajuanData] = useState([]);

  useEffect(() => {
    const fetchPengajuan = async () => {
      try {
        const pengajuanCollection = collection(firestore, "pengajuan_wisata");
        const pengajuanSnapshot = await getDocs(pengajuanCollection);
        const pengajuanList = pengajuanSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPengajuanData(pengajuanList);
      } catch (error) {
        console.error("Error fetching documents: ", error);
      }
    };

    fetchPengajuan();
  }, [firestore]);

  const handleApprove = async (id, data) => {
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
        // Update status in pengajuan_wisata
        await updateDoc(doc(firestore, "pengajuan_wisata", id), { status: "approved" });
  
        // Add data to wisata collection
        await setDoc(doc(firestore, "wisata", id), { ...data, status: "approved" });
  
        setPengajuanData((prevData) =>
          prevData.filter((pengajuan) => pengajuan.id !== id) // Remove from pengajuan_wisata list
        );
  
        Swal.fire('Approved!', 'The submission has been approved and added to wisata.', 'success');
      } catch (error) {
        console.error("Error approving document: ", error);
        Swal.fire('Error!', `There was an error approving the submission: ${error.message}`, 'error');
      }
    }
  };
  
  

  const handleReject = async (id) => {
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
          prevData.filter((pengajuan) => pengajuan.id !== id) // Remove from pengajuan_wisata list
        );
  
        Swal.fire('Rejected!', 'The submission has been rejected.', 'success');
      } catch (error) {
        console.error("Error rejecting document: ", error);
        Swal.fire('Error!', `There was an error rejecting the submission: ${error.message}`, 'error');
      }
    }
  };
  

  const handleDelete = async (id) => {
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
    
    <>
   <DefaultLayout>
    <main className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <h1 className="text-2xl font-bold mb-5">Pengajuan Wisata</h1>
        <table className="min-w-full divide-y divide-gray-200">
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
                    <img src={pengajuan.image} alt={pengajuan.nama_wisata} className="w-20 h-20 object-cover" />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                    Lat: {pengajuan.lokasi.latitude}, Lon: {pengajuan.lokasi.longitude}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{pengajuan.status || 'pending'}</td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleApprove(pengajuan.id, pengajuan)}
                      className="text-green-500 mr-2"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(pengajuan.id)}
                      className="text-red-500 mr-2"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleDelete(pengajuan.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500" colSpan="12">
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
