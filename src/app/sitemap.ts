import type { MetadataRoute } from 'next';
import { JOBS } from '@/data/jobs';
import { WORKERS } from '@/data/workers';

const BASE = 'https://naka.example';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/jobs', '/workers', '/profile', '/post-job', '/rights', '/safety', '/my-work'];
  return [
    ...pages.map((p) => ({ url: `${BASE}${p}`, changeFrequency: 'weekly' as const, priority: p ? 0.8 : 1 })),
    ...JOBS.map((j) => ({ url: `${BASE}/jobs/${j.id}`, changeFrequency: 'daily' as const, priority: 0.6 })),
    ...WORKERS.map((w) => ({ url: `${BASE}/workers/${w.id}`, changeFrequency: 'weekly' as const, priority: 0.5 })),
  ];
}
