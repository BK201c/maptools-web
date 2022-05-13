<template>
  <section class="layout-3dtile">
    <div class="layout-3dtile-form">
      <vform></vform>
    </div>
    <div class="layout-3dtile-box">
      <vCesium></vCesium>
    </div>
  </section>
</template>

<script lang="ts" setup>
import vCesium from "./components/vCesium/index.vue";
import vform from "./components/vform/index.vue";
</script>

<style lang="scss" scoped>
.layout-3dtile {
  display: flex;
  width: 100%;
  height: 100%;
  &-form {
    width: 550px;
  }
  &-box {
    height: 100%;
    width: calc(100% - 550px);
  }
}
</style>
