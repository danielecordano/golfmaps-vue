<template>
  <v-footer dark padless class="bottom">
    <v-card
      flat
      tile
      class="orange lighten-1 white--text text-center full-width"
    >
      <v-card-text>
        <a
          href="https://twitter.com/golfmapsinfo"
          target="_blank"
          class="no-decoration"
        >
          <v-btn class="mx-4 white--text" icon>
            <v-icon size="24px"> mdi-twitter </v-icon>
          </v-btn>
        </a>
        <a
          href="https://www.buymeacoffee.com/danielecordano"
          target="_blank"
          class="no-decoration"
        >
          <v-btn class="mx-4 white--text" icon>
            <v-icon size="24px"> mdi-currency-usd </v-icon>
          </v-btn>
        </a>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-text class="white--text">
        {{ new Date().getFullYear() }} — <strong>Golfmaps</strong>
      </v-card-text>
    </v-card>
  </v-footer>
</template>
<style scoped>
.no-decoration {
  text-decoration: none;
}
.full-width {
  width: 100%;
}
.bottom {
  margin-top: auto;
}
</style>