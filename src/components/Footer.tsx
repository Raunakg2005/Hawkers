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
              karigar
            </Link>
            <p className="muted" style={{ maxWidth: '38ch' }}>
              <T
                en="A digital home for India’s skilled daily craftspeople — find work, show your skill, know your rights. No résumé needed."
                hi="भारत के हुनरमंद दिहाड़ी कारीगरों के लिए डिजिटल मंच — काम खोजें, हुनर दिखाएँ, अधिकार जानें। बायोडाटा की ज़रूरत नहीं।"
                mr="भारतातील कुशल रोजंदारी कारागिरांसाठी डिजिटल व्यासपीठ — काम शोधा, कौशल्य दाखवा, हक्क जाणा. बायोडाटाची गरज नाही."
                gu="ભારતના કુશળ રોજમદાર કારીગરો માટે ડિજિટલ પ્લેટફોર્મ — કામ શોધો, આવડત બતાવો, અધિકાર જાણો. બાયોડેટાની જરૂર નથી."
              />
            </p>
            <p className="subtle">
              <T en="Hackathon prototype · all data is mock" hi="हैकाथॉन प्रोटोटाइप · सारा डेटा नमूना है" mr="हॅकेथॉन प्रोटोटाइप · सर्व डेटा नमुना आहे" gu="હેકાથોન પ્રોટોટાઇપ · બધો ડેટા નમૂનો છે" />
            </p>
          </div>

          <div>
            <h3>
              <T en="For workers" hi="मज़दूरों के लिए" mr="कामगारांसाठी" gu="કામદારો માટે" />
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
              <T en="For employers" hi="मालिकों के लिए" mr="मालकांसाठी" gu="માલિકો માટે" />
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
                  <T en="Fair pay guide" hi="सही मज़दूरी गाइड" mr="योग्य मजुरी मार्गदर्शक" gu="યોગ્ય મજૂરી માર્ગદર્શિકા" />
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3>
              <T en="Help lines" hi="हेल्पलाइन" mr="हेल्पलाइन" gu="હેલ્પલાઇન" />
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
            <T en="Built for “Beyond the Waiting Line” · Inclusive Design" hi="“इंतज़ार से आगे” के लिए बनाया गया · समावेशी डिज़ाइन" mr="“प्रतीक्षेच्या पलीकडे” साठी बनवले · सर्वसमावेशक डिझाइन" gu="“રાહથી આગળ” માટે બનાવ્યું · સર્વસમાવેશી ડિઝાઇન" />
          </span>
          <span>
            <T en="Scheme info is simplified — always confirm on official sites." hi="योजनाओं की जानकारी सरल की गई है — सरकारी साइट पर ज़रूर जाँचें।" mr="योजनांची माहिती सोपी केली आहे — सरकारी साइटवर नक्की तपासा." gu="યોજનાઓની માહિતી સરળ કરી છે — સરકારી સાઇટ પર જરૂર તપાસો." />
          </span>
        </div>
      </div>
    </footer>
  );
}
