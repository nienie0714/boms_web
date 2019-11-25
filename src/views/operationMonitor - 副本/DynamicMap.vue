<template>
  <div class="content-div">
    <flight-list></flight-list>
    <div :class="mapId" :id="mapId">
      <title-menu :terminalName="terminalName"></title-menu>
    </div>
    <div :class="mapIdA" :id="mapIdA"></div>
  </div>
</template>

<script>
let gis = require('gis')
let planeImg = require('@img/gis/icon_airplane.png')
let cameraImg = require('@img/gis/icon_camera.png')
import mapMixin from './MapMixin'
import TitleMenu from './TitleMenu'
import FlightList from './FlightList'
import { setTimeout } from 'timers'
import { type } from 'os'

export default {
  components: {
    TitleMenu,
    FlightList
  },
  props: {
    mapId: {
      type: String,
      default: 'mapT1'
    },
    mapIdA: {
      type: String,
      default: "mapT1A"
    },
    terminalName: {
      type: String,
      default: "T1航站楼"
    },
    param: {
      type: Object,
      default: () => {
        return {
          mapId: "mapT3",
          baseLayer: "basemap:mapDt3",
          centerPoint: [111.6852163432436, 32.62588717424612]
        }
      }
    },
    paramA: {
      type: Object,
      default: () => {
        return {
          mapId: "mapAt3",
          baseLayer: "basemap:mapAt3",
          centerPoint: [114.36383106606072, 22.240400174608865]
        }
      }
    }
  },
  mixins: [mapMixin],
  data() {
    return {
      timer: null,
      carCoor: [108.61379882812499, 30.27987731644206],
      carOutCoordinates: [
        {
          id: 1,
          coordinate: [108.61379882812499, 30.27987731644206]
        },
        {
           id: 2,
          coordinate: [103.5685400390625, 30.27987731644206]
        },
        {
          id: 3,
          coordinate: [103.98693115234374, 30.27987731644206]
        },
        {
          id: 4,
          coordinate: [104.418994140625, 30.27987731644206]
        },
        {
          id: 5,
          coordinate: [104.79717285156251, 30.27987731644206]
        },
        {
          id: 6,
          coordinate: [105.2464892578125, 30.27987731644206]
        },
         {
          id: 7,
          coordinate: [105.6311474609375, 30.27987731644206]
        },
        {
          id: 8,
          coordinate: [106.04827880859372, 30.27987731644206]
        },
         {
          id: 9,
          coordinate: [106.44653320312497, 30.27987731644206]
        },
        {
          id: 9,
          coordinate: [106.90993164062501, 30.27987731644206]
        },
         {
          id: 10,
          coordinate: [107.29106933593751, 30.27987731644206]
        },
        {
          id: 11,
          coordinate: [107.75665283203124, 30.27987731644206]
        },
         {
          id: 12,
          coordinate: [108.13525634765624, 30.27987731644206]
        },
        {
          id: 13,
          coordinate: [108.98525634765624, 30.27987731644206]
        },
        {
          id: 14,
          coordinate: [109.43525634765624, 30.27987731644206]
        },
        {
          id: 15,
          coordinate: [109.81525634765624, 30.27987731644206]
        },
        {
          id: 16,
          coordinate: [110.33525634765624, 30.27987731644206]
        },
        {
          id: 17,
          coordinate: [110.81525634765624, 30.27987731644206]
        },
        {
          id: 18,
          coordinate: [111.53320312499997, 30.27987731644206]
        },
        {
          id: 19,
          coordinate: [113.06030273437497, 30.27987731644206]
        },
        {
          id: 18,
          coordinate: [113.7469482421875, 30.27987731644206]
        },
        {
          id: 19,
          coordinate: [114.1424560546875, 30.27987731644206]
        },
        {
          id: 20,
          coordinate: [114.62310791015626, 30.27987731644206]
        },
        {
          id: 21,
          coordinate: [115.69702148437499, 30.27987731644206]
        },
        {
          id: 22,
          coordinate: [117.21313476562497, 30.27987731644206]
        },
        {
          id: 21,
          coordinate: [114.999951171875, 30.27987731644206]
        },
        {
          id: 22,
          coordinate: [117.91548583984371, 30.27987731644206]
        },
        {
          id: 23,
          coordinate: [118.29958251953121, 30.27987731644206]
        },
        {
          id: 24,
          coordinate: [118.76375488281247, 30.27987731644206]
        },
        {
          id: 25,
          coordinate: [119.14947509765621, 30.27987731644206]
        },
        {
          id: 26,
          coordinate: [119.67681884765622, 30.27987731644206]
        }
      ],
       carInCoordinates: [
        {
          id: "",
          coordinate: [108.24829101562499, 22.78945654904861]
        },
        {
           id: "",
          coordinate: [109.25354003906251, 22.78945654904861]
        },
        {
          id: "",
          coordinate: [109.951171875, 22.78945654904861]
        },
        {
          id: "",
          coordinate: [110.35851562500001, 22.78945654904861]
        },
        {
          id: "",
          coordinate: [111.478271484375, 22.78945654904861]
        },
         {
          id: "",
          coordinate: [112.67578125, 22.78945654904861]
        },
        {
          id: "",
          coordinate: [113.0712890625, 22.78945654904861]
        },
         {
          id: "",
          coordinate: [114.42260742187501, 22.78945654904861]
        },
        {
          id: "",
          coordinate: [115.21362304687501, 22.78945654904861]
        },
         {
          id: "",
          coordinate: [116.22436523437501, 22.78945654904861]
        },
        {
          id: "",
          coordinate: [117.037353515625, 22.78945654904861]
        },
         {
          id: "",
          coordinate: [118.23486328124999, 22.78945654904861]
        },
        {
          id: "",
          coordinate: [118.63037109375001, 22.78945654904861]
        },
        {
          id: "",
          coordinate: [119.83886718750001, 22.78945654904861]
        },
        {
          id: "",
          coordinate: [120.64086914062501, 22.78945654904861]
        }
      ],
      planeCoorinates: [
        {
          progress: 0.1, //进度
          coordinate: [103.392333984375, 29.1852822929746]
        },
        {
          progress: 0.6, //进度
          coordinate: [105.787353515625, 29.1852822929746]
        },
        {
          progress: 0.8, //进度
          coordinate: [103.392333984375, 27.331266913515743]
        },
        {
          progress: 0.3, //进度
          coordinate: [105.787353515625, 27.331266913515743]
        },
        {
          progress: 1, //进度
          coordinate: [103.392333984375, 28.9552822929746]
        },
        {
          progress: 0.6, //进度
          coordinate: [105.787353515625, 29.1852822929746]
        },
        {
          progress: 0.8, //进度
          coordinate: [103.392333984375, 27.331266913515743]
        },
        {
          progress: 0.3, //进度
          coordinate: [105.787353515625, 27.331266913515743]
        },
        {
          progress: 0.6, //进度
          coordinate: [105.787353515625, 29.1852822929746]
        },
        {
          progress: 0.8, //进度
          coordinate: [103.392333984375, 27.331266913515743]
        },
        {
          progress: 0.3, //进度
          coordinate: [105.787353515625, 27.331266913515743]
        },
        {
          progress: 0.8, //进度
          coordinate: [103.392333984375, 27.331266913515743]
        },
        {
          progress: 0.3, //进度
          coordinate: [105.787353515625, 27.331266913515743]
        },
        {
          progress: 0.6, //进度
          coordinate: [105.787353515625, 29.1852822929746]
        },
        {
          progress: 0.8, //进度
          coordinate: [103.392333984375, 27.331266913515743]
        },
        {
          progress: 0.8, //进度
          coordinate: [103.392333984375, 27.331266913515743]
        },
        {
          progress: 0.3, //进度
          coordinate: [105.787353515625, 27.331266913515743]
        },
        {
          progress: 0.8, //进度
          coordinate: [103.392333984375, 27.331266913515743]
        },
        {
          progress: 0.3, //进度
          coordinate: [105.787353515625, 27.331266913515743]
        },
        {
          progress: 0.6, //进度
          coordinate: [105.787353515625, 29.1852822929746]
        },
        {
          progress: 0.8, //进度
          coordinate: [103.392333984375, 27.331266913515743]
        },
        {
          progress: 0.8, //进度
          coordinate: [103.392333984375, 27.331266913515743]
        },
        {
          progress: 0.3, //进度
          coordinate: [105.787353515625, 27.331266913515743]
        },
        {
          progress: 0.8, //进度
          coordinate: [103.392333984375, 27.331266913515743]
        },
        {
          progress: 0.3, //进度
          coordinate: [105.787353515625, 27.331266913515743]
        }
      ],
      circleOutCoordinates: [
        {
          id: 1, //滑槽号
          coordinate: [103.65600585937499, 31.527043924837926],
          count: 1 //异常行李数量
        },
        {
          id: 2, //滑槽号
          coordinate: [103.93066406249999, 31.517678781287174],
          count: 130
        },
        {
          id: 3,
          coordinate: [104.512939453125, 31.498945677962936],
          count: 8
        },
        {
          id: 4,
          coordinate: [104.7216796875, 31.48957771850195],
          count: 30
        },
        {
          id: 5,
          coordinate: [105.32592773437499, 31.508312698943456],
          count: 6
        },
        {
          id: 6,
          coordinate: [105.567626953125, 31.498945677962936],
          count: 2
        },
        {
          id: 7,
          coordinate: [106.138916015625, 31.498945677962936],
          count: 87
        },
        {
          id: 8,
          coordinate: [106.43554687500001, 31.480208820716925],
          count: 100
        },
        {
          id: 9,
          coordinate: [107.00408935546874, 31.50948351057133],
          count: 2
        },
        {
          id: 10,
          coordinate: [107.21557617187499, 31.511825089827255],
          count: 87
        },
        {
          id: 11,
          coordinate: [107.841796875, 31.51416661041472],
          count: 100
        },
        {
          id: 12,
          coordinate: [108.050537109375, 31.51416661041472],
          count: 100
        },
        {
          id: 13,
          coordinate: [108.63555908203124, 31.511825089827255],
          count: 100
        },
        {
          id: 14,
          coordinate: [108.90197753906251, 31.50948351057133],
          count: 100
        },
        {
          id: 15,
          coordinate: [109.49249267578125, 31.516508072331277],
          count: 100
        },{
          id: 16,
          coordinate: [109.69848632812499, 31.511825089827255],
          count: 100
        },{
          id: 17,
          coordinate: [110.33294677734374, 31.516508072331277],
          count: 100
        },{
          id: 18,
          coordinate: [110.7366943359375, 31.511825089827255],
          count: 100
        },{
          id: 19,
          coordinate: [111.60736083984375, 31.51416661041472],
          count: 100
        },{
          id: 20,
          coordinate: [112.98339843749997, 31.51884947557447],
          count: 100
        },{
          id: 21,
          coordinate: [113.81561279296874, 31.516508072331277],
          count: 100
        },{
          id: 22,
          coordinate: [114.09301757812499, 31.51416661041472],
          count: 100
        },{
          id: 23,
          coordinate: [114.67803955078124, 31.51416661041472],
          count: 100
        },{
          id: 24,
          coordinate: [114.88677978515625, 31.51416661041472],
          count: 100
        },{
          id: 25,
          coordinate: [115.76568603515626, 31.514166610414676],
          count: 100
        },
        {
          id: 26,
          coordinate: [117.13623046875, 31.518849475574456],
          count: 100
        },
        {
          id: 27,
          coordinate: [118.00689697265624, 31.50948351057133],
          count: 100
        },{
          id: 28,
          coordinate: [118.20739746093749, 31.511825089827255],
          count: 100
        },{
          id: 29,
          coordinate: [118.80340576171874, 31.516508072331277],
          count: 100
        },{
          id: 30,
          coordinate: [119.08355712890624, 31.51416661041472],
          count: 100
        },{
          id: 31,
          coordinate: [119.67407226562501, 31.51416661041472],
          count: 100
        }
      ],
      circleInCoordinates: [
        {
          id: 1, //滑槽号
          coordinate: [108.24005126953124, 21.38019613028665],
          count: 1 //异常行李数量
        },
        {
          id: 2, //滑槽号
          coordinate: [109.259033203125, 21.41727615699365],
          count: 20 //异常行李数量
        },
        {
          id: 3, //滑槽号
          coordinate: [110.07202148437501, 21.41727615699365],
          count: 80 //异常行李数量
        },
        {
          id: 4, //滑槽号
          coordinate: [110.247802734375, 21.396819374082185],
          count: 60 //异常行李数量
        },
        {
          id: 5, //滑槽号
          coordinate: [111.46728515625003, 21.78500629191595],
          count: 78 //异常行李数量
        },
        {
          id: 6, //滑槽号
          coordinate: [112.67578125, 21.79520764617142],
          count: 34 //异常行李数量
        },
        {
          id: 7, //滑槽号
          coordinate: [113.0712890625, 21.815608175662646],
          count: 12 //异常行李数量
        },
        {
          id: 8, //滑槽号
          coordinate: [114.41162109375001, 21.78500629191595],
          count: 110 //异常行李数量
        },
        {
          id: 9, //滑槽号
          coordinate: [115.22460937500001, 21.77480421168289],
          count: 34 //异常行李数量
        },
        {
          id: 10, //滑槽号
          coordinate: [116.22436523437501, 21.764601405743974],
          count: 110 //异常行李数量
        },
        {
          id: 11, //滑槽号
          coordinate: [117.02636718750001, 21.79520764617142],
          count: 34 //异常行李数量
        },
        {
          id: 12, //滑槽号
          coordinate: [118.245849609375, 21.744193617836544],
          count: 12 //异常行李数量
        },
        {
          id: 13, //滑槽号
          coordinate: [118.64135742187501, 21.713576499983617],
          count: 110 //异常行李数量
        },
        {
          id: 14, //滑槽号
          coordinate: [119.805908203125, 21.713576499983617],
          count: 12 //异常行李数量
        },
        {
          id: 15, //滑槽号
          coordinate: [120.64086914062501, 21.703369345524266],
          count: 110 //异常行李数量
        }
      ],
      popupInfo7: [//值机岛
        {
          coordinate: [108.36914062500001, 34.58347505599177],
          counter: 'K20-K29',
          shipped: '128',
          security: 'S01-S28',
          checked: '128'
        },
        {
          coordinate: [111.06079101562497, 34.58347505599177],
          counter: 'K20-K29',
          shipped: '128',
          security: 'S01-S28',
          checked: '128'
        }, {
          coordinate: [113.565673828125, 34.58347505599177],
          counter: 'K20-K29',
          shipped: '128',
          security: 'S01-S28',
          checked: '128'
        }, {
          coordinate: [116.092529296875, 34.58347505599177],
          counter: 'K20-K29',
          shipped: '128',
          security: 'S01-S28',
          checked: '128'
        }],
      popupInfo8: {
        counter: [
          //值机柜台
          {
            coordinate: [107.78249511718749, 34.145907952009765],
            counter: 'K20',
            shipped: '128'
          },
          {
            coordinate: [107.78249511718749, 33.965907952009765],
            counter: 'K20',
            shipped: '128'
          },
          {
            coordinate: [107.78249511718749, 33.785907952009765],
            counter: 'K20',
            shipped: '128'
          },
          {
            coordinate: [107.78249511718749, 33.615907952009765],
            counter: 'K20',
            shipped: '128'
          },
          {
            coordinate: [107.78249511718749, 33.455907952009765],
            counter: 'K20',
            shipped: '128'
          },
          {
            coordinate: [107.78249511718749, 33.295907952009765],
            counter: 'K20',
            shipped: '128'
          },
          {
            coordinate: [107.78249511718749, 33.125907952009765],
            counter: 'K20',
            shipped: '128'
          },
          {
            coordinate: [107.78249511718749, 32.965907952009765],
            counter: 'K20',
            shipped: '128'
          },
          {
            coordinate: [107.78249511718749, 32.795907952009765],
            counter: 'K20',
            shipped: '128'
          },
          {
            coordinate: [107.78249511718749, 32.599907952009765],
            counter: 'K20',
            shipped: '128'
          }
        ],
        security: [//安检
          {
            coordinate: [108.36111328125, 34.12317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [108.36111328125, 33.94317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [108.36111328125, 33.77317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [108.36111328125, 33.60317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [108.36111328125, 33.45317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [108.36111328125, 33.28317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [108.36111328125, 33.12317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [108.36111328125, 32.96317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [108.36111328125, 32.79317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [108.36111328125, 32.62317388304314],
            security: 'S01',
            checked: '128'
          },

          {
            coordinate: [108.90111328125, 34.12317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [108.90111328125, 33.94317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [108.90111328125, 33.77317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [108.90111328125, 33.60317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [108.90111328125, 33.45317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [108.90111328125, 33.28317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [108.90111328125, 33.12317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [108.90111328125, 32.96317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [108.90111328125, 32.79317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [108.90111328125, 32.62317388304314],
            security: 'S01',
            checked: '128'
          },

          {
            coordinate: [111.03111328125, 34.12317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [111.03111328125, 33.94317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [111.03111328125, 33.77317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [111.03111328125, 33.60317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [111.03111328125, 33.45317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [111.03111328125, 33.28317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [111.03111328125, 33.12317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [111.03111328125, 32.96317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [111.03111328125, 32.79317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [111.03111328125, 32.62317388304314],
            security: 'S01',
            checked: '128'
          },

          {
            coordinate: [111.57111328125, 34.12317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [111.57111328125, 33.94317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [111.57111328125, 33.77317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [111.57111328125, 33.60317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [111.57111328125, 33.45317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [111.57111328125, 33.28317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [111.57111328125, 33.12317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [111.57111328125, 32.96317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [111.57111328125, 32.79317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [111.57111328125, 32.62317388304314],
            security: 'S01',
            checked: '128'
          },

          {
            coordinate: [113.52111328125, 34.12317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [113.52111328125, 33.94317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [113.52111328125, 33.77317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [113.52111328125, 33.60317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [113.52111328125, 33.45317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [113.52111328125, 33.28317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [113.52111328125, 33.12317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [113.52111328125, 32.96317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [113.52111328125, 32.79317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [113.52111328125, 32.62317388304314],
            security: 'S01',
            checked: '128'
          },

          {
            coordinate: [114.06111328125, 34.12317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [114.06111328125, 33.94317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [114.06111328125, 33.77317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [114.06111328125, 33.60317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [114.06111328125, 33.45317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [114.06111328125, 33.28317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [114.06111328125, 33.12317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [114.06111328125, 32.96317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [114.06111328125, 32.79317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [114.06111328125, 32.62317388304314],
            security: 'S01',
            checked: '128'
          },

           {
            coordinate: [116.03111328125, 34.12317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [116.03111328125, 33.94317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [116.03111328125, 33.77317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [116.03111328125, 33.60317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [116.03111328125, 33.45317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [116.03111328125, 33.28317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [116.03111328125, 33.12317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [116.03111328125, 32.96317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [116.03111328125, 32.79317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [116.03111328125, 32.62317388304314],
            security: 'S01',
            checked: '128'
          },

          {
            coordinate: [116.56111328125, 34.12317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [116.56111328125, 33.94317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [116.56111328125, 33.77317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [116.56111328125, 33.60317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [116.56111328125, 33.45317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [116.56111328125, 33.28317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [116.56111328125, 33.12317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [116.56111328125, 32.96317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [116.56111328125, 32.79317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [116.56111328125, 32.62317388304314],
            security: 'S01',
            checked: '128'
          },
        ]
      },
      popupInfo9: {
        counter: [
          {
            coordinate: [107.97649511718749, 34.145907952009765],
            counter: 'K20',
            shipped: '128'
          },
          {
            coordinate: [107.97649511718749, 33.965907952009765],
            counter: 'K20',
            shipped: '128'
          },
          {
            coordinate: [107.97649511718749, 33.825907952009765],
            counter: 'K20',
            shipped: '128'
          },
          {
            coordinate: [107.97649511718749, 33.635907952009765],
            counter: 'K20',
            shipped: '128'
          },
          {
            coordinate: [107.97649511718749, 33.508907952009765],
            counter: 'K20',
            shipped: '128'
          },
          {
            coordinate: [107.97649511718749, 33.315907952009765],
            counter: 'K20',
            shipped: '128'
          },
          {
            coordinate: [107.97649511718749, 33.175907952009765],
            counter: 'K20',
            shipped: '128'
          },
          {
            coordinate: [107.97649511718749, 32.985907952009765],
            counter: 'K20',
            shipped: '128'
          },
          {
            coordinate: [107.97649511718749, 32.865907952009765],
            counter: 'K20',
            shipped: '128'
          },
          {
            coordinate: [107.97649511718749, 32.672907952009765],
            counter: 'K20',
            shipped: '128'
          },

          {
            coordinate: [109.34649511718749, 34.145907952009765],
            counter: 'K20',
            shipped: '128'
          },
          {
            coordinate: [109.34649511718749, 33.965907952009765],
            counter: 'K20',
            shipped: '128'
          },
          {
            coordinate: [109.34649511718749, 33.825907952009765],
            counter: 'K20',
            shipped: '128'
          },
          {
            coordinate: [109.34649511718749, 33.635907952009765],
            counter: 'K20',
            shipped: '128'
          },
          {
            coordinate: [109.34649511718749, 33.508907952009765],
            counter: 'K20',
            shipped: '128'
          },
          {
            coordinate: [109.34649511718749, 33.315907952009765],
            counter: 'K20',
            shipped: '128'
          },
          {
            coordinate: [109.34649511718749, 33.175907952009765],
            counter: 'K20',
            shipped: '128'
          },
          {
            coordinate: [109.34649511718749, 32.985907952009765],
            counter: 'K20',
            shipped: '128'
          },
          {
            coordinate: [109.34649511718749, 32.865907952009765],
            counter: 'K20',
            shipped: '128'
          },
          {
            coordinate: [109.34649511718749, 32.672907952009765],
            counter: 'K20',
            shipped: '128'
          },
        ],
        security: [
           {
            coordinate: [108.34111328125, 34.14317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [108.34111328125, 33.96317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [108.34111328125, 33.82317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [108.34111328125, 33.64317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [108.34111328125, 33.50317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [108.34111328125, 33.32317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [108.34111328125, 33.17317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [108.34111328125, 33.00117388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [108.34111328125, 32.85817388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [108.34111328125, 32.68317388304314],
            security: 'S01',
            checked: '128'
          },

          {
            coordinate: [109.06111328125, 34.14317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [109.06111328125, 33.96317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [109.06111328125, 33.82317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [109.06111328125, 33.64317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [109.06111328125, 33.50317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [109.06111328125, 33.32317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [109.06111328125, 33.17317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [109.06111328125, 33.00117388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [109.06111328125, 32.85817388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [109.06111328125, 32.68317388304314],
            security: 'S01',
            checked: '128'
          },

          {
            coordinate: [111.01111328125, 34.14317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [111.01111328125, 33.96317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [111.01111328125, 33.82317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [111.01111328125, 33.64317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [111.01111328125, 33.50317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [111.01111328125, 33.32317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [111.01111328125, 33.17317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [111.01111328125, 33.00117388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [111.01111328125, 32.85817388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [111.01111328125, 32.68317388304314],
            security: 'S01',
            checked: '128'
          },

          {
            coordinate: [111.74111328125, 34.14317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [111.74111328125, 33.96317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [111.74111328125, 33.82317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [111.74111328125, 33.64317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [111.74111328125, 33.50317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [111.74111328125, 33.32317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [111.74111328125, 33.17317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [111.74111328125, 33.00117388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [111.74111328125, 32.85817388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [111.74111328125, 32.68317388304314],
            security: 'S01',
            checked: '128'
          },

          {
            coordinate: [113.50111328125, 34.14317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [113.50111328125, 33.96317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [113.50111328125, 33.82317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [113.50111328125, 33.64317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [113.50111328125, 33.50317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [113.50111328125, 33.32317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [113.50111328125, 33.17317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [113.50111328125, 33.00117388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [113.50111328125, 32.85817388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [113.50111328125, 32.68317388304314],
            security: 'S01',
            checked: '128'
          },

          {
            coordinate: [114.22111328125, 34.14317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [114.22111328125, 33.96317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [114.22111328125, 33.82317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [114.22111328125, 33.64317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [114.22111328125, 33.50317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [114.22111328125, 33.32317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [114.22111328125, 33.17317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [114.22111328125, 33.00117388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [114.22111328125, 32.85817388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [114.22111328125, 32.68317388304314],
            security: 'S01',
            checked: '128'
          },

          {
            coordinate: [116.00111328125, 34.14317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [116.00111328125, 33.96317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [116.00111328125, 33.82317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [116.00111328125, 33.64317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [116.00111328125, 33.50317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [116.00111328125, 33.32317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [116.00111328125, 33.17317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [116.00111328125, 33.00117388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [116.00111328125, 32.85817388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [116.00111328125, 32.68317388304314],
            security: 'S01',
            checked: '128'
          },

          {
            coordinate: [116.74111328125, 34.14317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [116.74111328125, 33.96317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [116.74111328125, 33.82317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [116.74111328125, 33.64317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [116.74111328125, 33.50317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [116.74111328125, 33.32317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [116.74111328125, 33.17317388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [116.74111328125, 33.00117388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [116.74111328125, 32.85817388304314],
            security: 'S01',
            checked: '128'
          },
          {
            coordinate: [116.74111328125, 32.68317388304314],
            security: 'S01',
            checked: '128'
          },
          
        ]
      },
      overlayArr: []
    }
  },
  created() {
    this.$nextTick(() => {
      setTimeout(() => {
        gis.Geometry.drawGeometry({
          mapId: this.mapIdA,
          type: 'Point',
          callbackfun: function(obj) {
              console.log('['+ obj.coordinate[0] + ', ' + obj.coordinate[1] + ']');
          }
        })
      },200)
      this.createMap(this.param) //初始化地图
      this.createMap(this.paramA)
      this.initPopup() //加载最小级别的popup
      this.popupChange()
      this.loadCircle()
      this.loadStand()
      this.loadCar()

      this.loadInStand()
      this.loadFlightTip()
    })
  },
  beforeDestroy() {
    gis.Map.removeMap(this.mapId)
    gis.Map.removeMap(this.mapIdA)
  },
  methods: {
    loadData() {

    },
    refreshData() {
      if (this.timer) {
        clearInterval(this.timer)
      } else {
        this.timer = setInterval(() => {
          this.loadData()
          //根据地图级别去刷新所有图层
        }, 60000)
      }
    },
    initPopup() {
      for (let p = 0; p < this.popupInfo7.length; p++) {
        this.overlayArr[p] = document.createElement('div')
        this.overlayArr[p].className = 'minZoomPop'
        this.overlayArr[p].innerHTML = '<div>值机柜台 ' + this.popupInfo7[p].counter + '</div>' +
          '<div>已交运：' + this.popupInfo7[p].shipped + '</div>' +
          '<div>安检 ' + this.popupInfo7[p].security + '</div>' +
          '<div>已安检 ' + this.popupInfo7[p].checked + '</div>'

        document.getElementById(this.mapId).appendChild(this.overlayArr[p])
        gis.Popup.creatToolTip({
          mapId: this.mapId,
          tipsId: this.tipsId.counterAndSecurity,
          element: this.overlayArr[p],
          coordinate: this.popupInfo7[p].coordinate
        })
      }
    },
    loadPopup(popupObj, type, mapId) {
      for (let p = 0; p < popupObj.length; p++) {
        this.overlayArr[p] = document.createElement('div')
        let currentZoom = gis.Map.getMapObj(mapId).getView().getZoom()
        this.overlayArr[p].className = currentZoom == 7 ? 'minZoomPop' : (currentZoom == 8 ? 'secondZoomPop' : 'maxZoomPop')
        this.overlayArr[p].innerHTML = type == this.popupType.counterAndSecurity ?
          '<div>值机柜台 ' + popupObj[p].counter + '</div>' +
          '<div>已交运：' + popupObj[p].shipped + '</div>' +
          '<div>安检 ' + popupObj[p].security + '</div>' +
          '<div>已安检 ' + popupObj[p].checked + '</div>' :
          (type == this.popupType.counter ?
            '<div>值机柜台 ' + popupObj[p].counter + '</div>' +
            '<div>已交运：' + popupObj[p].shipped + '</div>' :
            '<div>安检 ' + popupObj[p].security + '</div>' +
            '<div>已安检 ' + popupObj[p].checked + '</div>')

        document.getElementById(this.mapId).appendChild(this.overlayArr[p])
        gis.Popup.creatToolTip({
          mapId: this.mapId,
          tipsId: this.tipsId.counterAndSecurity,
          element: this.overlayArr[p],
          coordinate: popupObj[p].coordinate
        })
      }
    },
    refreshOverlay (zoom) { //更新值机柜台及安检的popup
      let map = gis.Map.getMapObj(this.mapId)
      let overlayObjs = map.getOverlays().getArray()
      for (let o = 0; o < overlayObjs.length; o++) { //移除当前级别的所有popup
        map.removeOverlay(overlayObjs[o])
      }

      if(zoom % 1 === 0) {
        if(zoom == 7) {
          this.loadPopup(this.popupInfo7, this.popupType.counterAndSecurity, this.mapId)
        }else if (zoom == 8) {
          this.loadPopup(this.popupInfo8.counter, this.popupType.counter, this.mapId)
          this.loadPopup(this.popupInfo8.security, this.popupType.security, this.mapId)
        }else if (zoom == 9) {
          this.loadPopup(this.popupInfo9.counter, this.popupType.counter, this.mapId)
          this.loadPopup(this.popupInfo9.security, this.popupType.security, this.mapId)
        }
      }
    },
    popupChange() {
      let mapObj = gis.Map.getMapObj(this.mapId)
      if (mapObj) {
        mapObj.getView().on('change:resolution', ((e) => {
          this.refreshOverlay(e.target.getZoom())//更新值机柜台及安检的popup
          
          //更新航班图层
          let param = {
            mapId: this.mapId,
            layerId: "planeLayer",
            updatePoint: {
              imgPath: planeImg,
              label: "MU2560",
              font: "16px DINPro",
              color: "#D2E5F3",
              offsetY: 70,
              scale: 0.4
            }
          }

          let currentZoom = e.target.getZoom()
          param.updatePoint.offsetY = currentZoom <= 7 ? 70 : ((currentZoom >= 8 && currentZoom < 9) ? 120 : 218)
          param.updatePoint.scale = currentZoom < 8 ? 0.18 : ((currentZoom = 8 && currentZoom < 9) ? 0.4 : 0.88)
          this.updateLayer(param)

          // this.loadFlightTip()
        }))
      }
    },
    loadCircle() {
      let circleOutParam = {
        mapId: this.mapId,
        layerId: "circle",
        coordinates: this.circleOutCoordinates
      }
      let circleInParam = {
        mapId: this.mapIdA,
        layerId: "circleIn",
        coordinates: this.circleInCoordinates
      }
      this.addCircle(circleOutParam)
      // this.addCircle(circleInParam)
    },
    loadInStand () {
      let progressParam = {
        mapId: this.mapIdA,
        datas: []
      },
        planeParam = {
          mapId: this.mapIdA,
          datas: []
        }

      let coordinate = [108.07524414062501, 24.21189967855325]
      // let coordinate = [108.2373046875, 24.23004055946545]
      let deltX = 1.4
      let maxX = 119.492333984375
      let deltY = -1.7
      let count = 9

      this.planeCoorinates.forEach((feature, index) => {
        let mapObj = gis.Map.getMapObj(this.mapIdA)
        let zoom = mapObj.getView().getZoom()
        let obj = {},
          planeObj = {}
        let x = coordinate[0] + (deltX * index)
        if (index > count) {
          let deltIndex = index - (count + 1) * Math.floor(index / (count + 1))
          let ranlY = Math.floor(index / (count + 1))
          let currentX = coordinate[0] + (deltX * deltIndex)
          let currentY = coordinate[1] - (deltY * ranlY)
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
    loadStand() {
      let progressParam = {
        mapId: this.mapId,
        datas: []
      },
        planeParam = {
          mapId: this.mapId,
          datas: []
        }

      let coordinate = [103.092333984375, 29.3852822929746]
      // let coordinate = [108.2373046875, 24.23004055946545]
      let deltX = 1.4
      let maxX = 119.492333984375
      let deltY = -1.7
      let count = 12

      this.planeCoorinates.forEach((feature, index) => {
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

      console.log('planeCoor',this.planeCoorinates)
    },
    loadCar() {
      let carOutParam = {
        mapId: this.mapId,
        layerId: "carOut",
        coordinates: this.carOutCoordinates,
        datas: []
      }
      let carInParam = {
        mapId: this.mapIdA,
        layerId: "carIn",
        coordinates: this.carInCoordinates,
        datas: []
      }
      
      this.addCar(carOutParam)
      this.addCar(carInParam)
    },
    loadFlightTip () {
      var arr = [{coordinate:[108.13842773437497, 20.01260638575408]},
      {coordinate:[109.12719726562497, 20.648205934292633]},{
        coordinate:[109.97314453125001, 19.933312897223718]},{coordinate:[111.302490234375, 20.6639448490769]},
        {coordinate:[112.510986328125, 20.622875478868454]},{coordinate:[114.38964843749999, 20.627643341686763]},
        {coordinate:[115.12573242187499, 21.286589909132894]},{coordinate:[116.21337890625, 20.627643341686763]},
        {coordinate:[116.92749023437501, 21.286589909132894]},{coordinate:[118.15795898437501, 20.565938903465266]},
         {coordinate:[119.73886718749999, 20.576224710301645]},{coordinate:[120.531005859375, 21.192094484509028]}
      ]
      // for (let p = 0; p < this.planeCoorinates.length; p++) {
      for (let p = 0; p < arr.length; p++) {
        this.overlayArr[p] = document.createElement('div')
        this.overlayArr[p].className = 'planePop'
        this.overlayArr[p].innerHTML = '<div>转盘数：' + '332' + '</div>' +
          '<div>上包数：' + '30' + '</div>' 

        document.getElementById(this.mapId).appendChild(this.overlayArr[p])
        gis.Popup.creatToolTip({
          mapId: this.mapIdA,
          tipsId: this.tipsId.stand,
          element: this.overlayArr[p],
          coordinate: arr[p].coordinate
        })
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


