<template>
  <div class="flight-menu">
    <div class="flight-list" v-if="currentFlight == ''">
      <div>
        <div class="title">出港航班列表</div>
        <!-- <img src="" alt=""> -->
      </div>
      <div>
        <input type="text" placeholder="输入航班号/地面代理/航司进行查询" class="search-input"/>
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
            <tr v-for="(item,index) in tableData" :key="index" :flightInfo="JSON.stringify(item)" :dynamicFlightId="item.dynamicFlightId" :dataIndex="index" @click="chooseItem">
              <td>{{item.flightNoAlias}}</td>
              <td v-if="queryFlightParam.inOutFlag == 'D'" :title="item.terminalStationCn">{{item.terminalStationCn}}</td>
              <td v-else :title="item.terminalStationCn">{{item.startStationCn}}</td>
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
      <div class="monitor-flight">
        监控全部航班
        <!-- <button>监控全部航班</button> -->
      </div>
    </div>
    <div class="lug-info" v-else>
      <div class="flight-number">
        <div @click="backTo">返回</div>
        <div>MU2506</div>
        <!-- <img src="" alt=""> -->
      </div>
      <div class="flight-info">
        <table>
          <tbody>
            <tr>
              <td>目的站</td>
              <td>计起/预起/实起</td>
              <td>状态</td>
            </tr>
            <tr>
              <td>克拉玛依</td>
              <td>11:00</td>
              <td>起飞</td>
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
            <tr>
              <td>HMUE 148520</td>
              <td><div>离岗分拣</div></td>
            </tr>
            <tr>
              <td>HMUE 148520</td>
              <td><div>离岗分拣</div></td>
            </tr>
            <tr>
              <td>HMUE 148520</td>
              <td><div>离岗分拣</div></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { postData } from '@/util/base'

export default {
  props: {
    inOutFlag: {
      type: String,
      default: "D"
    }
  },
  data() {
    return {
      tableTh: [{ name: '航班号', width: '48px' }, { name: '目的站', width: '38px' }, { name: '计起/预起/实起', width: '60px' }, { name: '状态', width: '28px' }],
      tableData: [],
      queryFlightParam: { //航班号、目的站
        execDate: "", //可为空，为空默认查询当天
        inOutFlag: "D", //A或D，必须有
        flightNo: "" //可为空
      },
      currentFlight: '',
    }
  },
  created () {
    this.queryFlightList()
  },
  methods: {
    backTo() {
      this.currentFlight = true
    },
    chooseItem () {
      this.currentFlight = true
    },
    queryFlightList() {
      let paramObj = JSON.stringify(this.queryFlightParam)
      postData('flightGuarantee/queryDynamicFlight', paramObj).then(response => {
        if (response.data.code == 0) {
          this.tableData = response.data.data
          if (this.tableData.length == 0) {
            this.$msg.error({
              info: '无匹配的航班！',
              tip: "请重新选择航班日期或输入航班号"
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
  top: 10%;
  left: 0.5%;
  z-index: 2;
  background: rgba(19,68,101,0.96);
  box-shadow: 0px 0px 160px 0px rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  color:#FFFFFF;
  height: 87%;
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
  text-align: center;
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
  height: 90%;
}


.flight-item table,.flight-title table, .flight-info table {
  border-collapse: collapse;
  border-spacing: 0;
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

.flight-item table tr td:first-child {
  color: #FFFFFF;
  line-height: 50px;
  width: 48px;
}

.flight-item table tr td:nth-child(2) {
  color: #FFFFFF;
  padding-left: 6px;
  width: 48px;
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
  width: 106px;
  font-size: 16px;
  line-height: 16px;
}

.flight-number div:nth-child(2) {
  font-size: 24px;
  line-height: 16px;
}

.flight-number, .flight-info, .lug-title, .lug-info ,.lug-list{
  margin-left: 15px;
  margin-right: 15px;
}

.flight-info {
  margin-top: 25px;
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
  width: 150px;
  line-height: 50px;
}
</style>