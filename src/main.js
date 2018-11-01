import Vue from 'vue'
import App from './App.vue'

import VueGitHubCorners from 'vue-gh-corners'
import 'vue-gh-corners/dist/vue-github-corners.css'

Vue.use(VueGitHubCorners)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
