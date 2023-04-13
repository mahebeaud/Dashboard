<template>
  <div class="sidebar-app">
    <SideBar />
  </div>
  <div :style="{ 'margin-left': sideBarWidth }">
    <router-view />
  </div>
</template>

<script>
import SideBar from './components/SideBar.vue';
import { sideBarWidth } from './components/states';

export default {
  components: {
    SideBar,
  },
  setup() {
    return {
      sideBarWidth,
    };
  },
}
</script>

<style>

body {
  margin: 0;
  padding: 0;
  font-family: 'Roboto Mono', monospace;
  background-color: #212529;
  color: white;
  padding-left: 90px;
}

.sidebar-app {
  position: fixed;
  padding: 20px;
  top: 0;
  left: 0;
  bottom: 0;
  width: 230px;
  overflow: hidden;
}

</style>