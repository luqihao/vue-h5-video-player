<template>
  <div id="app">
    <player/>
  </div>
</template>

<script>
import player from './components/player'

export default {
  name: 'app',
  components: {
    player
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
