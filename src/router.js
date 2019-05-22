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
      redirect: to => {
        return { path: '/home' }
      },
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
          path: 'comprhsQuery',
          component: r => require.ensure([], () => r(require('@/views/home/ComprhsQuery'), 'ComprhsQuery')),
          redirect: to => {
            return {path: '/flight'}
          },
          children: [
            {
              path: '/flight',
              name: '航班信息查询',
              component: r => require.ensure([], () => r(require('@/views/comprhsQuery/Flights'), 'Flights'))
            },
            {
              path: '/luggage',
              name: '行李信息查询',
              component: r => require.ensure([], () => r(require('@/views/comprhsQuery/Luggages'), 'Luggages')),
            }
          ]
        },
        {
          path: '/resourceManage',
          name: '基础信息',
          component: r => require.ensure([], () => r(require('@/views/home/ResourceManage'), 'ResourceManage')),
          children: [
            {
              path: '/config',
              name: '配置管理',
              redirect: to => {
                return {path: 'logAudit'}
              },
              children: [
                {
                  path: 'logAudit',
                  name: '日志审计管理',
                  component: r => require.ensure([], () => r(require('@/views/resource/config/LogAudit'), 'LogAudit')),
                }
              ]
            }
          ]
        }
      ]
    }
    // },
    // {
    //   path: '/',
    //   name: 'home',
    //   component: Home
    // },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: function () { 
    //     return import(/* webpackChunkName: "about" */ './views/About.vue')
    //   }
    // }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path != '/') {
    // var token = localStorage.getItem('token')
    // if (token && token != '') {
      // if (store.getters.getFirstTime) {
        // var type = []
        var all = []
        postData('/base/classifyCode/queryAll', {}).then(response => {
          store.commit('createEnum', response.data.data)
          postData('/base/sysParam/queryAll', {}).then(res => {
            store.commit('setConfigs', res.data.data)
            next()
          })
        })
        // store.dispatch('changeInsTime')
      } else {
        next()
      }
  //   } else {
  //     router.push({path: '/'})
  //     next(false)
  //   }
  // } else {
  //   next()
  // }
})

export default router
