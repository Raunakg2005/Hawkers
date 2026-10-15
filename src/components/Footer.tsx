import Link from 'next/link';
import Logo from './Logo';
import { T, Tx } from './T';
import { NAV, NAV_MORE } from '@/lib/nav';
import { HELPLINES } from '@/data/schemes';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="stack">
            <Link className="brand" href="/">
              <Logo />
              naka
            </Link>
            <p className="muted" style={{ maxWidth: '38ch' }}>
              <T
                en="A digital naka for India’s daily-wage workers — find work, show your skill, know your rights. No résumé needed."
                hi="भारत के दिहाड़ी मज़दूरों के लिए डिजिटल नाका — काम खोजें, हुनर दिखाएँ, अधिकार जानें। बायोडाटा की ज़रूरत नहीं।"
              />
            </p>
            <p className="subtle">
              <T en="Hackathon prototype · all data is mock" hi="हैकाथॉन प्रोटोटाइप · सारा डेटा नमूना है" />
            </p>
          </div>

          <div>
            <h3>
              <T en="For workers" hi="मज़दूरों के लिए" />
            </h3>
            <ul>
              {[NAV[0], NAV[2], NAV_MORE[0], NAV[4]].map((n) => (
                <li key={n.href}>
                  <Link href={n.href}>
                    <Tx l={n.label} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3>
              <T en="For employers" hi="मालिकों के लिए" />
            </h3>
            <ul>
              {[NAV[1], NAV_MORE[1]].map((n) => (
                <li key={n.href}>
                  <Link href={n.href}>
                    <Tx l={n.label} />
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/rights#rights">
                  <T en="Fair pay guide" hi="सही मज़दूरी गाइड" />
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3>
              <T en="Help lines" hi="हेल्पलाइन" />
            </h3>
            <ul>
              {HELPLINES.slice(0, 4).map((h) => (
                <li key={h.number}>
                  <a href={`tel:${h.number}`}>
                    <strong style={{ marginRight: 8 }}>{h.number}</strong> <Tx l={h.name} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-big" aria-hidden="true">
          naka · नाका
        </div>

        <div className="footer-bottom">
          <span>
            <T en="Built for “Beyond the Waiting Line” · Inclusive Design" hi="“इंतज़ार से आगे” के लिए बनाया गया · समावेशी डिज़ाइन" />
          </span>
          <span>
            <T en="Scheme info is simplified — always confirm on official sites." hi="योजनाओं की जानकारी सरल की गई है — सरकारी साइट पर ज़रूर जाँचें।" />
          </span>
        </div>
      </div>
    </footer>
  );
}
