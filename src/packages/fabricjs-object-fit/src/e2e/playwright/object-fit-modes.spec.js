import { expect, test } from "@playwright/test";

const FIXTURES = {
  landscape: "/src/packages/fabricjs-object-fit/src/e2e/fixtures/600x400.png",
  portrait: "/src/packages/fabricjs-object-fit/src/e2e/fixtures/200x400.png",
  wide: "/src/packages/fabricjs-object-fit/src/e2e/fixtures/600x100.png",
  small: "/src/packages/fabricjs-object-fit/src/e2e/fixtures/200x100.png",
};

async function waitForRender(page, ms = 300) {
  await page.waitForTimeout(ms);
}

async function loadImage(page, fixture, opts = {}) {
  await page.evaluate(
    ([src, o]) => window.app.loadImage(src, o),
    [fixture, opts],
  );
  await waitForRender(page, 1000);
}

async function setMode(page, mode) {
  await page.evaluate((m) => window.app.setMode(m), mode);
  await waitForRender(page);
}

async function setSize(page, w, h) {
  await page.evaluate(([w, h]) => window.app.setSize(w, h), [w, h]);
  await waitForRender(page);
}

async function getInfo(page) {
  return page.evaluate(() => window.app.getInfo());
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

async function getContainerBounds(page) {
  const info = await getInfo(page);
  return {
    left: info.container?.left ?? 0,
    top: info.container?.top ?? 0,
    width: info.width,
    height: info.height,
  };
}

test.describe("Object Fit Modes", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      "/src/packages/fabricjs-object-fit/src/e2e/playwright/index.html",
    );
    await waitForRender(page, 500);
  });

  test("load image and verify initial state", async ({ page }) => {
    await loadImage(page, FIXTURES.landscape);
    const info = await getInfo(page);
    expect(info.mode).toBeDefined();
    expect(info.width).toBeGreaterThan(0);
    expect(info.height).toBeGreaterThan(0);
    expect(info.object).toBeDefined();
  });

  test("fill mode stretches image to fill container", async ({ page }) => {
    test.fixme(
      test.info().project.name === "firefox",
      "Firefox does not apply non-uniform scale correctly on nested fabric groups",
    );
    await loadImage(page, FIXTURES.portrait);
    await setMode(page, "fill");
    await setSize(page, 400, 300);

    const b = await getContainerBounds(page);
    await page.screenshot({
      path: `src/e2e/playwright/screenshots/fill-portrait-${test.info().project.name}.png`,
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

    expect(isImagePixel(topMid)).toBe(true);
    expect(isImagePixel(botMid)).toBe(true);
    expect(isImagePixel(leftMid)).toBe(true);
    expect(isImagePixel(rightMid)).toBe(true);
  });

  test("contain mode fits inside with letterboxing", async ({ page }) => {
    await loadImage(page, FIXTURES.portrait);
    await setMode(page, "contain");
    await setSize(page, 400, 300);

    const b = await getContainerBounds(page);
    await page.screenshot({
      path: `src/e2e/playwright/screenshots/contain-portrait-${test.info().project.name}.png`,
    });

    const center = await getCanvasPixel(
      page,
      b.left + b.width / 2,
      b.top + b.height / 2,
    );
    const leftEdge = await getCanvasPixel(
      page,
      b.left + 10,
      b.top + b.height / 2,
    );

    expect(isImagePixel(center)).toBe(true);
    expect(isImagePixel(leftEdge)).toBe(false);
  });

  test("cover mode fills entire container", async ({ page }) => {
    await loadImage(page, FIXTURES.portrait);
    await setMode(page, "cover");
    await setSize(page, 400, 300);

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
    await loadImage(page, FIXTURES.portrait);
    await setSize(page, 400, 300);

    await setMode(page, "fill");
    const fillShot = await page.screenshot();

    await setMode(page, "contain");
    const containShot = await page.screenshot();

    expect(Buffer.compare(fillShot, containShot)).not.toBe(0);
  });

  test("cover maintains coverage after container resize", async ({ page }) => {
    await loadImage(page, FIXTURES.landscape);
    await setMode(page, "cover");
    await setSize(page, 200, 400);

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

    expect(isImagePixel(topMid)).toBe(true);
    expect(isImagePixel(botMid)).toBe(true);
    expect(isImagePixel(leftMid)).toBe(true);
    expect(isImagePixel(rightMid)).toBe(true);
  });
});

test.describe("useObjectTransform", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      "/src/packages/fabricjs-object-fit/src/e2e/playwright/index.html",
    );
    await waitForRender(page, 500);
  });

  test("useObjectTransform=true inherits object position", async ({ page }) => {
    await page.evaluate(
      async ([src]) => {
        const img = await fabric.FabricImage.fromURL(src, {
          crossOrigin: "anonymous",
        });
        img.set({ originX: "left", originY: "top", left: 100, top: 80 });

        if (window.app._container) window.app._container = null;

        const { ObjectFit, Point } = window.app._internals
          ? window.app._internals
          : (() => {
              const { createObjectFitClass, Point } = FabricJSObjectFit;
              return { ObjectFit: createObjectFitClass(fabric), Point };
            })();

        const container = new ObjectFit(img, {
          width: 300,
          height: 200,
          mode: "cover",
          useObjectTransform: true,
          position: { x: Point.X.CENTER, y: Point.Y.CENTER },
        });

        const canvas = document.querySelector("canvas").__fabric;
        canvas.add(container);
        canvas.requestRenderAll();

        window._testContainer = container;
      },
      [FIXTURES.landscape],
    );

    await waitForRender(page, 500);

    const result = await page.evaluate(() => {
      const c = window._testContainer;
      return {
        left: c.left,
        top: c.top,
        originX: c.originX,
        originY: c.originY,
      };
    });

    expect(result.left).toBeCloseTo(100, 0);
    expect(result.top).toBeCloseTo(80, 0);
    expect(result.originX).toBe("left");
    expect(result.originY).toBe("top");
  });

  test("useObjectTransform=false places container at origin", async ({
    page,
  }) => {
    await page.evaluate(
      async ([src]) => {
        const img = await fabric.FabricImage.fromURL(src, {
          crossOrigin: "anonymous",
        });
        img.set({ originX: "left", originY: "top", left: 100, top: 80 });

        const { createObjectFitClass, Point } = FabricJSObjectFit;
        const ObjectFit = createObjectFitClass(fabric);

        const container = new ObjectFit(img, {
          width: 300,
          height: 200,
          mode: "cover",
          useObjectTransform: false,
          position: { x: Point.X.CENTER, y: Point.Y.CENTER },
        });

        const canvas = document.querySelector("canvas").__fabric;
        canvas.add(container);
        canvas.requestRenderAll();

        window._testContainer = container;
      },
      [FIXTURES.landscape],
    );

    await waitForRender(page, 500);

    const result = await page.evaluate(() => {
      const c = window._testContainer;
      return { left: c.left, top: c.top };
    });

    expect(result.left).toBeCloseTo(0, 0);
    expect(result.top).toBeCloseTo(0, 0);
  });

  test("useObjectTransform=true normalizes center origin", async ({ page }) => {
    await page.evaluate(
      async ([src]) => {
        const img = await fabric.FabricImage.fromURL(src, {
          crossOrigin: "anonymous",
        });
        // center origin: center of image at (400, 300)
        // image is 600x400, so left/top should be at (100, 100)
        img.set({ originX: "center", originY: "center", left: 400, top: 300 });

        const { createObjectFitClass, Point } = FabricJSObjectFit;
        const ObjectFit = createObjectFitClass(fabric);

        const container = new ObjectFit(img, {
          width: 300,
          height: 200,
          mode: "cover",
          useObjectTransform: true,
          position: { x: Point.X.CENTER, y: Point.Y.CENTER },
        });

        const canvas = document.querySelector("canvas").__fabric;
        canvas.add(container);
        canvas.requestRenderAll();

        window._testContainer = container;
      },
      [FIXTURES.landscape],
    );

    await waitForRender(page, 500);

    const result = await page.evaluate(() => {
      const c = window._testContainer;
      return {
        left: c.left,
        top: c.top,
        originX: c.originX,
        originY: c.originY,
      };
    });

    // 600x400 image with center at (400, 300) => left/top at (100, 100)
    expect(result.left).toBeCloseTo(100, 0);
    expect(result.top).toBeCloseTo(100, 0);
    expect(result.originX).toBe("left");
    expect(result.originY).toBe("top");
  });

  test("useObjectTransform=true with scale and angle", async ({ page }) => {
    await page.evaluate(
      async ([src]) => {
        const img = await fabric.FabricImage.fromURL(src, {
          crossOrigin: "anonymous",
        });
        img.set({
          originX: "left",
          originY: "top",
          left: 50,
          top: 50,
          scaleX: 1.5,
          scaleY: 1.5,
          angle: 30,
        });

        const { createObjectFitClass, Point } = FabricJSObjectFit;
        const ObjectFit = createObjectFitClass(fabric);

        const container = new ObjectFit(img, {
          width: 300,
          height: 200,
          mode: "contain",
          useObjectTransform: true,
          position: { x: Point.X.CENTER, y: Point.Y.CENTER },
        });

        const canvas = document.querySelector("canvas").__fabric;
        canvas.add(container);
        canvas.requestRenderAll();

        window._testContainer = container;
      },
      [FIXTURES.landscape],
    );

    await waitForRender(page, 500);

    const result = await page.evaluate(() => {
      const c = window._testContainer;
      return {
        left: c.left,
        top: c.top,
        scaleX: c.scaleX,
        scaleY: c.scaleY,
        angle: c.angle,
      };
    });

    expect(result.left).toBeCloseTo(50, 0);
    expect(result.top).toBeCloseTo(50, 0);
    expect(result.scaleX).toBeCloseTo(1.5, 1);
    expect(result.scaleY).toBeCloseTo(1.5, 1);
    expect(result.angle).toBeCloseTo(30, 0);
  });

  test("useObjectTransform=false ignores scale and angle", async ({ page }) => {
    await page.evaluate(
      async ([src]) => {
        const img = await fabric.FabricImage.fromURL(src, {
          crossOrigin: "anonymous",
        });
        img.set({
          originX: "left",
          originY: "top",
          left: 50,
          top: 50,
          scaleX: 2,
          scaleY: 2,
          angle: 90,
        });

        const { createObjectFitClass, Point } = FabricJSObjectFit;
        const ObjectFit = createObjectFitClass(fabric);

        const container = new ObjectFit(img, {
          width: 300,
          height: 200,
          mode: "contain",
          useObjectTransform: false,
          position: { x: Point.X.CENTER, y: Point.Y.CENTER },
        });

        const canvas = document.querySelector("canvas").__fabric;
        canvas.add(container);
        canvas.requestRenderAll();

        window._testContainer = container;
      },
      [FIXTURES.landscape],
    );

    await waitForRender(page, 500);

    const result = await page.evaluate(() => {
      const c = window._testContainer;
      return {
        left: c.left,
        top: c.top,
        scaleX: c.scaleX,
        scaleY: c.scaleY,
        angle: c.angle,
      };
    });

    expect(result.left).toBeCloseTo(0, 0);
    expect(result.top).toBeCloseTo(0, 0);
    expect(result.scaleX).toBeCloseTo(1, 1);
    expect(result.scaleY).toBeCloseTo(1, 1);
    expect(result.angle).toBeCloseTo(0, 0);
  });
});

test.describe("Workflow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      "/src/packages/fabricjs-object-fit/src/e2e/playwright/index.html",
    );
    await waitForRender(page, 500);
  });

  test("cycle through all fit modes", async ({ page }) => {
    await loadImage(page, FIXTURES.landscape);

    for (const mode of ["fill", "contain", "cover", "none", "scale-down"]) {
      await setMode(page, mode);
      const info = await getInfo(page);
      expect(info.mode).toBe(mode);
    }
  });

  test("resize container updates dimensions", async ({ page }) => {
    await loadImage(page, FIXTURES.landscape);
    await setSize(page, 250, 500);

    const info = await getInfo(page);
    expect(info.width).toBe(250);
    expect(info.height).toBe(500);
  });

  test("switching images updates the object", async ({ page }) => {
    await loadImage(page, FIXTURES.landscape);
    const landscape = await getInfo(page);

    await loadImage(page, FIXTURES.portrait);
    const portrait = await getInfo(page);

    expect(
      landscape.object.width !== portrait.object.width ||
        landscape.object.height !== portrait.object.height,
    ).toBe(true);
  });

  test("state stays consistent after rapid mode switches", async ({ page }) => {
    await loadImage(page, FIXTURES.small, { width: 300, height: 300 });

    await setMode(page, "cover");
    await setMode(page, "contain");
    await setMode(page, "fill");
    await setMode(page, "none");
    await setMode(page, "contain");

    const info = await getInfo(page);
    expect(info.mode).toBe("contain");
    expect(info.width).toBe(300);
    expect(info.height).toBe(300);
    expect(info.object).toBeDefined();
  });

  test("position change reflects in info", async ({ page }) => {
    await loadImage(page, FIXTURES.landscape);
    await setMode(page, "contain");

    await page.evaluate(() => {
      const { Point } = window.app;
      window.app.setPosition(Point.X.RIGHT, Point.Y.TOP);
    });
    await waitForRender(page);

    const info = await getInfo(page);
    expect(info.position.x.toLowerCase()).toContain("right");
    expect(info.position.y.toLowerCase()).toContain("top");
  });

  test("resize then mode switch produces valid state", async ({ page }) => {
    await loadImage(page, FIXTURES.wide);
    await setSize(page, 150, 600);
    await setMode(page, "cover");

    const info = await getInfo(page);
    expect(info.mode).toBe("cover");
    expect(info.width).toBe(150);
    expect(info.height).toBe(600);
    expect(info.object).toBeDefined();
    expect(info.object.scaleX).toBeGreaterThan(0);
    expect(info.object.scaleY).toBeGreaterThan(0);
  });
});
