<template>
<div class="main-content">
    <img src="~@img/gis/terminal.png" class="title-img" @click="backHome">
    <div class="menu-title">
      {{terminalName}}
    </div>
    <div class="monitor-type">
      <tabs :tabsData="tabsData" @tabItemClick="tabItemClick"></tabs>
    </div>
    <div class="tranfer-lug" v-if="inoutFlag == 'D'"><input type="checkbox" name="like" value="0" v-model="transfer" @change="chooseTransfer($event)">只看中转行李</div>
    <div class="button-arr">
      <div class="flight-list" @click="showFlight"><img src="~@img/gis/background.png" alt="背景" :style="flightStatus == false ? 'visibility:hidden':''"><img class="secondImg" :src="flightIcon" alt="航班列表" title="航班列表"></div>
      <div class="lug-list" @click="showPackage"><img src="~@img/gis/background.png" alt="背景" :style="packageStatus == false ? 'visibility:hidden':''"><img class="secondImg" :src="packageIcon" alt="进度" title="航班节点进度"></div>
      <div class="source-list" @click="showResource"><img src="~@img/gis/background.png" alt="背景" :style="sourceStatus == false ? 'visibility:hidden':''"><img class="secondImg" :src="sourceIcon" alt="资源" title="资源统计"></div>
    </div>
    <div class="zoom-control"><button class="zoom-in" type="button" title="放大" @click="zoomin">+</button><button class="zoom-out" type="button" title="缩小" @click="zoomout">−</button></div>
    <!-- <div class="back-home" @click="backHome"><img src="~@img/icon/icon_back_home.png" alt="返回"></div> -->
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
    },
    mapAtDom: {
      type: String,
      default: "mapAt1"
    },
    terminalType: {
      type: String,
      default: 'T1'
    },
    tabItemClick: {
      type: Function,
      default: () => {
      }
    },
    closeFlight: {
      type: Boolean,
      default: false
    },
    isClosePackage: {
      type: Boolean,
      default: false
    },
    isCloseSource: {
      type: Boolean,
      default: false
    },
    inoutFlag: {
      type: String,
      default: 'D'
    },
    param: { //最大最小级别
      type: Object,
      default: () => {
        return {
          minZoom: 7,
          maxZoom: 9
        }
      }
    },
    paramA: { //最大最小级别
      type: Object,
      default: () => {
        return {
           minZoom: 7,
           maxZoom: 9
        }
      }
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
      home: '',
      flightStatus: true,
      packageStatus: true,
      sourceStatus: true,
      flightIcon: "",
      packageIcon: "",
      sourceIcon: "",
      transfer: [],
      mapId: '',
      minZoom: '',
      maxZoom: ''
    } 
  },
  created () {
    this.home = window.location.origin + '/#/operationMonitor'
    this.flightIcon = require('@img/gis/flightChoose.png')
    this.packageIcon = require('@img/gis/packageChoose.png')
    this.sourceIcon = require('@img/gis/sourceChoose.png')
  },
  beforeDestroy() {
    gis.Map.removeMap("mapT3")
    gis.Map.removeMap("mapAt3")
  },
  methods: {
    getMapId () {
      let mapAt = document.getElementById(this.mapAtDom)
      if (!mapAt.style.zIndex || mapAt.style.zIndex == -1) { //当前地图是出港地图时
        this.mapId = 'mapT' + this.mapAtDom.split('mapAt')[1]
        this.minZoom = this.param.minZoom
        this.maxZoom = this.param.maxZoom
      }
      if (mapAt.style.zIndex == 1) { //当前地图是进港地图时
        this.mapId = this.mapAtDom
        this.minZoom = this.paramA.minZoom
        this.maxZoom = this.paramA.maxZoom
      } 
    },
    zoomin () {
      this.getMapId()
      let currentZoom = gis.Map.getMapObj(this.mapId).getView().getZoom()
      if (currentZoom < this.maxZoom) {
        gis.Map.setMapCenter({
          mapId: this.mapId,
          zoom: currentZoom + 1
        })
      }
    },
    zoomout () {
      this.getMapId()
      let currentZoom = gis.Map.getMapObj(this.mapId).getView().getZoom()
      if (currentZoom > this.minZoom) {
        gis.Map.setMapCenter({
          mapId: this.mapId,
          zoom: currentZoom - 1
        })
      }
    },
    chooseTransfer(event) {
      this.$emit("updateTransfer",event.target.checked)
      if (event.target.checked) {

      } else {

      }

      this.$emit('getTransferStatus', event.target.checked)
    },
    backHome() {
      window.location.href = this.home
    },
    showFlight () {
      this.flightStatus = !this.flightStatus
      this.flightIcon = this.flightStatus == false ? require('@img/gis/flight.png') : require('@img/gis/flightChoose.png')

      this.$emit('showFlightList',this.flightStatus)
    },
    showPackage() {
      this.packageStatus = !this.packageStatus
      this.packageIcon = this.packageStatus == false ? require('@img/gis/package.png') : require('@img/gis/packageChoose.png')

      this.$emit('showPackageList',this.packageStatus)
    },
    showResource () {
      this.sourceStatus = !this.sourceStatus
      this.sourceIcon = this.sourceStatus == false ? require('@img/gis/source.png') : require('@img/gis/sourceChoose.png')

      this.$emit('showSourceList',this.sourceStatus)
    }
  },
  watch: {
    closeFlight: {
      handler (value) {
        this.flightStatus = !value
        this.flightIcon = this.flightStatus == false ? require('@img/gis/flight.png') : require('@img/gis/flightChoose.png')
      }
    },
    isClosePackage: {
      handler (value) {
        this.packageStatus = !value
        this.packageIcon = this.packageStatus == false ? require('@img/gis/package.png') : require('@img/gis/packageChoose.png')
      }
    },
    isCloseSource: {
      handler (value) {
        this.sourceStatus = !value
        this.sourceIcon = this.sourceStatus == false ? require('@img/gis/source.png') : require('@img/gis/sourceChoose.png')
      }
    }
  }
}
</script>

<style lang="scss" scope>
.main-content {
  position: absolute;
  width: 100%;
  height: 90px;
  z-index: 3;
  background-image: url(~@img/gis/map_header_shelter.png);
  background-repeat: repeat-x;
  background-size: auto 100%;
}

.title-img {
  position: absolute;
  top: 30px;
  left: 24px;
  cursor: pointer;
}

.menu-title {
  position: absolute;
  top: 20px;
  left: 76px;
  font-size: 32px;
  font-family: 'DINPro-Medium';
  color: #DBE7EF;
}

.monitor-type {
  position: absolute;
  left: 690px;
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

input {
  cursor: pointer;
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
  border-radius: 18px;
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

.button-arr {
  width:132px;
  height:38px;
  position: absolute;
  display: flex;
  top: 20px;
  right: 10px;
  background:rgba(190,225,255,0.1);
  box-shadow:0px 0px 40px 0px rgba(2,2,2,0.6);
  border-radius:8px;

  div {
    width: 54px;
    cursor: pointer;
    position: relative;
    top: 3px;

    .secondImg {
      position: relative;
      top: -30px;
    }
  }
}

.zoom-control {
  position: absolute;
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  top: 20px;
  right: 247px;
  z-index: 999;
  background-color: rgba(255, 255, 255, .4);
  border-radius: 4px;
  padding: 2px;

  button {
    display: block;
    margin: 1px;
    padding: 0;
    color: #fff;
    font-size: 1.14em;
    font-weight: 700;
    text-align: center;
    height: 2em;
    width: 2em;
    line-height: .4em;
    border: none;
    border-radius: 0 0 2px 2px;
    background-color: rgba(0, 60, 136, .5);
  }

  button:focus,
  button:hover {
    text-decoration: none;
    background-color: rgba(0, 60, 136, .7);
  }
}

.zoom-control:hover {
  background-color: rgba(255, 255, 255, 0.6)
}
</style>