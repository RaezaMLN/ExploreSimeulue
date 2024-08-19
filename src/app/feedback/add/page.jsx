// src/app/feedback/add.tsx
"use client";

import { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { firebaseSDK } from '@/services/firebase';
import Swal from 'sweetalert2';
import DefaultLayout from '@/components/Layouts/DefaultLayout';

const firestore = getFirestore(firebaseSDK);

export default function AddFeedback() {
  const [idWisata, setIdWisata] = useState('');
  const [rating, setRating] = useState('');
  const [feed, setFeed] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(firestore, 'feedback'), {
        id_wisata: idWisata,
        rating: parseFloat(rating),
        feed,
        tmt: new Date(),
      });
      Swal.fire('Success!', 'Feedback has been added.', 'success');
    } catch (error) {
      console.error("Error adding feedback:", error);
      Swal.fire('Error!', 'There was an error adding the feedback.', 'error');
    }
  };

  return (
    <>
    <DefaultLayout>
    <main className="h-screen p-4 bg-gray-100">
      <div className="container mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Tambah Umpan Balik</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="idWisata">Wisata ID</label>
            <input type="text" id="idWisata" value={idWisata} onChange={(e) => setIdWisata(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rating">Rating</label>
            <input type="number" step="0.1" id="rating" value={rating} onChange={(e) => setRating(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="feed">Komentar</label>
            <textarea id="feed" value={feed} onChange={(e) => setFeed(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Submit</button>
        </form>
      </div>
    </main>
    </DefaultLayout>
    </>
  );
}
