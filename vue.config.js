module.exports = {
  pwa: {
    name: "Golfmaps",
    themeColor: "#FFA500",
    msTileColor: "#000000",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "#FFA500",
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
          src: "/public/golfmaps-512.png",
          type: "image/png",
          sizes: "512x512"
        }
      ]
    },
    iconPaths: {
      favicon32: "/public/golfmaps.ico",
      appleTouchIcon: "/public/golfmaps-512.png"
    }
  }
};
