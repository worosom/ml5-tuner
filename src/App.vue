<template lang="pug">
  #app(:data-loading="loading")
    tuner(v-on:loaded="loading = false")
</template>

<script>
import Tuner from './components/tuner'
import About from './components/about'

export default {
  name: 'app',
  components: {
    Tuner,
    About
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

</style>
