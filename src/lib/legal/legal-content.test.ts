import { describe, expect, it } from "vitest";
import { SUPPORT_EMAIL } from "@/lib/seo/site";
import { PRIVACY_POLICY, TERMS_OF_USE } from "./legal-content";

describe("法律文档合同", () => {
  it("为隐私政策和使用条款提供唯一且可链接的章节", () => {
    for (const document of [PRIVACY_POLICY, TERMS_OF_USE]) {
      const ids = document.sections.map((section) => section.id);

      expect(new Set(ids).size).toBe(ids.length);
      expect(document.sections.length).toBeGreaterThanOrEqual(10);
    }

    expect(PRIVACY_POLICY.effectiveDate).toBe("September 2, 2026");
    expect(TERMS_OF_USE.effectiveDate).toBe("September 1, 2026");
  });

  it("在隐私政策中披露本地存储、网络边界和联系渠道", () => {
    const text = JSON.stringify(PRIVACY_POLICY);

    expect(text).toContain("IndexedDB");
    expect(text).toContain("Hugging Face");
    expect(text).toContain("Direct media URLs");
    expect(text).toContain("Product Hunt badge");
    expect(text).toContain("no-referrer");
    expect(text).toContain("does not include advertising");
    expect(text).toContain("Google Analytics 4");
    expect(text).toContain("Plausible");
    expect(text).toContain("Microsoft Clarity");
    expect(text).toContain("do not receive the local media");
    expect(text).toContain("converted MP3");
    expect(text).toContain("30 days");
    expect(text).toContain(SUPPORT_EMAIL);
  });

  it("在使用条款中保留准确性、高风险用途和强制消费者权利边界", () => {
    const text = JSON.stringify(TERMS_OF_USE);

    expect(text).toContain("Speech recognition is probabilistic");
    expect(text).toContain("high-risk use");
    expect(text).toContain("Mandatory consumer protections remain unaffected");
    expect(text).toContain("Mediabunny");
    expect(text).toContain("MIT License");
    expect(text).toContain(SUPPORT_EMAIL);
  });
});
