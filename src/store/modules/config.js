export default {
  state: {
    configs: [
      {key: 'wsUrl', classify: 'websocket_url', name: 'boms_websocket', value: ''},
      // {key: 'mqUrl', classify: 'web_mq_url', name: 'aoms-webmq', value: ''},
      {key: 'dfs', classify: 'file-url', name: 'file_root_url', value: ''},
      // {key: 'aptLoc', classify: 'apt_loc', name: 'aptIata-loc', value: ''}
    ],
    configValue: ''
  },
  getters: {
    getConfigs: state => {
      return state.configs
    },
    getConfigValue: (state) => (key) => {
      let value = ''
      let obj = state.configs.find(todo => todo.key === key)
      if (obj) {
        value = obj.value
      }
      return value
    }
    // getConfigValue: state => {
    //   return state.configValue
    // },
  },
  mutations: {
    setConfigs (state, configs) {
      state.configs.forEach(config => {
        configs.forEach(item => {
          if ((item.paramClassify === config.classify) && (item.paramName === config.name)) {
            config.value = item.paramValue
          }
        })
      })
    },
    setConfigValue (state, key) {
      for (var i = 0; i < state.configs.length; i++) {
        if (key === state.configs[i].key) {
          state.configValue = state.configs[i].value
          return
        }
      }
    }
  },
  actions: {
  }
}
