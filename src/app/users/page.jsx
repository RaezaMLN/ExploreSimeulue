"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { firebaseSDK } from '@/services/firebase';
import Swal from 'sweetalert2';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from "next/link";


const firestore = getFirestore(firebaseSDK);

export default function UsersPage() {
  const [usersList, setUsersList] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(firestore, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsersList(usersData);
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(firestore, 'users', id));
        setUsersList(prevList => prevList.filter(user => user.id !== id));
        Swal.fire('Deleted!', 'User has been deleted.', 'success');
      } catch (error) {
        console.error("Error deleting user:", error);
        Swal.fire('Error!', 'There was an error deleting the user.', 'error');
      }
    }
  };

  const handleEdit = (id) => {
    Swal.fire({
      title: 'Edit User',
      text: 'Are you sure you want to edit this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, edit it!'
    }).then((result) => {
      if (result.isConfirmed) {
        router.push(`/users/edit?id=${id}`);
      }
    });
  };

  return (
    <DefaultLayout>
      <main className="h-screen p-4 bg-gray-100">
        <Link
              href="/user/add"
              className="mb-4 inline-block rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Tambah Pengguna
            </Link>
        <div className="container mx-auto bg-white shadow-md rounded-lg p-6 overflow-x-auto">
          <h1 className="text-2xl font-bold mb-4">User List</h1>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Password</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usersList.length > 0 ? (
                usersList.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-100">
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{user.username}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">*****</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      <button onClick={() => handleEdit(user.id)} className="text-blue-500 hover:text-blue-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                          <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                        </svg>
                      </button>
                      <button onClick={() => handleDelete(user.id)} className="text-red-500 ml-4">
                        <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z" fill="" />
                          <path d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.7313V13.3376C8.35352 13.6751 8.63477 13.9563 8.97227 13.9563C9.30977 13.9563 9.59102 13.6751 9.59102 13.3376V9.7313C9.59102 9.3938 9.30977 9.11255 9.00039 9.11255Z" fill="" />
                          <path d="M11.625 9.14516C11.3429 9.09041 11.0617 9.30916 11.0067 9.61854L10.5942 13.1404C10.5392 13.4217 10.758 13.7029 11.0674 13.7579C11.3497 13.8129 11.6309 13.5942 11.6859 13.2848L12.0984 9.76291C12.1256 9.48166 11.9069 9.20041 11.625 9.14516Z" fill="" />
                          <path d="M6.99355 9.61854C6.93855 9.33729 6.6858 9.09041 6.43105 9.14516C6.1498 9.20041 5.93005 9.44954 5.9853 9.7313L6.3978 13.2532C6.42505 13.5069 6.67505 13.7257 6.9278 13.7579C7.2113 13.8129 7.49255 13.5942 7.54755 13.2848L7.13505 9.76291C7.10855 9.48166 6.8658 9.20041 6.99355 9.61854Z" fill="" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-4">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </DefaultLayout>
  );
}
