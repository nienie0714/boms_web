import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/index'
import {postData} from '@/util/base'

Vue.use(Router)

var router = new Router({
    mode: 'hash',
    routes: [
        {
            path: '/',
            name: '登录',
            // redirect: to => {
            //   return { path: '/home' }
            // },
            component: r => require.ensure([], () => r(require('@/views/home/Login'), 'Login'))
        },
        {
            path: '/home',
            name: '首页',
            component: r => require.ensure([], () => r(require('@/views/home/Home'), 'Home')),
            // beforeEnter: (to, from, next) => {
            //   var resource = []
            //   var obj = {
            //     url: '/basicdata'
            //   }
            //   postData('basicdata/sysUser/queryResourceByUserId', obj).then(response => {
            //     resource = response.data.data
            //     localStorage.setItem('userResource', JSON.stringify(resource))
            //     postData('sysconfig/listSysParams', null).then(res => {
            //       store.commit('setConfigs', res.data.data)
            //       next()
            //     })
            //   })
            // },
            children: [
                {
                    path: '/comprhsQuery',
                    name: '信息查询',
                    component: r => require.ensure([], () => r(require('@/views/home/module/ComprhsQuery'), 'ComprhsQuery')),
                    children: [
                        {
                            path: 'flights',
                            name: '航班信息查询',
                            component: r => require.ensure([], () => r(require('@/views/comprhsQuery/Flights'), 'Flights'))
                        },
                        {
                            path: 'luggages',
                            name: '行李信息查询',
                            component: r => require.ensure([], () => r(require('@/views/comprhsQuery/Luggages'), 'Luggages')),
                        }
                    ]
                },
                {
                    path: '/config',
                    name: '配置管理',
                    component: r => require.ensure([], () => r(require('@/views/home/module/Config'), 'Config')),
                    children: [
                        {
                            path: 'department',
                            name: '部门管理',
                            component: r => require.ensure([], () => r(require('@/views/config/Department'), 'Department')),
                        },
                        {
                            path: 'employee',
                            name: '人员管理',
                            component: r => require.ensure([], () => r(require('@/views/config/Employee'), 'Employee')),
                        },
                        {
                            path: 'user',
                            name: '用户管理',
                            component: r => require.ensure([], () => r(require('@/views/config/User'), 'User')),
                        },
                        {
                            path: 'role',
                            name: '角色管理',
                            component: r => require.ensure([], () => r(require('@/views/config/Role'), 'Role')),
                        },
                        {
                            path: 'systemParam',
                            name: '系统参数配置',
                            component: r => require.ensure([], () => r(require('@/views/config/SystemParam'), 'SystemParam')),
                        },
                        {
                            path: 'baseData',
                            name: '基础数据维护',
                            component: r => require.ensure([], () => r(require('@/views/config/Basicdata'), 'Basicdata')),
                            children:[
                                {
                                    path: 'terminal',
                                    name: '航站楼',
                                    component: r => require.ensure([], () => r(require('@/views/config/Terminal'), 'Terminal')),
                                },
                                {
                                    path: 'stand',
                                    name: '机位',
                                    component: r => require.ensure([], () => r(require('@/views/config/Stand'), 'Stand')),
                                },
                                {
                                    path: 'chute',
                                    name: '行李滑槽',
                                    component: r => require.ensure([], () => r(require('@/views/config/Chute'), 'Chute')),
                                },
                                {
                                    path: 'turnplate',
                                    name: '行李转盘',
                                    component: r => require.ensure([], () => r(require('@/views/config/Turnplate'), 'Turnplate')),
                                },
                                {
                                    path: 'airline',
                                    name: '航空公司',
                                    component: r => require.ensure([], () => r(require('@/views/config/Airline'), 'Airline')),
                                },
                                {
                                    path: 'counter',
                                    name: '值机柜台',
                                    component: r => require.ensure([], () => r(require('@/views/config/Counter'), 'Counter')),
                                },
                                {
                                    path: 'classifyCode',
                                    name: '分类信息',
                                    component: r => require.ensure([], () => r(require('@/views/config/ClassifyCode'), 'ClassifyCode')),
                                },
                                {
                                    path: 'standGate',
                                    name: '登机口',
                                    component: r => require.ensure([], () => r(require('@/views/config/StandGate'), 'StandGate')),
                                },
                            ]
                        },
                        {
                            path: 'lugEnter',
                            name: '行李保障补录',
                            component: r => require.ensure([], () => r(require('@/views/lugManagement/LugEnter'), 'LugEnter')),
                        },
                        {
                            path: 'operationSchedule',
                            name: '排班管理',
                            component: r => require.ensure([], () => r(require('@/views/operationSchedule/TaskSchedule'), 'TaskSchedule')),
                            children: [
                                {
                                    path: 'teamManagement',
                                    name: '班组信息管理',
                                    component: r => require.ensure([], () => r(require('@/views/operationSchedule/TeamManagement'), 'TeamManagement')),
                                },
                                {
                                    path: 'scheduleTemplate',
                                    name: '排班模板管理',
                                    component: r => require.ensure([], () => r(require('@/views/operationSchedule/ScheduleTemplate'), 'ScheduleTemplate')),
                                },
                                {
                                    path: 'sortSchedule',
                                    name: '分拣排班管理',
                                    component: r => require.ensure([], () => r(require('@/views/operationSchedule/SortSchedule'), 'SortSchedule')),
                                },
                                {
                                    path: 'loadSchedule',
                                    name: '员工上岗查询',
                                    component: r => require.ensure([], () => r(require('@/views/operationSchedule/LoadSchedule'), 'LoadSchedule')),
                                },
                                {
                                    path: 'statusMonitor',
                                    name: '状态监控甘特图',
                                    component: r => require.ensure([], () => r(require('@/views/operationSchedule/StatusMonitor'), 'StatusMonitor')),
                                },
                            ]
                        },
                        {
                            path: 'protection',
                            name: '保障业务协同管理',
                            component: r => require.ensure([], () => r(require('@/views/config/Basicdata'), 'Basicdata')),
                            children: [
                                {
                                    path: 'safeguardFlight',
                                    name: '航班保障',
                                    component: r => require.ensure([], () => r(require('@/views/protection/SafeguardFlight'), 'SafeguardFlight'))
                                },
                                {
                                    path: 'processManage',
                                    name: ' 业务流程管理',
                                    component: r => require.ensure([], () => r(require('@/views/protection/ProcessManage'), 'ProcessManage')),
                                    children: [
                                        {
                                            path: 'node',
                                            name: '作业节点管理',
                                            component: r => require.ensure([], () => r(require('@/views/protection/Node'), 'Node')),
                                        },
                                        {
                                            path: 'filterCondtion',
                                            name: '过滤条件定义',
                                            component: r => require.ensure([], () => r(require('@/views/protection/FilterCondtion'), 'FilterCondtion')),
                                        },
                                        {
                                            path: 'processes',
                                            name: '流程关系管理',
                                            component: r => require.ensure([], () => r(require('@/views/protection/Processes'), 'Processes')),
                                        }
                                    ]
                                },
                                {
                                    path: 'standard',
                                    name: '标准时间维护',
                                    component: r => require.ensure([], () => r(require('@/views/protection/Standard'), 'Standard')),
                                    children: [
                                        {
                                            path: 'stand',
                                            name: '机位',
                                            component: r => require.ensure([], () => r(require('@/views/protection/Stand'), 'Stand')),
                                        },
                                        {
                                            path: 'aircraftType',
                                            name: '机型',
                                            component: r => require.ensure([], () => r(require('@/views/protection/AircraftType'), 'AircraftType')),
                                        },
                                        {
                                            path: 'counter',
                                            name: '值机柜台',
                                            component: r => require.ensure([], () => r(require('@/views/protection/Counter'), 'Counter')),
                                        }
                                    ]
                                },
                                
                            ]
                        },
                        {
                            path: 'messageManagement',
                            name: '消息管理',
                            component: r => require.ensure([], () => r(require('@/views/protection/MessageManagement'), 'MessageManagement')),
                            children: [
                                {
                                    path: 'messageNotice',
                                    name: '通知公告',
                                    component: r => require.ensure([], () => r(require('@/views/protection/messageManagement/MessageNotice'), 'MessageNotice')),
                                },
                                {
                                    path: 'messageDefine',
                                    name: '消息定义',
                                    component: r => require.ensure([], () => r(require('@/views/protection/messageManagement/MessageDefine'), 'MessageDefine')),
                                },
                                {
                                    path: 'messageAlertSettings',
                                    name: '预警设置',
                                    component: r => require.ensure([], () => r(require('@/views/protection/messageManagement/MessageAlertSettings'), 'MessageAlertSettings')),
                                },
                                {
                                    path: 'messageBind',
                                    name: '消息绑定',
                                    component: r => require.ensure([], () => r(require('@/views/protection/messageManagement/MessageBind'), 'MessageBind')),
                                },
                                {
                                    path: 'messageRecord',
                                    name: '消息记录',
                                    component: r => require.ensure([], () => r(require('@/views/protection/messageManagement/MessageRecord'), 'MessageRecord')),
                                },
                                {
                                    path: 'messageNoticeRecord',
                                    name: '通知公告查询',
                                    component: r => require.ensure([], () => r(require('@/views/protection/messageManagement/MessageNoticeRecord'), 'MessageNoticeRecord')),
                                },
                            ]
                        },
                        {
                            path: 'logAudit',
                            name: '日志审计管理',
                            component: r => require.ensure([], () => r(require('@/views/config/LogAudit'), 'LogAudit')),
                        },
                        
                        {
                            path: 'scheduled',
                            name: '定时任务',
                            component: r => require.ensure([], () => r(require('@/views/config/Scheduled'), 'Scheduled')),
                        },
                        
                    ]
                },
                {
                    path: '/transfer',
                    name: '中转保障',
                    component: r => require.ensure([], () => r(require('@/views/home/module/Transfer'), 'Transfer')),
                    children: [
                        {
                            path: 'lugByFlight',
                            name: '中转行李按航班查询',
                            component: r => require.ensure([], () => r(require('@/views/transfer/LugByflight'), 'LugByflight')),
                        },
                        {
                            path: 'luggage',
                            name: '中转行李按时间查询',
                            component: r => require.ensure([], () => r(require('@/views/transfer/TransitLug'), 'TransitLug')),
                        },
                    ]
                },
                {
                    path: '/KPISystem',
                    name: '数据统计',
                    redirect: '/KPISystem/leaveLuggage',
                    component: r => require.ensure([], () => r(require('@/views/home/module/KPISystem'), 'KPISystem')),
                    children: [
                        {
                            path: 'leaveLuggage',
                            name: '出港行李统计',
                            component: r => require.ensure([], () => r(require('@/views/KPISystem/LeaveLuggage'), 'LeaveLuggage')),
                        },
                        {
                            path: 'enterLuggage',
                            name: '进港行李统计',
                            component: r => require.ensure([], () => r(require('@/views/KPISystem/EnterLuggage'), 'EnterLuggage')),
                        },
                        {
                            path: 'transStatistics',
                            name: '中转行李统计',
                            component: r => require.ensure([], () => r(require('@/views/KPISystem/TransStatistics'), 'TransStatistics')),
                        },
                        {
                            path: 'transBreakon',
                            name: '中转行李破损率',
                            component: r => require.ensure([], () => r(require('@/views/KPISystem/TransBreakon'), 'TransBreakon')),
                        },
                        {
                            path: 'workStatis',
                            name: '工作量统计',
                            component: r => require.ensure([], () => r(require('@/views/KPISystem/WorkStatis'), 'WorkStatis'))
                        },
                    ]
                }

            ]
        },
        {
            path: '/operationMonitor',
            name: '行李运行监控',
            component: r => require.ensure([], () => r(require('@/views/operationMonitor/GlobalSituation'), 'GlobalSituation')),
        },
        {
            path: '/mapT1',
            name: 'T1航站楼',
            component: r => require.ensure([], () => r(require('@/views/operationMonitor/MapT1'), 'MapT1')),
        },
        {
            path: '/mapT2',
            name: 'T2航站楼',
            component: r => require.ensure([], () => r(require('@/views/operationMonitor/MapT2'), 'MapT2')),
        },
        {
            path: '/mapT3',
            name: 'T3国内航站楼',
            component: r => require.ensure([], () => r(require('@/views/operationMonitor/MapT3'), 'MapT3')),
        },
        {
            path: '/mapInterT3',
            name: 'T3国际航站楼',
            component: r => require.ensure([], () => r(require('@/views/operationMonitor/MapInterT3'), 'MapInterT3')),
        },
        {
            path: '/situtation',
            name: '态势分析',
            component: r => require.ensure([], () => r(require('@/views/SituationAnalysis/Situtation'), 'Situtation')),
        },
    ]
})

router.beforeEach((to, from, next) => {
    // 要不要判断首次登录
    // if (to.path != '/') {
    // var token = localStorage.getItem('token')
    // if (token && token != '') {
    // if (store.getters.getFirstTime) {
    // var type = []
    postData('/base/classifyCode/queryAll', {}).then(response => {
        store.commit('createEnum', response.data.data)
        postData('/base/sysParam/queryAll', {}).then(res => {
            store.commit('setConfigs', res.data.data)
            next()
        })
    })
    next()
    // store.dispatch('changeInsTime')
    // } else {
    //   next()
    // }
    //   } else {
    //     router.push({path: '/'})
    //     next(false)
    //   }
    // } else {
    //   next()
    // }
})

export default router
