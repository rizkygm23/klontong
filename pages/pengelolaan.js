import { supabase } from "../lib/supabase";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import "../app/globals.css";

export default function Pengelolaan() {
  const router = useRouter();
  const [barang, setBarang] = useState([]); // Data barang
  const [searchName, setSearchName] = useState(""); // Input pencarian nama barang
  const [sortConfig, setSortConfig] = useState({
    key: "nama",
    direction: "asc",
  }); // Sorting state
  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk popup
  const [modalType, setModalType] = useState(""); // Tipe modal (tambah, edit, hapus)
  const [itemData, setItemData] = useState({
    id_barang: null,
    nama: "",
    stock: 0,
    harga: 0,
  });
  // const [id, setId] = useState(null); // Data ba

  // Data barang untuk tambah/edit

  const { id } = router.query;

  // Fetch data barang
  const fetchBarang = async () => {
    try {
      let query = supabase
        .from("stock_barang")
        .select("*")
        .order("nama", { ascending: true });

      if (searchName) {
        query = query.ilike("nama", `%${searchName}%`); // Filter barang berdasarkan nama
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching barang:", error);
      } else {
        setBarang(data);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  useEffect(() => {
    fetchBarang();
  }, [searchName]);

  // Fungsi untuk mengatur sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Data yang sudah diurutkan berdasarkan konfigurasi
  const sortedBarang = [...barang].sort((a, b) => {
    if (sortConfig.key === "nama") {
      const nameA = a.nama.toLowerCase();
      const nameB = b.nama.toLowerCase();
      if (nameA < nameB) return sortConfig.direction === "asc" ? -1 : 1;
      if (nameA > nameB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    }
    if (sortConfig.key === "harga" || sortConfig.key === "stock") {
      return sortConfig.direction === "asc"
        ? a[sortConfig.key] - b[sortConfig.key]
        : b[sortConfig.key] - a[sortConfig.key];
    }
    return 0;
  });

  // Fungsi untuk menampilkan popup
  const handleModal = (type, item = null) => {
    setModalType(type);
    if (type === "tambah") {
      setItemData({  nama: "", stock: 0, harga: 0 });
    } else if (type === "edit" && item) {
      setItemData({
        id_barang: item.id_barang,
        nama: item.nama,
        stock: item.stock,
        harga: item.harga,
      });
    } else if (type === "hapus" && item) {
      setItemData({ id_barang: item.id_barang, nama: item.nama });
    }
    setIsModalOpen(true);
  };

  // Fungsi untuk menambahkan barang
  const handleAddBarang = async () => {

    if(itemData.stock === 0 || itemData.harga === 0 || itemData.nama === "") {
      alert("Nama, stock, dan harga harus diisi.");
      return;
    }
    
    try {
      const { error } = await supabase.from("stock_barang").insert([itemData]);

      

      if (error) {
        console.error("Error adding barang:", error);
        alert("Gagal menambahkan barang.");
      } else {
        alert("Barang berhasil ditambahkan.");
        fetchBarang(); // Refresh data barang
        setIsModalOpen(false); // Tutup modal
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Terjadi kesalahan saat menambahkan barang.");
    }
    if (!itemData.nama || itemData.stock === 0 || itemData.harga === 0) {
      alert("Nama, stock, dan harga harus diisi.");
      
      return;
      
    }else {

    }
    
  };

  // Fungsi untuk mengedit barang
  const handleEditBarang = async () => {
    if (!itemData.nama || itemData.stock === 0 || itemData.harga === 0) {
      alert("Nama, stock, dan harga harus diisi.");
      return
      
    }
    try {
      const { error } = await supabase
        .from("stock_barang")
        .update({
          nama: itemData.nama,
          stock: itemData.stock,
          harga: itemData.harga,
        })
        .eq("id_barang", itemData.id_barang);

      if (error) {
        console.error("Error editing barang:", error);
        alert("Gagal mengedit barang.");
      } else {
        alert("Barang berhasil diperbarui.");
        fetchBarang(); // Refresh data barang
        setIsModalOpen(false); // Tutup modal
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Terjadi kesalahan saat mengedit barang.");
    }
  };

  // Fungsi untuk menghapus barang
  const handleDeleteBarang = async () => {
    try {
      const { error } = await supabase
        .from("stock_barang")
        .delete()
        .eq("id_barang", itemData.id_barang);

      if (error) {
        console.error("Error deleting barang:", error);
        alert("Gagal menghapus barang.");
      } else {
        alert("Barang berhasil dihapus.");
        fetchBarang(); // Refresh data barang
        setIsModalOpen(false); // Tutup modal
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Terjadi kesalahan saat menghapus barang.");
    }
  };

  return (
    <div className="px-5 md:px-24 py-7">
      {/* Header */}
      <div className="w-full h-fit flex flex-row items-center justify-between mb-6">
        <Link href={`/dasboard?id=${id}`}>
          <button className="bg-white w-fit p-4 rounded-md">
            <img
              src="/back-icon.png"
              className="h-[24px] w-[24px]"
              alt="Back"
            />
          </button>
        </Link>
        <Link href="/login">
          <button className="bg-white w-fit p-4 rounded-md hidden disabaled">
            <img
              src="/profile-icon.png"
              className="h-[24px] w-[24px]"
              alt="Profile"
            />
          </button>
        </Link>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold mb-6">Pengelolaan Barang</h1>

      {/* Search and Add */}
      <div className="w-full h-[48px] flex flex-row items-center justify-between  rounded-md gap-4">
        {/* Input Search */}
        <form className="w-full h-full">
          <input
            type="text"
            placeholder="Cari barang..."
            className="bg-white w-full p-2 rounded-md h-full  shadow-sm px-3 hover:rounded-3xl active:border-none focus:outline-none  focus:bg-gray-100"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </form>

        <button
          onClick={() => handleModal("tambah")}
          className="bg-[#FFFFFF] text-white px-4 py-2 h-full rounded-md shadow-sm hover:rounded-3xl"
        >
          <img src="/plus-icon.png" className="h-[24px] w-[24px]" alt="Add" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full border border-gray-300 bg-white text-sm rounded-md shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th
                className="py-2 px-4 text-left border-b cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort("id_barang")}
              >
                ID
              </th>
              <th
                className="py-2 px-4 text-left border-b cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort("nama")}
              >
                Nama Barang
              </th>
              <th
                className="py-2 px-4 text-left border-b cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort("harga")}
              >
                Harga
              </th>
              <th
                className="py-2 px-4 text-left border-b cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort("stock")}
              >
                Stock
              </th>
              <th className="py-2 px-4 text-left border-b">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {sortedBarang.length > 0 ? (
              sortedBarang.map((item) => (
                <tr
                  key={item.id_barang}
                  className="bg-[#E1E1E1] hover:bg-[#c1bfbf]"
                >
                  <td className="py-4 px-4 w-fit break-words max-w-[150px] md:max-w-none">
                    {item.id_barang}
                  </td>
                  <td className="py-4 px-4 w-fit break-words max-w-[150px] md:max-w-none">
                    {item.nama}
                  </td>
                  <td className="py-4 px-4">
                    Rp {item.harga.toLocaleString()}
                  </td>
                  <td className="py-4 px-4">{item.stock}</td>
                  <td className="px-1 md:px-4 flex flex-wrap gap-2 mt-3">
                    <button
                      onClick={() => handleModal("edit", item)}
                      className="bg-yellow-500 text-white px-3 py-2 rounded-md"
                    >
                      <img
                        src="/edit-icon.png"
                        className="w-[12px]"
                        alt="Edit"
                      />
                    </button>
                    <button
                      onClick={() => handleModal("hapus", item)}
                      className="bg-red-500 text-white px-3 py-2 rounded-md"
                    >
                      <img
                        src="/delete-icon.png"
                        className="w-[12px]"
                        alt="Delete"
                      />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 px-4 text-center text-gray-500">
                  Tidak ada data barang.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Popup Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md max-w-md w-full">
            {modalType === "tambah" && (
              <h2 className="text-lg font-bold mb-4">Tambah Barang</h2>
            )}
            {modalType === "edit" && (
              <h2 className="text-lg font-bold mb-4">Edit Barang</h2>
            )}
            {modalType === "hapus" && (
              <>
                <h2 className="text-lg font-bold mb-4">Hapus Barang</h2>
                <p>Apakah Anda yakin ingin menghapus barang {itemData.nama}?</p>
              </>
            )}
            {modalType !== "hapus" && (
              <div className="flex flex-col gap-2">
                <label className="text-sm mt-1">ID Barang</label>
                <input 
                
                
                  type="text"
                  placeholder="Nama Barang"
                  className="p-2 border border-gray-300 rounded-md"
                  value={itemData.nama}
                  onChange={(e) =>
                    
                    setItemData({ ...itemData, nama: e.target.value })
                  }
                />
                <label className="text-sm mt-1">Stock</label>
                <input
                required
                  type="number"
                  placeholder="Stock"
                  className="p-2 border border-gray-300 rounded-md"
                  value={itemData.stock}
                  onChange={(e) =>
                    setItemData({
                      ...itemData,
                      stock: parseInt(e.target.value, 10),
                    })
                  }
                />
                <label className="text-sm mt-1">Harga</label>
                <input
                  type="number"
                  placeholder="Harga"
                  className="p-2 border border-gray-300 rounded-md"
                  value={itemData.harga}
                  onChange={(e) =>
                    setItemData({
                      ...itemData,
                      harga: parseInt(e.target.value, 10),
                    })
                  }
                />
              </div>
            )}
            <div className="flex gap-4 mt-4">
              {modalType === "tambah" && (
                <button
                  onClick={handleAddBarang}
                  className="bg-[#292929] text-white px-4 py-2 rounded-md"
                >
                  Tambah
                </button>
              )}
              {modalType === "edit" && (
                <button
                  onClick={handleEditBarang}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md"
                >
                  Simpan
                </button>
              )}
              {modalType === "hapus" && (
                <button
                  onClick={handleDeleteBarang}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Hapus
                </button>
              )}
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 px-4 py-2 rounded-md"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
