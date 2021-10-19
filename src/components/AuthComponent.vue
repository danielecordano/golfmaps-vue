<template>
  <div class="auth">
    <amplify-authenticator></amplify-authenticator>
  </div>
</template>
<script>
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";
export default {
  name: "AuthComponent",
  created() {
    onAuthUIStateChange((nextAuthState, authData) => {
      if (nextAuthState === AuthState.SignedIn) {
        this.$router.go(-1);
      }
    });
  },
};
</script>
<style>
.auth {
  margin: 0 auto;
  width: 460px;
}
</style>