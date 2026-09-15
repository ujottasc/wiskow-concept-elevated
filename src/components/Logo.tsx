import wordmark from "@/assets/wiskow-wordmark.png.asset.json";
import wordmarkLight from "@/assets/wiskow-wordmark-light.png.asset.json";
import mark from "@/assets/wiskow-mark.png.asset.json";
import markLight from "@/assets/wiskow-mark-light.png.asset.json";

const lovableAsset = (url: string) =>
  url.startsWith("/__l5e/") ? `https://wiskow-concept-elevated.lovable.app${url}` : url;

export const logoUrls = {
  wordmark: lovableAsset(wordmark.url),
  wordmarkLight: lovableAsset(wordmarkLight.url),
  mark: lovableAsset(mark.url),
  markLight: lovableAsset(markLight.url),
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
