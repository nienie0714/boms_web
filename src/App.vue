<template>
  <div id="app" @mousemove="onMousemMove">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  // height: 100vh;
  // width: 100vw;
  height: 100%;
  width: 100%;
  min-width: 1730px;
  position: relative;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
<script>
    export default {
        methods: {
            onMousemMove (e) {
                this.$store.commit('mouseMove', e);
            }
        }
    }
</script>
