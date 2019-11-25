<template>
<!-- 综合运行监控，航班列表及行李列表 -->
<div>
  <div class="flight-menu">
    <!-- 航班列表 -->
    <div class="flight-list" v-if="currentFlight == ''">
      <div>
        <div class="title">{{ titleName }}</div>
        <img class="close-btn" :src="require('@icon/icon_close.png')" @click="closeFlightList"/>
      </div>
      <div>
        <input type="text" placeholder="输入航班号/地面代理/航司进行查询" class="search-input" v-model="queryFlightParam.condition" @keyup.enter="onEnter" @change="stringToUpper($event)"/>
        <img class="cancle-btn" :src="require('@icon/icon_close.png')" @click="monitorAllFlight"/>
      </div>
      <div class="flight-title">
        <table>
          <thead>
            <tr>
              <th v-for="(item,index) in tableTh" :key="index" :style="{width:item.width}">{{item.name}}</th>
            </tr>
          </thead>
        </table>
      </div>
      <div class="flight-item">
        <table>
          <tbody>
            <tr v-for="(item,index) in tableData" :key="index" :dynamicFlightId="item.dynamicFlightId" :flightNo="item.flightNoAlias" :dataIndex="index" @click="chooseItem($event)" :station="queryFlightParam.inOutFlag == 'D' ? item.terminalStationCn : item.startStationCn" :time="item.showTime" :status="item.progressStatusCn">
              <td>{{item.flightNoAlias}}</td>
              <td v-if="queryFlightParam.inOutFlag == 'D'" :title="item.terminalStationCn">{{item.terminalStationCn}}</td>
              <td v-else :title="item.startStationCn">{{item.startStationCn}}</td>
              <td>{{item.showTime}}</td>
              <td v-if="item.progressStatusCn">
                <div>{{item.progressStatusCn}}</div>
              </td>
              <td v-else>
                <div>--</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- 行李列表 -->
    <div class="lug-info" v-else-if="currentFlight != '' && currentFlight != true">
      <div class="flight-number">
        <div @click="backTo">
          <img :src="require('@img/gis/backToFlight.png')">
          <div>返回</div>
        </div>
        
        <div>{{currentFlightNo}}</div>
        <!-- <img class="close-btn" :src="require('@icon/icon_close.png')" @click="closeFlightList"/> -->
      </div>
      <div class="flight-info">
        <table>
          <tbody>
            <tr>
              <td>{{ tableTh[1].name }}</td>
              <td>{{ tableTh[2].name }}</td>
              <td>状态</td>
            </tr>
            <tr>
              <td>{{ destination }}</td>
              <td>{{ time }}</td>
              <td>{{ status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <hr>
      <div class="lug-title">
        <div>行李号</div>
        <div>当前保障状态</div>
      </div>
      <div class="lug-list">
        <table>
          <tbody>
            <tr v-for="(item,index) in luggageData" :key="index">
              <td>{{ item.lugNo }}</td>
              <td><div>{{ item.progressStatusCn }}</div></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <!-- 菜单栏 -->
  <title-menu  :param="param" :paramA="paramA" :terminalName="terminalName" :mapAtDom="mapAtDom" :tabItemClick="tabItemClick" :terminalType="terminalType" :closeFlight="isCloseFlight" :inoutFlag="queryFlightParam.inOutFlag" @showFlightList="openOrCloseFlight"
  @showPackageList="openOrClosePackage" :isClosePackage="isClosePackage" @showSourceList="openOrCloseSource" @getTransferStatus="getTransfer" :isCloseSource="isCloseSource" v-bind="$attrs" v-on="$listeners"></title-menu>
  <!-- 节点统计信息 -->
  <PackageInfo :currentFlight="currentFlight" :terminalType="terminalType" :terminalAttr="terminalAttr" :mapAtDom="mapAtDom" :isOutFlag="isOutFlag" :isTransfer="isTransfer" v-if="!isClosePackage" @closePackageTip="closePackage"/>
  <!-- 资源统计信息 -->
  <AirportSourceInfo :terminalType="terminalType" :terminalAttr="terminalAttr" :mapAtDom="mapAtDom" :isOutFlag="isOutFlag" v-if="!isCloseSource" @closeSourceTip="closeSource"/>
</div>
</template>

<script>
import { postData } from '@/util/base'
import TitleMenu from './TitleMenu'
import PackageInfo from "./../componentsAndMixmin/PackageInfo"
import AirportSourceInfo from "./../componentsAndMixmin/AirportSourceInfo"
import { setInterval, clearInterval } from 'timers'

export default {
  components: {
    TitleMenu,
    AirportSourceInfo,
    PackageInfo
  },
  props: {
    inOutFlag: {
      type: String,
      default: "D"
    },
    terminalName: {
      type: String,
      default: "T1航站楼"
    },
    terminalType: {
      type: String,
      default: 'T1'
    },
    terminalAttr: {
      type: String,
      default: "D"
    },
    mapAtDom: {
      type: String,
      default: "mapAt1"
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
  data() {
    return {
      //航班列表标题栏
      titleName: "出港航班列表",
      tableTh: [{ name: '航班号', width: '48px' }, { name: '目的站', width: '38px' }, { name: '计起/预起/实起', width: '60px' }, { name: '状态', width: '28px' }],
      tableData: [], //航班数据
      luggageData: [], //行李数据
      flightUrl: 'runMonitor/queryDynamicFlight',
      queryFlightParam: { 
        terminal: this.terminalType, //可为空，航站楼编号
        attr: this.terminalAttr, //D或I，必须有
        inOutFlag: "D", //A或D，必须有
        condition: "", //航班号、地面代理、航司，可为空
        isTransfer: "N"//是否中转
      },
      luggageUrl: 'runMonitor/queryLuggageByFlightId',
      currentFlight: '',
      currentFlightNo: "",
      destination: "",
      time: "",
      status: "",
      flightInterval: null,
      isOutFlag: true,
      isCloseFlight: false,
      isClosePackage: false,
      isCloseSource: false,
      isTransfer: false
    }
  },
  created () {
    let paramObj = JSON.stringify(this.queryFlightParam)
    this.queryFlightList(paramObj)

    if (this.flightInterval) {
      clearInterval(this.flightInterval)
    }else {
      this.flightInterval = setInterval(() => {
      this.queryFlightList(JSON.stringify(this.queryFlightParam))
      if (this.currentFlight != "") {
        this.queryLuggageList(this.currentFlight)
      }
    },60000)
    }
  },
  destroyed () {
    if(this.flightInterval) {
      clearInterval(this.flightInterval)
    }
  },
  methods: {
    getTransfer(value) {
      this.isTransfer = value

      this.queryFlightParam.isTransfer = value ? 'Y' : 'N'
      if(this.currentFlight != "") {
        this.queryLuggageList(this.currentFlight)
      } else {
        let paramObj = JSON.stringify(this.queryFlightParam)
        this.queryFlightList(paramObj)
      }
    },
    openOrCloseFlight (value) {
      this.currentFlight = value == false ? true : ''
      this.isCloseFlight = value == false ? true : false

      if (!this.isCloseFlight) {
        this.$emit("backToAllFlight", '')
      }

      let paramObj = JSON.stringify(this.queryFlightParam)
      this.queryFlightList(paramObj)
    },
    openOrClosePackage (value) {
      this.isClosePackage = value == false ? true : false
    },
    openOrCloseSource (value) {
      this.isCloseSource = value == false ? true : false
    },
    closePackage (value) {
      this.isClosePackage = value
    },
    closeSource (value) {
      this.isCloseSource = value
    },
    closeFlightList () {
      this.isCloseFlight = true
      this.currentFlight = true
    },
    closeLuggleList () {
      this.isCloseFlight = true
      this.currentFlight = ""
    },
    tabItemClick(event) {
      this.currentFlight = ''
      this.$emit("refreshSingleFlight",this.currentFlight)
      
      let mapAt = document.getElementById(this.mapAtDom)
      if (mapAt) {
        mapAt.style.zIndex = event == "A" ? 1 : -1
        this.titleName = event == "A" ? "进港航班列表" : "出港航班列表"
        this.tableTh[1].name = event == "A" ? "始发站" : "目的站"
        this.tableTh[2].name = event == "A" ? "计到/预到/实到" : "计起/预起/实起"

        this.isOutFlag = event == "A" ? false : true
      } 

      this.queryFlightParam.inOutFlag = event
      if (this.queryFlightParam.inOutFlag == 'A') {
        this.queryFlightParam.isTransfer = 'N'
      } else {
        this.queryFlightParam.isTransfer = this.isTransfer ? 'Y': 'N' 
      }
      let paramObj = JSON.stringify(this.queryFlightParam)
      this.queryFlightList(paramObj)
    },
    onEnter () {
      let paramObj = JSON.stringify(this.queryFlightParam)
      this.queryFlightList(paramObj)
    },
    monitorAllFlight () {
      this.queryFlightParam.condition = ""
      this.onEnter()
    },
    stringToUpper (e) {
      this.queryFlightParam.condition = this.queryFlightParam.condition.toUpperCase()
    },
    backTo() {
      this.currentFlight = ""
      let paramObj = JSON.stringify(this.queryFlightParam)
      this.queryFlightList(paramObj)

      this.$emit("backToAllFlight", this.currentFlight)
    },
    chooseItem (event) {
      this.destination = event.target.getAttribute('station') || event.target.parentNode.getAttribute('station')
      this.time = event.target.getAttribute('time') || event.target.parentNode.getAttribute('time')
      this.status = event.target.getAttribute('status') || event.target.parentNode.getAttribute('status')

      this.currentFlight = event.target.getAttribute('dynamicflightid') || event.target.parentNode.getAttribute('dynamicflightid') || event.target.parentNode.parentNode.getAttribute('dynamicflightid')
      this.currentFlightNo = event.target.getAttribute('flightNo') || event.target.parentNode.getAttribute('flightNo') || event.target.parentNode.parentNode.getAttribute('flightNo')

      this.$emit("refreshSingleFlight",this.currentFlight)
      this.queryLuggageList(this.currentFlight)
    },
    queryLuggageList (flightId) {
      let isTransfer = this.isTransfer ? 'Y' : 'N'
      postData(this.luggageUrl, {"dynamicFlightId" : flightId,"isTransfer": isTransfer}).then(response => {
        if (response.data.code == 0) {
          this.luggageData = response.data.data
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
    queryFlightList(paramObj) {
      postData(this.flightUrl, paramObj).then(response => {
        if (response.data.code == 0) {
          this.tableData = response.data.data
          if (this.tableData.length == 0) {
            this.$msg.error({
              info: '无匹配的航班！',
              tip: "请重新输入航班号/地面代理/航司"
            })
            return
          }
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.queryFlightParam.inOutFlag == "D") {
              this.tableData[i].showTime = this.tableData[i].atd || this.tableData[i].etd || this.tableData[i].std
              this.tableData[i].showTime = this.tableData[i].showTime ? this.tableData[i].showTime.split(" ")[1] : "--:--"
            } else {
              this.tableData[i].showTime = this.tableData[i].ata || this.tableData[i].eta || this.tableData[i].sta
              this.tableData[i].showTime = this.tableData[i].showTime ? this.tableData[i].showTime.split(" ")[1] : "--:--"
            }
          }
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
  }
}
</script>

<style lang="scss" scoped>
.flight-menu {
  position: absolute;
  top: 90px;
  left: 0.5%;
  z-index: 2;
  box-shadow: 0px 0px 160px 0px rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  color:#FFFFFF;
  height: 87%;
  background-image: url(~@img/gis/map_leftwin_bg.png);
  background-repeat: repeat-x;
  background-size: auto 100%;
}

.flight-list, .lug-info {
  width: 300px;
  height: inherit;
}

.search-input {
  -webkit-appearance: none;
  width: 269px;
  height: 38px;
  background: rgba(255,255,255, 0.2);
  border-radius: 19px;
  text-align: left;
  font-family: 'Microsoft YaHei';
  font-size: 14px;
  color: #FFFFFF;
  text-transform:uppercase;
}

.title {
  margin: 16px 0px 20px 21px;
  margin-top: 16px;
  margin-left: 21px;
  text-align: left;
  font-size: 16px;
  font-family: 'Microsoft YaHei';
  line-height: 16px;
}

.flight-title {
  margin-top: 20px;
}

.flight-title table th {
  font-size: 13px;
  line-height: 7px;
  font-family: 'PingFang SC';
  color:#D5DEE6;
  text-align: left;
}

.flight-item {
  width: 300px;
  font-size: 14px;
  font-family: 'Microsoft YaHei';
  color:#899DB2;
  text-align: left;
  overflow-x: hidden;
  height: 95%;
  margin-top: 10px;
}


.flight-item table,.flight-title table,.lug-list table {
  border-collapse: collapse;
  border-spacing: 0;
  text-align: left;
}

.flight-info table {
  border-collapse: separate;
  border-spacing: 0px 9px;
  text-align: left;
}

.flight-item table,.flight-title table {
  width: 300px;
  font-size: 14px;
}

.flight-title table th:nth-child(2) {
  padding-left: 12px;
}

.flight-title table th:last-child {
  text-align: right;
  padding-right: 25px;
}

.flight-title table th:first-child, .flight-item tr td:first-child {
  padding-left: 17px;
}

.flight-item table tr:hover,.lug-list table tr:hover {
  cursor: pointer;
  background: rgba(255, 255, 255, 0.2)
}

.flight-item table tr td:first-child {
  color: #FFFFFF;
  line-height: 50px;
  width: 48px;
}

.flight-item table tr td:nth-child(2) {
  color: #FFFFFF;
  padding-left: 18px;
  width: 70px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break:break-all;
  display: inline-block;
  line-height: 50px;
}

.flight-item table tr td:nth-child(3) {
  color: #FFFFFF;
  text-align: center;
  width: 97px;
}

.flight-item table tr td:last-child {
  width: 28px;
}

.flight-item table tr td:last-child div ,.lug-list tr td:last-child div {
  padding: 2px;
  border: 1px solid #24CAD3;
  color: #24CAD3;
  width: 62px;
  border-radius: 4px;
  margin-right: 10px;
  text-align: center;
  font-size: 12px;
}

.monitor-flight {
  width: 269px;
  height: 38px;
  background: rgba(255,255,255,0.2);
  border-radius: 6px;
  font-size: 16px;
  line-height: 38px;
  text-align: center;
  font-family: 'Microsoft YaHei';
  cursor: pointer;
  position: absolute;
  bottom: 13px;
  left: 17px;
}

.monitor-flight:hover {
  background: rgba(255,255,255,0.3);
}

.flight-number {
  display: flex;
  margin-top: 16px;
  text-align: left;
}

.flight-number div:first-child {
  cursor: pointer;
  display: flex;
  width: 105px;
  font-size: 16px;
  line-height: 16px;

  div {
    padding-left: 9px;
  }
}

.flight-number > div:nth-child(2) {
  font-size: 24px;
  line-height: 16px;
}

.flight-number, .flight-info, .lug-title{
  margin-left: 15px;
  // margin-right: 15px;
}

.flight-info {
  margin-top: 16px;
}

.flight-info tr {
  color: #D5DEE6;
  font-family: 'Microsoft YaHei';
  font-size: 14px;
}

.flight-info tr td:first-child {
  width: 105px;
}

.flight-info tr td:nth-child(2) {
  width: 100px;
}

.flight-info tr:last-child td:last-child{
  color: #24CAD3;
}

.flight-info tr td:nth-child(3) {
  text-align: right;
  width: 70px;
}

.lug-list {
  height: inherit;
  overflow: auto;
}

.lug-list table {
  width: 100%;
}

hr {
  opacity: 0.2;
  margin: 21px 15px;
}

.lug-title {
  text-align: left;
  display: flex;
  margin-bottom: 27px;
  color: #D5DEE6;
  font-size: 13px;
  font-family: 'PingFang SC';
  line-height: 7px;
}

.lug-title div:first-child {
  width: 150px;
}

.lug-list tr {
  text-align: left;
  color: #FFFFFF;
  font-size: 14px;
}

.lug-list tr td:first-child {
  color: #FFFFFF;
  width: 165px;
  line-height: 50px;
  padding-left: 15px;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 14px;
  height: 14px;
  cursor: pointer;
}

.cancle-btn {
  position: absolute;
  top: 65px;
  right: 33px;
  width: 14px;
  height: 14px;
  cursor: pointer;
  padding: 2px 2px;
}

.cancle-btn:hover {
  background: #124263;
  border-radius: 8px;
}
</style>