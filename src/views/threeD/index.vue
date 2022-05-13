<template>
  <section>
    <section id="renderBoxElement"></section>
  </section>
</template>

<script lang="ts" setup>
import * as THREE from "three";
import { TilesRenderer } from "3d-tiles-renderer";
import { onMounted } from "vue";
const renderBox = {
  width: 1080,
  height: 500,
};
const camera = new THREE.PerspectiveCamera(
  70,
  renderBox.width / renderBox.height,
  0.01,
  10
);
camera.position.z = 1;
const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(renderBox.width, renderBox.height);

onMounted(() => {
  // const tilesRenderer = new TilesRenderer("/3dtiles_day/tileset.json");
  const tilesRenderer = new TilesRenderer(
    "https://nasa-ammos.github.io/3DTilesRendererJS/example/data/tileset.json"
  );
  console.log(tilesRenderer);

  tilesRenderer.setCamera(camera);
  tilesRenderer.setResolutionFromRenderer(camera, renderer);
  scene.add(tilesRenderer.group);

  const renderLoop = () => {
    requestAnimationFrame(renderLoop);

    // The camera matrix is expected to be up to date
    // before calling tilesRenderer.update
    camera.updateMatrixWorld();
    tilesRenderer.update();
    renderer.render(scene, camera);
  };
  renderLoop();
  document.getElementById("renderBoxElement")?.appendChild(renderer.domElement);
});
</script>

<style lang="scss" scoped>
#renderBoxElement {
  width: 100%;
  height: 100%;
}
</style>
