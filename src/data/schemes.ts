import type { L, Scheme, SchemeNeed } from './types';

/* Summaries of real central-government schemes, simplified for a demo.
   Amounts/eligibility change — the UI always links to the official site and
   asks users to confirm there or at a CSC (Common Service Centre). */

export const NEEDS: Record<SchemeNeed, { label: L }> = {
  id: { label: { en: 'Worker ID card', hi: 'मज़दूर पहचान पत्र' } },
  health: { label: { en: 'Hospital & health', hi: 'अस्पताल और इलाज' } },
  insurance: { label: { en: 'Accident & life cover', hi: 'दुर्घटना और जीवन बीमा' } },
  pension: { label: { en: 'Pension in old age', hi: 'बुढ़ापे में पेंशन' } },
  loan: { label: { en: 'Small loan', hi: 'छोटा कर्ज़' } },
  housing: { label: { en: 'House', hi: 'घर' } },
  food: { label: { en: 'Ration', hi: 'राशन' } },
  family: { label: { en: 'Children & family', hi: 'बच्चे और परिवार' } },
};

export const SCHEMES: Scheme[] = [
  {
    id: 'e-shram',
    name: 'e-Shram',
    short: { en: 'National ID card for unorganised workers', hi: 'असंगठित मज़दूरों का राष्ट्रीय पहचान पत्र' },
    needs: ['id', 'insurance'],
    benefit: {
      en: 'A 12-digit UAN card that proves you are a worker. It is the door to many other schemes and helps the government reach you in emergencies.',
      hi: '12 अंकों का UAN कार्ड जो साबित करता है कि आप मज़दूर हैं। इससे कई दूसरी योजनाओं का रास्ता खुलता है और आपदा में सरकार आप तक पहुँच पाती है।',
    },
    who: { en: 'Age 16–59, working in the unorganised sector, not paying income tax, not in EPFO/ESIC.', hi: 'उम्र 16–59, असंगठित क्षेत्र में काम, इनकम टैक्स नहीं भरते, EPFO/ESIC में नहीं।' },
    cost: { en: 'Free', hi: 'मुफ़्त' },
    docs: ['aadhaar', 'mobile', 'bank'],
    how: [
      { en: 'Go to a CSC centre or open eshram.gov.in', hi: 'CSC सेंटर जाएँ या eshram.gov.in खोलें' },
      { en: 'Verify with Aadhaar OTP', hi: 'आधार OTP से पुष्टि करें' },
      { en: 'Fill trade, address and bank — download your card', hi: 'काम, पता और बैंक भरें — कार्ड डाउनलोड करें' },
    ],
    where: { en: 'CSC centre / eshram.gov.in', hi: 'CSC सेंटर / eshram.gov.in' },
    helpline: '14434',
    site: 'https://eshram.gov.in',
  },
  {
    id: 'pm-sym',
    name: 'PM Shram Yogi Maan-dhan',
    short: { en: 'Pension of ₹3,000 a month after 60', hi: '60 के बाद ₹3,000 महीना पेंशन' },
    needs: ['pension'],
    benefit: {
      en: 'You save a small amount every month; the government adds the same amount. After age 60 you get an assured monthly pension.',
      hi: 'आप हर महीने थोड़ा पैसा जमा करते हैं; सरकार भी उतना ही जोड़ती है। 60 की उम्र के बाद पक्की मासिक पेंशन मिलती है।',
    },
    who: { en: 'Age 18–40, monthly income up to ₹15,000, unorganised worker.', hi: 'उम्र 18–40, मासिक आमदनी ₹15,000 तक, असंगठित मज़दूर।' },
    cost: { en: '₹55–₹200 per month depending on age', hi: 'उम्र के अनुसार ₹55–₹200 महीना' },
    docs: ['aadhaar', 'bank', 'mobile'],
    how: [
      { en: 'Visit a CSC with Aadhaar and bank passbook', hi: 'आधार और बैंक पासबुक लेकर CSC जाएँ' },
      { en: 'Give auto-debit consent for the monthly amount', hi: 'महीने की रकम के ऑटो-डेबिट की सहमति दें' },
      { en: 'Get your Shram Yogi pension card', hi: 'श्रम योगी पेंशन कार्ड पाएँ' },
    ],
    where: { en: 'CSC centre / maandhan.in', hi: 'CSC सेंटर / maandhan.in' },
    helpline: '1800 267 6888',
    site: 'https://maandhan.in',
  },
  {
    id: 'pmsby',
    name: 'PM Suraksha Bima Yojana',
    short: { en: '₹2 lakh accident cover for ₹20 a year', hi: '₹20 साल में ₹2 लाख का दुर्घटना बीमा' },
    needs: ['insurance'],
    benefit: {
      en: 'If you die or are fully disabled in an accident, your family gets ₹2 lakh. Partial disability: ₹1 lakh.',
      hi: 'दुर्घटना में मृत्यु या पूरी विकलांगता पर परिवार को ₹2 लाख। आंशिक विकलांगता पर ₹1 लाख।',
    },
    who: { en: 'Age 18–70 with a bank account.', hi: 'उम्र 18–70, बैंक खाता हो।' },
    cost: { en: '₹20 per year, auto-debited', hi: '₹20 सालाना, खाते से अपने-आप कटेगा' },
    docs: ['aadhaar', 'bank'],
    how: [
      { en: 'Ask at your bank branch or bank mitra', hi: 'अपनी बैंक शाखा या बैंक मित्र से पूछें' },
      { en: 'Fill the one-page form, add a nominee', hi: 'एक पन्ने का फ़ॉर्म भरें, नॉमिनी जोड़ें' },
    ],
    where: { en: 'Your bank / post office', hi: 'आपका बैंक / डाकघर' },
    site: 'https://jansuraksha.gov.in',
  },
  {
    id: 'pmjjby',
    name: 'PM Jeevan Jyoti Bima Yojana',
    short: { en: '₹2 lakh life cover for ₹436 a year', hi: '₹436 साल में ₹2 लाख का जीवन बीमा' },
    needs: ['insurance', 'family'],
    benefit: { en: 'Your family gets ₹2 lakh if you die for any reason.', hi: 'किसी भी कारण से मृत्यु पर परिवार को ₹2 लाख मिलते हैं।' },
    who: { en: 'Age 18–50 with a bank account.', hi: 'उम्र 18–50, बैंक खाता हो।' },
    cost: { en: '₹436 per year', hi: '₹436 सालाना' },
    docs: ['aadhaar', 'bank'],
    how: [
      { en: 'Ask at your bank branch', hi: 'अपनी बैंक शाखा में पूछें' },
      { en: 'Sign the consent-cum-declaration form', hi: 'सहमति-घोषणा फ़ॉर्म पर साइन करें' },
    ],
    where: { en: 'Your bank / post office', hi: 'आपका बैंक / डाकघर' },
    site: 'https://jansuraksha.gov.in',
  },
  {
    id: 'pm-jay',
    name: 'Ayushman Bharat PM-JAY',
    short: { en: 'Free hospital treatment up to ₹5 lakh', hi: '₹5 लाख तक मुफ़्त अस्पताल इलाज' },
    needs: ['health', 'family'],
    benefit: {
      en: 'Cashless treatment for your family at listed government and private hospitals, every year.',
      hi: 'सूचीबद्ध सरकारी और निजी अस्पतालों में परिवार का कैशलेस इलाज, हर साल।',
    },
    who: { en: 'Eligible poor & vulnerable families (check your name with Aadhaar or ration card).', hi: 'पात्र गरीब और कमज़ोर परिवार (आधार या राशन कार्ड से नाम जाँचें)।' },
    cost: { en: 'Free', hi: 'मुफ़्त' },
    docs: ['aadhaar', 'ration'],
    how: [
      { en: 'Check eligibility at beneficiary.nha.gov.in', hi: 'beneficiary.nha.gov.in पर पात्रता देखें' },
      { en: 'Get your Ayushman card made at a CSC or hospital Arogya Mitra desk', hi: 'CSC या अस्पताल के आरोग्य मित्र डेस्क पर आयुष्मान कार्ड बनवाएँ' },
    ],
    where: { en: 'CSC / empanelled hospital', hi: 'CSC / सूचीबद्ध अस्पताल' },
    helpline: '14555',
    site: 'https://pmjay.gov.in',
  },
  {
    id: 'pm-svanidhi',
    name: 'PM SVANidhi',
    short: { en: 'Working-capital loan for street vendors', hi: 'रेहड़ी-पटरी वालों के लिए कारोबारी कर्ज़' },
    needs: ['loan'],
    benefit: {
      en: 'Small collateral-free loans in steps, with interest subsidy for paying on time and cashback on digital payments.',
      hi: 'बिना गारंटी के छोटे कर्ज़ किस्तों में, समय पर चुकाने पर ब्याज सब्सिडी और डिजिटल भुगतान पर कैशबैक।',
    },
    who: { en: 'Street vendors and hawkers with a vending certificate or recommendation letter from the city body.', hi: 'रेहड़ी-पटरी विक्रेता जिनके पास नगर निगम का प्रमाणपत्र या सिफ़ारिश पत्र हो।' },
    cost: { en: 'Loan — repay in monthly instalments', hi: 'कर्ज़ — मासिक किस्तों में चुकाएँ' },
    docs: ['aadhaar', 'bank', 'mobile', 'vendor'],
    how: [
      { en: 'Apply at pmsvanidhi.mohua.gov.in or a CSC', hi: 'pmsvanidhi.mohua.gov.in या CSC पर आवेदन करें' },
      { en: 'Bank verifies and disburses to your account', hi: 'बैंक जाँच करके खाते में पैसे डालता है' },
    ],
    where: { en: 'CSC / bank / city municipal office', hi: 'CSC / बैंक / नगर निगम कार्यालय' },
    site: 'https://pmsvanidhi.mohua.gov.in',
  },
  {
    id: 'bocw',
    name: 'Construction Workers Welfare Board',
    short: { en: 'State board benefits for building workers', hi: 'निर्माण मज़दूरों के लिए राज्य बोर्ड के लाभ' },
    needs: ['family', 'health', 'housing', 'id'],
    benefit: {
      en: 'Registered construction workers can get help for children’s education, maternity, tools, medical costs and housing — varies by state.',
      hi: 'पंजीकृत निर्माण मज़दूरों को बच्चों की पढ़ाई, प्रसूति, औज़ार, इलाज और घर के लिए मदद — हर राज्य में अलग।',
    },
    who: { en: 'Age 18–60, worked 90+ days in construction in the last year.', hi: 'उम्र 18–60, पिछले साल 90+ दिन निर्माण कार्य किया हो।' },
    cost: { en: 'Small registration fee (state-wise)', hi: 'छोटी रजिस्ट्रेशन फ़ीस (राज्य के अनुसार)' },
    docs: ['aadhaar', 'bank', 'photo', 'work90'],
    how: [
      { en: 'Get a 90-day work certificate from contractor or Naka work history', hi: 'ठेकेदार से या नाका के काम के रिकॉर्ड से 90 दिन का प्रमाण लें' },
      { en: 'Register at your state BOCW board office / portal', hi: 'राज्य BOCW बोर्ड कार्यालय / पोर्टल पर रजिस्टर करें' },
    ],
    where: { en: 'State labour office / board portal', hi: 'राज्य श्रम कार्यालय / बोर्ड पोर्टल' },
    site: 'https://labour.gov.in',
  },
  {
    id: 'onorc',
    name: 'One Nation One Ration Card',
    short: { en: 'Take your ration from any shop in India', hi: 'भारत की किसी भी राशन दुकान से राशन लें' },
    needs: ['food', 'family'],
    benefit: {
      en: 'Migrant workers can collect subsidised ration in the city where they work, while family back home collects too.',
      hi: 'प्रवासी मज़दूर जिस शहर में काम करते हैं वहीं सस्ता राशन ले सकते हैं, और गाँव में परिवार भी ले सकता है।',
    },
    who: { en: 'Anyone with an Aadhaar-linked ration card under NFSA.', hi: 'NFSA के तहत आधार से जुड़ा राशन कार्ड रखने वाला कोई भी।' },
    cost: { en: 'Free to use', hi: 'उपयोग मुफ़्त' },
    docs: ['ration', 'aadhaar'],
    how: [
      { en: 'Go to any fair price shop', hi: 'किसी भी सरकारी राशन दुकान पर जाएँ' },
      { en: 'Give ration card number and thumb on the machine', hi: 'राशन कार्ड नंबर बताएँ और मशीन पर अंगूठा लगाएँ' },
    ],
    where: { en: 'Any fair price shop / Mera Ration app', hi: 'कोई भी राशन दुकान / मेरा राशन ऐप' },
    helpline: '14445',
    site: 'https://nfsa.gov.in',
  },
  {
    id: 'pmay-u',
    name: 'PM Awas Yojana (Urban)',
    short: { en: 'Help to buy, build or rent a pucca house', hi: 'पक्का घर ख़रीदने, बनाने या किराए में मदद' },
    needs: ['housing', 'family'],
    benefit: {
      en: 'Support for affordable housing and rental homes for urban poor and migrant workers.',
      hi: 'शहरी गरीबों और प्रवासी मज़दूरों के लिए सस्ते घर और किराए के घरों में सहायता।',
    },
    who: { en: 'Economically weaker / low-income urban families without a pucca house.', hi: 'पक्के घर के बिना कम आय वाले शहरी परिवार।' },
    cost: { en: 'Depends on component', hi: 'घटक पर निर्भर' },
    docs: ['aadhaar', 'bank', 'income'],
    how: [
      { en: 'Apply on pmay-urban.gov.in or at the municipal office', hi: 'pmay-urban.gov.in या नगर निगम कार्यालय पर आवेदन करें' },
    ],
    where: { en: 'Municipal office / CSC', hi: 'नगर निगम कार्यालय / CSC' },
    site: 'https://pmay-urban.gov.in',
  },
];

export const DOCS: Record<string, { name: L; tip: L }> = {
  aadhaar: { name: { en: 'Aadhaar card', hi: 'आधार कार्ड' }, tip: { en: 'Mobile number should be linked for OTP.', hi: 'OTP के लिए मोबाइल नंबर जुड़ा होना चाहिए।' } },
  mobile: { name: { en: 'Mobile linked to Aadhaar', hi: 'आधार से जुड़ा मोबाइल' }, tip: { en: 'Update at any Aadhaar centre.', hi: 'किसी भी आधार केंद्र पर अपडेट करें।' } },
  bank: { name: { en: 'Bank account / passbook', hi: 'बैंक खाता / पासबुक' }, tip: { en: 'A zero-balance Jan Dhan account works.', hi: 'ज़ीरो बैलेंस जन धन खाता भी चलेगा।' } },
  ration: { name: { en: 'Ration card', hi: 'राशन कार्ड' }, tip: { en: 'Link it with Aadhaar at the ration shop.', hi: 'राशन दुकान पर आधार से जुड़वाएँ।' } },
  photo: { name: { en: 'Passport photos', hi: 'पासपोर्ट फ़ोटो' }, tip: { en: 'Keep 4 recent photos.', hi: '4 नई फ़ोटो रखें।' } },
  work90: { name: { en: '90-day work proof', hi: '90 दिन के काम का प्रमाण' }, tip: { en: 'Naka can print your verified work history.', hi: 'नाका आपका जाँचा हुआ काम का रिकॉर्ड प्रिंट कर सकता है।' } },
  vendor: { name: { en: 'Vending certificate / LoR', hi: 'वेंडिंग प्रमाणपत्र / सिफ़ारिश पत्र' }, tip: { en: 'From your city municipal office.', hi: 'अपने नगर निगम कार्यालय से।' } },
  income: { name: { en: 'Income certificate', hi: 'आय प्रमाणपत्र' }, tip: { en: 'From tehsil office or self-declaration.', hi: 'तहसील कार्यालय से या स्व-घोषणा।' } },
};

export const HELPLINES: { name: L; number: string; what: L }[] = [
  { name: { en: 'Emergency', hi: 'आपातकाल' }, number: '112', what: { en: 'Police, fire, ambulance', hi: 'पुलिस, फ़ायर, एम्बुलेंस' } },
  { name: { en: 'Women helpline', hi: 'महिला हेल्पलाइन' }, number: '181', what: { en: 'Harassment or violence', hi: 'उत्पीड़न या हिंसा' } },
  { name: { en: 'e-Shram helpline', hi: 'ई-श्रम हेल्पलाइन' }, number: '14434', what: { en: 'Worker registration help', hi: 'मज़दूर पंजीकरण में मदद' } },
  { name: { en: 'Free legal aid (NALSA)', hi: 'मुफ़्त क़ानूनी मदद (NALSA)' }, number: '15100', what: { en: 'Unpaid wages, cheating, disputes', hi: 'मज़दूरी न मिलना, धोखा, विवाद' } },
  { name: { en: 'Childline', hi: 'चाइल्डलाइन' }, number: '1098', what: { en: 'Child labour or a child in danger', hi: 'बाल मज़दूरी या ख़तरे में बच्चा' } },
  { name: { en: 'Cyber fraud', hi: 'साइबर फ़्रॉड' }, number: '1930', what: { en: 'Money taken by online scam', hi: 'ऑनलाइन धोखे से पैसे गए' } },
];

export const RIGHTS: { title: L; body: L; law: string }[] = [
  {
    title: { en: 'At least minimum wage', hi: 'कम से कम न्यूनतम मज़दूरी' },
    body: { en: 'Every state notifies a minimum daily wage for each skill level. Paying less is illegal — for men and women equally.', hi: 'हर राज्य हर कौशल स्तर के लिए न्यूनतम दैनिक मज़दूरी तय करता है। उससे कम देना ग़ैरक़ानूनी है — पुरुष और महिला दोनों के लिए बराबर।' },
    law: 'Code on Wages, 2019',
  },
  {
    title: { en: 'Paid on time, in full', hi: 'समय पर, पूरा भुगतान' },
    body: { en: 'Daily workers must be paid at the end of the shift; weekly workers on the last day of the week. No cuts without reason.', hi: 'दिहाड़ी मज़दूरों को शिफ़्ट ख़त्म होते ही; साप्ताहिक को हफ़्ते के आख़िरी दिन भुगतान होना चाहिए। बिना कारण कटौती नहीं।' },
    law: 'Code on Wages, 2019',
  },
  {
    title: { en: 'Overtime is paid double', hi: 'ओवरटाइम का दोगुना पैसा' },
    body: { en: 'Work beyond the normal working day must be paid at twice the normal rate.', hi: 'तय समय से ज़्यादा काम का भुगतान सामान्य दर से दोगुना होना चाहिए।' },
    law: 'Code on Wages, 2019',
  },
  {
    title: { en: 'Safe workplace & gear', hi: 'सुरक्षित काम की जगह और सामान' },
    body: { en: 'On building sites you must get a helmet, and a harness when working at height. Drinking water and first aid must be available.', hi: 'बिल्डिंग साइट पर हेलमेट, और ऊँचाई पर काम के लिए हार्नेस मिलना चाहिए। पीने का पानी और प्राथमिक उपचार होना चाहिए।' },
    law: 'OSH Code, 2020',
  },
  {
    title: { en: 'No forced or bonded work', hi: 'कोई बंधुआ या ज़बरदस्ती का काम नहीं' },
    body: { en: 'No one can keep your documents or stop you from leaving because of an advance or loan.', hi: 'कोई भी एडवांस या कर्ज़ के कारण आपके कागज़ नहीं रख सकता, न आपको जाने से रोक सकता है।' },
    law: 'Bonded Labour System (Abolition) Act, 1976',
  },
  {
    title: { en: 'Safety from harassment', hi: 'उत्पीड़न से सुरक्षा' },
    body: { en: 'Women in informal work can complain to the Local Committee of their district.', hi: 'असंगठित काम करने वाली महिलाएँ अपने ज़िले की लोकल कमेटी में शिकायत कर सकती हैं।' },
    law: 'POSH Act, 2013',
  },
];
