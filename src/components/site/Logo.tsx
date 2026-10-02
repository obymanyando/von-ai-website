import wordmark from "@/assets/logo-wordmark.png";

/**
 * Wordmark trimmed from logo-dark.png (same crop as the design) with a real
 * alpha channel, so it reads on the translucent nav over any section.
 * The source PNG has a white background, which showed as a pale box there.
 */
export function Logo() {
  return <img src={wordmark} alt="VonAI" width={104} height={24} className="block h-6 w-[104px]" />;
}
