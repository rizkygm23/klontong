import bcrypt from "bcryptjs";
import { supabase } from "../../../lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { nama,id_admin, username, password, email, img_url } = req.body;

  // Validasi input
  if (!nama || !username || !password || !email || !img_url) {
    return res.status(400).json({ error: "Semua field harus diisi." });
  }

  try {
    // Enkripsi password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Simpan data ke Supabase
    const { error } = await supabase.from("admin").insert({
      id_admin,
      nama,
      username,
      password: hashedPassword,
      email,
      img_url,
    });
    

    if (error) {
      console.error("Supabase Error:", error);
      return res.status(500).json({ error: "Gagal menyimpan admin." });
    }

    res.status(201).json({ message: "Admin berhasil terdaftar." });
  } catch (err) {
    console.error("Unexpected Error:", err);
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
}
