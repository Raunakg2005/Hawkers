import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MapPin } from 'lucide-react';
import JobBoard from '@/components/jobs/JobBoard';
import { T } from '@/components/T';

export const metadata: Metadata = {
  title: 'Find work near you',
  description: 'Daily-wage, short-term and long-term jobs near your naka — pay, hours, distance and payday shown first, with risky listings flagged.',
};

export default function JobsPage() {
  return (
    <div className="page jobs-page">
      <div className="container">
        <header className="jobs-head" data-reveal="">
          <div>
            <span className="eyebrow">
              <T en="Find work" hi="काम खोजें" />
            </span>
            <h1 className="h1">
              <T
                en={
                  <>
                    Work near <span className="gradient-text">your naka</span>
                  </>
                }
                hi={
                  <>
                    <span className="gradient-text">आपके नाके</span> के पास काम
                  </>
                }
              />
            </h1>
          </div>
          <p className="location-chip">
            <MapPin aria-hidden="true" />
            <span>
              <strong>
                <T en="Kurla West naka" hi="कुर्ला पश्चिम नाका" />
              </strong>
              <small>
                <T en="LBS Marg, Mumbai · updated 2 min ago" hi="LBS मार्ग, मुंबई · 2 मिनट पहले अपडेट" />
              </small>
            </span>
          </p>
        </header>
        <Suspense fallback={<div className="board-skeleton" aria-hidden="true" />}>
          <JobBoard />
        </Suspense>
      </div>
    </div>
  );
}
