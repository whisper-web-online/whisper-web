import type { UiLocale } from "./ui-copy";

export interface LargeFileCopy {
  back: string;
  history: string;
  eyebrow: string;
  title: string;
  description: string;
  limit: string;
  workspaceLabel: string;
  chooseFile: string;
  dropTitle: string;
  dropHint: string;
  supportedFormats: string;
  analyzing: string;
  selectedFile: string;
  duration: string;
  size: string;
  sessionNotice: string;
  heat: {
    title: string;
    description: string;
    points: [string, string, string];
  };
  controls: {
    start: string;
    pause: string;
    pausePending: string;
    resume: string;
    cancel: string;
    cancelConfirm: string;
    chooseAnother: string;
  };
  status: {
    idle: string;
    analyzing: string;
    decoding: string;
    loading: string;
    transcribing: string;
    pausing: string;
    paused: string;
    saving: string;
    complete: string;
  };
  progress: {
    segment: string;
    complete: string;
    calibrating: string;
    estimate: string;
    reference: string;
  };
  completed: {
    title: string;
    description: string;
    openHistory: string;
  };
  errors: {
    unsupportedFormat: string;
    fileTooLarge: string;
    mediaTooLong: string;
    unreadable: string;
    noAudio: string;
    codec: string;
    duration: string;
    emptySegment: string;
    generic: string;
  };
  faqTitle: string;
  faq: Array<{ question: string; answer: string }>;
  schemaFeatures: [string, string, string];
}

export const LARGE_FILE_COPY: Record<UiLocale, LargeFileCopy> = {
  en: {
    back: "Standard transcription",
    history: "Local history",
    eyebrow: "Large-file transcription",
    title: "Transcribe a large audio or video file on your device",
    description:
      "Choose a local file up to 1 GB and 1 hour. Whisper Web decodes and transcribes it in smaller sections instead of loading the entire recording into memory.",
    limit: "Local file only · up to 1 GB and 1 hour · no media upload",
    workspaceLabel: "Large-file transcription workspace",
    chooseFile: "Choose a large file",
    dropTitle: "Drop a large audio or video file here",
    dropHint: "The browser checks the audio track and duration before transcription starts.",
    supportedFormats: "MP3, MP4, M4A, WAV, OGG, OPUS, WebM, AAC or FLAC",
    analyzing: "Checking the file and its audio track…",
    selectedFile: "Selected file",
    duration: "Duration",
    size: "File size",
    sessionNotice:
      "Progress is kept only in this tab. Reloading, closing the tab or putting the device to sleep means starting again.",
    heat: {
      title: "Long local jobs can warm up your device",
      description:
        "Whisper uses the CPU or GPU for an extended period. Higher power use, fan noise and a warmer device can occur during processing.",
      points: [
        "Connect the device to power for a long recording.",
        "Keep ventilation clear and stop if the device becomes unusually hot.",
        "Leave this tab open and keep the device awake until the transcript is saved.",
      ],
    },
    controls: {
      start: "Start large-file transcription",
      pause: "Pause after this section",
      pausePending: "Pause requested",
      resume: "Resume with the next section",
      cancel: "Cancel transcription",
      cancelConfirm: "Cancel this transcription and discard its partial progress?",
      chooseAnother: "Choose another file",
    },
    status: {
      idle: "Ready to start",
      analyzing: "Checking the selected file",
      decoding: "Decoding the next section locally",
      loading: "Loading the selected Whisper model",
      transcribing: "Transcribing this section on your device",
      pausing: "Finishing this section before pausing",
      paused: "Paused between sections",
      saving: "Saving the completed transcript to local history",
      complete: "Transcript saved in this browser",
    },
    progress: {
      segment: "Section {current} of {total}",
      complete: "{percent}% of the recording processed",
      calibrating: "A time estimate will appear after the first 30 seconds are processed.",
      estimate: "Estimated time remaining: about {lower}–{upper}",
      reference:
        "Reference only. The model, CPU or GPU backend, power mode, background tabs and other programs can change the actual time.",
    },
    completed: {
      title: "The transcript is ready",
      description: "It is saved in this browser. Open local history to edit it or export TXT, JSON, SRT or VTT.",
      openHistory: "Open saved transcript",
    },
    errors: {
      unsupportedFormat: "This format is not supported. Choose MP3, MP4, M4A, WAV, OGG, OPUS, WebM, AAC or FLAC.",
      fileTooLarge: "This file is larger than 1 GB. Choose a smaller file.",
      mediaTooLong: "The audio track is longer than 1 hour. Choose a shorter file.",
      unreadable: "The browser could not read this media container. Choose another file or export it in a supported format.",
      noAudio: "This file has no readable audio track. Choose a file that contains audio.",
      codec: "This browser cannot decode the file's audio codec. Try another browser or export the audio as MP3, WAV or M4A.",
      duration: "The browser could not determine the audio duration. Choose another file or export it again.",
      emptySegment: "One section contained no decodable audio. Export the source again and retry.",
      generic: "The file could not be transcribed. Keep this tab open, then try another model, browser or file.",
    },
    faqTitle: "Questions about large-file transcription",
    faq: [
      { question: "Does the large file get uploaded?", answer: "No. The browser reads, decodes and transcribes the selected file on this device. It still downloads the site and the selected Whisper model." },
      { question: "Why can a large transcription take so long?", answer: "The work runs on your CPU or GPU and speed varies by device, browser, model and power mode. The page calculates a reference range after the first processing block." },
      { question: "Can I close the tab and return later?", answer: "No. Partial progress is kept only in this tab. Keep it open and keep the device awake until the completed transcript is saved." },
      { question: "What happens when I pause?", answer: "The current five-minute section finishes first. Processing then stops between sections, and Resume continues with the next one." },
      { question: "Where is the completed transcript stored?", answer: "It is saved to IndexedDB in this browser, where you can edit it and export TXT, JSON, SRT or VTT." },
    ],
    schemaFeatures: [
      "Local segmented transcription for files up to 1 GB and 1 hour",
      "Dynamic wait estimate based on the current device",
      "Editable transcript with TXT, JSON, SRT and VTT export",
    ],
  },
  es: {
    back: "Transcripción estándar",
    history: "Historial local",
    eyebrow: "Transcripción de archivos grandes",
    title: "Transcribe audios largos y archivos grandes en tu dispositivo",
    description:
      "Selecciona un archivo local de hasta 1 GB y 1 hora. Whisper Web lo divide en secciones para no cargar toda la grabación en la memoria a la vez.",
    limit: "Solo archivos locales · hasta 1 GB y 1 hora · sin subir el archivo",
    workspaceLabel: "Área para transcribir archivos grandes",
    chooseFile: "Seleccionar un archivo grande",
    dropTitle: "Suelta aquí un archivo de audio o vídeo grande",
    dropHint: "El navegador comprobará la pista de audio y la duración antes de empezar.",
    supportedFormats: "MP3, MP4, M4A, WAV, OGG, OPUS, WebM, AAC o FLAC",
    analyzing: "Comprobando el archivo y su pista de audio…",
    selectedFile: "Archivo seleccionado",
    duration: "Duración",
    size: "Tamaño",
    sessionNotice:
      "El progreso solo se conserva en esta pestaña. Si la recargas, la cierras o el dispositivo entra en reposo, tendrás que empezar de nuevo.",
    heat: {
      title: "Un proceso largo puede calentar el dispositivo",
      description:
        "Whisper utilizará la CPU o la GPU durante bastante tiempo. Puede aumentar el consumo, activarse el ventilador o subir la temperatura del dispositivo.",
      points: [
        "Conecta el dispositivo a la corriente para una grabación larga.",
        "No bloquees la ventilación y detén el proceso si el dispositivo se calienta de forma anormal.",
        "Mantén esta pestaña abierta y el dispositivo activo hasta que se guarde el resultado.",
      ],
    },
    controls: {
      start: "Iniciar la transcripción",
      pause: "Pausar después de esta sección",
      pausePending: "Pausa solicitada",
      resume: "Continuar con la sección siguiente",
      cancel: "Cancelar la transcripción",
      cancelConfirm: "¿Quieres cancelar la transcripción y descartar el progreso parcial?",
      chooseAnother: "Elegir otro archivo",
    },
    status: {
      idle: "Listo para empezar",
      analyzing: "Comprobando el archivo seleccionado",
      decoding: "Decodificando la siguiente sección en el dispositivo",
      loading: "Cargando el modelo Whisper seleccionado",
      transcribing: "Transcribiendo esta sección en el dispositivo",
      pausing: "Terminando esta sección antes de pausar",
      paused: "En pausa entre secciones",
      saving: "Guardando la transcripción en el historial local",
      complete: "Transcripción guardada en este navegador",
    },
    progress: {
      segment: "Sección {current} de {total}",
      complete: "{percent}% de la grabación procesado",
      calibrating: "La estimación aparecerá después de procesar los primeros 30 segundos.",
      estimate: "Tiempo restante estimado: entre {lower} y {upper}",
      reference:
        "Solo como referencia. El modelo, la CPU o GPU, el modo de energía, las pestañas en segundo plano y otros programas pueden cambiar el tiempo real.",
    },
    completed: {
      title: "La transcripción está lista",
      description: "Se ha guardado en este navegador. Abre el historial local para editarla o exportar TXT, JSON, SRT o VTT.",
      openHistory: "Abrir la transcripción guardada",
    },
    errors: {
      unsupportedFormat: "Este formato no es compatible. Elige MP3, MP4, M4A, WAV, OGG, OPUS, WebM, AAC o FLAC.",
      fileTooLarge: "El archivo supera 1 GB. Elige uno más pequeño.",
      mediaTooLong: "La pista de audio dura más de 1 hora. Elige un archivo más corto.",
      unreadable: "El navegador no puede leer este contenedor. Elige otro archivo o expórtalo en un formato compatible.",
      noAudio: "El archivo no contiene una pista de audio legible. Elige un archivo con audio.",
      codec: "Este navegador no puede decodificar el códec de audio. Prueba otro navegador o exporta el audio como MP3, WAV o M4A.",
      duration: "El navegador no pudo determinar la duración. Elige otro archivo o vuelve a exportarlo.",
      emptySegment: "Una sección no contenía audio decodificable. Vuelve a exportar el archivo de origen e inténtalo otra vez.",
      generic: "No se pudo transcribir el archivo. Mantén abierta esta pestaña y prueba otro modelo, navegador o archivo.",
    },
    faqTitle: "Preguntas sobre transcribir archivos grandes",
    faq: [
      { question: "¿Se sube el archivo grande?", answer: "No. El navegador lee, decodifica y transcribe el archivo en este dispositivo. Aun así, descarga la aplicación y el modelo Whisper elegido." },
      { question: "¿Por qué puede tardar tanto?", answer: "El trabajo se ejecuta en la CPU o la GPU y la velocidad depende del dispositivo, el navegador, el modelo y el modo de energía. La página calcula un intervalo orientativo después del primer bloque." },
      { question: "¿Puedo cerrar la pestaña y volver más tarde?", answer: "No. El progreso parcial solo se conserva en esta pestaña. Déjala abierta y mantén el dispositivo activo hasta que se guarde el resultado." },
      { question: "¿Qué ocurre al pausar?", answer: "Primero termina la sección actual de cinco minutos. Después se detiene entre secciones y continúa con la siguiente al reanudar." },
      { question: "¿Dónde se guarda el resultado?", answer: "Se guarda en IndexedDB en este navegador. Desde el historial puedes editarlo y exportar TXT, JSON, SRT o VTT." },
    ],
    schemaFeatures: [
      "Transcripción local por secciones para archivos de hasta 1 GB y 1 hora",
      "Estimación dinámica según la velocidad de este dispositivo",
      "Texto editable y exportación TXT, JSON, SRT y VTT",
    ],
  },
  ar: {
    back: "النسخ العادي",
    history: "السجل المحلي",
    eyebrow: "نسخ الملفات الكبيرة",
    title: "حوّل ملفًا صوتيًا أو فيديو طويلًا إلى نص على جهازك",
    description:
      "اختر ملفًا محليًا بحجم يصل إلى 1 غيغابايت ومدته تصل إلى ساعة. يقسم Whisper Web الملف إلى مقاطع بدلًا من تحميل التسجيل كاملًا في الذاكرة.",
    limit: "ملف محلي فقط · حتى 1 غيغابايت وساعة واحدة · دون رفع ملف الوسائط",
    workspaceLabel: "مساحة نسخ الملفات الكبيرة",
    chooseFile: "اختيار ملف كبير",
    dropTitle: "أسقط ملفًا صوتيًا أو ملف فيديو كبيرًا هنا",
    dropHint: "سيتحقق المتصفح من المسار الصوتي والمدة قبل بدء النسخ.",
    supportedFormats: "MP3 أو MP4 أو M4A أو WAV أو OGG أو OPUS أو WebM أو AAC أو FLAC",
    analyzing: "جارٍ فحص الملف والمسار الصوتي…",
    selectedFile: "الملف المحدد",
    duration: "المدة",
    size: "الحجم",
    sessionNotice:
      "يُحفظ التقدم في علامة التبويب هذه فقط. ستحتاج إلى البدء من جديد إذا أعدت تحميل الصفحة أو أغلقتها أو دخل الجهاز في وضع السكون.",
    heat: {
      title: "قد تؤدي المهام الطويلة إلى ارتفاع حرارة الجهاز",
      description:
        "يستخدم Whisper المعالج أو وحدة الرسومات لفترة طويلة. قد يزداد استهلاك الطاقة أو صوت المروحة أو حرارة الجهاز أثناء المعالجة.",
      points: [
        "صِل الجهاز بمصدر الطاقة عند معالجة تسجيل طويل.",
        "حافظ على التهوية وأوقف المعالجة إذا ارتفعت حرارة الجهاز بصورة غير طبيعية.",
        "اترك علامة التبويب مفتوحة والجهاز في وضع التشغيل حتى يُحفظ النص.",
      ],
    },
    controls: {
      start: "بدء نسخ الملف الكبير",
      pause: "إيقاف مؤقت بعد هذا المقطع",
      pausePending: "طُلب الإيقاف المؤقت",
      resume: "متابعة المقطع التالي",
      cancel: "إلغاء النسخ",
      cancelConfirm: "هل تريد إلغاء النسخ وحذف التقدم الجزئي؟",
      chooseAnother: "اختيار ملف آخر",
    },
    status: {
      idle: "جاهز للبدء",
      analyzing: "جارٍ فحص الملف المحدد",
      decoding: "جارٍ فك ترميز المقطع التالي محليًا",
      loading: "جارٍ تحميل نموذج Whisper المحدد",
      transcribing: "جارٍ نسخ هذا المقطع على جهازك",
      pausing: "جارٍ إكمال هذا المقطع قبل التوقف",
      paused: "متوقف مؤقتًا بين المقاطع",
      saving: "جارٍ حفظ النص المكتمل في السجل المحلي",
      complete: "حُفظ النص في هذا المتصفح",
    },
    progress: {
      segment: "المقطع {current} من {total}",
      complete: "تمت معالجة {percent}% من التسجيل",
      calibrating: "سيظهر تقدير الوقت بعد معالجة أول 30 ثانية.",
      estimate: "الوقت المتبقي المقدر: نحو {lower}–{upper}",
      reference:
        "للاسترشاد فقط. قد يغيّر النموذج والمعالج أو وحدة الرسومات ووضع الطاقة وعلامات التبويب الخلفية والبرامج الأخرى الوقت الفعلي.",
    },
    completed: {
      title: "النص جاهز",
      description: "حُفظ في هذا المتصفح. افتح السجل المحلي لتحريره أو تصديره بصيغة TXT أو JSON أو SRT أو VTT.",
      openHistory: "فتح النص المحفوظ",
    },
    errors: {
      unsupportedFormat: "هذا التنسيق غير مدعوم. اختر MP3 أو MP4 أو M4A أو WAV أو OGG أو OPUS أو WebM أو AAC أو FLAC.",
      fileTooLarge: "حجم الملف أكبر من 1 غيغابايت. اختر ملفًا أصغر.",
      mediaTooLong: "مدة المسار الصوتي أطول من ساعة. اختر ملفًا أقصر.",
      unreadable: "تعذر على المتصفح قراءة حاوية الوسائط هذه. اختر ملفًا آخر أو صدّره بتنسيق مدعوم.",
      noAudio: "لا يحتوي الملف على مسار صوتي قابل للقراءة. اختر ملفًا يحتوي على صوت.",
      codec: "لا يستطيع هذا المتصفح فك ترميز الصوت. جرّب متصفحًا آخر أو صدّر الصوت بصيغة MP3 أو WAV أو M4A.",
      duration: "تعذر على المتصفح تحديد مدة الصوت. اختر ملفًا آخر أو أعد تصديره.",
      emptySegment: "لم يحتوِ أحد المقاطع على صوت قابل لفك الترميز. أعد تصدير المصدر ثم حاول مرة أخرى.",
      generic: "تعذر نسخ الملف. اترك علامة التبويب مفتوحة وجرّب نموذجًا أو متصفحًا أو ملفًا آخر.",
    },
    faqTitle: "أسئلة عن نسخ الملفات الكبيرة",
    faq: [
      { question: "هل يُرفع الملف الكبير؟", answer: "لا. يقرأ المتصفح الملف ويفك ترميزه وينسخه على هذا الجهاز. لكنه ينزّل ملفات الموقع ونموذج Whisper المحدد." },
      { question: "لماذا قد يستغرق النسخ وقتًا طويلًا؟", answer: "تجري المعالجة على المعالج أو وحدة الرسومات، وتختلف السرعة حسب الجهاز والمتصفح والنموذج ووضع الطاقة. تحسب الصفحة نطاقًا استرشاديًا بعد أول كتلة معالجة." },
      { question: "هل يمكنني إغلاق علامة التبويب والعودة لاحقًا؟", answer: "لا. يُحفظ التقدم الجزئي في علامة التبويب هذه فقط. اتركها مفتوحة وحافظ على تشغيل الجهاز حتى يُحفظ النص المكتمل." },
      { question: "ماذا يحدث عند الإيقاف المؤقت؟", answer: "يكتمل أولًا المقطع الحالي ومدته خمس دقائق، ثم تتوقف المعالجة بين المقاطع وتتابع من المقطع التالي عند الاستئناف." },
      { question: "أين يُحفظ النص المكتمل؟", answer: "يُحفظ في IndexedDB داخل هذا المتصفح، ويمكنك تحريره وتصديره بصيغة TXT أو JSON أو SRT أو VTT من السجل." },
    ],
    schemaFeatures: [
      "نسخ محلي مقسم لملفات تصل إلى 1 غيغابايت وساعة واحدة",
      "تقدير ديناميكي للوقت حسب سرعة الجهاز الحالي",
      "نص قابل للتحرير وتصدير TXT وJSON وSRT وVTT",
    ],
  },
};
