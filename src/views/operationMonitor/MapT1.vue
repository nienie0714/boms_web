<template>
<!-- 综合运行监控，T1航站楼部分 -->
  <div class="main-div">
    <dynamicmap :mapIdD="mapId" :mapIdA="mapIdA" :terminalName="terminalName" :param="param" :paramA="paramA" :terminalType="terminalType"
    :minCircleR="minCircleR" :maxCircleR="maxCircleR" :standD="standD" :standA="standA" :flightCircleDeltX="flightCircleDeltX"
    :flightCircleDeltY="flightCircleDeltY" :flightOutTipOffset="flightOutTipOffset" :chuteDeltY="chuteDeltY"></dynamicmap>
  </div>
</template>

<script>
import Dynamicmap from './componentsAndMixmin/DynamicMap'

export default {
  components: {
    Dynamicmap
  },
  data () {
    return {
      //地图基础参数定义
      mapId: 'mapT1', //出港地图mapId
      mapIdA: 'mapAt1', //进港地图mapId
      param: { //初始化出港地图参数，用来覆盖Dynamicmap组件里的默认参数
        mapId: "mapT1",
        baseLayer: "basemap:mapDt1",
        centerPoint: [111.86279296874997, 18.504261786290357],
        initZoom: 6,
        minZoom: 6,
        maxZoom: 8
      },
      paramA: { //初始化进港地图参数（mapId，wms服务名，中心点坐标，默认显示的三个地图级别）
        mapId: "mapAt1",
        baseLayer: "basemap:mapAt1",
        centerPoint: [108.76383106606072, 22.240400174608865],
        initZoom: 7,
        minZoom: 7,
        maxZoom: 9
      },
      minCircleR: 5, //异常告警圆圈半径的最小及最大值
      maxCircleR: 25,
      chuteDeltY: 0.9, // 滑槽号偏移量
      flightCircleDeltX: 0.8, //航班上的异常圆圈相对于航班坐标的X,Y偏移值
      flightCircleDeltY: 0.6,
      flightOutTipOffset: { // 出港航班的label三个地图级别位置适配
          firstZoom: [-70,125],
          secondZoom: [-115,210],
          thirdZoom: [-200,485]
        },
      standD: { //出港航班图层（飞机，进度）加载的参数
        inoutFlag: 'D',
        coordinate: [99.11865234375, 17.25623631415644], //初始基准坐标
        singleCoor: [111.73095703124999, 16.056371485561698], //单个航班时坐标
        deltX: 2.3, //X方向上航班之间的间隔量
        maxX: 119.492333984375, //X方向上最大的坐标
        deltY: -3.2, //Y方向上航班之间的间隔量
        count: 2, //每一行航班的最大数量
        radius: 115000, //进度圆圈的半径
        initScale: 0.2,  // 三个级别下航班图标的大小
        secondScale: 0.36,
        maxScale: 0.78,
      },
      standA: { //进港航班进度（飞机，进度）加载的参数
          inoutFlag: 'A',
          coordinate: [101.79931640625001, 24.329222519460512], 
          singleCoor: [108.80859375, 24.991036982463754],
          deltX: 1.32,
          maxX: 119.492333984375,
          deltY: -1.63,
          count: 12,
          radius: 60000,
          initScale: 0.18, 
          secondScale: 0.4,
          maxScale: 0.88,
        },
      //当前地图的航站楼信息
      terminalName: "T1国内航站楼",
      terminalType: "T1"
    }
  }
}
</script>

<style lang="scss" scope>
.main-div {
  overflow: hidden;
  height: 100%;
}
</style>