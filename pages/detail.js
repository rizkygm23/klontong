import { supabase } from "../lib/supabase";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import "../app/globals.css";

export default function DetailHistory() {
  const router = useRouter();
  const { id_transaksi, id } = router.query;

  const [transactionDetail, setTransactionDetail] = useState(null);
  const [adminName, setAdminName] = useState(""); // Nama admin
  const [totalBelanja, setTotalBelanja] = useState(0); // Total belanja

  // Fetch admin ID and name
  const fetchAdminName = async () => {
    try {
      const { data: transaksi, error: transaksiError } = await supabase
        .from("transaksi")
        .select("id_admin")
        .eq("id_transaksi", id_transaksi)
        .single();

      if (transaksiError) {
        console.error("Error fetching admin ID:", transaksiError);
        return;
      }

      const { data: admin, error: adminError } = await supabase
        .from("admin")
        .select("nama")
        .eq("id_admin", transaksi.id_admin)
        .single();

      if (adminError) {
        console.error("Error fetching admin name:", adminError);
        return;
      }

      setAdminName(admin.nama); // Simpan nama admin ke state
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  // Fetch transaction details
  const fetchTransactionDetail = async () => {
    try {
      const { data: transaksiDetail, error } = await supabase
        .from("transaksi_detail")
        .select("id_barang, qty, harga, total, stock_barang(nama)")
        .eq("id_transaksi", id_transaksi);

      if (error) {
        console.error("Error fetching transaction detail:", error);
        return;
      }

      const total = transaksiDetail.reduce((sum, item) => sum + item.total, 0);
      setTotalBelanja(total); // Hitung total belanja
      setTransactionDetail(transaksiDetail); // Simpan detail transaksi ke state
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  useEffect(() => {
    if (id_transaksi) {
      fetchTransactionDetail();
      fetchAdminName();
    }
  }, [id_transaksi]);

  if (!transactionDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="px-5 md:px-24 py-7">
        {/* Header */}
        <div className="w-full h-fit flex flex-row items-center justify-between mb-6">
          <Link href={`/?id=${id}`}>
            <button className="bg-white w-fit p-4 rounded-md">
              <img
                src="/back-icon.png"
                className="h-[24px] w-[24px]"
                alt="Back"
              />
            </button>
          </Link>
          <Link href="/login">
            <button className="bg-white w-fit p-4 rounded-md">
              <img
                src="/profile-icon.png"
                className="h-[24px] w-[24px]"
                alt="Profile"
              />
            </button>
          </Link>
        </div>
      </div>

      <div className="px-5 md:px-24 py-7 h-full bg-white mx-5 md:mx-24 rounded-md items-center">
        <h1 className="text-3xl font-bold mb-2">Detail History</h1>
        <h2 className="text-xl font-medium mb-2">
          Detail Transaksi ID: <span className="font-bold">{id_transaksi}</span>
        </h2>
        <div className="w-full p-6 md:p-48">
          <table className="w-full border-gray-300 text-sm">
            <thead>
              <tr>
                <th>ID Barang</th>
                <th>Nama</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {transactionDetail.map((item) => (
                <tr key={item.id_barang}>
                  <td className="p-2">{item.id_barang}</td>
                  <td className="line-clamp-1 p-2">{item.stock_barang.nama}</td>
                  <td className="p-2">{item.qty}</td>
                  <td className="p-2">{item.harga}</td>
                  <td className="p-2">{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h1 className="mt-9">Total Belanja: Rp <span className="font-bold">{totalBelanja.toLocaleString()}</span></h1>
          <h2>Nama Admin: {adminName || "Tidak Diketahui"}</h2>
        </div>
      </div>
    </div>
  );
}
