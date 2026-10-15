import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Naka, Beyond the waiting line',
    short_name: 'Naka',
    description: 'Connecting hawkers to better work: nearby jobs, a skill card without a résumé, and your rights.',
    start_url: '/jobs',
    display: 'standalone',
    background_color: '#fdfbf7',
    theme_color: '#f58a07',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
