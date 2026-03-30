import { expect, test } from "@playwright/test";

async function waitForRender(page, ms = 500) {
  await page.waitForTimeout(ms);
}

async function getCanvasPixel(page, x, y) {
  return page.evaluate(
    ([px, py]) => {
      const canvas = document.querySelector("canvas");
      const ctx = canvas.getContext("2d");
      const pixel = ctx.getImageData(px, py, 1, 1).data;
      return { r: pixel[0], g: pixel[1], b: pixel[2], a: pixel[3] };
    },
    [x, y],
  );
}

// Background is #f0f0f0 (240, 240, 240)
function isImagePixel(pixel) {
  return !(pixel.r === 240 && pixel.g === 240 && pixel.b === 240);
}

async function getContainerInfo(page) {
  const text = await page.locator("textarea").inputValue();
  return JSON.parse(text);
}

async function setMode(page, mode) {
  await page
    .locator("fieldset:has(legend:text('Fit Mode')) select")
    .selectOption(mode);
  await waitForRender(page);
}

async function setContainerWidth(page, value) {
  await page
    .locator("fieldset:has(legend:text('Container Size')) input[type=number]")
    .first()
    .fill(String(value));
  await waitForRender(page);
}

async function setContainerHeight(page, value) {
  await page
    .locator("fieldset:has(legend:text('Container Size')) input[type=number]")
    .nth(1)
    .fill(String(value));
  await waitForRender(page);
}

async function loadPreset(page, label) {
  await page.locator(`button:text("${label}")`).click();
  await waitForRender(page, 2000);
}

// Get the on-canvas bounding box from the container info JSON
async function getContainerBounds(page) {
  const info = await getContainerInfo(page);
  return {
    left: info.container?.left ?? 0,
    top: info.container?.top ?? 0,
    width: info.width,
    height: info.height,
  };
}

test.describe("Object Fit Modes", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await waitForRender(page, 2000);
  });

  test("initial render shows image on canvas", async ({ page }) => {
    const info = await getContainerInfo(page);
    expect(info.mode).toBeDefined();
    expect(info.width).toBeGreaterThan(0);
    expect(info.height).toBeGreaterThan(0);
    expect(info.object).toBeDefined();
  });

  // Firefox has a known canvas rendering issue with non-uniform scaling on nested groups
  test("fill mode stretches image to fill container", async ({ page }) => {
    test.fixme(
      test.info().project.name === "firefox",
      "Firefox does not apply non-uniform scale correctly on nested fabric groups",
    );
    await loadPreset(page, "Portrait");
    await setMode(page, "fill");
    await setContainerWidth(page, 400);
    await setContainerHeight(page, 300);

    const b = await getContainerBounds(page);
    await page.screenshot({
      path: `src/e2e/playwright/screenshots/fill-portrait-${test.info().project.name}.png`,
    });

    // For fill, all four edge midpoints should have image content
    const topMid = await getCanvasPixel(page, b.left + b.width / 2, b.top + 5);
    const botMid = await getCanvasPixel(
      page,
      b.left + b.width / 2,
      b.top + b.height - 5,
    );
    const leftMid = await getCanvasPixel(
      page,
      b.left + 5,
      b.top + b.height / 2,
    );
    const rightMid = await getCanvasPixel(
      page,
      b.left + b.width - 5,
      b.top + b.height / 2,
    );

    console.log("Fill edges:", { topMid, botMid, leftMid, rightMid });

    expect(isImagePixel(topMid)).toBe(true);
    expect(isImagePixel(botMid)).toBe(true);
    expect(isImagePixel(leftMid)).toBe(true);
    expect(isImagePixel(rightMid)).toBe(true);
  });

  test("contain mode fits inside with letterboxing", async ({ page }) => {
    await loadPreset(page, "Portrait");
    await setMode(page, "contain");
    await setContainerWidth(page, 400);
    await setContainerHeight(page, 300);

    const b = await getContainerBounds(page);
    await page.screenshot({
      path: `src/e2e/playwright/screenshots/contain-portrait-${test.info().project.name}.png`,
    });

    // Contain of portrait (3:5) in landscape (4:3) → height-limited
    // Image scaled to fit height: scale = 300/500 = 0.6, width = 300*0.6 = 180
    // Centered: left margin ≈ (400 - 180) / 2 = 110px
    // Center of image should have content
    const center = await getCanvasPixel(
      page,
      b.left + b.width / 2,
      b.top + b.height / 2,
    );
    // Left edge (in the letterbox area) should be background
    const leftEdge = await getCanvasPixel(
      page,
      b.left + 10,
      b.top + b.height / 2,
    );

    console.log("Contain:", { center, leftEdge });

    expect(isImagePixel(center)).toBe(true);
    expect(isImagePixel(leftEdge)).toBe(false);
  });

  test("cover mode fills entire container", async ({ page }) => {
    await loadPreset(page, "Portrait");
    await setMode(page, "cover");
    await setContainerWidth(page, 400);
    await setContainerHeight(page, 300);

    const b = await getContainerBounds(page);
    await page.screenshot({
      path: `src/e2e/playwright/screenshots/cover-portrait-${test.info().project.name}.png`,
    });

    const topMid = await getCanvasPixel(page, b.left + b.width / 2, b.top + 5);
    const botMid = await getCanvasPixel(
      page,
      b.left + b.width / 2,
      b.top + b.height - 5,
    );
    const leftMid = await getCanvasPixel(
      page,
      b.left + 5,
      b.top + b.height / 2,
    );
    const rightMid = await getCanvasPixel(
      page,
      b.left + b.width - 5,
      b.top + b.height / 2,
    );

    console.log("Cover edges:", { topMid, botMid, leftMid, rightMid });

    expect(isImagePixel(topMid)).toBe(true);
    expect(isImagePixel(botMid)).toBe(true);
    expect(isImagePixel(leftMid)).toBe(true);
    expect(isImagePixel(rightMid)).toBe(true);
  });

  test("fill vs contain differ visually", async ({ page }) => {
    test.fixme(
      test.info().project.name === "firefox",
      "Firefox does not apply non-uniform scale correctly on nested fabric groups",
    );
    await loadPreset(page, "Portrait");
    await setContainerWidth(page, 400);
    await setContainerHeight(page, 300);

    await setMode(page, "fill");
    const fillShot = await page.screenshot();

    await setMode(page, "contain");
    const containShot = await page.screenshot();

    expect(Buffer.compare(fillShot, containShot)).not.toBe(0);
  });

  test("cover maintains coverage after container resize", async ({ page }) => {
    await loadPreset(page, "Landscape");
    await setMode(page, "cover");
    await setContainerWidth(page, 200);
    await setContainerHeight(page, 400);

    const b = await getContainerBounds(page);
    await page.screenshot({
      path: `src/e2e/playwright/screenshots/cover-resized-${test.info().project.name}.png`,
    });

    const topMid = await getCanvasPixel(page, b.left + b.width / 2, b.top + 5);
    const botMid = await getCanvasPixel(
      page,
      b.left + b.width / 2,
      b.top + b.height - 5,
    );
    const leftMid = await getCanvasPixel(
      page,
      b.left + 5,
      b.top + b.height / 2,
    );
    const rightMid = await getCanvasPixel(
      page,
      b.left + b.width - 5,
      b.top + b.height / 2,
    );

    console.log("Cover after resize:", { topMid, botMid, leftMid, rightMid });

    expect(isImagePixel(topMid)).toBe(true);
    expect(isImagePixel(botMid)).toBe(true);
    expect(isImagePixel(leftMid)).toBe(true);
    expect(isImagePixel(rightMid)).toBe(true);
  });
});
