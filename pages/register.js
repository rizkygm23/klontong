import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router"; // Import useRouter
import "../app/globals.css";

const RegisterAdmin = () => {
  const router = useRouter(); // Inisialisasi useRouter
  const [formData, setFormData] = useState({
    nama: "",
    username: "",
    password: "",
    email: "",
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imgUrl = "";
      if (file) {
        const uploadData = new FormData();
        uploadData.append("file", file);
        uploadData.append("upload_preset", "img_data");

        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dtjnzbvlg/image/upload",
          uploadData
        );
        imgUrl = res.data.secure_url;
      }

      const response = await axios.post("/api/admin/ApiReg", {
        ...formData,
        img_url: imgUrl,
      });

      if (response.status === 201) {
        setMessage("Admin berhasil terdaftar!");
        setFormData({ nama: "", username: "", password: "", email: "" });
        setFile(null);
        // Redirect ke halaman login
        router.push("/login");
      }
    } catch (error) {
      console.error("Error registering admin:", error);
      setMessage("Gagal mendaftarkan admin.");
    }
  };

  return (
    <div className="bg-gray-100 w-full h-full grid grid-cols-1 md:grid-cols-2 rounded-lg">
  {/* Kolom Selamat Datang */}
  <div className="bg-[#3B3B3B] w-full h-full hidden md:flex items-center justify-center px-9">
            <div className="mx-auto my-auto p-20">
            <h1 className="text-4xl font-bold  text-slate-100">Selamat datang di StockEase</h1>
            <h2 className="text-2xl font-medium mt-5 text-gray-300">Jadikan Manajemen Toko Anda Lebih Mudah dengan StockEase</h2>
            </div>
  </div>

  {/* Form Register */}
  <form
    onSubmit={handleSubmit}
    className="flex flex-col w-full px-4 md:px-24 lg:px-48 py-16 gap-4 mx-auto my-auto"
  >
    <h1 className="text-2xl font-bold mb-4">Register</h1>

    <div>
      <label className="block text-lg font-semibold">Nama</label>
      <input
        type="text"
        name="nama"
        value={formData.nama}
        onChange={handleChange}
        className="p-2 border bg-transparent bg-gray-100 rounded w-full"
        required
      />
    </div>
    <div className="grid-cols-2 grid gap-4">
    <div>
      <label className="block text-lg font-semibold">Masukan ID</label>
      <input
        type="number"
        name="id_admin"
        value={formData.id_admin}
        onChange={handleChange}
        className="p-2 border bg-transparent bg-gray-100 rounded w-full"
        required
      />
    </div>

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

    <div>
      <label className="block text-lg font-semibold">Email</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        className="p-2 border bg-transparent bg-gray-100 rounded w-full"
        required
      />
    </div>

    <div>
      <label className="block text-lg font-semibold">Foto Profil</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="p-2 border bg-transparent rounded w-full"
        required
      />
    </div>

    <p>
      Sudah memiliki akun?{" "}
      <a href="/login" className="text-[#3B3B3B]">
        Login disini
      </a>
    </p>

    <button
      type="submit"
      className="bg-[#3B3B3B] text-white px-4 py-2 rounded mt-4"
    >
      Daftar
    </button>
  </form>

  {/* Pesan Error */}
  {message && <p className="mt-4 text-center text-red-500">{message}</p>}
</div>

  );
};

export default RegisterAdmin;
