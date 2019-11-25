<template>
  <div class="main-div">
    <dynamicmap :mapId="mapId" :mapIdA="mapIdA" :terminalName="terminalName" :param="param" :paramA="paramA" ></dynamicmap>
  </div>
</template>

<script>
import Dynamicmap from './DynamicMap'

export default {
  components: {
    Dynamicmap
  },
  data () {
    return {
      //地图基础参数定义
      mapId: 'mapT1',
      mapIdA: 'mapAt1',
      terminalName: "T1国内航站楼",
      param: {
        mapId: "mapT1",
        baseLayer: "basemap:mapDt3",
        centerPoint: [111.6852163432436, 32.62588717424612]
      },
      paramA: {
        mapId: "mapAt1",
        baseLayer: "basemap:mapAt3",
        centerPoint: [114.36383106606072, 22.240400174608865]
      },
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