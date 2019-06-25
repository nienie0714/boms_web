import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store/index'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import '@/style/custom.scss'
import '@/style/more.scss'
import '@/style/iconfont/iconfont.css'
import { axiosReq, removePending } from '@/axios.conf'
import MyDialog from '@view/Dialog/Dialog.vue'
import Message from '@view/Message/'
import * as filters from '@view/Filters/'
// import LoaderAuto from '@view/LoaderAuto/'

Vue.use(iView)
Vue.config.productionTip = false
Vue.prototype.axios = axiosReq
Vue.prototype.removePending = removePending
Vue.component('my-dialog', MyDialog)
Vue.use(Message)
Object.keys(filters).forEach(key => {
  Vue.prototype[key] = filters[key]
})
// Vue.use(LoaderAuto)

new Vue({
  router,
  store,
  render: function (h) { return h(App) },
}).$mount('#app')
