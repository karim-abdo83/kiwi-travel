import { Link } from "@/i18n/routing";
import { parseRichText } from "@/lib/destination-seo/rich-text";

/** Renders config rich text (`[label](trip:<slug>)`) with locale-prefixed links. */
export function RichText({ text, strongLinks = false }: { text: string; strongLinks?: boolean }) {
  return (
    <>
      {parseRichText(text).map((segment, index) =>
        segment.href ? (
          <Link
            key={index}
            href={segment.href}
            className={strongLinks ? "font-semibold text-primary hover:underline" : "text-primary hover:underline"}
          >
            {segment.text}
          </Link>
        ) : (
          <span key={index}>{segment.text}</span>
        ),
      )}
    </>
  );
}
