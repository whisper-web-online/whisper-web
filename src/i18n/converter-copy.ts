import type { UiLocale } from "./ui-copy";

export interface ConverterHistoryCopy {
  tabsLabel: string;
  transcriptsTab: string;
  conversionsTab: string;
  title: string;
  search: string;
  emptyTitle: string;
  empty: string;
  storageNotice: string;
  complete: string;
  download: string;
  delete: string;
  deleteConfirm: string;
  details: string;
  bitrate: string;
  format: string;
  size: string;
  duration: string;
  created: string;
  expires: string;
  expiresWithinDay: string;
  expiresInDays: string;
  loadFailed: string;
}

export const CONVERTER_HISTORY_COPY: Record<UiLocale, ConverterHistoryCopy> = {
  en: {
    tabsLabel: "History type",
    transcriptsTab: "Transcripts",
    conversionsTab: "Conversions",
    title: "Conversions",
    search: "Search MP3 files",
    emptyTitle: "No converted audio yet",
    empty: "Convert a video to see its MP3 here.",
    storageNotice: "MP3 files stay in this browser for 30 days. Download anything you want to keep.",
    complete: "MP3 ready",
    download: "Download MP3",
    delete: "Delete conversion",
    deleteConfirm: "Delete this MP3 from local history? This cannot be undone.",
    details: "Conversion details",
    bitrate: "Bitrate",
    format: "Input",
    size: "MP3 size",
    duration: "Duration",
    created: "Created",
    expires: "Expires",
    expiresWithinDay: "Deletes within 24 hours",
    expiresInDays: "Deletes in {days} days",
    loadFailed: "Local conversion history could not be opened.",
  },
  es: {
    tabsLabel: "Tipo de historial",
    transcriptsTab: "Transcripciones",
    conversionsTab: "Conversiones",
    title: "Conversiones",
    search: "Buscar archivos MP3",
    emptyTitle: "Aún no hay audios convertidos",
    empty: "Convierte un vídeo para ver su MP3 aquí.",
    storageNotice: "Los MP3 permanecen en este navegador durante 30 días. Descarga lo que quieras conservar.",
    complete: "MP3 listo",
    download: "Descargar MP3",
    delete: "Eliminar conversión",
    deleteConfirm: "¿Eliminar este MP3 del historial local? Esta acción no se puede deshacer.",
    details: "Detalles de la conversión",
    bitrate: "Tasa de bits",
    format: "Entrada",
    size: "Tamaño del MP3",
    duration: "Duración",
    created: "Creado",
    expires: "Caduca",
    expiresWithinDay: "Se eliminará en menos de 24 horas",
    expiresInDays: "Se eliminará en {days} días",
    loadFailed: "No se pudo abrir el historial local de conversiones.",
  },
  ar: {
    tabsLabel: "نوع السجل",
    transcriptsTab: "النصوص",
    conversionsTab: "التحويلات",
    title: "التحويلات",
    search: "البحث في ملفات MP3",
    emptyTitle: "لا توجد ملفات صوت محوّلة بعد",
    empty: "حوّل فيديو ليظهر ملف MP3 هنا.",
    storageNotice: "تبقى ملفات MP3 في هذا المتصفح لمدة 30 يومًا. نزّل أي ملف تريد الاحتفاظ به.",
    complete: "ملف MP3 جاهز",
    download: "تنزيل MP3",
    delete: "حذف التحويل",
    deleteConfirm: "هل تريد حذف ملف MP3 هذا من السجل المحلي؟ لا يمكن التراجع عن ذلك.",
    details: "تفاصيل التحويل",
    bitrate: "معدل البت",
    format: "الإدخال",
    size: "حجم MP3",
    duration: "المدة",
    created: "تاريخ الإنشاء",
    expires: "تاريخ الحذف",
    expiresWithinDay: "سيُحذف خلال 24 ساعة",
    expiresInDays: "سيُحذف خلال {days} أيام",
    loadFailed: "تعذر فتح سجل التحويلات المحلي.",
  },
};
