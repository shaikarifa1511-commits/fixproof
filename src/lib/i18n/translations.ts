export type SupportedLanguage = 'en' | 'hi' | 'te' | 'kn';

export interface Translations {
  tagline: string;
  subTagline: string;
  reportProblem: string;
  exploreNearby: string;
  trackReports: string;
  publicDashboard: string;
  myReports: string;
  authorityPortal: string;
  moderationPortal: string;
  analytics: string;
  pothole: string;
  garbage: string;
  footpath: string;
  drainage: string;
  infrastructure: string;
  workStatus: string;
  verificationStatus: string;
  appearsResolved: string;
  appearsUnresolved: string;
  partiallyResolved: string;
  insufficientEvidence: string;
  humanReviewRequired: string;
  humanVerifiedResolved: string;
  humanVerifiedUnresolved: string;
  beforePhoto: string;
  afterPhoto: string;
  reinspectionPhoto: string;
  compareEvidence: string;
  sliderView: string;
  sideBySide: string;
  inspectDefect: string;
  disputeResolution: string;
  submitReport: string;
  stepCategory: string;
  stepPhoto: string;
  stepLocation: string;
  stepReview: string;
  locationAccuracy: string;
  sha256Proof: string;
  perceptualHash: string;
  evidenceIntegrity: string;
  aiVerificationFindings: string;
  humanReviewStatus: string;
  timelineAuditLog: string;
  disclaimer: string;
  roleCitizen: string;
  roleAuthority: string;
  roleModerator: string;
  rolePublic: string;
  filterAll: string;
  searchPlaceholder: string;
  viewDetails: string;
  claimRepair: string;
  reviewDecision: string;
  confirmResolved: string;
  rejectUnresolved: string;
  overrideAiAssessment: string;
  demoDataLabel: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, Translations> = {
  en: {
    tagline: 'Reported. Repaired. Verified.',
    subTagline: 'A complaint marked "Fixed" does not prove it was actually fixed. FixProof verifies civic repairs using photographic evidence and transparent computer vision.',
    reportProblem: 'Report a Problem',
    exploreNearby: 'Explore Civic Map',
    trackReports: 'Track My Reports',
    publicDashboard: 'Public Verification Analytics',
    myReports: 'My Reports',
    authorityPortal: 'Authority Portal',
    moderationPortal: 'Moderation Portal',
    analytics: 'Analytics',
    pothole: 'Pothole & Road Hazard',
    garbage: 'Garbage & Solid Waste',
    footpath: 'Damaged Footpath',
    drainage: 'Broken Drainage / Drain',
    infrastructure: 'Public Infrastructure',
    workStatus: 'Work Status',
    verificationStatus: 'Verification Status',
    appearsResolved: 'Appears Resolved',
    appearsUnresolved: 'Appears Unresolved',
    partiallyResolved: 'Partially Resolved',
    insufficientEvidence: 'Insufficient Evidence',
    humanReviewRequired: 'Human Review Required',
    humanVerifiedResolved: 'Human Verified Resolved',
    humanVerifiedUnresolved: 'Human Verified Unresolved',
    beforePhoto: 'Original Evidence (Before)',
    afterPhoto: 'Claimed Repair (After)',
    reinspectionPhoto: 'Citizen Reinspection',
    compareEvidence: 'Compare Evidence',
    sliderView: 'Interactive Slider',
    sideBySide: 'Side by Side',
    inspectDefect: 'Defect Region Overlay',
    disputeResolution: 'Challenge / Dispute Resolution',
    submitReport: 'Submit Civic Report',
    stepCategory: '1. Select Issue Category',
    stepPhoto: '2. Capture Photographic Evidence',
    stepLocation: '3. Geotag Location',
    stepReview: '4. AI Review & Confirm',
    locationAccuracy: 'GPS Location Accuracy',
    sha256Proof: 'SHA-256 Cryptographic Hash',
    perceptualHash: 'Perceptual Visual Hash (dHash)',
    evidenceIntegrity: 'Evidence Integrity & Anti-Fraud',
    aiVerificationFindings: 'AI Evidence Findings',
    humanReviewStatus: 'Human Review & Override',
    timelineAuditLog: 'Immutable Case Audit Trail',
    disclaimer: 'FixProof is an independent civic verification platform. It operates fairly and evaluates evidence independently.',
    roleCitizen: 'Citizen',
    roleAuthority: 'Authority Engineer',
    roleModerator: 'Civic Moderator',
    rolePublic: 'Public Visitor',
    filterAll: 'All Categories',
    searchPlaceholder: 'Search by report ID, street, or landmark...',
    viewDetails: 'View Evidence & Details',
    claimRepair: 'Submit Repair Evidence',
    reviewDecision: 'Record Moderation Ruling',
    confirmResolved: 'Confirm Verified Resolved',
    rejectUnresolved: 'Mark Defect Unresolved',
    overrideAiAssessment: 'Override AI Finding with Justification',
    demoDataLabel: 'Synthetic Demonstration Record (Clearly Labeled)',
  },
  hi: {
    tagline: 'रिपोर्ट किया। मरम्मत की। सत्यापित किया।',
    subTagline: 'शिकायत को "हल" चिह्नित करने का मतलब यह नहीं कि समस्या हल हो गई। फिक्सप्रूफ तस्वीरों और एआई से प्रमाण सत्यापित करता है।',
    reportProblem: 'समस्या की रिपोर्ट करें',
    exploreNearby: 'नागरिक मानचित्र देखें',
    trackReports: 'मेरी शिकायतें ट्रैक करें',
    publicDashboard: 'सत्यापन आंकड़े',
    myReports: 'मेरी रिपोर्ट',
    authorityPortal: 'प्राधिकरण पोर्टल',
    moderationPortal: 'मध्यस्थ पोर्टल',
    analytics: 'एनालिटिक्स',
    pothole: 'सड़क का गड्ढा',
    garbage: 'कचरा और अपशिष्ट',
    footpath: 'क्षतिग्रस्त फुटपाथ',
    drainage: 'टूटी नाली या ढक्कन',
    infrastructure: 'सार्वजनिक ढांचा',
    workStatus: 'कार्य स्थिति',
    verificationStatus: 'सत्यापन स्थिति',
    appearsResolved: 'हल प्रतीत होता है',
    appearsUnresolved: 'अनसुलझा प्रतीत होता है',
    partiallyResolved: 'आंशिक रूप से हल',
    insufficientEvidence: 'अपर्याप्त साक्ष्य',
    humanReviewRequired: 'मानव समीक्षा आवश्यक',
    humanVerifiedResolved: 'मानव द्वारा सत्यापित हल',
    humanVerifiedUnresolved: 'मानव द्वारा सत्यापित अनसुलझा',
    beforePhoto: 'मूल प्रमाण (पहले)',
    afterPhoto: 'दावा किया गया मरम्मत (बाद में)',
    reinspectionPhoto: 'नागरिक पुनः निरीक्षण',
    compareEvidence: 'साक्ष्य तुलना करें',
    sliderView: 'इंटरैक्टिव स्लाइडर',
    sideBySide: 'आमने-सामने तुलना',
    inspectDefect: 'दोष क्षेत्र पहचानें',
    disputeResolution: 'गलत समाधान को चुनौती दें',
    submitReport: 'रिपोर्ट सबमिट करें',
    stepCategory: '1. श्रेणी चुनें',
    stepPhoto: '2. तस्वीर लें',
    stepLocation: '3. स्थान चुनें',
    stepReview: '4. पुष्टि करें',
    locationAccuracy: 'जीपीएस स्थान सटीकता',
    sha256Proof: 'एसएचए-256 क्रिप्टोग्राफिक हैश',
    perceptualHash: 'दृश्य हैश (dHash)',
    evidenceIntegrity: 'साक्ष्य सत्यनिष्ठा',
    aiVerificationFindings: 'एआई सत्यापन निष्कर्ष',
    humanReviewStatus: 'मानव समीक्षा और निर्णय',
    timelineAuditLog: 'अपरिवर्तनीय घटनाक्रम ऑडिट',
    disclaimer: 'फिक्सप्रूफ एक स्वतंत्र नागरिक सत्यापन मंच है।',
    roleCitizen: 'नागरिक',
    roleAuthority: 'प्राधिकरण अभियंता',
    roleModerator: 'नागरिक मध्यस्थ',
    rolePublic: 'सार्वजनिक दर्शक',
    filterAll: 'सभी श्रेणियां',
    searchPlaceholder: 'आईडी या सड़क खोजें...',
    viewDetails: 'विवरण देखें',
    claimRepair: 'मरम्मत साक्ष्य दर्ज करें',
    reviewDecision: 'मध्यस्थ निर्णय दर्ज करें',
    confirmResolved: 'सत्यापित हल की पुष्टि करें',
    rejectUnresolved: 'अनसुलझा चिह्नित करें',
    overrideAiAssessment: 'कारण के साथ एआई निर्णय बदलें',
    demoDataLabel: 'सिंथेटिक प्रदर्शन डेटा',
  },
  te: {
    tagline: 'నివేదించబడింది. మరమ్మత్తు చేయబడింది. ధృవీకరించబడింది.',
    subTagline: 'ఒక ఫిర్యాదు "పరిష్కరించబడింది" అని మార్క్ చేసినంత మాత్రాన సమస్య పరిష్కారమైనట్లు కాదు. ఫిక్స్‌ప్రూఫ్ ఫోటో ఆధారాలతో వాస్తవాన్ని ధృవీకరిస్తుంది.',
    reportProblem: 'సమస్యను నివేదించండి',
    exploreNearby: 'సివిక్ మ్యాప్ అన్వేషించండి',
    trackReports: 'నా నివేదికలను ట్రాక్ చేయండి',
    publicDashboard: 'పబ్లిక్ ధృవీకరణ గణాంకాలు',
    myReports: 'నా నివేదికలు',
    authorityPortal: 'అథారిటీ పోర్టల్',
    moderationPortal: 'మోడరేషన్ పోర్టల్',
    analytics: 'విశ్లేషణలు',
    pothole: 'రహదారి గుంత',
    garbage: 'చెత్త & ఘన వ్యర్థాలు',
    footpath: 'దెబ్బతిన్న ఫుట్‌పాత్',
    drainage: 'డ్రైనేజీ సమస్య',
    infrastructure: 'ప్రజా మౌలిక సదుపాయాలు',
    workStatus: 'పని స్థితి',
    verificationStatus: 'ధృవీకరణ స్థితి',
    appearsResolved: 'పరిష్కరించబడినట్లు కనిపిస్తోంది',
    appearsUnresolved: 'పరిష్కారం కాలేదు',
    partiallyResolved: 'పాక్షికంగా పరిష్కరించబడింది',
    insufficientEvidence: 'సరిపోని ఆధారాలు',
    humanReviewRequired: 'మానవ సమీక్ష అవసరం',
    humanVerifiedResolved: 'మానవ ధృవీకరించిన పరిష్కారం',
    humanVerifiedUnresolved: 'మానవ ధృవీకరించిన అపరిష్కృతం',
    beforePhoto: 'మునుపటి ఫోటో (మొదటి ఆధారాలు)',
    afterPhoto: 'తర్వాత ఫోటో (మరమ్మతు ఆధారాలు)',
    reinspectionPhoto: 'పౌరుల పునఃపరిశీలన',
    compareEvidence: 'ఆధారాలను సరిపోల్చండి',
    sliderView: 'ఇంటరాక్టివ్ స్లైడర్',
    sideBySide: 'పక్కపక్కనే వీక్షణ',
    inspectDefect: 'లోపం ఉన్న ప్రాంతం పరిశీలించండి',
    disputeResolution: 'తప్పుడు పరిష్కారాన్ని సవాలు చేయండి',
    submitReport: 'నివేదికను సమర్పించండి',
    stepCategory: '1. వర్గాన్ని ఎంచుకోండి',
    stepPhoto: '2. ఫోటో తీయండి',
    stepLocation: '3. లొకేషన్ ఎంచుకోండి',
    stepReview: '4. సమీక్షించండి & సమర్పించండి',
    locationAccuracy: 'GPS లొకేషన్ ఖచ్చితత్వం',
    sha256Proof: 'SHA-256 హాష్',
    perceptualHash: 'విజువల్ హాష్ (dHash)',
    evidenceIntegrity: 'సాక్ష్యాల సమగ్రత',
    aiVerificationFindings: 'AI ధృవీకరణ ఫలితాలు',
    humanReviewStatus: 'మానవ సమీక్ష & నిర్ణయం',
    timelineAuditLog: 'కేసు ఆడిట్ చరిత్ర',
    disclaimer: 'ఫిక్స్‌ప్రూఫ్ స్వతంత్ర పౌర ధృవీకరణ వేదిక.',
    roleCitizen: 'పౌరుడు',
    roleAuthority: 'అధికార ఇంజనీర్',
    roleModerator: 'సివిక్ మోడరేటర్',
    rolePublic: 'పబ్లిక్ సందర్శకుడు',
    filterAll: 'అన్ని వర్గాలు',
    searchPlaceholder: 'శోధించండి...',
    viewDetails: 'వివరాలు చూడండి',
    claimRepair: 'మరమ్మత్తు సాక్ష్యం సమర్పించండి',
    reviewDecision: 'మోడరేషన్ తీర్పు',
    confirmResolved: 'పరిష్కరించబడినట్లు నిర్ధారించండి',
    rejectUnresolved: 'పరిష్కారం కాలేదని గుర్తు పెట్టండి',
    overrideAiAssessment: 'AI ఫలితాన్ని సరిచేయండి',
    demoDataLabel: 'డెమో డేటా',
  },
  kn: {
    tagline: 'ವರದಿ ಮಾಡಲಾಗಿದೆ. ದುರಸ್ತಿ ಮಾಡಲಾಗಿದೆ. ಪರಿಶೀಲಿಸಲಾಗಿದೆ.',
    subTagline: 'ದೂರನ್ನು "ಪರಿಹರಿಸಲಾಗಿದೆ" ಎಂದು ಗುರುತಿಸುವುದರಿಂದ ಸಮಸ್ಯೆ ನಿಜವಾಗಿಯೂ ಪರಿಹಾರವಾಗಿದೆ ಎಂದು ಸಾಬೀತಾಗುವುದಿಲ್ಲ. ಫಿಕ್ಸ್ ಪ್ರೂಫ್ ಫೋಟೋ ಸಾಕ್ಷಿಗಳೊಂದಿಗೆ ಸತ್ಯವನ್ನು ಪರಿಶೀಲಿಸುತ್ತದೆ.',
    reportProblem: 'ಸಮಸ್ಯೆಯನ್ನು ವರದಿ ಮಾಡಿ',
    exploreNearby: 'ನಾಗರಿಕ ನಕ್ಷೆ ನೋಡಿ',
    trackReports: 'ನನ್ನ ವರದಿಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',
    publicDashboard: 'ಸಾರ್ವಜನಿಕ ಪರಿಶೀಲನಾ ಅಂಕಿಅಂಶಗಳು',
    myReports: 'ನನ್ನ ವರದಿಗಳು',
    authorityPortal: 'ಪ್ರಾಧಿಕಾರ ಪೋರ್ಟಲ್',
    moderationPortal: 'ಮಧ್ಯಸ್ಥಿಕೆ ಪೋರ್ಟಲ್',
    analytics: 'ವಿಶ್ಲೇಷಣೆ',
    pothole: 'ರಸ್ತೆ ಗುಂಡಿ',
    garbage: 'ಕಸ ಮತ್ತು ತ್ಯಾಜ್ಯ',
    footpath: 'ಹಾಳಾದ ಫುಟ್‌ಪಾತ್',
    drainage: 'ಒಳಚರಂಡಿ ಅಥವಾ ಚರಂಡಿ ಮುಚ್ಚಳ',
    infrastructure: 'ಸಾರ್ವಜನಿಕ ಮೂಲಸೌಕರ್ಯ',
    workStatus: 'ಕೆಲಸದ ಸ್ಥಿತಿ',
    verificationStatus: 'ಪರಿಶೀಲನಾ ಸ್ಥಿತಿ',
    appearsResolved: 'ಪರಿಹರಿಸಲಾಗಿದೆ ಎಂದು ತೋರುತ್ತದೆ',
    appearsUnresolved: 'ಪರಿಹರಿಸಲಾಗಿಲ್ಲ ಎಂದು ತೋರುತ್ತದೆ',
    partiallyResolved: 'ಭಾಗಶಃ ಪರಿಹರಿಸಲಾಗಿದೆ',
    insufficientEvidence: 'ಸಾಕಾಗದ ಸಾಕ್ಷ್ಯ',
    humanReviewRequired: 'ಮಾನವ ಪರಿಶೀಲನೆ ಅಗತ್ಯವಿದೆ',
    humanVerifiedResolved: 'ಮಾನವ ಪರಿಶೀಲಿಸಿದ ಪರಿಹಾರ',
    humanVerifiedUnresolved: 'ಮಾನವ ಪರಿಶೀಲಿಸಿದ ಅಪರಿಹಾರ',
    beforePhoto: 'ಹಿಂದಿನ ಫೋಟೋ (ಮೂಲ ಸಾಕ್ಷ್ಯ)',
    afterPhoto: 'ದುರಸ್ತಿ ನಂತರದ ಫೋಟೋ',
    reinspectionPhoto: 'ನಾಗರಿಕರ ಮರುಪರಿಶೀಲನೆ',
    compareEvidence: 'ಸಾಕ್ಷ್ಯ ಹೋಲಿಕೆ ಮಾಡಿ',
    sliderView: 'ಇಂಟರ್ಯಾಕ್ಟಿವ್ ಸ್ಲೈಡರ್',
    sideBySide: 'ಪಕ್ಕಪಕ್ಕದ ಹೋಲಿಕೆ',
    inspectDefect: 'ದೋಷ ಗುರುತಿಸುವಿಕೆ',
    disputeResolution: 'ತಪ್ಪಾದ ಪರಿಹಾರವನ್ನು ಪ್ರಶ್ನಿಸಿ',
    submitReport: 'ವರದಿ ಸಲ್ಲಿಸಿ',
    stepCategory: '1. ವರ್ಗ ಆಯ್ಕೆಮಾಡಿ',
    stepPhoto: '2. ಫೋಟೋ ಸೆರೆಹಿಡಿಯಿರಿ',
    stepLocation: '3. ಸ್ಥಳವನ್ನು ಗುರುತಿಸಿ',
    stepReview: '4. ಪರಿಶೀಲಿಸಿ & ಸಲ್ಲಿಸಿ',
    locationAccuracy: 'GPS ಸ್ಥಳ ನಿಖರತೆ',
    sha256Proof: 'SHA-256 ಹ್ಯಾಶ್',
    perceptualHash: 'ದೃಶ್ಯ ಹ್ಯಾಶ್ (dHash)',
    evidenceIntegrity: 'ಸಾಕ್ಷ್ಯದ ಸಮಗ್ರತೆ',
    aiVerificationFindings: 'AI ಪರಿಶೀಲನಾ ಫಲಿತಾಂಶಗಳು',
    humanReviewStatus: 'ಮಾನವ ಪರಿಶೀಲನೆ ಮತ್ತು ನಿರ್ಧಾರ',
    timelineAuditLog: 'ಆಡಿಟ್ ಇತಿಹಾಸ',
    disclaimer: 'ಫಿಕ್ಸ್ ಪ್ರೂಫ್ ಸ್ವತಂತ್ರ ನಾಗರಿಕ ಪರಿಶೀಲನಾ ವೇದಿಕೆಯಾಗಿದೆ.',
    roleCitizen: 'ನಾಗರಿಕ',
    roleAuthority: 'ಪ್ರಾಧಿಕಾರದ ಇಂಜಿನಿಯರ್',
    roleModerator: 'ನಾಗರಿಕ ಮಧ್ಯಸ್ಥಗಾರ',
    rolePublic: 'ಸಾರ್ವಜನಿಕ ವೀಕ್ಷಕ',
    filterAll: 'ಎಲ್ಲಾ ವರ್ಗಗಳು',
    searchPlaceholder: 'ಹುಡುಕಿ...',
    viewDetails: 'ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    claimRepair: 'ದುರಸ್ತಿ ಪುರಾವೆ ಸಲ್ಲಿಸಿ',
    reviewDecision: 'ತೀರ್ಪು ದಾಖಲಿಸಿ',
    confirmResolved: 'ಪರಿಹರಿಸಲಾಗಿದೆ ಎಂದು ದೃಢೀಕರಿಸಿ',
    rejectUnresolved: 'ಅಪರಿಹೃತ ಎಂದು ಗುರುತಿಸಿ',
    overrideAiAssessment: 'AI ನಿರ್ಧಾರ ಬದಲಾಯಿಸಿ',
    demoDataLabel: 'ಡೆಮೊ ಮಾಹಿತಿ',
  },
};

