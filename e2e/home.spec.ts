import { expect, test } from "@playwright/test";

test("homepage exposes its main story and a working skip link", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Chile y la nueva matriz energética");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "La transición ya cambió",
  );

  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Saltar al contenido" });
  await expect(skipLink).toBeFocused();
  await skipLink.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
});

test("mobile navigation reaches the comparison tool", async ({ page }) => {
  test.skip(
    !test.info().project.name.startsWith("mobile-"),
    "Mobile-only interaction",
  );

  await page.goto("/");

  await page.getByRole("button", { name: "Abrir menú" }).click();
  const mobileMenu = page.locator("#mobile-menu");
  await expect(mobileMenu).toHaveAttribute("aria-hidden", "false");
  await mobileMenu.locator('a[href="/comparar"]').click();

  await expect(page).toHaveURL(/\/comparar$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Comparar",
  );
});

test("chart tabs expose the data table to keyboard users", async ({ page }) => {
  await page.goto("/");

  const tabList = page
    .getByRole("tablist", { name: "Vista de gráfico y tabla" })
    .first();
  const chartTab = tabList.getByRole("tab", { name: "Gráfico" });
  const tableTab = tabList.getByRole("tab", { name: "Tabla" });

  await chartTab.focus();
  await page.keyboard.press("ArrowRight");

  await expect(tableTab).toBeFocused();
  await expect(tableTab).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("table").first()).toBeVisible();
});

test("region comparison swaps the selected regions", async ({ page }) => {
  await page.goto("/comparar?a=antofagasta&b=atacama");

  const regionA = page.getByRole("combobox", { name: "Región A" });
  const regionB = page.getByRole("combobox", { name: "Región B" });
  await expect(regionA).toHaveValue("antofagasta");
  await expect(regionB).toHaveValue("atacama");

  await page.getByRole("button", { name: "Intercambiar regiones" }).click();

  await expect(page).toHaveURL(/a=atacama&b=antofagasta/);
  await expect(regionA).toHaveValue("atacama");
  await expect(regionB).toHaveValue("antofagasta");
});
