import type { ModelId } from "./contracts";

export const MODEL_OPTIONS: ReadonlyArray<{
  id: ModelId;
  label: string;
  hint: string;
}> = [
  {
    id: "onnx-community/whisper-tiny",
    label: "Whisper Tiny",
    hint: "Fastest · recommended",
  },
  {
    id: "onnx-community/whisper-base",
    label: "Whisper Base",
    hint: "Balanced",
  },
  {
    id: "onnx-community/whisper-small",
    label: "Whisper Small",
    hint: "More accurate · heavier",
  },
];

export const POPULAR_LANGUAGE_OPTIONS = [
  { value: "en", fallbackLabel: "English" },
  { value: "zh", fallbackLabel: "Chinese" },
  { value: "es", fallbackLabel: "Spanish" },
  { value: "ar", fallbackLabel: "Arabic" },
  { value: "hi", fallbackLabel: "Hindi" },
  { value: "pt", fallbackLabel: "Portuguese" },
  { value: "fr", fallbackLabel: "French" },
  { value: "de", fallbackLabel: "German" },
  { value: "ja", fallbackLabel: "Japanese" },
  { value: "ko", fallbackLabel: "Korean" },
  { value: "ru", fallbackLabel: "Russian" },
  { value: "id", fallbackLabel: "Indonesian" },
  { value: "tr", fallbackLabel: "Turkish" },
  { value: "vi", fallbackLabel: "Vietnamese" },
  { value: "it", fallbackLabel: "Italian" },
] as const;

export const ADDITIONAL_LANGUAGE_OPTIONS = [
  { value: "af", fallbackLabel: "Afrikaans" },
  { value: "sq", fallbackLabel: "Albanian" },
  { value: "am", fallbackLabel: "Amharic" },
  { value: "hy", fallbackLabel: "Armenian" },
  { value: "as", fallbackLabel: "Assamese" },
  { value: "az", fallbackLabel: "Azerbaijani" },
  { value: "bn", fallbackLabel: "Bangla" },
  { value: "ba", fallbackLabel: "Bashkir" },
  { value: "eu", fallbackLabel: "Basque" },
  { value: "be", fallbackLabel: "Belarusian" },
  { value: "bs", fallbackLabel: "Bosnian" },
  { value: "br", fallbackLabel: "Breton" },
  { value: "bg", fallbackLabel: "Bulgarian" },
  { value: "my", fallbackLabel: "Burmese" },
  { value: "ca", fallbackLabel: "Catalan" },
  { value: "hr", fallbackLabel: "Croatian" },
  { value: "cs", fallbackLabel: "Czech" },
  { value: "da", fallbackLabel: "Danish" },
  { value: "nl", fallbackLabel: "Dutch" },
  { value: "et", fallbackLabel: "Estonian" },
  { value: "fo", fallbackLabel: "Faroese" },
  { value: "tl", fallbackLabel: "Filipino" },
  { value: "fi", fallbackLabel: "Finnish" },
  { value: "gl", fallbackLabel: "Galician" },
  { value: "ka", fallbackLabel: "Georgian" },
  { value: "el", fallbackLabel: "Greek" },
  { value: "gu", fallbackLabel: "Gujarati" },
  { value: "ht", fallbackLabel: "Haitian Creole" },
  { value: "ha", fallbackLabel: "Hausa" },
  { value: "haw", fallbackLabel: "Hawaiian" },
  { value: "he", fallbackLabel: "Hebrew" },
  { value: "hu", fallbackLabel: "Hungarian" },
  { value: "is", fallbackLabel: "Icelandic" },
  { value: "jw", fallbackLabel: "Javanese" },
  { value: "kn", fallbackLabel: "Kannada" },
  { value: "kk", fallbackLabel: "Kazakh" },
  { value: "km", fallbackLabel: "Khmer" },
  { value: "lo", fallbackLabel: "Lao" },
  { value: "la", fallbackLabel: "Latin" },
  { value: "lv", fallbackLabel: "Latvian" },
  { value: "ln", fallbackLabel: "Lingala" },
  { value: "lt", fallbackLabel: "Lithuanian" },
  { value: "lb", fallbackLabel: "Luxembourgish" },
  { value: "mk", fallbackLabel: "Macedonian" },
  { value: "mg", fallbackLabel: "Malagasy" },
  { value: "ms", fallbackLabel: "Malay" },
  { value: "ml", fallbackLabel: "Malayalam" },
  { value: "mt", fallbackLabel: "Maltese" },
  { value: "mi", fallbackLabel: "Māori" },
  { value: "mr", fallbackLabel: "Marathi" },
  { value: "mn", fallbackLabel: "Mongolian" },
  { value: "ne", fallbackLabel: "Nepali" },
  { value: "no", fallbackLabel: "Norwegian" },
  { value: "nn", fallbackLabel: "Norwegian Nynorsk" },
  { value: "oc", fallbackLabel: "Occitan" },
  { value: "ps", fallbackLabel: "Pashto" },
  { value: "fa", fallbackLabel: "Persian" },
  { value: "pl", fallbackLabel: "Polish" },
  { value: "pa", fallbackLabel: "Punjabi" },
  { value: "ro", fallbackLabel: "Romanian" },
  { value: "sa", fallbackLabel: "Sanskrit" },
  { value: "sr", fallbackLabel: "Serbian" },
  { value: "sn", fallbackLabel: "Shona" },
  { value: "sd", fallbackLabel: "Sindhi" },
  { value: "si", fallbackLabel: "Sinhala" },
  { value: "sk", fallbackLabel: "Slovak" },
  { value: "sl", fallbackLabel: "Slovenian" },
  { value: "so", fallbackLabel: "Somali" },
  { value: "su", fallbackLabel: "Sundanese" },
  { value: "sw", fallbackLabel: "Swahili" },
  { value: "sv", fallbackLabel: "Swedish" },
  { value: "tg", fallbackLabel: "Tajik" },
  { value: "ta", fallbackLabel: "Tamil" },
  { value: "tt", fallbackLabel: "Tatar" },
  { value: "te", fallbackLabel: "Telugu" },
  { value: "th", fallbackLabel: "Thai" },
  { value: "bo", fallbackLabel: "Tibetan" },
  { value: "tk", fallbackLabel: "Turkmen" },
  { value: "uk", fallbackLabel: "Ukrainian" },
  { value: "ur", fallbackLabel: "Urdu" },
  { value: "uz", fallbackLabel: "Uzbek" },
  { value: "cy", fallbackLabel: "Welsh" },
  { value: "yi", fallbackLabel: "Yiddish" },
  { value: "yo", fallbackLabel: "Yoruba" },
] as const;

export const LANGUAGE_OPTIONS = [
  ...POPULAR_LANGUAGE_OPTIONS,
  ...ADDITIONAL_LANGUAGE_OPTIONS,
] as const;

export const DEFAULT_SETTINGS = {
  model: "onnx-community/whisper-tiny",
  language: "en",
  task: "transcribe",
  backend: "wasm",
} as const;

export const FREE_FILE_LIMIT_BYTES = 300 * 1024 * 1024;
export const FREE_DURATION_LIMIT_SECONDS = 20 * 60;
export const LARGE_FILE_LIMIT_BYTES = 1024 * 1024 * 1024;
export const LARGE_DURATION_LIMIT_SECONDS = 60 * 60;
export const LARGE_SEGMENT_CORE_SECONDS = 5 * 60;
export const LARGE_SEGMENT_CONTEXT_SECONDS = 5;

export const SUPPORTED_MEDIA_FORMATS = [
  { extension: "mp3", label: "MP3" },
  { extension: "mp4", label: "MP4" },
  { extension: "m4a", label: "M4A" },
  { extension: "wav", label: "WAV" },
  { extension: "ogg", label: "OGG" },
  { extension: "opus", label: "OPUS" },
  { extension: "webm", label: "WebM" },
  { extension: "aac", label: "AAC" },
  { extension: "flac", label: "FLAC" },
] as const;

export const SUPPORTED_MEDIA_ACCEPT = SUPPORTED_MEDIA_FORMATS
  .map(({ extension }) => `.${extension}`)
  .join(",");
