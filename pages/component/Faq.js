// src/FAQ.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '../../animation/Fade';





const DetailItem = ({ question, answer }) => (
  <motion.details
  variants={fadeIn("up", 0.2)}
              initial={"hidden"}
              
              whileInView={"show"}
              viewport={{once:false, amount:0.1}}
  className="group [&_summary::-webkit-details-marker]:hidden">
    <summary
      className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg bg-white dark:bg-[#12122B] p-4 hover:bg-gray-50 text-gray-900 dark:text-slate-100"
    >
      <h2 className="font-medium">{question}</h2>

      <svg
        className="size-5 shrink-0 transition duration-300 group-open:-rotate-180"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </summary>

    <p className="mt-4 px-4 leading-relaxed text-gray-700 dark:text-[#c0c0c0]">{answer}</p>
  </motion.details>
);

const FAQ = () => (
  <section id="faq" className="pt-36 font-sans text-sm md:text-base  w-full mx-auto pb-96 ">
    <div className="space-y-4 ">
      <DetailItem 
        question="Apa tujuan dari Aplikasi  ini?"
        answer="Aplikasi ini bertujuan untuk membantu pemilik warung kelontong mengelola stok barang, transaksi, dan laporan keuangan dengan lebih efisien menggunakan sistem berbasis web."
      />
      <DetailItem 
        question="Bagaimana cara mencatat stok barang?"
        answer="Admin dapat menambahkan data barang, termasuk nama, kategori, harga, dan jumlah stok awal."
      />
      <DetailItem 
        question="Apakah sistem ini dapat mencatat transaksi penjualan?"
        answer="Ya, semua transaksi penjualan dicatat secara otomatis. Saat barang dijual, stok barang akan berkurang sesuai jumlah yang terjual, dan transaksi dicatat dalam menu transaksi."
      />
      <DetailItem 
        question=" Apa keuntungan menggunakan sistem ini?"
        answer="Efisiensi: Mengurangi waktu yang diperlukan untuk mencatat stok dan transaksi secara manual.
"
      />
    </div>
  </section>
);

export default FAQ;