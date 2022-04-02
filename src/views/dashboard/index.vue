<template>
  <section class="adapter-container">
    <a-row :gutter="[8, 8]">
      <a-col :span="10">
        <a-row class="adapter-container-items">
          <a-col :span="24">
            <Uploader @uploaded="uploaded"></Uploader>
          </a-col>
        </a-row>
        <a-row class="adapter-container-items">
          <a-col :span="24">
            <Transform
              @rebuild="rebuild"
              :iptStyle="state.uploadStyle"
            ></Transform>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="14">
        <a-collapse v-model:activeKey="state.activeKey" :bordered="false">
          <template #expandIcon="{ isActive }">
            <AntIcon icon="CaretRightOutlined" :rotate="isActive ? 90 : 0" />
          </template>
          <a-collapse-panel key="1" header="原始样式" :style="customStyle">
            <Higlight :code="state.uploadStyle" :hasTools="false"></Higlight>
          </a-collapse-panel>
          <a-collapse-panel key="2" header="当前生成" :style="customStyle">
            <Higlight
              :code="state.rebuildStyle"
              :fileName="state.fileName"
              :hasTools="true"
            ></Higlight>
          </a-collapse-panel>
        </a-collapse>
      </a-col>
    </a-row>
  </section>
</template>

<script lang="ts" setup>
import Uploader from "@cmp/uploader/index.vue";
import Higlight from "@cmp/higlight/index.vue";
import AntIcon from "@cmp/icon";
import Transform from "./components/transform.vue";
import { reactive } from "vue";
const customStyle =
  "background: #f7f7f7;border-radius: 4px;margin-bottom: 10px;border: 0;overflow: hidden";
const state = reactive({
  uploadStyle: {},
  rebuildStyle: {},
  activeKey: [1],
  fileName: "",
});

const uploaded = (value: any): void => {
  state.uploadStyle = value;
  state.activeKey = [1];
};

const rebuild = (props: { newStyle: object; fileName: string }): void => {
  const { newStyle, fileName } = props;
  state.rebuildStyle = newStyle;
  state.fileName = fileName;
  state.activeKey = [2];
};
</script>

<style lang="scss" scoped>
.adapter-container {
  &-items {
    box-shadow: 0 0 4px 1px #d5d5d5;
    padding: 20px;
    border-radius: 20px;
    margin-bottom: 20px;
  }
}
</style>
