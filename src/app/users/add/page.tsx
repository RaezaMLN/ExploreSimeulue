"use client";

import { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { firebaseSDK } from '@/services/firebase';
import Swal from 'sweetalert2';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { encryptPassword } from '@/utils/encrypt'; // Import fungsi enkripsi

const firestore = getFirestore(firebaseSDK);

export default function AddUser() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const encryptedPassword = await encryptPassword(password); // Enkripsi password

      await addDoc(collection(firestore, 'users'), {
        email,
        username,
        password: encryptedPassword,
        createdAt: new Date(),
      });

      Swal.fire('Success!', 'User has been added.', 'success');
      setEmail('');
      setUsername('');
      setPassword('');
      
    } catch (error) {
      console.error("Error adding user:", error);
      Swal.fire('Error!', 'There was an error adding the user.', 'error');
    }
  };

  return (
    <>
      <DefaultLayout>
        <main className="h-screen p-4 bg-gray-100">
          <div className="container mx-auto bg-white shadow-md rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-4">Tambah Pengguna</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Submit
              </button>
            </form>
          </div>
        </main>
      </DefaultLayout>
    </>
  );
}
