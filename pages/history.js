import { supabase } from "../lib/supabase";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import "../app/globals.css";

export default function History() {

  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [filterDate, setFilterDate] = useState("all"); // Filter rentang waktu
  const [searchId, setSearchId] = useState(""); // Input pencarian ID transaksi
  const [sortConfig, setSortConfig] = useState({ key: "waktu", direction: "desc" }); // Sorting state
  const { id } = router.query;
  const fetchHistory = async () => {
    try {
      let query = supabase.from("transaksi").select("*");

      // Filter berdasarkan waktu
      const now = new Date();
      if (filterDate === "24h") {
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        query = query.gte("waktu", yesterday.toISOString());
      } else if (filterDate === "7d") {
        const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        query = query.gte("waktu", lastWeek.toISOString());
      } else if (filterDate === "30d") {
        const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        query = query.gte("waktu", lastMonth.toISOString());
      }

      // Filter berdasarkan ID transaksi
      if (searchId) {
        query = query.eq("id_transaksi", searchId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching history:", error);
      } else {
        setHistory(data);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [filterDate, searchId]);

  // Fungsi untuk mengatur sorting berdasarkan kolom
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Data yang sudah diurutkan berdasarkan konfigurasi
  const sortedHistory = [...history].sort((a, b) => {
    console.log(a[sortConfig.key]);
    console.log(b[sortConfig.key]);
    if (sortConfig.key === "total" || sortConfig.key === "id_transaksi") {
      const valueA = parseFloat(a[sortConfig.key]);
      console.log(valueA);
      
      const valueB = parseFloat(b[sortConfig.key]);
      console.log(valueB);
      
      return sortConfig.direction === "asc" ? valueA - valueB : valueB - valueA;
    }
    if (sortConfig.key === "waktu") {
      const dateA = new Date(a.waktu);
      const dateB = new Date(b.waktu);
      return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
    }
    return 0;
  });

  const handleSearch = (e) => {
    e.preventDefault();
    fetchHistory();
  };

  return (
    <div className="px-5 md:px-24 py-7">
      {/* Header */}
      <div className="w-full h-fit flex flex-row items-center justify-between mb-6">
        <Link href={`/?id=${id}`}>
          <button className="bg-white w-fit p-4 rounded-md">
            <img src="/back-icon.png" className="h-[24px] w-[24px]" alt="Back" />
          </button>
        </Link>
        {/* <Link href="/login">
          <button className="bg-white w-fit p-4 rounded-md">
            <img src="/profile-icon.png" className="h-[24px] w-[24px]" alt="Profile" />
          </button>
        </Link> */}
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold mb-6">History Transaksi</h1>

      {/* Filter dan Search */}
      <div className="w-full  h-fit flex flex-row items-center justify-between py-4 rounded-md gap-4">
        {/* Dropdown Filter */}
        <select
          id="filterDate"
          className="bg-white py-2 px-4 rounded-md active:border-none border border-[#999999]"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        >
          <option value="all">Semua</option>
          <option value="24h">24 Jam</option>
          <option value="7d">7 Hari</option>
          <option value="30d">30 Hari</option>
        </select>

        {/* Input Search */}
        <form
          id="search"
          className="flex flex-row items-center gap-4 w-full h-fit border border-[#999999] rounded-md "
          onSubmit={handleSearch}
        >
          <input
            type="text"
            placeholder="Cari transaksi..."
            className="bg-white w-full p-2 rounded-md h-full"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />

        </form>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full border border-gray-300 bg-white rounded-md shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th
                className="py-2 px-4 text-left border-b cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort("id_transaksi")}
              >
                ID Transaksi
              </th>
              <th
                className="py-2 px-4 text-left border-b cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort("waktu")}
              >
                Waktu
              </th>
              <th
                className="py-2 px-4 text-left border-b cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort("total")}
              >
                Total
              </th>
              <th className="py-2 px-4 text-left border-b">Detail</th>
            </tr>
          </thead>
          <tbody>
            {sortedHistory.length > 0 ? (
              sortedHistory.map((transaction) => (
                <tr key={transaction.id_transaksi} className="bg-[#E1E1E1] hover:bg-[#c1bfbf]">
                  <td className="py-4 px-4 border-b">{transaction.id_transaksi}</td>
                  <td className="py-4 px-4 border-b">{transaction.waktu.slice(0, 10)}</td>
                  <td className="py-4 px-4 border-b">Rp {transaction.total.toLocaleString()}</td>
                  <td className="px-4 border-b">
                    <button
                      onClick={() =>
                        router.push(`detail?id_transaksi=${transaction.id_transaksi}&id=${id}`)
                      }
                      className="text-blue-500 bg-slate-100 p-4 rounded-md w-full h-full hover:bg-slate-200"
                    >
                      <img
                        src="/enter-icon.png"
                        className="h-[12px] w-[12px] mx-auto"
                        alt="Detail"
                      />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 px-4 text-center text-gray-500">
                  Tidak ada data transaksi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
