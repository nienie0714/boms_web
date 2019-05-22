export default {
  state: {
    firstTime: true,
    lastUpdateTime: '',
    route: [
      {
        name: ''
      }
    ]
  },
  getters: {
    getFirstTime: state => {
      return state.firstTime
    },
    getLastUpdateTime: state => {
      return state.lastUpdateTime
    },
    getHomeRouterData: state => {
      return state.homeRouterData
    }
  },
  mutations: {
    changeInsTime (state) {
      state.firstTime = false
    },
    setLastUpdateTime (state, time) {
      state.lastUpdateTime = time
    }
  },
  actions: {
    changeInsTime (context) {
      context.commit('changeInsTime')
    }
  }
}
