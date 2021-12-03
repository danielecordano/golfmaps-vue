<template>
<amplify-auth-container>
  <amplify-authenticator class="auth"></amplify-authenticator>
</amplify-auth-container>
</template>
<script>
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";
export default {
  name: "AuthComponent",
  data() {
    return {
      unsubscribeAuth: undefined,
    };
  },
  created() {
    this.unsubscribeAuth = onAuthUIStateChange((nextAuthState) => {
      if (nextAuthState === AuthState.SignedIn) {
        if (this.$route.query.nextUrl) {
          try {
            this.$router.push(this.$route.query.nextUrl);
          } catch (error) {
            // empty
          }
        }
      }
    });
  },
  beforeDestroy() {
    this.unsubscribeAuth();
  },
};
</script>
<style>
.auth {
  margin: 0 auto;
}
</style>