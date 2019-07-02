import _ from 'lodash'
export default {
  state: {
    classifyCode: [
      {key: 'none', classify: '未知', options: []},
      {key: 'attr', classify: '属性', options: []},
      {key: 'isYOrN', classify: '是否', options: [{code: 'Y', name: '是'}, {code: 'N', name: '否'}]},
      {key: 'yOrNOrAll', classify: '是否', options: [{code: null, name: '全部'}, {code: 'Y', name: '是'}, {code: 'N', name: '否'}]},
      {key: 'terminal', classify: '是否', options: [{code: 'T1', name: 'T1'}, {code: 'T2', name: 'T2'}, {code: 'T3', name: 'T3'}]},
      {key: 'inOutFlag', classify: '进出标识', options: []},
      {key: 'lugMarkType', classify: '行李标记类型', options: []},
      {key: 'resourceType',
      classify: '功能资源',
      options: [
        {code: 1, name: '顶部菜单'},
        {code: 2, name: '菜单'},
        {code: 3, name: '按钮'}
      ]},
      {key: 'status',
      classify: '状态',
      options: [
        {code: 0, name: '启用'},
        {code: 1, name: '禁用'}
      ]},
      {key: 'gender',
      classify: '性别',
      options: [
        {code: 'M', name: '男'},
        {code: 'F', name: '女'}
      ]}
    ]
  },
  getters: {
    getClassifyCode: state => {
      return state.classifyCode
    },
    getOptions: (state) => (key) => {
      let obj = state.classifyCode.find(todo => todo.key === key)
      let options = []
      if (obj) {
        options = obj.options
      }
      return options
    },
    getName: (state) => (conf) => {
      let value = conf.value
      let obj = state.classifyCode.find(todo => todo.key === conf.key)
      if (obj) {
        let item = obj.options.find(todo => todo.code == conf.value)
        if (item) {
          value = item.name
        }
      }
      return value
    }
  },
  mutations: {
    createEnum (state, data) {
      this.commit('setAllClassify', data)
    },
    setAllClassify (state, data) {
      let types = _.map(_.intersectionBy(data, 'classify'), 'classify')
      if (types.length) {
        types.forEach(type => {
          var isExist = state.classifyCode.some(val => {
            return type === val.classify
          })
          if (!isExist) {
            state.classifyCode.push(
              {key: 'null', classify: type, options: []}
            )
          }
        })
      }+
      state.classifyCode.forEach(classify => {
        data.forEach(item => {
          if (item.classify === classify.classify) {
            classify.options.push(
              {code: item.code, name: item.name, sortkey: item.sortkey, remark: item.remark}
            )
          }
        })
      })
    }
  },
  actions: {
  }
}
