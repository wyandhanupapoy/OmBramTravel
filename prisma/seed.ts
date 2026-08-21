import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Reset
  await prisma.stop.deleteMany()
  await prisma.tour.deleteMany()
  
  // Create North Bandung Tour
  const northTour = await prisma.tour.create({
    data: {
      slug: 'north-bandung-volcano-tour',
      zone: 'north',
      duration: 'full-day',
      maxPax: 7,
      basePrice: 850000,
      extraPaxFee: 150000,
      luggageFee: 50000,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=1200&h=800&fit=crop', // Tangkuban perahu
        'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1200&h=800&fit=crop'
      ]),
      titleId: 'Tangkuban Perahu & Lembang',
      titleEn: 'Tangkuban Perahu Volcano & Lembang',
      titleZh: '覆舟火山与伦邦 (Lembang)',
      descId: 'Jelajahi kawah gunung berapi aktif dan nikmati udara sejuk pegunungan Lembang.',
      descEn: 'Explore an active volcano crater and enjoy the cool mountain air of Lembang.',
      descZh: '探索活火山口，享受伦邦凉爽的山间空气。',
      stops: {
        create: [
          { order: 1, nameId: 'Tangkuban Perahu', nameEn: 'Tangkuban Perahu Volcano', nameZh: '覆舟火山', time: '09:00', duration: 120 },
          { order: 2, nameId: 'Orchid Forest Cikole', nameEn: 'Orchid Forest Cikole', nameZh: '兰花森林', time: '12:00', duration: 90 },
          { order: 3, nameId: 'Floating Market', nameEn: 'Floating Market Lembang', nameZh: '水上市场', time: '14:30', duration: 120 }
        ]
      }
    }
  })

  // Create South Bandung Tour
  const southTour = await prisma.tour.create({
    data: {
      slug: 'south-bandung-crater-lake',
      zone: 'south',
      duration: 'full-day',
      maxPax: 7,
      basePrice: 950000, // Slightly more expensive due to distance
      extraPaxFee: 150000,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=1200&h=800&fit=crop'
      ]),
      titleId: 'Kawah Putih & Kebun Teh',
      titleEn: 'White Crater & Tea Plantations',
      titleZh: '白色火山口与茶园',
      descId: 'Saksikan keindahan danau kawah vulkanik putih dan hamparan kebun teh yang hijau sejauh mata memandang.',
      descEn: 'Witness the beauty of a striking white volcanic crater lake and vast rolling green tea plantations.',
      descZh: '见证引人注目的白色火山火山口湖和广阔连绵的绿色茶园之美。',
      stops: {
        create: [
          { order: 1, nameId: 'Kawah Putih', nameEn: 'White Crater', nameZh: '白色火山口', time: '09:30', duration: 120 },
          { order: 2, nameId: 'Situ Patenggang', nameEn: 'Patenggang Lake', nameZh: '帕腾甘湖', time: '12:30', duration: 90 },
          { order: 3, nameId: 'Ranca Upas', nameEn: 'Ranca Upas Deer Conservation', nameZh: '鹿类保护区', time: '15:00', duration: 60 }
        ]
      }
    }
  })

  // Create City Tour
  const cityTour = await prisma.tour.create({
    data: {
      slug: 'bandung-city-heritage',
      zone: 'city',
      duration: 'half-day',
      maxPax: 7,
      basePrice: 650000,
      extraPaxFee: 100000,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=1200&h=800&fit=crop'
      ]),
      titleId: 'Warisan Kota & Kuliner',
      titleEn: 'City Heritage & Culinary',
      titleZh: '城市遗产与美食',
      descId: 'Jelajahi bangunan bersejarah peninggalan Belanda dan nikmati jalanan paling ikonik di jantung kota Bandung.',
      descEn: 'Explore historic Dutch colonial buildings and stroll down the most iconic streets in the heart of Bandung.',
      descZh: '探索历史悠久的荷兰殖民建筑，漫步万隆市中心最具标志性的街道。',
      stops: {
        create: [
          { order: 1, nameId: 'Gedung Sate', nameEn: 'Gedung Sate', nameZh: '沙爹大楼', time: '09:00', duration: 60 },
          { order: 2, nameId: 'Museum Geologi', nameEn: 'Geology Museum', nameZh: '地质博物馆', time: '10:30', duration: 90 },
          { order: 3, nameId: 'Jalan Braga', nameEn: 'Braga Street', nameZh: '布拉加街', time: '12:30', duration: 180 }
        ]
      }
    }
  })

  console.log('Seed completed: 3 tours created.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
