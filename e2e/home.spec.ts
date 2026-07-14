import { expect, test } from "@playwright/test";

test("homepage exposes its main story and a working skip link", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Chile y la nueva matriz energética");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("La transición ya cambió");

  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Saltar al contenido" });
  await expect(skipLink).toBeFocused();
  await skipLink.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
});

test("mobile navigation reaches the comparison tool", async ({ page }) => {
  test.skip(!test.info().project.name.startsWith("mobile-"), "Mobile-only interaction");

  await page.goto("/");

  await page.getByRole("button", { name: "Abrir menú" }).click();
  const mobileMenu = page.locator("#mobile-menu");
  await expect(mobileMenu).toHaveAttribute("aria-hidden", "false");
  await mobileMenu.locator('a[href="/comparar"]').click();

  await expect(page).toHaveURL(/\/comparar$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Comparar");
});
