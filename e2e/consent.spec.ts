import { expect, test, type Page } from "@playwright/test";

const GTM_CONTAINER_ID = "GTM-E2ETEST";
const CONSENT_KEY = "matriz_consent";
const GTM_SCRIPT_SELECTOR = `script[src*="googletagmanager.com/gtm.js?id=${GTM_CONTAINER_ID}"]`;

type DataLayerEntry = Record<string, unknown>;

async function stubGtm(page: Page) {
  let gtmRequestCount = 0;

  await page.route(
    `https://www.googletagmanager.com/gtm.js?id=${GTM_CONTAINER_ID}*`,
    async (route) => {
      gtmRequestCount += 1;
      await route.fulfill({
        status: 200,
        contentType: "application/javascript",
        body: "window.__gtmMockLoaded = true; window.dataLayer = window.dataLayer || [];",
      });
    },
  );

  return {
    getGtmRequestCount: () => gtmRequestCount,
  };
}

test.describe("Consentimiento de cookies", () => {
  test.beforeEach(async ({ context }) => {
    await context.addInitScript((key) => {
      try {
        window.localStorage.removeItem(key);
      } catch {}
    }, CONSENT_KEY);
  });

  test("sin elección muestra el aviso y no carga GTM", async ({ page }) => {
    const tracking = await stubGtm(page);
    await page.goto("/");

    await expect(page.locator("[data-consent-banner]")).toBeVisible();
    await expect(page.locator(GTM_SCRIPT_SELECTOR)).toHaveCount(0);
    expect(tracking.getGtmRequestCount()).toBe(0);
  });

  test("aceptar oculta el aviso, carga GTM una vez y guarda la preferencia", async ({
    page,
  }) => {
    const tracking = await stubGtm(page);
    await page.goto("/");

    await page.locator("[data-consent-accept]").click();
    await expect(page.locator("[data-consent-banner]")).toBeHidden();
    await expect(page.locator(GTM_SCRIPT_SELECTOR)).toHaveCount(1);
    expect(tracking.getGtmRequestCount()).toBe(1);

    const consent = await page.evaluate(
      (key) => window.localStorage.getItem(key),
      CONSENT_KEY,
    );
    expect(consent).toBe("granted");

    const dataLayer = await page.evaluate<DataLayerEntry[]>(
      () => window.dataLayer ?? [],
    );
    expect(dataLayer).toContainEqual(
      expect.objectContaining({
        event: "cookie_consent_update",
        analytics_storage: "granted",
      }),
    );
    expect(dataLayer).toContainEqual(
      expect.objectContaining({ event: "gtm.js" }),
    );
  });

  test("rechazar oculta el aviso y no carga GTM", async ({ page }) => {
    const tracking = await stubGtm(page);
    await page.goto("/");

    await page.locator("[data-consent-reject]").click();
    await expect(page.locator("[data-consent-banner]")).toBeHidden();
    await expect(page.locator(GTM_SCRIPT_SELECTOR)).toHaveCount(0);
    expect(tracking.getGtmRequestCount()).toBe(0);

    const consent = await page.evaluate(
      (key) => window.localStorage.getItem(key),
      CONSENT_KEY,
    );
    expect(consent).toBe("denied");

    const dataLayer = await page.evaluate<DataLayerEntry[]>(
      () => window.dataLayer ?? [],
    );
    expect(dataLayer).toContainEqual(
      expect.objectContaining({
        event: "cookie_consent_update",
        analytics_storage: "denied",
      }),
    );
  });

  test("una preferencia guardada de aceptación carga GTM al llegar", async ({
    context,
    page,
  }) => {
    await context.addInitScript((key) => {
      try {
        window.localStorage.setItem(key, "granted");
      } catch {}
    }, CONSENT_KEY);

    const tracking = await stubGtm(page);
    await page.goto("/");

    await expect(page.locator("[data-consent-banner]")).toBeHidden();
    await expect(page.locator(GTM_SCRIPT_SELECTOR)).toHaveCount(1);
    expect(tracking.getGtmRequestCount()).toBe(1);
  });

  test("una preferencia guardada de rechazo mantiene GTM apagado", async ({
    context,
    page,
  }) => {
    await context.addInitScript((key) => {
      try {
        window.localStorage.setItem(key, "denied");
      } catch {}
    }, CONSENT_KEY);

    const tracking = await stubGtm(page);
    await page.goto("/");

    await expect(page.locator("[data-consent-banner]")).toBeHidden();
    await expect(page.locator(GTM_SCRIPT_SELECTOR)).toHaveCount(0);
    expect(tracking.getGtmRequestCount()).toBe(0);
  });

  test("gestionar cookies desde el pie retira la analítica y permite reelegir", async ({
    page,
  }) => {
    const tracking = await stubGtm(page);
    await page.goto("/");

    await page.locator("[data-consent-accept]").click();
    await expect(page.locator(GTM_SCRIPT_SELECTOR)).toHaveCount(1);

    await page
      .locator("footer")
      .getByRole("button", { name: "Gestionar cookies" })
      .click();
    await expect(page.locator("[data-consent-banner]")).toBeVisible();

    const consent = await page.evaluate(
      (key) => window.localStorage.getItem(key),
      CONSENT_KEY,
    );
    expect(consent).toBe("denied");
    await expect(page.locator(GTM_SCRIPT_SELECTOR)).toHaveCount(0);

    await page.locator("[data-consent-accept]").click();
    await expect(page.locator(GTM_SCRIPT_SELECTOR)).toHaveCount(1);
    expect(tracking.getGtmRequestCount()).toBe(2);
  });

  test("las políticas se pueden leer sin aviso automático", async ({
    page,
  }) => {
    for (const path of ["/privacidad", "/politica-de-cookies"]) {
      await page.goto(path);

      await expect(page.locator("[data-consent-banner]")).toBeHidden();
      await expect(
        page.getByRole("heading", { level: 1 }).first(),
      ).toContainText(/Política/);
    }
  });

  test("escape cierra el aviso solo con una preferencia previa", async ({
    page,
  }) => {
    await stubGtm(page);
    await page.goto("/");

    await expect(page.locator("[data-consent-banner]")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("[data-consent-banner]")).toBeVisible();

    await page.locator("[data-consent-accept]").click();
    await page
      .locator("footer")
      .getByRole("button", { name: "Gestionar cookies" })
      .click();
    await expect(page.locator("[data-consent-banner]")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.locator("[data-consent-banner]")).toBeHidden();
  });
});
