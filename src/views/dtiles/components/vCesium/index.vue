<template>
  <section id="cesiumContainer" style="width: 100%; height: 100%"></section>
</template>

<script lang="ts" setup>
import * as Cesium from "cesium";
import { onMounted } from "vue";
let viewer: any;
interface Props {
  tilesetUrl?: string;
  destination?: number[];
}
const $props = withDefaults(defineProps<Props>(), {
  tilesetUrl: "",
  destination: [106.3055, 38.4529, 370],
});
const initViewer = () => {
  const viewerOptions = {
    // terrainProvider: Cesium.createWorldTerrain(),
    geocoder: false, //右上角 搜索
    homeButton: false, //右上角 Home
    sceneModePicker: false, //右上角 2D/3D切换
    baseLayerPicker: false, //右上角 地形
    navigationHelpButton: false, //右上角 Help
    animation: false, // 左下角 圆盘动画控件
    timeline: false, //时间轴
    fullscreenButton: false, //右下角 全屏控件
    vrButton: false, // 如果设置为true，将创建VRButton小部件。
    scene3DOnly: true, // 每个几何实例仅以3D渲染以节省GPU内存
    infoBox: false, //隐藏点击要素后的提示信息
  };
  const viewer = new Cesium.Viewer("cesiumContainer", viewerOptions);
  // viewer.cesiumWidget._creditContainer.style.display = "none";
  return viewer;
};

const addExample = () => {
  // Add Cesium OSM buildings to the scene as our example 3D Tileset.
  const osmBuildingsTileset = Cesium.createOsmBuildings();
  viewer.scene.primitives.add(osmBuildingsTileset);

  // Set the initial camera to look at Seattle
  viewer.scene.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(-122.3472, 47.598, 370),
    orientation: {
      heading: Cesium.Math.toRadians(10),
      pitch: Cesium.Math.toRadians(-10),
    },
  });
};
const add3dtiles = () => {
  const tileset = new Cesium.Cesium3DTileset({
    url: "/3dtiles_day/tileset.json", //数据路径
    maximumScreenSpaceError: 2, //最大的屏幕空间误差
  });
  viewer.scene.primitives.add(tileset);
  viewer.scene.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(106.3055, 38.4529, 370),
    orientation: {
      heading: Cesium.Math.toRadians(10),
      pitch: Cesium.Math.toRadians(-10),
    },
  });
};

const clearAllModel = () => {};

onMounted(() => {
  viewer = initViewer();
});
</script>

<style lang="scss" scoped></style>
