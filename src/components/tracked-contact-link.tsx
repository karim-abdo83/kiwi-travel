"use client";

import { useRef, type AnchorHTMLAttributes, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import {
  serializeAttribution,
  readAttribution,
} from "@/lib/attribution-tracking";
import { api } from "@/trpc/react";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  channel: "whatsapp" | "telegram";
  ctaLocation: string;
  tripId?: number;
  resort?: string;
  href: string;
};

const COUNTER_ID = 102714145;

function metricaGoal(channel: Props["channel"], journeyId: string | null) {
  return new Promise<void>((resolve) => {
    let completed = false;
    const done = () => {
      if (completed) return;
      completed = true;
      resolve();
    };
    const timeout = window.setTimeout(done, 700);
    const callback = () => {
      window.clearTimeout(timeout);
      done();
    };
    if (!window.ym) return;
    window.ym(
      COUNTER_ID,
      "reachGoal",
      channel === "whatsapp" ? "whatsapp_click" : "telegram_click",
      { channel, journey_id: journeyId },
      callback,
    );
  });
}

export function TrackedContactLink({
  channel,
  ctaLocation,
  tripId,
  resort,
  href,
  onClick,
  children,
  target = "_blank",
  rel = "noopener noreferrer",
  ...props
}: Props) {
  const pathname = usePathname();
  const createClick = api.contactClick.create.useMutation();
  const opening = useRef(false);

  async function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented || opening.current) return;
    event.preventDefault();
    opening.current = true;

    const eventId = crypto.randomUUID();
    const attribution = serializeAttribution();
    const journeyId = readAttribution()?.journeyId ?? null;
    const popup =
      target === "_blank" ? window.open("about:blank", "_blank") : null;
    if (popup) popup.opener = null;

    await Promise.allSettled([
      createClick.mutateAsync({
        eventId,
        channel,
        pagePath: pathname,
        ctaLocation,
        tripId,
        resort,
        attribution,
      }),
      metricaGoal(channel, journeyId),
    ]);

    if (popup) popup.location.href = href;
    else window.location.href = href;
    opening.current = false;
  }

  return (
    <a href={href} target={target} rel={rel} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
