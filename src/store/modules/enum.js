import _ from 'lodash'
export default {
  state: {
    classifyCode: [
      {key: 'none', classify: '未知', options: []},
      {key: 'attr', classify: '属性', options: []},
      {key: 'isYOrN', classify: '是否', options: [{code: 'Y', name: '是'}, {code: 'N', name: '否'}]},
      {key: 'yOrNOrAll', classify: '是否', options: [{code: null, name: '全部'}, {code: 'Y', name: '是'}, {code: 'N', name: '否'}]},
      {key: 'property', classify: '航站楼属性', options: [{code: null, name: '全部'}, {code: 'D', name: '国内'}, {code: 'I', name: '国际'}, {code: 'M', name: '混合'}, {code: 'R', name: '地区'}]},
      {key: 'property1', classify: '航站楼属性', options: [{code: 'D', name: '国内'}, {code: 'I', name: '国际'}, {code: 'M', name: '混合'}, {code: 'R', name: '地区'}]},
      {key: 'terminal', classify: '是否', options: [{code: 'T1', name: 'T1'}, {code: 'T2', name: 'T2'}, {code: 'T3', name: 'T3'}]},
      {key: 'inOutFlag', classify: '进出标识', options: []},
      {key: 'msgSubType', classify: '消息类型', options: [{code: null, name: '全部'},{code: 1, name: '航班动态'}, {code: 2, name: '任务派发'}, {code: 3, name: '中转消息'}, {code: 4, name: '通知公告'},{code: 5, name: '预警消息'}]},
      {key: 'lugMarkType', classify: '行李标记类型', options: []},
      {key: 'standType', classify: '机位类型', options: [{code: 'N', name: '普通机位'}, {code: 'P', name: '组合父机位'}, {code: 'C', name: '组合子机位'}, {code: 'H', name: '机库机位'}, {code: 'T', name: '临时机位'}]},
      {key: 'lugType', classify: '行李类型', options: [{code: 'other', name: '普通'}, {code: 'cancel', name: '拉减'}, {code: 'addition', name: '追加'}, {code: 'vip', name: 'VIP'}]},
      {key: 'securityStateD',
      classify: '出港保障状态',
      options: [
        {code: '0', name: '已值机'},
        {code: '1', name: '已分拣'},
        {code: '2', name: '已装机'}
      ]},
      {key: 'securityStateA',
      classify: '进港保障状态',
      options: [
        {code: '3', name: '已卸机'},
        {code: '4', name: '已上转盘'},
        {code: '5', name: '已提取'}
      ]},
      {key: 'orderStatus',
      classify: '中转执行状态',
      options: [
        {code: '1', name: '待中转'},
        {code: '2', name: '中断'},
        {code: '3', name: '已中转'}
      ]},
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
        {code: 1, name: '启用'},
        {code: 0, name: '禁用'}
      ]},
      {key: 'startFlag',
      classify: '启动标识',
      options: [
        {code: 1, name: '启用'},
        {code: 0, name: '暂停'}
      ]},
      {key: 'standlevel',
      classify: '机位等级',
      options: [
        {code: 'B', name: 'B'},
        {code: 'C', name: 'C'},
        {code: 'D', name: 'D'},
        {code: 'E', name: 'E'},
        {code: 'F', name: 'F'},
      ]},
      {key: 'status1',
      classify: '状态1',
      options: [
        {code: 'Y', name: '开放'},
        {code: 'N', name: '关闭'}
      ]},
      {key: 'msgPubStatus',
      classify: '发布状态',
      options: [
        {code: null, name: '全部'},
        {code: '1', name: '已发布'},
        {code: '2', name: '未发布'}
      ]},
      {key: 'gender',
      classify: '性别',
      options: [
        {code: 'M', name: '男'},
        {code: 'F', name: '女'}
      ]},
      {key: 'isFactoryParam',
      classify: '是否出厂参数',
      options: [
        {code: '1', name: '是'},
        {code: '0', name: '否'}
      ]},
      {key: 'cycle',
      classify: '排班周期',
      options: [
        {code: '1', name: '上一休一'},
        {code: '2', name: '上二休一'},
        {code: '3', name: '上二休二'}
      ]},
      {key: 'nodeNo',
      classify: '岗位角色',
      options: [
        {code: 'N-LOAD-TRUCK', name: '离港分拣'},
        {code: 'N-LOAD-AIRCRAFT', name: '卸车装机'},
        {code: 'N-UNLOAD-AIRCRAFT', name: '进港卸机'},
        {code: 'N-UPLOAD', name: '到达卸车'}
      ]},
      {key: 'arrtN',
      classify: '航站楼属性1',
      options: [
        {code: 'D', name: '国内'},
        {code: 'I', name: '国际'}
      ]},
      {key: 'workStatus',
      classify: '上班状态',
      options: [
        {code: '1', name: '上班'},
        {code: '2', name: '休息'},
      ]},
      {key: 'persOrAll',
      classify: '接收对象',
      options: [
        {code:1, name: '个人'},
        {code: 2, name: '全部'}
      ]},
	    {key: 'nodeType',
       classify: '节点类型',
       options: [
         { code: 'FN', name: '航班节点' },
         { code: 'LN', name: '行李节点' },
         { code: 'FLN', name: '航班行李节点' }
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
