import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import "../app/globals.css";
import Router from "next/router";

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/admin/ApiLogin", formData);
    
      if (response.status === 200) {
        const { id_admin } = response.data; // Pastikan API mengembalikan `id_admin`
        // Redirect ke halaman index dengan query parameter id_admin
        router.push(`/?id=${id_admin}`);
      } else {
        // Jika status bukan 200
        setMessage("Login gagal. Periksa kembali username dan password.");
      }
    } catch (error) {
      // Periksa apakah ada respons dari server
      if (error.response) {
        // Tampilkan pesan spesifik dari API
        setMessage(error.response.data.message || "Login gagal. Coba lagi.");
      } else {
        // Kesalahan jaringan atau lainnya
        console.error("Error during login:", error);
        setMessage("Terjadi kesalahan jaringan atau server.");
      }
    }
    
  };

  return (
    <div className=" bg-gray-100 w-full h-screen grid grid-cols-1 md:grid-cols-2 rounded-lg">
        <div className="bg-[#292929] w-full h-full   hidden md:grid px-9">
            <div className="mx-auto my-auto p-20">
            <h1 className="text-4xl font-bold  text-slate-100">Selamat datang di StockEase</h1>
            <h2 className="text-2xl font-medium mt-5 text-white">Jadikan Manajemen Toko Anda Lebih Mudah dengan StockEase</h2>
            </div>
        
        </div>
      
      
      <form onSubmit={handleSubmit} className="flex flex-col w-full px-4 md:px-24 lg:px-48 gap-4 mx-auto my-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
        <div>
          <label className="block text-lg font-semibold">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="p-2 border bg-transparent bg-gray-100 rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block text-lg font-semibold">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="p-2 border bg-transparent rounded w-full"
            required
          />
        </div>
        <p>Belum memiliki akun? <a href="/register" className="text-[#292929]">Daftar disini</a></p>
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
        <button
          type="submit"
          className="bg-[#292929] text-white px-4 py-2 rounded mt-4"
        >
          Login
        </button>
      </form>
      
    </div>
  );
};

export default Login;
