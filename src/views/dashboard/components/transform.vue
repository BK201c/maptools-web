<template>
  <section class="trans-styles-container">
    <a-row class="trans-styles-items">
      <a-col :span="24">
        <a-space>
          <span>Source Layers:</span>
          <!-- <a-checkbox
            v-model:checked="state.checkAll"
            @change="onCheckAllChange"
          >
            全选
          </a-checkbox> -->
          <a-checkbox
            v-for="(value, key) in state.layerGroup"
            @change="layerCheck(key)"
            >{{ key }}</a-checkbox
          >
          <span v-if="_.isEmpty(state.layerGroup)">waiting for analyze</span>
        </a-space>
      </a-col>
    </a-row>
    <a-row class="trans-styles-items">
      <a-col :span="24">
        <a-space>
          <span>Target Version:</span>
          <a-radio-group v-model:value="state.version" @change="changeVersion">
            <a-radio value="v2">v2</a-radio>
            <a-radio value="v3">v3</a-radio>
          </a-radio-group>
        </a-space>
      </a-col>
    </a-row>
    <a-row class="trans-styles-items">
      <a-col :span="24">
        <a-space>
          <span>Target Host:</span>
          <a-input v-model:value="state.targetHost" placeholder="Host" />
        </a-space>
      </a-col>
    </a-row>
    <a-row class="trans-styles-items">
      <a-col :span="24">
        <a-space>
          <span>Target MapName:</span>
          <a-input v-model:value="state.targetMapName" placeholder="mapName" />
        </a-space>
      </a-col>
    </a-row>
    <a-button class="button" type="primary" @click="getReverseLayer" ghost
      >Create &nbsp;>></a-button
    >
  </section>
</template>

<script lang="ts" setup>
import { watch, toRaw, reactive } from "vue";
import _ from "lodash";
import { message } from "ant-design-vue";

const $emit = defineEmits(["rebuild", "changeVersion"]);
const $props = defineProps({
  iptStyle: {
    type: [Object, String],
  },
});
const state = reactive({
  checkAll: false,
  layerGroup: {},
  checkedGroup: <any>[],
  targetLayer: "",
  targetHost: "@kedacom.com",
  targetMapName: "local_map",
  version: "v3",
});

watch(
  () => $props.iptStyle,
  (newIptStyle) => {
    decodeLayers(toRaw(newIptStyle));
  },
  { deep: true }
);

// checkbox选中事件
const layerCheck = (key: any) => {
  if (state.checkedGroup.includes(key)) {
    _.pull(state.checkedGroup, key);
  } else {
    state.checkedGroup.push(key);
  }
  console.log(`选中${key}`, state.checkedGroup);
};

// 解析原始styles为单个图层列表
const decodeLayers = (styles: any) => {
  try {
    let layers: Object | Array<object> = [];
    if (styles.hasOwnProperty("layers")) layers = styles["layers"];
    if (styles.hasOwnProperty("2d")) layers = styles["2d"]["layers"];
    if (styles instanceof Array && styles.length > 0)
      layers = styles.reduce(
        (pre, cur, i) => Object.assign(pre, { [`layer${i}`]: cur }),
        {}
      );
    state.layerGroup = layers;
    console.log("已解析", state.layerGroup, layers);
    message.success("检测到样式文件，已解析");
  } catch (error) {
    console.log("样式文件解析失败", error);
    message.error("数据格式错误，解析失败！");
  }
};

const changeVersion = (e: Event) => {
  console.log("当前版本", state.version);

  $emit("changeVersion", e);
};

// 转换样式文件
const generatedStyle = (layers: object, version: string): {} => {
  const style: { [key: string]: any } = {
    v2: {
      isCompatibleEngine: true,
      projection: Object.values(layers)[0].projection,
      layers: layers,
      scenes: {
        default: [],
      },
      kmapServerUrl: "",
    },
    v3: {
      configType: "three",
      "3d": {
        content: [],
      },
      "2d": {
        layers: layers,
      },
    },
  };
  return style[version];
};

//替换样式文件地址
const replaceTargetUrl = (originFullUrl: string, version: string): string => {
  try {
    const url = new URL(originFullUrl);
    const pathList = url.pathname.split("/");
    const mapServerPath =
      version === "v2" ? "kmap-server" : "kmap-server-engine";
    let originPathStr: string = "";
    if (pathList[2] === "threeMap") {
      originPathStr = `${pathList.slice(4).join("/")}${url.search}`;
    } else {
      originPathStr = `${url.pathname}${url.search}`;
    }
    const fullReverseUrl: string = `${state.targetHost}/${mapServerPath}/threeMap/${state.targetMapName}${originPathStr}`;
    return fullReverseUrl;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//获取转换版本后的图层
const getReverseLayer = () => {
  const layers: { [key: string]: any } = _.cloneDeep(
    _.pick(state.layerGroup, state.checkedGroup)
  );
  for (const key in layers) {
    if (Object.prototype.hasOwnProperty.call(layers, key)) {
      const element = layers[key];
      element.url = replaceTargetUrl(element.url, state.version);
    }
  }
  const newStyle = generatedStyle(layers, state.version);
  const fileName = `style_${state.version}_[ ${state.checkedGroup.join(
    "&"
  )} ].json`;
  $emit("rebuild", { newStyle, fileName });
};
</script>

<style lang="scss" scoped>
.trans-styles {
  &-items {
    margin-top: 10px;
  }
  &-container {
    box-shadow: 0 0 4px 1px #d5d5d5;
    padding: 20px;
    border-radius: 20px;
    .button {
      position: absolute;
      right: 20px;
      z-index: 88;
      top: 40%;
    }
  }
}
</style>
