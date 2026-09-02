import type { SeoPageConfig } from "./site";
import { SEO_PAGES } from "./site";

export interface ContentFaq {
  question: string;
  answer: string;
}

export interface ContentLink {
  href: string;
  label: string;
  description: string;
}

export interface ContentAction {
  href: string;
  label: string;
}

export interface ContentSource {
  label: string;
  href: string;
}

export interface ContentSection {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: Array<{ title: string; description: string }>;
  steps?: Array<{ title: string; description: string }>;
  sources?: ContentSource[];
  table?: {
    caption?: string;
    headers: string[];
    rows: string[][];
  };
}

export interface EditorialPage {
  kind: "use-case" | "article";
  slug: string;
  seo: SeoPageConfig;
  eyebrow: string;
  title: string;
  summary: string;
  directAnswer: string;
  sections: ContentSection[];
  faq: ContentFaq[];
  relatedLinks: ContentLink[];
  callToAction?: {
    eyebrow: string;
    title: string;
    primary: ContentAction;
    secondary?: ContentAction;
  };
}

export const USE_CASE_PAGES: EditorialPage[] = [
  {
    kind: "use-case",
    slug: "meeting-transcription-without-bots",
    seo: SEO_PAGES.meetingTranscription,
    eyebrow: "Use case · recorded meetings",
    title: "Transcribe a meeting recording without adding a bot to the call",
    summary:
      "Download or save the meeting recording first, then turn it into editable text on your device. Whisper Web does not join Zoom, Teams or Google Meet and does not upload the recording.",
    directAnswer:
      "Use this workflow when you already have a meeting recording and want a searchable transcript without a meeting assistant joining the call. It is not a live notetaker: it does not identify speakers, write summaries or extract action items for you.",
    sections: [
      {
        id: "workflow",
        title: "A four-step post-meeting workflow",
        steps: [
          {
            title: "Record with permission",
            description:
              "Use the meeting platform or a device recorder after confirming that recording is allowed for everyone involved.",
          },
          {
            title: "Save a supported file",
            description:
              "Export the meeting as MP3, M4A, WAV, MP4 or WebM. Browser decoding support can vary by device and codec.",
          },
          {
            title: "Transcribe on this device",
            description:
              "Choose the file in Whisper Web. The browser decodes it and runs the selected Whisper model locally.",
          },
          {
            title: "Review before sharing",
            description:
              "Correct names and decisions, then export TXT or JSON for notes, or SRT/VTT for a recorded meeting video.",
          },
        ],
      },
      {
        id: "fit",
        title: "When local meeting transcription is a good fit",
        bullets: [
          {
            title: "No bot in the attendee list",
            description:
              "The transcription starts from a saved recording, so no third-party participant needs to enter the meeting.",
          },
          {
            title: "A narrow sharing path",
            description:
              "The recording stays on the current device. You decide whether to share the corrected transcript or an exported subtitle file.",
          },
          {
            title: "A transcript you can inspect",
            description:
              "Timestamped segments make it easier to return to the recording when a decision, name or number needs checking.",
          },
        ],
      },
      {
        id: "limits",
        title: "What this workflow does not do",
        paragraphs: [
          "Whisper Web does not capture system audio from a live conference tab. Record the meeting with an approved tool, then import the saved media.",
          "The local workflow does not separate speakers or generate a summary. Treat the transcript as a first draft and verify important decisions against the recording.",
          "The current local limit is 300 MB and 20 minutes per file. Longer meetings need a different workflow or shorter files prepared before import.",
        ],
      },
    ],
    faq: [
      {
        question: "Can Whisper Web transcribe a meeting live?",
        answer:
          "No. It can record microphone audio or transcribe a saved file, but it does not capture a live meeting tab or join the call as a bot.",
      },
      {
        question: "Does it label each speaker?",
        answer:
          "No. The current transcript contains text and timestamped segments without speaker diarization. Add speaker names during review if you need them.",
      },
      {
        question: "Is a meeting recording uploaded?",
        answer:
          "No. The selected file is decoded and transcribed in the current browser. The site and Whisper model files still require network downloads.",
      },
    ],
    relatedLinks: [
      {
        href: SEO_PAGES.localVsCloud.path,
        label: "Compare local and cloud transcription",
        description: "Choose a processing model based on privacy, file length and collaboration needs.",
      },
      {
        href: SEO_PAGES.transcribeWithoutUploading.path,
        label: "Transcribe audio without uploading it",
        description: "See exactly what stays local and what the browser still downloads.",
      },
    ],
  },
  {
    kind: "use-case",
    slug: "voice-memo-to-text",
    seo: SEO_PAGES.voiceMemoToText,
    eyebrow: "Use case · personal recordings",
    title: "Turn a voice memo into editable text in your browser",
    summary:
      "Move a supported voice memo to the device where you will work, choose it in Whisper Web and review the transcript locally before exporting it.",
    directAnswer:
      "Export the voice memo as a file before you begin. Whisper Web reads only the file you choose and does not connect directly to your phone's memo library.",
    sections: [
      {
        id: "workflow",
        title: "From recording to usable notes",
        steps: [
          {
            title: "Export the memo",
            description:
              "Save the recording as a file on the current device. iPhone Voice Memos commonly uses M4A; Android recorder formats vary.",
          },
          {
            title: "Choose the audio language",
            description:
              "Use automatic detection or select a supported language when you already know what is spoken.",
          },
          {
            title: "Run local transcription",
            description:
              "The browser loads the selected model and creates text plus timestamped segments on this device.",
          },
          {
            title: "Clean and export",
            description:
              "Fix names and punctuation, then copy the text or export TXT, JSON, SRT or VTT.",
          },
        ],
      },
      {
        id: "outputs",
        title: "Choose an output for the next task",
        bullets: [
          {
            title: "TXT for notes",
            description: "Use plain text when you want to edit in a notes app or document.",
          },
          {
            title: "JSON for structured work",
            description: "Keep transcript data and timestamps when another tool will process the result.",
          },
          {
            title: "SRT or VTT for timed media",
            description: "Use a subtitle format when the memo accompanies audio or video playback.",
          },
        ],
      },
      {
        id: "recording-quality",
        title: "Make the voice memo easier to transcribe",
        paragraphs: [
          "Keep the microphone close enough for speech to stay above room noise, and avoid covering the microphone with a case or hand.",
          "Names, abbreviations and mixed-language speech still need human review. A larger model may help some recordings, but it also downloads more data and uses more device memory.",
        ],
      },
    ],
    faq: [
      {
        question: "Can I import an iPhone Voice Memo?",
        answer:
          "Usually, yes. Save or share the memo as an M4A file, then choose it in Whisper Web. The browser must be able to decode the file's audio codec.",
      },
      {
        question: "Does Whisper Web read my whole voice memo library?",
        answer:
          "No. It only receives the file you explicitly choose or the audio you record in the current browser session.",
      },
      {
        question: "Can it turn a memo into a summary?",
        answer:
          "No. The current product creates an editable transcript. It does not generate summaries, tasks or rewritten notes.",
      },
    ],
    relatedLinks: [
      {
        href: SEO_PAGES.srtVsVtt.path,
        label: "Choose SRT or VTT",
        description: "Compare the two timed-text exports before downloading captions.",
      },
      {
        href: SEO_PAGES.webgpuVsWebassembly.path,
        label: "Choose WebGPU or WebAssembly",
        description: "Understand the two local compute options before running a larger model.",
      },
    ],
  },
  {
    kind: "use-case",
    slug: "private-interview-transcription",
    seo: SEO_PAGES.interviewTranscription,
    eyebrow: "Use case · recorded interviews",
    title: "Review a recorded interview without uploading the source audio",
    summary:
      "Create a first-draft transcript for journalism, research or user interviews while keeping the selected recording on the current device.",
    directAnswer:
      "Local processing reduces one data handoff: the interview recording is not sent to Whisper Web. You still need permission to record, a suitable device and a careful review process before quoting or sharing the transcript.",
    sections: [
      {
        id: "workflow",
        title: "A review-first interview workflow",
        steps: [
          {
            title: "Keep the original recording",
            description: "Preserve an unchanged source file and work from a copy when the interview matters as evidence.",
          },
          {
            title: "Transcribe locally",
            description: "Choose the recording, language, model and browser compute backend, then start transcription.",
          },
          {
            title: "Check every important quote",
            description: "Use timestamps to return to the audio. Verify names, numbers, technical terms and negations.",
          },
          {
            title: "Export the minimum needed",
            description: "Share the corrected text instead of the source audio when that is sufficient for the next reviewer.",
          },
        ],
      },
      {
        id: "roles",
        title: "Where the local workflow helps",
        bullets: [
          {
            title: "Journalism",
            description: "Search a source interview and return to the timestamp before using a quotation.",
          },
          {
            title: "Qualitative research",
            description: "Create a draft for coding and analysis without adding a transcription upload to the data path.",
          },
          {
            title: "User research",
            description: "Review a recorded session locally, then move only approved excerpts into the research repository.",
          },
        ],
      },
      {
        id: "boundaries",
        title: "Privacy is a workflow, not a badge",
        paragraphs: [
          "Local transcription does not by itself make an interview process compliant with a law, contract or research protocol. Recording consent, device security, backups and exports remain your responsibility.",
          "Whisper Web does not identify speakers. For multi-person interviews, add labels during review and verify every passage where attribution matters.",
        ],
      },
    ],
    faq: [
      {
        question: "Is local transcription safe for confidential interviews?",
        answer:
          "It avoids uploading the selected recording to Whisper Web, but confidentiality also depends on the device, backups, permissions and how you share the exported transcript.",
      },
      {
        question: "Can I publish the transcript without editing it?",
        answer:
          "That is not recommended. Treat automatic transcription as a draft and check quotations, names, numbers and sensitive passages against the recording.",
      },
      {
        question: "Can it separate the interviewer and participant?",
        answer:
          "No. Speaker diarization is not implemented. Add speaker labels manually after comparing the timestamped segments with the recording.",
      },
    ],
    relatedLinks: [
      {
        href: SEO_PAGES.transcribeWithoutUploading.path,
        label: "Understand the no-upload boundary",
        description: "See which files stay local and which resources still use the network.",
      },
      {
        href: SEO_PAGES.meetingTranscription.path,
        label: "Transcribe a recorded meeting",
        description: "Use a similar review workflow for calls and team discussions.",
      },
    ],
  },
  {
    kind: "use-case",
    slug: "private-podcast-transcription",
    seo: SEO_PAGES.podcastTranscription,
    eyebrow: "Use case · podcast clips",
    title: "Create text and captions for a podcast clip on your device",
    summary:
      "Transcribe a trailer, short episode or selected excerpt, then reuse the corrected text for show notes, a searchable archive or subtitle preparation.",
    directAnswer:
      "Whisper Web's local workflow accepts files up to 300 MB and 20 minutes, so it fits podcast clips and short episodes better than a typical long-form show. The transcript includes timestamped segments but not speaker labels or an automatic summary.",
    sections: [
      {
        id: "workflow",
        title: "Turn a podcast clip into reusable text",
        steps: [
          {
            title: "Choose a focused recording",
            description: "Use a trailer, highlight, bonus clip or short episode within the current local limits.",
          },
          {
            title: "Transcribe with the right language",
            description: "Select the spoken language when known, or use automatic detection for a single-language recording.",
          },
          {
            title: "Edit for names and structure",
            description: "Correct guest names, brands and punctuation, then split the draft into readable sections.",
          },
          {
            title: "Export for the destination",
            description: "Use TXT for notes, JSON for timestamp data, or SRT/VTT for caption workflows.",
          },
        ],
      },
      {
        id: "reuse",
        title: "What one corrected transcript can support",
        bullets: [
          {
            title: "Show notes",
            description: "Pull verified topics and links from the transcript instead of relying on memory.",
          },
          {
            title: "Searchable excerpts",
            description: "Publish a carefully edited excerpt so listeners and search engines can understand the segment.",
          },
          {
            title: "Captions",
            description: "Start from the SRT or VTT export, then review timing in the video or podcast platform before publishing.",
          },
        ],
      },
      {
        id: "limits",
        title: "Plan around the local limits",
        paragraphs: [
          "A full podcast episode often exceeds 20 minutes. Whisper Web does not currently split long media for you, so do not choose this workflow unless the prepared file fits the limit.",
          "Music beds, cross-talk and remote-call compression can reduce transcript quality. Check guest names and every passage you plan to quote or caption.",
        ],
      },
    ],
    faq: [
      {
        question: "Can I transcribe a one-hour podcast episode?",
        answer:
          "Not as one file in the current local workflow. Each selected file must be no longer than 20 minutes and no larger than 300 MB.",
      },
      {
        question: "Does Whisper Web create podcast show notes?",
        answer:
          "No. It creates an editable transcript. You can use the corrected transcript as source material for show notes.",
      },
      {
        question: "Can I export podcast captions?",
        answer:
          "Yes. Export SRT or VTT, then check the text and timing in the destination player before publishing.",
      },
    ],
    relatedLinks: [
      {
        href: SEO_PAGES.srtVsVtt.path,
        label: "Compare SRT and VTT",
        description: "Choose a subtitle export based on the editor or web player you will use.",
      },
      {
        href: SEO_PAGES.voiceMemoToText.path,
        label: "Turn a voice memo into text",
        description: "Use a shorter workflow for spoken notes, intros and draft segments.",
      },
    ],
  },
];

export const BLOG_POSTS: EditorialPage[] = [
  {
    kind: "article",
    slug: "transcribe-audio-without-uploading",
    seo: SEO_PAGES.transcribeWithoutUploading,
    eyebrow: "Privacy guide",
    title: "How to transcribe audio without uploading it",
    summary:
      "Local transcription keeps the selected media on your device, but the website and model still use the network. Here is the complete boundary and a practical review workflow.",
    directAnswer:
      "Choose a local file and run the speech model in the browser. The file stays on your device, while the site, model and analytics still use network requests. A pasted direct URL also contacts its source host.",
    sections: [
      {
        id: "steps",
        title: "How can you transcribe without uploading the recording?",
        steps: [
          {
            title: "Choose a local-processing tool",
            description: "Confirm that inference runs in the browser or on the device, not on a remote transcription API.",
          },
          {
            title: "Select only the intended file",
            description: "Whisper Web can read a chosen file, a microphone recording or a public direct media URL that allows browser access.",
          },
          {
            title: "Wait for local model processing",
            description: "The first run downloads a Whisper model. Later runs can reuse the browser cache until it is cleared.",
          },
          {
            title: "Review and export",
            description: "Correct the transcript locally and export only the format needed for the next step.",
          },
        ],
      },
      {
        id: "network-boundary",
        title: "What stays local, and what still uses the network?",
        table: {
          caption: "Whisper Web media, storage and network boundaries",
          headers: ["Item", "Where it goes in Whisper Web local mode"],
          rows: [
            ["Selected file or microphone recording", "Decoded and processed on the current device"],
            ["Whisper model", "Downloaded to the browser, then used locally"],
            ["Application code and fonts", "Downloaded when the site loads"],
            ["Completed transcript", "Stored in this browser's IndexedDB until exported or deleted"],
            ["Direct media URL", "Fetched by the browser from the source server; CORS must allow access"],
            ["Analytics", "Receives page and interaction data, not selected media or transcript text"],
          ],
        },
        sources: [
          {
            label: "MDN: IndexedDB API",
            href: "https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API",
          },
        ],
      },
      {
        id: "checks",
        title: "What should you check beyond the upload button?",
        paragraphs: [
          "A no-upload claim should explain model downloads, browser storage and direct URL behavior. It should also say whether analytics, crash logs or cloud features are part of the same page.",
          "Local processing reduces exposure to a transcription provider, but device backups, shared accounts and exported files can still copy sensitive content elsewhere.",
        ],
      },
    ],
    faq: [
      {
        question: "Does no upload mean the website works fully offline?",
        answer:
          "No. The application and selected Whisper model must download first. The current product does not promise a fully offline website session.",
      },
      {
        question: "Where is the completed transcript stored?",
        answer:
          "Whisper Web stores it in IndexedDB in the current browser until you export or delete it.",
      },
      {
        question: "Is a pasted media URL private?",
        answer:
          "The browser must request that URL from its source server. Use a URL only when you understand the source server's access and logging behavior.",
      },
    ],
    relatedLinks: [
      {
        href: SEO_PAGES.localVsCloud.path,
        label: "Local vs cloud transcription",
        description: "Compare the two processing models beyond a single privacy claim.",
      },
      {
        href: SEO_PAGES.interviewTranscription.path,
        label: "Private interview workflow",
        description: "Apply the boundary to recorded interviews and quote review.",
      },
    ],
  },
  {
    kind: "article",
    slug: "how-to-transcribe-large-audio-files",
    seo: SEO_PAGES.transcribeLargeFilesGuide,
    eyebrow: "Large-file workflow",
    title: "How to transcribe a large audio or video file in your browser",
    summary:
      "A long recording asks more of your browser and device than a short voice memo. This guide helps you choose the right entry, prepare for the run, understand what happens between sections and avoid the interruptions that make you start over.",
    directAnswer:
      "Use standard transcription for a supported file up to 300 MB and 20 minutes. If either limit is too small, use the large-file tool for a local file up to 1 GB and 1 hour. Keep the tab open and the device awake; unfinished progress cannot be restored after a reload, closed tab or sleep.",
    sections: [
      {
        id: "choose-workflow",
        title: "Which transcription tool fits your recording?",
        paragraphs: [
          "File size alone does not tell you which workflow to use. Check both the media size and the audio-track duration. A highly compressed one-hour recording can be small in megabytes, while a short uncompressed WAV can be large. Whisper Web applies both limits.",
          "Start with the standard tool when the file fits. It supports local files, microphone recordings and compatible direct media URLs. The large-file tool is for a selected local file and trades a longer limit for a more deliberate, section-by-section session.",
        ],
        table: {
          caption: "Standard and large-file transcription limits in Whisper Web",
          headers: ["What do you need?", "Standard transcription", "Large-file transcription"],
          rows: [
            ["Maximum file size", "300 MB", "1 GB"],
            ["Maximum audio duration", "20 minutes", "1 hour"],
            ["Input choices", "Local file, microphone or compatible direct URL", "Local file only"],
            ["How the recording is handled", "Processed as a regular transcription job", "Decoded and transcribed in five-minute sections"],
            ["Can you pause between sections?", "No section-by-section pause", "Yes, after the current section finishes"],
            ["Where does the completed result go?", "Local history in this browser", "The same local history after the full recording completes"],
          ],
        },
      },
      {
        id: "before-starting",
        title: "What should you check before starting a long transcription?",
        bullets: [
          {
            title: "Confirm both limits",
            description:
              "Check the file size and recording duration before setting aside time. A file over 1 GB or an audio track over one hour must be shortened or split before Whisper Web can process it.",
          },
          {
            title: "Choose a device you can leave awake",
            description:
              "A long local job uses the current CPU or GPU. A plugged-in laptop or desktop with clear ventilation is usually easier to leave running than a phone on battery.",
          },
          {
            title: "Make sure the browser can decode the audio",
            description:
              "A familiar file extension does not guarantee that every browser supports the codec inside it. If analysis fails, export the source as MP3, WAV or M4A and try again.",
          },
          {
            title: "Decide what you need at the end",
            description:
              "Use TXT for editable prose, JSON when another tool needs timestamps, or SRT/VTT for captions. Knowing the destination makes the review step more focused.",
          },
        ],
        sources: [
          {
            label: "MDN: Using files from web applications",
            href: "https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications",
          },
        ],
      },
      {
        id: "browser-workflow",
        title: "What does the browser do with a large recording?",
        steps: [
          {
            title: "Inspect the selected media",
            description:
              "The browser checks the container, finds a readable audio track and measures its duration before transcription starts. This catches unsupported or over-limit files early.",
          },
          {
            title: "Plan five-minute sections",
            description:
              "Whisper Web divides the audio timeline into smaller working sections so it does not need to decode the entire recording into memory at once.",
          },
          {
            title: "Decode and transcribe in order",
            description:
              "Each section is decoded locally and passed to the selected Whisper model. Timestamped text is added in recording order before the next section begins.",
          },
          {
            title: "Save only after the full recording finishes",
            description:
              "When all sections complete, Whisper Web combines the text and timestamps and writes the transcript to local history. Until then, partial progress belongs to the current tab only.",
          },
        ],
      },
      {
        id: "time-and-device",
        title: "How long will it take, and what will it do to your device?",
        paragraphs: [
          "There is no fixed turnaround time for a one-hour file. Processing speed changes with the selected Whisper model, WebAssembly or WebGPU backend, browser, processor, available memory, power mode and other work happening on the device.",
          "The large-file page begins with a calibration message. After the first 30 seconds of audio are processed, it estimates a remaining-time range from the speed measured on your device. Treat that range as a planning aid, not a deadline: background tabs, thermal throttling and battery-saving modes can change the pace later.",
          "Long inference can increase battery use, fan noise and device temperature. Connect to power when practical, keep ventilation clear and stop the job if the device becomes unusually hot. A smaller model usually asks less of the device, while a larger model downloads more data and uses more memory.",
        ],
        sources: [
          {
            label: "MDN: WebGPU API",
            href: "https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API",
          },
          {
            label: "MDN: WebAssembly",
            href: "https://developer.mozilla.org/en-US/docs/WebAssembly",
          },
        ],
      },
      {
        id: "interruptions",
        title: "What happens if the transcription is paused or interrupted?",
        table: {
          caption: "What Whisper Web keeps after common large-file interruptions",
          headers: ["What happens?", "What is kept?", "What should you do next?"],
          rows: [
            ["You request a pause", "The current five-minute section finishes; earlier sections remain in this tab", "Resume with the next section when the device is ready"],
            ["You refresh or close the tab", "Unfinished progress is lost", "Select the source file and start again"],
            ["The device sleeps", "Unfinished progress is lost", "Keep the device awake during the next run"],
            ["The browser cannot decode the codec", "No completed transcript is saved", "Try another browser or export the source as MP3, WAV or M4A"],
            ["The full job completes", "Text and timestamps are saved to local history", "Open the result to edit or export it"],
          ],
        },
      },
      {
        id: "privacy-and-storage",
        title: "Does a large recording stay on your device?",
        paragraphs: [
          "Yes, when you choose a local file. Whisper Web reads, decodes and transcribes that file in the current browser rather than sending the media to a Whisper Web transcription server.",
          "Local media processing does not mean the page makes no network requests. The site, fonts and selected Whisper model still need to download, and analytics can receive ordinary page and interaction data. Whisper Web does not send the selected media or transcript text to those analytics services.",
          "After a successful run, the transcript is stored in IndexedDB in this browser. It stays there until you delete it or browser storage is cleared. Export a copy if the transcript matters; local browser history is convenient storage, not a backup plan.",
        ],
        sources: [
          {
            label: "MDN: IndexedDB API",
            href: "https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API",
          },
        ],
      },
      {
        id: "review",
        title: "What should you review before using a long transcript?",
        steps: [
          {
            title: "Check names, numbers and specialist terms",
            description:
              "Automatic text is a draft. Return to the timestamp whenever a quotation, amount, date, negation or technical term matters.",
          },
          {
            title: "Inspect transitions between sections",
            description:
              "Read across section boundaries for repeated or missing words, especially when speech is fast, overlapping or cut by silence and music.",
          },
          {
            title: "Add structure the model does not create",
            description:
              "Whisper Web does not identify speakers or produce a summary. Add speaker names, headings and decisions yourself when the destination needs them.",
          },
          {
            title: "Export for the next tool",
            description:
              "Choose TXT or JSON for text work and SRT or VTT for timed captions. Review subtitle line breaks and timing in the destination player or editor.",
          },
        ],
      },
    ],
    faq: [
      {
        question: "Can Whisper Web transcribe a two-hour recording?",
        answer:
          "No. The large-file tool accepts an audio track up to one hour. Split a longer recording into shorter files before importing it.",
      },
      {
        question: "Does the large file get uploaded?",
        answer:
          "No. A selected local file is decoded and transcribed on the current device. The site and selected Whisper model still use network downloads.",
      },
      {
        question: "Can I close the browser and continue tomorrow?",
        answer:
          "No. Unfinished sections are kept only in the current tab. Keep the tab open and the device awake until the completed transcript is saved.",
      },
      {
        question: "Do I need WebGPU for a large file?",
        answer:
          "No. WebAssembly is available for broader compatibility, while WebGPU is optional on supported browsers and hardware. Actual speed still depends on the device and model.",
      },
      {
        question: "Which Whisper model should I choose?",
        answer:
          "Start with the default smaller model when device load and wait time matter most. Try a larger model when the device has enough memory and you can accept a larger download and longer processing time.",
      },
      {
        question: "Can I edit and export the completed transcript?",
        answer:
          "Yes. Open the saved result in local history to edit it and export TXT, JSON, SRT or VTT.",
      },
    ],
    relatedLinks: [
      {
        href: SEO_PAGES.largeFileTranscription.path,
        label: "Open large-file transcription",
        description: "Choose a local file up to 1 GB and one hour and process it in five-minute sections.",
      },
      {
        href: SEO_PAGES.home.path,
        label: "Use standard transcription",
        description: "Choose this entry for supported recordings up to 300 MB and 20 minutes.",
      },
      {
        href: SEO_PAGES.webgpuVsWebassembly.path,
        label: "Compare WebGPU and WebAssembly",
        description: "Choose a local compute backend based on compatibility and device behavior.",
      },
    ],
    callToAction: {
      eyebrow: "Choose by file size and duration",
      title: "Use the simplest workflow that fits your recording.",
      primary: {
        href: SEO_PAGES.largeFileTranscription.path,
        label: "Open the large-file tool",
      },
      secondary: {
        href: SEO_PAGES.home.path,
        label: "Use standard transcription",
      },
    },
  },
  {
    kind: "article",
    slug: "how-to-convert-mp4-to-mp3",
    seo: SEO_PAGES.convertMp4ToMp3Guide,
    eyebrow: "MP4 to MP3 guide",
    title: "How to convert MP4 to MP3 in your browser",
    summary:
      "An MP4 file can contain video, audio and other tracks. Converting it to MP3 means decoding the main audio track, discarding the picture and encoding a new audio file. This guide explains the complete local workflow, quality choices, privacy boundary and common failure points.",
    directAnswer:
      "Open the MP4 to MP3 converter, choose one MP4, MOV or WebM video up to 300 MiB and 20 minutes, select 128, 192 or 320 kbps, then convert and download the MP3. Whisper Web processes the selected video on your device; it does not upload the media to a Whisper Web conversion server.",
    sections: [
      {
        id: "steps",
        title: "How do you convert an MP4 video to MP3?",
        steps: [
          {
            title: "Choose the local video",
            description:
              "Open the converter and select one MP4, MOV or WebM file. Whisper Web checks the 300 MiB file-size limit, reads the media tracks and measures the main audio track before conversion starts.",
          },
          {
            title: "Confirm the audio and duration",
            description:
              "Review the detected duration and audio details. The current converter accepts a main audio track up to 20 minutes. A video with no readable audio track cannot produce an MP3.",
          },
          {
            title: "Choose an MP3 bitrate",
            description:
              "Use 128 kbps for a smaller voice-focused file, 192 kbps for the balanced default or 320 kbps when a larger output and higher encoding target fit the destination.",
          },
          {
            title: "Convert without closing the tab",
            description:
              "The browser decodes the main audio track and encodes it as MP3 on this device. Keep the page open until the progress reaches completion.",
          },
          {
            title: "Download and check the result",
            description:
              "Download the completed MP3, play it from local conversion history and check the beginning, middle and end before deleting the source or sharing the output.",
          },
        ],
        sources: [
          {
            label: "MDN: Using files from web applications",
            href: "https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications",
          },
        ],
      },
      {
        id: "bitrate",
        title: "Which MP3 bitrate should you choose?",
        paragraphs: [
          "Bitrate is the amount of encoded audio data used per second. A higher setting usually produces a larger file and gives the encoder more data to represent the sound, but it cannot restore detail already missing from a compressed, distorted or low-quality source.",
          "For speech, interviews and quick listening copies, 128 kbps is often the practical small-file choice. The 192 kbps default balances size and quality for mixed voice, music and general video audio. Choose 320 kbps only when the destination benefits from the larger file or you want the highest available setting in this converter.",
        ],
        table: {
          caption: "MP3 bitrate choices and approximate output sizes",
          headers: ["Bitrate", "Good starting point", "Approximate size per 10 minutes"],
          rows: [
            ["128 kbps", "Speech, interviews and compact copies", "About 9.6 MB"],
            ["192 kbps", "Balanced default for voice and music", "About 14.4 MB"],
            ["320 kbps", "Largest output and highest available target", "About 24 MB"],
          ],
        },
      },
      {
        id: "what-changes",
        title: "What changes when video becomes MP3?",
        paragraphs: [
          "The output is a new audio-only file. Whisper Web uses the main audio track and discards the picture, video track and other non-audio data. It does not preserve the original MP4 container or turn captions into lyrics or metadata.",
          "Mono input remains mono and stereo input remains stereo. If the source has more than two audio channels, the current workflow downmixes them to stereo. The converter does not trim silence, normalize loudness, remove noise or edit ID3 tags.",
          "The downloaded name uses the source filename without its final extension and adds .mp3. For example, interview.final.mp4 becomes interview.final.mp3.",
        ],
        table: {
          caption: "What the local MP4 to MP3 conversion keeps and changes",
          headers: ["Source detail", "MP3 result"],
          rows: [
            ["Main audio track", "Decoded and encoded as MP3"],
            ["Video and picture", "Discarded"],
            ["Mono or stereo channels", "Kept as mono or stereo"],
            ["More than two audio channels", "Downmixed to stereo"],
            ["Original source quality", "Cannot be improved by selecting a higher bitrate"],
            ["Captions, chapters and video metadata", "Not transferred into MP3 tags"],
          ],
        },
      },
      {
        id: "compatibility",
        title: "Why can an MP4 file fail even when the extension is supported?",
        paragraphs: [
          "MP4, MOV and WebM are containers. The audio inside can use different codecs, and browser decoding support varies by operating system, browser and codec. A supported filename therefore does not guarantee that the main audio track can be decoded on every device.",
          "If analysis reports that no readable audio track is available, first confirm that the source actually has sound. Then try a current desktop browser or export the source again with a commonly supported audio track. Renaming the extension does not change the codec inside the file.",
          "The converter handles one local file at a time. It does not accept a pasted URL, a batch of videos or a file over 300 MiB or 20 minutes. Shorten or split an over-limit video in another editor before importing it.",
        ],
      },
      {
        id: "privacy-storage",
        title: "Is the MP4 uploaded, and where is the MP3 stored?",
        paragraphs: [
          "The selected video is read and converted in the current browser. Whisper Web does not send that media to a Whisper Web conversion server, and it does not save the source video or decoded working audio in conversion history.",
          "Local conversion does not mean the page is entirely offline. The application, encoder resources, fonts and analytics can still use ordinary network requests. Those requests do not need the selected video or the completed MP3 to perform the local conversion.",
          "After a successful conversion, the MP3 is available for immediate download and is also saved in this browser's IndexedDB conversion history for up to 30 days. The browser can clear site storage earlier, so download any result you need to keep. A storage failure does not block the immediate download of the completed MP3.",
        ],
        table: {
          caption: "Network and storage boundaries for local MP4 to MP3 conversion",
          headers: ["Item", "Where it goes"],
          rows: [
            ["Selected MP4, MOV or WebM", "Read and decoded on the current device; not added to history"],
            ["Decoded working audio", "Used temporarily during conversion; not saved as a history item"],
            ["Completed MP3", "Available in page memory and saved to local browser history after success"],
            ["Application and encoder resources", "Downloaded as needed when the site loads or conversion starts"],
            ["Analytics", "Can receive ordinary page and interaction data, not the selected media or MP3 content"],
          ],
        },
        sources: [
          {
            label: "MDN: IndexedDB API",
            href: "https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API",
          },
        ],
      },
      {
        id: "interruptions",
        title: "What happens if you cancel or interrupt the conversion?",
        paragraphs: [
          "If you cancel while the browser is converting, Whisper Web stops the job without creating an MP3 or a history record. The selected video remains ready, so you can adjust the bitrate and try again.",
          "Refreshing or closing the page interrupts the current job. Conversion history contains completed MP3 files only; it is not a checkpoint for unfinished work. Because encoding uses the current device, completion time depends on video duration, processor load, browser and power conditions rather than a fixed server queue.",
        ],
        table: {
          caption: "What Whisper Web keeps after MP4 to MP3 interruptions",
          headers: ["What happens?", "What is kept?", "Next step"],
          rows: [
            ["You cancel conversion", "The selected video remains; no MP3 or history record is created", "Choose a bitrate and try again"],
            ["You refresh or close the tab", "The unfinished conversion is lost", "Select the source again and restart"],
            ["Local history cannot be saved", "The completed MP3 remains available for immediate download", "Download it before leaving the page"],
            ["Conversion completes", "The MP3 is downloaded on request and saved to local history", "Play, search, download again or delete it"],
          ],
        },
      },
      {
        id: "troubleshooting",
        title: "How do you troubleshoot an MP4 to MP3 conversion?",
        table: {
          caption: "Common MP4 to MP3 problems and practical checks",
          headers: ["Problem", "Likely reason", "What to check"],
          rows: [
            ["The file is rejected before analysis", "It is not MP4, MOV or WebM, or exceeds 300 MiB", "Choose a supported local video within the size limit"],
            ["No readable audio track", "The video is silent or its audio codec is not supported by this browser", "Play the source, try a current desktop browser or re-export the audio track"],
            ["The video is over 20 minutes", "The audio duration exceeds the converter limit", "Shorten or split it before conversion"],
            ["The MP3 sounds no better at 320 kbps", "The source already lacks that detail", "Use a cleaner source; bitrate cannot recreate lost quality"],
            ["Conversion is slow", "Encoding uses the current device", "Keep the tab open, connect to power and reduce other heavy work"],
            ["The result disappeared later", "Browser storage was cleared or the 30-day retention period ended", "Download important MP3 files instead of treating history as a backup"],
          ],
        },
      },
      {
        id: "after-conversion",
        title: "What should you check before using the MP3?",
        steps: [
          {
            title: "Play several points in the file",
            description:
              "Check the beginning, a point in the middle and the ending. This catches a silent source, unexpected track choice or an interrupted recording before you share it.",
          },
          {
            title: "Confirm the destination accepts MP3",
            description:
              "Check the upload limit and audio requirements of the player, editor, podcast host or transcription tool that receives the file.",
          },
          {
            title: "Download a durable copy",
            description:
              "Local conversion history is convenient for replay and repeat download, but it is not permanent storage. Save the MP3 to a folder or backup you control.",
          },
          {
            title: "Transcribe only when text is the goal",
            description:
              "MP4 to MP3 extracts audio; it does not create a transcript. If you need editable text or captions, open the transcription tool with the source video or completed MP3.",
          },
        ],
      },
    ],
    faq: [
      {
        question: "Can I convert MP4 to MP3 without uploading the video?",
        answer:
          "Yes. Whisper Web reads, decodes and encodes a selected local video in the current browser rather than uploading it to a Whisper Web conversion server. The page and encoder resources still require ordinary network requests.",
      },
      {
        question: "Which video formats can I convert?",
        answer:
          "The current converter accepts one local MP4, MOV or WebM file up to 300 MiB and 20 minutes. Actual decoding still depends on the audio codec and browser support.",
      },
      {
        question: "Is 320 kbps always better than 192 kbps?",
        answer:
          "It uses a higher encoding target and creates a larger file, but it cannot recover audio detail missing from the source. The 192 kbps default is the balanced choice for most general video audio.",
      },
      {
        question: "Does converting MP4 to MP3 reduce the video file size?",
        answer:
          "The converter creates a separate audio-only MP3 and leaves the source video unchanged. The MP3 is usually smaller because it does not contain the video track, but its size depends mainly on duration and selected bitrate.",
      },
      {
        question: "Can I convert a video longer than 20 minutes?",
        answer:
          "Not in the current converter. Shorten or split the video into sections of 20 minutes or less, with each file no larger than 300 MiB, before importing it.",
      },
      {
        question: "Can I convert several MP4 files at once?",
        answer:
          "No. The converter handles one local file at a time and does not provide batch conversion.",
      },
      {
        question: "Where can I find a completed conversion?",
        answer:
          "Download it as soon as conversion finishes or open Conversions history in the same browser. Completed MP3 files remain there for up to 30 days unless the browser clears site storage earlier or you delete them.",
      },
      {
        question: "Does the converter create a transcript?",
        answer:
          "No. It extracts and encodes the main audio track as MP3. Use Whisper Web transcription when you need editable text, timestamps, SRT or VTT captions.",
      },
    ],
    relatedLinks: [
      {
        href: SEO_PAGES.mp4ToMp3.path,
        label: "Open the MP4 to MP3 converter",
        description: "Choose one local MP4, MOV or WebM file and download the main audio track as MP3.",
      },
      {
        href: SEO_PAGES.transcribeWithoutUploading.path,
        label: "Understand local processing",
        description: "See what stays on the device and which website resources still use the network.",
      },
      {
        href: SEO_PAGES.home.path,
        label: "Transcribe audio or video",
        description: "Create editable text and timed captions when MP3 is not the final goal.",
      },
    ],
    callToAction: {
      eyebrow: "Ready to extract the audio?",
      title: "Convert one local video and download the MP3.",
      primary: {
        href: SEO_PAGES.mp4ToMp3.path,
        label: "Open the MP4 to MP3 converter",
      },
      secondary: {
        href: SEO_PAGES.home.path,
        label: "Transcribe audio or video instead",
      },
    },
  },
  {
    kind: "article",
    slug: "local-vs-cloud-transcription",
    seo: SEO_PAGES.localVsCloud,
    eyebrow: "Workflow comparison",
    title: "Local vs cloud transcription: choose based on the data path",
    summary:
      "Local and cloud tools can both turn audio into text. The deciding differences are where the media is processed, what provides the compute and how the result is shared.",
    directAnswer:
      "Choose local transcription when avoiding a media upload is the first requirement and the file fits your device and browser limits. Choose a cloud workflow when long files, centralized collaboration or provider-managed compute matter more than keeping the recording on one device.",
    sections: [
      {
        id: "comparison",
        title: "How do local and cloud transcription differ?",
        table: {
          caption: "Local browser and typical cloud transcription compared",
          headers: ["Decision", "Local browser transcription", "Typical cloud transcription"],
          rows: [
            ["Audio processing", "Current device", "Provider infrastructure"],
            ["Media upload", "Not required for a selected local file", "Usually required"],
            ["Compute speed", "Depends on the device, browser, model and backend", "Depends on the provider and plan"],
            ["Long files", "Limited by browser memory and product limits", "Often better supported"],
            ["Team collaboration", "Export and share manually", "Often built into accounts and workspaces"],
            ["Recovery", "Browser storage and your own exports", "Provider storage and account controls"],
          ],
        },
      },
      {
        id: "local-fit",
        title: "When should you choose local transcription?",
        paragraphs: [
          "Choose a local workflow for a short sensitive recording, a draft transcript or a task where you only need to export the corrected text.",
          "The trade-off is that your device provides the memory and compute. A larger model can take longer to download and may run slowly on older hardware.",
        ],
      },
      {
        id: "cloud-fit",
        title: "When does a cloud service fit better?",
        paragraphs: [
          "Long recordings, batch jobs, automatic speaker labels and shared review workspaces are common reasons to use a cloud service. Those features are not part of Whisper Web's current local workflow.",
          "Review the provider's retention, region, subprocessors, account security and deletion controls before sending a sensitive recording.",
        ],
      },
    ],
    faq: [
      {
        question: "Is local transcription always more private?",
        answer:
          "Not necessarily. It removes the provider upload from the media path, but the final privacy outcome still depends on device security, backups and exported files.",
      },
      {
        question: "Is cloud transcription always faster?",
        answer:
          "No. Speed depends on upload time, queueing, provider compute, local hardware, model size and recording length.",
      },
      {
        question: "Can I use both workflows?",
        answer:
          "Yes. For example, use local processing for sensitive short files and an approved cloud service for long or collaborative jobs.",
      },
    ],
    relatedLinks: [
      {
        href: SEO_PAGES.transcribeWithoutUploading.path,
        label: "No-upload transcription explained",
        description: "Inspect the network and browser-storage boundary in detail.",
      },
      {
        href: SEO_PAGES.meetingTranscription.path,
        label: "Meeting transcription without bots",
        description: "Use local processing for a saved meeting recording.",
      },
    ],
  },
  {
    kind: "article",
    slug: "webgpu-vs-webassembly-whisper",
    seo: SEO_PAGES.webgpuVsWebassembly,
    eyebrow: "Browser compute guide",
    title: "WebGPU vs WebAssembly for local Whisper transcription",
    summary:
      "Both backends keep inference on the current device. WebAssembly is the compatible default; WebGPU can use supported graphics hardware but is not available everywhere.",
    directAnswer:
      "Start with WebAssembly when you want the broadest browser compatibility. Try WebGPU on a supported desktop browser and GPU when local processing is too slow, then switch back if model loading or inference fails.",
    sections: [
      {
        id: "comparison",
        title: "How do WebAssembly and WebGPU differ?",
        table: {
          caption: "WebAssembly and WebGPU in Whisper Web",
          headers: ["Question", "WebAssembly", "WebGPU"],
          rows: [
            ["Primary compute", "CPU through the browser runtime", "Supported GPU through the browser"],
            ["Compatibility", "Broader fallback", "Depends on browser, OS, driver and hardware support"],
            ["Setup in Whisper Web", "Default Tiny Q8 path", "Optional backend selected by the user"],
            ["Best first choice", "Unknown or constrained device", "Supported desktop device that needs more throughput"],
            ["Failure recovery", "Try a smaller model or another supported file", "Return to WebAssembly if initialization fails"],
          ],
        },
        sources: [
          {
            label: "MDN: WebAssembly",
            href: "https://developer.mozilla.org/en-US/docs/WebAssembly",
          },
          {
            label: "MDN: WebGPU API",
            href: "https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API",
          },
          {
            label: "Transformers.js: Running models on WebGPU",
            href: "https://huggingface.co/docs/transformers.js/en/guides/webgpu",
          },
        ],
      },
      {
        id: "model-size",
        title: "What still matters after you choose a backend?",
        paragraphs: [
          "Tiny, Base and Small models differ in download size, memory use and processing time. WebGPU may improve throughput on supported hardware, but it does not make every model suitable for every device.",
          "The first run downloads the selected model. Whisper Web can reuse the browser cache later, unless the browser clears it or storage is unavailable.",
        ],
      },
      {
        id: "troubleshooting",
        title: "What should you try when a backend fails?",
        bullets: [
          {
            title: "If WebGPU is unavailable",
            description: "Use WebAssembly. The transcription task does not require WebGPU.",
          },
          {
            title: "If the device runs out of memory",
            description: "Choose a smaller model and close other heavy tabs before retrying.",
          },
          {
            title: "If the first run appears slow",
            description: "Separate model-download time from transcription time before comparing backends.",
          },
        ],
      },
    ],
    faq: [
      {
        question: "Is WebGPU required for Whisper Web?",
        answer: "No. WebAssembly is available as the compatible local fallback.",
      },
      {
        question: "Is WebGPU always faster?",
        answer:
          "No. Performance depends on the browser, GPU, driver, model and recording. Compare on the device you actually plan to use.",
      },
      {
        question: "Do both backends keep audio local?",
        answer:
          "Yes. In Whisper Web local mode, both backends process the selected media on the current device.",
      },
    ],
    relatedLinks: [
      {
        href: SEO_PAGES.speechRecognition.path,
        label: "How browser speech recognition works",
        description: "Follow the complete media, model and storage pipeline.",
      },
      {
        href: SEO_PAGES.localVsCloud.path,
        label: "Local vs cloud transcription",
        description: "Compare device compute with provider-managed infrastructure.",
      },
    ],
  },
  {
    kind: "article",
    slug: "srt-vs-vtt-subtitle-format",
    seo: SEO_PAGES.srtVsVtt,
    eyebrow: "Export format guide",
    title: "SRT vs VTT: choose the subtitle file your destination expects",
    summary:
      "SRT is a simple, widely accepted subtitle format. WebVTT is designed for web video and supports browser-oriented features that SRT does not represent.",
    directAnswer:
      "Export SRT when a video editor or upload form asks for SRT or when broad subtitle compatibility is the priority. Export VTT for HTML video and web players that expect WebVTT. Always review the text and timing in the destination player.",
    sections: [
      {
        id: "comparison",
        title: "How do SRT and WebVTT differ?",
        table: {
          caption: "SRT and WebVTT export differences",
          headers: ["Feature", "SRT", "WebVTT"],
          rows: [
            ["Typical use", "Video editors, players and upload platforms", "HTML video and web players"],
            ["Time separator", "Comma in milliseconds", "Period in milliseconds"],
            ["Required file header", "None", "WEBVTT"],
            ["Cue settings", "Limited by the receiving tool", "Supports web cue positioning and alignment"],
            ["Whisper Web export", "Available", "Available"],
          ],
        },
        sources: [
          {
            label: "W3C: WebVTT specification",
            href: "https://www.w3.org/TR/webvtt1/",
          },
        ],
      },
      {
        id: "choose",
        title: "Which subtitle format should you choose?",
        bullets: [
          {
            title: "A video editor requests SRT",
            description: "Export SRT and import it directly, then check line breaks and timing on the edit timeline.",
          },
          {
            title: "An HTML video player uses a track element",
            description: "Export VTT and set the track source to the WebVTT file.",
          },
          {
            title: "The platform accepts both",
            description: "Prefer the simpler format already used by the rest of the publishing workflow.",
          },
        ],
      },
      {
        id: "review",
        title: "What should you check after export?",
        paragraphs: [
          "Automatic transcript segments are a starting point. Check spelling, reading speed, line length, timing and sound context in the final video.",
          "Converting between formats can preserve basic text and timing, but VTT-specific cue settings do not have a direct SRT equivalent.",
        ],
      },
    ],
    faq: [
      {
        question: "Is VTT more accurate than SRT?",
        answer:
          "No. The format does not change speech-recognition accuracy. It changes how timed text and cue settings are represented.",
      },
      {
        question: "Can I open SRT and VTT files in a text editor?",
        answer: "Yes. Both are text-based formats, so you can inspect and edit them directly.",
      },
      {
        question: "Which format should I upload to YouTube?",
        answer:
          "Use a subtitle format accepted by the current YouTube upload flow and check the imported captions. SRT is a common choice, but platform support can change.",
      },
    ],
    relatedLinks: [
      {
        href: SEO_PAGES.podcastTranscription.path,
        label: "Prepare podcast clip captions",
        description: "Use a corrected transcript as the start of a timed caption workflow.",
      },
      {
        href: SEO_PAGES.voiceMemoToText.path,
        label: "Convert a voice memo to text",
        description: "Choose TXT, JSON, SRT or VTT based on what you will do next.",
      },
    ],
  },
];

/**
 * 按 slug 返回唯一的场景页内容。
 */
export function getUseCasePage(slug: string): EditorialPage | undefined {
  return USE_CASE_PAGES.find((page) => page.slug === slug);
}

/**
 * 按 slug 返回唯一的 Blog 文章内容。
 */
export function getBlogPost(slug: string): EditorialPage | undefined {
  return BLOG_POSTS.find((page) => page.slug === slug);
}
