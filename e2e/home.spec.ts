import { expect, test } from "@playwright/test";

const CONSENT_KEY = "matriz_consent";

// These tests exercise page navigation and widgets, not consent. Seed a
// stored rejection so the consent modal doesn't overlay the page.
test.beforeEach(async ({ context }) => {
  await context.addInitScript((key) => {
    try {
      window.localStorage.setItem(key, "denied");
    } catch {}
  }, CONSENT_KEY);
});

test("homepage exposes its main story and a working skip link", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Chile y la nueva matriz energética");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "La transición energética de Chile",
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

test("homepage region selector opens the selected region profile", async ({
  page,
}) => {
  await page.goto("/");
  const explorer = page.getByRole("article").filter({
    has: page.getByRole("heading", { name: "Explora tu región" }),
  });
  await expect(
    explorer.getByRole("link", { name: "Ver todas" }),
  ).toHaveAttribute("href", "/regiones");
  await explorer
    .getByRole("combobox", { name: "Selecciona una región" })
    .selectOption("antofagasta");
  await explorer.getByRole("link", { name: "Ver región" }).click();
  await expect(page).toHaveURL(/\/regiones\/antofagasta$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Antofagasta",
  );
});

test("the complete Chile map fits inside its panel at narrow and wide widths", async ({
  page,
}) => {
  await page.goto("/");
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    const map = page.getByRole("img", {
      name: "Mapa completo de Chile continental, de Arica a Magallanes.",
    });
    await expect(map).toBeVisible();
    const layout = await map.evaluate((image) => {
      const rect = image.getBoundingClientRect();
      const panel = image.closest("figure")!.getBoundingClientRect();
      const caption = image
        .closest("figure")!
        .querySelector("figcaption")!
        .getBoundingClientRect();
      return {
        fits:
          rect.top >= panel.top &&
          rect.bottom <= caption.top &&
          rect.left >= panel.left &&
          rect.right <= panel.right,
        fit: getComputedStyle(image).objectFit,
        loaded: (image as HTMLImageElement).naturalWidth > 0,
        overflow: document.documentElement.scrollWidth > innerWidth,
      };
    });
    expect(layout).toEqual({
      fits: true,
      fit: "contain",
      loaded: true,
      overflow: false,
    });
  }
  await page.goto("/maps/chile.svg");
  const contained = await page.locator("svg").evaluate((element) => {
    const svg = element as SVGSVGElement;
    const box = (
      svg.querySelector("#features") as SVGGraphicsElement
    ).getBBox();
    const view = svg.viewBox.baseVal;
    return (
      box.x >= view.x &&
      box.y >= view.y &&
      box.x + box.width <= view.x + view.width &&
      box.y + box.height <= view.y + view.height
    );
  });
  expect(contained).toBe(true);
});

test("regional directory supports accent-insensitive search, empty recovery and profile navigation", async ({
  page,
}) => {
  await page.goto("/regiones");
  const directory = page.getByRole("region", { name: "Encuentra tu región" });
  const search = directory.getByRole("searchbox", { name: "Buscar región" });
  await search.fill("biobio");
  await expect(directory.getByRole("listitem")).toHaveCount(1);
  await expect(directory.getByRole("link")).toContainText("Biobío");
  await search.fill("no existe");
  await expect(
    directory.getByRole("heading", { name: "No encontramos esa región" }),
  ).toBeVisible();
  await directory.getByRole("button", { name: "Limpiar búsqueda" }).click();
  await expect(search).toHaveValue("");
  await directory
    .getByRole("combobox", { name: "Ordenar por" })
    .selectOption("name");
  const names = await directory.locator("li strong").allTextContents();
  expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, "es")));
  await search.fill("antofagasta");
  await directory.getByRole("link").click();
  await expect(page).toHaveURL(/\/regiones\/antofagasta$/);
});
