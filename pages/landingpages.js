import '../app/globals.css'
import { useRouter } from "next/router";
import Link from 'next/link';


const landingpages = () => {
    return (
        <div className=" w-full h-full bg-[#EEEEEE] grid grid-cols-1">
            <div id="nav" className="w-full h-fit px-24 sticky top-10">
                <nav className="flex items-center justify-between w-full h-fit bg-[#E3E3E8] p-6 rounded-full px-12">
                    <div className="flex items-center">
                    <img src="/logo.png" alt="Logo" className="w-12 h-12 " />
                    </div>
                    <div className='grid grid-cols-2 gap-4 w-fit'>
                        <Link href="/" className="px-5 py-2 border border-[#292929] text-center rounded-lg hover:bg-[#292929] hover:text-white">
                            Login
                        </Link>
                        <Link href="/register" className="px-5 py-2 text-center rounded-lg bg-[#292929] hover:bg-[#292929] hover:text-white text-white">
                            Register
                        </Link>
                    </div>

                        
                </nav>
                    
            </div>
            <div id='Header' className='w-full top-52  grid grid-cols-2 pt-24 px-24 h-fit'>
                <div className='p-20'>
                    <h1 className='text-3xl font-bold mb-4 text-[#292929]'>Sistem Manajemen Warung Terintegrasi untuk Administrasi yang Lebih Baik</h1>
                    <h2 className='text-[#292929]'>Bikin Pengelolaan Warung Jadi Simpel dan Bebas Ribet!</h2>
                </div>
                <div className='p-20'>
                    <img src="/img-header.png" alt="Logo" className="w-full" />
                </div>
                

            </div>
            <div id='Trusted' className='w-full  grid grid-cols-1 mt-9 h-fit px-24'>
                <h1 className='text-2xl font-bold mb-4 text-[#292929] mx-auto'>Dipercaya Oleh</h1>
                <h1 className='text-6xl font-bold mb-4 text-[#292929] mx-auto'>150+ <span className='text-sm'>Pemilik Usaha</span></h1>
                <h1 className='text-md font-bold mb-4 text-[#292929] mx-auto'>Tersebar di seluruh Indonesia</h1>

            </div>
            <div id='feture' className='w-full grid grid-cols-2 mt-9 px-24 gap-10 h-fit'>
            <h1 className='text-2xl font-bold mb-4 text-[#292929] mx-auto mt-10 col-span-2'>Fitur Kami</h1>
                <div id='card1' className='w-full h-fit bg-[#FEFEFE] p-6 rounded-lg shadow-lg'>
                    <div className='w-fit bg-[#292929] p-5 rounded-full'>
                    <img src="/create-icon.png" alt="Logo" className="w-12 h-12 " />
                    </div>
                    
                    <h1 className='text-xl font-bold mb-4 text-[#292929]  mt-5'>Transaksi</h1>
                    <h2 className='text-sm font-medium mb-4 text-[#292929] '>Catat dan kelola setiap transaksi dengan mudah dan cepat. Pantau arus kas warung Anda tanpa ribet!</h2>
                </div>
                <div id='card1' className='w-full h-fit bg-[#292929] p-6 rounded-lg shadow-lg'>
                    <div className='w-fit bg-[#292929] p-5 rounded-full'>
                    <img src="/stat.png" alt="Logo" className="w-12 h-12 " />
                    </div>
                    
                    <h1 className='text-xl font-bold mb-4 text-[#D5D5D5]  mt-5'>Analitik</h1>
                    <h2 className='text-sm font-medium mb-4 text-[#B0A7A7] '>Analitik sederhana untuk keputusan bisnis yang cerdas. Ketahui performa warung Anda</h2>
                </div>
                <div id='card1' className='w-full h-fit bg-[#292929] p-6 rounded-lg shadow-lg'>
                    <div className='w-fit bg-[#292929] p-5 rounded-full'>
                    <img src="/manage-icon.png" alt="Logo" className="w-12 h-12 " />
                    </div>
                    
                    <h1 className='text-xl font-bold mb-4 text-[#D5D5D5]  mt-5'>Pengelolaan Barang</h1>
                    <h2 className='text-sm font-medium mb-4 text-[#B0A7A7] '>Kelola barang warung dengan efisien: update stok, harga, dan nama barang hanya dengan beberapa klik.</h2>
                </div>
                
                <div id='card1' className='w-full h-fit bg-[#FEFEFE] p-6 rounded-lg shadow-lg'>
                    <div className='w-fit bg-[#292929] p-5 rounded-full'>
                    <img src="/history-icon.png" alt="Logo" className="w-12 h-12 " />
                    </div>
                    
                    <h1 className='text-xl font-bold mb-4 text-[#292929]  mt-5'>Pencatatan Transaksi</h1>
                    <h2 className='text-sm font-medium mb-4 text-[#292929] '>Tidak ada transaksi yang terlewat! Semua penjualan dan pembelian tercatat otomatis dan aman.</h2>
                </div>
                

            </div>

        </div>
    )
}

export default landingpages;


