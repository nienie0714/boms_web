<template>
<!-- 综合运行监控，T3航站楼部分 -->
  <div class="main-div">
    <dynamicmap :mapIdD="mapId" :mapIdA="mapIdA" :terminalName="terminalName" :param="param" :paramA="paramA" :terminalType="terminalType"></dynamicmap>
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
      mapId: 'mapT3', //出港地图mapId
      mapIdA: 'mapAt3', //进港地图mapId
      param: { //初始化出港地图参数，用来覆盖Dynamicmap组件里的默认参数
        mapId: "mapT3",
        baseLayer: "basemap:mapDt3",
        centerPoint: [111.6852163432436, 31.42588717424612],
        initZoom: 7,
        minZoom: 7,
        maxZoom: 9
      },
      paramA: { //初始化进港地图参数（mapId，wms服务名，中心点坐标，默认显示的三个地图级别）
        mapId: "mapAt3",
        baseLayer: "basemap:mapAt3",
        centerPoint: [114.36383106606072, 22.840400174608865],
        initZoom: 7,
        minZoom: 7,
        maxZoom: 9
      },
      //当前地图的航站楼信息
      terminalName: "T3国内航站楼",
      terminalType: 'T3'
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