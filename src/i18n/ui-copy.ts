export type UiLocale = "en" | "es" | "ar";

export interface UiCopy {
  nav: { transcribe: string; tools: string; history: string; guide: string };
  hero: {
    title: string;
    description: string;
    localNote: string;
  };
  input: {
    workspaceLabel: string;
    dropTitle: string;
    dropHint: string;
    formats: string;
    largeFile: { prompt: string; action: string };
    file: string;
    url: string;
    urlTitle: string;
    urlHint: string;
    import: string;
    record: string;
    recordTitle: string;
    recordHint: string;
    startRecording: string;
    stop: string;
    model: string;
    language: string;
    popularLanguages: string;
    moreLanguages: string;
    output: string;
    originalLanguage: string;
    translateToEnglish: string;
    backend: string;
    backendOptions: { wasm: string; webgpu: string; auto: string };
    modelHints: [string, string, string];
    selectedMedia: string;
    readyToStart: string;
    start: string;
    settingsDialog: {
      eyebrow: string;
      title: string;
      description: string;
      cancel: string;
      confirm: string;
    };
    errorDialog: {
      title: string;
      description: string;
      exampleLabel: string;
      example: string;
      requirements: [string, string, string];
      close: string;
    };
    resume: string;
    pause: string;
    stopTranscription: string;
    pausedHint: string;
    stoppedHint: string;
    privacyCaption: string;
    warmup: {
      ready: string;
      retry: string;
      deferred: string;
      preparing: string;
    };
    progress: {
      decoding: string;
      decodingHint: string;
      loading: string;
      loadingHint: string;
      transcribing: string;
      transcribingHint: string;
      saving: string;
      savingHint: string;
      complete: string;
      completeHint: string;
      paused: string;
      pausedHint: string;
      waitingHints: [string, string, string, string];
      steps: [string, string, string, string];
    };
  };
  errors: {
    unsupportedFormat: string;
    fileTooLarge: string;
    mediaTooLong: string;
    selectionFailed: string;
    transcriptionFailed: string;
    urlHttp: string;
    urlFailed: string;
  };
  workflow: [string, string, string];
  workflowHeading: string;
  workflowDetails: [string, string, string];
  trust: {
    title: string;
    description: string;
    tableCaption: string;
    tableHeaders: [string, string];
    tableRows: Array<{ question: string; answer: string }>;
    sources: {
      title: string;
      description: string;
      items: Array<{ label: string; href: string }>;
    };
    points: [
      { title: string; description: string },
      { title: string; description: string },
      { title: string; description: string },
    ];
  };
  faq: {
    title: string;
    items: Array<{ question: string; answer: string; link?: { href: string; label: string } }>;
  };
  discovery?: {
    eyebrow: string;
    title: string;
    description: string;
    useCasesTitle: string;
    useCases: Array<{ title: string; description: string }>;
    blogTitle: string;
    blog: Array<{ title: string; description: string }>;
  };
  footerLinks?: {
    heading: string;
    useCases: string;
    blog: string;
    guide: string;
  };
  footer: string;
  schema: {
    features: { local: string; inputs: string; exports: string };
  };
  history: {
    title: string;
    search: string;
    empty: string;
    complete: string;
    copy: string;
    download: string;
    timeline: string;
    text: string;
    editableTranscript: string;
    noTimestamps: string;
    details: string;
    model: string;
    language: string;
    compute: string;
    delete: string;
    deleteConfirm: string;
  };
}

export const UI_COPY: Record<UiLocale, UiCopy> = {
  en: {
    nav: { transcribe: "Transcribe", tools: "Tools", history: "History", guide: "Guide" },
    hero: {
      title: "Transcribe audio and video privately with Whisper Web.",
      description:
        "Select an audio or video file to create editable text, timestamps or subtitles. Whisper processes the media in this browser. Files can be up to 300 MB and 20 minutes.",
      localNote: "No account · No media upload · TXT, SRT, VTT and JSON",
    },
    input: {
      workspaceLabel: "Local transcription workspace",
      dropTitle: "Drop a media file here",
      dropHint: "Audio or video · up to 300 MB and 20 minutes",
      formats: "Supported formats",
      largeFile: {
        prompt: "File over 300 MB or longer than 20 minutes?",
        action: "Use large-file transcription · up to 1 GB and 1 hour",
      },
      file: "Choose file",
      url: "Paste URL",
      urlTitle: "Paste a direct media URL",
      urlHint: "Use a public link that opens the media file directly, without sign-in",
      import: "Import",
      record: "Record",
      recordTitle: "Record from your microphone",
      recordHint: "Audio stays in this browser and is processed on this device",
      startRecording: "Start recording",
      stop: "Stop recording",
      model: "Model",
      language: "Audio language",
      popularLanguages: "Popular languages",
      moreLanguages: "More languages",
      output: "Output language",
      originalLanguage: "Same as audio",
      translateToEnglish: "English translation",
      backend: "Compute",
      backendOptions: {
        wasm: "WebAssembly · smaller download",
        webgpu: "WebGPU · faster on supported devices",
        auto: "Automatic · try WebGPU first",
      },
      modelHints: ["Smallest download", "Balance of speed and detail", "More detail, higher device load"],
      selectedMedia: "Selected media",
      readyToStart: "Ready to transcribe",
      start: "Start transcription",
      settingsDialog: {
        eyebrow: "Before you start",
        title: "Confirm transcription settings",
        description: "Review these settings before Whisper starts processing on this device.",
        cancel: "Back",
        confirm: "Confirm and start",
      },
      errorDialog: {
        title: "Check your media URL",
        description: "Paste a direct link to the audio or video file itself, not a webpage that contains a player.",
        exampleLabel: "Example format",
        example: "https://media.example.com/interview.mp3",
        requirements: [
          "It opens without signing in or requesting access.",
          "The file is publicly reachable and the website allows this browser to read it.",
          "It points to a supported media file, not YouTube or a cloud-drive preview page.",
        ],
        close: "Close",
      },
      resume: "Resume transcription",
      pause: "Pause",
      stopTranscription: "Stop",
      pausedHint: "Paused. Resume will restart this transcription from the beginning.",
      stoppedHint: "Transcription stopped. Your selected media is still ready to start again.",
      privacyCaption: "Processing happens on this device. Direct links must open without sign-in and allow this browser to read the media file.",
      warmup: {
        ready: "Local engine ready",
        retry: "Try again",
        deferred: "The local engine will load when you start transcription",
        preparing: "Preparing the local engine in the background",
      },
      progress: {
        decoding: "Preparing your media",
        decodingHint: "Decoding audio locally and checking its duration.",
        loading: "Loading the local engine",
        loadingHint: "The first run downloads the selected model. It stays cached in this browser.",
        transcribing: "Transcribing locally",
        transcribingHint: "Whisper is processing your media on this device.",
        saving: "Saving your transcript",
        savingHint: "Writing the completed result to local browser history.",
        complete: "Transcription complete",
        completeHint: "Your transcript is ready. Opening the result now.",
        paused: "Transcription paused",
        pausedHint: "No processing is running. Resume starts again from the beginning.",
        waitingHints: [
          "Large files can take longer to decode; longer recordings take longer to transcribe.",
          "Local transcription uses your CPU or GPU. Higher power use, fan noise, or a warmer device can be normal.",
          "Keep this tab open. Background tab limits may slow local processing.",
          "Your media remains on this device while Whisper works.",
        ],
        steps: ["Media", "Engine", "Transcribe", "Save"],
      },
    },
    errors: {
      unsupportedFormat: "This file format is not supported. Choose MP3, MP4, M4A, WAV, OGG, OPUS, WebM, AAC or FLAC.",
      fileTooLarge: "This file exceeds the 300 MB standard limit. The large-file page accepts local files up to 1 GB.",
      mediaTooLong: "This recording exceeds the 20-minute standard limit. The large-file page accepts media up to 1 hour.",
      selectionFailed: "The media could not be selected. Choose another file and try again.",
      transcriptionFailed: "The media could not be transcribed. Check the format, then try another model or file.",
      urlHttp: "The media URL returned HTTP {status}.",
      urlFailed: "We couldn't open a media file from this URL.",
    },
    workflow: ["Import", "Recognize locally", "Export"],
    workflowHeading: "How does Whisper Web transcribe your recording?",
    workflowDetails: ["File, direct link or microphone", "Whisper runs on your device", "TXT, JSON, SRT or VTT"],
    trust: {
      title: "What stays on your device, and what still uses the network?",
      description:
        "Your selected local media and completed transcript stay in this browser. The page, Whisper model, direct media URLs and analytics still make network requests.",
      tableCaption: "How Whisper Web handles media, transcripts and network requests",
      tableHeaders: ["Your question", "What happens in Whisper Web"],
      tableRows: [
        {
          question: "Does a selected file leave this device?",
          answer: "No. The browser decodes and transcribes the selected local file on this device.",
        },
        {
          question: "Where is the finished transcript saved?",
          answer: "In this browser's IndexedDB until you export or delete it.",
        },
        {
          question: "Why does the Whisper model use the network?",
          answer: "The browser downloads the model you choose, then runs it on this device.",
        },
        {
          question: "What loads when you open the page?",
          answer: "The browser downloads the application code, fonts and other website files.",
        },
        {
          question: "What happens when you paste a direct media URL?",
          answer: "Your browser requests the media from its source host, so that host receives the request.",
        },
        {
          question: "What do analytics services receive?",
          answer: "They receive page and interaction data, not your selected media, microphone recording or transcript text.",
        },
      ],
      sources: {
        title: "Sources",
        description:
          "These references explain the browser technologies in the table. For Whisper Web's own data handling, read our privacy policy.",
        items: [
          { label: "MDN: IndexedDB API", href: "https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API" },
          { label: "MDN: WebGPU API", href: "https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API" },
          { label: "MDN: WebAssembly", href: "https://developer.mozilla.org/en-US/docs/WebAssembly" },
          { label: "Transformers.js: Running models on WebGPU", href: "https://huggingface.co/docs/transformers.js/en/guides/webgpu" },
          { label: "Whisper Web privacy policy", href: "/privacy" },
        ],
      },
      points: [
        { title: "No media upload", description: "The selected media is processed on your device and is not sent to Whisper Web servers." },
        { title: "Two compute options", description: "WebGPU can run faster; WebAssembly provides a broadly compatible fallback." },
        { title: "Edit and export locally", description: "Correct the text, copy it or export TXT, JSON, SRT or VTT." },
      ],
    },
    faq: {
      title: "Questions about local transcription",
      items: [
        { question: "Does my file leave this device?", answer: "No. In local mode, the browser reads and decodes it in memory." },
        { question: "Why is the first transcription slower?", answer: "The selected Whisper model downloads once and is then cached by your browser." },
        { question: "Which formats are supported?", answer: "Whisper Web accepts common MP3, WAV, M4A, MP4 and WebM files, subject to your browser's decoding support." },
        {
          question: "Which languages can I transcribe?",
          answer: "The Audio language menu includes 99 languages, including English, Spanish, Arabic, Chinese, Hindi, French, German, Japanese and Portuguese. Choose the language spoken in the recording before you start.",
        },
        {
          question: "What if I need to transcribe a large file?",
          answer: "Use the large-file page for a local audio or video file up to 1 GB and 1 hour. Keep this tab open: a long job can warm the device and take time. A reference estimate appears after processing begins.",
          link: { href: "/large-file-transcription", label: "Transcribe a large file" },
        },
      ],
    },
    discovery: {
      eyebrow: "Start with your recording",
      title: "Which workflow fits your recording?",
      description:
        "Choose a recording type for step-by-step help, or read a guide before deciding where to process the audio and which file to export.",
      useCasesTitle: "Use cases",
      useCases: [
        {
          title: "Meeting transcription without bots",
          description: "Work from a saved call recording without adding a participant to the meeting.",
        },
        {
          title: "Voice memo to text",
          description: "Turn a supported phone recording into editable notes and timed text.",
        },
        {
          title: "Private interview transcription",
          description: "Review quotes and timestamps while the source audio stays on the device.",
        },
        {
          title: "Private podcast transcription",
          description: "Create text and captions for a short episode, trailer or selected clip.",
        },
      ],
      blogTitle: "Guides",
      blog: [
        {
          title: "Transcribe audio without uploading it",
          description: "See what stays local and what the browser still downloads.",
        },
        {
          title: "Local vs cloud transcription",
          description: "Compare the data path, limits, compute and collaboration trade-offs.",
        },
        {
          title: "WebGPU vs WebAssembly",
          description: "Choose a local compute backend based on the device and browser.",
        },
        {
          title: "How to transcribe a large recording",
          description: "Choose the right tool, prepare the device and plan for interruptions before you start.",
        },
      ],
    },
    footerLinks: {
      heading: "Transcription resources",
      useCases: "Use Cases",
      blog: "Blog",
      guide: "Speech Recognition Guide",
    },
    footer: "Browser transcription with local processing",
    schema: {
      features: {
        local: "Local Whisper inference without media upload",
        inputs: "Audio, video, direct media URL, and microphone input",
        exports: "Editable transcripts with TXT, JSON, SRT, and VTT export",
      },
    },
    history: {
      title: "Transcripts on this device",
      search: "Search saved transcripts",
      empty: "No transcripts are saved in this browser. Choose a recording to create one.",
      complete: "Transcript saved in this browser",
      copy: "Copy text",
      download: "Download",
      timeline: "Timestamps",
      text: "Edit text",
      editableTranscript: "Editable transcript",
      noTimestamps: "This transcript has no timestamped segments. Open the text tab to review it.",
      details: "Transcript details",
      model: "Model",
      language: "Language",
      compute: "Compute",
      delete: "Delete transcript",
      deleteConfirm: "Delete this transcript from this browser? This cannot be undone.",
    },
  },
  es: {
    nav: { transcribe: "Transcribir", tools: "Herramientas", history: "Historial", guide: "Guía (en inglés)" },
    hero: {
      title: "Transcribir audio a texto gratis en tu navegador.",
      description:
        "Selecciona un archivo de audio o vídeo para obtener texto editable, marcas de tiempo o subtítulos. Whisper procesa el archivo en este navegador. El límite es de 300 MB y 20 minutos.",
      localNote: "Sin cuenta · Sin subir archivos a Whisper Web · TXT, SRT, VTT y JSON",
    },
    input: {
      workspaceLabel: "Área de transcripción local",
      dropTitle: "Suelta un archivo multimedia aquí",
      dropHint: "Audio o vídeo · hasta 300 MB y 20 minutos",
      formats: "Formatos compatibles",
      largeFile: {
        prompt: "¿El archivo supera 300 MB o dura más de 20 minutos?",
        action: "Transcribir un archivo grande · hasta 1 GB y 1 hora",
      },
      file: "Elegir archivo",
      url: "Pegar URL",
      urlTitle: "Pega una URL directa del archivo",
      urlHint: "Usa un enlace público que abra el archivo directamente, sin iniciar sesión",
      import: "Importar",
      record: "Grabar",
      recordTitle: "Graba con tu micrófono",
      recordHint: "El audio permanece en este navegador y se procesa en tu dispositivo",
      startRecording: "Iniciar grabación",
      stop: "Detener grabación",
      model: "Modelo",
      language: "Idioma del audio",
      popularLanguages: "Idiomas más usados",
      moreLanguages: "Más idiomas",
      output: "Idioma de salida",
      originalLanguage: "Igual que el audio",
      translateToEnglish: "Traducción al inglés",
      backend: "Procesamiento",
      backendOptions: {
        wasm: "WebAssembly · descarga más pequeña",
        webgpu: "WebGPU · más rápido en dispositivos compatibles",
        auto: "Automático · probar WebGPU primero",
      },
      modelHints: ["Descarga más pequeña", "Equilibrio entre velocidad y detalle", "Más detalle y mayor carga del dispositivo"],
      selectedMedia: "Archivo seleccionado",
      readyToStart: "Listo para transcribir",
      start: "Iniciar transcripción",
      settingsDialog: {
        eyebrow: "Antes de empezar",
        title: "Confirma los ajustes de transcripción",
        description: "Revisa estos ajustes antes de que Whisper empiece a procesar en este dispositivo.",
        cancel: "Volver",
        confirm: "Confirmar e iniciar",
      },
      errorDialog: {
        title: "Comprueba la URL del archivo",
        description: "Pega un enlace directo al archivo de audio o vídeo, no una página web que contenga un reproductor.",
        exampleLabel: "Formato de ejemplo",
        example: "https://media.example.com/entrevista.mp3",
        requirements: [
          "Debe abrirse sin iniciar sesión ni solicitar acceso.",
          "El archivo debe ser público y el sitio debe permitir que este navegador lo lea.",
          "Debe apuntar a un archivo compatible, no a YouTube ni a una vista previa de almacenamiento en la nube.",
        ],
        close: "Cerrar",
      },
      resume: "Reanudar transcripción",
      pause: "Pausar",
      stopTranscription: "Detener",
      pausedHint: "En pausa. Al reanudar, la transcripción comenzará de nuevo desde el principio.",
      stoppedHint: "Transcripción detenida. El archivo seleccionado sigue listo para volver a empezar.",
      privacyCaption: "El procesamiento se realiza en este dispositivo. Los enlaces directos deben abrirse sin iniciar sesión y permitir que este navegador lea el archivo.",
      warmup: {
        ready: "Motor local listo",
        retry: "Reintentar",
        deferred: "El motor local se cargará cuando inicies la transcripción",
        preparing: "Preparando el motor local en segundo plano",
      },
      progress: {
        decoding: "Preparando el archivo",
        decodingHint: "Decodificando el audio localmente y comprobando su duración.",
        loading: "Cargando el motor local",
        loadingHint: "La primera ejecución descarga el modelo y lo guarda en la caché del navegador.",
        transcribing: "Transcribiendo localmente",
        transcribingHint: "Whisper está procesando el archivo en este dispositivo.",
        saving: "Guardando la transcripción",
        savingHint: "Guardando el resultado en el historial local del navegador.",
        complete: "Transcripción completada",
        completeHint: "La transcripción está lista. Abriendo el resultado.",
        paused: "Transcripción en pausa",
        pausedHint: "No hay procesamiento activo. Al reanudar, empezará de nuevo desde el principio.",
        waitingHints: [
          "Los archivos grandes pueden tardar más en decodificarse; las grabaciones más largas tardan más en transcribirse.",
          "La transcripción local utiliza la CPU o la GPU. Durante el proceso puede aumentar el consumo, activarse el ventilador o calentarse el dispositivo.",
          "Mantén abierta esta pestaña. Las restricciones en segundo plano pueden ralentizar el proceso local.",
          "El archivo permanece en este dispositivo mientras Whisper trabaja.",
        ],
        steps: ["Archivo", "Motor", "Transcribir", "Guardar"],
      },
    },
    errors: {
      unsupportedFormat: "Este formato no es compatible. Elige un archivo MP3, MP4, M4A, WAV, OGG, OPUS, WebM, AAC o FLAC.",
      fileTooLarge: "El archivo supera el límite estándar de 300 MB. La página para archivos grandes admite archivos locales de hasta 1 GB.",
      mediaTooLong: "La grabación supera el límite estándar de 20 minutos. La página para archivos grandes admite archivos de hasta 1 hora.",
      selectionFailed: "No se pudo seleccionar el archivo. Elige otro y vuelve a intentarlo.",
      transcriptionFailed: "No se pudo transcribir el archivo. Comprueba el formato y prueba con otro modelo o archivo.",
      urlHttp: "La URL del archivo devolvió el estado HTTP {status}.",
      urlFailed: "No pudimos abrir un archivo multimedia desde esta URL.",
    },
    workflow: ["Importar", "Reconocer localmente", "Exportar"],
    workflowHeading: "¿Cómo convierte Whisper Web tu grabación en texto?",
    workflowDetails: ["Archivo, enlace directo o micrófono", "Whisper funciona en tu dispositivo", "TXT, JSON, SRT o VTT"],
    trust: {
      title: "¿Qué se queda en tu dispositivo y qué necesita conexión?",
      description:
        "El archivo local y la transcripción terminada se quedan en este navegador. La página, el modelo Whisper, los enlaces directos y los servicios de analítica siguen usando la red.",
      tableCaption: "Cómo gestiona Whisper Web los archivos, las transcripciones y las conexiones de red",
      tableHeaders: ["Tu pregunta", "Qué ocurre en Whisper Web"],
      tableRows: [
        {
          question: "¿El archivo que elijo sale de este dispositivo?",
          answer: "No. El navegador decodifica y transcribe el archivo local en este dispositivo.",
        },
        {
          question: "¿Dónde se guarda la transcripción terminada?",
          answer: "En IndexedDB, dentro de este navegador, hasta que la exportes o la elimines.",
        },
        {
          question: "¿Por qué el modelo Whisper necesita conexión?",
          answer: "El navegador descarga el modelo que elijas y después lo ejecuta en este dispositivo.",
        },
        {
          question: "¿Qué se descarga al abrir la página?",
          answer: "El código de la aplicación, las fuentes y otros archivos necesarios para mostrar el sitio.",
        },
        {
          question: "¿Qué ocurre al pegar un enlace directo?",
          answer: "Tu navegador solicita el archivo al servidor de origen, que recibe esa petición.",
        },
        {
          question: "¿Qué reciben los servicios de analítica?",
          answer: "Datos de páginas e interacciones, pero no el archivo elegido, la grabación del micrófono ni el texto transcrito.",
        },
      ],
      sources: {
        title: "Fuentes",
        description:
          "Estas referencias explican las tecnologías del navegador de la tabla. Para saber cómo trata Whisper Web tus datos, consulta nuestra política de privacidad.",
        items: [
          { label: "MDN: API de IndexedDB", href: "https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API" },
          { label: "MDN: API de WebGPU", href: "https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API" },
          { label: "MDN: WebAssembly", href: "https://developer.mozilla.org/en-US/docs/WebAssembly" },
          { label: "Transformers.js: uso de modelos con WebGPU", href: "https://huggingface.co/docs/transformers.js/en/guides/webgpu" },
          { label: "Política de privacidad de Whisper Web (en inglés)", href: "/privacy" },
        ],
      },
      points: [
        { title: "Sin subir archivos", description: "El archivo se procesa en tu dispositivo y no se envía a los servidores de Whisper Web." },
        { title: "Dos opciones de cómputo", description: "WebGPU puede ser más rápido y WebAssembly ofrece una alternativa compatible." },
        { title: "Edita y exporta el resultado", description: "Corrige el texto, cópialo o expórtalo como TXT, JSON, SRT o VTT." },
      ],
    },
    faq: {
      title: "Preguntas sobre transcribir audio a texto",
      items: [
        { question: "¿Mi archivo sale de este dispositivo?", answer: "No. En el modo local, el navegador lee y decodifica el archivo en memoria." },
        { question: "¿Por qué tarda más la primera transcripción?", answer: "El modelo Whisper elegido se descarga una vez y después queda guardado en la caché del navegador." },
        { question: "¿Qué formatos son compatibles?", answer: "Whisper Web acepta archivos habituales como MP3, WAV, M4A, MP4 y WebM, según la compatibilidad de decodificación del navegador." },
        {
          question: "¿Qué idiomas puedo transcribir?",
          answer: "El menú Idioma del audio incluye 99 idiomas, entre ellos español, inglés, árabe, chino, hindi, francés, alemán, japonés y portugués. Elige el idioma de la grabación antes de empezar.",
        },
        {
          question: "¿Qué hago si necesito transcribir un archivo grande?",
          answer: "Usa la página para archivos grandes con un audio o vídeo local de hasta 1 GB y 1 hora. Mantén abierta la pestaña: un proceso largo puede calentar el dispositivo y tardar bastante. La página mostrará una estimación orientativa después de empezar.",
          link: { href: "/es/transcribir-audios-largos", label: "Transcribir un archivo grande" },
        },
      ],
    },
    footer: "Transcripción en el navegador con procesamiento local",
    schema: {
      features: {
        local: "Transcripción local con Whisper sin subir archivos",
        inputs: "Audio, vídeo, URL directa y grabación por micrófono",
        exports: "Texto editable y exportación TXT, JSON, SRT y VTT",
      },
    },
    history: {
      title: "Transcripciones en este dispositivo",
      search: "Buscar transcripciones guardadas",
      empty: "No hay transcripciones guardadas en este navegador. Elige una grabación para crear la primera.",
      complete: "Transcripción guardada en este navegador",
      copy: "Copiar texto",
      download: "Descargar",
      timeline: "Marcas de tiempo",
      text: "Editar texto",
      editableTranscript: "Transcripción editable",
      noTimestamps: "Esta transcripción no contiene segmentos con marcas de tiempo. Abre la pestaña de texto para revisarla.",
      details: "Detalles de la transcripción",
      model: "Modelo",
      language: "Idioma",
      compute: "Procesamiento",
      delete: "Eliminar transcripción",
      deleteConfirm: "¿Eliminar esta transcripción de este navegador? Esta acción no se puede deshacer.",
    },
  },
  ar: {
    nav: { transcribe: "نسخ", tools: "الأدوات", history: "السجل", guide: "الدليل (بالإنجليزية)" },
    hero: {
      title: "حوّل الصوت إلى نص مجانًا داخل متصفحك.",
      description: "اختر ملفًا صوتيًا أو مرئيًا للحصول على نص قابل للتحرير أو طوابع زمنية أو ترجمة مرئية. يعالج Whisper الملف داخل هذا المتصفح. الحد الأقصى 300 ميغابايت و20 دقيقة.",
      localNote: "دون حساب · دون رفع الملفات إلى Whisper Web · TXT وSRT وVTT وJSON",
    },
    input: {
      workspaceLabel: "مساحة النسخ المحلي",
      dropTitle: "أفلت ملف الوسائط هنا",
      dropHint: "صوت أو فيديو · حتى 300 ميغابايت و20 دقيقة",
      formats: "التنسيقات المدعومة",
      largeFile: {
        prompt: "هل يتجاوز الملف 300 ميغابايت أو 20 دقيقة؟",
        action: "استخدم نسخ الملفات الكبيرة · حتى 1 غيغابايت وساعة واحدة",
      },
      file: "اختر ملفًا",
      url: "ألصق الرابط",
      urlTitle: "ألصق رابطًا مباشرًا لملف الوسائط",
      urlHint: "استخدم رابطًا عامًا يفتح الملف مباشرة دون تسجيل الدخول",
      import: "استيراد",
      record: "تسجيل",
      recordTitle: "سجّل من الميكروفون",
      recordHint: "يبقى الصوت في هذا المتصفح وتتم معالجته على جهازك",
      startRecording: "بدء التسجيل",
      stop: "إيقاف التسجيل",
      model: "النموذج",
      language: "لغة الصوت",
      popularLanguages: "اللغات الأكثر استخدامًا",
      moreLanguages: "لغات أخرى",
      output: "لغة النص",
      originalLanguage: "مطابقة للغة الصوت",
      translateToEnglish: "ترجمة إلى الإنجليزية",
      backend: "المعالجة",
      backendOptions: {
        wasm: "WebAssembly · تنزيل أصغر",
        webgpu: "WebGPU · أسرع على الأجهزة المتوافقة",
        auto: "تلقائي · تجربة WebGPU أولًا",
      },
      modelHints: ["أصغر تنزيل", "توازن بين السرعة والتفاصيل", "تفاصيل أكثر وحمل أكبر على الجهاز"],
      selectedMedia: "الوسائط المحددة",
      readyToStart: "جاهز للنسخ",
      start: "بدء النسخ",
      settingsDialog: {
        eyebrow: "قبل البدء",
        title: "تأكيد إعدادات النسخ",
        description: "راجع هذه الإعدادات قبل أن يبدأ Whisper المعالجة على هذا الجهاز.",
        cancel: "رجوع",
        confirm: "تأكيد وبدء",
      },
      errorDialog: {
        title: "تحقق من رابط ملف الوسائط",
        description: "ألصق رابطًا مباشرًا لملف الصوت أو الفيديو نفسه، وليس صفحة ويب تحتوي على مشغل.",
        exampleLabel: "مثال على الصيغة",
        example: "https://media.example.com/interview.mp3",
        requirements: [
          "يجب أن يفتح دون تسجيل الدخول أو طلب صلاحية الوصول.",
          "يجب أن يكون الملف متاحًا للعامة وأن يسمح الموقع لهذا المتصفح بقراءته.",
          "يجب أن يشير إلى ملف وسائط مدعوم، وليس إلى YouTube أو صفحة معاينة لخدمة تخزين سحابي.",
        ],
        close: "إغلاق",
      },
      resume: "متابعة النسخ",
      pause: "إيقاف مؤقت",
      stopTranscription: "إيقاف",
      pausedHint: "تم الإيقاف مؤقتًا. ستبدأ المتابعة عملية النسخ من البداية.",
      stoppedHint: "تم إيقاف النسخ. ما زالت الوسائط المحددة جاهزة للبدء من جديد.",
      privacyCaption: "تجري المعالجة على هذا الجهاز. يجب أن تفتح الروابط المباشرة دون تسجيل الدخول وأن تسمح لهذا المتصفح بقراءة الملف.",
      warmup: {
        ready: "المحرك المحلي جاهز",
        retry: "حاول مرة أخرى",
        deferred: "سيُحمّل المحرك المحلي عند بدء النسخ",
        preparing: "جارٍ تجهيز المحرك المحلي في الخلفية",
      },
      progress: {
        decoding: "تجهيز الوسائط",
        decodingHint: "فك ترميز الصوت محليًا والتحقق من مدته.",
        loading: "تحميل المحرك المحلي",
        loadingHint: "يُنزل التشغيل الأول النموذج المحدد ويخزنه مؤقتًا في المتصفح.",
        transcribing: "جارٍ النسخ محليًا",
        transcribingHint: "يعالج Whisper الوسائط على هذا الجهاز.",
        saving: "حفظ النص",
        savingHint: "حفظ النتيجة المكتملة في سجل المتصفح المحلي.",
        complete: "اكتمل النسخ",
        completeHint: "النص جاهز. جارٍ فتح النتيجة الآن.",
        paused: "تم إيقاف النسخ مؤقتًا",
        pausedHint: "لا توجد معالجة نشطة. ستبدأ المتابعة من البداية.",
        waitingHints: [
          "قد يستغرق فك ترميز الملفات الكبيرة وقتًا أطول، كما تستغرق التسجيلات الأطول وقتًا أطول للنسخ.",
          "يستخدم النسخ المحلي وحدة المعالجة المركزية أو معالج الرسومات. من الطبيعي أن يزداد استهلاك الطاقة أو تعمل المروحة أو يصبح الجهاز أكثر دفئًا.",
          "أبقِ علامة التبويب مفتوحة، فقد تؤدي قيود العمل في الخلفية إلى إبطاء المعالجة المحلية.",
          "تبقى الوسائط على هذا الجهاز أثناء عمل Whisper.",
        ],
        steps: ["الوسائط", "المحرك", "النسخ", "الحفظ"],
      },
    },
    errors: {
      unsupportedFormat: "تنسيق الملف غير مدعوم. اختر MP3 أو MP4 أو M4A أو WAV أو OGG أو OPUS أو WebM أو AAC أو FLAC.",
      fileTooLarge: "يتجاوز الملف الحد القياسي البالغ 300 ميغابايت. تقبل صفحة الملفات الكبيرة ملفات محلية يصل حجمها إلى 1 غيغابايت.",
      mediaTooLong: "تتجاوز مدة التسجيل الحد القياسي البالغ 20 دقيقة. تقبل صفحة الملفات الكبيرة ملفات تصل مدتها إلى ساعة.",
      selectionFailed: "تعذر اختيار الوسائط. اختر ملفًا آخر وحاول مجددًا.",
      transcriptionFailed: "تعذر نسخ الوسائط. تحقق من التنسيق ثم جرّب نموذجًا أو ملفًا آخر.",
      urlHttp: "أعاد رابط الوسائط حالة HTTP {status}.",
      urlFailed: "تعذر فتح ملف وسائط من هذا الرابط.",
    },
    workflow: ["استيراد", "تعرّف محلي", "تصدير"],
    workflowHeading: "كيف يحوّل Whisper Web تسجيلك إلى نص؟",
    workflowDetails: ["ملف أو رابط مباشر أو ميكروفون", "يعمل Whisper على جهازك", "TXT أو JSON أو SRT أو VTT"],
    trust: {
      title: "ما الذي يبقى على جهازك، وما الذي يحتاج إلى الإنترنت؟",
      description:
        "يبقى ملف الوسائط المحلي والنص النهائي داخل هذا المتصفح. أما الصفحة ونموذج Whisper والروابط المباشرة وخدمات التحليلات فتستخدم اتصال الإنترنت.",
      tableCaption: "كيفية تعامل Whisper Web مع الوسائط والنصوص واتصالات الشبكة",
      tableHeaders: ["سؤالك", "ما الذي يحدث في Whisper Web"],
      tableRows: [
        {
          question: "هل يغادر الملف الذي اخترته هذا الجهاز؟",
          answer: "لا. يفك المتصفح ترميز الملف المحلي وينسخه على هذا الجهاز.",
        },
        {
          question: "أين يُحفظ النص بعد اكتماله؟",
          answer: "في IndexedDB داخل هذا المتصفح إلى أن تصدّره أو تحذفه.",
        },
        {
          question: "لماذا يحتاج نموذج Whisper إلى الإنترنت؟",
          answer: "ينزّل المتصفح النموذج الذي تختاره، ثم يشغّله على هذا الجهاز.",
        },
        {
          question: "ما الذي يُنزَّل عند فتح الصفحة؟",
          answer: "رمز التطبيق والخطوط والملفات الأخرى اللازمة لعرض الموقع.",
        },
        {
          question: "ماذا يحدث عند لصق رابط مباشر؟",
          answer: "يطلب متصفحك ملف الوسائط من الخادم الأصلي، ولذلك يتلقى ذلك الخادم الطلب.",
        },
        {
          question: "ما الذي تستلمه خدمات التحليلات؟",
          answer: "بيانات الصفحة والتفاعل، وليس ملف الوسائط أو تسجيل الميكروفون أو نص التفريغ.",
        },
      ],
      sources: {
        title: "المصادر",
        description:
          "تشرح هذه المراجع تقنيات المتصفح المذكورة في الجدول. ولمعرفة كيفية تعامل Whisper Web مع بياناتك، راجع سياسة الخصوصية.",
        items: [
          { label: "MDN: واجهة IndexedDB", href: "https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API" },
          { label: "MDN: واجهة WebGPU", href: "https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API" },
          { label: "MDN: WebAssembly", href: "https://developer.mozilla.org/en-US/docs/WebAssembly" },
          { label: "Transformers.js: تشغيل النماذج باستخدام WebGPU", href: "https://huggingface.co/docs/transformers.js/en/guides/webgpu" },
          { label: "سياسة الخصوصية في Whisper Web (بالإنجليزية)", href: "/privacy" },
        ],
      },
      points: [
        { title: "دون رفع الوسائط", description: "تُعالج الوسائط على جهازك ولا تُرسل إلى خوادم Whisper Web." },
        { title: "خياران للمعالجة", description: "يمكن أن يكون WebGPU أسرع، بينما يوفر WebAssembly خيارًا أوسع توافقًا." },
        { title: "حرّر النتيجة وصدّرها", description: "صحح النص أو انسخه أو صدّره بصيغة TXT أو JSON أو SRT أو VTT." },
      ],
    },
    faq: {
      title: "أسئلة شائعة عن Whisper Web",
      items: [
        { question: "هل يغادر الملف هذا الجهاز؟", answer: "لا. في الوضع المحلي يقرأ المتصفح الملف ويفك ترميزه في الذاكرة." },
        { question: "لماذا تستغرق أول عملية نسخ وقتًا أطول؟", answer: "يُنزل نموذج Whisper المحدد مرة واحدة ثم يُخزّن مؤقتًا في متصفحك." },
        { question: "ما التنسيقات المدعومة؟", answer: "يدعم Whisper Web تنسيقات شائعة مثل MP3 وWAV وM4A وMP4 وWebM وفق دعم فك الترميز في متصفحك." },
        {
          question: "ما اللغات التي يمكنني نسخها؟",
          answer: "تتضمن قائمة لغة الصوت 99 لغة، منها العربية والإنجليزية والإسبانية والصينية والهندية والفرنسية والألمانية واليابانية والبرتغالية. اختر لغة التسجيل قبل البدء.",
        },
        {
          question: "ماذا أفعل إذا كنت بحاجة إلى نسخ ملف كبير؟",
          answer: "استخدم صفحة الملفات الكبيرة لملف صوتي أو فيديو محلي بحجم يصل إلى 1 غيغابايت ومدته تصل إلى ساعة. اترك علامة التبويب مفتوحة، فقد تستغرق المهمة وقتًا وتؤدي إلى ارتفاع حرارة الجهاز. سيظهر تقدير استرشادي بعد بدء المعالجة.",
          link: { href: "/ar/large-file-transcription", label: "نسخ ملف كبير" },
        },
      ],
    },
    footer: "نسخ داخل المتصفح مع معالجة محلية",
    schema: {
      features: {
        local: "نسخ محلي باستخدام Whisper دون رفع الوسائط",
        inputs: "ملفات الصوت والفيديو والروابط المباشرة والميكروفون",
        exports: "نص قابل للتحرير وتصدير TXT وJSON وSRT وVTT",
      },
    },
    history: {
      title: "النصوص المحفوظة على هذا الجهاز",
      search: "ابحث في النصوص المحفوظة",
      empty: "لا توجد نصوص محفوظة في هذا المتصفح. اختر تسجيلًا لإنشاء أول نص.",
      complete: "حُفظ النص في هذا المتصفح",
      copy: "نسخ النص",
      download: "تنزيل",
      timeline: "الطوابع الزمنية",
      text: "تحرير النص",
      editableTranscript: "نص قابل للتحرير",
      noTimestamps: "لا يحتوي هذا النص على مقاطع ذات طوابع زمنية. افتح علامة تبويب النص لمراجعته.",
      details: "تفاصيل النص",
      model: "النموذج",
      language: "اللغة",
      compute: "المعالجة",
      delete: "حذف النص",
      deleteConfirm: "هل تريد حذف هذا النص من المتصفح؟ لا يمكن التراجع عن هذا الإجراء.",
    },
  },
};

/**
 * 返回语言对应的页面方向。
 */
export function directionForLocale(locale: UiLocale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}
