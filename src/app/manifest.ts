import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'OmBram Travel',
    short_name: 'OmBram',
    description: 'OmBram Travel - Bandung Premium Private Tours',
    start_url: '/id',
    display: 'standalone',
    background_color: '#f8f9fa',
    theme_color: '#0d3b2a',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/images/og-default.jpg', // Placeholder for proper 512x512 icon
        sizes: '512x512',
        type: 'image/jpeg',
      }
    ],
  }
}
