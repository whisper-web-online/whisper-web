import { Waveform } from "@phosphor-icons/react/dist/ssr";

/**
 * 渲染统一的 Whisper Web 品牌标识。
 */
export function Brand() {
  return (
    <span className="brand" aria-label="Whisper Web home">
      <Waveform aria-hidden="true" weight="bold" />
      <span>Whisper Web</span>
    </span>
  );
}
