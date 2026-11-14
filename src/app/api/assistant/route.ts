import { NextRequest, NextResponse } from 'next/server';
import { getReportById, getAllReports, getPublicAnalytics } from '@/lib/db';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const SYSTEM_PROMPT = `You are FixBot, the official FixProof AI Civic Assistant.
FixProof's mission and tagline is: "Reported. Repaired. Verified."
The core principle is: "A complaint being marked 'Fixed' does not prove the underlying problem was actually fixed."

Your role is to assist citizens, municipal authority engineers, and civic moderators with:
1. Explaining how FixProof verifies civic repairs (photographic comparison, SHA-256 tamper hashing, perceptual dHash duplicate detection, GPS distance thresholds).
2. Guiding citizens on how to submit robust photographic evidence (clear lighting, visible stationary landmarks like curbs/poles, high sharpness, matching angles).
3. Helping citizens formulate disputes when an authority closes a complaint prematurely or with fake/unrelated after-photos.
4. Explaining municipal repair standards (hot-mix asphalt vs temporary gravel patch, drain cover safety, sidewalk grading).
5. Explaining the 5 core questions FixProof answers:
   - What was reported?
   - What is the repair proof?
   - Do both images show the same location?
   - Does the defect appear genuinely resolved?
   - What happens if the repair cannot be verified?

Always be courteous, objective, and supportive of civic transparency.
If the user speaks or queries in Kannada, Telugu, or Hindi, respond naturally in that language.
Keep answers concise, actionable, and formatted nicely with markdown bullet points.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, context } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Message is required' },
        { status: 400 }
      );
    }

    // Include real case context if user is asking about a specific case
    let caseContext = '';
    if (context?.reportId) {
      const report = getReportById(context.reportId);
      if (report) {
        caseContext = `\nCurrent Case File Context:
- ID: ${report.id} (${report.caseNumber})
- Title: ${report.title}
- Category: ${report.category}
- Address: ${report.address}
- Work Status: ${report.workStatus}
- Verification Status: ${report.verificationStatus}
- Before Evidence SHA-256: ${report.beforeEvidence?.sha256Hash || 'None'}
- After Evidence SHA-256: ${report.afterEvidence?.sha256Hash || 'Awaiting'}
- AI Verdict: ${report.latestAiVerification?.verdict || 'Pending'}`;
      }
    }

    const language = context?.language || 'en';
    const langInstruction = language !== 'en' ? `\nPlease reply in the user's selected language: ${language}.` : '';

    // 1. Try Google Gemini API if key is available
    if (GEMINI_API_KEY) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      text: `${SYSTEM_PROMPT}${langInstruction}${caseContext}\n\nUser Question: ${message}`,
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 800,
              },
            }),
          }
        );

        if (response.ok) {
          const result = await response.json();
          const aiReply = result.candidates?.[0]?.content?.parts?.[0]?.text;
          if (aiReply) {
            return NextResponse.json({
              success: true,
              message: 'AI assistant reply generated',
              data: {
                reply: aiReply,
                source: 'gemini-1.5-flash',
              },
              reply: aiReply,
            });
          }
        }
      } catch (err) {
        console.warn('Gemini assistant call failed, falling back to local civic engine:', err);
      }
    }

    // 2. Intelligent Built-in Civic Knowledge Fallback Engine
    const fallbackReply = generateCivicAssistantReply(message, context, caseContext);

    return NextResponse.json({
      success: true,
      message: 'AI assistant reply generated',
      data: {
        reply: fallbackReply,
        source: 'fixbot-civic-engine',
      },
      reply: fallbackReply,
    });
  } catch (err: any) {
    console.error('Assistant error:', err);
    return NextResponse.json(
      {
        success: false,
        message: err.message || 'Failed to generate assistant response',
        error: { code: 'INTERNAL_SERVER_ERROR' },
      },
      { status: 500 }
    );
  }
}

function generateCivicAssistantReply(query: string, context?: any, caseInfo?: string): string {
  const q = query.toLowerCase();
  const lang = context?.language || 'en';

  // Kannada responses
  if (lang === 'kn') {
    if (q.includes('dispute') || q.includes('challenge') || q.includes('ಆಕ್ಷೇಪ') || q.includes('ಪ್ರಶ್ನಿಸು')) {
      return `### ತಪ್ಪು ಮುಕ್ತಾಯವನ್ನು ಪ್ರಶ್ನಿಸುವ ವಿಧಾನ:
1. **ಪ್ರಕರಣದ ಪುಟಕ್ಕೆ ಹೋಗಿ**: ನಿಮ್ಮ ದೂರಿನ ವಿವರಗಳನ್ನು ತೆರೆಯಿರಿ.
2. **ಆಕ್ಷೇಪ ದಾಖಲಿಸಿ (Dispute)** ಬಟನ್ ಒತ್ತಿರಿ.
3. **ಮರುಪರಿಶೀಲನಾ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ**: ಸ್ಥಳದಲ್ಲಿ ಸಮಸ್ಯೆ ಇನ್ನೂ ಬಗೆಹರಿದಿಲ್ಲ ಎಂಬುದನ್ನು ತೋರಿಸುವ ಸ್ಪಷ್ಟ ಫೋಟೋ ತೆಗೆಯಿರಿ.
4. **ವಿವರಣೆ ನೀಡಿ**: ದುರಸ್ತಿ ಅಪೂರ್ಣ ಅಥವಾ ನಕಲಿ ಎಂದು ವಿವರವಾಗಿ ಬರೆಯಿರಿ.
5. **ಸ್ವತಂತ್ರ ಪರಿಶೀಲನೆ**: ನಿಮ್ಮ ಆಕ್ಷೇಪವನ್ನು ನಾಗರಿಕ ಮಧ್ಯಸ್ಥಿಕೆ ಮಂಡಳಿಗೆ (Civic Moderator) ತಕ್ಷಣ ವರ್ಗಾಯಿಸಲಾಗುತ್ತದೆ.`;
    }
    if (q.includes('photo') || q.includes('evidence') || q.includes('ಫೋಟೋ') || q.includes('ಸಾಕ್ಷ್ಯ')) {
      return `### ಉತ್ತಮ ಫೋಟೋ ಸಾಕ್ಷ್ಯದ ನಿಯಮಗಳು:
- **ಸ್ಥಿರ ಹೆಗ್ಗುರುತುಗಳು**: ಮರ, ವಿದ್ಯುತ್ ಕಂಬ, ಅಥವಾ ಕಟ್ಟಡದ ಗಡಿ ಕಾಣುವಂತೆ ಫೋಟೋ ತೆಗೆಯಿರಿ.
- **ಸ್ಪಷ್ಟತೆ**: ಮಸುಕು (blur) ಇಲ್ಲದೆ, ಉತ್ತಮ ಬೆಳಕಿನಲ್ಲಿ ತೆಗೆಯಿರಿ.
- **ಕೋನ (Angle)**: ಮೂಲ ದೂರು ದಾಖಲಿಸಿದ ಕೋನದಲ್ಲೇ ನಂತರದ ಫೋಟೋವನ್ನು ತೆಗೆಯುವುದು ಅತ್ಯುತ್ತಮ.
- **GPS ಸಕ್ರಿಯಗೊಳಿಸಿ**: ನಿಮ್ಮ ಫೋನ್‌ನ ಲೊಕೇಶನ್ ಆನ್ ಆಗಿರಲಿ.`;
    }
    return `ನಮಸ್ಕಾರ! ನಾನು **FixBot**, ಫಿಕ್ಸ್ ಪ್ರೂಫ್ AI ನಾಗರಿಕ ಸಹಾಯಕ.
- ದೂರುಗಳನ್ನು ಹೇಗೆ ದಾಖಲಿಸುವುದು?
- ಮುಕ್ತಾಯವಾದ ದುರಸ್ತಿಯನ್ನು ಹೇಗೆ ಪ್ರಶ್ನಿಸುವುದು?
- AI ಸಾಕ್ಷ್ಯ ಹೋಲಿಕೆ ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ?
ಈ ವಿಷಯಗಳ ಬಗ್ಗೆ ನೀವು ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಬಹುದು!`;
  }

  // Telugu responses
  if (lang === 'te') {
    if (q.includes('dispute') || q.includes('challenge') || q.includes('సవాలు') || q.includes('ఫిర్యాదు')) {
      return `### తప్పుడు పరిష్కారాన్ని సవాలు చేసే విధానం:
1. **కేస్ పేజీకి వెళ్లండి**: మీ ఫిర్యాదు వివరాలను తెరవండి.
2. **సవాలు చేయండి (Dispute Resolution)** బటన్‌పై క్లిక్ చేయండి.
3. **పునఃపరిశీలన ఫోటో తీయండి**: సమస్య ఇంకా పరిష్కారం కాలేదని రుజువు చేసే స్పష్టమైన ఫోటోను అప్‌లోడ్ చేయండి.
4. **కారణాన్ని వివరించండి**: మరమ్మత్తు ఎందుకు అసంపూర్ణంగా ఉందో రాయండి.
5. **మధ్యవర్తిత్వ సమీక్ష**: మీ సవాలు స్వతంత్ర సివిక్ మోడరేటర్‌కు నివేదించబడుతుంది.`;
    }
    if (q.includes('photo') || q.includes('evidence') || q.includes('ఫోటో') || q.includes('ఆధారం')) {
      return `### నాణ్యమైన ఫోటో సాక్ష్యాల మార్గదర్శకాలు:
- **స్థిరమైన ల్యాండ్‌మార్క్‌లు**: స్తంభాలు, దుకాణాల బోర్డులు లేదా ఫుట్‌పాత్ అంచులు స్పష్టంగా కనిపించేలా ఫోటో తీయండి.
- **స్పష్టత**: ఫోటో బ్లర్ కాకుండా పగటి వెలుతురులో తీయండి.
- **అదే కోణం (Same Angle)**: మొదట ఫిర్యాదు చేసిన కోణంలోనే తదుపరి ఫోటో తీస్తే AI సులభంగా సరిపోలుస్తుంది.
- **GPS లొకేషన్**: ఖచ్చితమైన జియో-స్టాంప్ కోసం లొకేషన్ ఆన్ చేయండి.`;
    }
    return `నమస్కారం! నేను **FixBot**, ఫిక్స్‌ప్రೂఫ్ AI పౌర సహాయకుడిని.
- ప్రజా సమస్యలను ఎలా నివేదించాలి?
- తప్పుడు మరమ్మతు క్లెయిమ్‌లను ఎలా సవాలు చేయాలి?
- AI ఫోటో వెరిఫికేషన్ ఎలా పనిచేస్తుంది?
ఈ అంశాలపై మీరు నన్ను ఏ ప్రశ్నైనా అడగవచ్చు!`;
  }

  // Hindi responses
  if (lang === 'hi') {
    if (q.includes('dispute') || q.includes('challenge') || q.includes('चुनौती') || q.includes('शिकायत')) {
      return `### गलत समाप्ति को चुनौती कैसे दें:
1. **केस फ़ाइल खोलें**: अपनी शिकायत का विवरण देखें।
2. **विवाद दर्ज करें (Dispute)** बटन पर क्लिक करें।
3. **पुनः निरीक्षण फोटो अपलोड करें**: साइट पर जाकर वर्तमान स्थिति की स्पष्ट तस्वीर लें।
4. **कारण दर्ज करें**: बताएं कि गड्ढा या कचरा अभी भी क्यों मौजूद है।
5. **स्वतंत्र मध्यस्थता**: मामला स्वतंत्र समीक्षा बोर्ड के पास तुरंत भेजा जाता है।`;
    }
    return `नमस्ते! मैं **FixBot**, फिक्सप्रूफ का एआई नागरिक सहायक हूँ।
- बुनियादी ढांचे की समस्याओं की रिपोर्ट कैसे करें?
- झूठे मरम्मत दावों को कैसे चुनौती दें?
- एआई साक्ष्य सत्यापन कैसे काम करता है?
आप मुझसे कोई भी सवाल पूछ सकते हैं!`;
  }

  // English default responses
  if (q.includes('dispute') || q.includes('challenge') || q.includes('false closure') || q.includes('not fixed')) {
    return `### How to Challenge a False or Premature Closure:
1. **Open the Report**: Navigate to the case file (e.g. [/reports/${context?.reportId || 'FP-000102'}](/reports/${context?.reportId || 'FP-000102'})).
2. **Click "Dispute Resolution Claim"**: Available as long as the case has an authority repair claim.
3. **Upload Reinspection Evidence**: Take a fresh photo of the unresolved defect on-site.
4. **State the Facts**: Document clearly why the repair is inadequate (e.g. *"Loose gravel was poured instead of hot-mix asphalt; the crater remains 4 inches deep"*).
5. **Independent Moderation**: Filing a challenge immediately shifts the case status to **DISPUTED**, alerts municipal supervisors, and triggers independent human moderation.`;
  }

  if (q.includes('photo') || q.includes('camera') || q.includes('evidence') || q.includes('angle') || q.includes('blur')) {
    return `### Photographic Evidence Standards for High AI Confidence:
* **Stationary Reference Points**: Include durable background landmarks (curb stones, utility poles, boundary walls, shop signs) in both before and after frames.
* **Comparable Camera Angle**: Position your camera at approximately the same height (waist-level, ~45° downward angle) and heading.
* **Optical Sharpness**: Avoid motion blur and vehicle glare. FixProof automatically flags images with blur scores below threshold.
* **GPS & Timestamp**: Keep device location services enabled to register sub-10m GPS accuracy.
* **Lighting**: Photograph during daylight hours; if at night, use strong auxiliary flash on the defect surface.`;
  }

  if (q.includes('sha') || q.includes('hash') || q.includes('tamper') || q.includes('blockchain') || q.includes('ledger')) {
    return `### How FixProof Ensures Tamper-Proof Evidence:
* **SHA-256 Cryptographic Fingerprint**: Every image uploaded is instantly hashed at the binary level. If even a single pixel is modified, the hash changes completely.
* **Perceptual Visual Hash (dHash)**: Computes a 64-bit gradient fingerprint to detect re-uploaded duplicate photos and fraud attempts.
* **Immutable Audit Trail**: All state transitions, authority uploads, citizen disputes, and moderator decisions are stored with microsecond timestamps and cryptographic signatures.
* **On-Demand Verification**: Any citizen can click **Verify Integrity** on an evidence asset to prove the file on disk matches its original upload hash.`;
  }

  if (q.includes('ai') || q.includes('score') || q.includes('how does it work') || q.includes('algorithm') || q.includes('confidence')) {
    return `### The FixProof AI Verification Architecture:
FixProof uses a 4-stage multimodal evaluation pipeline:
1. **Scene Comparability**: Checks stationary visual features and Haversine GPS distance (<100m) to confirm both photos capture the exact same physical spot.
2. **Defect Region Isolation**: Scans the coordinates of the original defect (pothole cavity, garbage mound, broken slab).
3. **Resolution Surface Analysis**: Analyzes asphalt contour, aggregate compaction, and surface smoothness.
4. **Fraud & Duplicate Detection**: Uses Hamming distance on perceptual hashes to reject authorities uploading the original photo back as "proof".

*If confidence falls below 70%, the case is automatically escalated to a human moderator.*`;
  }

  return `Hello! I am **FixBot**, your FixProof Civic AI Copilot. 🛡️
Here is what I can help you with:
- **Guidance on Submitting Reports**: How to take verifiable before photos with landmarks.
- **Challenging Incomplete Repairs**: Step-by-step assistance in filing a documented dispute.
- **Understanding AI Verification**: Explaining similarity scores, duplicate detection, and tamper checks.
- **Municipal Repair Specifications**: Requirements for potholes, footpaths, and drainage grates.

${caseInfo ? `\n*Currently assisting with active case ${context?.reportId}.*` : ''}

How can I assist your civic audit today?`;
}
