import type { L, Scheme, SchemeNeed } from './types';

/* Summaries of real central-government schemes, simplified for a demo.
   Amounts/eligibility change, the UI always links to the official site and
   asks users to confirm there or at a CSC (Common Service Centre). */

export const NEEDS: Record<SchemeNeed, { label: L }> = {
  id: { label: { en: 'Worker ID card', hi: 'मज़दूर पहचान पत्र', mr: 'कामगार ओळखपत्र', gu: 'કામદાર ઓળખ કાર્ડ' } },
  health: { label: { en: 'Hospital & health', hi: 'अस्पताल और इलाज', mr: 'हॉस्पिटल आणि उपचार', gu: 'હૉસ્પિટલ અને સારવાર' } },
  insurance: { label: { en: 'Accident & life cover', hi: 'दुर्घटना और जीवन बीमा', mr: 'अपघात आणि जीवन विमा', gu: 'અકસ્માત અને જીવન વીમો' } },
  pension: { label: { en: 'Pension in old age', hi: 'बुढ़ापे में पेंशन', mr: 'म्हातारपणी पेन्शन', gu: 'ઘડપણમાં પેન્શન' } },
  loan: { label: { en: 'Small loan', hi: 'छोटा कर्ज़', mr: 'छोटे कर्ज', gu: 'નાની લોન' } },
  housing: { label: { en: 'House', hi: 'घर', mr: 'घर', gu: 'ઘર' } },
  food: { label: { en: 'Ration', hi: 'राशन', mr: 'रेशन', gu: 'રાશન' } },
  family: { label: { en: 'Children & family', hi: 'बच्चे और परिवार', mr: 'मुले आणि कुटुंब', gu: 'બાળકો અને પરિવાર' } },
};

export const SCHEMES: Scheme[] = [
  {
    id: 'e-shram',
    name: 'e-Shram',
    short: { en: 'National ID card for unorganised workers', hi: 'असंगठित मज़दूरों का राष्ट्रीय पहचान पत्र', mr: 'असंघटित कामगारांचे राष्ट्रीय ओळखपत्र', gu: 'અસંગઠિત કામદારો માટે રાષ્ટ્રીય ઓળખ કાર્ડ' },
    needs: ['id', 'insurance'],
    benefit: {
      en: 'A 12-digit UAN card that proves you are a worker. It is the door to many other schemes and helps the government reach you in emergencies.',
      hi: '12 अंकों का UAN कार्ड जो साबित करता है कि आप मज़दूर हैं। इससे कई दूसरी योजनाओं का रास्ता खुलता है और आपदा में सरकार आप तक पहुँच पाती है।',
      mr: '12 अंकी UAN कार्ड, जे तुम्ही कामगार आहात हे दाखवते. यामुळे इतर अनेक योजनांचा रस्ता खुला होतो आणि संकटाच्या वेळी सरकार तुमच्यापर्यंत पोहोचू शकते.',
      gu: '12 અંકનું UAN કાર્ડ, જે બતાવે છે કે તમે કામદાર છો. તેનાથી બીજી ઘણી યોજનાઓનો રસ્તો ખૂલે છે અને મુશ્કેલીના સમયે સરકાર તમારા સુધી પહોંચી શકે છે.',
    },
    who: { en: 'Age 16-59, working in the unorganised sector, not paying income tax, not in EPFO/ESIC.', hi: 'उम्र 16-59, असंगठित क्षेत्र में काम, इनकम टैक्स नहीं भरते, EPFO/ESIC में नहीं।', mr: 'वय 16-59, असंघटित क्षेत्रात काम, इन्कम टॅक्स भरत नाही, EPFO/ESIC मध्ये नाही.', gu: 'ઉંમર 16-59, અસંગઠિત ક્ષેત્રમાં કામ, ઇન્કમ ટેક્સ ભરતા નથી, EPFO/ESICમાં નથી.' },
    cost: { en: 'Free', hi: 'मुफ़्त', mr: 'मोफत', gu: 'મફત' },
    docs: ['aadhaar', 'mobile', 'bank'],
    how: [
      { en: 'Go to a CSC centre or open eshram.gov.in', hi: 'CSC सेंटर जाएँ या eshram.gov.in खोलें', mr: 'CSC केंद्रात जा किंवा eshram.gov.in उघडा', gu: 'CSC કેન્દ્ર પર જાઓ અથવા eshram.gov.in ખોલો' },
      { en: 'Verify with Aadhaar OTP', hi: 'आधार OTP से पुष्टि करें', mr: 'आधार OTP ने खात्री करा', gu: 'આધાર OTPથી ખાતરી કરો' },
      { en: 'Fill trade, address and bank, download your card', hi: 'काम, पता और बैंक भरें, कार्ड डाउनलोड करें', mr: 'काम, पत्ता आणि बँकेची माहिती भरा, कार्ड डाउनलोड करा', gu: 'કામ, સરનામું અને બેંકની વિગત ભરો, કાર્ડ ડાઉનલોડ કરો' },
    ],
    where: { en: 'CSC centre / eshram.gov.in', hi: 'CSC सेंटर / eshram.gov.in', mr: 'CSC केंद्र / eshram.gov.in', gu: 'CSC કેન્દ્ર / eshram.gov.in' },
    helpline: '14434',
    site: 'https://eshram.gov.in',
  },
  {
    id: 'pm-sym',
    name: 'PM Shram Yogi Maan-dhan',
    short: { en: 'Pension of ₹3,000 a month after 60', hi: '60 के बाद ₹3,000 महीना पेंशन', mr: '60 नंतर दर महिना ₹3,000 पेन्शन', gu: '60 પછી દર મહિને ₹3,000 પેન્શન' },
    needs: ['pension'],
    benefit: {
      en: 'You save a small amount every month; the government adds the same amount. After age 60 you get an assured monthly pension.',
      hi: 'आप हर महीने थोड़ा पैसा जमा करते हैं; सरकार भी उतना ही जोड़ती है। 60 की उम्र के बाद पक्की मासिक पेंशन मिलती है।',
      mr: 'तुम्ही दर महिन्याला थोडे पैसे भरता; सरकारही तेवढेच पैसे भरते. 60 वर्षांनंतर दर महिन्याला पक्की पेन्शन मिळते.',
      gu: 'તમે દર મહિને થોડા પૈસા જમા કરો છો; સરકાર પણ એટલા જ ઉમેરે છે. 60 વર્ષ પછી દર મહિને પાકું પેન્શન મળે છે.',
    },
    who: { en: 'Age 18-40, monthly income up to ₹15,000, unorganised worker.', hi: 'उम्र 18-40, मासिक आमदनी ₹15,000 तक, असंगठित मज़दूर।', mr: 'वय 18-40, महिन्याचे उत्पन्न ₹15,000 पर्यंत, असंघटित कामगार.', gu: 'ઉંમર 18-40, મહિનાની આવક ₹15,000 સુધી, અસંગઠિત કામદાર.' },
    cost: { en: '₹55-₹200 per month depending on age', hi: 'उम्र के अनुसार ₹55-₹200 महीना', mr: 'वयानुसार दर महिना ₹55-₹200', gu: 'ઉંમર પ્રમાણે દર મહિને ₹55-₹200' },
    docs: ['aadhaar', 'bank', 'mobile'],
    how: [
      { en: 'Visit a CSC with Aadhaar and bank passbook', hi: 'आधार और बैंक पासबुक लेकर CSC जाएँ', mr: 'आधार आणि बँक पासबुक घेऊन CSC मध्ये जा', gu: 'આધાર અને બેંક પાસબુક લઈને CSC પર જાઓ' },
      { en: 'Give auto-debit consent for the monthly amount', hi: 'महीने की रकम के ऑटो-डेबिट की सहमति दें', mr: 'महिन्याचे पैसे खात्यातून आपोआप कापले जाण्यासाठी (ऑटो-डेबिट) संमती द्या', gu: 'મહિનાની રકમ ખાતામાંથી આપમેળે કપાય (ઑટો-ડેબિટ) તે માટે સંમતિ આપો' },
      { en: 'Get your Shram Yogi pension card', hi: 'श्रम योगी पेंशन कार्ड पाएँ', mr: 'तुमचे श्रम योगी पेन्शन कार्ड घ्या', gu: 'તમારું શ્રમ યોગી પેન્શન કાર્ડ મેળવો' },
    ],
    where: { en: 'CSC centre / maandhan.in', hi: 'CSC सेंटर / maandhan.in', mr: 'CSC केंद्र / maandhan.in', gu: 'CSC કેન્દ્ર / maandhan.in' },
    helpline: '1800 267 6888',
    site: 'https://maandhan.in',
  },
  {
    id: 'pmsby',
    name: 'PM Suraksha Bima Yojana',
    short: { en: '₹2 lakh accident cover for ₹20 a year', hi: '₹20 साल में ₹2 लाख का दुर्घटना बीमा', mr: 'वर्षाला ₹20 मध्ये ₹2 लाखांचा अपघात विमा', gu: 'વર્ષે ₹20માં ₹2 લાખનો અકસ્માત વીમો' },
    needs: ['insurance'],
    benefit: {
      en: 'If you die or are fully disabled in an accident, your family gets ₹2 lakh. Partial disability: ₹1 lakh.',
      hi: 'दुर्घटना में मृत्यु या पूरी विकलांगता पर परिवार को ₹2 लाख। आंशिक विकलांगता पर ₹1 लाख।',
      mr: 'अपघातात मृत्यू झाला किंवा पूर्ण अपंगत्व आले तर कुटुंबाला ₹2 लाख. थोडे अपंगत्व आले तर ₹1 लाख.',
      gu: 'અકસ્માતમાં મૃત્યુ થાય કે પૂરી વિકલાંગતા આવે તો પરિવારને ₹2 લાખ. થોડી વિકલાંગતા આવે તો ₹1 લાખ.',
    },
    who: { en: 'Age 18-70 with a bank account.', hi: 'उम्र 18-70, बैंक खाता हो।', mr: 'वय 18-70, बँक खाते असावे.', gu: 'ઉંમર 18-70, બેંક ખાતું હોવું જોઈએ.' },
    cost: { en: '₹20 per year, auto-debited', hi: '₹20 सालाना, खाते से अपने-आप कटेगा', mr: 'वर्षाला ₹20, खात्यातून आपोआप कापले जातील', gu: 'વર્ષે ₹20, ખાતામાંથી આપમેળે કપાશે' },
    docs: ['aadhaar', 'bank'],
    how: [
      { en: 'Ask at your bank branch or bank mitra', hi: 'अपनी बैंक शाखा या बैंक मित्र से पूछें', mr: 'तुमच्या बँकेच्या शाखेत किंवा बँक मित्राला विचारा', gu: 'તમારી બેંકની શાખામાં અથવા બેંક મિત્રને પૂછો' },
      { en: 'Fill the one-page form, add a nominee', hi: 'एक पन्ने का फ़ॉर्म भरें, नॉमिनी जोड़ें', mr: 'एका पानाचा फॉर्म भरा, नॉमिनीचे नाव द्या', gu: 'એક પાનાનું ફૉર્મ ભરો, નૉમિનીનું નામ ઉમેરો' },
    ],
    where: { en: 'Your bank / post office', hi: 'आपका बैंक / डाकघर', mr: 'तुमची बँक / पोस्ट ऑफिस', gu: 'તમારી બેંક / પોસ્ટ ઑફિસ' },
    site: 'https://jansuraksha.gov.in',
  },
  {
    id: 'pmjjby',
    name: 'PM Jeevan Jyoti Bima Yojana',
    short: { en: '₹2 lakh life cover for ₹436 a year', hi: '₹436 साल में ₹2 लाख का जीवन बीमा', mr: 'वर्षाला ₹436 मध्ये ₹2 लाखांचा जीवन विमा', gu: 'વર્ષે ₹436માં ₹2 લાખનો જીવન વીમો' },
    needs: ['insurance', 'family'],
    benefit: { en: 'Your family gets ₹2 lakh if you die for any reason.', hi: 'किसी भी कारण से मृत्यु पर परिवार को ₹2 लाख मिलते हैं।', mr: 'कोणत्याही कारणाने मृत्यू झाला तर कुटुंबाला ₹2 लाख मिळतात.', gu: 'કોઈ પણ કારણે મૃત્યુ થાય તો પરિવારને ₹2 લાખ મળે છે.' },
    who: { en: 'Age 18-50 with a bank account.', hi: 'उम्र 18-50, बैंक खाता हो।', mr: 'वय 18-50, बँक खाते असावे.', gu: 'ઉંમર 18-50, બેંક ખાતું હોવું જોઈએ.' },
    cost: { en: '₹436 per year', hi: '₹436 सालाना', mr: 'वर्षाला ₹436', gu: 'વર્ષે ₹436' },
    docs: ['aadhaar', 'bank'],
    how: [
      { en: 'Ask at your bank branch', hi: 'अपनी बैंक शाखा में पूछें', mr: 'तुमच्या बँकेच्या शाखेत विचारा', gu: 'તમારી બેંકની શાખામાં પૂછો' },
      { en: 'Sign the consent-cum-declaration form', hi: 'सहमति-घोषणा फ़ॉर्म पर साइन करें', mr: 'संमती-घोषणा फॉर्मवर सही करा', gu: 'સંમતિ-જાહેરાત ફૉર્મ પર સહી કરો' },
    ],
    where: { en: 'Your bank / post office', hi: 'आपका बैंक / डाकघर', mr: 'तुमची बँक / पोस्ट ऑफिस', gu: 'તમારી બેંક / પોસ્ટ ઑફિસ' },
    site: 'https://jansuraksha.gov.in',
  },
  {
    id: 'pm-jay',
    name: 'Ayushman Bharat PM-JAY',
    short: { en: 'Free hospital treatment up to ₹5 lakh', hi: '₹5 लाख तक मुफ़्त अस्पताल इलाज', mr: '₹5 लाखांपर्यंत हॉस्पिटलमध्ये मोफत उपचार', gu: '₹5 લાખ સુધી મફત હૉસ્પિટલ સારવાર' },
    needs: ['health', 'family'],
    benefit: {
      en: 'Cashless treatment for your family at listed government and private hospitals, every year.',
      hi: 'सूचीबद्ध सरकारी और निजी अस्पतालों में परिवार का कैशलेस इलाज, हर साल।',
      mr: 'यादीतील सरकारी आणि खाजगी हॉस्पिटलमध्ये कुटुंबाचे कॅशलेस उपचार, दरवर्षी.',
      gu: 'યાદીમાંની સરકારી અને ખાનગી હૉસ્પિટલોમાં પરિવારની કૅશલેસ સારવાર, દર વર્ષે.',
    },
    who: { en: 'Eligible poor & vulnerable families (check your name with Aadhaar or ration card).', hi: 'पात्र गरीब और कमज़ोर परिवार (आधार या राशन कार्ड से नाम जाँचें)।', mr: 'पात्र गरीब आणि दुर्बल कुटुंबे (आधार किंवा रेशन कार्डने तुमचे नाव तपासा).', gu: 'પાત્ર ગરીબ અને નબળા પરિવારો (આધાર અથવા રાશન કાર્ડથી તમારું નામ તપાસો).' },
    cost: { en: 'Free', hi: 'मुफ़्त', mr: 'मोफत', gu: 'મફત' },
    docs: ['aadhaar', 'ration'],
    how: [
      { en: 'Check eligibility at beneficiary.nha.gov.in', hi: 'beneficiary.nha.gov.in पर पात्रता देखें', mr: 'beneficiary.nha.gov.in वर पात्रता तपासा', gu: 'beneficiary.nha.gov.in પર પાત્રતા તપાસો' },
      { en: 'Get your Ayushman card made at a CSC or hospital Arogya Mitra desk', hi: 'CSC या अस्पताल के आरोग्य मित्र डेस्क पर आयुष्मान कार्ड बनवाएँ', mr: 'CSC मध्ये किंवा हॉस्पिटलच्या आरोग्य मित्र डेस्कवर आयुष्मान कार्ड काढून घ्या', gu: 'CSC પર અથવા હૉસ્પિટલના આરોગ્ય મિત્ર ડેસ્ક પર આયુષ્માન કાર્ડ બનાવડાવો' },
    ],
    where: { en: 'CSC / empanelled hospital', hi: 'CSC / सूचीबद्ध अस्पताल', mr: 'CSC / यादीतील हॉस्पिटल', gu: 'CSC / યાદીમાંની હૉસ્પિટલ' },
    helpline: '14555',
    site: 'https://pmjay.gov.in',
  },
  {
    id: 'pm-svanidhi',
    name: 'PM SVANidhi',
    short: { en: 'Working-capital loan for street vendors', hi: 'रेहड़ी-पटरी वालों के लिए कारोबारी कर्ज़', mr: 'फेरीवाल्यांसाठी धंद्याचे कर्ज', gu: 'લારી-ગલ્લાવાળા માટે ધંધાની લોન' },
    needs: ['loan'],
    benefit: {
      en: 'Small collateral-free loans in steps, with interest subsidy for paying on time and cashback on digital payments.',
      hi: 'बिना गारंटी के छोटे कर्ज़ किस्तों में, समय पर चुकाने पर ब्याज सब्सिडी और डिजिटल भुगतान पर कैशबैक।',
      mr: 'हमीशिवाय छोटे कर्ज टप्प्याटप्प्याने; वेळेवर फेडल्यास व्याजात सूट आणि डिजिटल पेमेंटवर कॅशबॅक.',
      gu: 'ગેરંટી વગર નાની લોન તબક્કાવાર; સમયસર ચૂકવો તો વ્યાજમાં રાહત અને ડિજિટલ પેમેન્ટ પર કૅશબૅક.',
    },
    who: { en: 'Street vendors and hawkers with a vending certificate or recommendation letter from the city body.', hi: 'रेहड़ी-पटरी विक्रेता जिनके पास नगर निगम का प्रमाणपत्र या सिफ़ारिश पत्र हो।', mr: 'नगरपालिकेचे व्हेंडिंग प्रमाणपत्र किंवा शिफारस पत्र असलेले फेरीवाले.', gu: 'નગરપાલિકાનું વેન્ડિંગ પ્રમાણપત્ર કે ભલામણ પત્ર ધરાવતા લારી-ગલ્લાવાળા અને ફેરિયા.' },
    cost: { en: 'Loan, repay in monthly instalments', hi: 'कर्ज़, मासिक किस्तों में चुकाएँ', mr: 'कर्ज, महिन्याच्या हप्त्यांत फेडा', gu: 'લોન, મહિનાના હપ્તામાં ચૂકવો' },
    docs: ['aadhaar', 'bank', 'mobile', 'vendor'],
    how: [
      { en: 'Apply at pmsvanidhi.mohua.gov.in or a CSC', hi: 'pmsvanidhi.mohua.gov.in या CSC पर आवेदन करें', mr: 'pmsvanidhi.mohua.gov.in वर किंवा CSC मध्ये अर्ज करा', gu: 'pmsvanidhi.mohua.gov.in પર અથવા CSC પર અરજી કરો' },
      { en: 'Bank verifies and disburses to your account', hi: 'बैंक जाँच करके खाते में पैसे डालता है', mr: 'बँक तपासणी करून तुमच्या खात्यात पैसे जमा करते', gu: 'બેંક તપાસ કરીને તમારા ખાતામાં પૈસા જમા કરે છે' },
    ],
    where: { en: 'CSC / bank / city municipal office', hi: 'CSC / बैंक / नगर निगम कार्यालय', mr: 'CSC / बँक / नगरपालिका कार्यालय', gu: 'CSC / બેંક / નગરપાલિકા કચેરી' },
    site: 'https://pmsvanidhi.mohua.gov.in',
  },
  {
    id: 'bocw',
    name: 'Construction Workers Welfare Board',
    short: { en: 'State board benefits for building workers', hi: 'निर्माण मज़दूरों के लिए राज्य बोर्ड के लाभ', mr: 'बांधकाम कामगारांसाठी राज्य मंडळाचे लाभ', gu: 'બાંધકામ કામદારો માટે રાજ્ય બોર્ડના લાભ' },
    needs: ['family', 'health', 'housing', 'id'],
    benefit: {
      en: 'Registered construction workers can get help for children’s education, maternity, tools, medical costs and housing, varies by state.',
      hi: 'पंजीकृत निर्माण मज़दूरों को बच्चों की पढ़ाई, प्रसूति, औज़ार, इलाज और घर के लिए मदद, हर राज्य में अलग।',
      mr: 'नोंदणी केलेल्या बांधकाम कामगारांना मुलांचे शिक्षण, बाळंतपण, अवजारे, उपचारांचा खर्च आणि घरासाठी मदत मिळू शकते, प्रत्येक राज्यात वेगळी.',
      gu: 'નોંધાયેલા બાંધકામ કામદારોને બાળકોના ભણતર, પ્રસૂતિ, ઓજારો, સારવારના ખર્ચ અને ઘર માટે મદદ મળી શકે છે, દરેક રાજ્યમાં અલગ.',
    },
    who: { en: 'Age 18-60, worked 90+ days in construction in the last year.', hi: 'उम्र 18-60, पिछले साल 90+ दिन निर्माण कार्य किया हो।', mr: 'वय 18-60, मागच्या वर्षी 90+ दिवस बांधकामावर काम केलेले असावे.', gu: 'ઉંમર 18-60, ગયા વર્ષે 90+ દિવસ બાંધકામમાં કામ કર્યું હોય.' },
    cost: { en: 'Small registration fee (state-wise)', hi: 'छोटी रजिस्ट्रेशन फ़ीस (राज्य के अनुसार)', mr: 'थोडी नोंदणी फी (राज्यानुसार)', gu: 'થોડી નોંધણી ફી (રાજ્ય પ્રમાણે)' },
    docs: ['aadhaar', 'bank', 'photo', 'work90'],
    how: [
      { en: 'Get a 90-day work certificate from contractor or Naka work history', hi: 'ठेकेदार से या नाका के काम के रिकॉर्ड से 90 दिन का प्रमाण लें', mr: 'ठेकेदाराकडून किंवा नाका वरील कामाच्या नोंदीतून 90 दिवसांच्या कामाचा दाखला घ्या', gu: 'ઠેકેદાર પાસેથી અથવા નાકા પરના કામના રેકોર્ડમાંથી 90 દિવસના કામનો દાખલો લો' },
      { en: 'Register at your state BOCW board office / portal', hi: 'राज्य BOCW बोर्ड कार्यालय / पोर्टल पर रजिस्टर करें', mr: 'तुमच्या राज्याच्या BOCW मंडळ कार्यालयात / पोर्टलवर नोंदणी करा', gu: 'તમારા રાજ્યની BOCW બોર્ડ કચેરી / પોર્ટલ પર નોંધણી કરો' },
    ],
    where: { en: 'State labour office / board portal', hi: 'राज्य श्रम कार्यालय / बोर्ड पोर्टल', mr: 'राज्य कामगार कार्यालय / मंडळाचे पोर्टल', gu: 'રાજ્ય શ્રમ કચેરી / બોર્ડનું પોર્ટલ' },
    site: 'https://labour.gov.in',
  },
  {
    id: 'onorc',
    name: 'One Nation One Ration Card',
    short: { en: 'Take your ration from any shop in India', hi: 'भारत की किसी भी राशन दुकान से राशन लें', mr: 'भारतातील कोणत्याही रेशन दुकानातून रेशन घ्या', gu: 'ભારતની કોઈ પણ રાશન દુકાનેથી રાશન લો' },
    needs: ['food', 'family'],
    benefit: {
      en: 'Migrant workers can collect subsidised ration in the city where they work, while family back home collects too.',
      hi: 'प्रवासी मज़दूर जिस शहर में काम करते हैं वहीं सस्ता राशन ले सकते हैं, और गाँव में परिवार भी ले सकता है।',
      mr: 'बाहेरगावाहून आलेले कामगार ज्या शहरात काम करतात तिथेच स्वस्त रेशन घेऊ शकतात, आणि गावाकडे कुटुंबही घेऊ शकते.',
      gu: 'બહારગામથી આવેલા કામદારો જે શહેરમાં કામ કરે છે ત્યાં જ સસ્તું રાશન લઈ શકે છે, અને ગામમાં પરિવાર પણ લઈ શકે છે.',
    },
    who: { en: 'Anyone with an Aadhaar-linked ration card under NFSA.', hi: 'NFSA के तहत आधार से जुड़ा राशन कार्ड रखने वाला कोई भी।', mr: 'NFSA अंतर्गत आधारशी जोडलेले रेशन कार्ड असलेले कोणीही.', gu: 'NFSA હેઠળ આધાર સાથે જોડાયેલું રાશન કાર્ડ ધરાવનાર કોઈ પણ.' },
    cost: { en: 'Free to use', hi: 'उपयोग मुफ़्त', mr: 'वापर मोफत', gu: 'વાપરવું મફત' },
    docs: ['ration', 'aadhaar'],
    how: [
      { en: 'Go to any fair price shop', hi: 'किसी भी सरकारी राशन दुकान पर जाएँ', mr: 'कोणत्याही सरकारी रेशन दुकानात जा', gu: 'કોઈ પણ સરકારી રાશન દુકાને જાઓ' },
      { en: 'Give ration card number and thumb on the machine', hi: 'राशन कार्ड नंबर बताएँ और मशीन पर अंगूठा लगाएँ', mr: 'रेशन कार्ड नंबर सांगा आणि मशीनवर अंगठा लावा', gu: 'રાશન કાર્ડ નંબર કહો અને મશીન પર અંગૂઠો મૂકો' },
    ],
    where: { en: 'Any fair price shop / Mera Ration app', hi: 'कोई भी राशन दुकान / मेरा राशन ऐप', mr: 'कोणतेही रेशन दुकान / मेरा राशन ॲप', gu: 'કોઈ પણ રાશન દુકાન / મેરા રાશન ઍપ' },
    helpline: '14445',
    site: 'https://nfsa.gov.in',
  },
  {
    id: 'pmay-u',
    name: 'PM Awas Yojana (Urban)',
    short: { en: 'Help to buy, build or rent a pucca house', hi: 'पक्का घर ख़रीदने, बनाने या किराए में मदद', mr: 'पक्के घर घेण्यासाठी, बांधण्यासाठी किंवा भाड्याने घेण्यासाठी मदत', gu: 'પાકું ઘર ખરીદવા, બાંધવા કે ભાડે લેવા માટે મદદ' },
    needs: ['housing', 'family'],
    benefit: {
      en: 'Support for affordable housing and rental homes for urban poor and migrant workers.',
      hi: 'शहरी गरीबों और प्रवासी मज़दूरों के लिए सस्ते घर और किराए के घरों में सहायता।',
      mr: 'शहरातील गरीब आणि बाहेरगावाहून आलेल्या कामगारांसाठी स्वस्त घरे आणि भाड्याच्या घरांसाठी मदत.',
      gu: 'શહેરના ગરીબો અને બહારગામથી આવેલા કામદારો માટે સસ્તાં ઘર અને ભાડાનાં ઘરમાં મદદ.',
    },
    who: { en: 'Economically weaker / low-income urban families without a pucca house.', hi: 'पक्के घर के बिना कम आय वाले शहरी परिवार।', mr: 'पक्के घर नसलेली कमी उत्पन्नाची शहरी कुटुंबे.', gu: 'પાકું ઘર ન હોય એવા ઓછી આવકવાળા શહેરી પરિવારો.' },
    cost: { en: 'Depends on component', hi: 'घटक पर निर्भर', mr: 'योजनेच्या भागानुसार', gu: 'યોજનાના ભાગ પ્રમાણે' },
    docs: ['aadhaar', 'bank', 'income'],
    how: [
      { en: 'Apply on pmay-urban.gov.in or at the municipal office', hi: 'pmay-urban.gov.in या नगर निगम कार्यालय पर आवेदन करें', mr: 'pmay-urban.gov.in वर किंवा नगरपालिका कार्यालयात अर्ज करा', gu: 'pmay-urban.gov.in પર અથવા નગરપાલિકા કચેરીમાં અરજી કરો' },
    ],
    where: { en: 'Municipal office / CSC', hi: 'नगर निगम कार्यालय / CSC', mr: 'नगरपालिका कार्यालय / CSC', gu: 'નગરપાલિકા કચેરી / CSC' },
    site: 'https://pmay-urban.gov.in',
  },
];

export const DOCS: Record<string, { name: L; tip: L }> = {
  aadhaar: { name: { en: 'Aadhaar card', hi: 'आधार कार्ड', mr: 'आधार कार्ड', gu: 'આધાર કાર્ડ' }, tip: { en: 'Mobile number should be linked for OTP.', hi: 'OTP के लिए मोबाइल नंबर जुड़ा होना चाहिए।', mr: 'OTP साठी मोबाईल नंबर आधारशी जोडलेला असावा.', gu: 'OTP માટે મોબાઇલ નંબર આધાર સાથે જોડાયેલો હોવો જોઈએ.' } },
  mobile: { name: { en: 'Mobile linked to Aadhaar', hi: 'आधार से जुड़ा मोबाइल', mr: 'आधारशी जोडलेला मोबाईल', gu: 'આધાર સાથે જોડાયેલો મોબાઇલ' }, tip: { en: 'Update at any Aadhaar centre.', hi: 'किसी भी आधार केंद्र पर अपडेट करें।', mr: 'कोणत्याही आधार केंद्रात अपडेट करा.', gu: 'કોઈ પણ આધાર કેન્દ્ર પર અપડેટ કરો.' } },
  bank: { name: { en: 'Bank account / passbook', hi: 'बैंक खाता / पासबुक', mr: 'बँक खाते / पासबुक', gu: 'બેંક ખાતું / પાસબુક' }, tip: { en: 'A zero-balance Jan Dhan account works.', hi: 'ज़ीरो बैलेंस जन धन खाता भी चलेगा।', mr: 'झिरो बॅलन्स जन धन खातेही चालेल.', gu: 'ઝીરો બેલેન્સ જન ધન ખાતું પણ ચાલશે.' } },
  ration: { name: { en: 'Ration card', hi: 'राशन कार्ड', mr: 'रेशन कार्ड', gu: 'રાશન કાર્ડ' }, tip: { en: 'Link it with Aadhaar at the ration shop.', hi: 'राशन दुकान पर आधार से जुड़वाएँ।', mr: 'रेशन दुकानात आधारशी जोडून घ्या.', gu: 'રાશનની દુકાને આધાર સાથે જોડાવી લો.' } },
  photo: { name: { en: 'Passport photos', hi: 'पासपोर्ट फ़ोटो', mr: 'पासपोर्ट फोटो', gu: 'પાસપોર્ટ ફોટો' }, tip: { en: 'Keep 4 recent photos.', hi: '4 नई फ़ोटो रखें।', mr: '4 नवीन फोटो जवळ ठेवा.', gu: '4 નવા ફોટા સાથે રાખો.' } },
  work90: { name: { en: '90-day work proof', hi: '90 दिन के काम का प्रमाण', mr: '90 दिवसांच्या कामाचा पुरावा', gu: '90 દિવસના કામનો પુરાવો' }, tip: { en: 'Naka can print your verified work history.', hi: 'नाका आपका जाँचा हुआ काम का रिकॉर्ड प्रिंट कर सकता है।', mr: 'नाका तुमच्या कामाची पडताळलेली नोंद प्रिंट करून देऊ शकते.', gu: 'નાકા તમારા કામનો ચકાસાયેલ રેકોર્ડ પ્રિન્ટ કરી આપી શકે છે.' } },
  vendor: { name: { en: 'Vending certificate / LoR', hi: 'वेंडिंग प्रमाणपत्र / सिफ़ारिश पत्र', mr: 'व्हेंडिंग प्रमाणपत्र / शिफारस पत्र', gu: 'વેન્ડિંગ પ્રમાણપત્ર / ભલામણ પત્ર' }, tip: { en: 'From your city municipal office.', hi: 'अपने नगर निगम कार्यालय से।', mr: 'तुमच्या शहराच्या नगरपालिका कार्यालयातून.', gu: 'તમારા શહેરની નગરપાલિકા કચેરીમાંથી.' } },
  income: { name: { en: 'Income certificate', hi: 'आय प्रमाणपत्र', mr: 'उत्पन्नाचा दाखला', gu: 'આવકનો દાખલો' }, tip: { en: 'From tehsil office or self-declaration.', hi: 'तहसील कार्यालय से या स्व-घोषणा।', mr: 'तहसील कार्यालयातून किंवा स्वतःचे घोषणापत्र.', gu: 'મામલતદાર કચેરીમાંથી અથવા સ્વ-ઘોષણાપત્ર.' } },
};

export const HELPLINES: { name: L; number: string; what: L }[] = [
  { name: { en: 'Emergency', hi: 'आपातकाल', mr: 'आणीबाणी', gu: 'ઇમરજન્સી' }, number: '112', what: { en: 'Police, fire, ambulance', hi: 'पुलिस, फ़ायर, एम्बुलेंस', mr: 'पोलीस, अग्निशमन, ॲम्ब्युलन्स', gu: 'પોલીસ, ફાયર, ઍમ્બ્યુલન્સ' } },
  { name: { en: 'Women helpline', hi: 'महिला हेल्पलाइन', mr: 'महिला हेल्पलाइन', gu: 'મહિલા હેલ્પલાઇન' }, number: '181', what: { en: 'Harassment or violence', hi: 'उत्पीड़न या हिंसा', mr: 'छळ किंवा हिंसा', gu: 'હેરાનગતિ કે હિંસા' } },
  { name: { en: 'e-Shram helpline', hi: 'ई-श्रम हेल्पलाइन', mr: 'ई-श्रम हेल्पलाइन', gu: 'ઈ-શ્રમ હેલ્પલાઇન' }, number: '14434', what: { en: 'Worker registration help', hi: 'मज़दूर पंजीकरण में मदद', mr: 'कामगार नोंदणीसाठी मदत', gu: 'કામદાર નોંધણીમાં મદદ' } },
  { name: { en: 'Free legal aid (NALSA)', hi: 'मुफ़्त क़ानूनी मदद (NALSA)', mr: 'मोफत कायदेशीर मदत (NALSA)', gu: 'મફત કાનૂની મદદ (NALSA)' }, number: '15100', what: { en: 'Unpaid wages, cheating, disputes', hi: 'मज़दूरी न मिलना, धोखा, विवाद', mr: 'मजुरी न मिळणे, फसवणूक, वाद', gu: 'મજૂરી ન મળવી, છેતરપિંડી, ઝઘડા' } },
  { name: { en: 'Childline', hi: 'चाइल्डलाइन', mr: 'चाइल्डलाइन', gu: 'ચાઇલ્ડલાઇન' }, number: '1098', what: { en: 'Child labour or a child in danger', hi: 'बाल मज़दूरी या ख़तरे में बच्चा', mr: 'बालमजुरी किंवा धोक्यात असलेले मूल', gu: 'બાળમજૂરી કે જોખમમાં બાળક' } },
  { name: { en: 'Cyber fraud', hi: 'साइबर फ़्रॉड', mr: 'सायबर फसवणूक', gu: 'સાયબર છેતરપિંડી' }, number: '1930', what: { en: 'Money taken by online scam', hi: 'ऑनलाइन धोखे से पैसे गए', mr: 'ऑनलाइन फसवणुकीत पैसे गेले', gu: 'ઓનલાઇન છેતરપિંડીમાં પૈસા ગયા' } },
];

export const RIGHTS: { title: L; body: L; law: string }[] = [
  {
    title: { en: 'At least minimum wage', hi: 'कम से कम न्यूनतम मज़दूरी', mr: 'किमान मजुरी तरी मिळालीच पाहिजे', gu: 'ઓછામાં ઓછી લઘુતમ મજૂરી' },
    body: { en: 'Every state notifies a minimum daily wage for each skill level. Paying less is illegal, for men and women equally.', hi: 'हर राज्य हर कौशल स्तर के लिए न्यूनतम दैनिक मज़दूरी तय करता है। उससे कम देना ग़ैरक़ानूनी है, पुरुष और महिला दोनों के लिए बराबर।', mr: 'प्रत्येक राज्य प्रत्येक कौशल्यासाठी रोजची किमान मजुरी ठरवते. त्यापेक्षा कमी देणे बेकायदेशीर आहे, पुरुष आणि महिला दोघांसाठी सारखेच.', gu: 'દરેક રાજ્ય દરેક કુશળતા માટે રોજની લઘુતમ મજૂરી નક્કી કરે છે. તેનાથી ઓછું આપવું ગેરકાનૂની છે, પુરુષો અને સ્ત્રીઓ બંને માટે સરખું.' },
    law: 'Code on Wages, 2019',
  },
  {
    title: { en: 'Paid on time, in full', hi: 'समय पर, पूरा भुगतान', mr: 'वेळेवर, पूर्ण पैसे', gu: 'સમયસર, પૂરી ચુકવણી' },
    body: { en: 'Daily workers must be paid at the end of the shift; weekly workers on the last day of the week. No cuts without reason.', hi: 'दिहाड़ी मज़दूरों को शिफ़्ट ख़त्म होते ही; साप्ताहिक को हफ़्ते के आख़िरी दिन भुगतान होना चाहिए। बिना कारण कटौती नहीं।', mr: 'रोजंदारी कामगारांना शिफ्ट संपताच, आणि आठवड्याने काम करणाऱ्यांना आठवड्याच्या शेवटच्या दिवशी पैसे मिळाले पाहिजेत. कारणाशिवाय कपात नाही.', gu: 'રોજમદારી કામદારોને શિફ્ટ પૂરી થતાં જ, અને અઠવાડિક કામદારોને અઠવાડિયાના છેલ્લા દિવસે ચુકવણી થવી જોઈએ. કારણ વગર કપાત નહીં.' },
    law: 'Code on Wages, 2019',
  },
  {
    title: { en: 'Overtime is paid double', hi: 'ओवरटाइम का दोगुना पैसा', mr: 'ओव्हरटाइमला दुप्पट पैसे', gu: 'ઓવરટાઇમના બમણા પૈસા' },
    body: { en: 'Work beyond the normal working day must be paid at twice the normal rate.', hi: 'तय समय से ज़्यादा काम का भुगतान सामान्य दर से दोगुना होना चाहिए।', mr: 'ठरलेल्या वेळेपेक्षा जास्त कामाचे पैसे नेहमीच्या दराच्या दुप्पट मिळाले पाहिजेत.', gu: 'નક્કી સમય કરતાં વધારે કામના પૈસા સામાન્ય દર કરતાં બમણા મળવા જોઈએ.' },
    law: 'Code on Wages, 2019',
  },
  {
    title: { en: 'Safe workplace & gear', hi: 'सुरक्षित काम की जगह और सामान', mr: 'सुरक्षित कामाची जागा आणि साहित्य', gu: 'સુરક્ષિત કામની જગ્યા અને સાધનો' },
    body: { en: 'On building sites you must get a helmet, and a harness when working at height. Drinking water and first aid must be available.', hi: 'बिल्डिंग साइट पर हेलमेट, और ऊँचाई पर काम के लिए हार्नेस मिलना चाहिए। पीने का पानी और प्राथमिक उपचार होना चाहिए।', mr: 'बिल्डिंग साइटवर हेल्मेट, आणि उंचीवर काम करताना हार्नेस मिळालेच पाहिजे. पिण्याचे पाणी आणि प्रथमोपचाराची सोय असली पाहिजे.', gu: 'બિલ્ડિંગ સાઇટ પર હેલ્મેટ, અને ઊંચાઈ પર કામ કરવા હાર્નેસ મળવો જ જોઈએ. પીવાનું પાણી અને પ્રાથમિક સારવારની વ્યવસ્થા હોવી જોઈએ.' },
    law: 'OSH Code, 2020',
  },
  {
    title: { en: 'No forced or bonded work', hi: 'कोई बंधुआ या ज़बरदस्ती का काम नहीं', mr: 'वेठबिगारी किंवा जबरदस्तीचे काम नाही', gu: 'કોઈ વેઠ કે જબરદસ્તીનું કામ નહીં' },
    body: { en: 'No one can keep your documents or stop you from leaving because of an advance or loan.', hi: 'कोई भी एडवांस या कर्ज़ के कारण आपके कागज़ नहीं रख सकता, न आपको जाने से रोक सकता है।', mr: 'उचल (ॲडव्हान्स) किंवा कर्जामुळे कोणीही तुमची कागदपत्रे ठेवून घेऊ शकत नाही, किंवा तुम्हाला जाण्यापासून रोखू शकत नाही.', gu: 'ઉપાડ (ઍડવાન્સ) કે લોનના કારણે કોઈ તમારા દસ્તાવેજ રાખી ન શકે, કે તમને જતા રોકી ન શકે.' },
    law: 'Bonded Labour System (Abolition) Act, 1976',
  },
  {
    title: { en: 'Safety from harassment', hi: 'उत्पीड़न से सुरक्षा', mr: 'छळापासून संरक्षण', gu: 'હેરાનગતિથી રક્ષણ' },
    body: { en: 'Women in informal work can complain to the Local Committee of their district.', hi: 'असंगठित काम करने वाली महिलाएँ अपने ज़िले की लोकल कमेटी में शिकायत कर सकती हैं।', mr: 'असंघटित क्षेत्रात काम करणाऱ्या महिला त्यांच्या जिल्ह्याच्या स्थानिक समितीकडे तक्रार करू शकतात.', gu: 'અસંગઠિત કામ કરતી મહિલાઓ પોતાના જિલ્લાની સ્થાનિક સમિતિમાં ફરિયાદ કરી શકે છે.' },
    law: 'POSH Act, 2013',
  },
];
