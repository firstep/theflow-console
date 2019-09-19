import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Rest from './components/rest'
import Helper from './components/helper'
import vuetify from './plugins/vuetify'
import VuetifyDialog from 'vuetify-dialog'
import 'vuetify-dialog/dist/vuetify-dialog.css'

Vue.config.productionTip = false
Vue.prototype.$REST = Rest
Vue.prototype.$HELPER = Helper
Vue.prototype.$PERMISSION = Helper.permission
Vue.use(VuetifyDialog, {
  context: {
    vuetify
  }
})

let vm = new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

window.vm = vm
