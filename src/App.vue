<template>
  <div id="app">
    <h1>vue-h5-video-player</h1>
    <player>
      <div slot="source">
        <source src="movie.mp4" type="video/mp4">
        <source src="movie.ogg" type="video/ogg">
        <source src="movie.webm" type="video/webm">
      </div>
    </player>
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
  text-align: center;
}
h1 {
  font-size: 50px;
  font-weight: 700;
  color: rgba(242, 156, 177, 1);
}
</style>
