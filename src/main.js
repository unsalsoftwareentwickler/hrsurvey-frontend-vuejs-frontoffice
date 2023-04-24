import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import i18n from './plugins/i18n'
import router from './router'
import store from './store/index'
import axios from 'axios'
import VueExcelXlsx from 'vue-excel-xlsx'
import Fullscreen from 'vue-fullscreen'
import JsonCSV from 'vue-json-csv'
import VueYouTubeEmbed from 'vue-youtube-embed'
import FlagIcon from 'vue-flag-icon'

Vue.use(FlagIcon)
Vue.use(VueYouTubeEmbed)
Vue.use(Fullscreen)
Vue.use(VueExcelXlsx)
Vue.component('downloadCsv',JsonCSV)
Vue.config.productionTip = false
Vue.prototype.$http=axios

const token=localStorage.getItem('token')
if(token){
  Vue.prototype.$http.defaults.headers.common['Authorization'] =token
}

new Vue({
  store,
  vuetify,
  i18n,
  router,
  render: h => h(App)
}).$mount('#app')
