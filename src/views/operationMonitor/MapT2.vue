<template>
<!-- 综合运行监控，T2航站楼部分 -->
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
      mapId: 'mapT2', //出港地图mapId
      mapIdA: 'mapAt2', //进港地图mapId
      param: { //初始化出港地图参数，用来覆盖Dynamicmap组件里的默认参数
        mapId: "mapT2",
        baseLayer: "basemap:mapDt2",
        initZoom: 7,
        minZoom: 7,
        maxZoom: 9,
        centerPoint: [115.39702148437501, 19.564254834336603]
      },
      paramA: { //初始化进港地图参数（mapId，wms服务名，中心点坐标，默认显示的三个地图级别）
        mapId: "mapAt2",
        baseLayer: "basemap:mapAt2",
        initZoom: 9,
        minZoom: 9,
        maxZoom: 11,
        centerPoint: [109.76165771484374, 22.368511475851474]
      },
      minCircleR: 10, //异常告警圆圈半径的最小及最大值
      maxCircleR: 35,
      chuteDeltY: 0.4, // 滑槽号偏移量
      flightCircleDeltX: 0.5, //航班上的异常圆圈相对于航班坐标的X,Y偏移值
      flightCircleDeltY: 0.25,
      flightOutTipOffset: { // 出港航班的label三个地图级别位置适配
          firstZoom: [-75,140],
          secondZoom: [-125,230],
          thirdZoom: [-210,510]
        },
      standD: { //出港航班图层（飞机，进度）加载的参数
        inoutFlag: 'D',
        coordinate: [107.92968750000001, 16.12498502956099], //初始基准坐标
        singleCoor: [115.76293945312499, 16.02997535690521], //单个航班时坐标
        deltX: 1.3, //X方向上航班之间的间隔量
        maxX: 119.492333984375, //X方向上最大的坐标
        deltY: -2.0, //Y方向上航班之间的间隔量
        count: 13, //每一行航班的最大数量
        radius: 65000, //进度圆圈的半径
        initScale: 0.16, // 三个级别下航班图标的大小
        secondScale: 0.36,
        maxScale: 0.72,
      },
      standA: {
          inoutFlag: 'A',
          coordinate: [108.03405761718751, 22.708750980898697], 
          singleCoor: [109.58587646484375, 22.693853220706146],
          deltX: 0.32,
          maxX: 119.492333984375,
          deltY: -0.43,
          count: 15,
          radius: 15000,
          initScale: 0.18, 
          secondScale: 0.4,
          maxScale: 0.88,
        },
      //当前地图的航站楼信息
      terminalName: "T2国内航站楼",
      terminalType: 'T2',
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