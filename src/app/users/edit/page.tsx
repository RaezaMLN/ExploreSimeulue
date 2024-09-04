"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { firebaseSDK } from '@/services/firebase';
import Swal from 'sweetalert2';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import bcrypt from 'bcryptjs'; // Pastikan bcryptjs terinstal

const firestore = getFirestore(firebaseSDK);

export default function EditUserPage() {
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams ? searchParams.get('id') : null;

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        const docRef = doc(firestore, 'users', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUser(data);
          setUsername(data.username);
          setEmail(data.email);
        } else {
          Swal.fire('Gagal!', 'Pengguna tidak ditemukan.', 'error');
        }
      };

      fetchUser();
    }
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    if (password !== confirmPassword) {
      Swal.fire('Gagal!', 'Password tidak cocok.', 'error');
      return;
    }

    try {
      const docRef = doc(firestore, 'users', id);
      
      // Enkripsi password jika diberikan
      const encryptedPassword = password ? await bcrypt.hash(password, 10) : user.password;

      await updateDoc(docRef, {
        username,
        email,
        password: encryptedPassword,
      });

      Swal.fire('Berhasil!', 'Pengguna berhasil diperbarui.', 'success');
      router.push('/users');
    } catch (error) {
      console.error("Terjadi kesalahan saat memperbarui pengguna:", error);
      Swal.fire('Gagal!', 'Terjadi kesalahan saat memperbarui pengguna.', 'error');
    }
  };


  return (
    <>
      <DefaultLayout>
        <main className="h-screen p-4 bg-gray-100">
          <div className="container mx-auto bg-white shadow-md rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-4">Edit User</h1>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Username</label>
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">Confirm Password</label>
                <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              </div>
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Update</button>
            </form>
          </div>
        </main>
      </DefaultLayout>
    </>
  );
}
