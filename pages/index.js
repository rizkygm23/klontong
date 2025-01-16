import "../app/globals.css";
import { useRouter } from "next/router";
import Link from "next/link";
import FAQ from "./component/Faq";
import TestimonialCard from "./component/TestimonialCard";
import { testimonials } from "@/data/testimonialsData";
import { motion } from "framer-motion";
import { fadeIn } from "../animation/Fade";


const landingpages = () => {
  return (
    <div className=" w-full h-full bg-[#EEEEEE] grid grid-cols-1">
      <div id="nav" className="w-full h-fit px-2 md:px-24 z-50 sticky top-10">
        <nav className="flex items-center justify-between w-full h-fit bg-transparent backdrop-blur-sm border border-[#292929] py-2 md:py-4 rounded-full px-4 md:px-12">
          <div className="flex items-center bg-[#292929] p-2 rounded-full">
            <img src="/logo.png" alt="Logo" className="w-12 h-12 " />
          </div>
          <div className="grid grid-cols-2 gap-4 w-fit">
            <Link
              href="/login"
              className="px-5 py-2 border text-sm md:text-base border-[#292929] text-center rounded-lg hover:bg-[#292929] hover:text-white"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 text-sm md:text-base text-center rounded-lg bg-[#292929] hover:bg-[#292929] hover:text-white text-white"
            >
              Register
            </Link>
          </div>
        </nav>
      </div>
      <div
        id="Header"
        className="w-full top-52  grid grid-cols-1 md:grid-cols-2 pt-10 md:pt-24 px-2 md:px-24 h-fit"
      >
        <motion.div
          variants={fadeIn("down", 0.3)}
          initial={"hidden"}
          
          whileInView={"show"}
          viewport={{once:false, amount:0.1}}
          className="p-20 text-center md:text-left">
          <h1 className=" text-lg  md:text-3xl font-bold mb-4 text-[#292929]">
            Sistem Manajemen Warung Terintegrasi untuk Administrasi yang Lebih
            Baik
          </h1>
          <h2 className="text-[#292929]">
            Bikin Pengelolaan Warung Jadi Simpel dan Bebas Ribet!
          </h2>
        </motion.div>
        <motion.div
                  variants={fadeIn("up", 0.3)}
                  initial={"hidden"}
                  
                  whileInView={"show"}
                  viewport={{once:false, amount:0.1}}

         className="p-20">
          <img src="/img-header.png" alt="Logo" className="w-full" />
        </motion.div>
      </div>
      <motion.div
                variants={fadeIn("up", 0.3)}
                initial={"hidden"}
                
                whileInView={"show"}
                viewport={{once:false, amount:0.1}}
       id="Trusted" className="w-full  grid grid-cols-1 mt-9 h-fit px-24 text-center md:text-left">
        <h1 className=" text-lg md:text-2xl font-bold mb-4 text-[#292929] mx-auto">
          Dipercaya Oleh
        </h1>
        <h1 className=" text-xl md:text-6xl font-bold mb-4 text-[#292929] mx-auto">
          150+ <span className="text-sm">Pemilik Usaha</span>
        </h1>
        <h1 className=" text-sm md:text-md font-bold mb-4 text-[#292929] mx-auto">
          Tersebar di seluruh Indonesia
        </h1>
      </motion.div>
      <div
        id="feture"
        className="w-full grid grid-cols-1 md:grid-cols-2 mt-9 px-10 md:px-24 gap-10 h-fit"
      >
        <h1 className="text-2xl font-bold mb-4 text-[#292929] mx-auto mt-10 md:col-span-2">
          Fitur Kami
        </h1>
        <motion.div
                  variants={fadeIn("up", 0.3)}
                  initial={"hidden"}
                  
                  whileInView={"show"}
                  viewport={{once:false, amount:0.1}}
          id="card1"
          className="w-full h-full bg-[#FEFEFE] p-6 rounded-3xl shadow-lg"
        >
          <div className="w-fit bg-[#292929] p-5 rounded-full">
            <img src="/create-icon.png" alt="Logo" className="w-12 h-12 " />
          </div>

          <h1 className="text-xl font-bold mb-4 text-[#292929]  mt-5">
            Transaksi
          </h1>
          <h2 className="text-sm font-medium mb-4 text-[#292929] ">
            Catat dan kelola setiap transaksi dengan mudah dan cepat. Pantau
            arus kas warung Anda tanpa ribet!
          </h2>
        </motion.div>
        <motion.div
        variants={fadeIn("up", 0.3)}
        initial={"hidden"}
        
        whileInView={"show"}
        viewport={{once:false, amount:0.1}}
          id="card1"
          className="w-full h-full bg-[#292929] p-6 rounded-3xl shadow-lg"
        >
          <div className="w-fit bg-[#292929] p-5 rounded-full">
            <img src="/stat.png" alt="Logo" className="w-12 h-12 " />
          </div>

          <h1 className="text-xl font-bold mb-4 text-[#D5D5D5]  mt-5">
            Analysis
          </h1>
          <h2 className="text-sm font-medium mb-4 text-[#B0A7A7] ">
            Analisis sederhana untuk keputusan bisnis yang cerdas. Ketahui
            performa warung Anda
          </h2>
        </motion.div>
        <motion.div
        variants={fadeIn("up", 0.3)}
        initial={"hidden"}
        
        whileInView={"show"}
        viewport={{once:false, amount:0.1}}
          id="card1"
          className="w-full h-full bg-[#292929] p-6 rounded-3xl shadow-lg"
        >
          <div className="w-fit bg-[#292929] p-5 rounded-full">
            <img src="/manage-icon.png" alt="Logo" className="w-12 h-12 " />
          </div>

          <h1 className="text-xl font-bold mb-4 text-[#D5D5D5]  mt-5">
            Pengelolaan Barang
          </h1>
          <h2 className="text-sm font-medium mb-4 text-[#B0A7A7] ">
            Kelola barang warung dengan efisien: update stok, harga, dan nama
            barang hanya dengan beberapa klik.
          </h2>
        </motion.div>

        <motion.div
        variants={fadeIn("up", 0.3)}
        initial={"hidden"}
        
        whileInView={"show"}
        viewport={{once:false, amount:0.1}}
          id="card1"
          className="w-full h-full bg-[#FEFEFE] p-6 rounded-3xl shadow-lg"
        >
          <div className="w-fit bg-[#292929] p-5 rounded-full">
            <img src="/history-icon.png" alt="Logo" className="w-12 h-12 " />
          </div>

          <h1 className="text-xl font-bold mb-4 text-[#292929]  mt-5">
            Pencatatan Transaksi
          </h1>
          <h2 className="text-sm font-medium mb-4 text-[#292929] ">
            Tidak ada transaksi yang terlewat! Semua penjualan dan pembelian
            tercatat otomatis dan aman.
          </h2>
        </motion.div>
      </div>
      <div
        id="testi"
        className="w-full grid grid-cols-1 mt-9 h-fit px-10 md:px-24 gap-10"
      >
        <h1 className="text-2xl font-bold mb-4 text-[#292929] mx-auto">
          Testimoni
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 h-fit w-full ">
        {testimonials.map((testimonial) => (
          
        <TestimonialCard

          key={testimonial.id}
          name={testimonial.name}
          role={testimonial.role}
          image={testimonial.image}
          message={testimonial.message}
          delay={testimonial.id*0.1}
        />
      ))}


        </div>
      </div>
      <div id="faq" className="w-full px-10 md:px-24">
        <FAQ/>


      </div>
      <div id="faq" className="w-full px-24">
      <footer className=" bottom-0 bg-transparent text-neutral-content items-center p-4">
  <aside className=" grid grid-cols-1  items-center">


    <p className="mx-auto text-center text-sm md:text-lg text-[#292929]">Copyright © {new Date().getFullYear()} - All right reserved</p>
    
  </aside>
  {/* <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Tailwind Button
</button> */}

</footer>


      </div>
    </div>
  );
};

export default landingpages;
