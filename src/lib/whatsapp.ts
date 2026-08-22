export async function sendWhatsAppMessage(phone: string, message: string) {
  // Gunakan API Fonnte / Watzap / penyedia lain di Indonesia
  const API_KEY = process.env.WHATSAPP_API_KEY;
  
  if (!API_KEY) {
    console.warn("⚠️ WHATSAPP_API_KEY tidak dikonfigurasi. Mengabaikan pengiriman pesan ke:", phone);
    console.log("Isi Pesan:", message);
    return false;
  }

  // Contoh implementasi menggunakan Fonnte API (sangat populer di ID)
  try {
    const res = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        "Authorization": API_KEY,
      },
      body: new URLSearchParams({
        target: phone,
        message: message,
      })
    });

    const data = await res.json();
    if (data.status) {
      console.log("✅ Pesan WhatsApp terkirim ke:", phone);
      return true;
    } else {
      console.error("❌ Gagal mengirim WhatsApp:", data.reason);
      return false;
    }
  } catch (error) {
    console.error("❌ Error mengirim WhatsApp:", error);
    return false;
  }
}
