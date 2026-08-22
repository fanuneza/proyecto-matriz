"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { CONSENT_POLICY_PATHS, CONSENT_STORAGE_KEY } from "@/lib/consent";
import styles from "./CookieConsent.module.css";

export type ConsentValue = "granted" | "denied";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    __matrizConsent?: ConsentValue;
  }
}

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

type Props = {
  gtmId: string;
};

export function CookieConsent({ gtmId }: Props) {
  const bannerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const banner = bannerRef.current;
    const backdrop = backdropRef.current;

    if (!banner || !gtmId) return;

    let lastTrigger: HTMLElement | null = null;
    let inertSiblings: HTMLElement[] = [];

    const storage = (() => {
      try {
        return window.localStorage;
      } catch {
        return null;
      }
    })();

    const getState = (): string | null => {
      try {
        return storage ? storage.getItem(CONSENT_STORAGE_KEY) : null;
      } catch {
        return null;
      }
    };

    const setState = (value: string) => {
      try {
        if (storage) storage.setItem(CONSENT_STORAGE_KEY, value);
      } catch {}
    };

    const getDataLayer = () => {
      window.dataLayer = window.dataLayer ?? [];
      return window.dataLayer;
    };

    const isGtmLoaded = () =>
      document.querySelector(
        `script[src*="googletagmanager.com/gtm.js?id=${gtmId}"]`,
      ) !== null;

    const injectGtm = () => {
      if (isGtmLoaded()) return;

      getDataLayer().push({
        "gtm.start": new Date().getTime(),
        event: "gtm.js",
      });

      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
      document.head.appendChild(script);
    };

    const removeGtm = () => {
      document
        .querySelectorAll(
          `script[src*="googletagmanager.com/gtm.js?id=${gtmId}"]`,
        )
        .forEach((script) => script.remove());
    };

    const applyInertToSiblings = () => {
      inertSiblings = [];
      for (const child of Array.from(document.body.children)) {
        if (!(child instanceof HTMLElement)) continue;
        if (child === banner || child === backdrop) continue;
        const tag = child.tagName.toLowerCase();
        if (tag === "script" || tag === "style" || tag === "link") continue;
        if (!child.hasAttribute("inert")) {
          child.setAttribute("inert", "");
          inertSiblings.push(child);
        }
      }
    };

    const restoreInertSiblings = () => {
      for (const element of inertSiblings) element.removeAttribute("inert");
      inertSiblings = [];
    };

    const getFocusable = () =>
      Array.from(
        banner.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((element) => !element.hidden && element.offsetParent !== null);

    const hideBanner = () => {
      if (banner.hidden) return;
      banner.removeEventListener("keydown", onBannerKeydown);
      document.documentElement.classList.remove("consent-banner-open");
      restoreInertSiblings();
      if (lastTrigger) {
        const trigger = lastTrigger;
        lastTrigger = null;
        trigger.focus();
      }
      banner.hidden = true;
      if (backdrop) backdrop.hidden = true;
    };

    const showBanner = (trigger?: HTMLElement) => {
      lastTrigger = trigger ?? null;
      banner.hidden = false;
      if (backdrop) backdrop.hidden = false;
      document.documentElement.classList.add("consent-banner-open");
      applyInertToSiblings();
      banner.addEventListener("keydown", onBannerKeydown);
      banner.querySelector<HTMLElement>("button")?.focus();
    };

    const applyConsent = (value: ConsentValue) => {
      setState(value);
      window.__matrizConsent = value;
      hideBanner();

      getDataLayer().push({
        event: "cookie_consent_update",
        analytics_storage: value,
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });

      if (value === "granted") {
        injectGtm();
      } else {
        removeGtm();
      }
    };

    const onBannerKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (getState() !== null) {
          event.preventDefault();
          hideBanner();
        }
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = getFocusable();
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const onAcceptClick = () => applyConsent("granted");
    const onRejectClick = () => applyConsent("denied");

    const onDocumentClick = (event: MouseEvent) => {
      const control =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>("[data-consent-reopen]")
          : null;
      if (!control) return;

      event.preventDefault();
      applyConsent("denied");
      showBanner(control);
    };

    const acceptButton = banner.querySelector<HTMLElement>(
      "[data-consent-accept]",
    );
    const rejectButton = banner.querySelector<HTMLElement>(
      "[data-consent-reject]",
    );

    acceptButton?.addEventListener("click", onAcceptClick);
    rejectButton?.addEventListener("click", onRejectClick);
    document.addEventListener("click", onDocumentClick);

    const state = getState();
    const path = window.location.pathname.replace(/\/+$/, "") || "/";
    const isPolicyPath = CONSENT_POLICY_PATHS.includes(
      path as (typeof CONSENT_POLICY_PATHS)[number],
    );

    if (state === "granted" || state === "denied") {
      applyConsent(state);
    } else if (!isPolicyPath) {
      showBanner();
    }

    return () => {
      acceptButton?.removeEventListener("click", onAcceptClick);
      rejectButton?.removeEventListener("click", onRejectClick);
      document.removeEventListener("click", onDocumentClick);
      banner.removeEventListener("keydown", onBannerKeydown);
      document.documentElement.classList.remove("consent-banner-open");
      restoreInertSiblings();
    };
  }, [gtmId]);

  return (
    <>
      <div
        ref={backdropRef}
        className={styles.backdrop}
        data-consent-backdrop=""
        hidden
        aria-hidden="true"
      />
      <div
        ref={bannerRef}
        className={styles.banner}
        data-consent-banner=""
        hidden
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-banner-title"
      >
        <p className={styles.heading} id="cookie-banner-title">
          ¿Nos dejas usar cookies de analítica?
        </p>
        <p className={styles.text}>
          Solo las usamos para medir qué páginas se visitan y mejorar el sitio.
          Puedes cambiar de opinión cuando quieras o revisar nuestra{" "}
          <Link href="/politica-de-cookies">política de cookies</Link>.
        </p>
        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonAccept}`}
            data-consent-accept=""
          >
            Aceptar cookies
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonReject}`}
            data-consent-reject=""
          >
            Rechazar cookies
          </button>
        </div>
      </div>
    </>
  );
}
