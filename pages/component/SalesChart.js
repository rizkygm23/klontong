"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { supabase } from "../../lib/supabase";

// Import ApexCharts secara dinamis
const ApexCharts = dynamic(() => import("apexcharts"), { ssr: false });

const TransactionChart = () => {
  const [chartData, setChartData] = useState([]);
  const [categories, setCategories] = useState([]);

  // Fungsi untuk mengambil data transaksi dari Supabase
  const fetchTransactionData = async () => {
    try {
      const { data, error } = await supabase
        .from("transaksi")
        .select("waktu");

      if (error) {
        console.error("Error fetching transaction data:", error);
        return;
      }

      // Grupkan data berdasarkan tanggal
      const groupedData = data.reduce((acc, curr) => {
        const date = curr.waktu.slice(0, 10); // Ambil hanya tanggal (YYYY-MM-DD)
        acc[date] = (acc[date] || 0) + 1; // Hitung jumlah transaksi per tanggal
        return acc;
      }, {});

      // Format data untuk chart
      const formattedCategories = Object.keys(groupedData).sort(); // Urutkan berdasarkan tanggal
      const formattedData = formattedCategories.map((date) => groupedData[date]);

      setCategories(formattedCategories);
      setChartData(formattedData);
    } catch (err) {
      console.error("Unexpected error fetching transaction data:", err);
    }
  };

  // Panggil fetchTransactionData saat komponen pertama kali dimuat
  useEffect(() => {
    fetchTransactionData();
  }, []);

  // Render chart menggunakan ApexCharts
  useEffect(() => {
    if (typeof window !== "undefined" && chartData.length > 0 && categories.length > 0) {
      import("apexcharts").then((module) => {
        const ApexCharts = module.default;

        const options = {
          series: [
            {
              name: "Jumlah Transaksi",
              data: chartData,
              color: "#1A56DB",
            },
          ],
          chart: {
            type: "area",
            height: 350,
            fontFamily: "Inter, sans-serif",
          },
          xaxis: {
            categories: categories,
            labels: {
              style: {
                fontFamily: "Inter, sans-serif",
                cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400",
              },
            },
          },
          yaxis: {
            labels: {
              formatter: (value) => `${value} transaksi`,
              style: {
                fontFamily: "Inter, sans-serif",
                cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400",
              },
            },
          },
          tooltip: {
            enabled: true,
          },
          fill: {
            type: "gradient",
            gradient: {
              opacityFrom: 0.55,
              opacityTo: 0,
            },
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            curve: "smooth",
          },
          grid: {
            show: true,
          },
        };

        const chartElement = document.getElementById("transaction-chart");
        if (chartElement) {
          const chart = new ApexCharts(chartElement, options);
          chart.render();
        }
      });
    }
  }, [chartData, categories]);

  return (
    <div className="max-w-full w-full  bg-white rounded-lg shadow dark:bg-gray-800">
      <div className="p-4 md:p-6">
        <h2 className="text-md md:text-2xl font-bold text-gray-900 dark:text-white">
          Jumlah Transaksi Per Tanggal
        </h2>
        <p className=" text-sm md:text-base font-normal text-gray-500 dark:text-gray-400 mt-2">
          Total Transaksi:{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {chartData.reduce((acc, val) => acc + val, 0)} transaksi
          </span>
        </p>
      </div>
      <div id="transaction-chart" className="p-4"></div>
    </div>
  );
};

export default TransactionChart;
