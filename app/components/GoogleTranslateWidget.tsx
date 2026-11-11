"use client";

import { useEffect } from "react";
import Script from "next/script";

export default function GoogleTranslateWidget() {
  useEffect(() => {
    // Initialize google translate callback
    (window as any).googleTranslateElementInit = () => {
      if ((window as any).google?.translate?.TranslateElement) {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages:
              "en,es,fr,de,ar,hi,ur,zh-CN,ja,ru,pt,it,tr,ko,nl,id,pl,vi,bn,ta,te,mr,gu,pa",
            autoDisplay: false,
            layout: (window as any).google.translate.TranslateElement.InlineLayout?.SIMPLE,
          },
          "google_translate_element"
        );
      }
    };
  }, []);

  return (
    <>
      <div id="google_translate_element" style={{ display: "none" }} />
      <Script
        id="google-translate-script"
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </>
  );
}

