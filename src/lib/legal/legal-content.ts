import { SUPPORT_EMAIL } from "@/lib/seo/site";

export interface LegalSection {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface LegalDocument {
  eyebrow: string;
  title: string;
  summary: string;
  effectiveDate: string;
  sections: LegalSection[];
}

export const PRIVACY_POLICY: LegalDocument = {
  eyebrow: "Privacy",
  title: "Privacy Policy",
  summary:
    "Whisper Web is designed so that selected media, microphone recordings, transcripts and converted MP3 files can be processed on your device. This policy explains that local boundary, the network requests the service still needs and the limited information that may reach us or other providers.",
  effectiveDate: "September 1, 2026",
  sections: [
    {
      id: "scope",
      title: "1. Scope and who is responsible",
      paragraphs: [
        `This Privacy Policy applies to whisperwebfree.com and the Whisper Web browser application (the “Service”). Whisper Web is the operator responsible for the information described in this policy. You can contact us at ${SUPPORT_EMAIL}.`,
        "The Service is an independent tool and is not operated by, sponsored by or affiliated with OpenAI. This policy does not cover websites, media hosts or other services that you choose to visit or connect to.",
      ],
    },
    {
      id: "local-processing",
      title: "2. Information that stays on your device",
      paragraphs: [
        "When you choose a local file or record through your microphone, the browser decodes the media and runs the selected Whisper model on your device. Whisper Web does not upload that media to an application server. Processing may use your device’s CPU or GPU and browser memory.",
        "When you use the MP4 to MP3 converter, the browser reads the source video, decodes its main audio track and creates the MP3 on your device. The source video, decoded PCM and output MP3 are not sent to a Whisper Web application server, and the source video is not stored in IndexedDB.",
        "Completed transcripts, timestamps, titles and model settings are stored in IndexedDB in the browser you are using. A successfully saved converted MP3 and its low-sensitivity metadata are stored in a separate IndexedDB collection for up to 30 days. Model files may be stored in the browser cache. We cannot view or retrieve this local data.",
      ],
      bullets: [
        "You can delete an individual transcript or converted MP3 from local history.",
        "Converted MP3 history is automatically removed after 30 days. Your browser may remove it earlier, and a storage-quota failure may prevent a completed MP3 from being added to History.",
        "You can remove all local transcripts, converted MP3 files and cached model files by clearing site data for whisperwebfree.com in your browser settings.",
        "Removing the browser, using private browsing or clearing site data may permanently erase local history. Whisper Web cannot restore it.",
      ],
    },
    {
      id: "network-information",
      title: "3. Information processed over the network",
      paragraphs: [
        "Local transcription does not mean that the website works without network access. The following requests may disclose ordinary technical information such as your IP address, browser and device type, requested URL, date and time, referrer and security-related request data to the receiving provider.",
      ],
      bullets: [
        "Website delivery: hosting and network providers process requests needed to deliver the application, protect it from abuse and maintain availability. They may retain limited security or access logs under their own operational schedules.",
        "Model downloads: the first use of a model, and later cache refreshes, request model files from Hugging Face. Hugging Face receives the request directly from your browser and handles it under its own privacy policy.",
        "Direct media URLs: if you paste a media URL, your browser requests that URL from its host. That host can receive ordinary request data and will apply its own terms and privacy practices. The fetched media is then processed locally by Whisper Web.",
        "Analytics: Google Analytics 4, Plausible and Microsoft Clarity may receive page URLs, referrers, approximate location derived from IP address, device and browser information, interaction events and similar usage data. Clarity may create masked session replays and heatmaps. These services do not receive the local media, microphone recordings, transcript content, filenames, decoded audio or converted MP3 files processed by Whisper Web.",
        `Support: if you email ${SUPPORT_EMAIL}, we receive your email address, message and any information you choose to include so that we can respond, handle a request or investigate a problem. Do not attach confidential recordings or transcripts unless necessary.`,
      ],
    },
    {
      id: "what-we-do-not-use",
      title: "4. Accounts, analytics, advertising and cookies",
      paragraphs: [
        "Whisper Web currently does not offer user accounts or payments and does not include advertising. We use Google Analytics 4, Plausible and Microsoft Clarity to understand visits, page performance and how people use the interface. Depending on the provider and your browser settings, these services may use cookies or similar browser storage. Their processing is governed by their respective privacy terms and configured retention periods.",
        "We do not sell personal information or share local media or transcripts for cross-context behavioral advertising. If our practices change, this policy and any legally required choices will be updated before the new processing begins.",
      ],
    },
    {
      id: "purposes-and-bases",
      title: "5. Why information is processed",
      paragraphs: [
        "Where data protection law requires a legal basis, ordinary website requests are processed as necessary to provide the Service and for our legitimate interests in security, reliability, abuse prevention, audience measurement and interface improvement. Support communications are processed to respond to your request, take steps you ask us to take, protect the Service and comply with legal obligations. We do not use your local media or transcript to train models.",
        "Microphone access begins only after you use the recording control and grant browser permission. You can revoke that permission in your browser or operating-system settings.",
      ],
    },
    {
      id: "sharing",
      title: "6. Service providers, disclosures and transfers",
      paragraphs: [
        "We may rely on hosting, network, model-hosting, analytics and email providers for the limited purposes described in this policy. We may also disclose information when reasonably necessary to comply with law, protect users or the Service, investigate abuse, or establish and defend legal claims. We do not give providers access to media or transcripts that remain solely on your device.",
        "Providers may process network or support information in countries other than your own, including the United States. Where required, transfers are made using an applicable legal mechanism. A third-party media host you choose is independently responsible for its own processing.",
      ],
    },
    {
      id: "retention",
      title: "7. Retention and security",
      paragraphs: [
        "Local transcripts remain in your browser until you delete them or clear site data. Saved converted MP3 records are scheduled for automatic deletion 30 days after creation; entering conversion history or opening the converter runs the cleanup, but your browser may clear site data earlier. Model files remain cached until the browser removes them or you clear the cache. Analytics data, support messages and hosting or network logs are kept according to the applicable provider configuration and only as long as reasonably needed for the purposes described above, business records, disputes, security or legal obligations.",
        "We use reasonable safeguards appropriate to a browser-delivered service, but no device, storage system or internet transmission is completely secure. Protect your device, browser profile and exported files, especially when a recording contains sensitive information.",
      ],
    },
    {
      id: "rights",
      title: "8. Your privacy rights and choices",
      paragraphs: [
        `Depending on where you live, you may have rights to access, correct, delete, restrict or object to processing; receive portable data; withdraw consent where consent is the basis; and appeal or complain to a data protection authority. You may email ${SUPPORT_EMAIL} to make a request. We may need enough information to verify and respond to it.`,
        "Most transcription and conversion data never reaches us, so we cannot access, export or delete it for you. Use the local history controls or your browser’s site-data settings instead. We will not discriminate against you for exercising an applicable privacy right.",
      ],
    },
    {
      id: "children",
      title: "9. Children",
      paragraphs: [
        `The Service is a general-audience tool and is not directed to children under 13. Children under 13 must not send personal information to us. If you believe a child has done so, contact ${SUPPORT_EMAIL}. Users who are not old enough to agree to these terms in their country should use the Service only with permission and supervision from a parent or legal guardian.`,
      ],
    },
    {
      id: "changes-contact",
      title: "10. Changes and contact",
      paragraphs: [
        `We may update this policy when the Service, providers or legal requirements change. The effective date above identifies the current version. Material changes will be presented through the Service when required. Questions or privacy requests can be sent to ${SUPPORT_EMAIL}.`,
      ],
    },
  ],
};

export const TERMS_OF_USE: LegalDocument = {
  eyebrow: "Legal",
  title: "Terms of Use",
  summary:
    "These Terms govern your use of Whisper Web. They explain what the browser tools provide, what you are responsible for and the limits that apply to free local transcription and media conversion.",
  effectiveDate: "September 1, 2026",
  sections: [
    {
      id: "acceptance",
      title: "1. Acceptance and eligibility",
      paragraphs: [
        `By accessing or using whisperwebfree.com or the Whisper Web browser application (the “Service”), you agree to these Terms and the Privacy Policy. If you do not agree, do not use the Service. Questions can be sent to ${SUPPORT_EMAIL}.`,
        "You must be at least 13 and legally able to agree to these Terms. If the law where you live requires a higher age, or if you are not legally able to enter a contract, a parent or legal guardian must review and agree to these Terms and supervise your use.",
      ],
    },
    {
      id: "service",
      title: "2. What the Service provides",
      paragraphs: [
        "Whisper Web is a free collection of browser tools that decodes supported media and runs selected Whisper speech-recognition models on the user’s device. It can create editable text, timestamps and TXT, JSON, SRT or VTT exports. It can also extract the main audio track from a supported local MP4, MOV or WebM video and encode a 128, 192 or 320 kbps MP3 on the device. Local media and microphone recordings are not uploaded to a Whisper Web application server.",
        "The Service still needs network access to load the website, model files and local MP3 encoding software. A pasted direct media URL is requested by your browser from the third-party host. Features, supported browsers, codecs, limits, models and availability may change as the Service develops.",
        "Whisper Web is an independent tool. It is not OpenAI, an OpenAI product or an official OpenAI service, and OpenAI does not provide or endorse this Service.",
      ],
    },
    {
      id: "license",
      title: "3. Permission to use the Service",
      paragraphs: [
        "Subject to these Terms, Whisper Web grants you a limited, non-exclusive, non-transferable and revocable permission to access the hosted Service for lawful personal or business purposes.",
        "Source code published in the official public repository is licensed separately under the MIT License included with that repository. The open-source license governs use, modification and distribution of that source code, but it does not transfer ownership of or grant rights to Whisper Web names, logos or visual identity.",
      ],
    },
    {
      id: "your-content",
      title: "4. Your recordings, links and output",
      paragraphs: [
        "You retain any rights you have in the media you select and the output created from it. Because local media, transcripts and converted MP3 files remain on your device, you do not grant Whisper Web a license to host or publish that content merely by using local transcription or conversion.",
        "You are responsible for the recordings, videos, URLs and other material you use. You must have all rights, permissions and lawful bases needed to record, access, process, transcribe, convert, export and share them. Recording, copyright and consent laws vary by location. A public URL does not necessarily give you permission to copy, transcribe or convert its content.",
      ],
    },
    {
      id: "acceptable-use",
      title: "5. Acceptable use",
      paragraphs: ["You must not use the Service to:"],
      bullets: [
        "break a law, infringe intellectual-property or privacy rights, or violate a duty of confidentiality;",
        "access or process a recording without required authorization or consent;",
        "introduce malware, probe or disrupt the Service, evade technical limits, or interfere with other users;",
        "misrepresent generated text as verified or exact when it has not been reviewed;",
        "use automated traffic or extraction in a way that unreasonably burdens the Service; or",
        "help another person do any of the above.",
      ],
    },
    {
      id: "accuracy",
      title: "6. Accuracy and high-risk use",
      paragraphs: [
        "Speech recognition is probabilistic. A transcript may omit words, invent words, confuse speakers, names, numbers or negations, mistranslate speech, or produce inaccurate timestamps. You must compare important output with the source recording before using or sharing it.",
        "The Service is not a substitute for a qualified professional or a certified transcription process. Do not rely on unverified output as the sole basis for medical care, legal rights, safety decisions, emergency response, employment, credit, education, immigration or another decision that could significantly affect a person.",
      ],
    },
    {
      id: "local-data",
      title: "7. Local storage and your device",
      paragraphs: [
        "You are responsible for your device, browser permissions, local history, backups and exported files. Converted MP3 records are temporary browser storage and are scheduled for deletion after 30 days, not a backup. Clearing site data, using private browsing, removing a browser or losing a device may erase transcripts, converted MP3 files and cached models earlier. Whisper Web cannot access or restore local history.",
        "Local processing can consume memory, battery, CPU or GPU resources and may make a device warm or slow. You decide whether your device and environment are suitable before processing sensitive or important material.",
      ],
    },
    {
      id: "third-parties",
      title: "8. Third-party services and software",
      paragraphs: [
        "The Service uses third-party and open-source software, including Mediabunny and an MP3 encoder based on LAME, and obtains model files from third-party infrastructure, including Hugging Face. Direct media URL hosts, browsers, operating systems and model providers have their own terms and privacy practices. Whisper Web does not control them and is not responsible for their content, availability or conduct.",
        "References or links to third parties do not imply endorsement. Your dealings with a third party are between you and that third party.",
      ],
    },
    {
      id: "intellectual-property",
      title: "9. Intellectual property and feedback",
      paragraphs: [
        "The Service’s names, logos, visual identity and materials not covered by an open-source or third-party license are protected by intellectual-property laws. You may not use Whisper Web names, logos or visual identity in a way that suggests sponsorship or affiliation without permission.",
        "If you voluntarily send feedback, you allow us to use it without restriction or compensation to improve the Service, provided we do not claim ownership of confidential content you identify as such.",
      ],
    },
    {
      id: "availability",
      title: "10. Availability, changes and suspension",
      paragraphs: [
        "We may update, limit, suspend or discontinue any part of the Service, including models, codecs and usage limits. We do not promise uninterrupted availability or continued support for a particular browser, codec, model or export format. We may block access when reasonably necessary to protect the Service, comply with law or address a violation of these Terms.",
      ],
    },
    {
      id: "disclaimers",
      title: "11. Disclaimers",
      paragraphs: [
        "To the maximum extent permitted by law, the Service is provided “as is” and “as available.” Whisper Web disclaims implied warranties of merchantability, fitness for a particular purpose, title, non-infringement, accuracy and uninterrupted or error-free operation. We do not warrant that a transcript or translation will be complete, correct or suitable for your purpose.",
        "Some jurisdictions do not allow certain warranty exclusions. In that case, these exclusions apply only to the extent permitted, and any mandatory consumer rights remain unaffected.",
      ],
    },
    {
      id: "liability",
      title: "12. Limitation of liability",
      paragraphs: [
        "To the maximum extent permitted by law, Whisper Web and its contributors will not be liable for indirect, incidental, special, consequential, exemplary or punitive damages, or for loss of data, profits, business, goodwill or opportunity arising from the Service, third-party services or your inability to use them.",
        "Where liability cannot be excluded, the total liability arising from or relating to the Service will not exceed the greater of the amount you paid to use the Service during the 12 months before the event giving rise to the claim or USD 10. These limits do not apply where prohibited, including liability that cannot legally be limited. Mandatory consumer protections remain unaffected.",
      ],
    },
    {
      id: "indemnity",
      title: "13. Responsibility for claims",
      paragraphs: [
        "To the extent permitted by law, you agree to reimburse Whisper Web and its contributors for reasonable losses, liabilities and costs arising from your unlawful content, your violation of another person’s rights or your material breach of these Terms. This section does not require you to cover a claim caused by our own unlawful conduct and does not limit mandatory consumer rights.",
      ],
    },
    {
      id: "disputes",
      title: "14. Applicable law and disputes",
      paragraphs: [
        "These Terms are governed by the laws that apply to the operator of Whisper Web, without applying rules that would select another jurisdiction’s laws. Any dispute must be brought before a court that has lawful jurisdiction. If you are a consumer, this section does not take away protections or access to courts that cannot be waived under the law where you live.",
        "Before filing a claim, please email us with a short description and the outcome you seek. This informal step is optional where the law gives you a right to proceed immediately and does not shorten a legal limitation period.",
      ],
    },
    {
      id: "general",
      title: "15. Changes and general terms",
      paragraphs: [
        "We may revise these Terms as the Service or law changes. The effective date above identifies the current version. Material changes will be presented through the Service when required. Continued use after revised Terms take effect means you accept them; if you do not agree, stop using the Service.",
        "If a provision is unenforceable, it will be limited to the minimum extent necessary and the remaining provisions will continue. A delay in enforcing a provision is not a waiver. You may not transfer these Terms without our consent; we may transfer them as part of a reorganization or transfer of the Service. These Terms and the Privacy Policy are the entire agreement about your use of the Service.",
      ],
    },
    {
      id: "contact",
      title: "16. Contact",
      paragraphs: [`Questions about these Terms can be sent to ${SUPPORT_EMAIL}.`],
    },
  ],
};
