<template>
  <div id="app">
    <picture>
            <source srcset="./assets/logo.webp" type="image/webp">
            <source srcset="./assets/logo.png" type="image/jpeg">
            <img alt="Vue logo" src="./assets/logo.png" />
          </picture>
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "App",
  components: {
    HelloWorld
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
