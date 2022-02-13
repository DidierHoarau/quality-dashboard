var manifestJSON = require("./public/manifest.json");

module.exports = {
  devServer: {
    disableHostCheck: true,
  },
  publicPath: "/quality-dashboard/",
  pwa: {
    name: manifestJSON.short_name,
    themeColor: manifestJSON.theme_color,
    msTileColor: "#000000",
  },
};
