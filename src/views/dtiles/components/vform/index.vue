<template>
  <section>
    <a-divider orientation="left">接口参数</a-divider>
    <a-form
      :model="queryParams"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item label="服务地址" :wrapperCol="{ span: 16, offset: 0 }">
        <a-input
          v-model:value="queryParams.url"
          placeholder="http://xxx.xxxxx.com/vec_c/wmts"
          :allowClear="true"
        >
        </a-input>
      </a-form-item>

      <a-form-item label="初始位置"> </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button
          type="primary"
          size="large"
          @click="preview"
          shape="round"
          block
          >预览<a-icon type="arrow-right"
        /></a-button>
      </a-form-item>
    </a-form>
  </section>
</template>

<script lang="ts" setup>
// import { upload, citySelector } from "@/mixins";
import { reactive } from "vue";

const labelCol = { span: 5 };
const wrapperCol = { span: 12 };
const queryParams = reactive({
  url: "https://t3.tianditu.gov.cn/vec_c/wmts?tk=b789a2ea9a2f0fa03122984062eb1f35",
});
const position = [320000, 320500];
const isAdvanced = false;
const preview = () => {};
</script>

<style scoped lang="scss">
.submmit-button {
  width: 320px;
  position: fixed;
  left: 100px;
  top: 400px;
}
</style>
