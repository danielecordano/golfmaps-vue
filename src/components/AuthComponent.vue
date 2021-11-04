<template>
  <div class="auth">
    <amplify-authenticator></amplify-authenticator>
  </div>
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
    this.unsubscribeAuth = onAuthUIStateChange((nextAuthState, authData) => {
      if (nextAuthState === AuthState.SignedIn) {
        console.log(this.$route.query.redirect);
        this.$router.push(this.$route.query.redirect);
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