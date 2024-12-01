import { supabase } from "../lib/supabase";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function DetailHistory() {
  const router = useRouter();
  const { id_transaksi } = router.query;
  const [transactionDetail, setTransactionDetail] = useState(null);

  const fetchTransactionDetail = async () => {
    const { data, error } = await supabase
      .from("transaksi_detail")
      .select("*")
      .eq("id_transaksi", id_transaksi);

    if (error) {
      console.error("Error fetching transaction detail:", error);
    } else {
      const itemsWithNames = await Promise.all(
        data.map(async (item) => {
          const { data: barang, error: barangError } = await supabase
            .from("stock_barang")
            .select("nama")
            .eq("id_barang", item.id_barang)
            .single();

          if (barangError) {
            console.error("Error fetching item name:", barangError);
            return { ...item, nama: "Unknown" };
          }

          return { ...item, nama: barang.nama };
        })
      );

      setTransactionDetail(itemsWithNames);
    }
  };

  useEffect(() => {
    if (id_transaksi) {
      fetchTransactionDetail();
    }
  }, [id_transaksi]);

  if (!transactionDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Detail History</h1>
      <h2>Detail Transaksi</h2>
      <ul>
        {transactionDetail.map((item) => (
          <li key={item.id_barang}>
            <p>ID Barang: {item.id_barang}</p>
            <p>Nama Barang: {item.nama}</p>
            <p>Quantity: {item.qty}</p>
            <p>Harga: {item.harga}</p>
            <p>Total: {item.total}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
