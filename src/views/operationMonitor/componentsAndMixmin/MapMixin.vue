<script> /** 地图组件调的加载地图及各个图层的方法 */
let gis = require('gis') //基于ol封装的基础gis包
let carImg = require('@img/gis/icon_lug_truck.png')
let planeImg = require('@img/gis/icon_airplane.png')
let cameraImg = require('@img/gis/icon_camera.png')
let videoImg = require('@img/gis/icon_camera.png')

import { postData, queryAllGet } from '@/util/base'

export default {
  data() {
    return {
      mapId: 'mapT1',
      basemapUrl: 'http://10.254.130.15:8080/geoserver/basemap/wms',
      baseLayer: 'basemap:mapDt3',//basemap:mapAt3,[114.96383106606072, 22.240400174608865]
      centerPoint: [111.6852163432436, 32.62588717424612],
      initZoom: 7,
      minZoom: 7,
      maxZoom: 9,
      projection: 'EPSG:3857',
      layerId: {
        circle: "circleLayer",
        process: "progressLayer",
        plane: "planeLayer",
        car: "carLayer",
        cameraVideo: "videoLayer"
      },
      tipsId: { //各类overlayID
        counterAndSecurity: "counterAndSecurity",
        stand: "stand",
        vehicle: "vehicle",
        turntable: "turntable"
      }
    }
  },
  created() {
    this.basemapUrl = document.location.origin == "http://localhost:8080" ? "http://10.254.130.18:8094/geoserver/basemap/wms" : (document.location.origin + '/geoserver/basemap/wms')
  },
  methods: {
    /**
     * 初始化加载地图
     */
    createMap(param) {
      var paramObj = {
        mapId: param.mapId || this.mapId,
        center: gis.Proj.fromLonLat(param.centerPoint || this.centerPoint),
        zoom: param.initZoom || this.initZoom,
        minZoom: param.minZoom || this.minZoom,
        maxZoom: param.maxZoom || this.maxZoom,
        projection: gis.Proj.get(this.projection),
        baseLayerType: gis.Contant.mapType.wms,
        url: this.basemapUrl,
        layers: param.baseLayer || this.baseLayer,
      }

      gis.Map.createMap(paramObj)
    },
    //加载异常行李圆圈图层
    addCircle(param) {
      let circleParam = {
        mapId: param.mapId || this.mapId,
        layerId: param.layerId || this.layerId.circle,
        datas: []
      }
      gis.BaseLayer.removeLayer(circleParam)

      if (param.deltX) { //航班异常坐标往右上角偏移
        circleParam.deltX = param.deltX
      }
      if (param.deltY) {
        circleParam.deltY = param.deltY
      }
      param.coordinates.forEach((val) => {
        if (param.deltX) {
          val.coordinate[0] = val.coordinate[0] + param.deltX
        }
        if (param.deltY) {
          val.coordinate[1] = val.coordinate[1] + param.deltY
        }
        if (val.warningNum != 0) {
          let obj = {}
          obj.id = val.chuteNo
          obj.coordinate = val.coordinate
          obj.label = val.warningNum + ''
          obj.radius = param.minRadius || 5 //min为5,max为25
          if (val.warningNum > 0) {
            if (val.warningNum > 100) {
              obj.radius = param.maxRadius || 25
            } else if (val.warningNum == 1) {
              obj.radius = param.minRadius || 5
            } else {
              obj.radius = (val.warningNum - 1) * 0.2 + param.minRadius || 5
            }
          }
          obj.text = {
            font: "12px Microsoft YaHei",
            color: "#ffffff"
          }
          obj.strokeWidth = 1
          obj.fillColor = "rgba(255, 76, 106, 0.8)"
          obj.strokeColor = "rgba(255, 76, 106, 0.1)"
          circleParam.datas.push(obj)
        }
      })

      gis.Circle.addCircleLayer(circleParam)
    },
    //加载滑槽编号图层
    addCircleChute(param) {
      let circleParam = {
        mapId: param.mapId || this.mapId,
        layerId: "circleChuteLayer",
        datas: []
      }
      gis.BaseLayer.removeLayer(circleParam)

      param.coordinates.forEach((val) => {
        let obj = {}
        obj.id = val.chuteNo
        obj.coordinate = val.coordinate
        obj.coordinate[0] = obj.coordinate[0] + (param.chuteDeltX || 0)
        obj.coordinate[1] = obj.coordinate[1] + (param.chuteDeltY || 0.5)
        obj.label = val.chuteNo + ''
        obj.text = {
          font: "12px Microsoft YaHei",
          color: "#ffffff"
        }
        circleParam.datas.push(obj)
      })

      gis.Icon.addIcon(circleParam)
    },
    //加载航班行李进度图层
    addProgress(param) {
      let paramObj = {
        mapId: param.mapId || this.mapId,
        layerId: this.layerId.process,
        datas: param.datas
      }
      gis.BaseLayer.removeLayer(paramObj)

      gis.Stand.addProgressLayer(paramObj)
    },
    //加载航班图层
    addPlane(param) {
      let paramObj = {
        mapId: param.mapId || this.mapId,
        layerId: this.layerId.plane,
        datas: param.datas
      }
      gis.BaseLayer.removeLayer(paramObj)

      gis.Icon.addIcon(paramObj)
    },
    //航班和行李进度图层组合
    loadStand(param, isRefresh, isSingle) {
      let progressParam = {
        mapId: param.mapId,
        datas: []
      },
        planeParam = {
          mapId: param.mapId,
          datas: []
        }

      let coordinate = isSingle ? param.singleCoor : param.coordinate
      let deltX = param.deltX
      let maxX = param.maxX
      let deltY = param.deltY
      let count = param.count

      let initZoom = param.inoutFlag == 'D' ? this.param.initZoom : this.paramA.initZoom
      let maxZoom = param.inoutFlag == 'D' ? this.param.maxZoom : this.paramA.maxZoom
      let mapObj = gis.Map.getMapObj(param.mapId)
      let zoom = mapObj.getView().getZoom()

      param.planeCoorinates.forEach((feature, index) => {
        let obj = {},
          planeObj = {}
        let x = coordinate[0] + (deltX * index)
        if (index > count) {
          let deltIndex = index - (count + 1) * Math.floor(index / (count + 1))
          let ranlY = Math.floor(index / (count + 1))
          let currentX = coordinate[0] + (deltX * deltIndex)
          let currentY
          if (param.inoutFlag == 'D') {
            currentY = coordinate[1] + (deltY * ranlY)
          } else {
            currentY = coordinate[1] - (deltY * ranlY)
          }

          obj.coordinate = [currentX, currentY]

          planeObj.coordinate = [currentX, currentY]
          feature.coordinate = [currentX, currentY]
        } else {
          obj.coordinate = [x, coordinate[1]]
          planeObj.coordinate = [x, coordinate[1]]
          feature.coordinate = [x, coordinate[1]]
        }
        obj.rotation = feature.percent * 360
        obj.radius = param.radius
        progressParam.datas.push(obj)

        planeObj.imgPath = planeImg
        planeObj.scale = zoom < initZoom + 1 ? param.initScale : ((zoom == initZoom + 1 && zoom < maxZoom) ? param.secondScale : param.maxScale)
        planeParam.datas.push(planeObj)
      })

      this.addProgress(progressParam)
      this.addPlane(planeParam)

      if (param.inoutFlag == 'D') { // 出港地图时，添加航班上的异常行李圆圈图层
        let circleFlightParam = {
          mapId: param.mapId,
          layerId: "flightCircle",
          coordinates: param.planeCoorinates,
          minRadius: this.minCircleR,
          maxRadius: this.maxCircleR,
          deltX: this.flightCircleDeltX,
          deltY: this.flightCircleDeltY
        }

        this.addCircle(circleFlightParam)
      }

      if (!isRefresh) { //第一次加载航班tip
        if (param.inoutFlag == 'D') {
          let offset = zoom < initZoom + 1 ? this.flightOutTipOffset.firstZoom : ((zoom == initZoom + 1 && zoom < maxZoom) ? this.flightOutTipOffset.secondZoom : this.flightOutTipOffset.thirdZoom)
          this.loadFlightTip(param.planeCoorinates, 1, offset, param.mapId)
        } else {
          this.loadFlightTip(param.planeCoorinates, 1, [-32, 100], param.mapId)
        }
      }
    },
    //加载行李小车图层
    addCar(param) {
      let carParam = {
        mapId: param.mapId || this.mapId,
        layerId: param.layerId || this.layerId.car,
        datas: []
      }

      param.coordinates.forEach((val) => {
        if (val.lugNum > 0) {
          let obj = {}
          obj.coordinate = val.coordinate
          obj.imgPath = carImg
          obj.scale = 0.3

          carParam.datas.push(obj)
        }
      })

      gis.Icon.addIcon(carParam)
    },
    //更新图层
    updateLayer(param) {
      let paramObj = {
        mapId: param.mapId || this.mapId,
        layerId: param.layerId,
        updatePoint: param.updatePoint
      }

      gis.Icon.updateIcon(paramObj)
    },
    //加载转盘tip
    addTurntable(param) {
      var arr = param.coordinates

      for (let p = 0; p < arr.length; p++) {
        this.overlayArr[p] = document.createElement('div')
        this.overlayArr[p].className = 'planePop'
        this.overlayArr[p].innerHTML = '<div>转盘号：' + arr[p].beltNo + '</div>' +
          '<div>上转盘数：' + arr[p].uploadNum + '</div>' + '<div>提取核验数：' +
          arr[p].selfCheckNum + '</div>' + '<div>提取未核验数：' + arr[p].noselfCheckNum + '</div>'

        document.getElementById(param.mapId).appendChild(this.overlayArr[p])

        gis.Popup.creatToolTip({
          mapId: param.mapId,
          tipsId: this.tipsId.turntable,
          element: this.overlayArr[p],
          coordinate: arr[p].coordinate
        })
      }
    },
    //加载航班tip
    loadFlightTip(coordinates, zoom, offset, mapId, inoutFlag) {
      for (let p = 0; p < coordinates.length; p++) {
        this.overlayArr[p] = document.createElement('div')
        this.overlayArr[p].className = 'planePop'
        let mapAt = document.getElementById(this.mapIdA)
        let timePrev = "计起/预起/实起："
        let showTime = ''
        let time = ''
        let lastZoomHtml = ''
        let percent = coordinates[p].percent * 100 + '%'
        //未装机，应装机，装机进度，异常报警数，时间
        let prevHtml = '<div class="flight-no">' + coordinates[p].flightNo + '</div>' +
          '<div>机位：' + coordinates[p].stand + '</div>'
        if (mapAt.style.zIndex == 1 && inoutFlag == 'A') { //进港地图
          timePrev = "计到/预到/实到："
          showTime = coordinates[p].ata || coordinates[p].eta || coordinates[p].sta
          showTime = showTime ? showTime.split(" ")[1] : "--:--"
          time = timePrev + showTime

          lastZoomHtml = prevHtml + '<div>' + time + '</div>' +
            '<div>前站装机数：' + coordinates[p].prevLoadAcftNum + '</div>' +
            '<div>中转行李数：' + coordinates[p].tsfNum + '</div>' +
            '<div>卸机数：' + coordinates[p].unloadAcftNum + '</div>' + '<div>卸机进度：' + percent + '</div>'
        } else { // 出港地图
          showTime = coordinates[p].atd || coordinates[p].etd || coordinates[p].std
          showTime = showTime ? showTime.split(" ")[1] : "--:--"

          time = timePrev + showTime
          lastZoomHtml = prevHtml + '<div>' + time + '</div>' +
            '<div>未装机：' + coordinates[p].noloadAcfNum + '</div>' +
            '<div>应装机：' + coordinates[p].loadAcftTotalNum + '</div>' +
            '<div>装机进度：' + percent + '</div>' + '<div>异常报警数：<span class="abnormal">' + coordinates[p].warningNum + '</span></div>'
        }

        this.overlayArr[p].innerHTML = zoom != 3 ? prevHtml : lastZoomHtml

        document.getElementById(this.mapIdD).appendChild(this.overlayArr[p])
        gis.Popup.creatToolTip({
          mapId: mapId,
          tipsId: this.tipsId.stand,
          element: this.overlayArr[p],
          coordinate: coordinates[p].coordinate,
          offset: offset || this.flightOutTipOffset
        })
      }
    },
    //加载小车的tip
    loadCarTip(coordinates, zoom, offset) {
      for (let p = 0; p < coordinates.length; p++) {
        if (coordinates[p].lugNum > 0) {
          this.overlayArr[p] = document.createElement('div')
          this.overlayArr[p].className = 'planePop'
          let prevHtml = '<div class="flight-no">' + coordinates[p].chuteNo + '</div></div>'
          let lastZoomHtml = '<div class="flight-no">滑槽号：' + coordinates[p].chuteNo + '</div>' +
            '<div>行李数：' + coordinates[p].lugNum + '</div>'
          this.overlayArr[p].innerHTML = zoom != 1 ? lastZoomHtml : prevHtml

          document.getElementById(this.mapIdD).appendChild(this.overlayArr[p])
          gis.Popup.creatToolTip({
            mapId: this.mapIdD,
            tipsId: this.tipsId.vehicle,
            element: this.overlayArr[p],
            coordinate: coordinates[p].coordinate,
            offset: offset || [-15, 63]
          })
        }
      }
    },
    //加载摄像头图层
    addVideoLayer(param) {
      let videoParam = {
        mapId: param.mapId || this.mapId,
        layerId: param.layerId || this.layerId.cameraVideo,
        datas: []
      }

      param.coordinates = [{id: 'video1', coordinate: [106.97387695312497, 31.545771394936267] },
      {id: 'video2', coordinate: [107.83081054687497, 31.592573630393318] },
      {id: 'video3', coordinate: [108.63281249999997, 31.64870528997686] }]

      param.coordinates.forEach((val, index) => {
        let obj = {}
        obj.coordinate = val.coordinate
        obj.imgPath = videoImg
        obj.scale = 0.8
        obj.id = val.id

        videoParam.datas.push(obj)
      })

      gis.Icon.addIcon(videoParam)
    },
    registerClickEvent(param) {
      var paramObj = {
        mapId: this.mapId,
        layerId: this.layerId.cameraVideo,
        callbackfun: function (obj) {
          for(var player in vxgplayer.players) {
            if (vxgplayer.players.hasOwnProperty(player)) {
              vxgplayer.players[player] = null
              delete vxgplayer.players[player]
            }
          }
          vxgplayer.players = {}
          gis.Popup.addPopup({
            mapId: this.mapId,
            content: '<div class="coverImg" style="z-index: 3;position: absolute;width: 76px;height: 30px;background: #011f35;top: 10px;left: 20px;"></div><div id="' + obj.data.id + '"class="vxgplayer" style="border:none;margin:7px"></div>',
            coordinate: obj.coordinate
          })

          vxgplayer(obj.data.id, {
            width: 399,
            height: 259,
            url: 'rtsp://3.84.6.190/vod/mp4:BigBuckBunny_115k.mov',
            nmf_path: 'media_player.nmf',
            nmf_src: '/media_player.nmf',
            latency: 30,
            aspect_ratio_mode: 1,
            autohide: 3,
            autostart: true,
            controls: true,
            connection_timeout: 50,
            connection_udp: 0,
            custom_digital_zoom: false
          }).ready(function () {
            vxgplayer(obj.data.id).play()
          })
        }
      }

      gis.BaseLayer.registerClick(paramObj);
    },
    //首次加载的时候请求后台数据，更新所有图层
    loadAllLayerDatas() {
      let paramObj = JSON.stringify(this.mapParamObj)
      postData('runMonitor/statistic', paramObj).then(response => {
        if (response.data.code == 0) {
          let data = response.data.data
          this.standDParam.planeCoorinates = data.flightDInfo
          this.standAParam.planeCoorinates = data.flightAInfo
          this.circleOutCoordinates = data.chuteInfo
          this.popupInfo7 = data.counterSumAndCounterInfo && data.counterSumAndCounterInfo.zoom1 || []
          this.popupInfo8 = data.counterSumAndCounterInfo && data.counterSumAndCounterInfo.zoom2 || []
          this.popupInfo9 = data.counterSumAndCounterInfo && data.counterSumAndCounterInfo.zoom3 || []
          this.carOutCoordinates = data.truckDInfo
          this.turntableCoordinates = data.beltInfo

          this.initPopup() //加载最小级别的popup
          this.popupChange() //缩放地图事件注册
          this.loadCircle() //异常告警圆圈加载
          this.loadStand(this.standDParam) //航班图层加载
          this.loadStand(this.standAParam)
          this.loadCar() //小车图层加载
          this.loadTurntable() //转盘图层加载

          // this.loadVideoLayer() //摄像头图层加载
          // this.registerClickEvent()
        } else {
          //无数据的情况
        }
      }).catch(err => {
        this.$msg.error({
          info: '请求异常 !',
          tip: err
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.coverImg {
  z-index: 3;
  position: absolute;
  width: 76px;
  height: 30px;
  background: #ffffff;
  top: 10px;
  left: 20px;
}
</style>