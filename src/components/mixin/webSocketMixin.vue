<script>
var heartCheck = {
    timeout: 1000,//60s  1s
    timeoutObj: null,
    reset: function(){
        clearInterval(this.timeoutObj);
        this.start();
        console.log('reset')
    },
    start: function(){
      this.timeoutObj = setInterval(function(){
          if(websocket.readyState==1){
              websocket.send("HeartBeat");
          }
      }, this.timeout)
      console.log('reset')
    }
};
export default {
  data () {
    return {
      ws: null
    }
  },
  created () {
    this.initWebSocket()
  },
  destroyed () {
    this.websocketClose('退出登录', true)
  },
  methods: {
    // 初始化websocket
    initWebSocket () {
      this.$store.commit('setConfigValue', 'wsUrl')
      const wsURL = this.$store.getters.getConfigValue
      // let wsURL = 'ws://10.254.1.4:8989/boms/online/websocket'
      this.ws = new WebSocket('ws://10.255.1.4:8989/boms/online/websocket')
      this.ws.onopen = this.websocketOnOpen
      this.ws.onerror = this.websocketOnError
      this.ws.onmessage = this.websocketOnMessage
      this.ws.onclose = this.websocketClose
    },
    // 连接websocket
    websocketOnOpen () {
      console.log('websocket连接成功！ws')
      heartCheck.start()
    },
    // websocket错误
    websocketOnError (e) {
      console.log('websocket错误信息：' + e)
    },
    // websocket消息
    websocketOnMessage (e) {
      var resData = JSON.parse(e.data)
      console.log('消息更新')
      this.customWsOnMessage(resData)
      heartCheck.reset()
      // todo 业务逻辑
    },
    // 关闭websocket
    websocketClose (e, status) {
      console.log('websocket关闭信息：' + e)
      if (!status) {
        this.initWebSocket()
      }
    }
  }
}
</script>
