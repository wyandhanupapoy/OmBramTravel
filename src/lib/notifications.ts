import nodemailer from "nodemailer";

interface NotificationData {
  orderCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  tourName: string;
  date: string;
  paxInfo: string;
  totalIDR: string;
}

export async function sendEmailReceipt(data: NotificationData) {
  // Hanya jalankan jika environment variables tersedia
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    console.log("⚠️ SMTP tidak diatur. Melewati pengiriman Email ke:", data.customerEmail);
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // Menggunakan Gmail
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD, // App Password dari Google Account
      },
    });

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #123024; color: #ffffff; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; text-transform: uppercase;">Pembayaran Berhasil!</h1>
          <p style="margin: 5px 0 0; color: #F2A93C;">Om Bram City Tour Bandung</p>
        </div>
        <div style="padding: 20px; background-color: #FAFAFA;">
          <p>Halo <strong>${data.customerName}</strong>,</p>
          <p>Terima kasih telah memesan tur bersama Om Bram. Pembayaran Anda untuk pesanan <strong>${data.orderCode}</strong> telah kami terima.</p>
          
          <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 0; color: #64748b;">Tour</td>
              <td style="padding: 10px 0; text-align: right; font-weight: bold;">${data.tourName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 0; color: #64748b;">Tanggal</td>
              <td style="padding: 10px 0; text-align: right; font-weight: bold;">${data.date}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 0; color: #64748b;">Kapasitas</td>
              <td style="padding: 10px 0; text-align: right; font-weight: bold;">${data.paxInfo}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #64748b;">Total</td>
              <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #123024; font-size: 18px;">${data.totalIDR}</td>
            </tr>
          </table>

          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://om-bram-travel.vercel.app'}/id/track/${data.orderCode}" style="background-color: #123024; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Cek Pesanan & Live Tracking</a>
          </div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Om Bram Travel" <${process.env.SMTP_EMAIL}>`,
      to: data.customerEmail,
      subject: `E-Ticket: Om Bram Travel - ${data.orderCode}`,
      html: htmlContent,
    });

    return true;
  } catch (error) {
    console.error("Gagal mengirim email:", error);
    return false;
  }
}

export async function sendWhatsAppReceipt(data: NotificationData) {
  // Hanya jalankan jika API Token Fonnte tersedia
  if (!process.env.FONNTE_API_TOKEN) {
    console.log("⚠️ Fonnte API tidak diatur. Melewati pengiriman WhatsApp ke:", data.customerPhone);
    return false;
  }

  try {
    const trackingUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://om-bram-travel.vercel.app'}/id/track/${data.orderCode}`;
    
    const message = `*PEMBAYARAN BERHASIL - OM BRAM TRAVEL* 🎉\n\nHalo ${data.customerName},\nTerima kasih, pembayaran Anda untuk pesanan *${data.orderCode}* telah kami terima.\n\n*Detail Pesanan:*\nTour: ${data.tourName}\nTanggal: ${data.date}\nPax: ${data.paxInfo}\nTotal: ${data.totalIDR}\n\nPantau status driver dan titik kumpul Anda secara *Live* melalui tautan berikut pada hari-H:\n👉 ${trackingUrl}\n\nSalam Hangat,\n*Om Bram City Tour*`;

    const response = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        "Authorization": process.env.FONNTE_API_TOKEN,
      },
      body: new URLSearchParams({
        target: data.customerPhone,
        message: message,
        countryCode: "62", // Default to ID
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("Gagal mengirim WA:", error);
    return false;
  }
}

export async function sendAdminWhatsApp(data: NotificationData) {
  if (!process.env.FONNTE_API_TOKEN) return false;

  try {
    const adminPhone = "083870405395"; // Nomor Admin Sesuai Permintaan
    const message = `🔔 *PESANAN BARU MASUK!* 🔔\n\nPesanan *${data.orderCode}* baru saja LUNAS.\n\n*Pelanggan:* ${data.customerName} (${data.customerPhone})\n*Tour:* ${data.tourName}\n*Tgl:* ${data.date}\n*Total:* ${data.totalIDR}\n\nSilakan buka Dashboard Admin untuk Assign Driver:\n${process.env.NEXT_PUBLIC_BASE_URL || 'https://om-bram-travel.vercel.app'}/admin`;

    const response = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: { "Authorization": process.env.FONNTE_API_TOKEN },
      body: new URLSearchParams({ target: adminPhone, message: message, countryCode: "62" }),
    });
    return response.ok;
  } catch (err) {
    return false;
  }
}
