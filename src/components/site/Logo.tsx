import logoDark from "@/assets/logo-dark.png";

/**
 * The PNG carries generous padding around the wordmark, so it is scaled and
 * offset inside a fixed 104x24 box to show only the wordmark (as in the design).
 * multiply blends the PNG's white edge into the off-white page.
 */
export function Logo() {
  return (
    <span className="relative block h-6 w-[104px] overflow-hidden">
      <img
        src={logoDark}
        alt="VonAI"
        width={141}
        height={55}
        className="absolute left-[-15.6px] top-[-15.5px] w-[141px] max-w-none mix-blend-multiply"
      />
    </span>
  );
}
