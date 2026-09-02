import type { ConverterErrorCode } from "@/features/converter/contracts";
import type { UiLocale } from "./ui-copy";

export interface ConverterPageCopy {
  nav: { transcribe: string; tools: string; history: string; guide: string };
  toolsMenu: { label: string; converter: string; largeFile: string };
  eyebrow: string;
  title: string;
  description: string;
  trust: [string, string, string];
  limit: string;
  workspaceLabel: string;
  dropTitle: string;
  dropHint: string;
  chooseFile: string;
  batchNotice: string;
  analyzing: string;
  cancel: string;
  selectedFile: string;
  inputFormat: string;
  fileSize: string;
  duration: string;
  audioDetails: string;
  channels: string;
  sampleRate: string;
  outputName: string;
  bitrateLabel: string;
  bitrateOptions: Record<"128" | "192" | "320", string>;
  start: string;
  retry: string;
  replaceFile: string;
  progressLabel: string;
  converting: string;
  saving: string;
  complete: string;
  cancelled: string;
  download: string;
  convertAnother: string;
  openHistory: string;
  historySaved: string;
  historyNotSaved: string;
  expires: string;
  errors: Record<ConverterErrorCode, string>;
  stepsHeading: string;
  steps: Array<{ title: string; description: string }>;
  limitsHeading: string;
  limits: Array<{ title: string; description: string }>;
  privacyHeading: string;
  privacyBody: string;
  compatibilityHeading: string;
  compatibilityBody: string;
  faqHeading: string;
  faq: Array<{ question: string; answer: string }>;
  relatedHeading: string;
  homeToolTitle: string;
  homeToolBody: string;
  homeToolAction: string;
  transcribeTitle: string;
  transcribeBody: string;
  transcribeAction: string;
  largeFileTitle: string;
  largeFileBody: string;
  largeFileAction: string;
}

export const CONVERTER_PAGE_COPY: Record<UiLocale, ConverterPageCopy> = {
  en: {
    nav: { transcribe: "Transcribe", tools: "Tools", history: "History", guide: "Guide" },
    toolsMenu: { label: "Local media tools", converter: "MP4 to MP3", largeFile: "Large-file transcription" },
    eyebrow: "Local media tool",
    title: "Convert MP4 to MP3 privately in your browser.",
    description: "Extract the main audio track from an MP4, MOV or WebM video. Your media stays on this device while the browser creates the MP3.",
    trust: ["No account", "No media upload", "Processed on this device"],
    limit: "MP4, MOV or WebM · up to 300 MB and 20 minutes",
    workspaceLabel: "Local MP4 to MP3 converter",
    dropTitle: "Drop one video here",
    dropHint: "MP4, MOV or WebM · one file at a time",
    chooseFile: "Choose video",
    batchNotice: "Only the first file was selected. Batch conversion is not available in this version.",
    analyzing: "Reading the video and its main audio track",
    cancel: "Cancel",
    selectedFile: "Selected video",
    inputFormat: "Container",
    fileSize: "File size",
    duration: "Duration",
    audioDetails: "Audio details",
    channels: "Channels",
    sampleRate: "Sample rate",
    outputName: "Output",
    bitrateLabel: "MP3 quality",
    bitrateOptions: { "128": "128 kbps · Smaller file", "192": "192 kbps · Balanced", "320": "320 kbps · Higher quality" },
    start: "Convert to MP3",
    retry: "Try conversion again",
    replaceFile: "Choose another video",
    progressLabel: "Conversion progress",
    converting: "Converting the main audio track on this device",
    saving: "Saving the MP3 to local History",
    complete: "Your MP3 is ready",
    cancelled: "Conversion cancelled. The selected video is still ready to use.",
    download: "Download MP3",
    convertAnother: "Convert another video",
    openHistory: "Open Conversions",
    historySaved: "Saved in this browser for 30 days.",
    historyNotSaved: "The MP3 is ready but could not be saved to History. Download it now, or clear local history and convert again.",
    expires: "Deletes from this browser on {date}.",
    errors: {
      empty_file: "This file is empty. Choose a valid MP4, MOV or WebM video.",
      unsupported_extension: "Choose an MP4, MOV or WebM video.",
      file_too_large: "This video exceeds the 300 MB local limit.",
      unreadable_container: "This video could not be read. Re-export it or choose another file.",
      container_mismatch: "The file extension does not match the video container. Re-export the file before trying again.",
      no_audio_track: "No extractable audio track was found in this video.",
      duration_too_long: "This video exceeds the 20-minute local limit.",
      unsupported_audio_codec: "This browser cannot decode the video's main audio track. Try another browser or re-export the video.",
      encoder_load_failed: "The local MP3 engine could not be prepared. Check the connection needed to load the app, then try again.",
      conversion_failed: "The video could not be converted to MP3. Keep the selected file and try again.",
      cancelled: "Conversion cancelled.",
    },
    stepsHeading: "How to convert MP4 to MP3",
    steps: [
      { title: "Choose one video", description: "Select an MP4, MOV or WebM file from this device." },
      { title: "Pick the MP3 quality", description: "Use 192 kbps for a balanced default, or choose 128 or 320 kbps." },
      { title: "Download the MP3", description: "The browser extracts the main audio track and keeps the result locally for 30 days." },
    ],
    limitsHeading: "Formats, quality and limits",
    limits: [
      { title: "Input", description: "MP4, MOV and WebM containers with an audio track this browser can decode." },
      { title: "Output", description: "One MP3 at a fixed 128, 192 or 320 kbps. No trimming or audio enhancement." },
      { title: "Limits", description: "One local file, up to 300 MiB and 20 minutes. The main audio track is used." },
    ],
    privacyHeading: "The video is processed locally",
    privacyBody: "The source video, decoded audio and MP3 are not uploaded to a Whisper Web application server. The page and MP3 engine still need to be downloaded, so this is not a promise of complete offline use.",
    compatibilityHeading: "Container support does not guarantee every codec",
    compatibilityBody: "MP4, MOV and WebM can contain different audio codecs. The converter checks the real container and main audio track before it starts. If this browser cannot decode that track, re-export the video or try another current browser.",
    faqHeading: "MP4 to MP3 questions",
    faq: [
      { question: "Does Whisper Web upload my video?", answer: "No. A local file is read and converted in this browser. Ordinary requests are still made to load the website, analytics and the MP3 engine." },
      { question: "Which MP3 quality should I choose?", answer: "192 kbps is the balanced default. Choose 128 kbps for a smaller file or 320 kbps when a larger file is acceptable." },
      { question: "Can I choose a different audio track?", answer: "Not in this version. The converter uses the video's main audio track and downmixes audio above two channels to stereo." },
      { question: "Why can a supported video still fail?", answer: "A supported container may contain an audio codec your browser cannot decode, or the file may be damaged or incorrectly named." },
      { question: "How long is the MP3 kept?", answer: "A successfully saved MP3 stays in this browser for 30 days, unless the browser or user clears site data sooner. Download files you want to keep." },
    ],
    relatedHeading: "Related local tools",
    homeToolTitle: "Only need the audio, not a transcript?",
    homeToolBody: "Extract the main audio track from an MP4, MOV or WebM video and download it as an MP3 without uploading the video.",
    homeToolAction: "Open MP4 to MP3",
    transcribeTitle: "Need text instead of audio?",
    transcribeBody: "Use Whisper Web to turn the same kind of local video into editable text, timestamps or subtitles.",
    transcribeAction: "Transcribe this video",
    largeFileTitle: "Need to transcribe a larger recording?",
    largeFileBody: "The large-file workflow handles local media up to 1 GB and one hour in sequential sections.",
    largeFileAction: "Open large-file transcription",
  },
  es: {
    nav: { transcribe: "Transcribir", tools: "Herramientas", history: "Historial", guide: "Guía" },
    toolsMenu: { label: "Herramientas multimedia locales", converter: "MP4 a MP3", largeFile: "Transcripción de archivos grandes" },
    eyebrow: "Herramienta multimedia local",
    title: "Convierte MP4 a MP3 de forma privada en tu navegador.",
    description: "Extrae la pista de audio principal de un vídeo MP4, MOV o WebM. El archivo permanece en este dispositivo mientras el navegador crea el MP3.",
    trust: ["Sin cuenta", "Sin subir el vídeo", "Procesado en este dispositivo"],
    limit: "MP4, MOV o WebM · hasta 300 MB y 20 minutos",
    workspaceLabel: "Conversor local de MP4 a MP3",
    dropTitle: "Suelta un vídeo aquí",
    dropHint: "MP4, MOV o WebM · un archivo cada vez",
    chooseFile: "Elegir vídeo",
    batchNotice: "Solo se seleccionó el primer archivo. Esta versión no permite conversiones por lotes.",
    analyzing: "Leyendo el vídeo y su pista de audio principal",
    cancel: "Cancelar",
    selectedFile: "Vídeo seleccionado",
    inputFormat: "Contenedor",
    fileSize: "Tamaño",
    duration: "Duración",
    audioDetails: "Detalles de audio",
    channels: "Canales",
    sampleRate: "Frecuencia de muestreo",
    outputName: "Salida",
    bitrateLabel: "Calidad del MP3",
    bitrateOptions: { "128": "128 kbps · Archivo más pequeño", "192": "192 kbps · Equilibrado", "320": "320 kbps · Mayor calidad" },
    start: "Convertir a MP3",
    retry: "Reintentar la conversión",
    replaceFile: "Elegir otro vídeo",
    progressLabel: "Progreso de la conversión",
    converting: "Convirtiendo la pista de audio principal en este dispositivo",
    saving: "Guardando el MP3 en el historial local",
    complete: "Tu MP3 está listo",
    cancelled: "Conversión cancelada. El vídeo seleccionado sigue listo.",
    download: "Descargar MP3",
    convertAnother: "Convertir otro vídeo",
    openHistory: "Abrir Conversiones",
    historySaved: "Guardado en este navegador durante 30 días.",
    historyNotSaved: "El MP3 está listo, pero no se pudo guardar en el historial. Descárgalo ahora o limpia el historial local y vuelve a convertirlo.",
    expires: "Se eliminará de este navegador el {date}.",
    errors: {
      empty_file: "El archivo está vacío. Elige un vídeo MP4, MOV o WebM válido.",
      unsupported_extension: "Elige un vídeo MP4, MOV o WebM.",
      file_too_large: "El vídeo supera el límite local de 300 MB.",
      unreadable_container: "No se pudo leer el vídeo. Vuelve a exportarlo o elige otro archivo.",
      container_mismatch: "La extensión no coincide con el contenedor real. Vuelve a exportar el archivo.",
      no_audio_track: "No se encontró una pista de audio que se pueda extraer.",
      duration_too_long: "El vídeo supera el límite local de 20 minutos.",
      unsupported_audio_codec: "Este navegador no puede decodificar la pista principal. Prueba otro navegador o vuelve a exportar el vídeo.",
      encoder_load_failed: "No se pudo preparar el motor MP3 local. Comprueba la conexión necesaria para cargar la aplicación e inténtalo de nuevo.",
      conversion_failed: "No se pudo convertir el vídeo a MP3. Conserva el archivo seleccionado y vuelve a intentarlo.",
      cancelled: "Conversión cancelada.",
    },
    stepsHeading: "Cómo convertir MP4 a MP3",
    steps: [
      { title: "Elige un vídeo", description: "Selecciona un archivo MP4, MOV o WebM de este dispositivo." },
      { title: "Elige la calidad", description: "Usa 192 kbps como opción equilibrada o selecciona 128 o 320 kbps." },
      { title: "Descarga el MP3", description: "El navegador extrae el audio principal y guarda el resultado localmente durante 30 días." },
    ],
    limitsHeading: "Formatos, calidad y límites",
    limits: [
      { title: "Entrada", description: "MP4, MOV y WebM con una pista de audio que este navegador pueda decodificar." },
      { title: "Salida", description: "Un MP3 a 128, 192 o 320 kbps fijos, sin recorte ni mejora de audio." },
      { title: "Límites", description: "Un archivo local de hasta 300 MiB y 20 minutos; se usa la pista principal." },
    ],
    privacyHeading: "El vídeo se procesa localmente",
    privacyBody: "El vídeo, el audio decodificado y el MP3 no se envían a un servidor de Whisper Web. La página y el motor MP3 deben descargarse, por lo que no prometemos un uso totalmente sin conexión.",
    compatibilityHeading: "El contenedor no garantiza todos los códecs",
    compatibilityBody: "MP4, MOV y WebM pueden contener distintos códecs. El conversor comprueba el contenedor y la pista principal antes de empezar. Si el navegador no puede decodificarla, vuelve a exportar el vídeo o prueba otro navegador actualizado.",
    faqHeading: "Preguntas sobre MP4 a MP3",
    faq: [
      { question: "¿Whisper Web sube mi vídeo?", answer: "No. El archivo local se lee y convierte en este navegador. Aun así, hay solicitudes normales para cargar la web, las estadísticas y el motor MP3." },
      { question: "¿Qué calidad MP3 debo elegir?", answer: "192 kbps es la opción equilibrada. Elige 128 kbps para reducir el tamaño o 320 kbps si aceptas un archivo mayor." },
      { question: "¿Puedo elegir otra pista de audio?", answer: "No en esta versión. Se usa la pista principal y el audio de más de dos canales se mezcla a estéreo." },
      { question: "¿Por qué puede fallar un vídeo compatible?", answer: "El contenedor puede incluir un códec que el navegador no decodifica, o el archivo puede estar dañado o tener una extensión incorrecta." },
      { question: "¿Cuánto tiempo se conserva el MP3?", answer: "Un MP3 guardado permanece 30 días en este navegador, salvo que el navegador o el usuario borre antes los datos. Descarga lo que quieras conservar." },
    ],
    relatedHeading: "Herramientas locales relacionadas",
    homeToolTitle: "¿Solo necesitas el audio y no una transcripción?",
    homeToolBody: "Extrae el audio principal de un vídeo MP4, MOV o WebM y descárgalo como MP3 sin subir el vídeo.",
    homeToolAction: "Abrir MP4 a MP3",
    transcribeTitle: "¿Necesitas texto en lugar de audio?",
    transcribeBody: "Usa Whisper Web para convertir un vídeo local en texto editable, marcas de tiempo o subtítulos.",
    transcribeAction: "Transcribir este vídeo",
    largeFileTitle: "¿Necesitas transcribir una grabación mayor?",
    largeFileBody: "El flujo para archivos grandes procesa medios locales de hasta 1 GB y una hora por secciones.",
    largeFileAction: "Abrir transcripción de archivos grandes",
  },
  ar: {
    nav: { transcribe: "نسخ", tools: "الأدوات", history: "السجل", guide: "الدليل" },
    toolsMenu: { label: "أدوات الوسائط المحلية", converter: "MP4 إلى MP3", largeFile: "نسخ الملفات الكبيرة" },
    eyebrow: "أداة وسائط محلية",
    title: "حوّل MP4 إلى MP3 بخصوصية في متصفحك.",
    description: "استخرج المسار الصوتي الرئيسي من فيديو MP4 أو MOV أو WebM. يبقى الملف على هذا الجهاز بينما ينشئ المتصفح ملف MP3.",
    trust: ["من دون حساب", "من دون رفع الوسائط", "المعالجة على هذا الجهاز"],
    limit: "MP4 أو MOV أو WebM · حتى 300 MB و20 دقيقة",
    workspaceLabel: "محول MP4 إلى MP3 محلي",
    dropTitle: "أفلت فيديو واحدًا هنا",
    dropHint: "MP4 أو MOV أو WebM · ملف واحد في كل مرة",
    chooseFile: "اختيار فيديو",
    batchNotice: "تم اختيار الملف الأول فقط. التحويل الدفعي غير متاح في هذا الإصدار.",
    analyzing: "جارٍ قراءة الفيديو ومساره الصوتي الرئيسي",
    cancel: "إلغاء",
    selectedFile: "الفيديو المحدد",
    inputFormat: "الحاوية",
    fileSize: "حجم الملف",
    duration: "المدة",
    audioDetails: "تفاصيل الصوت",
    channels: "القنوات",
    sampleRate: "معدل أخذ العينات",
    outputName: "ملف الإخراج",
    bitrateLabel: "جودة MP3",
    bitrateOptions: { "128": "128 kbps · ملف أصغر", "192": "192 kbps · متوازن", "320": "320 kbps · جودة أعلى" },
    start: "التحويل إلى MP3",
    retry: "إعادة محاولة التحويل",
    replaceFile: "اختيار فيديو آخر",
    progressLabel: "تقدم التحويل",
    converting: "جارٍ تحويل المسار الصوتي الرئيسي على هذا الجهاز",
    saving: "جارٍ حفظ MP3 في السجل المحلي",
    complete: "ملف MP3 جاهز",
    cancelled: "أُلغي التحويل. ما زال الفيديو المحدد جاهزًا.",
    download: "تنزيل MP3",
    convertAnother: "تحويل فيديو آخر",
    openHistory: "فتح التحويلات",
    historySaved: "محفوظ في هذا المتصفح لمدة 30 يومًا.",
    historyNotSaved: "ملف MP3 جاهز، لكن تعذر حفظه في السجل. نزّله الآن أو امسح السجل المحلي ثم أعد التحويل.",
    expires: "سيُحذف من هذا المتصفح في {date}.",
    errors: {
      empty_file: "الملف فارغ. اختر فيديو MP4 أو MOV أو WebM صالحًا.",
      unsupported_extension: "اختر فيديو MP4 أو MOV أو WebM.",
      file_too_large: "يتجاوز الفيديو الحد المحلي البالغ 300 MB.",
      unreadable_container: "تعذرت قراءة الفيديو. أعد تصديره أو اختر ملفًا آخر.",
      container_mismatch: "امتداد الملف لا يطابق حاوية الفيديو. أعد تصدير الملف قبل المحاولة.",
      no_audio_track: "لم يُعثر على مسار صوتي قابل للاستخراج.",
      duration_too_long: "يتجاوز الفيديو الحد المحلي البالغ 20 دقيقة.",
      unsupported_audio_codec: "لا يستطيع هذا المتصفح فك ترميز المسار الصوتي الرئيسي. جرّب متصفحًا آخر أو أعد تصدير الفيديو.",
      encoder_load_failed: "تعذر تجهيز محرك MP3 المحلي. تحقق من الاتصال اللازم لتحميل التطبيق ثم أعد المحاولة.",
      conversion_failed: "تعذر تحويل الفيديو إلى MP3. أبقِ الملف محددًا وحاول مرة أخرى.",
      cancelled: "أُلغي التحويل.",
    },
    stepsHeading: "كيفية تحويل MP4 إلى MP3",
    steps: [
      { title: "اختر فيديو واحدًا", description: "حدد ملف MP4 أو MOV أو WebM من هذا الجهاز." },
      { title: "اختر جودة MP3", description: "استخدم 192 kbps كخيار متوازن، أو اختر 128 أو 320 kbps." },
      { title: "نزّل ملف MP3", description: "يستخرج المتصفح الصوت الرئيسي ويحفظ النتيجة محليًا لمدة 30 يومًا." },
    ],
    limitsHeading: "الصيغ والجودة والحدود",
    limits: [
      { title: "الإدخال", description: "حاويات MP4 وMOV وWebM بمسار صوتي يستطيع المتصفح فك ترميزه." },
      { title: "الإخراج", description: "ملف MP3 واحد بمعدل ثابت 128 أو 192 أو 320 kbps، بلا قص أو تحسين صوتي." },
      { title: "الحدود", description: "ملف محلي واحد حتى 300 MiB و20 دقيقة؛ يُستخدم المسار الرئيسي." },
    ],
    privacyHeading: "تتم معالجة الفيديو محليًا",
    privacyBody: "لا يُرسل الفيديو أو الصوت المفكوك أو MP3 إلى خادم تطبيق Whisper Web. يلزم تنزيل الصفحة ومحرك MP3، لذلك لا ندّعي أن الاستخدام دون اتصال بالكامل.",
    compatibilityHeading: "دعم الحاوية لا يعني دعم كل برامج الترميز",
    compatibilityBody: "قد تحتوي MP4 وMOV وWebM على برامج ترميز مختلفة. يفحص المحول الحاوية والمسار الرئيسي قبل البدء. إذا تعذر فك المسار، أعد تصدير الفيديو أو جرّب متصفحًا حديثًا آخر.",
    faqHeading: "أسئلة تحويل MP4 إلى MP3",
    faq: [
      { question: "هل يرفع Whisper Web الفيديو؟", answer: "لا. يُقرأ الملف المحلي ويُحوّل في هذا المتصفح. تبقى هناك طلبات عادية لتحميل الموقع والإحصاءات ومحرك MP3." },
      { question: "أي جودة MP3 أختار؟", answer: "192 kbps هو الخيار المتوازن. اختر 128 kbps لملف أصغر أو 320 kbps إذا كان الحجم الأكبر مقبولًا." },
      { question: "هل يمكنني اختيار مسار صوتي آخر؟", answer: "ليس في هذا الإصدار. يُستخدم المسار الرئيسي، وتُمزج القنوات التي تزيد على اثنتين إلى ستيريو." },
      { question: "لماذا قد يفشل فيديو بصيغة مدعومة؟", answer: "قد تحتوي الحاوية على ترميز صوتي لا يفكه المتصفح، أو قد يكون الملف تالفًا أو ذا امتداد غير صحيح." },
      { question: "كم تبقى ملفات MP3؟", answer: "يبقى الملف المحفوظ 30 يومًا في هذا المتصفح، ما لم يمسح المتصفح أو المستخدم بيانات الموقع قبل ذلك. نزّل ما تريد الاحتفاظ به." },
    ],
    relatedHeading: "أدوات محلية ذات صلة",
    homeToolTitle: "هل تحتاج إلى الصوت فقط بدلًا من النص؟",
    homeToolBody: "استخرج المسار الصوتي الرئيسي من فيديو MP4 أو MOV أو WebM ونزّله بصيغة MP3 من دون رفع الفيديو.",
    homeToolAction: "فتح MP4 إلى MP3",
    transcribeTitle: "هل تحتاج إلى نص بدلًا من الصوت؟",
    transcribeBody: "استخدم Whisper Web لتحويل فيديو محلي إلى نص قابل للتحرير أو طوابع زمنية أو ترجمة نصية.",
    transcribeAction: "نسخ هذا الفيديو",
    largeFileTitle: "هل تريد نسخ تسجيل أكبر؟",
    largeFileBody: "يعالج مسار الملفات الكبيرة وسائط محلية حتى 1 GB وساعة واحدة على أجزاء متتابعة.",
    largeFileAction: "فتح نسخ الملفات الكبيرة",
  },
};
