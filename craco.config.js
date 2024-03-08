/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const interpolateHtml = require("craco-interpolate-html-plugin");
const childProcess = require("child_process");

module.exports = {
  plugins: [
    {
      plugin: interpolateHtml,
      options: {
        ENVIRONMENT: process.env.ENVIRONMENT || "development",
        BUILD_VERSION:
          process.env.CF_PAGES_COMMIT_SHA ||
          childProcess.execSync("git rev-parse HEAD", { cwd: __dirname }).toString().trim(),
      },
    },
  ],
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src/"),
      "@stores": path.resolve(__dirname, "src/stores/"),
      "@modules": path.resolve(__dirname, "src/modules/"),
      "@proto": path.resolve(__dirname, "src/proto/gen/"),
      "@utils": path.resolve(__dirname, "src/utils/"),
      "@configs": path.resolve(__dirname, "src/configs/"),
    },
  },
};
