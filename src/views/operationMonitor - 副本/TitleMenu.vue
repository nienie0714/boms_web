<template>
  <div class="main-content">
    <div class="menu-title">
      {{terminalName}}
    </div>
    <div class="monitor-type">
      <tabs :tabsData="tabsData" @tabItemClick="tabItemClick"></tabs>
    </div>
    <div class="tranfer-lug"><input type="checkbox" name="like" value="0">只看中转行李</div>
    <div class="back-home" @click="backHome"><img src="~@img/icon/icon_back_home.png" alt="返回"></div>
  </div>
</template>

<script>
let gis = require('gis')
import Tabs from '@view/Tabs/Tabs'

export default {
  components: {
    Tabs
  },
  props: {
    terminalName: {
      type: String,
      default: "T1航站楼"
    }
  },
  data () {
    return {
      tabsData: [
        {
          key: 'D',
          label: '出港监控',
        },
        {
          key: 'A',
          label: '进港监控',
        }
      ],
      home: ''
    } 
  },
  created () {
    this.home = window.location.origin + '/#/operationMonitor'
  },
  beforeDestroy() {
    gis.Map.removeMap("mapT3")
    gis.Map.removeMap("mapAt3")
  },
  methods: {
    backHome() {
      window.location.href = this.home
    },
    tabItemClick(event) {
      let mapAt3 = document.getElementById("mapAt2")
      if (event == "A") {
        mapAt3.style.zIndex = 1
      } else {
        mapAt3.style.zIndex = -1
      }
    }
  }
}
</script>

<style lang="scss" scope>
.main-content {
  position: absolute;
  width: 100%;
  height: 10%;
  background: #012035;
  z-index: 3;
}

.menu-title {
  position: absolute;
  top: 20px;
  left: 2%;
  font-size: 32px;
  font-family: 'DINPro-Medium';
  color: #DBE7EF;
}

.monitor-type {
  position: absolute;
  right: 50%;
  top: 20px;
  z-index: 9999;
}

.back-home {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 9999;
  cursor: pointer;
}

.back-home img {
  width: 40px;
  height: 40px;
}

.tranfer-lug {
  position: absolute;
  top: 20px;
  left: 1050px;
  width: 166px;
  height: 38px;
  background:rgba(190,225,255,0.1);
  box-shadow:0px 0px 40px 0px rgba(2,2,2,0.6);
  border-radius:18px;
  font-size: 16px;
  font-family: 'Microsoft YaHei';
  color: #fff;
  line-height: 38px;
  z-index: 9999;
}

input[type=checkbox]{
    -webkit-appearance: none;
    vertical-align:middle;
    margin-top:0;
    margin-right: 12px;
    border:rgba(255,255,255,0.2) solid 1px;
    border-radius: 4px;
    width: 18px;
    height: 18px;
    outline: none;
    position: relative;
    background: rgba(255,255,255,0.2);
}

input[type=checkbox]:checked::after{
    content: '';
    top: 5px;
    left: 4px;
    position: absolute;
    background: transparent;
    border: #fff solid 2px;
    border-top: none;
    border-right: none;
    height: 4px;
    width: 8px;
    -moz-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
    color:#fff;
}

.monitor-type .tabs-parent {
  font-size: 16px;
  font-family: 'Microsoft YaHei';
  color: #fff;
  line-height: 16px;
}

.monitor-type .tabs-parent .tabs{
  background: rgba(190,225,255,0.2);
}

.monitor-type .tabs-parent .tabs .tab-item.current-item{
  width: 143px;
  height: 32px;
  background: linear-gradient(-90deg,rgba(105,107,255,0.4),rgba(80,185,240,0.4));
  border-radius: 16px;
  font-size: 16px;
  font-family: 'Microsoft YaHei';
  color:#fff;
  line-height: 16px;
}

.monitor-type .tabs-parent .tabs .tab-item:not(:last-child) > div {
  border: none;
}

.monitor-type .tabs-parent .tabs .tab-item{
  color: #fff;
}
</style>