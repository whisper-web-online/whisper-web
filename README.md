# Whisper Web

Whisper Web is an open-source speech-to-text application that runs Whisper locally in the browser. Media decoding, model inference, transcript editing, transcription history, and MP3 conversion all happen on the user's device.

Website: [whisperwebfree.com](https://whisperwebfree.com)

Maintained by: [Whisper Web on GitHub](https://github.com/whisper-web-online)

## Features

- Import local audio or video files, microphone recordings, or CORS-enabled direct media URLs
- Transcribe locally with Whisper Tiny, Base, or Small models
- Run inference with WebAssembly or WebGPU
- Use the interface in English, Spanish, or Arabic
- Save, search, and edit local history in browser IndexedDB
- Export transcripts as TXT, JSON, SRT, or VTT
- Convert the primary audio track of a local MP4, MOV, or WebM file to MP3 in the browser
- Process large local files through a dedicated segmented transcription workflow

## Privacy boundaries

- Local files, microphone recordings, transcripts, and converted MP3 files are not uploaded to a Whisper Web application server.
- The browser still needs network access to download application assets, Whisper models, and MP3 encoding components.
- When a direct media URL is used, the browser requests the file directly from the third-party media host.
- The Product Hunt footer badge is loaded lazily from Product Hunt with a no-referrer policy; the request does not contain local media, filenames, transcripts, or converted MP3 files.
- The open-source build includes no analytics project IDs. Analytics scripts are not loaded unless the corresponding environment variables are configured.
- If a deployment enables Microsoft Clarity, the root document masks page content to prevent file names and transcript text from appearing in session recordings.

## Run locally

Requirements: Node.js 22+ and pnpm 10.

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Verify and build

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

Run all checks with one command:

```bash
pnpm verify
```

The project uses Next.js static export and writes the production output to `out/`. Production builds use Webpack because the current Transformers.js Worker loading path is not compatible with the default Turbopack build.

## Optional analytics

All analytics services are disabled by default. Copy the example configuration and add only project identifiers that you control:

```bash
cp .env.example .env.local
```

Supported variables:

```dotenv
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=
NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL=
NEXT_PUBLIC_CLARITY_PROJECT_ID=
```

These values are included in the browser build. Use them only for public project identifiers, never for API tokens, passwords, or private keys.

## Models and third-party software

This repository does not include Whisper model weights. After a user selects a model, the browser downloads the corresponding ONNX files from Hugging Face. See [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) for dependency licenses and sources.

## Security

Do not post secrets, private recordings, or transcript content in public issues. Follow [SECURITY.md](./SECURITY.md) to report security issues privately.

## License

Original Whisper Web source code is available under the [MIT License](./LICENSE). Third-party components and models remain subject to their respective licenses.
