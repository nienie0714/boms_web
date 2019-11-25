<template>
<!-- 航站楼公共地图组件入口 -->
  <div class="content-div">
    <!-- 除地图之外的弹框 -->
    <flight-list :param="param" :paramA="paramA" :terminalType="terminalType" :terminalAttr="terminalAttr" :terminalName="terminalName" :mapAtDom="mapIdA" @refreshSingleFlight="refreshFlightLayers" @backToAllFlight="backTo" v-on:updateTransfer="getTransfer"></flight-list>
    <!-- 地图对象依赖的DOM -->
    <div :class="mapIdD" :id="mapIdD"></div>
    <div :class="mapIdA" :id="mapIdA"></div>
  </div>
</template>

<script>
let gis = require('gis') //基于ol封装的基础gis包
let planeImg = require('@img/gis/icon_airplane.png')
let cameraImg = require('@img/gis/icon_camera.png')
import mapMixin from './MapMixin'
import FlightList from './FlightList'
import { setTimeout, setInterval, clearInterval } from 'timers'
import { type } from 'os'
import { postData } from '@/util/base'

export default {
  components: {
    FlightList
  },
  props: { //默认参数设置
    mapIdD: { //出港地图mapId
      type: String,
      default: 'mapT1'
    },
    mapIdA: { //进港地图mapId
      type: String,
      default: "mapAt1"
    },
    param: { //初始化出港地图的参数
      type: Object,
      default: () => {
        return {
          mapId: "mapT3",
          baseLayer: "basemap:mapDt3",
          centerPoint: [111.6852163432436, 32.62588717424612]
        }
      }
    },
    paramA: { //初始化进港地图的参数
      type: Object,
      default: () => {
        return {
          mapId: "mapAt3",
          baseLayer: "basemap:mapAt3",
          centerPoint: [114.36383106606072, 22.240400174608865]
        }
      }
    },
    minCircleR: { //异常告警圆圈半径的最小及最大值
      type: Number,
      default: 5
    },
    maxCircleR: {
      type: Number,
      default: 25
    },
    chuteDeltX: { // 滑槽号偏移量
      type: Number,
      default: 0
    },
    chuteDeltY: {
      type: Number,
      default: 0.5
    },
    flightCircleDeltX: { //航班上的异常圆圈相对于航班坐标的X,Y偏移值
      type: Number,
      default: 0.5
    },
    flightCircleDeltY: {
      type: Number,
      default: 0.2
    },
    flightOutTipOffset: { // 出港航班的label三个地图级别位置适配
      type: Object,
      default: () => {
        return {
          firstZoom: [-80,125],
          secondZoom: [-130,200],
          thirdZoom: [-215,455]
        }
      }
    },
    flightInTipOffset: { // 进港航班的label三个地图级别位置适配
      type: Object,
      default: () => {
        return {
          firstZoom: [-80,125],
          secondZoom: [-130,200],
          thirdZoom: [-215,455]
        }
      }
    },
    standD: { //出港航班图层（飞机，进度）加载的参数
      type: Object,
      default: () => {
        return {
          inoutFlag: 'D', //进出港标识
          coordinate: [103.092333984375, 29.3852822929746], //初始基准坐标
          singleCoor: [111.56616210937499, 29.20491846390904], //单个航班时坐标
          deltX: 1.4, //X方向上航班之间的间隔量
          maxX: 119.492333984375, //X方向上最大的坐标
          deltY: -1.7, //Y方向上航班之间的间隔量
          count: 12, //每一行航班的最大数量
          radius: 60000, //进度圆圈的半径
          initScale: 0.18, // 三个级别下航班图标的大小
          secondScale: 0.4,
          maxScale: 0.88,
        }
      }
    },
    standA: { //进港航班进度（飞机，进度）加载的参数
      type: Object,
      default: () => {
        return {
          inoutFlag: 'A',
          coordinate: [108.2373046875, 24.23004055946545], 
          singleCoor: [113.961181640625, 24.532132210302734], //单个航班时坐标
          deltX: 1.4,
          maxX: 119.492333984375,
          deltY: -1.7,
          count: 9,
          radius: 60000,
          initScale: 0.18, 
          secondScale: 0.4,
          maxScale: 0.88
        }
      }
    },
    //当前地图的航站楼信息
    terminalName: {
      type: String,
      default: "T1航站楼"
    },
    terminalType: {
      type: String,
      default: 'T1'
    },
    terminalAttr: { //属性标识国内或是国际，D/I
      type: String,
      default: "D"
    },
  },
  mixins: [mapMixin],
  data() {
    return {
      mapId: this.mapIdD,
      standDParam: this.standD,
      standAParam: this.standA,
      allTimer: null, //所有航班相关信息刷新定时器
      singleTimer: null, //单个航班相关信息刷新定时器
      carOutCoordinates: [], //出港小车数据，进港无小车
      planeCoorinates: [], //航班数据
      circleOutCoordinates: [], //异常圆圈图层数据
      turntableCoordinates: [], //转盘数据
      popupInfo7: [], //三个级别的值机柜台及开包数
      popupInfo8: [],
      popupInfo9: {},
      overlayArr: [], //地图上弹框对象存储
      statisticUrl: 'runMonitor/statistic', //地图统计数据接口url
      mapParamObj: { // 地图统计数据参数
        terminal: this.terminalType, 
        attr: this.terminalAttr,
        inOutFlag: "D",
        isTransfer: "N" 
      },
      statisticSingleUrl: 'runMonitor/statisticSingle',
      singleParamObj: { //单个航班统计数据参数
        dynamicFlightId: this.currentFlight,
        isTransfer: "N"
      },
      currentFlight: "" //当前选中航班ID
    }
  },
  created() {
    this.$nextTick(() => { //DOM渲染出来之后，加载地图，及各个图层
      // setTimeout(() => { //测试数据，在地图上打点
      //   gis.Geometry.drawGeometry({
      //     mapId: this.mapIdD,
      //     type: 'Point',
      //     callbackfun: function(obj) {
      //         console.log('['+ obj.coordinate[0] + ', ' + obj.coordinate[1] + ']');
      //     }
      //   })
      // },200)
      this.standAParam.mapId = this.mapIdA
      this.standDParam.mapId = this.mapId
      this.createMap(this.param) //初始化出港地图
      this.createMap(this.paramA) //初始化进港地图

      this.loadAllLayerDatas() //请求统计数据，渲染各个图层
      this.refreshData() //添加定时器（60s刷新），选中当个航班时刷新单个航班，否则，刷新所有数据
    })
  },
  beforeDestroy () { //销毁组件时，移除当前出港及进港地图对象
    gis.Map.removeMap(this.mapId)
    gis.Map.removeMap(this.mapIdA)
  },
  destroyed () { 
    if(this.allTimer) {
      clearInterval(this.allTimer)
    }
    if(this.singleTimer) {
      clearInterval(this.singleTimer)
    }
  },
  methods: {
    getTransfer (event) { //只看中转时处理
      this.mapParamObj.isTransfer = event ? 'Y' : 'N'
      this.singleParamObj.isTransfer = event ? 'Y' : 'N'
      if (this.currentFlight != "") {
        this.refreshSingle()
      } else {
        this.loadData()
      }
    },
    //根据后台统计数据，更新所有图层
    loadData () { 
      let paramObj = JSON.stringify(this.mapParamObj)
      postData(this.statisticUrl, paramObj).then(response => {
        if (response.data.code == 0) {
          let data = response.data.data
          //根据地图级别去刷新所有图层
          this.refreshAllLayers(data)
        } else {
          //无数据的情况
        }
      }).catch(err => {
        this.$msg.error({
          info: '请求异常 !',
          tip: err
        })
      })
    },
    //刷新单个航班的图层
    refreshSingle () { 
      let paramObj = JSON.stringify(this.singleParamObj)
      postData(this.statisticSingleUrl, paramObj).then(response => {
        if (response.data.code == 0) {
          let data = response.data.data
          //根据地图级别去刷新所有图层
          this.refreshAllLayers(data, true)
        } else {
          //无数据的情况
        }
      }).catch(err => {
        this.$msg.error({
          info: '请求异常 !',
          tip: err
        })
      })
    },
    //更新当前选中航班ID
    refreshFlightLayers(currentFlight) { 
      this.currentFlight = currentFlight
    },
    backTo (currentFlight) {
      this.currentFlight = currentFlight
    },
    //根据地图级别去刷新所有图层
    refreshAllLayers (data, isSingle) { 
      isSingle = isSingle || false
      this.standDParam.planeCoorinates = data.flightDInfo
      this.standAParam.planeCoorinates = data.flightAInfo
      this.circleOutCoordinates = data.chuteInfo
      this.carOutCoordinates = data.truckDInfo
      this.turntableCoordinates = data.beltInfo
      this.popupInfo7 = data.counterSumAndCounterInfo && data.counterSumAndCounterInfo.zoom1 || []
      this.popupInfo8 = data.counterSumAndCounterInfo && data.counterSumAndCounterInfo.zoom2 || []
      this.popupInfo9 = data.counterSumAndCounterInfo && data.counterSumAndCounterInfo.zoom3 || []
     
      this.loadStand(this.standDParam, true, isSingle)
      this.loadStand(this.standAParam, true, isSingle)
      this.loadCircle()
      this.loadCar()
      this.refreshOverlayOut(undefined,this.mapId) //更新所有的弹框
      this.refreshOverlayIn(undefined,this.mapIdA)
      this.loadTurntable()
    },
    setSingleTimer () {
      if (this.singleTimer) {
        clearInterval(this.singleTimer)
      } else {
        this.singleTimer = setInterval(() => {
          this.refreshSingle()
        }, 60000)
      }
    },
    refreshData () {
      if (this.allTimer) {
        clearInterval(this.allTimer)
      } else {
        this.allTimer = setInterval(() => {
          this.loadData() 
        }, 60000)
      }
    },
    //初始化加载值机柜台及安检弹框
    initPopup () {
      for (let p = 0; p < this.popupInfo7.length; p++) {
        this.overlayArr[p] = document.createElement('div')
        this.overlayArr[p].className = 'minZoomPop'
        this.overlayArr[p].innerHTML = '<div>值机柜台 ' + this.popupInfo7[p].counterNo + '</div>' +
          '<div>已交运：' + this.popupInfo7[p].checkinNum + '</div>' +
          '<div>已开包 ' + this.popupInfo7[p].unpackNum + '</div>'

        document.getElementById(this.mapId).appendChild(this.overlayArr[p])
        gis.Popup.creatToolTip({
          mapId: this.mapId,
          tipsId: this.tipsId.counterAndSecurity,
          element: this.overlayArr[p],
          coordinate: this.popupInfo7[p].coordinate
        })
      }
    },
    //根据地图级别更新值机柜台及安检弹框
    loadPopup (popupObj, mapId) { 
      for (let p = 0; p < popupObj.length; p++) {
        this.overlayArr[p] = document.createElement('div')
        let currentZoom = gis.Map.getMapObj(mapId).getView().getZoom()
        this.overlayArr[p].className = (currentZoom == 7 || currentZoom == 8)? 'minZoomPop' : 'maxZoomPop'
        this.overlayArr[p].innerHTML = '<div>值机柜台 ' + popupObj[p].counterNo + '</div>' +
          '<div>已交运：' + popupObj[p].checkinNum + '</div>' +
          '<div>已开包：' + popupObj[p].unpackNum + '</div>'

        document.getElementById(this.mapId).appendChild(this.overlayArr[p])
        gis.Popup.creatToolTip({
          mapId: this.mapId,
          tipsId: this.tipsId.counterAndSecurity,
          element: this.overlayArr[p],
          coordinate: popupObj[p].coordinate
        })
      }
    },
    //移除地图上所有的overlay
    removeAllOvelay (mapObj, overlayObjs) {
      for (let o = 0; o < overlayObjs.length; o++) { //移除当前级别的所有popup
        if (overlayObjs[o].id != 'popup') {
          mapObj.removeOverlay(overlayObjs[o])
        }
      }
      let overlay = mapObj.getOverlays().getArray()
      if (document.getElementById('popup')) {
        if (overlay.length > 1) {
          this.removeAllOvelay(mapObj,overlay)
        }
      } else {
        if (overlay.length > 0) {
          this.removeAllOvelay(mapObj,overlay)
        } 
      }
    },
    //更新出港地图的所有overlay
    refreshOverlayOut (zoom, mapId) {
      let map = gis.Map.getMapObj(mapId)
      zoom = zoom || map.getView().getZoom()

      let overlayObjs = map.getOverlays().getArray()
      if (overlayObjs.length > 0) {
        this.removeAllOvelay(map,overlayObjs)
      }

      if(zoom % 1 === 0) {
        if(zoom >= this.param.initZoom && zoom < this.param.maxZoom - 1) { //minZoom
          this.loadPopup(this.popupInfo7, this.mapId)
          this.loadFlightTip(this.standDParam.planeCoorinates,1,this.flightOutTipOffset.firstZoom,this.mapIdD)
          this.loadCarTip(this.carOutCoordinates,1,[-15,33])
        }else if (zoom >= this.param.maxZoom - 1 && zoom < this.param.maxZoom) { //middleZoom
          this.loadPopup(this.popupInfo8, this.mapId)
          this.loadFlightTip(this.standDParam.planeCoorinates,2,this.flightOutTipOffset.secondZoom,this.mapIdD)
          this.loadCarTip(this.carOutCoordinates,2,[-15,63])
        }else if (zoom == this.param.maxZoom) { //maxZoom
          this.loadPopup(this.popupInfo9, this.mapId)
          this.loadFlightTip(this.standDParam.planeCoorinates,3,this.flightOutTipOffset.thirdZoom,this.mapIdD)
          this.loadCarTip(this.carOutCoordinates,3,[-15,63])
        }
      }
    },
    //更新进港地图的所有overlay
    refreshOverlayIn (zoom, mapId) {
      let map = gis.Map.getMapObj(mapId)
      zoom = zoom || map.getView().getZoom()

      let overlayObjs = map.getOverlays().getArray()
      if (overlayObjs.length > 0) {
        this.removeAllOvelay(map,overlayObjs)
      }

      if(zoom % 1 === 0) {
        if(zoom >= this.paramA.initZoom && zoom < this.paramA.maxZoom - 1) {
          this.loadFlightTip(this.standAParam.planeCoorinates,1,[-40,100],this.mapIdA, 'A')
        }else if (zoom >= this.paramA.maxZoom - 1 && zoom < this.paramA.maxZoom) {
          this.loadFlightTip(this.standAParam.planeCoorinates,2,[-40,150],this.mapIdA, 'A')
        }else if (zoom == this.paramA.maxZoom) {
          this.loadFlightTip(this.standAParam.planeCoorinates,3,[-50,385],this.mapIdA, 'A')
        }
      }
    },
    //缩放地图事件注册
    popupChange () {
      let mapObj = gis.Map.getMapObj(this.mapId)
      let mapObjA = gis.Map.getMapObj(this.mapIdA)
      //出港地图缩放事件注册
      if (mapObj) { 
        mapObj.getView().on('change:resolution', ((e) => {
          let mapAt = document.getElementById(this.mapIdA)
          if (mapAt.style.zIndex == 1) { //当前地图是进港地图时，不触发以下方法
            return
          } 
          this.refreshOverlayOut(e.target.getZoom(),this.mapId)//更新值机柜台及安检的popup
          
          //更新航班图层
          let param = {
            mapId: this.mapId,
            layerId: "planeLayer",
            updatePoint: {
              imgPath: planeImg,
              label: "",
              font: "16px DINPro",
              color: "#D2E5F3",
              scale: 0.4
            }
          }
          let currentZoom = e.target.getZoom()
          param.updatePoint.scale = currentZoom < this.param.initZoom + 1 ? this.standD.initScale : ((currentZoom = this.param.initZoom + 1 && currentZoom < this.param.maxZoom) ? this.standD.secondScale : this.standD.maxScale)
          this.updateLayer(param)

          //滑槽号显示处理，第二三级别显示，第一级别不显示
          let chuteLayer = gis.BaseLayer.getLayer({mapId:this.mapId,layerId:"circleChuteLayer"})
          if (chuteLayer) {
            if (e.target.getZoom() > this.param.initZoom) {
              chuteLayer.setVisible(true)
            } else {
              chuteLayer.setVisible(false)
            }
          }
        }))
      }

      //进港地图缩放事件注册
      if (mapObjA) {
        mapObjA.getView().on('change:resolution', ((e) => {
          let mapAt = document.getElementById(this.mapIdA)
          if (!mapAt.style.zIndex || mapAt.style.zIndex == -1) { //当前地图是出港地图时，不触发以下方法
            return
          }
          this.refreshOverlayIn(e.target.getZoom(),this.mapIdA)//更新值机柜台及安检的popup
          this.loadTurntable() //更新转盘图层
          
          //更新航班图层
          let param = {
            mapId: this.mapIdA,
            layerId: "planeLayer",
            updatePoint: {
              imgPath: planeImg,
              label: "",
              font: "16px DINPro",
              color: "#D2E5F3",
              offsetY: 70,
              scale: 0.4
            }
          }
          let currentZoom = e.target.getZoom()
          param.updatePoint.scale = currentZoom < this.paramA.initZoom + 1 ? this.standA.initScale : ((currentZoom = this.paramA.initZoom + 1 && currentZoom < this.paramA.maxZoom) ? this.standA.secondScale : this.standA.maxScale)
          this.updateLayer(param)
        }))
      }
    },
    //加载滑槽上的异常行李圆圈图层及滑槽号
    loadCircle () {
      let circleOutParam = { //滑槽上异常告警圆圈图层参数
        mapId: this.mapId,
        layerId: "circle",
        coordinates: this.circleOutCoordinates,
        minRadius: this.minCircleR,
        maxRadius: this.maxCircleR
      }
      let circleChuteParam = { //滑槽号图层添加
        mapId: this.mapId,
        layerId: "circleChuteLayer",
        coordinates: this.circleOutCoordinates,
        chuteDeltX: this.chuteDeltX,
        chuteDeltY: this.chuteDeltY
      }
      if (!this.circleOutCoordinates || this.circleOutCoordinates.length == 0) {
        gis.BaseLayer.removeLayer(circleOutParam)
        gis.BaseLayer.removeLayer(circleChuteParam)
        return
      }
      
      this.addCircle(circleOutParam)
      this.addCircleChute(circleChuteParam)
      let currentZoom = gis.Map.getMapObj(this.mapId).getView().getZoom()
      if (currentZoom == this.param.initZoom) { //第一个级别不显示滑槽号
        gis.BaseLayer.getLayer({mapId:this.mapId,layerId:"circleChuteLayer"}).setVisible(false)
      }
    },
    //加载滑槽下面的小车图层
    loadCar() {
      let carOutParam = {
        mapId: this.mapId,
        layerId: "carOut",
        coordinates: this.carOutCoordinates,
        datas: []
      }

      this.addCar(carOutParam)
      this.loadCarTip(this.carOutCoordinates,1,[-15,33])
    },
    //加载转盘图层
    loadTurntable () {
      let paramObj = {
        mapId: this.mapIdA
      }
      paramObj.coordinates = this.turntableCoordinates

      this.addTurntable(paramObj)
    },
    //加载摄像头图层
    loadVideoLayer () {
      let paramObj = {
        mapId: this.mapIdD
      }

      this.addVideoLayer(paramObj)
    }
  },
  watch: {
    currentFlight: {
      handler(value) {
        if(value == "") {
          //更新所有
          this.loadData()
          if (this.singleTimer) {
            clearInterval(this.singleTimer)
          }

          this.refreshData()
        } else if (value){
          //更新单个航班
          this.singleParamObj.dynamicFlightId = value
          this.refreshSingle()
          if (this.allTimer) {
            clearInterval(this.allTimer)
          }
          
          this.setSingleTimer()
        }
    }
    }
  }
}

</script>

<style lang="scss" scoped>
.content-div {
  overflow: hidden;
  height: inherit;
}

.mapAt1, .mapAt2, .mapAt3, .mapAt3_international {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-image: url(~@img/gis/bg_dark_blue.jpg);
  background-size: cover;
  z-index: -1;
}

.mapT1, .mapT2, .mapT3, .mapT3_international {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-image: url(~@img/gis/bg_dark_blue.jpg);
  background-size: cover;
}

/deep/.zoomNum {
  display: none;
}

/deep/.ol-scale-line.ol-unselectable {
  display: none;
}
</style>


