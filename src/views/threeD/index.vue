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

const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
const material = new THREE.MeshNormalMaterial();

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(renderBox.width, renderBox.height);

// animation
const animation = (time: number) => {
  mesh.rotation.x = time / 2000;
  mesh.rotation.y = time / 1000;

  renderer.render(scene, camera);
};
renderer.setAnimationLoop(animation);
onMounted(() => {
  document.getElementById("renderBoxElement")?.appendChild(renderer.domElement);
});

// const tilesRenderer = new TilesRenderer("./path/to/tileset.json");
// tilesRenderer.setCamera(camera);
// tilesRenderer.setResolutionFromRenderer(camera, renderer);
// scene.add(tilesRenderer.group);

// renderLoop();

// function renderLoop() {
//   requestAnimationFrame(renderLoop);

//   // The camera matrix is expected to be up to date
//   // before calling tilesRenderer.update
//   camera.updateMatrixWorld();
//   tilesRenderer.update();
//   renderer.render(scene, camera);
// }
</script>

<style lang="scss" scoped>
#renderBoxElement {
  width: 100%;
  height: 100%;
}
</style>
