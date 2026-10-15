import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';
import { T } from '@/components/T';

export default function NotFound() {
  return (
    <section className="page">
      <div className="container container-narrow" style={{ textAlign: 'center', display: 'grid', gap: 'var(--space-6)', justifyItems: 'center' }}>
        <p className="display gradient-text" aria-hidden="true">
          404
        </p>
        <h1 className="h2">
          <T en="This road has no naka." hi="इस रास्ते पर कोई नाका नहीं है।" />
        </h1>
        <p className="lead">
          <T en="The page you wanted isn’t here. Let’s get you back to work." hi="जो पेज आप ढूँढ रहे थे वह यहाँ नहीं है। चलिए वापस काम पर चलें।" />
        </p>
        <div className="row" style={{ justifyContent: 'center' }}>
          <Link className="btn btn-primary btn-lg" href="/jobs">
            <Search aria-hidden="true" />
            <T en="Find work" hi="काम खोजें" />
          </Link>
          <Link className="btn btn-lg" href="/">
            <ArrowLeft aria-hidden="true" />
            <T en="Home" hi="होम" />
          </Link>
        </div>
      </div>
    </section>
  );
}
