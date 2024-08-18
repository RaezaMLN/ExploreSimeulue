// src/app/admin/page.tsx
"use client";

import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/services/firebase";
import Swal from "sweetalert2";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("admin");
    if (isLoggedIn) {
      router.push("/admin");
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const adminsRef = collection(firestore, "admins");
      const q = query(adminsRef, where("username", "==", username), where("password", "==", password));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        localStorage.setItem("admin", "true");
        Swal.fire({
          icon: "success",
          title: "Login Berhasil",
          showConfirmButton: false,
          timer: 1500,
        });
        router.push("/");
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Gagal",
          text: "Username atau password salah",
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      Swal.fire({
        icon: "error",
        title: "Terjadi Kesalahan",
        text: "Tidak dapat melakukan login. Silakan coba lagi nanti.",
      });
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-800 bg-cover bg-center relative" style={{ backgroundImage: 'url(/bg.jpg)' }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <Head>
        <title>Admin Login</title>
      </Head>
      <div className="relative max-w-md w-full py-20 px-10 bg-white rounded-3xl shadow-lg">
        <h2 className="text-4xl font-bold mb-4 text-center text-gray-800">Admin Login</h2>
        <form className="flex flex-col space-y-4" onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              className="shadow appearance-none border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <input
              className="shadow appearance-none border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
