import Vue from 'vue'
import vuex from 'vuex'
import enumStore from './modules/enum'
import configStore from './modules/config'
import baseStore from './modules/baseStore'
import eventStore from './modules/event'

Vue.use(vuex);

export default new vuex.Store({
  modules: {
    enum: enumStore,
    config: configStore,
    base: baseStore,
    event: eventStore
  }
})
