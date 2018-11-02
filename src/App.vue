<template lang="pug">
  #app(:data-loading="loading")
    tuner(v-on:loaded="loading = false")
    github-corners(repo="worosom/ml5-tuner" bg-color="#000" color="#AAA")
</template>

<script>
import Tuner from './components/tuner'

export default {
  name: 'app',
  components: {
    Tuner
  },
  data() {
    return {
      loading: true
    }
  }
}
</script>

<style lang="stylus">
#app
  height: 100%
  transition: opacity 400ms ease
  will-change: opacity
  &[data-loading="true"]
    opacity: 0.5

body, html
  height: 100%
  font-family: "Source Code Pro", monospace
  margin: 0

.github-corner
  svg
    position: fixed !important
    top: unset !important
    bottom: 0 !important
    transform: rotate(90deg)
</style>
