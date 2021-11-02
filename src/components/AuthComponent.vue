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
      authCounter: 0,
    };
  },
  created() {
    this.unsubscribeAuth = onAuthUIStateChange((nextAuthState, authData) => {
      if (nextAuthState === AuthState.SignedIn && this.authCounter === 0) {
        this.$router.go(-1);
        this.authCounter++;
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