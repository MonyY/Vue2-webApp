import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

// 插件
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

fastclick.attach(document.body)
Vue.use(VueLazyLoad, {
  loading: require('common/image/default.png')
})

// css
import 'common/stylus/index.styl'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
