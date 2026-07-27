import wordmark from "@/assets/wiskow-wordmark.png.asset.json";
import wordmarkLight from "@/assets/wiskow-wordmark-light.png.asset.json";
import mark from "@/assets/wiskow-mark.png.asset.json";
import markLight from "@/assets/wiskow-mark-light.png.asset.json";

export const logoUrls = {
  wordmark: wordmark.url,
  wordmarkLight: wordmarkLight.url,
  mark: mark.url,
  markLight: markLight.url,
};

export function Logo({
  variant = "wordmark",
  light = false,
  className = "",
}: {
  variant?: "wordmark" | "mark";
  light?: boolean;
  className?: string;
}) {
  const src =
    variant === "mark"
      ? light
        ? logoUrls.markLight
        : logoUrls.mark
      : light
        ? logoUrls.wordmarkLight
        : logoUrls.wordmark;

  return <img src={src} alt="Wiskow Concept" className={`w-auto object-contain ${className}`} />;
}
