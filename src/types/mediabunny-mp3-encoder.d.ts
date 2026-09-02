declare module "@mediabunny/mp3-encoder" {
  /**
   * 注册官方 LAME WASM MP3 编码器，使 Mediabunny 可在缺少原生编码器时使用。
   */
  export function registerMp3Encoder(): void;
}
