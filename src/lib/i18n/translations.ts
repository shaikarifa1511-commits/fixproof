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
  allReports: string;
  civicMap: string;
  reportDefect: string;
  myCases: string;
  authorityQueue: string;
  moderationHub: string;
  catalogTitle: string;
  catalogSubtitle: string;
  reportNewProblem: string;
  searchBtn: string;
  filtersLabel: string;
  allWorkStatuses: string;
  allVerifications: string;
  submittedStatus: string;
  inProgressStatus: string;
  repairClaimedStatus: string;
  closedStatus: string;
  disputedStatus: string;
  caseNumberLabel: string;
  reportedOnLabel: string;
  viewCaseDetails: string;
  noReportsFound: string;
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
  heroAiBadge: string;
  heroLedger: string;
  inspectAiDemo: string;
  casesTracked: string;
  verifiedResolvedStat: string;
  unresolvedRateStat: string;
  tamperHashedStat: string;
  fiveQuestionsTitle: string;
  fiveQuestionsSubtitle: string;
  q1Title: string;
  q1Desc: string;
  q2Title: string;
  q2Desc: string;
  q3Title: string;
  q3Desc: string;
  q4Title: string;
  q4Desc: string;
  q5Title: string;
  q5Desc: string;
  featuredCasesTitle: string;
  featuredCasesSubtitle: string;
  viewAllReportsLink: string;
  demoBannerTitle: string;
  demoBannerDesc: string;
  resetDemoBtn: string;
  footerTagline: string;
  footerRights: string;
  footerPrivacy: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, Translations> = {
  en: {
    tagline: 'Reported. Repaired. Verified.',
    subTagline:
      'A complaint marked "Fixed" does not prove it was actually fixed. FixProof verifies civic repairs using photographic evidence and transparent computer vision.',
    reportProblem: 'Report a Problem',
    exploreNearby: 'Explore Civic Map',
    trackReports: 'Track My Reports',
    publicDashboard: 'Public Verification Analytics',
    myReports: 'My Reports',
    authorityPortal: 'Authority Portal',
    moderationPortal: 'Moderation Portal',
    analytics: 'Analytics',
    allReports: 'All Reports',
    civicMap: 'Civic Map',
    reportDefect: 'Report Defect',
    myCases: 'My Cases',
    authorityQueue: 'Authority Queue',
    moderationHub: 'Moderation Hub',
    catalogTitle: 'Civic Evidence Catalog',
    catalogSubtitle:
      'Browse public infrastructure complaints, claimed repairs, and independent verification audits.',
    reportNewProblem: 'Report New Problem',
    searchBtn: 'Search',
    filtersLabel: 'Filters:',
    allWorkStatuses: 'All Work Statuses',
    allVerifications: 'All Verifications',
    submittedStatus: 'Submitted',
    inProgressStatus: 'In Progress',
    repairClaimedStatus: 'Repair Claimed',
    closedStatus: 'Closed',
    disputedStatus: 'Disputed',
    caseNumberLabel: 'Case #',
    reportedOnLabel: 'Reported on',
    viewCaseDetails: 'View Details',
    noReportsFound: 'No complaints found matching your criteria.',
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
    disclaimer:
      'FixProof is an independent civic verification platform. It operates fairly and evaluates evidence independently.',
    roleCitizen: 'Citizen',
    roleAuthority: 'Authority Engineer',
    roleModerator: 'Civic Moderator',
    rolePublic: 'Public Visitor',
    filterAll: 'All Categories',
    searchPlaceholder: 'Search by case ID, title, street, or landmark...',
    viewDetails: 'View Evidence & Details',
    claimRepair: 'Submit Repair Evidence',
    reviewDecision: 'Record Moderation Ruling',
    confirmResolved: 'Confirm Verified Resolved',
    rejectUnresolved: 'Mark Defect Unresolved',
    overrideAiAssessment: 'Override AI Finding with Justification',
    demoDataLabel: 'Synthetic Demonstration Record (Clearly Labeled)',
    heroAiBadge: 'Civic AI Verification Engine',
    heroLedger: 'Independent Evidence Ledger',
    inspectAiDemo: 'Inspect AI Comparison Demo',
    casesTracked: 'Cases Tracked',
    verifiedResolvedStat: 'Verified Resolved',
    unresolvedRateStat: 'Unresolved Closure Rate',
    tamperHashedStat: 'Tamper Hashed (SHA-256)',
    fiveQuestionsTitle: 'How FixProof Solves the Civic Evidence Gap',
    fiveQuestionsSubtitle: 'Every case is scrutinized against five objective verification tests:',
    q1Title: 'What was reported?',
    q1Desc: 'Immutable original photograph, GPS geostamp, category & timestamp hash.',
    q2Title: 'What is the repair proof?',
    q2Desc: 'After-photo submitted with authorized agency credentials and materials used.',
    q3Title: 'Is it the same scene?',
    q3Desc: 'Stationary landmark alignment, curb matching, and GPS distance threshold checks.',
    q4Title: 'Is the defect resolved?',
    q4Desc: 'AI surface texture, asphalt contour, and cavity depth analysis.',
    q5Title: 'What if it fails?',
    q5Desc: 'Citizens challenge false closures, upload reinspections, and trigger human moderation.',
    featuredCasesTitle: 'Featured Civic Cases & AI Audits',
    featuredCasesSubtitle: 'Explore live test cases comparing claimed municipal closures against actual visual findings.',
    viewAllReportsLink: 'View All Reports',
    demoBannerTitle: 'Demonstration Environment Active:',
    demoBannerDesc: 'Preloaded with 10 synthetic test cases spanning verified repairs, false closures, partial work, optical blur, and photographic duplicate fraud detection.',
    resetDemoBtn: 'Reset Demo Cases',
    footerTagline: 'Reported. Repaired. Verified.',
    footerRights: 'Independent Civic Verification & Computer Vision Infrastructure.',
    footerPrivacy: 'Compliant with WCAG 2.2 AA accessibility guidelines. DPDP Act privacy principles.',
  },
  te: {
    tagline: 'నివేదించబడింది. మరమ్మతు చేయబడింది. ధృవీకరించబడింది.',
    subTagline:
      'ఫిర్యాదును "పరిష్కరించబడింది" అని గుర్తించడం వల్ల సమస్య పరిష్కారమైందని రుజువు కాదు. ఫోటో ఆధారాలు మరియు కంప్యూటర్ విజన్ ద్వారా ఫిక్స్‌ప్రూఫ్ ధృవీకరిస్తుంది.',
    reportProblem: 'సమస్యను నివేదించండి',
    exploreNearby: 'పౌర పటం చూడండి',
    trackReports: 'నా నివేదికలను ట్రాక్ చేయండి',
    publicDashboard: 'పౌర ధృవీకరణ గణాంకాలు',
    myReports: 'నా కేసులు',
    authorityPortal: 'అధికార పోర్టల్',
    moderationPortal: 'మధ్యవర్తిత్వ పోర్టల్',
    analytics: 'విశ్లేషణలు',
    allReports: 'అన్ని నివేదికలు',
    civicMap: 'పౌర పటం',
    reportDefect: 'లోపం నివేదించండి',
    myCases: 'నా కేసులు',
    authorityQueue: 'అధికార క్యూ',
    moderationHub: 'మధ్యవర్తిత్వ కేంద్రం',
    catalogTitle: 'పౌర ఆధారాల కేటలాగ్',
    catalogSubtitle:
      'ప్రజా మౌలిక సదుపాయాల ఫిర్యాదులు, మరమ్మత్తులు మరియు స్వతంత్ర ధృవీకరణలను బ్రౌజ్ చేయండి.',
    reportNewProblem: 'కొత్త సమస్యను నివేదించండి',
    searchBtn: 'వెతకండి',
    filtersLabel: 'ఫిల్టర్లు:',
    allWorkStatuses: 'అన్ని పని స్థితులు',
    allVerifications: 'అన్ని ధృవీకరణలు',
    submittedStatus: 'సమర్పించబడింది',
    inProgressStatus: 'పురోగతిలో ఉంది',
    repairClaimedStatus: 'మరమ్మతు దావా',
    closedStatus: 'ముగిసింది',
    disputedStatus: 'వివాదాస్పదం',
    caseNumberLabel: 'కేస్ #',
    reportedOnLabel: 'నివేదించిన తేదీ',
    viewCaseDetails: 'కేస్ వివరాలు చూడండి',
    noReportsFound: 'మీ ప్రమాణాలకు సరిపోలే ఫిర్యాదులు కనుగొనబడలేదు.',
    pothole: 'రోడ్డు గుంత మరియు ప్రమాదం',
    garbage: 'చెత్త మరియు ఘన వ్యర్థాలు',
    footpath: 'దెబ్బతిన్న ఫుట్‌పాత్',
    drainage: 'విరిగిన డ్రైనేజీ లేదా కాలువ',
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
    searchPlaceholder: 'కేస్ ID, శీర్షిక లేదా ల్యాండ్‌మార్క్ ద్వారా శోధించండి...',
    viewDetails: 'వివరాలు చూడండి',
    claimRepair: 'మరమ్మత్తు సాక్ష్యం సమర్పించండి',
    reviewDecision: 'మోడరేషన్ తీర్పు',
    confirmResolved: 'పరిష్కరించబడినట్లు నిర్ధారించండి',
    rejectUnresolved: 'పరిష్కారం కాలేదని గుర్తు పెట్టండి',
    overrideAiAssessment: 'AI ఫలితాన్ని సరిచేయండి',
    demoDataLabel: 'డెమో డేటా',
    heroAiBadge: 'AI పౌర ధృవీకరణ ఇంజిన్',
    heroLedger: 'స్వతంత్ర ఆధారాల లెడ్జర్',
    inspectAiDemo: 'AI పోలిక డెమోని పరిశీలించండి',
    casesTracked: 'ట్రాక్ చేసిన కేసులు',
    verifiedResolvedStat: 'ధృవీకరించిన పరిష్కారం',
    unresolvedRateStat: 'తప్పుడు ముగింపు రేటు',
    tamperHashedStat: 'ట్యాంపర్-ప్రూఫ్ (SHA-256)',
    fiveQuestionsTitle: 'పౌర ఆధారాల లోపాన్ని ఫిక్స్‌ప్రూఫ్ ఎలా పరిష్కరిస్తుంది',
    fiveQuestionsSubtitle: 'ప్రతి కేసు ఐదు ఖచ్చితమైన ధృవీకరణ పరీక్షల ద్వారా పరిశీలించబడుతుంది:',
    q1Title: '1. ఏమి నివేదించబడింది?',
    q1Desc: 'మార్చలేని అసలు ఫోటో, GPS జియోస్టాంప్, వర్గం మరియు టైమ్‌స్టాంప్ హాష్.',
    q2Title: '2. మరమ్మతు రుజువు ఏమిటి?',
    q2Desc: 'అధికారిక ఏజెన్సీ ఆధారాలు మరియు ఉపయోగించిన పదార్థాలతో సమర్పించిన ఫోటో.',
    q3Title: '3. ఇది అదే ప్రాంతమా?',
    q3Desc: 'స్థిరమైన ల్యాండ్‌మార్క్‌లు, సరిహద్దు సరిపోలిక మరియు GPS దూరం తనిఖీ.',
    q4Title: '4. లోపం పరిష్కరించబడిందా?',
    q4Desc: 'AI ఉపరితల ఆకృతి, తారు సమతుల్యత మరియు లోతు విశ్లేషణ.',
    q5Title: '5. విఫలమైతే ఏమి జరుగుతుంది?',
    q5Desc: 'పౌరులు తప్పుడు ముగింపులను సవాలు చేయవచ్చు, పునఃపరిశీలన ఆధారాలు అప్‌లోడ్ చేసి మానవ సమీక్షను కోరవచ్చు.',
    featuredCasesTitle: 'ఫీచర్ చేసిన పౌర కేసులు & AI ఆడిట్లు',
    featuredCasesSubtitle: 'మున్సిపల్ అధికారుల దావాలను వాస్తవ దృశ్య పరిశీలనలతో సరిపోల్చండి.',
    viewAllReportsLink: 'అన్ని నివేదికలను చూడండి',
    demoBannerTitle: 'డెమో వాతావరణం సక్రియంగా ఉంది:',
    demoBannerDesc: 'ధృవీకరించిన మరమ్మతులు, తప్పుడు ముగింపులు, అసంపూర్ణ పని మరియు నకిలీ ఫోటో గుర్తింపుతో 10 పరీక్షా కేసులతో సిద్ధంగా ఉంది.',
    resetDemoBtn: 'డెమో రీసెట్ చేయండి',
    footerTagline: 'నివేదించబడింది. మరమ్మతు చేయబడింది. ధృవీకరించబడింది.',
    footerRights: 'స్వతంత్ర పౌర ధృవీకరణ & కంప్యూటర్ విజన్ వ్యవస్థ.',
    footerPrivacy: 'WCAG 2.2 AA ప్రమాణాలకు అనుగుణంగా ఉంది.',
  },
  kn: {
    tagline: 'ವರದಿ ಮಾಡಲಾಗಿದೆ. ದುರಸ್ತಿ ಮಾಡಲಾಗಿದೆ. ಪರಿಶೀಲಿಸಲಾಗಿದೆ.',
    subTagline:
      'ದೂರನ್ನು "ಪರಿಹರಿಸಲಾಗಿದೆ" ಎಂದು ಗುರುತಿಸುವುದರಿಂದ ಸಮಸ್ಯೆ ನಿಜವಾಗಿಯೂ ಪರಿಹಾರವಾಗಿದೆ ಎಂದು ಸಾಬೀತಾಗುವುದಿಲ್ಲ. ಫಿಕ್ಸ್ ಪ್ರೂಫ್ ಫೋಟೋ ಸಾಕ್ಷಿಗಳೊಂದಿಗೆ ಸತ್ಯವನ್ನು ಪರಿಶೀಲಿಸುತ್ತದೆ.',
    reportProblem: 'ಸಮಸ್ಯೆಯನ್ನು ವರದಿ ಮಾಡಿ',
    exploreNearby: 'ನಾಗರಿಕ ನಕ್ಷೆ ನೋಡಿ',
    trackReports: 'ನನ್ನ ವರದಿಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',
    publicDashboard: 'ಸಾರ್ವಜನಿಕ ಪರಿಶೀಲನಾ ಅಂಕಿಅಂಶಗಳು',
    myReports: 'ನನ್ನ ಪ್ರಕರಣಗಳು',
    authorityPortal: 'ಪ್ರಾಧಿಕಾರ ಪೋರ್ಟಲ್',
    moderationPortal: 'ಮಧ್ಯಸ್ಥಿಕೆ ಪೋರ್ಟಲ್',
    analytics: 'ವಿಶ್ಲೇಷಣೆ',
    allReports: 'ಎಲ್ಲಾ ವರದಿಗಳು',
    civicMap: 'ನಾಗರಿಕ ನಕ್ಷೆ',
    reportDefect: 'ದೋಷ ವರದಿ ಮಾಡಿ',
    myCases: 'ನನ್ನ ಪ್ರಕರಣಗಳು',
    authorityQueue: 'ಪ್ರಾಧಿಕಾರದ ಸರದಿ',
    moderationHub: 'ಮಧ್ಯಸ್ಥಿಕೆ ಕೇಂದ್ರ',
    catalogTitle: 'ನಾಗರಿಕ ಸಾಕ್ಷ್ಯಗಳ ಪಟ್ಟಿ',
    catalogSubtitle:
      'ಸಾರ್ವಜನಿಕ ಮೂಲಸೌಕರ್ಯ ದೂರುಗಳು, ದುರಸ್ತಿಗಳು ಮತ್ತು ಸ್ವತಂತ್ರ ಪರಿಶೀಲನೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.',
    reportNewProblem: 'ಹೊಸ ಸಮಸ್ಯೆಯನ್ನು ವರದಿ ಮಾಡಿ',
    searchBtn: 'ಹುಡುಕಿ',
    filtersLabel: 'ಫಿಲ್ಟರ್‌ಗಳು:',
    allWorkStatuses: 'ಎಲ್ಲಾ ಕೆಲಸದ ಸ್ಥಿತಿಗಳು',
    allVerifications: 'ಎಲ್ಲಾ ಪರಿಶೀಲನೆಗಳು',
    submittedStatus: 'ಸಲ್ಲಿಸಲಾಗಿದೆ',
    inProgressStatus: 'ಪ್ರಗತಿಯಲ್ಲಿದೆ',
    repairClaimedStatus: 'ದುರಸ್ತಿ ಪ್ರತಿಪಾದಿಸಲಾಗಿದೆ',
    closedStatus: 'ಮುಕ್ತಾಯವಾಗಿದೆ',
    disputedStatus: 'ಆಕ್ಷೇಪಿಸಲಾಗಿದೆ',
    caseNumberLabel: 'ಪ್ರಕರಣ ಸಂ.',
    reportedOnLabel: 'ವರದಿ ಮಾಡಿದ ದಿನ',
    viewCaseDetails: 'ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    noReportsFound: 'ನಿಮ್ಮ ಶೋಧನೆಗೆ ಸೂಕ್ತವಾದ ಯಾವುದೇ ದೂರುಗಳು ಕಂಡುಬಂದಿಲ್ಲ.',
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
    searchPlaceholder: 'ಪ್ರಕರಣ ಸಂಖ್ಯೆ, ಶೀರ್ಷಿಕೆ ಅಥವಾ ಸ್ಥಳದಿಂದ ಹುಡುಕಿ...',
    viewDetails: 'ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    claimRepair: 'ದುರಸ್ತಿ ಪುರಾವೆ ಸಲ್ಲಿಸಿ',
    reviewDecision: 'ತೀರ್ಪು ದಾಖಲಿಸಿ',
    confirmResolved: 'ಪರಿಹರಿಸಲಾಗಿದೆ ಎಂದು ದೃಢೀಕರಿಸಿ',
    rejectUnresolved: 'ಅಪರಿಹೃತ ಎಂದು ಗುರುತಿಸಿ',
    overrideAiAssessment: 'AI ನಿರ್ಧಾರ ಬದಲಾಯಿಸಿ',
    demoDataLabel: 'ಡೆಮೊ ಮಾಹಿತಿ',
    heroAiBadge: 'AI ನಾಗರಿಕ ಪರಿಶೀಲನಾ ಎಂಜಿನ್',
    heroLedger: 'ಸ್ವತಂತ್ರ ಸಾಕ್ಷ್ಯಗಳ ಲೆಡ್ಜರ್',
    inspectAiDemo: 'AI ಹೋಲಿಕೆ ಡೆಮೊ ನೋಡಿ',
    casesTracked: 'ದಾಖಲಾದ ಪ್ರಕರಣಗಳು',
    verifiedResolvedStat: 'ಪರಿಶೀಲಿಸಿದ ಪರಿಹಾರ',
    unresolvedRateStat: 'ಅಪೂರ್ಣ ಮುಕ್ತಾಯ ದರ',
    tamperHashedStat: 'ಟ್ಯಾಂಪರ್-ಪ್ರೂಫ್ (SHA-256)',
    fiveQuestionsTitle: 'ನಾಗರಿಕ ಸಾಕ್ಷ್ಯಗಳ ಕೊರತೆಯನ್ನು ಫಿಕ್ಸ್ ಪ್ರೂಫ್ ಹೇಗೆ ಪರಿಹರಿಸುತ್ತದೆ',
    fiveQuestionsSubtitle: 'ಪ್ರತಿಯೊಂದು ಪ್ರಕರಣವನ್ನು ಐದು ವಸ್ತುನಿಷ್ಠ ಪರೀಕ್ಷೆಗಳಿಂದ ಪರಿಶೀಲಿಸಲಾಗುತ್ತದೆ:',
    q1Title: '1. ಏನು ವರದಿ ಮಾಡಲಾಗಿದೆ?',
    q1Desc: 'ಬದಲಾಯಿಸಲಾಗದ ಮೂಲ ಫೋಟೋ, GPS ಜಿಯೋಸ್ಟ್ಯಾಂಪ್ ಮತ್ತು ಟೈಮ್‌ಸ್ಟ್ಯಾಂಪ್ ಹ್ಯಾಶ್.',
    q2Title: '2. ದುರಸ್ತಿ ಸಾಕ್ಷಿ ಏನು?',
    q2Desc: 'ಅಧಿಕೃತ ಏಜೆನ್ಸಿ ಮತ್ತು ಬಳಸಿದ ವಸ್ತುಗಳೊಂದಿಗೆ ಸಲ್ಲಿಸಿದ ನಂತರದ ಫೋಟೋ.',
    q3Title: '3. ಇದು ಅದೇ ಸ್ಥಳವೇ?',
    q3Desc: 'ಸ್ಥಿರ ಹೆಗ್ಗುರುತುಗಳು, ಕರ್ಬ್ ಹೊಂದಾಣಿಕೆ ಮತ್ತು GPS ದೂರ ತಪಾಸಣೆ.',
    q4Title: '4. ದೋಷ ಪರಿಹಾರವಾಗಿದೆಯೇ?',
    q4Desc: 'AI ಮೇಲ್ಮೈ ವಿನ್ಯಾಸ, ಆಸ್ಫಾಲ್ಟ್ ಸಮತೋಲನ ಮತ್ತು ಆಳದ ವಿಶ್ಲೇಷಣೆ.',
    q5Title: '5. ವಿಫಲವಾದರೆ ಏನು ಮಾಡಬೇಕು?',
    q5Desc: 'ನಾಗರಿಕರು ತಪ್ಪಾದ ಮುಕ್ತಾಯವನ್ನು ಪ್ರಶ್ನಿಸಬಹುದು ಮತ್ತು ಮಾನವ ಪರಿಶೀಲನೆಗೆ ಸಲ್ಲಿಸಬಹುದು.',
    featuredCasesTitle: 'ಪ್ರಮುಖ ನಾಗರಿಕ ಪ್ರಕರಣಗಳು & AI ಆಡಿಟ್‌ಗಳು',
    featuredCasesSubtitle: 'ಮುನ್ಸಿಪಲ್ ದುರಸ್ತಿ ಪ್ರತಿಪಾದನೆಗಳನ್ನು ನಿಜವಾದ ಸಾಕ್ಷ್ಯಗಳೊಂದಿಗೆ ಹೋಲಿಸಿ ನೋಡಿ.',
    viewAllReportsLink: 'ಎಲ್ಲಾ ವರದಿಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    demoBannerTitle: 'ಡೆಮೊ ಪರಿಸರ ಸಕ್ರಿಯವಾಗಿದೆ:',
    demoBannerDesc: 'ಪರಿಶೀಲಿಸಿದ ದುರಸ್ತಿಗಳು, ತಪ್ಪಾದ ಮುಕ್ತಾಯಗಳು ಮತ್ತು ನಕಲಿ ವಂಚನೆ ಪತ್ತೆಹಚ್ಚುವಿಕೆಯ 10 ಪರೀಕ್ಷಾ ಪ್ರಕರಣಗಳೊಂದಿಗೆ ಲೋಡ್ ಆಗಿದೆ.',
    resetDemoBtn: 'ಡೆಮೊ ಮರುಹೊಂದಿಸಿ',
    footerTagline: 'ವರದಿ ಮಾಡಲಾಗಿದೆ. ದುರಸ್ತಿ ಮಾಡಲಾಗಿದೆ. ಪರಿಶೀಲಿಸಲಾಗಿದೆ.',
    footerRights: 'ಸ್ವತಂತ್ರ ನಾಗರಿಕ ಪರಿಶೀಲನೆ ಮತ್ತು ಕಂಪ್ಯೂಟರ್ ವಿಷನ್ ಮೂಲಸೌಕರ್ಯ.',
    footerPrivacy: 'WCAG 2.2 AA ಮಾರ್ಗಸೂಚಿಗಳಿಗೆ ಅನುಗುಣವಾಗಿದೆ.',
  },
  hi: {
    tagline: 'रिपोर्ट किया। मरम्मत की। सत्यापित किया।',
    subTagline:
      'शिकायत को "हल" चिह्नित करने का मतलब यह नहीं कि समस्या हल हो गई। फिक्सप्रूफ तस्वीरों और एआई से प्रमाण सत्यापित करता है।',
    reportProblem: 'समस्या की रिपोर्ट करें',
    exploreNearby: 'नागरिक मानचित्र देखें',
    trackReports: 'मेरी शिकायतें ट्रैक करें',
    publicDashboard: 'सत्यापन आंकड़े',
    myReports: 'मेरे मामले',
    authorityPortal: 'प्राधिकरण पोर्टल',
    moderationPortal: 'मध्यस्थ पोर्टल',
    analytics: 'एनालिटिक्स',
    allReports: 'सभी रिपोर्टें',
    civicMap: 'नागरिक मानचित्र',
    reportDefect: 'दोष दर्ज करें',
    myCases: 'मेरे मामले',
    authorityQueue: 'प्राधिकरण कतार',
    moderationHub: 'मध्यस्थता केंद्र',
    catalogTitle: 'नागरिक साक्ष्य कैटलॉग',
    catalogSubtitle:
      'सार्वजनिक बुनियादी ढांचे की शिकायतें, मरम्मत और स्वतंत्र सत्यापन देखें।',
    reportNewProblem: 'नई समस्या दर्ज करें',
    searchBtn: 'खोजें',
    filtersLabel: 'फ़िल्टर:',
    allWorkStatuses: 'सभी कार्य स्थितियाँ',
    allVerifications: 'सभी सत्यापन',
    submittedStatus: 'प्रस्तुत',
    inProgressStatus: 'प्रगति पर है',
    repairClaimedStatus: 'मरम्मत का दावा',
    closedStatus: 'बंद',
    disputedStatus: 'विवादित',
    caseNumberLabel: 'केस सं.',
    reportedOnLabel: 'रिपोर्ट की तारीख',
    viewCaseDetails: 'विवरण देखें',
    noReportsFound: 'आपके मानदंडों से मेल खाने वाली कोई शिकायत नहीं मिली।',
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
    searchPlaceholder: 'केस आईडी, शीर्षक या लैंडमार्क से खोजें...',
    viewDetails: 'विवरण देखें',
    claimRepair: 'मरम्मत साक्ष्य दर्ज करें',
    reviewDecision: 'मध्यस्थ निर्णय दर्ज करें',
    confirmResolved: 'सत्यापित हल की पुष्टि करें',
    rejectUnresolved: 'दोष अनसुलझा चिह्नित करें',
    overrideAiAssessment: 'स्पष्टीकरण के साथ एआई निष्कर्ष बदलें',
    demoDataLabel: 'सिंथेटिक डेमो डेटा (स्पष्ट रूप से लेबल किया गया)',
    heroAiBadge: 'एआई नागरिक सत्यापन इंजन',
    heroLedger: 'स्वतंत्र साक्ष्य बहीखाता',
    inspectAiDemo: 'एआई तुलना डेमो देखें',
    casesTracked: 'ट्रैक किए गए मामले',
    verifiedResolvedStat: 'सत्यापित हल',
    unresolvedRateStat: 'अनसुलझी समाप्ति दर',
    tamperHashedStat: 'छेड़छाड़-रोधी (SHA-256)',
    fiveQuestionsTitle: 'फिक्सप्रूफ साक्ष्य अंतर को कैसे दूर करता है',
    fiveQuestionsSubtitle: 'प्रत्येक मामले की पांच वस्तुनिष्ठ परीक्षणों से जांच की जाती है:',
    q1Title: '1. क्या रिपोर्ट किया गया था?',
    q1Desc: 'अपरिवर्तनीय मूल तस्वीर, जीपीएस स्थान, श्रेणी और टाइमस्टैम्प हैश।',
    q2Title: '2. मरम्मत का प्रमाण क्या है?',
    q2Desc: 'अधिकृत एजेंसी क्रेडेंशियल और प्रयुक्त सामग्री के साथ प्रस्तुत बाद की तस्वीर।',
    q3Title: '3. क्या यह वही स्थान है?',
    q3Desc: 'स्थिर स्थलों, फुटपाथ मिलान और जीपीएस दूरी सीमा की जांच।',
    q4Title: '4. क्या दोष ठीक हो गया है?',
    q4Desc: 'एआई सतह बनावट, डामर समतलता और गहराई विश्लेषण।',
    q5Title: '5. यदि यह विफल हो जाए तो क्या होगा?',
    q5Desc: 'नागरिक गलत समाप्ति को चुनौती दे सकते हैं, पुनः निरीक्षण तस्वीरें अपलोड कर सकते हैं।',
    featuredCasesTitle: 'प्रमुख नागरिक मामले और एआई ऑडिट',
    featuredCasesSubtitle: 'दावा किए गए नगर निगम समाधानों की वास्तविक तस्वीरों से तुलना करें।',
    viewAllReportsLink: 'सभी रिपोर्ट देखें',
    demoBannerTitle: 'डेमो वातावरण सक्रिय:',
    demoBannerDesc: 'सत्यापित मरम्मत, गलत समाप्ति, आंशिक कार्य और नकली साक्ष्य पहचान के 10 परीक्षण मामलों के साथ प्रीलोडेड।',
    resetDemoBtn: 'डेमो रीसेट करें',
    footerTagline: 'रिपोर्ट किया। मरम्मत की। सत्यापित किया।',
    footerRights: 'स्वतंत्र नागरिक सत्यापन और कंप्यूटर विज़न अवसंरचना।',
    footerPrivacy: 'WCAG 2.2 AA पहुंच दिशानिर्देशों के अनुरूप।',
  },
};
