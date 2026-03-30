import { defineConfig } from "@playwright/test";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const playgroundDir = resolve(__dirname, "../../demos/playground");

export default defineConfig({
  testDir: "./src/e2e/playwright",
  outputDir: "./src/e2e/playwright/test-results",
  timeout: 30000,
  use: {
    baseURL: "http://localhost:3001",
    headless: true,
  },
  webServer: {
    command: "npx vite --port 3001 --strictPort",
    cwd: playgroundDir,
    port: 3001,
    reuseExistingServer: false,
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
    {
      name: "firefox",
      use: { browserName: "firefox" },
    },
  ],
});
