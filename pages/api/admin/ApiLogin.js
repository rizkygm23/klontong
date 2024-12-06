import bcrypt from "bcryptjs";
import { supabase } from "../../../lib/supabase";


export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username dan password wajib diisi." });
    }

    try {
      
      const { data: admin, error } = await supabase
        .from("admin")
        .select("id_admin, password") 
        .eq("username", username)
        .single();

      if (error || !admin) {
        return res.status(401).json({ message: "Username atau password salah." });
      }

      
      const isPasswordValid = await bcrypt.compare(password, admin.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Username atau password salah." });
      }

      
      return res.status(200).json({ id_admin: admin.id_admin });
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
  } else {
    return res.status(405).json({ message: "Metode tidak diizinkan." });
  }
}
