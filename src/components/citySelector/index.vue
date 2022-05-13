<template>
  <a-cascader
    :field-names="{
      label: 'name',
      value: 'adcode',
      children: 'children',
    }"
    :options="city"
    :show-search="{ filter }"
    v-model:value="center"
    placeholder="搜索或选择中心点"
    @change="change"
  />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import city from "./data/location.json";
const center = ref([120.619585, 31.299379]);

const $emit = defineEmits(["change"]);
// const $props = defineProps({});

const change = (value: any, selectedOptions: any) => {
  if (selectedOptions?.length > 0) {
    center.value = selectedOptions[1]?.center;
    $emit("change", center.value);
  }
};

// 中心点搜索
const filter = (inputValue: string, path: any) => {
  return path.some(
    (option: any) =>
      option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
  );
};
</script>

<style lang="scss" scoped></style>
