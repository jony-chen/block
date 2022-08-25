<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
  <!-- <UploadInfo></UploadInfo> -->
  <!-- <GetInfo></GetInfo> -->
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  provide() {
      return {
          reload: this.reload
      };
  },
  data() {
      return {
          isRouterAlive: true
      };
  },
  created() {
  },
  mounted() {
  },
  methods: {
      reload() {
          this.isRouterAlive = false;
          this.$nextTick(function () {
              this.isRouterAlive = true;
          });
      }
   }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0 auto;
}
</style>

