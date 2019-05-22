import Message from './Message.vue'
import Vue from 'vue'

let MessageConstructor = Vue.extend(Message)
let seed = 1
let index = 2000
let duration = 3000 // 显示的时间 ms
let intervalTime = 100 // 显示的时间 ms
let animateTime = 500 // 动画时间,表示这个组件切换show的动画时间
const install = () => {
  let set = (type, conf) => {
    let id = 'message_' + seed++
    conf.type = type
    if (conf.hasOwnProperty('time')) {
      duration = conf.time * 1000
    }
    let instance = new MessageConstructor({
      propsData: conf
    })
    index++
    instance.id = id
    instance.vm = instance.$mount()
    document.body.appendChild(instance.vm.$el)
    instance.vm.$el.style.zIndex = index
    instance.vm.show = true
    let trans = () => {
      duration -= intervalTime
      if (duration < 0) {
        clearInterval(t1)
        instance.vm.show = false  //隐藏提示组件，此时会有300ms的动画效果，等动画效果过了再从body中移除dom
        var t2 = setTimeout(() => {
          clearTimeout(t2)
          document.body.removeChild(instance.vm.$el) //从body中移除dom
          instance.$destroy()
          instance.vm = null // 设置为null，好让js垃圾回收算法回收，释放内存
          duration = conf.time * 1000 || 3000
        }, animateTime)
      }
    }
    let t1 = setInterval(trans, intervalTime)
    instance.vm.$el.onmouseenter = (event) => {
      clearInterval(t1);
    }
    instance.vm.$el.onmouseleave = (event) => {
      t1 = setInterval(trans, intervalTime)
    }
    return instance.vm
  }
  Vue.prototype.$msg = {
    info (conf) {
      const msg = set('info', conf)
      return msg
    },
    success(conf) {
      const msg = set('success', conf)
      return msg
    },
    error(conf) {
      const msg = set('error', conf)
      return msg
    },
    warning(conf) {
      const msg = set('warning', conf)
      return msg
    }
  }
}
export default install