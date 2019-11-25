<script>
let gis = require('gis')
let carImg = require('@img/gis/icon_lug_truck.png')

export default {
  data() {
    return {
      mapId: 'mapT1',
      basemapUrl: 'http://10.254.130.15:8080/geoserver/basemap/wms',
      baseLayer: 'basemap:mapDt3',//basemap:mapAt3,[114.96383106606072, 22.240400174608865]
      centerPoint: [111.6852163432436, 32.62588717424612],
      initZoom: 7,
      minZoom: 5,
      maxZoom: 9,
      projection: 'EPSG:3857',
      layerId: {
        circle: "circleLayer",
        process: "progressLayer",
        plane: "planeLayer",
        car: "carLayer"
      },
      popupType: {
        counterAndSecurity: "counterAndSecurity",
        counter: "counter",
        security: "security"
      },
      tipsId: {
        counterAndSecurity: "counterAndSecurity",
        stand: "stand",
        vehicle: "vehicle",
        turntable: "turntable"
      }
    }
  },
  methods: {
    createMap(param) { //初始化加载地图
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
    addCircle(param) { //加载异常行李图层
      let circleParam = {
        mapId: param.mapId || this.mapId,
        layerId: param.layerId || this.layerId.circle,
        datas: []
      }
      param.coordinates.forEach((val) => {
        let obj = {}
        obj.id = val.id
        obj.coordinate = val.coordinate
        obj.label = val.count + ''
        obj.radius = 5 //min为5,max为25
        if (val.count > 0) {
          if (val.count > 100) {
            obj.radius = 25
          } else if (val.count == 1) {
            obj.radius = 5
          } else {
            obj.radius = (val.count - 1) * 0.2 + 5
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
      })
      
      gis.Circle.addCircleLayer(circleParam)
    },
    addProgress(param) { //加载航班行李装载进度图层
      let paramObj = {
        mapId: param.mapId || this.mapId,
        layerId: this.layerId.process,
        datas: param.datas
      }
      gis.Stand.addProgressLayer(paramObj)
    },
    addPlane(param) { //加载航班图层
      let paramObj = {
        mapId: param.mapId || this.mapId,
        layerId: this.layerId.plane,
        datas: param.datas
      }
      gis.Icon.addIcon(paramObj)
    },
    addInStand (param) {

    },
    addOutStand (param) {
      let progressParam = {
        mapId: param.mapId || this.mapId,
        layerId: this.layerId.process,
        datas: []
      },
        planeParam = {
          mapId: param.mapId || this.mapId,
          layerId: this.layerId.plane,
          datas: []
        }

      let coordinate = param.normalCoor
      // let coordinate = [108.2373046875, 24.23004055946545]
      let deltX = param.deltX 
      let maxX = param.maxX
      let deltY = param.deltY
      let count = param.count

      param.coorinates.forEach((feature, index) => {
        let mapObj = gis.Map.getMapObj(this.mapId)
        let zoom = mapObj.getView().getZoom()
        let obj = {},
          planeObj = {}
        let x = coordinate[0] + (deltX * index)
        if (index > count) {
          let deltIndex = index - (count + 1) * Math.floor(index / (count + 1))
          let ranlY = Math.floor(index / (count + 1))
          let currentX = coordinate[0] + (deltX * deltIndex)
          let currentY = coordinate[1] + (deltY * ranlY)
          obj.coordinate = [currentX, currentY]

          planeObj.coordinate = [currentX, currentY]
          feature.coordinate = [currentX, currentY]
        } else {
          obj.coordinate = [x, coordinate[1]]
          planeObj.coordinate = [x, coordinate[1]]
          feature.coordinate = [x, coordinate[1]]
        }
        obj.rotation = feature.progress * 360
        obj.text = {}
        obj.text.font = "14px Microsoft YaHei"
        obj.text.color = "#DBE7EF"
        obj.text.offsetY = 45
        obj.label = "机位号：12"
        progressParam.datas.push(obj)

        // planeObj.id = 
        // planeObj.imgPath = "http://10.254.130.18:8094/img/gis/icon_airplane.png"
        planeObj.imgPath = planeImg
        planeObj.label = "MU2560"
        planeObj.text = {}
        planeObj.text.font = "16px DINPro"
        planeObj.text.color = "#D2E5F3"
        planeObj.text.offsetY = zoom <= 7 ? 70 : ((zoom >= 8 && zoom < 9) ? 120 : 218)
        planeObj.scale = zoom < 8 ? 0.18 : ((zoom = 8 && zoom < 9) ? 0.4 : 0.88)
        planeParam.datas.push(planeObj)
      })

      this.addProgress(progressParam)
      this.addPlane(planeParam)
    },
    addCar (param) { //加载行李装卸车图层
      let carParam = {
        mapId: param.mapId || this.mapId,
        layerId: param.layerId || this.layerId.car,
        datas: []
      }

      param.coordinates.forEach((val) => {
        let obj = {}
        obj.coordinate = val.coordinate
        obj.imgPath = carImg
        obj.label = val.id + ''
        obj.text = {}
        obj.text.font = "14px Microsoft YaHei"
        obj.text.color = "#DBE7EF"
        obj.text.offsetY = 23
        obj.scale = 0.3 //0.3,0.6,1

        carParam.datas.push(obj)
      })
      
      gis.Icon.addIcon(carParam)
    },
    updateLayer (param) { //更新图层
      let paramObj = {
        mapId: param.mapId || this.mapId,
        layerId: param.layerId,
        updatePoint: param.updatePoint
      }

      gis.Icon.updateIcon(paramObj)
    }
  }
}
</script>