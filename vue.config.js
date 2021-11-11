/*eslint no-undef: "error"*/
/*eslint-env node*/

module.exports = {
  pwa: {
    name: "Golfmaps",
    themeColor: "#FFA500",
    msTileColor: "#000000",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "#FFA500",
    // configure the workbox plugin
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: "./src/service-worker.js"
      // ...other Workbox options...
    },
    manifestOptions: {
      name: "Golfmaps",
      short_name: "Golfmaps",
      start_url: "/",
      display: "standalone",
      background_color: "#FFA500",
      theme_color: "#FFA500",
      orientation: "portrait-primary",
      icons: [
        {
          src: "golfmaps-512.png",
          type: "image/png",
          sizes: "512x512"
        }
      ]
    },
    iconPaths: {
      favicon32: "golfmaps.ico",
      appleTouchIcon: "golfmaps-512.png"
    }
  }
};
