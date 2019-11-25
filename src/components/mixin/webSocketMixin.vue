<script>
export default {
  data () {
    return {
      ws: null,
      timeoutObj: null,
      timeout: 180000 // 3min
    }
  },
  created () {
    this.reset()
  },
  mounted() {
    this.initWebSocket()
  },
  destroyed () {
    this.reset()
    this.websocketClose('退出登录', true)
  },
  methods: {
    // 初始化websocket
    initWebSocket () {
      const wsURL = this.$store.getters.getConfigValue('wsUrl')
      if (wsURL != '') {
        this.ws = new WebSocket(`${wsURL}/${localStorage.getItem('username')}`)
        this.ws.onopen = this.websocketOnOpen
        this.ws.onerror = this.websocketOnError
        this.ws.onmessage = this.websocketOnMessage
        this.ws.onclose = this.websocketClose
        window.onbeforeunload = this.websocketClose
      }      
    },
    // 连接websocket
    websocketOnOpen () {
      clearInterval(this.timeoutObj);
      console.log('websocket连接成功！ws')
      this.websocketsend(`${localStorage.getItem('username')}--在线`);
    },
    // websocket错误
    websocketOnError (e) {
      console.log('websocket错误信息：' + e)
    },
    // websocket消息
    websocketOnMessage (e) {
      var resData = e.data
      console.log('消息更新', resData)
    },
    // 关闭websocket
    websocketClose (e, status) {
      console.log('websocket关闭信息：' + e)
      if (!status) {
        this.initWebSocket()
      }
    },
    reset() {
      clearInterval(this.timeoutObj)
    },
    websocketsend(Data){   
      let that = this
      this.timeoutObj = setInterval(function(){
        if(that.ws.readyState==1){
            that.ws.send(Data)
            // console.log('---------------发送数据成功-------------------')
        }
      }, this.timeout)
    }
  }
}
</script>
