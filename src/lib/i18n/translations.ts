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
  comparePageTitle: string;
  comparePageSubtitle: string;
  interactiveSlider: string;
  sideBySideView: string;
  overlayDefectRegion: string;
  rerunAiVerification: string;
  sameSceneCheck: string;
  defectResolutionCheck: string;
  opticalSharpnessCheck: string;
  geoVerificationCheck: string;
  fraudCheck: string;
  scorecard: string;
  backToCase: string;
  backToCatalog: string;
  claimModalTitle: string;
  claimModalDesc: string;
  disputeModalTitle: string;
  disputeModalDesc: string;
  reviewModalTitle: string;
  reviewModalDesc: string;
  cancelBtn: string;
  submitClaimBtn: string;
  fileDisputeBtn: string;
  recordRulingBtn: string;
  selectLanguage: string;
  changeLanguage: string;
  switchPersona: string;
  governmentContacts: string;
  officialsDirectory: string;
  officialsSubtitle: string;
  searchOfficialsPlaceholder: string;
  departmentAll: string;
  departmentRoads: string;
  departmentWater: string;
  departmentGarbage: string;
  departmentElectricity: string;
  departmentTraffic: string;
  cityAll: string;
  escalationMatrixTitle: string;
  escalationMatrixSubtitle: string;
  tier1Title: string;
  tier1Desc: string;
  tier2Title: string;
  tier2Desc: string;
  tier3Title: string;
  tier3Desc: string;
  callNow: string;
  sendNotice: string;
  whatsAppGrievance: string;
  copyContact: string;
  copiedNotice: string;
  jurisdiction: string;
  officeHours: string;
  verifiedOfficialBadge: string;
  emergencyHelplinesTitle: string;
  homeNav: string;
  sidebarToggle: string;
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
    comparePageTitle: 'AI Evidence Comparison Center',
    comparePageSubtitle: 'Comparing original citizen complaint evidence against claimed municipal repair imagery.',
    interactiveSlider: 'Interactive Slider',
    sideBySideView: 'Side by Side',
    overlayDefectRegion: 'Defect Region Overlay',
    rerunAiVerification: 'Re-run AI Analysis',
    sameSceneCheck: 'Same Physical Scene',
    defectResolutionCheck: 'Defect Resolution Score',
    opticalSharpnessCheck: 'Optical Sharpness',
    geoVerificationCheck: 'Geolocation Match',
    fraudCheck: 'Anti-Fraud Integrity',
    scorecard: 'Comparison Scorecard',
    backToCase: 'Back to Case File',
    backToCatalog: 'Back to Cases',
    claimModalTitle: 'Submit Repair Evidence & Completion Photo',
    claimModalDesc: 'Upload photographic evidence showing completed repair work. FixProof AI will analyze landmarks and surface finish.',
    disputeModalTitle: 'Dispute Municipal Resolution Claim',
    disputeModalDesc: 'If a problem was marked resolved without being fixed, submit your challenge and optional reinspection photo.',
    reviewModalTitle: 'Record Human Moderation Ruling',
    reviewModalDesc: 'As an independent civic moderator, issue a documented, binding determination.',
    cancelBtn: 'Cancel',
    submitClaimBtn: 'Submit Repair Evidence',
    fileDisputeBtn: 'File Official Challenge',
    recordRulingBtn: 'Record Binding Ruling',
    selectLanguage: 'Language',
    changeLanguage: 'Switch Language',
    switchPersona: 'Switch User Persona (Demo & RBAC)',
    governmentContacts: 'Govt Officials & Contacts',
    officialsDirectory: 'Official Civic Contacts Directory',
    officialsSubtitle:
      'Direct contacts, jurisdiction maps, and escalation desks for municipal engineers, zonal commissioners, and utility boards.',
    searchOfficialsPlaceholder: 'Search official by name, designation, ward, or department...',
    departmentAll: 'All Departments',
    departmentRoads: 'Roads & Potholes (PWD / BBMP)',
    departmentWater: 'Water & Drainage (BWSSB / HMWSSB)',
    departmentGarbage: 'Solid Waste & Sanitation',
    departmentElectricity: 'Electricity & Streetlights',
    departmentTraffic: 'Traffic & Road Safety',
    cityAll: 'All Cities / Municipalities',
    escalationMatrixTitle: 'Citizen Escalation Protocol & Rights',
    escalationMatrixSubtitle:
      'If a defect is falsely marked closed or ignored, follow this statutory grievance escalation procedure.',
    tier1Title: 'Tier 1: Ward Junior Engineer',
    tier1Desc:
      'First responder for inspection, pothole patch-up, and localized drainage maintenance (48-72 hour response standard).',
    tier2Title: 'Tier 2: Assistant Executive Engineer',
    tier2Desc:
      'Direct supervisor for ward tenders, contracting quality, and photographic repair sign-offs (7 day resolution window).',
    tier3Title: 'Tier 3: Zonal Commissioner & Lokayukta',
    tier3Desc:
      'Statutory appellate authority for fraudulent closure audit, disciplinary penalties, and anti-corruption inquiry.',
    callNow: 'Direct Call',
    sendNotice: 'Send Formal Notice',
    whatsAppGrievance: 'WhatsApp Desk',
    copyContact: 'Copy Details',
    copiedNotice: 'Copied to clipboard!',
    jurisdiction: 'Jurisdiction / Coverage',
    officeHours: 'Working Hours',
    verifiedOfficialBadge: 'Verified Official',
    emergencyHelplinesTitle: '24/7 Rapid Emergency Civic Helplines',
    homeNav: 'Home',
    sidebarToggle: 'Toggle Sidebar',
  },
  te: {
    tagline: 'నివేదించబడింది. మరమ్మతు చేయబడింది. ధృవీకరించబడింది.',
    subTagline:
      'ఫిర్యాదును "పరిష్కరించబడింది" అని గుర్తించడం వల్ల సమస్య పరిష్కారమైందని రుజువు కాదు. ఫోటో ఆధారాలు మరియు కంప్యూటర్ విజన్ ద్వారా ఫిక్స్‌ప్రూఫ్ నిజాయితీగా ధృవీకరిస్తుంది.',
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
    appearsUnresolved: 'పరిష్కారం కాలేదు (తప్పుడు ముగింపు)',
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
    stepCategory: '1. సమస్య వర్గాన్ని ఎంచుకోండి',
    stepPhoto: '2. ఫోటో ఆధారాలు తీయండి',
    stepLocation: '3. స్థలాన్ని గుర్తించండి',
    stepReview: '4. సమీక్షించండి & సమర్పించండి',
    locationAccuracy: 'GPS లొకేషన్ ఖచ్చితత్వం',
    sha256Proof: 'SHA-256 క్రిప్టోగ్రాఫిక్ హాష్',
    perceptualHash: 'విజువల్ హాష్ (dHash)',
    evidenceIntegrity: 'సాక్ష్యాల సమగ్రత & మోసాల నిరోధం',
    aiVerificationFindings: 'AI ధృవీకరణ ఫలితాలు',
    humanReviewStatus: 'మానవ సమీక్ష & తుది తీర్పు',
    timelineAuditLog: 'మార్చలేని ఆడిట్ రికార్డు',
    disclaimer: 'ఫిక్స్‌ప్రూఫ్ స్వతంత్ర పౌర ధృవీకరణ వేదిక. ఇది పక్షపాతం లేకుండా సాక్ష్యాలను స్వతంత్రంగా విశ్లేషిస్తుంది.',
    roleCitizen: 'పౌరుడు',
    roleAuthority: 'అధికార ఇంజనీర్',
    roleModerator: 'సివిక్ మోడరేటర్',
    rolePublic: 'సందర్శకుడు',
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
    comparePageTitle: 'AI సాక్ష్యాల పోలిక కేంద్రం',
    comparePageSubtitle: 'పౌరుల అసలు ఫిర్యాదు ఫోటోను మున్సిపల్ మరమ్మతు ఫోటోతో AI ద్వారా సరిపోల్చండి.',
    interactiveSlider: 'ఇంటరాక్టివ్ స్లైడర్',
    sideBySideView: 'పక్కపక్కనే వీక్షణ',
    overlayDefectRegion: 'లోపం ఉన్న ప్రాంతం ఓవర్‌లే',
    rerunAiVerification: 'AI విశ్లేషణను మళ్లీ అమలు చేయండి',
    sameSceneCheck: 'అదే ప్రాంతమా (ల్యాండ్‌మార్క్‌లు)',
    defectResolutionCheck: 'లోపం పరిష్కార స్కోరు',
    opticalSharpnessCheck: 'ఫోటో స్పష్టత',
    geoVerificationCheck: 'GPS స్థాన సరిపోలిక',
    fraudCheck: 'మోసాల నిరోధక తనిఖీ',
    scorecard: 'సరిపోలిక స్కోర్‌కార్డ్',
    backToCase: 'కేస్ ఫైల్‌కి తిరిగి వెళ్లండి',
    backToCatalog: 'కేసుల జాబితాకు వెళ్లండి',
    claimModalTitle: 'మరమ్మతు సాక్ష్యాలను సమర్పించండి',
    claimModalDesc: 'పూర్తయిన మరమ్మత్తు పనుల ఫోటోను అప్‌లోడ్ చేయండి. AI ల్యాండ్‌మార్క్‌లు మరియు నాణ్యతను విశ్లేషిస్తుంది.',
    disputeModalTitle: 'తప్పుడు పరిష్కారాన్ని సవాలు చేయండి',
    disputeModalDesc: 'సమస్య పరిష్కారం కాకుండానే క్లోజ్ చేయబడితే, మీ సవాలును మరియు తాజా ఫోటోను సమర్పించండి.',
    reviewModalTitle: 'అధికారిక మోడరేషన్ తీర్పును నమోదు చేయండి',
    reviewModalDesc: 'స్వతంత్ర పౌర మధ్యవర్తిగా, నిష్పాక్షికమైన చట్టబద్ధమైన నిర్ణయాన్ని నమోదు చేయండి.',
    cancelBtn: 'రద్దు చేయండి',
    submitClaimBtn: 'సాక్ష్యాలను సమర్పించండి',
    fileDisputeBtn: 'సవాలును నమోదు చేయండి',
    recordRulingBtn: 'తీర్పును నమోదు చేయండి',
    selectLanguage: 'భాష',
    changeLanguage: 'భాషను మార్చండి',
    switchPersona: 'యూజర్ పాత్రను మార్చండి (డెమో)',
    governmentContacts: 'ప్రభుత్వ అధికారులు & పరిచయాలు',
    officialsDirectory: 'మునిసిపల్ అధికారుల డైరెక్టరీ',
    officialsSubtitle:
      'మునిసిపల్ ఇంజనీర్లు, జోనల్ కమిషనర్లు మరియు యుటిలిటీ బోర్డుల ప్రత్యక్ష సంప్రదింపు సమాచారం మరియు ఎస్కలేషన్ డెస్క్.',
    searchOfficialsPlaceholder: 'పేరు, హోదా, వార్డు లేదా శాఖ ద్వారా శోధించండి...',
    departmentAll: 'అన్ని శాఖలు',
    departmentRoads: 'రోడ్లు & గుంతలు (PWD / GHMC)',
    departmentWater: 'నీటి సరఫరా & డ్రైనేజీ (HMWSSB)',
    departmentGarbage: 'చెత్త & పారిశుధ్య నిర్వహణ',
    departmentElectricity: 'విద్యుత్ & వీధి దీపాలు',
    departmentTraffic: 'ట్రాఫిక్ & రోడ్డు భద్రత',
    cityAll: 'అన్ని నగరాలు / కార్పొరేషన్లు',
    escalationMatrixTitle: 'పౌర పరిష్కార మెట్ల శ్రేణి & హక్కులు',
    escalationMatrixSubtitle:
      'ఫిర్యాదు తప్పుడుగా పరిష్కరించబడినా లేదా నిర్లక్ష్యం చేయబడినా, ఈ చట్టబద్ధమైన పద్ధతిని అనుసరించండి.',
    tier1Title: 'స్థాయి 1: వార్డు జూనియర్ ఇంజనీర్',
    tier1Desc:
      'ప్రాథమిక పరిశీలన, గుంతల మరమ్మత్తు మరియు మురుగునీటి సమస్యల తొలి బాధ్యత (48-72 గంటల వ్యవధి).',
    tier2Title: 'స్థాయి 2: అసిస్టెంట్ ఎగ్జిక్యూటివ్ ఇంజనీర్',
    tier2Desc:
      'వార్డు పనుల నాణ్యత పర్యవేక్షణ మరియు ఫోటో ఆధారాల ధృవీకరణ అధికారి (7 రోజుల గడువు).',
    tier3Title: 'స్థాయి 3: జోనల్ కమిషనర్ & లోకాయుక్త',
    tier3Desc:
      'తప్పుడు ముగింపులపై చట్టపరమైన విచారణ, జరిమానా మరియు క్రమశిక్షణా చర్యల అత్యున్నత అప్పిలేట్ అథారిటీ.',
    callNow: 'కాల్ చేయండి',
    sendNotice: 'నోటీస్ పంపండి',
    whatsAppGrievance: 'వాట్సాప్ ఫిర్యాదు',
    copyContact: 'కాపీ చేయండి',
    copiedNotice: 'క్లిప్‌బోర్డ్‌కు కాపీ చేయబడింది!',
    jurisdiction: 'పరిధి / వార్డులు',
    officeHours: 'కార్యాలయ పనివేళలు',
    verifiedOfficialBadge: 'ధృవీకరించబడిన అధికారి',
    emergencyHelplinesTitle: '24/7 అత్యవసర పౌర హెల్ప్‌లైన్‌లు',
    homeNav: 'హోమ్',
    sidebarToggle: 'సైడ్‌బార్ మార్చండి',
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
    appearsUnresolved: 'ಪರಿಹರಿಸಲಾಗಿಲ್ಲ (ತಪ್ಪಾದ ಮುಕ್ತಾಯ)',
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
    evidenceIntegrity: 'ಸಾಕ್ಷ್ಯದ ಸಮಗ್ರತೆ & ವಂಚನೆ ತಡೆ',
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
    comparePageTitle: 'AI ಸಾಕ್ಷ್ಯ ಹೋಲಿಕೆ ಕೇಂದ್ರ',
    comparePageSubtitle: 'ಮೂಲ ನಾಗರಿಕ ದೂರಿನ ಫೋಟೋವನ್ನು ಮುನ್ಸಿಪಲ್ ದುರಸ್ತಿ ಫೋಟೋದೊಂದಿಗೆ ಹೋಲಿಸಿ.',
    interactiveSlider: 'ಇಂಟರ್ಯಾಕ್ಟಿವ್ ಸ್ಲೈಡರ್',
    sideBySideView: 'ಪಕ್ಕಪಕ್ಕದ ಹೋಲಿಕೆ',
    overlayDefectRegion: 'ದೋಷ ಪ್ರದೇಶ ಗುರುತು',
    rerunAiVerification: 'AI ವಿಶ್ಲೇಷಣೆ ಮರುಚಾಲನೆ',
    sameSceneCheck: 'ಅದೇ ಸ್ಥಳ (ಹೆಗ್ಗುರುತುಗಳು)',
    defectResolutionCheck: 'ದೋಷ ಪರಿಹಾರ ಸ್ಕೋರ್',
    opticalSharpnessCheck: 'ಫೋಟೋ ಗುಣಮಟ್ಟ',
    geoVerificationCheck: 'GPS ಸ್ಥಳ ಹೊಂದಾಣಿಕೆ',
    fraudCheck: 'ವಂಚನೆ ತಪಾಸಣೆ',
    scorecard: 'ಹೋಲಿಕೆ ಸ್ಕೋರ್‌ಕಾರ್ಡ್',
    backToCase: 'ಪ್ರಕರಣದ ವಿವರಕ್ಕೆ ಹಿಂತಿರುಗಿ',
    backToCatalog: 'ಪ್ರಕರಣಗಳ ಪಟ್ಟಿಗೆ ಹಿಂತಿರುಗಿ',
    claimModalTitle: 'ದುರಸ್ತಿ ಸಾಕ್ಷಿ & ಪೂರ್ಣಗೊಂಡ ಫೋಟೋ ಸಲ್ಲಿಸಿ',
    claimModalDesc: 'ಪೂರ್ಣಗೊಂಡ ದುರಸ್ತಿಯ ಫೋಟೋವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ. AI ಹೆಗ್ಗುರುತುಗಳನ್ನು ಮತ್ತು ಗುಣಮಟ್ಟವನ್ನು ಪರೀಕ್ಷಿಸುತ್ತದೆ.',
    disputeModalTitle: 'ಮುನ್ಸಿಪಲ್ ಪರಿಹಾರವನ್ನು ಪ್ರಶ್ನಿಸಿ',
    disputeModalDesc: 'ಸಮಸ್ಯೆ ಬಗೆಹರಿಯದೆ ಪ್ರಕರಣ ಮುಕ್ತಾಯವಾಗಿದ್ದರೆ, ನಿಮ್ಮ ಆಕ್ಷೇಪಣೆ ಸಲ್ಲಿಸಿ.',
    reviewModalTitle: 'ಮಾನವ ಮಧ್ಯಸ್ಥಿಕೆ ತೀರ್ಪು ದಾಖಲಿಸಿ',
    reviewModalDesc: 'ಸ್ವತಂತ್ರ ನಾಗರಿಕ ಮಧ್ಯಸ್ಥಗಾರರಾಗಿ, ದಾಖಲಿತ ಅಧಿಕೃತ ತೀರ್ಪು ನೀಡಿ.',
    cancelBtn: 'ರದ್ದುಮಾಡಿ',
    submitClaimBtn: 'ದುರಸ್ತಿ ಪುರಾವೆ ಸಲ್ಲಿಸಿ',
    fileDisputeBtn: 'ಆಕ್ಷೇಪಣೆ ದಾಖಲಿಸಿ',
    recordRulingBtn: 'ತೀರ್ಪು ದಾಖಲಿಸಿ',
    selectLanguage: 'ಭಾಷೆ',
    changeLanguage: 'ಭಾಷೆ ಬದಲಾಯಿಸಿ',
    switchPersona: 'ಬಳಕೆದಾರರ ಪಾತ್ರ ಬದಲಾಯಿಸಿ',
    governmentContacts: 'ಸರ್ಕಾರಿ ಅಧಿಕಾರಿಗಳು & ಸಂಪರ್ಕಗಳು',
    officialsDirectory: 'ಪಾಲಿಕೆ ಅಧಿಕಾರಿಗಳ ಅಧಿಕೃತ ಡೈರೆಕ್ಟರಿ',
    officialsSubtitle:
      'ಮಹಾನಗರ ಪಾಲಿಕೆ ಎಂಜಿನಿಯರ್‌ಗಳು, ವಲಯ ಆಯುಕ್ತರು ಮತ್ತು ಸಾರ್ವಜನಿಕ ಸೇವಾ ಮಂಡಳಿಗಳ ನೇರ ಸಂಪರ್ಕ ವಿವರಗಳು.',
    searchOfficialsPlaceholder: 'ಹೆಸರು, ಹುದ್ದೆ, ವಾರ್ಡ್ ಅಥವಾ ಇಲಾಖೆ ಮೂಲಕ ಹುಡುಕಿ...',
    departmentAll: 'ಎಲ್ಲಾ ಇಲಾಖೆಗಳು',
    departmentRoads: 'ರಸ್ತೆಗಳು & ಗುಂಡಿಗಳು (BBMP / PWD)',
    departmentWater: 'ನೀರು ಸರಬರಾಜು & ಒಳಚರಂಡಿ (BWSSB)',
    departmentGarbage: 'ಘನತ್ಯಾಜ್ಯ ನಿರ್ವಹಣೆ & ನೈರ್ಮಲ್ಯ',
    departmentElectricity: 'ವಿದ್ಯುತ್ & ಬೀದಿದೀಪಗಳು (BESCOM)',
    departmentTraffic: 'ಸಂಚಾರ & ರಸ್ತೆ ಸುರಕ್ಷತೆ',
    cityAll: 'ಎಲ್ಲಾ ನಗರಗಳು / ಮಹಾನಗರ ಪಾಲಿಕೆಗಳು',
    escalationMatrixTitle: 'ನಾಗರಿಕ ದೂರು ನಿವಾರಣಾ ಹಂತಗಳ ಶ್ರೇಣಿ',
    escalationMatrixSubtitle:
      'ದೂರನ್ನು ತಪ್ಪು ದಾಖಲೆಯೊಂದಿಗೆ ಮುಚ್ಚಿದ್ದರೆ ಅಥವಾ ನಿರ್ಲಕ್ಷಿಸಿದ್ದರೆ, ಈ ಶಾಸನಬದ್ಧ ಹಂತಗಳನ್ನು ಅನುಸರಿಸಿ.',
    tier1Title: 'ಹಂತ 1: ವಾರ್ಡ್ ಕಿರಿಯ ಇಂಜಿನಿಯರ್',
    tier1Desc:
      'ಸ್ಥಳ ಪರಿಶೀಲನೆ, ಗುಂಡಿ ದುರಸ್ತಿ ಮತ್ತು ಸ್ಥಳೀಯ ಒಳಚರಂಡಿ ನಿರ್ವಹಣೆಯ ಮೊದಲ ಜವಾಬ್ದಾರಿ (48-72 ಗಂಟೆಗಳ ಕಾಲಾವಧಿ).',
    tier2Title: 'ಹಂತ 2: ಸಹಾಯಕ ಕಾರ್ಯಪಾಲಕ ಇಂಜಿನಿಯರ್ (AEE)',
    tier2Desc:
      'ಕಾಮಗಾರಿ ಗುಣಮಟ್ಟ ತಪಾಸಣೆ ಮತ್ತು ದುರಸ್ತಿ ಸಾಕ್ಷ್ಯ ಪರಿಶೀಲನಾ ಉಸ್ತುವಾರಿ ಅಧಿಕಾರಿ (7 ದಿನಗಳ ಕಾಲಾವಧಿ).',
    tier3Title: 'ಹಂತ 3: ವಲಯ ಆಯುಕ್ತರು & ಲೋಕಾಯುಕ್ತ',
    tier3Desc:
      'ಸುಳ್ಳು ಮುಕ್ತಾಯಗಳ ವಿರುದ್ಧ ತನಿಖೆ, ಶಿಸ್ತುಕ್ರಮ ಮತ್ತು ಭ್ರಷ್ಟಾಚಾರ ನಿಯಂತ್ರಣ ಪ್ರಾಧಿಕಾರ.',
    callNow: 'ಕರೆ ಮಾಡಿ',
    sendNotice: 'ಅಧಿಕೃತ ಪತ್ರ ಕಳುಹಿಸಿ',
    whatsAppGrievance: 'ವಾಟ್ಸಾಪ್ ದೂರು',
    copyContact: 'ವಿವರ ನಕಲಿಸಿ',
    copiedNotice: 'ಕ್ಲಿಪ್‌ಬೋರ್ಡ್‌ಗೆ ನಕಲಿಸಲಾಗಿದೆ!',
    jurisdiction: 'ವ್ಯಾಪ್ತಿ / ವಾರ್ಡ್‌ಗಳು',
    officeHours: 'ಕಚೇರಿ ಕೆಲಸದ ಸಮಯ',
    verifiedOfficialBadge: 'ದೃಢೀಕೃತ ಅಧಿಕಾರಿ',
    emergencyHelplinesTitle: '24/7 ತುರ್ತು ನಾಗರಿಕ ಸಹಾಯವಾಣಿಗಳು',
    homeNav: 'ಮುಖಪುಟ',
    sidebarToggle: 'ಸೈಡ್‌ಬಾರ್ ಬದಲಿಸಿ',
  },
  hi: {
    tagline: 'रिपोर्ट किया। मरम्मत की। सत्यापित किया।',
    subTagline:
      'शिकायत को "हल" चिह्नित करने का मतलब यह नहीं कि समस्या हल हो गई। फिक्सप्रूफ तस्वीरों और कंप्यूटर विज़न से प्रमाण सत्यापित करता है।',
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
    appearsUnresolved: 'अनसुलझा प्रतीत होता है (गलत समाप्ति)',
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
    stepCategory: '1. समस्या श्रेणी चुनें',
    stepPhoto: '2. फोटोग्राफिक साक्ष्य लें',
    stepLocation: '3. स्थान जियोटैग करें',
    stepReview: '4. पुष्टि करें और सबमिट करें',
    locationAccuracy: 'जीपीएस स्थान सटीकता',
    sha256Proof: 'एसएचए-256 क्रिप्टोग्राफिक हैश',
    perceptualHash: 'दृश्य हैश (dHash)',
    evidenceIntegrity: 'साक्ष्य सत्यनिष्ठा और धोखाधड़ी रोकथाम',
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
    demoDataLabel: 'सिंथेटिक डेमो डेटा',
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
    comparePageTitle: 'एआई साक्ष्य तुलना केंद्र',
    comparePageSubtitle: 'मूल नागरिक शिकायत की तुलना नगर निगम मरम्मत तस्वीर से करें।',
    interactiveSlider: 'इंटरैक्टिव स्लाइडर',
    sideBySideView: 'आमने-सामने तुलना',
    overlayDefectRegion: 'दोष क्षेत्र पहचानें',
    rerunAiVerification: 'एआई विश्लेषण फिर से चलाएं',
    sameSceneCheck: 'वही स्थान (स्थल चिह्न)',
    defectResolutionCheck: 'दोष समाधान स्कोर',
    opticalSharpnessCheck: 'फोटो स्पष्टता',
    geoVerificationCheck: 'जीपीएस स्थान मिलान',
    fraudCheck: 'धोखाधड़ी रोकथाम',
    scorecard: 'तुलना स्कोरकार्ड',
    backToCase: 'केस फ़ाइल पर वापस जाएं',
    backToCatalog: 'केस सूची पर वापस जाएं',
    claimModalTitle: 'मरम्मत साक्ष्य और तस्वीर जमा करें',
    claimModalDesc: 'पूरी हुई मरम्मत की तस्वीर अपलोड करें। एआई गुणवत्ता और स्थल चिह्नों की जांच करेगा।',
    disputeModalTitle: 'गलत नगर निगम समाधान को चुनौती दें',
    disputeModalDesc: 'यदि समस्या ठीक हुए बिना बंद कर दी गई है, तो अपनी चुनौती और नई तस्वीर जमा करें।',
    reviewModalTitle: 'आधिकारिक मध्यस्थता निर्णय दर्ज करें',
    reviewModalDesc: 'एक स्वतंत्र नागरिक मध्यस्थ के रूप में बाध्यकारी निर्णय दर्ज करें।',
    cancelBtn: 'रद्द करें',
    submitClaimBtn: 'साक्ष्य जमा करें',
    fileDisputeBtn: 'चुनौती दर्ज करें',
    recordRulingBtn: 'निर्णय दर्ज करें',
    selectLanguage: 'भाषा',
    changeLanguage: 'भाषा बदलें',
    switchPersona: 'उपयोगकर्ता भूमिका बदलें',
    governmentContacts: 'सरकारी अधिकारी और संपर्क',
    officialsDirectory: 'नगर निगम अधिकारी संपर्क निर्देशिका',
    officialsSubtitle:
      'नगर निगम इंजीनियरों, जोनल आयुक्तों और उपयोगिता बोर्डों के लिए सीधा संपर्क और शिकायत निवारण डेस्क।',
    searchOfficialsPlaceholder: 'नाम, पद, वार्ड या विभाग से खोजें...',
    departmentAll: 'सभी विभाग',
    departmentRoads: 'सड़कें और गड्ढे (पीडब्ल्यूडी / निगम)',
    departmentWater: 'जल आपूर्ति और जल निकासी (जल बोर्ड)',
    departmentGarbage: 'ठोस अपशिष्ट और स्वच्छता',
    departmentElectricity: 'विद्युत और स्ट्रीट लाइट',
    departmentTraffic: 'यातायात और सड़क सुरक्षा',
    cityAll: 'सभी शहर / नगर निगम',
    escalationMatrixTitle: 'नागरिक निवारण पदानुक्रम और अधिकार',
    escalationMatrixSubtitle:
      'यदि शिकायत को झूठे तरीके से बंद किया गया है या अनदेखा किया गया है, तो इस वैधानिक प्रक्रिया का पालन करें।',
    tier1Title: 'स्तर 1: वार्ड कनिष्ठ अभियंता (JE)',
    tier1Desc:
      'प्राथमिक निरीक्षण, गड्ढों की मरम्मत और स्थानीय नालियों के पहले प्रतिक्रियाकर्ता (48-72 घंटे मानक)।',
    tier2Title: 'स्तर 2: सहायक कार्यकारी अभियंता (AEE)',
    tier2Desc:
      'वार्ड कार्यों की गुणवत्ता और फोटोग्राफिक साक्ष्य सत्यापन के पर्यवेक्षक (7 दिन की समय सीमा)।',
    tier3Title: 'स्तर 3: जोनल आयुक्त और लोकायुक्त',
    tier3Desc:
      'गलत क्लोजर पर ऑडिट, अनुशासनात्मक कार्रवाई और भ्रष्टाचार विरोधी जांच के लिए सर्वोच्च अपीलीय प्राधिकारी।',
    callNow: 'कॉल करें',
    sendNotice: 'औपचारिक नोटिस भेजें',
    whatsAppGrievance: 'व्हाट्सएप शिकायत',
    copyContact: 'विवरण कॉपी करें',
    copiedNotice: 'क्लिपबोर्ड पर कॉपी किया गया!',
    jurisdiction: 'क्षेत्राधिकार / वार्ड',
    officeHours: 'कार्यालय समय',
    verifiedOfficialBadge: 'सत्यापित अधिकारी',
    emergencyHelplinesTitle: '24/7 आपातकालीन नागरिक हेल्पलाइन',
    homeNav: 'होम',
    sidebarToggle: 'साइडबार टॉगल करें',
  },
};
