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
  locale: string;
  customerCountry: string;
}

const countryCallingCodes: Record<string, string> = {
  ID: "62", MY: "60", SG: "65", GB: "44", US: "1", CN: "86", JP: "81",
  KR: "82", TH: "66", IN: "91", SA: "966", AU: "61", OTHER: "62"
};

const copy: Record<string, { subject: string; title: string; hello: string; intro: string; tour: string; date: string; pax: string; total: string; tracking: string; signoff: string }> = {
  id: { subject: "Pembayaran berhasil", title: "Pembayaran Berhasil!", hello: "Halo", intro: "Terima kasih telah memesan tur bersama Om Bram. Pembayaran Anda untuk pesanan", tour: "Tour", date: "Tanggal", pax: "Kapasitas", total: "Total", tracking: "Cek Pesanan & Live Tracking", signoff: "Salam hangat" },
  en: { subject: "Payment successful", title: "Payment Successful!", hello: "Hello", intro: "Thank you for booking with Om Bram. Your payment for order", tour: "Tour", date: "Date", pax: "Passengers", total: "Total", tracking: "Check Order & Live Tracking", signoff: "Warm regards" },
  zh: { subject: "付款成功", title: "付款成功！", hello: "您好", intro: "感谢您预订 Om Bram 旅行。您的订单付款已收到", tour: "行程", date: "日期", pax: "人数", total: "总计", tracking: "查看订单和实时追踪", signoff: "诚挚问候" },
  ms: { subject: "Bayaran berjaya", title: "Bayaran Berjaya!", hello: "Salam", intro: "Terima kasih kerana menempah dengan Om Bram. Bayaran untuk pesanan", tour: "Lawatan", date: "Tarikh", pax: "Penumpang", total: "Jumlah", tracking: "Semak Pesanan & Penjejakan Langsung", signoff: "Salam mesra" },
  th: { subject: "ชำระเงินสำเร็จ", title: "ชำระเงินสำเร็จ!", hello: "สวัสดี", intro: "ขอบคุณที่จองทัวร์กับ Om Bram เราได้รับการชำระเงินสำหรับคำสั่งซื้อ", tour: "ทัวร์", date: "วันที่", pax: "ผู้โดยสาร", total: "ยอดรวม", tracking: "ตรวจสอบคำสั่งซื้อและติดตามสด", signoff: "ด้วยความเคารพ" },
  ta: { subject: "கட்டணம் வெற்றி", title: "கட்டணம் வெற்றி!", hello: "வணக்கம்", intro: "Om Bram உடன் முன்பதிவு செய்ததற்கு நன்றி. உங்கள் ஆர்டருக்கான கட்டணம் பெறப்பட்டது", tour: "சுற்றுலா", date: "தேதி", pax: "பயணிகள்", total: "மொத்தம்", tracking: "ஆர்டர் மற்றும் நேரடி கண்காணிப்பு", signoff: "அன்புடன்" },
  ja: { subject: "お支払い完了", title: "お支払い完了！", hello: "こんにちは", intro: "Om Bramをご予約いただきありがとうございます。ご注文のお支払いを受け付けました", tour: "ツアー", date: "日付", pax: "人数", total: "合計", tracking: "注文とライブ追跡を確認", signoff: "よろしくお願いいたします" },
  ko: { subject: "결제 완료", title: "결제가 완료되었습니다!", hello: "안녕하세요", intro: "Om Bram을 예약해 주셔서 감사합니다. 주문 결제가 확인되었습니다", tour: "투어", date: "날짜", pax: "인원", total: "총액", tracking: "주문 및 실시간 추적 확인", signoff: "감사합니다" },
  ar: { subject: "تم الدفع بنجاح", title: "تم الدفع بنجاح!", hello: "مرحباً", intro: "شكراً لحجز جولتك مع Om Bram. تم استلام دفعتك للطلب", tour: "الجولة", date: "التاريخ", pax: "المسافرون", total: "الإجمالي", tracking: "عرض الطلب والتتبع المباشر", signoff: "مع أطيب التحيات" }
};

function getCopy(locale: string) {
  return copy[locale] || copy.id;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character] || character));
}

export async function sendEmailReceipt(data: NotificationData) {
  // Hanya jalankan jika environment variables tersedia
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    console.log("⚠️ SMTP tidak diatur. Melewati pengiriman Email ke:", data.customerEmail);
    return false;
  }

  try {
    const text = getCopy(data.locale);
    const direction = data.locale === "ar" ? "rtl" : "ltr";
    const trackingUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://om-bram-travel.vercel.app'}/${data.locale}/track/${data.orderCode}`;
    const transporter = nodemailer.createTransport({
      service: "gmail", // Menggunakan Gmail
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD, // App Password dari Google Account
      },
    });

    const htmlContent = `
      <div dir="${direction}" style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #123024; color: #ffffff; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; text-transform: uppercase;">${text.title}</h1>
          <p style="margin: 5px 0 0; color: #F2A93C;">Om Bram City Tour Bandung</p>
        </div>
        <div style="padding: 20px; background-color: #FAFAFA;">
          <p>${text.hello} <strong>${escapeHtml(data.customerName)}</strong>,</p>
          <p>${text.intro} <strong>${data.orderCode}</strong>.</p>
          
          <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 0; color: #64748b;">${text.tour}</td>
              <td style="padding: 10px 0; text-align: right; font-weight: bold;">${escapeHtml(data.tourName)}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 0; color: #64748b;">${text.date}</td>
              <td style="padding: 10px 0; text-align: right; font-weight: bold;">${data.date}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 0; color: #64748b;">${text.pax}</td>
              <td style="padding: 10px 0; text-align: right; font-weight: bold;">${data.paxInfo}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #64748b;">${text.total}</td>
              <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #123024; font-size: 18px;">${data.totalIDR}</td>
            </tr>
          </table>

          <div style="text-align: center; margin-top: 30px;">
            <a href="${trackingUrl}" style="background-color: #123024; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">${text.tracking}</a>
          </div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Om Bram Travel" <${process.env.SMTP_EMAIL}>`,
      to: data.customerEmail,
      subject: `${text.subject}: Om Bram Travel - ${data.orderCode}`,
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
    const text = getCopy(data.locale);
    const trackingUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://om-bram-travel.vercel.app'}/${data.locale}/track/${data.orderCode}`;
    const message = `*${text.title} - OM BRAM TRAVEL*\n\n${text.hello} ${data.customerName},\n${text.intro} *${data.orderCode}*.\n\n*${text.tour}:* ${data.tourName}\n*${text.date}:* ${data.date}\n*${text.pax}:* ${data.paxInfo}\n*${text.total}:* ${data.totalIDR}\n\n${text.tracking}:\n👉 ${trackingUrl}\n\n${text.signoff},\n*Om Bram City Tour*`;

    const response = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        "Authorization": process.env.FONNTE_API_TOKEN,
      },
      body: new URLSearchParams({
        target: data.customerPhone,
        message: message,
        countryCode: countryCallingCodes[data.customerCountry] || "62",
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
