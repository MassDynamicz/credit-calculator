<template>
  <div id="calcApp">
    <appTitle></appTitle>
    <CreditCalculator></CreditCalculator>
  </div>
</template>

<script>

import appTitle from './components/appTitle.vue';
import CreditCalculator from "./components/CreditCalculator.vue";

export default {
  components: {appTitle, CreditCalculator},
}
</script>