import { cloudflareTest } from "@cloudflare/vitest-plugin";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    cloudflareTest({
      wrangler: {
        configPath: "./wrangler.jsonc",
      },
    }),
  ],

  test: {
    setupFiles: ["./test/apply-migrations.ts"],

    coverage: {
      provider: "istanbul",
    },
  },
});