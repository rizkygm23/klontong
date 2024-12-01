import { supabase } from "../lib/supabase";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import '../app/globals.css';

export default function History() {
  const router = useRouter();
  const { id } = router.query;
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    const { data, error } = await supabase
      .from("transaksi")
      .select("*")

      .order("waktu", { ascending: false });

    if (error) {
      console.error("Error fetching history:", error);
    } else {
      setHistory(data);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="px-5 md:px-24 py-7">
  {/* Header */}
  <div className="w-full h-fit flex flex-row items-center justify-between mb-6">
    <Link href="/login">
      <button className="bg-white w-fit p-4 rounded-md">
        <img src="/back-icon.png" className="h-[24px] w-[24px]" alt="Back" />
      </button>
    </Link>
    <Link href="/login">
      <button className="bg-white w-fit p-4 rounded-md">
        <img src="/profile-icon.png" className="h-[24px] w-[24px]" alt="Profile" />
      </button>
    </Link>
  </div>

  {/* Title */}
  <h1 className="text-3xl font-bold mb-6">History Transaksi</h1>

  {/* Table */}
  <div className="overflow-x-auto">
    <table className="min-w-full border border-gray-300 bg-white rounded-md shadow-md">
      <thead className="bg-gray-100">
        <tr>
          <th className="py-2 px-4 text-left border-b">ID Transaksi</th>
          <th className="py-2 px-4 text-left border-b">Waktu</th>
          <th className="py-2 px-4 text-left border-b">Total</th>
          <th className="py-2 px-4 text-left border-b">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {history.map((transaction) => (
          <tr key={transaction.id} className="bg-[#E1E1E1] hover:bg-[#c1bfbf]">
            <td className="py-4 px-4 border-b">{transaction.id_transaksi}</td>
            <td className="py-4 px-4 border-b">{transaction.waktu.slice(0, 10)}</td>
            <td className="py-4 px-4 border-b">Rp {transaction.total.toLocaleString()}</td>
            <td className=" px-4 border-b">
              <button
                onClick={() =>
                  router.push(`detail?id_transaksi=${transaction.id_transaksi}`)
                }
                className="text-blue-500 bg-slate-100 p-4 rounded-md w-full h-full"
              >
                <img src="/enter-icon.png" className="h-[12px] w-[12px] mx-auto" alt="Detail" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

  );
}
