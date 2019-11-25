<template>
<!-- 综合运行监控，T3国际航站楼部分 -->
  <div class="main-div">
    <dynamicmap :mapIdD="mapId" :mapIdA="mapIdA" :terminalName="terminalName" :param="param" :paramA="paramA" :terminalType="terminalType" 
    :terminalAttr="terminalAttr" :minCircleR="minCircleR" :maxCircleR="maxCircleR" :standD="standD" :standA="standA" :chuteDeltY="chuteDeltY" :chuteDeltX="chuteDeltX"></dynamicmap>
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
      mapId: 'mapT3_international', //出港地图mapId
      mapIdA: 'mapAt3_international', //进港地图mapId
      param: { //初始化出港地图参数，用来覆盖Dynamicmap组件里的默认参数
        mapId: "mapT3_international",
        baseLayer: "basemap:mapDIntert3",
        centerPoint: [109.23883156578084, 19.06719432562471],
        initZoom: 7,
        minZoom: 7,
        maxZoom: 9
      },
      paramA: { //初始化进港地图参数（mapId，wms服务名，中心点坐标，默认显示的三个地图级别）
        mapId: "mapAt3_international",
        baseLayer: "basemap:mapAIntert3",
        centerPoint: [107.22656249999999, 19.921712747556214],
        initZoom: 6,
        minZoom: 6,
        maxZoom: 8
      },
      minCircleR: 5, //异常告警圆圈半径的最小及最大值
      maxCircleR: 25,
      chuteDeltX: 0.5, // 滑槽号偏移量
      chuteDeltY: -0.9,
      standD: { //出港航班图层（飞机，进度）加载的参数
        inoutFlag: 'D',
        coordinate: [102.535400390625, 17.19852235364462], //初始基准坐标
        singleCoor: [108.621826171875, 16.946469670739262],
        deltX: 1.3, //X方向上航班之间的间隔量
        maxX: 119.492333984375, //X方向上最大的坐标
        deltY: -1.8, //Y方向上航班之间的间隔量
        count: 11, //每一行航班的最大数量
        radius: 60000, //进度圆圈的半径
        initScale: 0.16, // 三个级别下航班图标的大小
        secondScale: 0.36,
        maxScale: 0.72,
      },
      standA: { //进港航班进度（飞机，进度）加载的参数
          inoutFlag: 'A',
          coordinate: [93.09814453125, 24.996015742094016], 
          singleCoor: [107.46826171875001, 25.135339016131],
          deltX: 2.32,
          maxX: 119.492333984375,
          deltY: -1.63,
          count: 12,
          radius: 115000,
          initScale: 0.18, 
          secondScale: 0.4,
          maxScale: 0.88,
        },
      //当前地图的航站楼信息
      terminalName: "T3国际航站楼",
      terminalType: 'T3',
      terminalAttr: "I",
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