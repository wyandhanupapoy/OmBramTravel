/* ============================================================
   OM BRAM — Internationalization (i18n) Engine
   assets/i18n.js
   ============================================================ */

const OMBRAM_TRANSLATIONS = {
  id: {
    // Nav
    nav_home: "Beranda",
    nav_routes: "Rute",
    nav_fleet: "Armada",
    nav_how: "Cara Kerja",
    nav_testimonials: "Testimoni",
    nav_admin: "Portal Admin",
    btn_book_now: "Pesan Sekarang",

    // Hero
    hero_eyebrow: "Pelacakan Langsung · Jawa & Bali",
    hero_h1: 'Tur, sewa mobil, dan jemput bandara — semua bisa kamu <em>pantau</em>.',
    hero_sub: "Pilih layanan, kami tugaskan driver dan armada yang sesuai — lalu kamu bisa lihat posisinya secara langsung dari halaman pesanan.",
    hero_cta1: "Lihat Semua Rute",
    hero_cta2: "Cara Kerja Om Bram",

    // Trust bar
    trust1_label: "Perjalanan Selesai",
    trust2_label: "Mitra Driver Aktif",
    trust3_label: "Tepat Waktu Jemput",
    trust4_label: "Pelacakan Langsung",

    // Services
    services_eyebrow: "Layanan Kami",
    services_h2: "Satu platform, tiga cara bepergian.",
    services_p: "Pilih layanan yang sesuai dengan rencanamu — semuanya lewat proses dispatch dan pelacakan yang sama.",
    svc_tour_name: "Tour & Travel",
    svc_tour_desc: "Paket wisata sehari dengan titik singgah, driver, dan armada yang sudah jelas sejak awal.",
    svc_rental_name: "Peminjaman Mobil",
    svc_rental_desc: "Sewa harian dengan atau tanpa driver, untuk kebutuhan bisnis maupun keluarga.",
    svc_airport_name: "Jemput di Bandara",
    svc_airport_desc: "Penjemputan dan pengantaran bandara terjadwal, driver menunggu di titik yang disepakati.",

    // Cara Kerja
    cara_eyebrow: "Cara Kerja",
    cara_h2: "Tiga langkah dari pesan sampai pulang.",
    cara_p: "Setiap layanan dijalankan lewat proses dispatch yang sama — jadi kamu tahu persis apa yang terjadi di tiap tahap.",
    step1_title: "Pilih layanan & jadwal",
    step1_desc: "Telusuri tur, mobil sewa, atau jadwal jemput bandara — detail armada dan harga sudah jelas sejak halaman pertama.",
    step2_title: "Driver & armada ditugaskan",
    step2_desc: "Dispatcher kami mencocokkan pesananmu dengan driver dan kendaraan yang tersedia, lalu mengonfirmasi ke kamu.",
    step3_title: "Pantau perjalanan langsung",
    step3_desc: "Lihat posisi kendaraan secara langsung dari halaman pesanan, dari titik jemput sampai kamu diantar pulang.",

    // Tours / Listings
    tur_eyebrow: "Rute Pilihan",
    tur_h2: "Layanan yang paling sering dipesan bulan ini.",
    tur_p: "Semua sudah termasuk driver berpengalaman dan armada ber-AC. Detail rute dan jam berangkat tertera jelas.",

    // Feature
    feature_eyebrow: "Kenapa Om Bram",
    feature_h2: "Setiap kilometer tercatat, bukan sekadar estimasi.",
    feature_p: "Dispatcher menugaskan driver dan armada di belakang layar — dan semua pergerakan itu kamu bisa lihat sendiri, langsung dari halaman pesanan.",
    check1_title: "Posisi diperbarui tiap beberapa detik",
    check1_desc: "Selama tur berlangsung, lokasi kendaraan terus diperbarui secara langsung.",
    check2_title: "Penugasan otomatis setelah bayar",
    check2_desc: "Driver dan armada dikonfirmasi begitu pembayaran kamu terverifikasi.",
    check3_title: "Riwayat rute tersimpan",
    check3_desc: "Setiap tur punya catatan rute lengkap — enak buat evaluasi maupun keperluan klaim.",

    // Fleet
    armada_eyebrow: "Armada",
    armada_h2: "Kendaraan disesuaikan dengan jumlah rombongan.",
    armada_p: "Semua armada diperiksa berkala dan dikemudikan driver yang sudah terverifikasi.",

    // Testimonials
    testi_eyebrow: "Testimoni",
    testi_h2: "Yang dibilang penumpang soal Om Bram.",

    // Promo
    promo_h2: "Diskon Rp100rb untuk pesanan pertamamu.",
    promo_btn: "Salin Kode",

    // Footer
    footer_tagline: "Om Bram menghubungkan kamu dengan tur berpemandu, sewa mobil, dan jemput bandara.",
    footer_col_product: "PRODUK",
    footer_col_company: "PERUSAHAAN",
    footer_col_help: "BANTUAN",
    footer_link_routes: "Rute",
    footer_link_fleet: "Armada",
    footer_link_how: "Cara Kerja",
    footer_link_about: "Tentang Kami",
    footer_link_careers: "Karier",
    footer_link_partner: "Mitra Driver",
    footer_link_help: "Pusat Bantuan",
    footer_link_terms: "Syarat & Ketentuan",
    footer_notice1: "© 2026 OM BRAM — MOCKUP DESAIN, BUKAN LAYANAN AKTIF",
    footer_notice2: "DIBUAT UNTUK PRATINJAU PRD TRAVEL DISPATCH SYSTEM",

    // Rute page
    rute_eyebrow: "Semua Rute",
    rute_h2: "Cari tur, mobil sewa, atau jadwal bandara.",
    rute_p: "Gunakan filter di bawah untuk mempersempit pilihan sesuai layanan yang kamu butuhkan.",
    filter_all: "Semua",
    filter_tour: "Tur & Travel",
    filter_rental: "Sewa Mobil",
    filter_airport: "Jemput Bandara",

    // Pesan page
    pesan_eyebrow: "Pemesanan",
    pesan_h1: "Selesaikan pesananmu",
    step_a: "Detail Perjalanan",
    step_b: "Data Pemesan",
    step_c: "Pembayaran",
    field_date: "Tanggal",
    field_pax: "Jumlah Penumpang",
    field_pickup: "Titik Jemput",
    field_name: "Nama Lengkap",
    field_phone: "Nomor WhatsApp",
    field_email: "Email",
    field_notes: "Catatan Tambahan (opsional)",
    btn_continue: "Lanjutkan",
    btn_back: "Kembali",
    btn_pay: "Bayar Sekarang",
    order_summary: "Ringkasan Pesanan",
    subtotal: "Subtotal",
    discount: "Diskon",
    total: "Total",
    pay_bank: "Transfer Bank",
    pay_qris: "QRIS",
    pay_card: "Kartu Kredit/Debit",
    pay_ewallet: "E-Wallet",

    // Lacak page
    lacak_eyebrow: "Pelacakan Langsung",
    lacak_h1: "Perjalananmu sedang berlangsung",
    lacak_driver: "Driver",
    lacak_vehicle: "Armada",
    lacak_eta: "Estimasi Tiba",
    lacak_timeline: "Linimasa Perjalanan",
    lacak_share: "Bagikan Perjalanan",

    // Admin page
    adm_overview: "Ringkasan",
    adm_queue: "Antrian Pesanan",
    adm_fleet: "Armada",
    adm_drivers: "Driver",
    adm_analytics: "Analitik",
    adm_settings: "Pengaturan",
    adm_today_orders: "Pesanan Hari Ini",
    adm_revenue: "Pendapatan (Bulan Ini)",
    adm_active_fleet: "Armada Aktif",
    adm_online_drivers: "Driver Online",
    adm_table_id: "ID Pesanan",
    adm_table_customer: "Pelanggan",
    adm_table_service: "Layanan",
    adm_table_date: "Tanggal",
    adm_table_status: "Status",
    adm_table_assign: "Tugaskan",
  },

  en: {
    nav_home: "Home",
    nav_routes: "Routes",
    nav_fleet: "Fleet",
    nav_how: "How It Works",
    nav_testimonials: "Testimonials",
    nav_admin: "Admin Portal",
    btn_book_now: "Book Now",

    hero_eyebrow: "Live Tracking · Java & Bali",
    hero_h1: 'Tours, car rentals, and airport pickups — all <em>trackable</em>.',
    hero_sub: "Pick a service, we assign the right driver and vehicle — then you can track their position live from your booking page.",
    hero_cta1: "View All Routes",
    hero_cta2: "How Om Bram Works",

    trust1_label: "Trips Completed",
    trust2_label: "Active Driver Partners",
    trust3_label: "On-Time Pickups",
    trust4_label: "Live Tracking",

    services_eyebrow: "Our Services",
    services_h2: "One platform, three ways to travel.",
    services_p: "Choose the service that fits your plan — all run through the same dispatch and tracking process.",
    svc_tour_name: "Tour & Travel",
    svc_tour_desc: "Full-day tour packages with clear stops, driver, and vehicle from the start.",
    svc_rental_name: "Car Rental",
    svc_rental_desc: "Daily rental with or without driver, for business or family needs.",
    svc_airport_name: "Airport Pickup",
    svc_airport_desc: "Scheduled airport pickup and drop-off, driver waits at the agreed point.",

    cara_eyebrow: "How It Works",
    cara_h2: "Three steps from booking to arriving home.",
    cara_p: "Every service runs through the same dispatch process — so you know exactly what's happening at every stage.",
    step1_title: "Pick a service & schedule",
    step1_desc: "Browse tours, rental cars, or airport schedules — vehicle details and prices are clear from the first page.",
    step2_title: "Driver & vehicle assigned",
    step2_desc: "Our dispatcher matches your booking with an available driver and vehicle, then confirms with you.",
    step3_title: "Track your trip live",
    step3_desc: "See the vehicle position live from your booking page, from pickup to drop-off.",

    tur_eyebrow: "Featured Routes",
    tur_h2: "Most booked services this month.",
    tur_p: "All include an experienced driver and air-conditioned vehicle. Route details and departure times are clearly listed.",

    feature_eyebrow: "Why Om Bram",
    feature_h2: "Every kilometer recorded, not just estimated.",
    feature_p: "Dispatcher assigns driver and vehicle behind the scenes — and you can see all movement yourself, live from the booking page.",
    check1_title: "Position updated every few seconds",
    check1_desc: "During the trip, vehicle location is continuously updated in real time.",
    check2_title: "Auto-assignment after payment",
    check2_desc: "Driver and vehicle are confirmed as soon as your payment is verified.",
    check3_title: "Route history saved",
    check3_desc: "Every trip has a complete route record — great for evaluation or claims.",

    armada_eyebrow: "Fleet",
    armada_h2: "Vehicle matched to your group size.",
    armada_p: "All fleet vehicles are regularly inspected and driven by verified drivers.",

    testi_eyebrow: "Testimonials",
    testi_h2: "What passengers say about Om Bram.",

    promo_h2: "Rp100k off your first booking.",
    promo_btn: "Copy Code",

    footer_tagline: "Om Bram connects you with guided tours, car rentals, and airport transfers.",
    footer_col_product: "PRODUCT",
    footer_col_company: "COMPANY",
    footer_col_help: "HELP",
    footer_link_routes: "Routes",
    footer_link_fleet: "Fleet",
    footer_link_how: "How It Works",
    footer_link_about: "About Us",
    footer_link_careers: "Careers",
    footer_link_partner: "Driver Partners",
    footer_link_help: "Help Center",
    footer_link_terms: "Terms & Conditions",
    footer_notice1: "© 2026 OM BRAM — MOCKUP DESIGN, NOT A LIVE SERVICE",
    footer_notice2: "BUILT FOR TRAVEL DISPATCH SYSTEM PRD PREVIEW",

    rute_eyebrow: "All Routes",
    rute_h2: "Find tours, car rentals, or airport schedules.",
    rute_p: "Use the filters below to narrow down your options based on the service you need.",
    filter_all: "All",
    filter_tour: "Tour & Travel",
    filter_rental: "Car Rental",
    filter_airport: "Airport Pickup",

    pesan_eyebrow: "Booking",
    pesan_h1: "Complete your booking",
    step_a: "Trip Details",
    step_b: "Your Info",
    step_c: "Payment",
    field_date: "Date",
    field_pax: "Number of Passengers",
    field_pickup: "Pickup Point",
    field_name: "Full Name",
    field_phone: "WhatsApp Number",
    field_email: "Email",
    field_notes: "Additional Notes (optional)",
    btn_continue: "Continue",
    btn_back: "Back",
    btn_pay: "Pay Now",
    order_summary: "Order Summary",
    subtotal: "Subtotal",
    discount: "Discount",
    total: "Total",
    pay_bank: "Bank Transfer",
    pay_qris: "QRIS",
    pay_card: "Credit/Debit Card",
    pay_ewallet: "E-Wallet",

    lacak_eyebrow: "Live Tracking",
    lacak_h1: "Your trip is in progress",
    lacak_driver: "Driver",
    lacak_vehicle: "Vehicle",
    lacak_eta: "Estimated Arrival",
    lacak_timeline: "Trip Timeline",
    lacak_share: "Share Trip",

    adm_overview: "Overview",
    adm_queue: "Order Queue",
    adm_fleet: "Fleet",
    adm_drivers: "Drivers",
    adm_analytics: "Analytics",
    adm_settings: "Settings",
    adm_today_orders: "Today's Orders",
    adm_revenue: "Revenue (This Month)",
    adm_active_fleet: "Active Fleet",
    adm_online_drivers: "Drivers Online",
    adm_table_id: "Order ID",
    adm_table_customer: "Customer",
    adm_table_service: "Service",
    adm_table_date: "Date",
    adm_table_status: "Status",
    adm_table_assign: "Assign",
  },

  ms: {
    nav_home: "Laman Utama",
    nav_routes: "Laluan",
    nav_fleet: "Armada",
    nav_how: "Cara Kerja",
    nav_testimonials: "Testimoni",
    nav_admin: "Portal Admin",
    btn_book_now: "Tempah Sekarang",
    hero_eyebrow: "Penjejakan Langsung · Jawa & Bali",
    hero_h1: 'Lawatan, sewa kereta, dan jemputan lapangan terbang — semua boleh <em>dijejaki</em>.',
    hero_sub: "Pilih perkhidmatan, kami tugaskan pemandu dan armada yang sesuai — kemudian anda boleh lihat kedudukannya secara langsung.",
    hero_cta1: "Lihat Semua Laluan",
    hero_cta2: "Cara Kerja Om Bram",
    footer_notice1: "© 2026 OM BRAM — REKA BENTUK MOCKUP, BUKAN PERKHIDMATAN AKTIF",
    footer_notice2: "DIBINA UNTUK PRATONTON PRD TRAVEL DISPATCH SYSTEM",
  },

  th: {
    nav_home: "หน้าหลัก",
    nav_routes: "เส้นทาง",
    nav_fleet: "ยานพาหนะ",
    nav_how: "วิธีการทำงาน",
    nav_testimonials: "รีวิว",
    nav_admin: "ผู้ดูแลระบบ",
    btn_book_now: "จองเลย",
    hero_eyebrow: "ติดตามสด · ชวา & บาหลี",
    hero_h1: 'ทัวร์ เช่ารถ และรับส่งสนามบิน — ทั้งหมด<em>ติดตามได้</em>',
    hero_sub: "เลือกบริการ เราจะจัดคนขับและรถที่เหมาะสม — จากนั้นคุณสามารถดูตำแหน่งแบบสดจากหน้าการจอง",
    hero_cta1: "ดูเส้นทางทั้งหมด",
    hero_cta2: "วิธีการทำงานของ Om Bram",
    footer_notice1: "© 2026 OM BRAM — ม็อคอัพ ไม่ใช่บริการจริง",
    footer_notice2: "สร้างเพื่อตัวอย่าง PRD ระบบจัดส่งการเดินทาง",
  },

  sg: {
    nav_home: "Home",
    nav_routes: "Routes",
    nav_fleet: "Fleet",
    nav_how: "How It Works",
    nav_testimonials: "Testimonials",
    nav_admin: "Admin Portal",
    btn_book_now: "Book Now",
    hero_eyebrow: "Live Tracking · Java & Bali",
    hero_h1: 'Tours, car rentals, and airport pickups — all <em>trackable</em>.',
    hero_sub: "Pick a service, we assign the right driver and vehicle — then track their position live from your booking page.",
    hero_cta1: "View All Routes",
    hero_cta2: "How Om Bram Works",
    footer_notice1: "© 2026 OM BRAM — MOCKUP DESIGN, NOT A LIVE SERVICE",
    footer_notice2: "BUILT FOR TRAVEL DISPATCH SYSTEM PRD PREVIEW",
  }
};

/* ---------- i18n Engine ---------- */
let ombramLang = localStorage.getItem('ombram_lang') || 'id';

function applyTranslations(lang) {
  const dict = OMBRAM_TRANSLATIONS[lang] || OMBRAM_TRANSLATIONS.id;
  const fallback = OMBRAM_TRANSLATIONS.id;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) el.textContent = dict[key];
    else if (fallback[key]) el.textContent = fallback[key];
  });

  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (dict[key]) el.innerHTML = dict[key];
    else if (fallback[key]) el.innerHTML = fallback[key];
  });

  // Update copy-button data attributes
  document.querySelectorAll('[data-copy-done]').forEach(el => {
    if (lang === 'en' || lang === 'sg') el.setAttribute('data-copy-done', 'Copied!');
    else el.setAttribute('data-copy-done', 'Disalin!');
  });

  // Update lang-current indicator
  document.querySelectorAll('.lang-current').forEach(el => {
    el.textContent = lang.toUpperCase();
  });

  // Update active state in language menu
  document.querySelectorAll('.lang-option').forEach(opt => {
    opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
  });

  document.documentElement.lang = lang === 'sg' ? 'en' : lang;
}

function initI18n() {
  applyTranslations(ombramLang);

  document.querySelectorAll('.lang-option[data-lang]').forEach(opt => {
    opt.addEventListener('click', () => {
      const lang = opt.getAttribute('data-lang');
      if (!lang) return;
      ombramLang = lang;
      localStorage.setItem('ombram_lang', lang);
      applyTranslations(lang);
    });
  });
}

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initI18n);
} else {
  initI18n();
}
