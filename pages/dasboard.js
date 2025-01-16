import Image from "next/image";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import TransactionChart from "./component/SalesChart";
import { motion } from "framer-motion";
import { fadeIn } from "../animation/Fade";
import Quagga from "quagga";

import "../app/globals.css";

export default function Home() {
  const router = useRouter();
  const { id } = router.query;
  const [products, setProducts] = useState([]);
  const [totalAssets, setTotalAssets] = useState(0);
  const [totalBarang, setTotalBarang] = useState(0);
  const [totalOrder, setTotalOrder] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [barcode, setBarcode] = useState(0); // Input barcode/ID Barang
  const [quantity, setQuantity] = useState(1); // Input quantity (default 1)
  const [orderItems, setOrderItems] = useState([]); // Data pesanan sementara

  const [todaySales, setTodaySales] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(10);
  const [totalTransactionsToday, setTotalTransactionsToday] = useState(0);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [error, setError] = useState("");
  const videoRef = useRef(null);
  const [admin, setAdmin] = useState(null); // State untuk data admin
  const [loading, setLoading] = useState(true);
  const [idAdmin, setIdAdmin] = useState(null);
  const [editProfile, setEditProfile] = useState({
    nama: "",
    username: "",
    email: "",
    img_url: "",
  });
  const startScanner = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        console.log("Camera stream started");
        videoRef.current.srcObject = stream; // Sambungkan stream kamera ke elemen video
        videoRef.current.play(); // Putar video
      })
      .catch((err) => {
        console.error("Error accessing camera:", err);
      });
    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: videoRef.current, // Target elemen video
          constraints: {

            facingMode: "environment", // Gunakan kamera belakang
          },
        },
        decoder: {
          readers: [
            "ean_reader", // Untuk EAN-13/EAN-8
            "code_128_reader", // Untuk CODE-128
            "upc_reader", // Untuk UPC
          ], // Tipe barcode yang didukung
        },
        locator: {
          // Mengatur ukuran pencarian kotak barcode
          patchSize: "medium",
          halfSample: true,
        },
        debug: {
          drawBoundingBox: true, // Menampilkan kotak pembatas
          showFrequency: true,   // Menampilkan frekuensi pemrosesan frame
          showSkeleton: true,    // Menampilkan skelett (kerangka) barcode
          showLabels: true,      // Menampilkan label deteksi di sekitar barcode
          boxColor: { border: "green", background: "rgba(0, 255, 0, 0.5)" }, // Warna kotak
          labelColor: { border: "green", background: "rgba(0, 255, 0, 0.7)" }, // Warna label
        },
      },
      (err) => {
        if (err) {
          console.error("Error initializing Quagga:", err);
          setError("Error initializing camera");
          return;
        }
        console.log("Camera initialized");
        Quagga.start();
      }
    );
  
    Quagga.onProcessed((result) => {
      if (result && result.boxes) {
        console.log("Processing frame...");
      }
    });
  
    Quagga.onDetected((data) => {
      console.log("Barcode detected:", data.codeResult.code);
      setBarcode(data.codeResult.code);
      Quagga.stop();
    });
  };
  
  const handleOpenProfileModal = () => {
    setEditProfile({
      nama: admin?.nama || "",
      username: admin?.username || "",
      email: admin?.email || "",
      img_url: admin?.img_url || "",
    });
    setIsProfileModalOpen(true);
  };
  const handleSaveProfile = async () => {
    try {
      const { error } = await supabase
        .from("admin")
        .update({
          nama: editProfile.nama,
          username: editProfile.username,
          email: editProfile.email,
          img_url: editProfile.img_url,
        })
        .eq("id_admin", id);

      if (error) {
        console.error("Error updating profile:", error);
        alert("Gagal menyimpan perubahan profil.");
        return;
      }

      alert("Profil berhasil diperbarui!");
      setIsProfileModalOpen(false);
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Terjadi kesalahan. Coba lagi nanti.");
    }
  };

  // const fetchProfile = async () => {

  //   const { id } = router.query;

  //   if (id) {
  //     setIdAdmin(id);
  //     fetchAdminData(id);
  //   }

  // }

  const updateTotalOrder = () => {
    setTotalOrder(
      orderItems.reduce(
        (sum, item) => sum + (item.harga || 0) * (item.quantity || 0),
        0
      )
    );
    console.log(totalOrder);
  };

  const fetchAdminData = async (idAdmin) => {
    try {
      const { data, error } = await supabase
        .from("admin")
        .select("nama, username,email, img_url")
        .eq("id_admin", idAdmin)
        .single();

      if (error) {
        console.error("Error fetching admin data:", error);
        setAdmin(null);
      } else {
        setAdmin(data);
        console.log("Data admin:", data); // Set data admin ke state
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setAdmin(null);
    } finally {
      if (id) {
        setLoading(false);
      } // Set loading selesai
    }
  };
  const removeItem = (id) => {
    const filteredItems = orderItems.filter((item) => item.id_barang != id);
    // return filteredItems;
    setOrderItems([...filteredItems]);
    // setOrderItems(filteredItems);
    // setTotalOrder(
    //   (prevTotal) => prevTotal + (item.harga || 0) * (quantity || 1)
    // );
    console.log(filteredItems);
  };
  // const removeItems = () => {
  //   setOrderItems([]);
  // };

  const fetchTodaySales = async () => {
    try {
      const today = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD
      const { data, error } = await supabase
        .from("transaksi")
        .select("total")
        .filter("waktu", "gte", `${today}T00:00:00`) // Awal hari ini
        .filter("waktu", "lt", `${today}T23:59:59`); // Akhir hari ini

      if (error) {
        console.error("Error fetching sales:", error);
        return 0; // Jika terjadi error, kembalikan 0
      }

      // Jumlahkan total transaksi

      setTotalTransactionsToday(data.length);
      const totalSales = data.reduce(
        (sum, transaksi) => sum + transaksi.total,
        0
      );
      return totalSales;
    } catch (err) {
      console.error("Unexpected error:", err);
      return 0;
    }
  };

  const fetchAllTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from("transaksi")
        .select("id_transaksi");

      if (error) {
        console.error("Error fetching sales:", error);
        return 0; // Jika terjadi error, kembalikan 0
      }

      // Jumlahkan total transaksi
      const totalss = data.length;
      return totalss;
    } catch (err) {
      console.error("Unexpected error:", err);
      return 0;
    }
  };
  const getAllTransactions = async () => {
    const transactions = await fetchAllTransactions();
    setTotalTransactions(transactions);
  };
  const getTodaySales = async () => {
    const sales = await fetchTodaySales();
    setTodaySales(sales);
  };

  const handleSaveTransaction = async () => {
    if (orderItems.length === 0) {
      alert("Tidak ada barang dalam pesanan.");
      return;
    }

    try {
      // 1. Hitung total transaksi
      const total = orderItems.reduce(
        (sum, item) => sum + (item.quantity || 0) * (item.harga || 0),
        0
      );

      // 2. Simpan data transaksi ke tabel transaksi
      const { data: transaksi, error: transaksiError } = await supabase
        .from("transaksi")
        .insert([{ waktu: new Date(), total, id_admin: id }]) // Admin ID 17230266
        .select();

      if (transaksiError) {
        console.error("Error inserting transaksi:", transaksiError);
        alert("Gagal menyimpan transaksi.");
        return;
      }

      // 3. Dapatkan id_transaksi dari transaksi yang baru dibuat
      const id_transaksi = transaksi[0].id_transaksi;

      for (const item of orderItems) {
        const { error: stockError } = await supabase
          .from("stock_barang")
          .update({ stock: item.stock - item.quantity })
          .eq("id_barang", item.id_barang);

        if (stockError) {
          console.error(
            `Error updating stock for item ${item.id_barang}`,
            stockError
          );
        }
      }

      // 4. Persiapkan data untuk transaksi_detail
      const detailData = orderItems.map((item) => ({
        id_transaksi,
        id_barang: item.id_barang,
        qty: item.quantity,
        harga: item.harga,
        total: item.quantity * item.harga,
      }));

      // 5. Simpan data ke tabel transaksi_detail
      const { error: detailError } = await supabase
        .from("transaksi_detail")
        .insert(detailData);

      if (detailError) {
        console.error("Error inserting transaksi_detail:", detailError);
        alert("Gagal menyimpan detail transaksi.");
        return;
      }

      // 6. Berhasil
      alert("Transaksi berhasil disimpan!");
      setOrderItems([]); // Reset pesanan sementara
      setTotalOrder(0); // Reset total transaksi
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Terjadi kesalahan. Coba lagi nanti.");
    }

    fetchAllTransactions();
    getAllTransactions();
    getTodaySales();
  };
  // Error handling

  const handleAddItem = () => {
    setError(""); // Reset error

    const trimmedBarcode = barcode.trim(); // Bersihkan input
    // Validasi barcode
    const foundItem = products.find((item) => item.id_barang == trimmedBarcode);

    if (!foundItem || foundItem.stock <= 0) {
      setError("ID Barang tidak valid.");
      return;
    }

    if (quantity > foundItem.stock) {
      setError("Quantity melebihi stok.");
      return;
    }

    // Tambahkan ke pesanan sementara
    const existingItem = orderItems.find(
      (item) => item.id_barang == trimmedBarcode
    );
    if (existingItem) {
      // Jika barang sudah ada, tambahkan quantity
      setOrderItems((prevItems) =>
        prevItems.map((item) =>
          item.id_barang == trimmedBarcode
            ? {
                ...item,
                quantity: (item.quantity || 0) + (quantity || 1),
              }
            : item
        )
      );
      setTotalOrder(
        (prevTotal) => prevTotal + (foundItem.harga || 0) * (quantity || 0)
      );
    } else {
      // Jika barang belum ada, tambahkan ke daftar
      setOrderItems((prevItems) => [
        ...prevItems,
        {
          ...foundItem,
          quantity: quantity || 1,
        },
      ]);
      setTotalOrder(
        (prevTotal) => prevTotal + (foundItem.harga || 0) * (quantity || 1)
      );
    }

    // Reset input
    setBarcode("");
    setQuantity(1);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(value);
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("stock_barang")
      .select("id_barang,nama, harga, stock");

    if (error) {
      console.error("Error fetching products:", error);
    } else {
      setProducts(data);
      const total = data.reduce(
        (sum, product) => sum + product.harga * product.stock,
        0
      );
      const totalBarang = data.length;
      setTotalBarang(totalBarang);
      setTotalAssets(total);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAdminData(id);
    } else {
      // fetchProfile();
      fetchAdminData(idAdmin);
      router.push("/login");
    }
    const getTodaySales = async () => {
      const sales = await fetchTodaySales();
      setTodaySales(sales);
    };
    // fetchProfile();
    updateTotalOrder();

    getTodaySales();
    fetchProducts();
    getAllTransactions();
    if (id) {
      fetchAdminData(id);
    } else {
      // fetchProfile();
      fetchAdminData(idAdmin);
      router.push("/login");
    }
  }, [id, orderItems, idAdmin]);

  return (
    <div className="w-full h-screen">
      <div className=" w-full h-fit py-7 px-5 md:px-24  flex flex-flex-row items-center justify-between">
        <div onClick={router.back}>
          <button className="bg-[#FFFFFF] hover:bg-slate-200 w-fit p-4  rounded-md">
            <img src="/back-icon.png" className="h-[24px] w-[24px]" alt="" />
          </button>
        </div>
        <div>
          <button
            onClick={handleOpenProfileModal}
            className="bg-[#FFFFFF] hover:bg-slate-200 w-fit p-4  rounded-md"
          >
            <img
              src="/profile-icon.png "
              className="h-[24px] w-[24px]"
              alt=""
            />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full h-fit px-5 md:px-20">
        <motion.div
          variants={fadeIn("up", 0.3)}
          initial={"hidden"}
          whileInView={"show"}
          viewport={{ once: false, amount: 0.1 }}
          className=" lg:grid grid-cols-1 h-fit gap-3 hidden w-full "
        >
          <div className="flex flex-row  items-center gap-4 p-3 rounded-xl   w-full">
            <img
              src={admin?.img_url}
              alt="Profile"
              className="w-14 h-w-14 rounded-full  "
            />
            <div className="grid grid-cols-1  ">
              <h1 className="text-xl font-bold text-[#3B3B3B]">
                {admin?.nama}
              </h1>
              <h2 className="text-sm text-gray-600">@{admin?.username}</h2>
              {/* <p className="text-sm text-gray-500">{admin?.email}</p> */}
            </div>
          </div>
          <div className="grid grid-cols-1 items-center  h-full p-3 rounded-xl  text-[#3B3B3B]  w-full">
            <h2 className="text-lg font-bold">Aset Toko:</h2>
            <h1 className="text-4xl font-bold">
              {formatCurrency(totalAssets)}
            </h1>
          </div>
        </motion.div>
        <div className=" grid grid-cols-1 h-fit gap-3 w-full  ">
          <motion.div
            variants={fadeIn("up", 0.4)}
            initial={"hidden"}
            whileInView={"show"}
            viewport={{ once: false, amount: 0.1 }}
            id="create-transaction"
            className="grid grid-cols-5  items-center   p-3 rounded-xl bg-white hover:bg-slate-200   w-full h-full"
          >
            <div className=" rounded-full hidden md:block p-4 w-full h-full bg-[#3B3B3B] col-span-1">
              <img
                src="/create-icon.png"
                alt="Profile"
                className="w-full h-full mx-auto my-auto "
              />
            </div>

            <div
              onClick={() => setIsModalOpen(true)}
              className="grid grid-cols-1 col-span-4 md:col-span-3 pl-2"
            >
              <h1 className=" text-md md:text-lg font-bold text-[#3B3B3B] line-clamp-1">
                Buat Transaksi
              </h1>
              <h2 className="text-xl md:text-2xl lg:text-3xl text-gray-600 font-bold overflow-hidden">
                {totalTransactionsToday}{" "}
                <span className="text-wrap font-light text-xs text-gray-500  ">
                  Today
                </span>
              </h2>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#EEEEEE] w-fit mx-auto p-2 left-0  rounded-full"
            >
              <img src="/enter-icon.png" className="h-3" alt="" />
            </button>
          </motion.div>
          <motion.div
            variants={fadeIn("up", 0.6)}
            initial={"hidden"}
            whileInView={"show"}
            viewport={{ once: false, amount: 0.1 }}
            id="manage-item"
            className="grid grid-cols-5  items-center   p-3 rounded-xl bg-white hover:bg-slate-200    w-full h-full"
          >
            <div className=" rounded-full hidden md:block p-4 w-full h-full bg-[#3B3B3B] col-span-1">
              <img
                src="/manage-icon.png"
                alt="Profile"
                className="w-full h-full mx-auto my-auto "
              />
            </div>

            <div
              onClick={() => router.push("/pengelolaan?id=" + id)}
              className="grid grid-cols-1 col-span-4 md:col-span-3 pl-2"
            >
              <h1 className=" text-md md:text-lg font-bold text-[#3B3B3B] line-clamp-1">
                Pengelolaan Barang
              </h1>
              <h2 className="text-xl md:text-2xl lg:text-3xl text-gray-600 font-bold overflow-hidden">
                {totalBarang}{" "}
                <span className="text-wrap font-light text-xs text-gray-500  ">
                  Item
                </span>
              </h2>
            </div>
            <button className="bg-[#EEEEEE] w-fit mx-auto p-2 left-0  rounded-full">
              <img src="/enter-icon.png" className="h-3" alt="" />
            </button>
          </motion.div>
        </div>
        <div className=" grid grid-cols-1 h-fit gap-3 w-full  ">
          <motion.div
            variants={fadeIn("up", 0.8)}
            initial={"hidden"}
            whileInView={"show"}
            viewport={{ once: false, amount: 0.1 }}
            id="sales-today"
            className="grid grid-cols-5  items-center   p-3 rounded-xl bg-white    w-full h-full"
          >
            <div className=" rounded-full hidden md:block p-4 w-full h-full bg-[#3B3B3B] col-span-1">
              <img
                src="/sales-today.png"
                alt="Profile"
                className="w-full h-full mx-auto my-auto "
              />
            </div>

            <div className="grid grid-cols-1 col-span-4 md:col-span-3 pl-2">
              <h1 className=" text-md md:text-lg font-bold text-[#3B3B3B] line-clamp-1">
                Sales Hari Ini
              </h1>
              <h2 className="text-xl md:text-2xl lg:text-3xl text-gray-600 font-bold overflow-hidden">
                {formatCurrency(todaySales)}
              </h2>
            </div>
            {/* <button className="bg-[#EEEEEE] w-fit mx-auto p-2 left-0  rounded-full">
            <img
              src="/enter-icon.png"
              className="h-3"
              alt=""
            />
          </button> */}
          </motion.div>
          <motion.div
            variants={fadeIn("up", 1)}
            initial={"hidden"}
            whileInView={"show"}
            viewport={{ once: false, amount: 0.1 }}
            id="history-transaction"
            onClick={() => router.push("/history?id=" + id)}
            className="grid grid-cols-5  items-center   p-3 rounded-xl bg-white  hover:bg-slate-200  w-full h-full"
          >
            <div className=" rounded-full hidden md:block p-4 w-full h-full bg-[#3B3B3B] col-span-1">
              <img
                src="/history-icon.png"
                alt="Profile"
                className="w-full h-full mx-auto my-auto "
              />
            </div>

            <div className="grid grid-cols-1 col-span-4 md:col-span-3 pl-2">
              <h1 className=" text-md md:text-lg font-bold text-[#3B3B3B] overflow-hidden line-clamp-1">
                Riwayat Transaksi
              </h1>
              <h2 className="text-xl md:text-2xl lg:text-3xl text-gray-600 font-bold overflow-hidden">
                {totalTransactions}{" "}
                <span className="text-wrap font-light text-xs text-gray-500  ">
                  Transaksi
                </span>
              </h2>
            </div>
            <button className="bg-[#EEEEEE] w-fit mx-auto p-2 left-0  rounded-full">
              <img src="/enter-icon.png" className="h-3" alt="" />
            </button>
          </motion.div>
        </div>
      </div>
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Edit Profil</h2>
            <div className="grid grid-cols-1 gap-4">
              <label>Nama</label>
              <input
                type="text"
                value={editProfile.nama}
                onChange={(e) =>
                  setEditProfile({
                    ...editProfile,
                    nama: e.target.value,
                  })
                }
                className="p-2 border border-gray-300 rounded"
              />
              <label>Username</label>
              <input
                type="text"
                value={editProfile.username}
                onChange={(e) =>
                  setEditProfile({
                    ...editProfile,
                    username: e.target.value,
                  })
                }
                className="p-2 border border-gray-300 rounded"
              />
              <label>Email</label>
              <input
                type="email"
                value={editProfile.email}
                onChange={(e) =>
                  setEditProfile({
                    ...editProfile,
                    email: e.target.value,
                  })
                }
                className="p-2 border border-gray-300 rounded"
              />
              <label>Foto Profil (URL)</label>
              <input
                type="text"
                value={editProfile.img_url}
                onChange={(e) =>
                  setEditProfile({
                    ...editProfile,
                    img_url: e.target.value,
                  })
                }
                className="p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="border border-[#3B3B3B] px-4 py-2 rounded"
              >
                Batal
              </button>
              <button
                onClick={handleSaveProfile}
                className="bg-[#3B3B3B] px-4 py-2 rounded text-slate-100"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      <motion.div
        variants={fadeIn("up", 1.2)}
        initial={"hidden"}
        whileInView={"show"}
        viewport={{ once: false, amount: 0.1 }}
        className="w-full  bg-slate-70 px-5 md:px-20 mt-6"
      >
        <TransactionChart />
      </motion.div>
      <script src="../path/to/flowbite/dist/flowbite.min.js"></script>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md mx-auto">
            <div className="grid grid-cols-6">
              <h2 className="text-xl font-bold col-span-5 my-auto ">
                Buat Transaksi
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className=" bg-slate-200 w-fit mx-auto text-white px-4 py-2 rounded"
              >
                <img src="/x-icon.png" className="h-5" alt=""></img>
              </button>
            </div>

            {/* Form Input */}
            <div className="grid grid-cols-1  gap-4">
              <label className="text-lg font-semibold">
                Barcode / ID Barang:
              </label>
              <div className="grid grid-cols-1 gap-2 h-96:">
              <input
                type="number"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="p-2 border border-gray-300 rounded"
                placeholder="Masukkan ID Barang"
              />
              <button
                onClick={startScanner}
                className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
              >
                Scan Barcode
              </button>
              <video className="w-full h-full max-h-32 object-cover" ref={videoRef} autoPlay />
              </div>
              
              <div className="border border-gray-300 rounded mt-2" />
              <label className="text-lg font-semibold">Quantity:</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="p-2 border border-gray-300 rounded"
                  min="1"
                />
                <button
                  onClick={handleAddItem}
                  className="bg-[#3B3B3B] text-white px-4 py-2 rounded"
                >
                  Add
                </button>
              </div>
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>

            {/* Pesanan Sementara */}
            <div className="mt-6 max-h-[300px] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Pesanan Sementara</h2>
              {orderItems.length === 0 ? (
                <p className="text-gray-500">Belum ada barang ditambahkan.</p>
              ) : (
                <ul className="space-y-4">
                  {orderItems.map((item) => (
                    <li
                      key={item.id_barang}
                      className="flex justify-between items-center gap-3 bg-gray-100 py-3 pr-3 pl-0 rounded shadow"
                    >
                      <button
                        onClick={() => {
                          removeItem(item.id_barang);
                          updateTotalOrder();
                        }}
                        className="bg-red-300 p-3 h-full rounded shadow"
                      >
                        <img src="/x-icon.png" className="h-3" alt="" />
                      </button>
                      <div className="w-full">
                        <h3 className="font-semibold text-md line-clamp-1">
                          {item.nama}
                        </h3>
                        <p className="text-gray-500">
                          {item.quantity || 0} x Rp.{" "}
                          {(item.harga || 0).toLocaleString()}
                        </p>
                      </div>
                      <p className="font-bold">
                        {formatCurrency(
                          (item.quantity || 0) * (item.harga || 0)
                        ).toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Tombol Close */}
            <h1 className="text-2xl font-bold mt-6">
              {formatCurrency(totalOrder)}
            </h1>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setOrderItems([]); // Mereset pesanan sementara
                  setTotalOrder(0); // Mengatur ulang total pesanan
                }}
                className="bg-red-500 text-white px-4 py-2 h-full rounded"
              >
                Reset Pesanan
              </button>
              <button
                onClick={handleSaveTransaction}
                className="bg-[#3B3B3B] text-white px-4 py-2 h-full rounded "
              >
                Buat Transaksi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export async function getServerSideProps(context) {
  const { id } = context.query;

  if (!id) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const { data: admin, error } = await supabase
    .from("admin")
    .select("nama, username, img_url")
    .eq("id_admin", id)
    .single();

  if (!admin || error) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      admin,
    },
  };
}
