<template>
  <div class="filght-menu" id="flight-menu">
    <div class="flight-list">
      <div class="title">航班保障</div>
      <div class="templateContent">
        <tabs :tabsData="tabsData" @tabItemClick="tabItemClick"></tabs>
      </div>
      <div class="flight-date">
        <inputTag :prepend="'航班日期'" :pickerOptions="pickerTime" :type="'elDate'" :width="192" v-model="queryFlightParam.execDate" :format="'yyyy-MM-dd'" :valueFormat="'yyyy-MM-dd'"></inputTag>
        <button @click="queryFlightList" class="choose-button">查询</button>
      </div>
      <div class="flight-date">
        <inputTag :prepend="'航 班 号'" :type="'input'" :width="192" v-model="queryFlightParam.flightNo"></inputTag>
        <button @click="resetStatus">重置</button>
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
            <tr v-for="(item,index) in tableData" :key="index" :flightInfo="JSON.stringify(item)" :dynamicFlightId="item.dynamicFlightId" :dataIndex="index" @click="clickFlight($event)" :style="{'background' : chooseFlight == item.dynamicFlightId ? 'rgba(51, 146, 255, 0.1)' : ''}">
              <td>{{item.flightNoAlias}}</td>
              <td v-if="queryFlightParam.inOutFlag == 'D'">{{item.terminalStationCn}}</td>
              <td v-else>{{item.startStationCn}}</td>
              <td>{{item.showTime}}</td>
              <td v-if="item.progressStatusCn"><div>{{item.progressStatusCn}}</div></td>
              <td v-else><div></div></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="flight-canvas" id="flightCanvas" :style = "{'width': hidden ? 'calc(100% - 300px)' : 'calc(100% - 760px)'}"></div>
    <div class="infos" v-if="!hidden">
      <div>
        <div class="background-set">
          <div>画板颜色</div>
          <div @click="canvasBg = ''" :class = "canvasBg == '' ? 'borderBg' : '' "></div>
          <div @click="canvasBg = 'dark'" :class = "canvasBg == '' ? '' : 'borderBg' "></div>
        </div>
        <div class="time-title">
          <div>{{flightInfo.titleTimeD}}</div>
          <div>
            <div class="arrow">></div>
          </div>
          <div>{{flightInfo.titleTimeA}}</div>
          <button>{{flightInfo.titleTimeType}}</button>
        </div>
        <div class="time-item">
          <div><div>计起</div><div>{{flightInfo.std}}</div></div>
          <div><div>预起</div><div>{{flightInfo.etd}}</div></div>
          <div><div>实起</div><div>{{flightInfo.atd}}</div></div>
          <div><div>计到</div><div>{{flightInfo.sta}}</div></div>
          <div><div>预到</div><div>{{flightInfo.eta}}</div></div>
          <div><div>实到</div><div>{{flightInfo.ata}}</div></div>
        </div>
      </div>
      <div class="flight-info">
        <div>航班信息</div>
        <table>
          <tbody>
            <tr>
              <td>航班号</td>
              <td>航班日期</td>
              <td colspan="2">航线</td>
            </tr>
            <tr>
              <td>{{flightInfo.flightNoAlias}}</td>
              <td>{{flightInfo.execDate}}</td>
              <td colspan="2">{{flightInfo.routeCn}}</td>
            </tr>
            <tr>
              <td>航空公司</td>
              <td>属性</td>
              <td>航站楼</td>
              <td>进出标识</td>
            </tr>
            <tr>
              <td>{{flightInfo.airlineCn}}</td>
              <td>{{flightInfo.attrCn}}</td>
              <td>{{flightInfo.terminal}}</td>
              <td>{{flightInfo.inOutFlag}}</td>
            </tr>
            <tr>
              <td>滑槽号</td>
              <td>机号</td>
              <td>机型</td>
              <td>机位</td>
            </tr>
             <tr>
              <td>{{flightInfo.chute}}</td>
              <td>{{flightInfo.aircraftNo}}</td>
              <td>{{flightInfo.aircraftType}}</td>
              <td>{{flightInfo.stand}}</td>
            </tr>
          </tbody>
        </table>  
      </div>
      <div class="node-info">
        <div>节点信息</div>
        <table>
          <tbody>
            <tr>
              <td>节点名称</td>
              <td>数据源</td>
              <td>计划时间</td>
              <td>实际时间</td>
            </tr>
            <tr>
              <td>{{nodeInfo.nodeCn}}</td>
              <td>{{nodeInfo.dataSource}}</td>
              <td>{{nodeInfo.expectedTime}}</td>
              <td>{{nodeInfo.actualTime}}</td>
            </tr>
            <tr>
              <td>标准时间</td>
            </tr>
            <tr>
              <td>{{nodeInfo.timespan}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="hidden-button" @click="hidden = !hidden" :class="hidden ? 'rightMove' : ''"></div>
  </div>
</template>

<script>
import Raphael from 'raphael'
import { postData } from '@/util/base'
import { addArrow,addBorderBox } from '../protection/flow'
import Tabs from '@view/Tabs/Tabs'
import InputTag from '@view/InputTag/InputTag'
import { dateFormat } from '@/util/util'
import { setInterval, clearInterval } from 'timers'
import _ from 'lodash'

export default {
  components: {
    Tabs,
    InputTag
  },
  data () {
    return {
      hidden: false,
      queryFlightParam: {
        execDate: "", //可为空，为空默认查询当天
        inOutFlag: "D", //A或D，必须有
        flightNo: "" //可为空
      },
      tableTh: [{name: '航班号', width: '50px'},{name: '目的站', width: '38px'},{name: '计/预/实起', width: '40px'},{name: '状态', width: '28px'}],
      tableThOut: [{name: '航班号', width: '50px'},{name: '目的站', width: '38px'},{name: '计/预/实起', width: '40px'},{name: '状态', width: '28px'}],
      tableThIn: [{name: '航班号', width: '50px'},{name: '始发站', width: '38px'},{name: '计/预/实到', width: '40px'},{name: '状态', width: '28px'}],
      tableData: [],
      tabsData: [
        {
          key: 'D',
          label: '出港航班',
        },
        {
          key: 'A',
          label: '进港航班',
        }
      ],
      selectKey: null,
      paper: null,
      paperWidth: 1150,//1150
      paperHeight: 830,
      beginRect: {
        "fill":"rgba(1,182,116,0.8)",
        "fill-opacity": 1,
        "stroke": "none"
      },
      beginText: {
        "font-family": "MicrosoftYaHei",
        "font-size": "15px",
        "fill": "#ffffff",
        "font-weight": "400",
        "text-anchor": "middle"
      },
      beginImg: {
        url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAr0lEQVQ4T8XSMQtBURjG8f//YzH6QDJJMsgig80oH0A+hMEus0FIUiaThaNbbqHr3nMzOOOp59d5n/fIj8cf87wBIYQasFfXsfAn0AK6wAjoqZciKAvoP0MnoANM1Ps3KA9IM0ugri6ykBggyQVgCjTV3SsUC6SZI1BRt+lFLHADxkkn6rnsC+ZAQ12V7WDznHmWt8qsEdrAABiq17L/oAps1UNRMLPE2NDXEv8CPAAPVEMR7gIlCwAAAABJRU5ErkJggg==',
        width: 16,
        height: 16,
        x: 25,
        y: 36
      },
      endRect: {
        "fill": "#F79F2D",
        "fill-opacity": 1,
        "stroke": "none"
      },
      endText: {
        "font-family": "MicrosoftYaHei",
        "font-size": "15px",
        "fill": "#ffffff",
        "font-weight": "400",
        "text-anchor": "middle"
      },
      endImg: {
        url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAANUlEQVQ4T2NkoBAwUqifgboG/P///z8hFzEyMqJYisIZNYCBYTQMCCUh7PLUTcrkuIFiFwAAYDgkEehNyRQAAAAASUVORK5CYII=',
        width: 16,
        height: 16,
        x: 25,
        y: 36
      },
      topRect: {
        "fill": "rgba(1,182,116,1)",
        "fill-opacity": 0.15,
        "stroke": "none"
      },
      topText: {
        "font-family": "MicrosoftYaHei",
        "font-size": "13px",
        "fill": "#01B674",
        "font-weight": "400",
        "text-anchor": "middle"
      },
      middleRect: {
        "fill": "#ffffff",
        "fill-opacity": 1,
        "stroke": "none"
      },
      middleText: {
        "font-family": "MicrosoftYaHei",
        "font-size": "15px",
        "fill": "#3D424D",
        "text-anchor": "middle"
      },
      middleImg: {
        url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABWUlEQVQ4T6WT30oCYRDFf7OLGwaBBUEQhN0aUuIT1G0vUC9Q0IWR+Rhm5EVQL1Av4HVPICaSt0kQBEFJQaKyO7Gru/lnLcO5PN/MmXPmmxFmDBmtTx9oxEmyTJuYYzHnvhvQRmgaNV7L19IdrBki2DrXGBA3DMwwYY6DDTTuT6TpvwcEyUtdtBzW1WZM1VBHE+0YPNaO5N3FveT0lUbsLzYmdR5V4yox53koH0rXI9gs6KppshIkChGBDLDbx0oKRZTAv23zUs3Ks0eQymtCIkQDX8IpsD/S+UaVMx/TLq1KTuo9BUVNmeoOuxcCdwgLQwTKp8K2j9mCU81IZXoC+FBlJ5QgVdSE6I8FICfC3qACFW5xyIdbCBkiyrH0h6hQQriYOMSZv9GVlSjoUtQiPs0itTo06ll5CxbJ9+WSWMLab6vcUZ784jECbyv9Y1JiDv88prAD+gv7BtDwlhFckCyhAAAAAElFTkSuQmCC',
        width: 16,
        height: 16,
        x: 24,
        y: 8 / 3
      },
      bottomRect: {
        "fill": "rgba(1,182,116,1)",
        "fill-opacity": 0.15,
        "stroke": "none"
      },
      bottomText: {
        "font-family": "MicrosoftYaHei",
        "font-size": "13px",
        "fill": "#01B674",
        "text-anchor": "middle"
      },
      rectObj: {
        x: 523,
        y: 320,
        w: 90,
        h: 35,
        r: 8
      },
      textObj: {
        expectedTime: "12:12",
        nodeNo: "BEGIN",
        nodeName: "值机交运",
        actualTime: "13:13"
      },
      chooseBox: null,
      cloneChooseBox: null,
      boxObj: null,
      currentTextObjArr: [],
      canvasBg:'',
      flightInfo: {
        flightNoAlias: "",
        execDate: "", //execDate
        routeCn: "",
        airlineCn: "",
        attrCn: "",
        terminal: "",
        inOutFlag: "",
        chute: "",
        aircraftNo: "",
        aircraftType: "",
        stand: "",
        std: "",//计起
        etd: "",
        atd: "",
        sta: "",
        eta: "",
        ata: ""
      },
      nodeInfo: {
        nodeCn: "",
        dataSource: "",
        expectedTime: "",
        actualTime: "",
        timespan: ""
      },
      chooseFlight: null,
      chooseFlightIndex: 0,
      pickerTime: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      refreshInterval: null
    }
  },
  created () {
    this.queryFlightParam.execDate = dateFormat(new Date(), 'yyyy-MM-dd')
    this.$nextTick(() => {
      this.paper = Raphael('flightCanvas', this.paperWidth, this.paperHeight)
      this.queryTimer()
    })
    this.queryFlightList()
  },
  beforeDestroy () {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
    }
    if(this.paper){
      this.paper.remove()
    }
  },
  methods: {
    clickFlight (event) {
      this.boxObj = null
      this.resetNodeData()

      this.chooseFlight = event.target.getAttribute('dynamicflightid') || event.target.parentElement.getAttribute('dynamicflightid') || event.target.parentElement.parentElement.getAttribute('dynamicflightid')
      this.chooseFlightIndex = event.target.getAttribute('dataindex') || event.target.parentElement.getAttribute('dataindex') || event.target.parentElement.parentElement.getAttribute('dataindex')

      let currentFlight = event.target.getAttribute('flightInfo') || event.target.parentElement.getAttribute('flightInfo') || event.target.parentElement.parentElement.getAttribute('flightInfo')
      currentFlight = JSON.parse(currentFlight)
      this.currentFlightInfo(currentFlight)
      this.renderFlightFlow(this.queryFlightParam.execDate,this.chooseFlight)
    },
    currentFlightInfo (tempFlight) {
      this.flightInfo.flightNoAlias = tempFlight.flightNoAlias || ""
      this.flightInfo.execDate = tempFlight.execDate || ""
      this.flightInfo.routeCn = tempFlight.routeCn || ""
      this.flightInfo.airlineCn = tempFlight.airlineCn || ""
      this.flightInfo.attrCn = tempFlight.attrCn || ""
      this.flightInfo.terminal = tempFlight.terminal || ""
      this.flightInfo.inOutFlag = tempFlight.inOutFlag ? (tempFlight.inOutFlag == 'D' ? '出港' : '进港') : ""
      this.flightInfo.chute = tempFlight.chute || ""
      this.flightInfo.aircraftNo = tempFlight.aircraftNo || ""
      this.flightInfo.aircraftType = tempFlight.aircraftType || ""
      this.flightInfo.stand = tempFlight.stand || ""
      this.flightInfo.std = tempFlight.std ? tempFlight.std.split(" ")[1] : ""
      this.flightInfo.etd = tempFlight.etd ? tempFlight.etd.split(" ")[1] : ""
      this.flightInfo.atd = tempFlight.atd ? tempFlight.atd.split(" ")[1] : ""
      this.flightInfo.sta = tempFlight.sta ? tempFlight.sta.split(" ")[1] : ""
      this.flightInfo.eta = tempFlight.eta ? tempFlight.eta.split(" ")[1] : ""
      this.flightInfo.ata = tempFlight.ata ? tempFlight.ata.split(" ")[1] : ""
      
      this.flightInfo.titleTimeA = tempFlight.ata || tempFlight.eta || tempFlight.sta
      this.flightInfo.titleTimeA = this.flightInfo.titleTimeA ? this.flightInfo.titleTimeA.split(" ")[1] : ""
      this.flightInfo.titleTimeD = tempFlight.atd || tempFlight.etd || tempFlight.std
      this.flightInfo.titleTimeD = this.flightInfo.titleTimeD ? this.flightInfo.titleTimeD.split(" ")[1] : ""

      this.flightInfo.titleTimeType = tempFlight.ata ? "实际" : (tempFlight.eta ? "预计" : (tempFlight.sta ? "计划" : "--"))
    },
    resetStatus () {
      this.queryFlightParam.execDate = dateFormat(new Date(), 'yyyy-MM-dd')
      // this.queryFlightParam.inOutFlag = "D"
      this.queryFlightParam.flightNo = ""

      this.queryFlightList()
    },
    queryFlightList () {
      if (this.queryFlightParam.flightNo != "") {
        this.queryFlightParam.flightNo = this.queryFlightParam.flightNo.toUpperCase()
      }

      let paramObj = JSON.stringify(this.queryFlightParam)
      postData('flightGuarantee/queryDynamicFlight', paramObj).then(response => {
        if (response.data.code == 0) {
          this.tableData = response.data.data
          if(this.tableData.length == 0) {
            this.clearCanvas()
            //重置数据
            this.resetNodeData()
            this.currentFlightInfo({})

            this.$msg.error({
              info: '无匹配的航班！',
              tip: "请重新选择航班日期或输入航班号"
            })
            return
          }
          for(let i = 0; i < this.tableData.length; i++) {
            if (this.queryFlightParam.inOutFlag == "D") {
              this.tableData[i].showTime = this.tableData[i].atd || this.tableData[i].etd || this.tableData[i].std
              this.tableData[i].showTime = this.tableData[i].showTime ? this.tableData[i].showTime.split(" ")[1] : ""
            } else {
              this.tableData[i].showTime = this.tableData[i].ata || this.tableData[i].eta || this.tableData[i].sta
              this.tableData[i].showTime = this.tableData[i].showTime ? this.tableData[i].showTime.split(" ")[1] : ""
            }
          }
          
          if(this.chooseFlight && this.chooseFlightIndex != 0) {
            let tempData = null
            for(let l = this.tableData.length - 1; l >= 0 ; l--) {
              if(this.tableData[l].dynamicFlightId == this.chooseFlight) {
                 tempData = _.cloneDeep(this.tableData[l])
                this.tableData.splice(l,1)
                break
              }
            }
            if(tempData) {
              this.tableData.splice(this.chooseFlightIndex,1,tempData)
              this.currentFlightInfo(tempData)
              this.renderFlightFlow(tempData.execDate, tempData.dynamicFlightId)
            }
          } else {
            this.currentFlightInfo(this.tableData[0])
            this.chooseFlight = this.tableData[0].dynamicFlightId
            this.renderFlightFlow(this.tableData[0].execDate, this.tableData[0].dynamicFlightId)
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
    tabItemClick (key) {
      this.queryFlightParam.inOutFlag = key
      this.tableTh = key == "A" ? this.tableThIn : this.tableThOut

      this.chooseBox = null

      this.chooseFlight = null
      this.chooseFlightIndex = 0
      this.boxObj = null

      this.resetNodeData()
      this.queryFlightList()
    },
    queryTimer () {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval)
      }
      this.refreshInterval = setInterval (() => {
        if(document.getElementById("flightCanvas")) {
          // this.chooseBox = null
          
          this.queryFlightList()
        }
      },10000)
    },
    resetNodeData () {
      this.nodeInfo.nodeCn = ''
      this.nodeInfo.dataSource = ''
      this.nodeInfo.expectedTime = ""
      this.nodeInfo.actualTime = ""
      this.nodeInfo.timespan = ""
    },
    addBgOrEndNode (paper,rectObj,textObj,rectStyle,textStyle,imgStyle) {
      let x = rectObj.x,
          y = rectObj.y,
          w = rectObj.w,
          h = rectObj.h,
          r = rectObj.r,
          nodeName = textObj.nodeName,
          nodeNo = textObj.nodeNo
      let nodeRect = paper.rect(x, y, w, h, 8).attr(rectStyle)
      nodeRect.nodeNome = nodeName
      let bgOrEndNodeText = paper.text(x + w / 2, y + h / 2, nodeName).attr(textStyle)
      let bgOrEndNodeImg = paper.image(imgStyle.url, x + 25, y + 30, imgStyle.width, imgStyle.height)

      return nodeRect.id
    },
    addNode (paper,rectObj,textObj,imgStyle) {
      let x = rectObj.x,
          y = rectObj.y,
          w = rectObj.w,
          h = rectObj.h,
          r = rectObj.r,
          expectedTime = textObj.expectedTime,
          nodeName = textObj.nodeName,
          actualTime = textObj.actualTime,
          nodeNo = textObj.nodeNo
      const topRect = this.topRect,
            topText = this.topText,
            middleRect = this.middleRect,
            middleText = this.middleText,
            bottomRect = this.bottomRect,
            buttomText = this.bottomText
      let nodeRect = paper.rect(x, y, w, h, 8).attr(middleRect)
      nodeRect.nodeNome = nodeName
      nodeRect.expectedTime = expectedTime
      nodeRect.actualTime = actualTime
      //时间偏移值、数据源？？？
      let middleNodeText = paper.text(x + w / 2 + 10, y + h / 2, nodeName).attr(middleText)
      let middleNodeImg = paper.image(imgStyle.url, x + 20, y + 31, imgStyle.width, imgStyle.height)

      paper.rect(x + 6, y + h * 0.1, w-12, 18, 4).attr(topRect)
      let topNodeText = paper.text(x + w / 2,y + h * 0.2, expectedTime).attr(topText)

      let chooseBox = this.changeBoxStatus

      setTimeout(() => {
        (function(chooseBox) {
          nodeRect.click(function(e) {
            let y = this.attrs.y - this.attrs.height,
              borderBox = {
                "fill-opacity": 1,
                "stroke": "#3392FF",
                "stroke-width": 2
              }
            let box = new addBorderBox(this.paper, this.attrs.x, y + this.attrs.height, this.attrs.width, this.attrs.height, 10, borderBox)
            chooseBox(box.parentBox.id,this.paper.getById(this.id))
          })
          middleNodeText.click(function(e) {
            let y = this.prev.attrs.y - this.prev.attrs.height,
              borderBox = {
                "fill-opacity": 1,
                "stroke": "#3392FF",
                "stroke-width": 2
              }
            let box = new addBorderBox(this.paper, this.prev.attrs.x, y + this.prev.attrs.height, this.prev.attrs.width, this.prev.attrs.height, 10, borderBox)
            chooseBox(box.parentBox.id,this.paper.getById(this.prev.id))
          })
        }(chooseBox))
      },200)

      paper.rect(x + 6, y + h * 0.7, w-12, 18, 4).attr(bottomRect)
      let bottomNodeText = paper.text(x + w / 2, y + h * 0.8, actualTime).attr(buttomText)
      
      let nodeObjs = {}
      nodeObjs[nodeNo] = []
      nodeObjs[nodeNo].push(nodeRect.id,topNodeText.id, middleNodeText.id, bottomNodeText.id)
      this.currentTextObjArr.push(nodeObjs)

      return nodeObjs
    },
    changeBoxStatus (box,node) {
      this.chooseBox = box
      this.nodeInfo.nodeCn = node.nodeNome || ''
      this.nodeInfo.dataSource = node.dataSource || ''
      this.nodeInfo.expectedTime = node.expectedTime || ""
      this.nodeInfo.actualTime = node.actualTime || ""
      this.nodeInfo.timespan = node.timespan != undefined ? node.timespan : ""
    },
    clearCanvas() {
      if(this.paper){
        this.paper.remove()
        this.paper = Raphael('flightCanvas', this.paperWidth, this.paperHeight)
      }
    },
    renderFlow (paper,flowData) {
      this.clearCanvas()
      paper = this.paper

      let flowNodeArray = flowData.nodeArray;
      let flowRelationArray = flowData.relationArray;

      let nodeIdArr = []
      flowNodeArray.forEach((pt, ptIndex) => { //绘制节点
        let tempRectObj = {}
        let tempTextObj = {}
        tempRectObj.x = pt.coordinateX
        tempRectObj.y = pt.coordinateY
        tempRectObj.w = 120
        tempRectObj.h = 76
        tempRectObj.r =  pt.radius || 8
        tempRectObj.nodeNo = pt.nodeNo
        tempTextObj.expectedTime = pt.timeE ? pt.timeE.split(" ")[1] : ":"
        tempTextObj.nodeNo = pt.nodeNo || ""
        tempTextObj.nodeName = pt.nodeCn || ""
        tempTextObj.actualTime = pt.timeA ? pt.timeA.split(" ")[1] : ":"
        tempTextObj.timespan = pt.timespan || ""

        let currentNodeObjs = null

        if(tempRectObj.nodeNo == "N-START" || tempRectObj.nodeNo == "N-END") {
          if (tempRectObj.nodeNo == "N-START") {
            currentNodeObjs = this.addBgOrEndNode(paper,tempRectObj,tempTextObj,this.beginRect,this.beginText,this.beginImg)
            nodeIdArr.push(tempRectObj.nodeNo + '_' + currentNodeObjs)
          } else {
            currentNodeObjs = this.addBgOrEndNode(paper,tempRectObj,tempTextObj,this.endRect,this.endText,this.endImg)
            nodeIdArr.push(tempRectObj.nodeNo + '_' + currentNodeObjs)
          }
        } else {
          currentNodeObjs = this.addNode(paper,tempRectObj,tempTextObj,this.middleImg)
          nodeIdArr.push(tempRectObj.nodeNo + '_' + currentNodeObjs[tempRectObj.nodeNo][0])
        }
      })

      flowRelationArray.forEach((fa, faIndex) => {//绘制关系
        let prevNodeObj,
            nextNodeObj
        nodeIdArr.forEach((val) => {
          let nodeId = val.split('_')[1]
          let nodeNo = val.split('_')[0]
          if(nodeNo == fa.nodeNoPrev && paper.getById(nodeId)) {
            prevNodeObj = paper.getById(nodeId)
          }
          if(nodeNo == fa.nodeNoNext && paper.getById(nodeId)) {
            nextNodeObj = paper.getById(nodeId)
          }
        })
        if(prevNodeObj && nextNodeObj) {
          prevNodeObj.timespan = fa.timespan

          let h = prevNodeObj.attrs.height
          let preX = prevNodeObj.attrs.x,
              preY = prevNodeObj.attrs.y,
              nextX = nextNodeObj.attrs.x,
              nextY = nextNodeObj.attrs.y
          let currentArrow = new addArrow(paper, preX, preY, nextX, nextY, fa.timespan, nextNodeObj.id, prevNodeObj.attrs.width, h, false, false)
        }
      })

      if(this.boxObj) {
        let box = new addBorderBox(this.paper, this.boxObj.x, this.boxObj.y, this.boxObj.w, this.boxObj.h, this.boxObj.r, this.boxObj.style)
        this.chooseBox = box.parentBox.id
        this.cloneChooseBox = this.chooseBox
      }
    },
    renderFlightFlow (execDate,dynamicFlightId) {
      let paramObj = {
        execDate,
        dynamicFlightId
      }
      paramObj = JSON.stringify(paramObj)
      postData('flightGuarantee/queryProcess', paramObj).then(response => {
        if (response.data.code == 0) {
          let responseData = response.data.data

          this.currentTextObjArr = [] //重置存储节点文字数组
          if(document.getElementById("flightCanvas")) {
            this.renderFlow(this.paper,responseData)
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
    updateNodeText (nodeNo) { //节点更新接口
      nodeNo = "N-CHECKIN"
      this.currentTextObjArr.forEach((val) => {
        if(val.hasOwnProperty(nodeNo) && val[nodeNo] && val[nodeNo].length > 0) {
          let idArr = val[nodeNo]
          let topText = this.paper.getById(idArr[1])
          let node = this.paper.getById(idArr[0])
          let bottomText = this.paper.getById(idArr[3])
        }
      })
    }
  },
  watch: {
    chooseBox: {
      handler (value) {
        let box = this.paper.getById(value)
        if(box) {
          this.boxObj = {}
          this.boxObj.x = box.attrs.x
          this.boxObj.y = box.attrs.y
          this.boxObj.w = box.attrs.width
          this.boxObj.h = box.attrs.height
          this.boxObj.r = 10
          this.boxObj.style = {
            "fill-opacity": 1,
            "stroke": "#3392FF",
            "stroke-width": 2
          }
        }
        
        if(value && this.cloneChooseBox && value != this.cloneChooseBox) {
          if(this.paper.getById(this.cloneChooseBox)) {
            this.paper.getById(this.cloneChooseBox).remove()
          }
          this.cloneChooseBox = value
        } else {
          this.cloneChooseBox = value
        }
      }
    },
    canvasBg:{
      handler(value) {
        if(value)  {
          document.getElementsByClassName('filght-menu')[0].style.backgroundColor = "#364A5C"
        }else{
          document.getElementsByClassName('filght-menu')[0].style.backgroundColor = "#E4EAF0"
        }
      }
    },
    '$store.state.base.ifFullscreen'(val) {
      this.hidden = val;
    }
  },
  destroyed () {
    document.body.onclick = function (e) {}
  }
}
</script>

<style lang="scss" scoped>
.filght-menu {
  height: calc(100% - 80px);
  position: absolute;
  width: calc(100% - 218px);
  background: #ffffff;
  right: 0;
  top: 80px;
  background-image: url(~@img/flow/flowBg.png);
  background-color: #E4EAF0;
  display: flex;
  overflow: hidden;
}

.templateContent {
  margin-left: 16px;
  margin-right: 17px;
  margin-bottom: 20px;
}

/deep/.templateContent .tabs {
  width: 267px;
  font-size: 16px;
}

/deep/.templateContent .tabs .tab-item.current-item {
  flex: 1;
}

.flight-canvas {
  overflow-x: auto;
  width: calc(100% - 760px);
}

.flight-list {
  background: #ffffff;
  width: 300px;
  box-shadow: 0px 0px 8px 0px rgba(104, 129, 153, 0.2);
}

.title {
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: center;
  font-size: 16px;
  font-family: 'Microsoft YaHei';
  font-weight: bold; 
}

.flight-date {
  margin-top: 12px;
  margin-left: 16px;
  margin-right: 17px;
  display: flex;
  .input-tag {
    width: 192px!important;
  }
}

.infos {
  overflow: auto;
  text-align: left;
  background: #ffffff;
  width: 460px;
  box-shadow: 0px 0px 8px 0px rgba(104, 129, 153, 0.2);
}

/deep/.flight-date .el-input__prefix {
  display: none;
}

/deep/.flight-date .input-tag > .value .el-date-editor--date.el-input {
  width: 110px;
}

/deep/.flight-date .el-input--prefix .el-input__inner {
  padding-left: 14px;
}

/deep/.flight-date .el-input--suffix .el-input__inner {
  padding-right: 20px;
}

.flight-date button {
  float: right;
  margin-left: 12px;
}

.choose-button {
  background: linear-gradient(to right, #46a6f9, #578cfe);
  box-shadow: 0 0 20px rgba(51, 146, 255, 0.4);
  color: #fff;
}

.flight-title {
  margin-top: 20px;
}

.flight-title table th {
  background: #F8FAFC;
  line-height: 44px;
  border-top: 1px solid #DFE9F0;
  border-bottom: 1px solid #DFE9F0;
  font-family: 'Microsoft YaHei';
  font-weight: bold;
  color: #718499;
  text-align: left;
}

.flight-item {
  width: 300px;
  font-size: 14px;
  font-family: 'Microsoft YaHei';
  color:#899DB2;
  text-align: left;
  height: calc(100% - 300px);
  overflow-x: hidden;
}

.flight-info > div,.node-info > div {
   color: #899DB2;
   padding-left: 35px;
   font-family: MicrosoftYaHei;
   background: #EDF1F5;
   height: 32px;
   line-height: 32px;
 }

.flight-item table,.flight-title table,.flight-info table, .node-info table {
  border-collapse: collapse;
  border-spacing: 0;
  text-align: left;
}

.flight-item table,.flight-title table {
  width: 300px;
  font-size: 14px;
}

.flight-info table tr:nth-child(2n-1) td,.node-info table tr:nth-child(2n-1) td {
  padding-top: 15px;
  color: #899DB2;
}

.flight-info table tr:nth-child(2n) td,.node-info table tr:nth-child(2n) td {
  color: #3D424D;
  font-size: 16px;
  line-height: 16px;
  border-bottom: 1px solid #DAE3EB;
  padding-top: 15px;
  padding-bottom: 15px;
}

.flight-info table tr:last-child td,.node-info table tr:last-child td {
  border-bottom: none;
}

.flight-info table tr:nth-child(2) td:first-child {
  font-weight: Bold;
}

.flight-info table, .node-info table {
  width: 92%;
  margin-left: 18px;
}

.flight-title table th:nth-child(2) {
  padding-left: 5px;
}

table th:last-child {
  text-align: right;
  padding-right: 25px;
}

table th:first-child, table tr td:first-child {
  padding-left: 17px;
}

.flight-item table tr {
  border-bottom: 1px solid #DFE9F0;
}

.flight-item table tr td:first-child {
  font-weight: bold;
  color: #3D424D;
  line-height: 50px;
  width: 48px;
}

.flight-item table tr td:nth-child(2) {
  color: #3D424D;
  padding-left: 6px;
  width: 60px;
}

.flight-item table tr td:nth-child(3) {
  color: #3D424D;
  text-align: center;
  width: 60px;
}

.flight-item table tr td:last-child {
  width: 28px;
}

.flight-item table tr td:last-child div {
  padding: 2px;
  background: rgba(51, 146, 255, 0.1);
  color: #3392FF;
  width: 62px;
  border-radius: 4px;
  margin-right: 4px;
  text-align: center;
}

.hidden-button {
  position: absolute;
  width: 12px;
  height: 68px;
  background-image: url(~@img/flow/show.png);
  right: 460px;
  top: calc(50% - 68px / 2);
  cursor: pointer;
}

.hidden {
  margin-right: 460px;
}

.rightMove {
  right: 0;
  background-image: url(~@img/flow/hidden.png);
}

.background-set {
  padding: 23px 0px 15px 17px;
  color: #3d424d;
  font-size: 16px;
  font-weight: bold;
  font-family: "MicrosoftYaHei-Bold";
  line-height: 20px;
  display: inline-flex;
}

.background-set div:nth-child(2) {
  margin-left: 310px;
  width: 20px;
  height: 20px;
  background: #e4eaf0;
  border-radius: 50%;
  margin-right: 8px;
}

.background-set div:nth-child(3) {
  width: 20px;
  height: 20px;
  background: #364a5c;
  border-radius: 50%;
}

.borderBg {
  border:2px solid #3392FF;
}

.time-title {
  color: #3D424D;
  font-family: "DINPro-Bold";
  font-weight: bold;
  line-height: 33px;
  font-size: 36px;
  display: inline-flex;
  margin-top: 42px;
}

.time-title div:first-child {
  padding-left: 60px;
}

.time-title div:nth-child(2) {
  text-align: right;
  margin-right: 40px;
  margin-left: 40px;
}

.time-item {
  margin-top: 31px;
  margin-bottom: 29px;
  display: flex;
}

.time-item > div {
  margin-left: 20px;
}

.time-item > div:first-child {
  margin-left: 34px;
}

.time-item > div:last-child {
  margin-right: 25px;
}

.time-item > div:nth-child(3) {
  margin-right: 72px;
}

.time-title button {
  padding: 0;
  font-size: 12px;
  border-radius: 4px;
  text-align: center;
  width: 36px;
  background: linear-gradient(to right, #46a6f9, #578cfe);
  box-shadow: 0 0 20px rgba(51, 146, 255, 0.4);
  color: #fff;
  height: 20px;
  line-height: 20px;
}

.arrow {
  padding-right: 15px;
  width: 70px;
  height: 19px;
  font-family: Microsoft YaHei;
  font-size: 24px;
  color: #A3B6CC;
  border-bottom: 2px solid #A3B6CC;
}

.time-item > div div:first-child {
  color: #899DB2;
  font-size: 14px;
  font-family: "MicrosoftYaHei";
}

.time-item > div div:last-child {
  color: #3D424D;
  font-size: 16px;
  line-height: 16px;
  margin-top: 15px;
}
</style>