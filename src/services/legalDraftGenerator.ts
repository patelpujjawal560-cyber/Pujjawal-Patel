import { Complaint, LegalNoticeDraft } from '../types';

export function getHighCourtForState(state: string): string {
  if (state.includes('बिहार') || state.toLowerCase().includes('bihar')) {
    return 'पटना उच्च न्यायालय (Patna High Court)';
  }
  if (state.includes('उत्तर प्रदेश') || state.toLowerCase().includes('uttar pradesh')) {
    return 'इलाहाबाद उच्च न्यायालय (Allahabad High Court)';
  }
  if (state.includes('झारखंड') || state.toLowerCase().includes('jharkhand')) {
    return 'झारखंड उच्च न्यायालय (Jharkhand High Court, Ranchi)';
  }
  if (state.includes('मध्य प्रदेश') || state.toLowerCase().includes('madhya pradesh')) {
    return 'मध्य प्रदेश उच्च न्यायालय (Madhya Pradesh High Court, Jabalpur)';
  }
  if (state.includes('राजस्थान') || state.toLowerCase().includes('rajasthan')) {
    return 'राजस्थान उच्च न्यायालय (Rajasthan High Court, Jodhpur/Jaipur)';
  }
  return 'माननीय उच्च न्यायालय (Honourable High Court)';
}

export function generateHighCourtPIL(complaint: Complaint): LegalNoticeDraft {
  const courtName = getHighCourtForState(complaint.state);

  const petitioners = `${complaint.complainantName || 'ग्रामवासी'} एवं समस्त पीड़ित नागरिक, ${complaint.wardNumber}, ग्राम पंचायत: ${complaint.gramPanchayat}, प्रखंड: ${complaint.blockOrTehsil}, जिला: ${complaint.district}, ${complaint.state}`;

  const respondents = [
    `1. राज्य सरकार (State Government) द्वारा मुख्य सचिव / प्रधान सचिव, ग्रामीण कार्य विभाग, ${complaint.state}`,
    `2. जिला पदाधिकारी / उपायुक्त (District Magistrate / Collector), ${complaint.district}`,
    `3. उप विकास आयुक्त (DDC) सह मुख्य कार्यपालक अधिकारी, जिला परिषद, ${complaint.district}`,
    `4. प्रखंड विकास पदाधिकारी (BDO), प्रखंड: ${complaint.blockOrTehsil}, ${complaint.district}`,
    `5. कार्यपालक अभियंता, ग्रामीण कार्य विभाग (PWD - Rural Works Department), कार्य प्रमंडल, ${complaint.district}`,
    `6. मुखिया (Gram Panchayat Mukhiya): ${complaint.mukhiyaName}, ग्राम पंचायत: ${complaint.gramPanchayat}`,
    `7. वार्ड सदस्य / पार्षद: ${complaint.wardParshadName || 'संबंधित वार्ड प्रतिनिधि'}, ${complaint.wardNumber}`
  ];

  const factsAndGrounds = [
    `याचिकाकर्तागण भारत के संविधान के अनुच्छेद 226 के तहत यह जनहित याचिका (Public Interest Litigation) प्रस्तुत कर रहे हैं।`,
    `स्थान: ${complaint.state} के अंतर्गत ${complaint.district}, प्रखंड: ${complaint.blockOrTehsil}, ग्राम पंचायत: ${complaint.gramPanchayat}, ${complaint.wardNumber} स्थित मुख्य संपर्क मार्ग।`,
    `सड़क की स्थिति: सड़क पिछले ${complaint.yearsPending} वर्षों से निर्माणाधीन या पूर्णतः बदहाल, कीचड़युक्त व गड्ढों में तब्दील है। अनुमानित लंबाई लगभग ${complaint.roadLengthMeters || 1000} मीटर है।`,
    `प्रभावित जनसंख्या: इस मार्ग से लगभग ${complaint.affectedPopulation || 2000}+ ग्रामीण व स्कूली बच्चे प्रतिदिन गुजरने को विवश हैं।`,
    `गंभीर जन-समस्याएं: ${complaint.problems.join(', ')}। इसके अतिरिक्त: "${complaint.description}"`,
    `विधिक आधार व सर्वोच्च न्यायालय की नज़ीर: माननीय सर्वोच्च न्यायालय ने ऐतिहासिक निर्णय 'स्टेट ऑफ हिमाचल प्रदेश बनाम उमेद राम शर्मा (AIR 1986 SC 847)' में स्पष्ट प्रतिपादित किया है कि पक्की सड़क व आवागमन का अधिकार संविधान के अनुच्छेद 21 के तहत 'जीवन के मौलिक अधिकार' (Right to Life) का अभिन्न अंग है। सड़क न होना जीने के अधिकार का खुला हनन है।`,
    `पंचायती राज अधिनियम का उल्लंघन: ग्राम पंचायत मुखिया (${complaint.mukhiyaName}) एवं स्थानीय प्रशासन ने 15वें वित्त आयोग एवं मुख्यमंत्री ग्राम संपर्क योजना के आवंटित फंड के बावजूद पिछले ${complaint.yearsPending} वर्षों से इस मार्ग का निर्माण नहीं कराया है, जो गंभीर उपेक्षा व संभावित वित्तीय अनियमितता दर्शाता है।`,
    `पूर्व सूचना की अनदेखी: ग्रामीणों द्वारा मौखिक व लिखित रूप से कई बार अवगत कराने एवं 15-दिवसीय विधिक मांग पत्र (Legal Demand Notice) भेजने के उपरांत भी उत्तरदाताओं ने कोई सुधारात्मक कदम नहीं उठाया।`
  ];

  const legalPrecedents = [
    'State of H.P. vs Umed Ram Sharma (AIR 1986 SC 847) - Right to Road is a Fundamental Right under Article 21.',
    'Municipal Council, Ratlam vs Shri Vardichan (1980 AIR 1622) - Lack of funds cannot be an excuse for statutory authorities to avoid basic public amenities.',
    'Article 21 & Article 14 of the Constitution of India - Right to life with dignity & equality before law.',
    'Bihar Panchayati Raj Act / State Rural Roads Development Authority Directives.'
  ];

  const prayers = [
    `माननीय न्यायालय से सविनय प्रार्थना है कि वे 'परमादेश' (Writ in the nature of Mandamus) जारी करते हुए उत्तरदाताओं (डीएम, बीडीओ एवं ग्रामीण कार्य विभाग) को निर्देश दें कि वे तुरंत उक्त ${complaint.wardNumber} स्थित मार्ग के पक्कीकरण हेतु निविदा (Tender) जारी कर 60 दिनों के भीतर सड़क निर्माण पूरा कराएं।`,
    `निर्देश दिया जाए कि पिछले 10 वर्षों में उक्त ग्राम पंचायत ${complaint.gramPanchayat} एवं वार्ड के लिए जारी सड़क निर्माण फंड की निष्पक्ष उच्चस्तरीय / सतर्कता जांच (Vigilance Inquiry) कराई जाए कि बजट कहां खर्च हुआ।`,
    `जब तक पक्की सड़क का निर्माण पूर्ण नहीं होता, तब तक आपातकालीन आधार पर ईंट-सोमवार या रोली डालकर तत्काल गड्ढा-मुक्त व आवागमन योग्य बनाया जाए ताकि एम्बुलेंस एवं स्कूली बच्चे आ-जा सकें।`,
    `दोषी अधिकारियों एवं संवेदक/मुखिया के विरुद्ध कर्तव्यहीनता एवं जनधन की हेराफेरी के संदर्भ में दंडात्मक कार्रवाई की जाए।`,
    `अन्य कोई भी समुचित आदेश या निर्देश जो माननीय न्यायालय न्यायहित में उचित समझे, पारित करने की कृपा करें।`
  ];

  const rtiQuestions = [
    `1. ग्राम पंचायत ${complaint.gramPanchayat}, ${complaint.wardNumber} (प्रखंड: ${complaint.blockOrTehsil}, जिला: ${complaint.district}) स्थित मार्ग के निर्माण हेतु विगत 10 वर्षों में केंद्र अथवा राज्य सरकार (15वां वित्त आयोग/मनरेगा/मुख्यमंत्री ग्राम संपर्क) से कितना फंड स्वीकृत किया गया?`,
    `2. क्या उक्त सड़क निर्माण के लिए कभी कोई प्राक्कलन (Estimate) एवं प्रशासनिक स्वीकृति जारी की गई? यदि हां, तो प्राक्कलन की सत्यापित प्रति उपलब्ध कराएं।`,
    `3. उक्त सड़क के लिए किस संवेदक (ठेकेदार) को कार्य आवंटित किया गया था, कार्यादेश (Work Order) की प्रति एवं अब तक किए गए कुल भुगतान (MB Book व वाउचर) का विवरण दें।`,
    `4. यदि सड़क का निर्माण धरातल पर नहीं हुआ, तो फंड किस मद में व्यय दिखाया गया? इसके लिए कौन से कनिष्ठ अभियंता (JE), सहायक अभियंता (AE) एवं कार्यपालक अभियंता उत्तरदायी हैं?`,
    `5. वर्तमान मुखिया (${complaint.mukhiyaName}) के कार्यकाल में वार्ड 04/संबंधित वार्ड की अनुशंसा पर क्या कोई कार्य योजना ली गई है? विवरण दें।`
  ];

  return {
    petitionTitle: `IN THE HIGH COURT OF JUDICATURE AT ${courtName.toUpperCase()}\nEXTRAORDINARY WRIT JURISDICTION\nCIVIL WRIT JURISDICTION CASE (PIL) NO. _____ OF 2026`,
    highCourtName: courtName,
    courtArticle: 'Article 226 of the Constitution of India (जनहित याचिका / Public Interest Litigation)',
    petitioners,
    respondents,
    factsAndGrounds,
    legalPrecedents,
    prayers,
    rtiQuestions
  };
}

export function generateLegalNoticeText(complaint: Complaint): string {
  const courtName = getHighCourtForState(complaint.state);
  return `
================================================================================
                    विधिक मांग पत्र / 15-दिवसीय कानूनी नोटिस
       (LEGAL DEMAND NOTICE UNDER SECTION 80 C.P.C. PRIOR TO FILING PIL)
================================================================================
प्रेषक (Complainants / Petitioners):
${complaint.complainantName || 'ग्रामवासी'},
निवासी: ${complaint.wardNumber}, ग्राम पंचायत: ${complaint.gramPanchayat},
प्रखंड: ${complaint.blockOrTehsil}, जिला: ${complaint.district}, (${complaint.state})
मोबाइल: ${complaint.complainantPhone || 'उपलब्ध'}
तारीख: ${new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
ट्रैकिंग आईडी: ${complaint.trackingNumber}

प्रति (To):
1. जिला पदाधिकारी / उपायुक्त (DM), कार्यालय समाहरणालय, ${complaint.district}
2. प्रखंड विकास पदाधिकारी (BDO), प्रखंड कार्यालय: ${complaint.blockOrTehsil}, ${complaint.district}
3. कार्यपालक अभियंता, ग्रामीण कार्य विभाग (PWD/RWD), प्रमंडल: ${complaint.district}
4. मुखिया महोदय / महोदया (${complaint.mukhiyaName}), ग्राम पंचायत: ${complaint.gramPanchayat}, ${complaint.blockOrTehsil}
5. वार्ड सदस्य / पार्षद (${complaint.wardParshadName || 'वार्ड सदस्य'}), ${complaint.wardNumber}

विषय:
ग्राम पंचायत ${complaint.gramPanchayat} के ${complaint.wardNumber} (प्रखंड: ${complaint.blockOrTehsil}) में पिछले ${complaint.yearsPending} वर्षों से सड़क निर्माण न होने, भारी कीचड़/गड्ढों एवं फंड गबन की आशंका के विरुद्ध तत्काल सड़क निर्माण एवं 15 दिनों में विधिक संज्ञान लेने बाबत। अन्यथा ${courtName} में जनहित याचिका (PIL Writ under Article 226) दायर करने की सूचना।

महोदय / महोदया,
उपरोक्त विषय के संदर्भ में हमारे मुवक्किल एवं समस्त पीड़ित ग्रामीणों के निर्देशानुसार आपको यह कानूनी नोटिस निम्नलिखित तथ्यों के साथ प्रेषित किया जाता है:

1. कि उक्त ग्राम पंचायत ${complaint.gramPanchayat} के ${complaint.wardNumber} में लगभग ${complaint.roadLengthMeters || 1000} मीटर लंबी सड़क पिछले ${complaint.yearsPending} वर्षों से कच्ची, कीचड़युक्त एवं चलने योग्य नहीं है।

2. कि इस सड़क के न बनने से लगभग ${complaint.affectedPopulation || 2000}+ नागरिक, महिलाएं, वृद्ध एवं स्कूली बच्चे नारकीय जीवन जीने को मजबूर हैं। आपातकाल में एम्बुलेंस या दमकल की गाड़ी नहीं पहुंच पाती।

3. कि मुखिया जी (${complaint.mukhiyaName}) एवं पंचायत प्रतिनिधियों द्वारा बार-बार झूठे आश्वासन दिए गए परंतु पंचायत की कार्य योजना में सड़क को जानबूझकर उपेक्षित रखा गया।

4. कि माननीय सर्वोच्च न्यायालय ने 'State of Himachal Pradesh vs Umed Ram Sharma (AIR 1986 SC 847)' में स्पष्ट कहा है कि सड़क का अधिकार भारतीय संविधान के अनुच्छेद 21 (जीने का अधिकार) के तहत मौलिक अधिकार है। प्रशासन सड़क न बनाकर हमारे मौलिक अधिकारों का हनन कर रहा है।

अतः इस विधिक नोटिस के माध्यम से आपको 15 (पंद्रह) दिनों का अंतिम समय दिया जाता है कि:
(क) उक्त सड़क के पक्कीकरण हेतु प्रशासनिक व वित्तीय स्वीकृति जारी कर निर्माण कार्य आरंभ करें।
(ख) तत्कालिक राहत हेतु गड्ढों को भरवाकर आवागमन योग्य बनाएं।
(ग) पिछले वर्षों में आवंटित राशि का ब्यौरा सार्वजनिक करें।

यदि 15 दिनों के भीतर संतोषजनक कार्रवाई प्रारंभ नहीं की जाती है, तो हमारे अधिवक्ता दल द्वारा बिना किसी अन्य सूचना के ${courtName} में अनुच्छेद 226 के तहत जनहित याचिका (Public Interest Litigation) एवं सतर्कता ब्यूरो में प्राथमिकी दर्ज कराई जाएगी, जिसके समस्त विधिक व्यय एवं हर्जाने की जिम्मेदारी आपकी होगी।

भवदीय,
समस्त पीड़ित ग्रामवासी व विधिक सहायता प्रकोष्ठ
(जन सड़क - Jan Sadak Citizen Grievance Network)
================================================================================
`.trim();
}

export function generateRTIText(complaint: Complaint): string {
  return `
================================================================================
                     सूचना का अधिकार अधिनियम, 2005
                (आवेदन पत्र अंतर्गत धारा 6(1) RTI ACT, 2005)
================================================================================
सेवा में,
लोक सूचना अधिकारी (PIO) सह प्रखंड विकास पदाधिकारी (BDO) / कार्यपालक अभियंता PWD,
कार्यालय: प्रखंड ${complaint.blockOrTehsil} / समाहरणालय ${complaint.district}, (${complaint.state})

आवेदक का नाम: ${complaint.complainantName || 'ग्रामवासी'}
पता: ${complaint.wardNumber}, ग्राम: ${complaint.gramPanchayat}, प्रखंड: ${complaint.blockOrTehsil}, जिला: ${complaint.district}
मोबाइल नंबर: ${complaint.complainantPhone || 'उपलब्ध'}
तारीख: ${new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'long', year: 'numeric' })}

विषय: ग्राम पंचायत ${complaint.gramPanchayat}, ${complaint.wardNumber} में सड़क निर्माण एवं व्यय विवरण संबंधी सूचना।

महोदय,
कृपया सूचना का अधिकार अधिनियम, 2005 के अंतर्गत मुझे निम्नलिखित बिन्दुओं पर प्रमाणित सूचना एवं अभिलेख उपलब्ध कराएं:

1. ग्राम पंचायत ${complaint.gramPanchayat} के ${complaint.wardNumber} स्थित मुख्य संपर्क मार्ग के निर्माण हेतु वर्ष 2015 से 2026 तक 14वें/15वें वित्त आयोग, षष्ठम राज्य वित्त, मनरेगा या अन्य किसी योजना से स्वीकृत कुल राशि एवं योजनाओं का नाम बताएं।
2. क्या वर्तमान मुखिया (${complaint.mukhiyaName}) अथवा पूर्व मुखिया के कार्यकाल में इस सड़क हेतु कोई राशि निकाली (Withdrawal) गई है? यदि हां, तो वाउचर, एमबी बुक (Measurement Book) व कार्य पूर्णता प्रमाण पत्र की सत्यापित छायाप्रति दें।
3. उक्त सड़क के प्राक्कलन (Estimate) की प्रति एवं कार्य कराने वाली एजेंसी / संवेदक का नाम व पता उपलब्ध कराएं।
4. यदि कार्य नहीं कराया गया है, तो पिछले ${complaint.yearsPending} वर्षों से सड़क का निर्माण न होने का क्या कारण अभिलेखों में दर्ज है?
5. वर्तमान में उक्त सड़क के निर्माण हेतु क्या कोई प्रस्ताव लंबित है? यदि हां, तो उसकी अद्यतन स्थिति क्या है?

आवेदन शुल्क: ₹10 का पोस्टल आर्डर / कोर्ट फीस संलग्न है।
कृपया अधिनियम की धारा 7(1) के अंतर्गत 30 दिनों के भीतर सूचना उपलब्ध कराने की कृपा करें।

भवदीय,
हस्ताक्षर: _______________
नाम: ${complaint.complainantName || 'ग्रामवासी'}
================================================================================
`.trim();
}
