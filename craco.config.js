/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

module.exports = {
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
