export interface Article {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  publishedAt: string;
  image: string;
  paragraphs: string[];
  tips: string[];
}

export const articles: Article[] = [
  {
    slug: "wisata-bandung-terbaik",
    category: "Panduan Bandung",
    title: "Wisata Bandung terbaik untuk liburan yang lebih terarah",
    excerpt: "Panduan memilih destinasi kota, alam, dan keluarga di Bandung Raya sesuai waktu dan gaya perjalanan Anda.",
    readTime: "6 menit baca",
    publishedAt: "2026-08-01",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=800&fit=crop",
    paragraphs: [
      "Bandung punya ritme liburan yang beragam. Dalam satu hari, Anda bisa menikmati arsitektur bersejarah di pusat kota, udara sejuk Lembang, atau pemandangan kebun teh di selatan Bandung.",
      "Kunci itinerary yang nyaman adalah mengelompokkan destinasi berdasarkan arah. Rute kota cocok untuk waktu singkat, sementara Lembang, Ciwidey, dan Pangalengan lebih nyaman dijadikan perjalanan sehari dengan kendaraan dan driver.",
      "Sebelum berangkat, periksa waktu tempuh, jam buka, dan kepadatan akhir pekan. Dengan begitu, lebih banyak waktu bisa digunakan untuk menikmati tempat tujuan, bukan terjebak berpindah-pindah."
    ],
    tips: ["Mulai dari destinasi yang paling jauh.", "Sisakan waktu untuk makan dan istirahat.", "Pilih kendaraan sesuai jumlah penumpang dan bagasi."]
  },
  {
    slug: "itinerary-bandung-2-hari",
    category: "Itinerary",
    title: "Itinerary Bandung 2 hari: kota, Lembang, dan kuliner",
    excerpt: "Contoh susunan perjalanan dua hari yang menggabungkan landmark kota, pegunungan, dan kuliner tanpa jadwal terlalu padat.",
    readTime: "5 menit baca",
    publishedAt: "2026-08-05",
    image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1200&h=800&fit=crop",
    paragraphs: [
      "Hari pertama dapat dimulai dari Gedung Sate, Museum Geologi, dan kawasan Braga. Ketiganya memberi pengenalan singkat tentang sejarah, budaya, dan suasana pusat Bandung.",
      "Hari kedua arahkan perjalanan ke Lembang. Pilih dua atau tiga destinasi utama seperti Orchid Forest Cikole, Floating Market, atau Gunung Tangkuban Perahu agar waktu kunjungan tetap nyaman.",
      "Untuk keluarga, gunakan kendaraan dengan ruang kabin yang cukup. Untuk pasangan atau rombongan kecil, sedan atau MPV biasanya lebih lincah ketika melewati kawasan kota."
    ],
    tips: ["Kelompokkan rute berdasarkan arah, bukan popularitas saja.", "Pesan kendaraan lebih awal untuk akhir pekan.", "Jangan memasukkan terlalu banyak stop dalam satu hari."]
  },
  {
    slug: "wisata-bandung-selatan",
    category: "Wisata Alam",
    title: "Wisata Bandung Selatan: Kawah Putih, Ciwidey, dan Pangalengan",
    excerpt: "Cara menyusun rute ke Bandung Selatan dengan pilihan destinasi alam, kebun teh, dan aktivitas keluarga.",
    readTime: "7 menit baca",
    publishedAt: "2026-08-10",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop",
    paragraphs: [
      "Bandung Selatan menawarkan perjalanan dengan lanskap yang berubah dari perkotaan menjadi perkebunan dan pegunungan. Kawah Putih dan Situ Patenggang cocok dipasangkan dalam rute Ciwidey.",
      "Jika ingin suasana lebih tenang, Pangalengan menawarkan kebun teh, danau, serta titik pandang matahari terbit. Waktu berangkat pagi sangat membantu agar perjalanan tidak terlalu panjang.",
      "Rute alam membutuhkan kendaraan yang nyaman untuk perjalanan lebih jauh. Diskusikan titik jemput dan jumlah bagasi ketika memilih paket agar armada yang digunakan sesuai kebutuhan."
    ],
    tips: ["Berangkat pagi untuk menghindari antrean.", "Bawa jaket dan alas kaki yang nyaman.", "Siapkan rencana cadangan saat cuaca berubah."]
  },
  {
    slug: "memilih-kendaraan-travel-bandung",
    category: "Tips Traveling",
    title: "Memilih kendaraan travel Bandung sesuai jumlah penumpang",
    excerpt: "Perbandingan praktis sedan, MPV, SUV, dan minibus untuk city tour, keluarga, serta perjalanan pegunungan.",
    readTime: "4 menit baca",
    publishedAt: "2026-08-15",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&h=800&fit=crop",
    paragraphs: [
      "Sedan cocok untuk transfer kota dan perjalanan berdua atau bertiga dengan bagasi ringan. MPV memberi ruang lebih fleksibel untuk keluarga kecil dan tetap nyaman digunakan di pusat kota.",
      "SUV menjadi pilihan untuk rombongan yang menginginkan kabin lega dan perjalanan ke area berbukit. Untuk grup besar, minibus travel memberi ruang duduk serta bagasi yang lebih sesuai.",
      "Selain tipe mobil, tanyakan juga kapasitas aktual, fasilitas AC, dan pengalaman driver di rute Bandung. Detail kecil ini berpengaruh besar pada kenyamanan perjalanan."
    ],
    tips: ["Hitung penumpang dan koper, bukan kursi saja.", "Sesuaikan tipe mobil dengan medan perjalanan.", "Pastikan titik jemput dan kebutuhan khusus tercatat."]
  },
  {
    slug: "wisata-dago-bandung",
    category: "Panduan Bandung",
    title: "Wisata Dago Bandung: rute alam, seni, dan kuliner",
    excerpt: "Susun perjalanan Dago yang nyaman dari pusat kota menuju kawasan perbukitan tanpa bolak-balik arah.",
    readTime: "5 menit baca", publishedAt: "2026-08-18", image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&h=800&fit=crop",
    paragraphs: ["Dago adalah salah satu kawasan paling fleksibel di Bandung. Area ini menghubungkan ruang seni, kafe, taman, dan jalur menuju perbukitan dalam satu koridor perjalanan.", "Mulailah dari titik kota seperti Jalan Riau atau Babakan Siliwangi, lalu lanjutkan ke Dago Atas, Tahura, atau Tebing Keraton sesuai waktu yang tersedia.", "Rute Dago dapat padat pada sore dan akhir pekan. Kendaraan dengan driver membantu Anda berpindah titik tanpa perlu memikirkan parkir di setiap tempat."],
    tips: ["Berangkat sebelum jam makan siang.", "Pilih maksimal tiga stop utama.", "Siapkan jaket untuk kawasan atas."]
  },
  {
    slug: "wisata-lembang-untuk-keluarga",
    category: "Wisata Keluarga",
    title: "Wisata Lembang untuk keluarga: rute nyaman satu hari",
    excerpt: "Rekomendasi menyusun rute Lembang untuk keluarga dengan anak, orang tua, dan waktu istirahat yang cukup.",
    readTime: "6 menit baca", publishedAt: "2026-08-20", image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1200&h=800&fit=crop",
    paragraphs: ["Lembang menawarkan banyak pilihan, tetapi jarak antar tempat dan kepadatan jalan perlu diperhitungkan. Rute yang baik tidak harus mengunjungi semua destinasi.", "Untuk keluarga, gabungkan satu tempat bermain, satu tempat menikmati pemandangan, dan satu tempat makan. Pola ini menjaga perjalanan tetap bervariasi tanpa membuat anak cepat lelah.", "MPV atau minibus menjadi pilihan praktis ketika membawa stroller, koper, dan perlengkapan keluarga."],
    tips: ["Bawa lapisan pakaian tambahan.", "Sisipkan jeda makan di tengah rute.", "Konfirmasi akses kendaraan sebelum berangkat."]
  },
  {
    slug: "kuliner-malam-bandung",
    category: "Kuliner Bandung",
    title: "Kuliner malam Bandung: rute Braga, Cibadak, dan Sudirman",
    excerpt: "Nikmati suasana malam Bandung dengan rute kuliner yang mudah disesuaikan untuk pasangan atau rombongan.",
    readTime: "4 menit baca", publishedAt: "2026-08-22", image: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=1200&h=800&fit=crop",
    paragraphs: ["Bandung memiliki banyak pilihan kuliner malam dengan karakter berbeda. Braga cocok untuk suasana heritage, Cibadak untuk pilihan makanan yang beragam, dan Sudirman untuk pengalaman street food.", "Sebaiknya tentukan titik akhir lebih dahulu karena area kuliner dapat ramai dan parkir terbatas. Perjalanan singkat dengan kendaraan lebih nyaman daripada memindahkan mobil berkali-kali.", "Jika membawa rombongan, pilih kendaraan dengan akses naik turun yang mudah dan ruang kabin yang cukup."],
    tips: ["Datang lebih awal saat akhir pekan.", "Siapkan pembayaran non-tunai dan tunai.", "Jangan memenuhi jadwal dengan terlalu banyak tempat makan."]
  },
  {
    slug: "wisata-bandung-saat-hujan",
    category: "Tips Traveling",
    title: "Wisata Bandung saat hujan: rute indoor yang tetap seru",
    excerpt: "Ide rute Bandung saat cuaca berubah, dari museum dan pusat kreatif hingga aktivitas keluarga di dalam ruangan.",
    readTime: "5 menit baca", publishedAt: "2026-08-24", image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&h=800&fit=crop",
    paragraphs: ["Hujan tidak harus membatalkan perjalanan Bandung. Kawasan kota memiliki museum, galeri, pusat belanja, dan ruang kuliner yang dapat menjadi alternatif destinasi terbuka.", "Buat rute dengan jarak antar titik yang pendek agar waktu di jalan tidak mendominasi. Periksa juga jam operasional karena beberapa tempat memiliki jadwal berbeda pada hari tertentu.", "Driver lokal dapat membantu menyesuaikan rute ketika hujan membuat lalu lintas berubah."],
    tips: ["Bawa payung kecil dan alas kaki cadangan.", "Sisakan waktu untuk kemacetan.", "Simpan dua opsi destinasi indoor."]
  },
  {
    slug: "bandung-dari-jakarta",
    category: "Transportasi",
    title: "Perjalanan dari Jakarta ke Bandung: pilihan transfer dan itinerary",
    excerpt: "Panduan merencanakan perjalanan Jakarta-Bandung agar waktu kedatangan dan rute wisata tetap efisien.",
    readTime: "6 menit baca", publishedAt: "2026-08-26", image: "https://images.unsplash.com/photo-1465447142348-e9952c393450?w=1200&h=800&fit=crop",
    paragraphs: ["Perjalanan dari Jakarta ke Bandung membutuhkan perencanaan waktu karena kepadatan jalur dapat berubah. Tentukan apakah Anda ingin langsung menuju destinasi atau check-in terlebih dahulu.", "Private transfer memberi fleksibilitas untuk membawa bagasi dan menentukan titik jemput. Setelah tiba, itinerary kota dapat dilanjutkan dengan rute yang lebih ringan.", "Untuk grup, minibus travel membantu menjaga rombongan tetap bersama dan mengurangi kebutuhan beberapa kendaraan."],
    tips: ["Berikan alamat jemput yang lengkap.", "Hindari jadwal destinasi terlalu pagi setelah transfer jauh.", "Siapkan waktu cadangan untuk perjalanan."]
  },
  {
    slug: "bandung-instagramable",
    category: "Panduan Bandung",
    title: "Tempat instagramable di Bandung dalam satu rute",
    excerpt: "Rencanakan rute foto Bandung yang menggabungkan arsitektur kota, ruang kreatif, dan panorama pegunungan.",
    readTime: "5 menit baca", publishedAt: "2026-08-28", image: "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?w=1200&h=800&fit=crop",
    paragraphs: ["Rute foto yang nyaman menggabungkan beberapa karakter visual, bukan sekadar mengejar jumlah lokasi. Mulai dari bangunan kota, lanjutkan ke ruang seni, lalu tutup dengan pemandangan dari kawasan atas.", "Pagi memberi cahaya yang lebih lembut dan biasanya lebih mudah untuk parkir. Pastikan penggunaan kamera atau drone mengikuti aturan masing-masing lokasi.", "Sedan atau MPV cocok untuk rute foto dengan rombongan kecil dan perlengkapan ringan."],
    tips: ["Cek aturan foto di lokasi.", "Pilih pakaian yang nyaman untuk berpindah tempat.", "Jangan mengorbankan waktu perjalanan demi terlalu banyak stop."]
  },
  {
    slug: "bandung-budget-travel",
    category: "Tips Traveling",
    title: "Liburan hemat ke Bandung tanpa kehilangan pengalaman",
    excerpt: "Cara mengatur rute dan biaya perjalanan Bandung dengan memilih destinasi yang saling berdekatan.",
    readTime: "5 menit baca", publishedAt: "2026-08-30", image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=1200&h=800&fit=crop",
    paragraphs: ["Liburan hemat dimulai dari itinerary yang efisien. Pilih kombinasi taman kota, kawasan heritage, dan satu destinasi berbayar agar pengalaman tetap beragam.", "Biaya kendaraan sebaiknya dihitung bersama jumlah penumpang. Untuk rombongan, kendaraan bersama sering lebih praktis karena biaya dan waktu dapat dibagi.", "Cari paket yang transparan mengenai driver, BBM, durasi, dan biaya tambahan sebelum melakukan pemesanan."],
    tips: ["Kelompokkan destinasi dalam satu area.", "Bandingkan harga total, bukan harga awal saja.", "Hindari itinerary terlalu padat."]
  },
  {
    slug: "wisata-bandung-akhir-pekan",
    category: "Perencanaan Perjalanan",
    title: "Strategi wisata Bandung saat akhir pekan",
    excerpt: "Panduan menghindari jadwal terlalu padat dan memilih waktu berangkat yang lebih nyaman saat Bandung ramai.",
    readTime: "6 menit baca", publishedAt: "2026-09-01", image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1200&h=800&fit=crop",
    paragraphs: ["Akhir pekan adalah waktu populer untuk mengunjungi Bandung, sehingga perjalanan antarkawasan dapat memakan waktu lebih lama. Itinerary yang realistis lebih penting daripada banyaknya destinasi.", "Berangkat pagi, pilih satu kawasan utama per hari, dan lakukan reservasi jika destinasi atau restoran membutuhkannya.", "Dengan driver, Anda dapat menyesuaikan urutan stop berdasarkan kondisi jalan dan tetap memiliki waktu untuk beristirahat."],
    tips: ["Mulai perjalanan pagi.", "Hindari pindah dari utara ke selatan dalam satu hari.", "Simpan nomor kontak driver dan titik jemput."]
  }
];
