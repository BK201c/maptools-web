<template>
  <section class="trans-styles-container">
    <a-row class="trans-styles-items">
      <a-col :span="24">
        <a-space>
          <span>Source Layers:</span>
          <a-checkbox
            v-for="(value, key) in state.layerGroup"
            :checked="state.checkedGroup.includes(key)"
            @change="layerCheck(key)"
            >{{ key }}</a-checkbox
          >
          <span v-if="isEmpty(state.layerGroup)">Waiting for upload file?</span>
        </a-space>
      </a-col>
    </a-row>
    <a-row class="trans-styles-items">
      <a-col :span="24">
        <a-space>
          <span>Target Version:</span>
          <a-radio-group v-model:value="state.version" @change="changeVersion">
            <a-radio value="v3">v3</a-radio>
            <a-radio value="v2">v2</a-radio>
          </a-radio-group>
        </a-space>
      </a-col>
    </a-row>
    <a-row class="trans-styles-items" v-if="state.version === 'v2'">
      <a-col :span="24">
        <a-space>
          <span>Default Scenes:</span>
          <a-select
            v-model:value="state.scense"
            :options="state.options"
            mode="multiple"
            placeholder="Please select"
            style="width: 200px"
          >
          </a-select>
        </a-space>
      </a-col>
    </a-row>
    <a-row class="trans-styles-items">
      <a-col :span="24">
        <a-space>
          <span>Need Proxy:</span>
          <a-switch v-model:checked="state.isNeedProxy" />
        </a-space>
      </a-col>
    </a-row>
    <a-row class="trans-styles-items" v-if="state.isNeedProxy">
      <a-col :span="24">
        <a-space>
          <span>Target Host:</span>
          <a-input v-model:value="state.targetHost" placeholder="Host" />
        </a-space>
      </a-col>
    </a-row>
    <a-row class="trans-styles-items" v-if="state.isNeedProxy">
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
import { pull, pick, cloneDeep, isEmpty } from "lodash";
import { message } from "ant-design-vue";
import dayjs from "dayjs";
const $emit = defineEmits(["rebuild", "changeVersion"]);
const $props = defineProps({
  iptStyle: {
    type: [Object, String],
  },
});
interface form {
  checkAll: boolean;
  layerGroup: { [key: string | number]: any };
  checkedGroup: any[];
  scense: string[];
  options: { [key: string]: string }[];
  targetLayer: string;
  targetHost: string;
  targetMapName: string;
  version: string;
  isNeedProxy: boolean;
}
const state = reactive(<form>{
  checkAll: false,
  layerGroup: {},
  checkedGroup: [],
  scense: [],
  options: [],
  targetLayer: "",
  targetHost: "@kedacom.com",
  targetMapName: "local_map",
  version: "v3",
  isNeedProxy: true,
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
    pull(state.checkedGroup, key);
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
    if (styles instanceof Array && styles.length > 0) {
      layers = styles.reduce(
        (pre, cur, i) =>
          Object.assign(pre, { [cur.layer || `layer${i}`]: cur }),
        {}
      );
    }

    Object.assign(state.layerGroup, layers);
    state.options = [
      ...Object.keys(layers).map((v) =>
        Object.assign({}, { label: v, value: v })
      ),
    ];
    state.scense = Object.keys(layers); //默认选中所有图层
    state.checkedGroup = [];
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
        default: state.scense,
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
      originPathStr = `${url.pathname.slice(1)}${url.search}`;
    }
    const fullReverseUrl: string = decodeURI(
      `${state.targetHost}/${mapServerPath}/threeMap/${state.targetMapName}/${originPathStr}`
    );
    return fullReverseUrl;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//获取转换版本后的图层
const getReverseLayer = () => {
  if (!isEmpty(state.checkedGroup)) {
    const layers: { [key: string]: any } = cloneDeep(
      pick(state.layerGroup, state.checkedGroup)
    );
    for (const key in layers) {
      if (Object.prototype.hasOwnProperty.call(layers, key)) {
        const element = layers[key];
        if (state.isNeedProxy) {
          element.url = replaceTargetUrl(element.url, state.version);
          Object.assign(element, { auth: true });
        } else {
          Object.assign(element, { auth: false });
        }
      }
    }
    const newStyle = generatedStyle(layers, state.version);
    const dayjsTime = dayjs(`${new Date()}`).format("YYYY-MM-DD HH:mm:ss");
    const fileName = `style_${state.version}_[ ${state.checkedGroup.join(
      "&"
    )} ]_${dayjsTime}.json`;
    $emit("rebuild", { newStyle, fileName });
  } else {
    message.warning("未勾选组合图层");
  }
};
</script>

<style lang="scss" scoped>
.trans-styles {
  &-items {
    margin-top: 10px;
    user-select: none;
  }
  &-container {
    .button {
      position: absolute;
      right: 20px;
      z-index: 88;
      top: 40%;
    }
  }
}
</style>
