import { ArrowRight, Browser, Cpu, Database, LockKey, Waveform } from "@phosphor-icons/react/dist/ssr";
import { UI_COPY } from "@/i18n/ui-copy";
import { SEO_PAGES } from "@/lib/seo/site";
import { ArticleByline } from "./article-byline";
import { PublicHeader } from "./public-header";
import { SiteFooter } from "./site-footer";

/**
 * 渲染 speech recognition 的定义、处理流程、比较、边界和常见问题。
 */
export function SpeechRecognitionGuide() {
  return (
    <div className="sonora-app">
      <PublicHeader active="guide" />
      <main className="speech-guide">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <a href={SEO_PAGES.home.path}>Whisper Web</a>
          <span aria-hidden="true">/</span>
          <span>Speech Recognition</span>
        </nav>

        <header className="guide-hero">
          <span className="guide-eyebrow">Local browser guide</span>
          <h1>Speech recognition in the browser: how local processing works</h1>
          <p>
            Speech recognition converts spoken audio into written text. In Whisper Web, the browser decodes
            the media, runs a Whisper model on the device and stores the finished transcript locally.
          </p>
          <ArticleByline page={SEO_PAGES.speechRecognition} />
          <a className="guide-cta" href={SEO_PAGES.home.path}>
            Choose an audio or video file <ArrowRight aria-hidden="true" />
          </a>
        </header>

        <section className="guide-section" aria-labelledby="local-pipeline-heading">
          <div className="guide-section-heading">
            <span>01</span>
            <div>
              <h2 id="local-pipeline-heading">How does local speech recognition work?</h2>
              <p>You choose the media, the browser runs Whisper, and you review the transcript on the same device.</p>
            </div>
          </div>
          <ol className="guide-process">
            <li>
              <Browser aria-hidden="true" />
              <h3>Decode the media</h3>
              <p>The browser reads a file, microphone recording or publicly accessible direct media URL and converts it to audio samples.</p>
            </li>
            <li>
              <Cpu aria-hidden="true" />
              <h3>Run Whisper locally</h3>
              <p>A Web Worker runs the selected Tiny, Base or Small model through WebAssembly or WebGPU.</p>
            </li>
            <li>
              <Database aria-hidden="true" />
              <h3>Keep the transcript local</h3>
              <p>The editable text and timestamps stay in IndexedDB until you export or delete the record.</p>
            </li>
          </ol>
          <aside className="editorial-sources guide-sources" aria-label="Sources for local speech recognition">
            <strong>Sources</strong>
            <ul>
              <li><a href="https://huggingface.co/docs/transformers.js/en/guides/webgpu">Transformers.js: Running models on WebGPU</a></li>
              <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API">MDN: IndexedDB API</a></li>
            </ul>
          </aside>
        </section>

        <section className="guide-section" aria-labelledby="comparison-heading">
          <div className="guide-section-heading">
            <span>02</span>
            <div>
              <h2 id="comparison-heading">How does local speech recognition compare with cloud processing?</h2>
              <p>Start with where the audio goes, who provides the compute and how you want to share the result.</p>
            </div>
          </div>
          <div className="guide-table-wrap">
            <table>
              <caption>Local browser and typical cloud speech recognition compared</caption>
              <thead>
                <tr><th scope="col">Question</th><th scope="col">Whisper Web local mode</th><th scope="col">Typical cloud service</th></tr>
              </thead>
              <tbody>
                <tr><th scope="row">Where is audio processed?</th><td>On the current device</td><td>On a remote server</td></tr>
                <tr><th scope="row">Is an upload required?</th><td>No media upload</td><td>Usually yes</td></tr>
                <tr><th scope="row">What provides compute?</th><td>Browser WebAssembly or WebGPU</td><td>Provider infrastructure</td></tr>
                <tr><th scope="row">What are the trade-offs?</th><td>Model download, device speed and browser limits</td><td>Network, account, pricing and provider policies</td></tr>
              </tbody>
            </table>
          </div>
          <aside className="editorial-sources guide-sources" aria-label="Sources for browser compute options">
            <strong>Sources</strong>
            <ul>
              <li><a href="https://developer.mozilla.org/en-US/docs/WebAssembly">MDN: WebAssembly</a></li>
              <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API">MDN: WebGPU API</a></li>
            </ul>
          </aside>
        </section>

        <section className="guide-section guide-boundaries" aria-labelledby="boundaries-heading">
          <div className="guide-section-heading">
            <span>03</span>
            <div>
              <h2 id="boundaries-heading">What are the privacy and compatibility limits?</h2>
              <p>Local processing removes the media-upload step. The page and model still need the network, and your browser and device set practical limits.</p>
            </div>
          </div>
          <ul className="guide-facts">
            <li><LockKey aria-hidden="true" /><strong>No media upload</strong><p>Selected media is decoded in browser memory. Application and model files still download over the network.</p></li>
            <li><Waveform aria-hidden="true" /><strong>Choose the tool that fits the recording</strong><p>The standard tool accepts up to 300 MB and 20 minutes. For a local file up to 1 GB and 1 hour, use the <a href={SEO_PAGES.largeFileTranscription.path}>large-file tool</a>.</p></li>
            <li><Cpu aria-hidden="true" /><strong>WebGPU is optional</strong><p>WebAssembly provides the compatible default. WebGPU depends on browser and device support.</p></li>
          </ul>
        </section>

        <section className="guide-section guide-faq" aria-labelledby="guide-faq-heading">
          <div className="guide-section-heading">
            <span>04</span>
            <div><h2 id="guide-faq-heading">Speech recognition FAQ</h2></div>
          </div>
          <div>
            <details>
              <summary>Does browser speech recognition upload my audio?</summary>
              <p>Not in Whisper Web local mode. The browser decodes the selected media and runs Whisper on the device, although it still downloads the application and model files.</p>
            </details>
            <details>
              <summary>Is WebGPU required for local speech recognition?</summary>
              <p>No. Whisper Web offers WebAssembly for broad compatibility and WebGPU as an optional faster backend on supported browsers and hardware.</p>
            </details>
            <details>
              <summary>What happens after the transcript is created?</summary>
              <p>The transcript is stored in the current browser using IndexedDB until the user exports or deletes it.</p>
            </details>
          </div>
        </section>

        <section className="guide-final-cta">
          <div>
            <span>Transcribe on this device</span>
            <h2>Turn audio into text without uploading the media.</h2>
          </div>
          <a className="guide-cta" href={SEO_PAGES.home.path}>Choose an audio or video file <ArrowRight aria-hidden="true" /></a>
        </section>
      </main>
      <SiteFooter copy={UI_COPY.en} locale="en" />
    </div>
  );
}
