<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
import tools from "boot/tools";
import Vue from "vue";
export default {
  name: "App",
  beforeCreate() {
    Vue.prototype.tools = tools;
  }
};
</script>
