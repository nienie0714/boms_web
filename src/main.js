import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store/index'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/style/custom.scss'
import '@/style/more.scss'
import '@/style/iconfont/iconfont.css'
import '@/style/gis/ol.css'
import '@/style/gis/vxgplayer-1.8.54.min.css'
import { axiosReq, axiosReqj } from '@/axios.conf'
import MyDialog from '@view/Dialog/Dialog.vue'
import Message from '@view/Message/'
import * as filters from '@view/Filters/'
// import LoaderAuto from '@view/LoaderAuto/'
import echarts from 'echarts'
import vxgplayer from 'vxgplayer'
import './util/formateFont'

Vue.use(iView)
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.axios = axiosReq
Vue.prototype.axiosj = axiosReqj
Vue.component('my-dialog', MyDialog)
Vue.use(Message)
Object.keys(filters).forEach(key => {
  Vue.prototype[key] = filters[key]
})
// Vue.use(LoaderAuto)
Vue.prototype.$echarts = echarts;
Vue.use(vxgplayer)

new Vue({
  router,
  store,
  render: function (h) { return h(App) },
}).$mount('#app')
