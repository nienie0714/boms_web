<template>
<!-- 中转行李动态分析 -->
    <div class="outYear ceshi-block">
       <div class="header">
         <img :src="require('@icon/logo/outBound_titleL.png')"/>
          <div class="header-title">中转行李动态分析</div>
          <img :src="require('@icon/logo/outBond_title.png')"/>
      </div> 
      <div class="body">
          <div class="body-top">
              <div>
                  <div class="body transfC">
                          <div class="text">
                             <div class="label">中转行李总数</div>
                             <div class="num-st font-white">{{data.totalNum}}</div>
                          </div>
                  </div>
              </div>
              <div>
                <div class="bodyC break">
                  <div id="breakC" class="circle"></div>
                    <div class="text">
                        <div class="label font-rs">中断</div>
                        <div class="number font-st">{{data.interruptNum}}</div>
                    </div>
                </div>
              </div>
              <div>
                <div class="bodyC waiting">
                  <div id="waitC" class="circle"></div>
                  <div class="text">
                      <div class="label font-rs">待中转</div>
                      <div class="number font-st">{{data.wtsNum}}</div>
                  </div>
                </div>
              </div>
              <div>
                <div class="bodyC alTrans">
                  <div id="alTrans" class="circle"></div>
                  <div class="text">
                      <div class="label font-rs">已中转</div>
                      <div class="number font-st">{{data.tsfNum}}</div>
                  </div>
                </div>
              </div>
          </div>
      </div>
      <div class="body">
          <div class="body-bottom">
              <div>
                <div id="tkpi" class="tKpi"></div>
              </div>
          </div>
      </div>
    </div>
</template>
<script>
import { queryAll, update ,remove} from '@/util/base'
import echarts from 'echarts'
export default {
  props: ['resize', 'refrush'],
  data () {
      return {
          totalFltNum: null,
          //中转行李动态数据接口
          queryUrl: '/kpi/dynamic/queryTransferDynamic',
          //这线图数据接口
          queryRateUrl: '/kpi/dynamic/queryTransferRate',
          circleEl: null,
          //中转数据
          data: {
            totalNum: null,
            interruptNum: null,
            tsfNum: null,
            wtsNum: null,
            bage: 89,
            wage: 89,
            tsage: 89
          },
          //破损率
          dataRate: {
            dd01: '0.00',
            dd02: '0.00',
            dd03: '0.00',
            dd04: '0.00',
            dd05: '0.00',
            dd06: '0.00',
            dd07: '0.00',
            dd08: '0.00',
            dd09: '0.00',
            dd10: '0.00',
            dd11: '0.00',
            dd12: '0.00',
            dd13: '0.00',
            dd14: '0.00',
            dd15: '0.00',
            dd16: '0.00',
            dd17: '0.00',
            dd18: '0.00',
            dd19: '0.00',
            dd20: '0.00',
            dd21: '0.00',
            dd22: '0.00',
            dd23: '0.00',
            dd23: '0.00',
            dd24: '0.00',
            dd25: '0.00',
            dd26: '0.00',
            dd27: '0.00',
            dd28: '0.00',
            dd29: '0.00',
            dd30: '0.00',
            dd31: '0.00',
          },
          //破损数量
          dataTotal: {
            dd01: 0,
            dd02: 0,
            dd03: 0,
            dd04: 0,
            dd05: 0,
            dd06: 0,
            dd07: 0,
            dd08: 0,
            dd09: 0,
            dd10: 0,
            dd11: 0,
            dd12: 0,
            dd13: 0,
            dd14: 0,
            dd15: 0,
            dd16: 0,
            dd17: 0,
            dd18: 0,
            dd19: 0,
            dd20: 0,
            dd21: 0,
            dd22: 0,
            dd23: 0,
            dd23: 0,
            dd24: 0,
            dd25: 0,
            dd26: 0,
            dd27: 0,
            dd28: 0,
            dd29: 0,
            dd30: 0,
            dd31: 0,
          },
          xData: ['1', '2','3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22' ,'23', '24','25', '26', '27', '28', '29', '30', '31'],
          breakC: null,
          breakCEl: null,
          waitC: null,
          waitCEl: null,
          alTrans: null,
          alTransEl: null,
          el: null,
          tKpi: null,
          tKpiEl: null,
          mounth:null,
          //破损数最大值
          max: 0,
          //破损率最大值
          maxD: 0,
          maxI: 0,
          breakPercent:'6%',
          alreadyPercent:'50%',
          waitPercent:'41%'
      }
  },
  mounted () {
      this.breakCEl = document.getElementById('breakC')
      this.breakC = this.$echarts.init(this.breakCEl)
      this.circleEl = document.getElementsByClassName('transfC')[0]
      this.waitCEl = document.getElementById('waitC')
      this.waitC = this.$echarts.init(this.waitCEl)
      this.alTransEl = document.getElementById('alTrans')
      this.alTrans = this.$echarts.init(this.alTransEl)
      this.tKpiEl = document.getElementById('tkpi')
      this.tKpi = this.$echarts.init(this.tKpiEl)
      this.el = document.getElementsByClassName('outYear')[0]
      this.updateOption()
      this.mounth = this.addZero((new Date()).getMonth() + 1)
      //折线图横轴刻度
      if(this.mounth == 1||this.mounth == 3||this.mounth == 5||this.mounth == 7||this.mounth == 8||this.mounth == 10||this.mounth == 12){
        this.xData = ['1', '2','3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22' ,'23', '24','25', '26', '27', '28', '29', '30', '31']
      }
      if(this.mounth == 4||this.mounth == 6||this.mounth == 9||this.mounth == 11){
        this.xData = ['1', '2','3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22' ,'23', '24','25', '26', '27', '28', '29', '30']
      }
      if(this.mounth == 2){
        this.xData = ['1', '2','3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22' ,'23', '24','25', '26', '27', '28']
      }
      this.$nextTick(() => {
      let outOpts = {
          height: this.el.clientHeight * 0.24,
          width: this.el.clientWidth * 0.15 ,
        }
        let tkpiOpts = {
          height: this.el.clientHeight * 0.42,
          width: this.el.clientWidth * 0.95
        }
        this.tKpi.resize(tkpiOpts)
        this.breakC.resize(outOpts)
        this.waitC.resize(outOpts)
        this.alTrans.resize(outOpts)
        this.updateOption()
      })
  },
  methods: {
      //中转数据
      updateData () {
        let that = this
        queryAll(this.queryUrl).then(res => {
            if (res.data.code == 0) {
                if (JSON.stringify(res.data.data) == '{}') {
                    this.restore()
                } else {
                  if(res.data.data.length>0){
                      that.data = res.data.data[0]
                    }
                      if(that.data.totalNum != undefined && that.data.totalNum != 0){
                          let waitNum = that.data.totalNum - that.data.interruptNum - that.data.tsfNum
                          this.$set(that.data,'wtsNum',waitNum)
                          let bagel = 90 - (this.data.interruptNum/this.data.totalNum*359)
                          let wagel = 90 - (this.data.wtsNum/this.data.totalNum*359)
                          let tsagel = 90 - (this.data.tsfNum/this.data.totalNum*359)
                          this.$set(this.data,'bage',bagel)
                          this.$set(this.data,'wage',wagel)
                          this.$set(this.data,'tsage',tsagel) 
                          console.log(this.data.bage,this.data.wage,this.data.tsage)   
                      }else{
                        this.$set(this.data,'wtsNum',0)
                        this.$set(this.data,'bage',90)
                        this.$set(this.data,'wage',90)
                        this.$set(this.data,'tsage',90)
                      }
                    that.updateOption()
                }
                } else {
                this.restore()
                }
            }).catch(() => {
                this.restore()
        })
      },
      //折线图数据
      updateDataRate () {
        let that = this
        queryAll(this.queryRateUrl).then(res => {
            if (res.data.code == 0) {
                if (JSON.stringify(res.data.data) == '{}') {
                    this.restore()
                } else {
                  let arr = res.data.data
                  var damaArr = []
                  var num = []
                  for(var i = 0;i <arr.length; i++){
                    let rateArr = arr[i]
                    num.push(arr[i].damageNum)
                    if(rateArr.dd == 1 && rateArr.orderTotal != 0){
                      damaArr.push((rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2))
                      that.dataRate.dd01 = (rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2)
                      that.dataTotal.dd01 = rateArr.damageNum
                    }
                    if(rateArr.dd == 2 && rateArr.orderTotal != 0) {
                      damaArr.push((rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2))
                      that.dataRate.dd02 = (rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2)
                      that.dataTotal.dd02 = rateArr.damageNum
                    }
                    if(rateArr.dd == 3 && rateArr.orderTotal != 0) {
                      damaArr.push((rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2))
                      that.dataRate.dd03 = (rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2)
                      that.dataTotal.dd03 = rateArr.damageNum
                    }
                    if(rateArr.dd == 4 && rateArr.orderTotal != 0) {
                      damaArr.push((rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2))
                      that.dataRate.dd04 = (rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2)
                      that.dataTotal.dd04 = rateArr.damageNum
                    }
                    if(rateArr.dd == 5 && rateArr.orderTotal != 0) {
                      damaArr.push((rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2))
                      that.dataRate.dd05 = (rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2)
                      that.dataTotal.dd05 = rateArr.damageNum
                    }
                    if(rateArr.dd == 6 && rateArr.orderTotal != 0) {
                      damaArr.push((rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2))
                      that.dataRate.dd06 = (rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2)
                      that.dataTotal.dd06 = rateArr.damageNum
                    }
                    if(rateArr.dd == 7 && rateArr.orderTotal != 0) {
                      damaArr.push((rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2))
                      that.dataRate.dd07 = (rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2)
                      that.dataTotal.dd07 = rateArr.damageNum
                    }
                    if(rateArr.dd == 8 && rateArr.orderTotal != 0) {
                      damaArr.push((rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2))
                      that.dataRate.dd08 = (rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2)
                      that.dataTotal.dd08 = rateArr.damageNum
                    }
                    if(rateArr.dd == 9 && rateArr.orderTotal != 0) {
                      damaArr.push((rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2))
                      that.dataRate.dd09 = (rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2)
                      that.dataTotal.dd09 = rateArr.damageNum
                    }
                    if(rateArr.dd == 10 && rateArr.orderTotal != 0 ){
                      damaArr.push((rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2))
                      that.dataRate.dd10 = (rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2)
                      that.dataTotal.dd10 = rateArr.damageNum
                    }
                    if(rateArr.dd == 11 && rateArr.orderTotal != 0 ){
                      damaArr.push((rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2))
                      that.dataRate.dd11 = (rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2)
                      that.dataTotal.dd11 = rateArr.damageNum
                    }
                    if(rateArr.dd == 12 && rateArr.orderTotal != 0 ){
                      damaArr.push((rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2))
                      that.dataRate.dd12 = (rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2)
                      that.dataTotal.dd12 = rateArr.damageNum
                    }
                    if(rateArr.dd == 13 && rateArr.orderTotal != 0 ){
                      damaArr.push((rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2))
                      that.dataRate.dd13 = (rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2)
                      that.dataTotal.dd13 = rateArr.damageNum
                    }
                    if(rateArr.dd == 14 && rateArr.orderTotal != 0 ){
                      damaArr.push((rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2))
                      that.dataRate.dd14 = (rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2)
                      that.dataTotal.dd14 = rateArr.damageNum
                    }
                    if(rateArr.dd == 15 && rateArr.orderTotal != 0 ){
                      damaArr.push((rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2))
                      that.dataRate.dd15 = (rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2)
                      that.dataTotal.dd15 = rateArr.damageNum
                    }
                    if(rateArr.dd == 16 && rateArr.orderTotal != 0 ){
                      damaArr.push((rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2))
                      that.dataRate.dd16 = (rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2)
                      that.dataTotal.dd16 = rateArr.damageNum
                    }
                    if(rateArr.dd == 17 && rateArr.orderTotal != 0 ){
                      damaArr.push((rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2))
                      that.dataRate.dd17 = (rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2)
                      that.dataTotal.dd17 = rateArr.damageNum
                    }
                    if(rateArr.dd == 18 && rateArr.orderTotal != 0 ){
                      damaArr.push((rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2))
                      that.dataRate.dd18 = (rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2)
                      that.dataTotal.dd18 = rateArr.damageNum
                    }
                    if(rateArr.dd == 19 && rateArr.orderTotal != 0 ){
                      damaArr.push((rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2))
                      that.dataRate.dd19 = (rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2)
                      that.dataTotal.dd19 = rateArr.damageNum
                    }
                    if(rateArr.dd == 20 && rateArr.orderTotal != 0 ){
                      damaArr.push((rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2))
                      that.dataRate.dd20 = (rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2)
                      that.dataTotal.dd20 = rateArr.damageNum
                    }
                    if(rateArr.dd == 21 && rateArr.orderTotal != 0 ){
                      damaArr.push((rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2))
                      that.dataRate.dd21 = (rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2)
                      that.dataTotal.dd21 = rateArr.damageNum
                    }
                    if(rateArr.dd == 22 && rateArr.orderTotal != 0 ){
                      damaArr.push((rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2))
                      that.dataRate.dd22 = (rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2)
                      that.dataTotal.dd22 = rateArr.damageNum
                    }
                    if(rateArr.dd == 23 && rateArr.orderTotal != 0 ){
                      damaArr.push((rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2))
                      that.dataRate.dd23 = (rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2)
                      that.dataTotal.dd23 = rateArr.damageNum
                    }
                    if(rateArr.dd == 24 && rateArr.orderTotal != 0 ){
                      damaArr.push((rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2))
                      that.dataRate.dd24 = (rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2)
                      that.dataTotal.dd24 = rateArr.damageNum
                    }
                    if(rateArr.dd == 25 && rateArr.orderTotal != 0 ){
                      damaArr.push((rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2))
                      that.dataRate.dd25 = (rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2)
                      that.dataTotal.dd25 = rateArr.damageNum
                    }
                    if(rateArr.dd == 26 && rateArr.orderTotal != 0 ){
                      damaArr.push((rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2))
                      that.dataRate.dd26 = (rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2)
                      that.dataTotal.dd26 = rateArr.damageNum
                    }
                    if(rateArr.dd == 27 && rateArr.orderTotal != 0 ){
                      damaArr.push((rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2))
                      that.dataRate.dd27 = (rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2)
                      that.dataTotal.dd27 = rateArr.damageNum
                    }
                     if(rateArr.dd == 28 && rateArr.orderTotal != 0 ){
                      damaArr.push((rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2))
                      that.dataRate.dd28 = (rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2)
                      that.dataTotal.dd28 = rateArr.damageNum
                    }
                    if(rateArr.dd == 29 && rateArr.orderTotal != 0 ){
                      damaArr.push((rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2))
                      that.dataRate.dd29 = (rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2)
                      that.dataTotal.dd29 = rateArr.damageNum
                    }
                    if(rateArr.dd == 30 && rateArr.orderTotal != 0 ){
                      damaArr.push((rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2))
                      that.dataRate.dd030 = (rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2)
                      that.dataTotal.dd30 = rateArr.damageNum
                    }
                    if(rateArr.dd == 31 && rateArr.orderTotal != 0 ){
                      damaArr.push((rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2))
                      that.dataRate.dd31 = (rateArr.damageNum/rateArr.orderTotal * 100).toFixed(2)
                      that.dataTotal.dd31 = rateArr.damageNum
                    }  
                  }
                  this.maxD = Math.max(...damaArr) + 1
                  this.maxI = parseFloat((this.maxD/4).toFixed(2))
                  this.max = Math.round(Math.max(...num)/4 + 0.5)
                  that.updateOption()
                }
                } else {
                this.restoreKpi()
                }
            }).catch(() => {
                this.restoreKpi()
        })
      },
      addZero (value) {
        if (value < 10) {
          return `0${value}`
        } else {
          return value
        }
      },
      restore () {
          this.data = {
            totalNum: '--',
            interruptNum: '--',
            tsfNum: '--',
            wtsNum: '--',
            bage: 89,
            wage: 89,
            tsage: 89
          }
      },
      restoreKpi () {
          //破损率
         this.dataRate =  {
            dd01: '0.00',
            dd02: '0.00',
            dd03: '0.00',
            dd04: '0.00',
            dd05: '0.00',
            dd06: '0.00',
            dd07: '0.00',
            dd08: '0.00',
            dd09: '0.00',
            dd10: '0.00',
            dd11: '0.00',
            dd12: '0.00',
            dd13: '0.00',
            dd14: '0.00',
            dd15: '0.00',
            dd16: '0.00',
            dd17: '0.00',
            dd18: '0.00',
            dd19: '0.00',
            dd20: '0.00',
            dd21: '0.00',
            dd22: '0.00',
            dd23: '0.00',
            dd23: '0.00',
            dd24: '0.00',
            dd25: '0.00',
            dd26: '0.00',
            dd27: '0.00',
            dd28: '0.00',
            dd29: '0.00',
            dd30: '0.00',
            dd31: '0.00',
          },
          //破损数量
          this.dataTotal =  {
            dd01: 0,
            dd02: 0,
            dd03: 0,
            dd04: 0,
            dd05: 0,
            dd06: 0,
            dd07: 0,
            dd08: 0,
            dd09: 0,
            dd10: 0,
            dd11: 0,
            dd12: 0,
            dd13: 0,
            dd14: 0,
            dd15: 0,
            dd16: 0,
            dd17: 0,
            dd18: 0,
            dd19: 0,
            dd20: 0,
            dd21: 0,
            dd22: 0,
            dd23: 0,
            dd23: 0,
            dd24: 0,
            dd25: 0,
            dd26: 0,
            dd27: 0,
            dd28: 0,
            dd29: 0,
            dd30: 0,
            dd31: 0,
          }
      },
      resizeMeth () {
        let outOpts2 = {
          height: this.el.clientHeight * 0.24,
          width: this.el.clientWidth * 0.15 ,
            }
        let tkpiOpts2 = {
          height: this.el.clientHeight * 0.42,
          width: this.el.clientWidth * 0.95
        }
        this.breakC.resize(outOpts2)
        this.waitC.resize(outOpts2)
        this.alTrans.resize(outOpts2)
        this.tKpi.resize(tkpiOpts2)
        this.updateOption()
      },
      updateOption () {
          //破损仪表盘options
          let breakOptions = {
              series: [
                    {
                      name: '',
                      type: 'gauge',
                      radius : '90%',
                      startAngle: 89.9,
                      endAngle: this.data.bage - 0.9,
                      axisLine: {
                          show: true,
                          lineStyle: {
                              width: 17,
                            color: [
                              [1,new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                {
                                  offset: 0.2,
                                  color: "rgba(249, 97, 127, 0.5)"
                                },
                                // {
                                //   offset: 0.6,
                                //   color: "#30D27C"
                                // },
                                {
                                  offset: 1,
                                  color: "rgba(249, 74, 93, 1)"
                                }
                              ])
                            ]
                          ]
                          }
                      },
                      // 分隔线样式。
                      splitLine: {
                          show: false
                      },
                      // 刻度样式。
                      axisTick: {
                        show: false
                      },
                      // 刻度标签。
                      axisLabel: {
                        show: false
                      },
                      // 仪表盘指针。
                      markPoint: {
                        symbol: 'circle',
                        sumbolSize: 20
                      },
                      pointer: {
                          show: true,
                          // 指针长度
                          length: '10%',
                          width: 0
                      },
                      itemStyle: {
                        color: '#3DA6CC'
                      },
                      // 仪表盘详情，用于显示数据
                      detail: {
                        show: false
                      },
                      color: {
                          type: 'linear',
                          x: 0,
                          y: 0,
                          x2: 0,
                          y2: 1,
                          colorStops: [{
                              offset: 0.6, color: '#7A939E' // 0% 处的颜色
                          }, {
                              offset: 1, color: 'red' // 100% 处的颜色
                          }],
                          global: false // 缺省为 false
                      },
                      data: [{
                          value: 53.96
                      }]
                    },
                    {
                      name: '',
                      type: 'gauge',
                      radius: '75%',
                      // 仪表盘轴线(轮廓线)相关配置。
                    startAngle: this.data.bage,
                    endAngle: -269.9,
                      axisLine: {
                          show: true,
                          lineStyle: {
                              width: 8,
                              color: [[1, 'rgba(127, 187, 255, 0.3)']]
                          }
                      },
                      // 分隔线样式。
                      splitLine: {
                          show: false
                      },
                      // 刻度样式。
                      axisTick: {
                        show: false
                      },
                      // 刻度标签。
                      axisLabel: {
                        show: false
                      },
                      // 仪表盘指针。
                      markPoint: {
                        symbol: 'circle',
                        sumbolSize: 20
                      },
                      pointer: {
                          show: true,
                          // 指针长度
                          length: '10%',
                          width: 0
                      },
                      itemStyle: {
                        color: 'rgba(127, 187, 255, 0.3)'
                      },
                      // 仪表盘详情，用于显示数据
                      detail: {
                        show: false
                      },
                      data: [{
                          value: 53.96
                      }]
                }
              ]
          }
          this.breakC.setOption(breakOptions,true)
          //待中转仪表盘options
          let waitOptions = {
              series: [
                    {
                      name: '',
                      type: 'gauge',
                      radius : '90%',
                      startAngle: 90,
                      endAngle: this.data.wage - 0.9,
                      axisLine: {
                          show: true,
                          lineStyle: {
                              width: 17,
                            color: [
                              [1,new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                {
                                  offset: 0.1,
                                  color: "rgba(243, 217, 145, 0.5)"
                                },
                                // {
                                //   offset: 0.6,
                                //   color: "#30D27C"
                                // },
                                {
                                  offset: 1,
                                  color: "rgba(247, 193, 48, 1)"
                                }
                              ])
                            ]
                          ]
                          }
                      },
                      // 分隔线样式。
                      splitLine: {
                          show: false
                      },
                      // 刻度样式。
                      axisTick: {
                        show: false
                      },
                      // 刻度标签。
                      axisLabel: {
                        show: false
                      },
                      // 仪表盘指针。
                      markPoint: {
                        symbol: 'circle',
                        sumbolSize: 20
                      },
                      pointer: {
                          show: true,
                          // 指针长度
                          length: '10%',
                          width: 0
                      },
                      itemStyle: {
                        color: '#3DA6CC'
                      },
                      // 仪表盘详情，用于显示数据
                      detail: {
                        show: false
                      },
                      color: {
                          type: 'linear',
                          x: 0,
                          y: 0,
                          x2: 0,
                          y2: 1,
                          colorStops: [{
                              offset: 0.6, color: '#7A939E' // 0% 处的颜色
                          }, {
                              offset: 1, color: 'red' // 100% 处的颜色
                          }],
                          global: false // 缺省为 false
                      },
                      data: [{
                          value: 53.96
                      }]
                    },
                    {
                      name: '',
                      type: 'gauge',
                      radius: '75%',
                      // 仪表盘轴线(轮廓线)相关配置。
                    startAngle: this.data.wage,
                    endAngle: -269.9,
                      axisLine: {
                          show: true,
                          lineStyle: {
                              width: 8,
                              color: [[1, 'rgba(127, 187, 255, 0.3)']]
                          }
                      },
                      // 分隔线样式。
                      splitLine: {
                          show: false
                      },
                      // 刻度样式。
                      axisTick: {
                        show: false
                      },
                      // 刻度标签。
                      axisLabel: {
                        show: false
                      },
                      // 仪表盘指针。
                      markPoint: {
                        symbol: 'circle',
                        sumbolSize: 20
                      },
                      pointer: {
                          show: true,
                          // 指针长度
                          length: '10%',
                          width: 0
                      },
                      itemStyle: {
                        color: 'rgba(127, 187, 255, 0.3)'
                      },
                      // 仪表盘详情，用于显示数据
                      detail: {
                        show: false
                      },
                      data: [{
                          value: 53.96
                      }]
                }
              ]
          }
          this.waitC.setOption(waitOptions,true)
          //已中转仪表盘options
          let alTransOptions = {
              series: [
                    {
                      name: '',
                      type: 'gauge',
                      radius : '90%',
                      startAngle: 90,
                      endAngle: this.data.tsage - 0.9,
                      axisLine: {
                          show: true,
                          lineStyle: {
                              width: 17,
                            color: [
                              [1,new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                {
                                  offset: 0.1,
                                  color: "rgba(52, 200, 255, 0.8)"
                                },
                                // {
                                //   offset: 0.6,
                                //   color: "#30D27C"
                                // },
                                {
                                  offset: 1,
                                  color: "rgba(105, 107, 255, 0.8)"
                                }
                              ])
                            ]
                          ]
                          }
                      },
                      // 分隔线样式。
                      splitLine: {
                          show: false
                      },
                      // 刻度样式。
                      axisTick: {
                        show: false
                      },
                      // 刻度标签。
                      axisLabel: {
                        show: false
                      },
                      // 仪表盘指针。
                      markPoint: {
                        symbol: 'circle',
                        sumbolSize: 20
                      },
                      pointer: {
                          show: true,
                          // 指针长度
                          length: '10%',
                          width: 0
                      },
                      itemStyle: {
                        color: '#3DA6CC'
                      },
                      // 仪表盘详情，用于显示数据
                      detail: {
                        show: false
                      },
                      color: {
                          type: 'linear',
                          x: 0,
                          y: 0,
                          x2: 0,
                          y2: 1,
                          colorStops: [{
                              offset: 0.6, color: '#7A939E' // 0% 处的颜色
                          }, {
                              offset: 1, color: 'red' // 100% 处的颜色
                          }],
                          global: false // 缺省为 false
                      },
                      data: [{
                          value: 53.96
                      }]
                    },
                    {
                      name: '',
                      type: 'gauge',
                      radius: '75%',
                      // 仪表盘轴线(轮廓线)相关配置。
                    startAngle: this.data.tsage,
                    endAngle: -269.9,
                      axisLine: {
                          show: true,
                          lineStyle: {
                              width: 8,
                              color: [[1, 'rgba(127, 187, 255, 0.3)']]
                          }
                      },
                      // 分隔线样式。
                      splitLine: {
                          show: false
                      },
                      // 刻度样式。
                      axisTick: {
                        show: false
                      },
                      // 刻度标签。
                      axisLabel: {
                        show: false
                      },
                      // 仪表盘指针。
                      markPoint: {
                        symbol: 'circle',
                        sumbolSize: 20
                      },
                      pointer: {
                          show: true,
                          // 指针长度
                          length: '10%',
                          width: 0
                      },
                      itemStyle: {
                        color: 'rgba(127, 187, 255, 0.3)'
                      },
                      // 仪表盘详情，用于显示数据
                      detail: {
                        show: false
                      },
                      data: [{
                          value: 53.96
                      }]
                }
              ]
          }
          this.alTrans.setOption(alTransOptions,true)
          //折线图options
          let tKpiOptions = {
                    title: {
                      text: `2019年${this.mounth}月破损率分布`,
                      top: 0,
                      left: 20,
                      // bottom:10,
                      textStyle : {
                        color: '#FFFFFF',
                        fontSize: 14,
                        fontWeight: 'bolder',
                        fontFamily: 'PingFang SC',
                        padding: [5]
                      }
                    },
                    tooltip: {
                    trigger: 'axis',
                    confine: true,
                    formatter: function (params) {
                    var res='<div><p>'+params[0].name+'号</p></div>' 
                    for(var i=0;i<params.length;i++){
                      let name = '%'
                      if(params[i].seriesName === '破损率') {
                        name = '%'
                      } else {
                        name = '/件'
                      }
                    res+='<p>' + params[i].marker + params[i].seriesName + ':' + params[i].data + name + '</p>'
                    }
                    return res;
                    },
                    extraCssText:
                       `background-color: rgba(1, 22, 38, 0.8);
                        box-shadow:0px 10px 20px 0px rgba(0, 0, 0, 0.4);
                        border-radius:8px;`
                    },
                    toolbox: {
                        show: false,
                    },
                    legend: {//这里定义了折线图上面那2排的颜色，显示的样子
                        align: 'auto',
                        inactiveColor: 'rgba(122, 147, 158, 0.6)',
                        itemGap: 20,
                        top: '0%',
                        right: 20,
                        textStyle: {
                            color: '#7a939e',
                            fontSize: 0, // this.fontSizeRs,
                            fontFamily: `'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif`
                        },
                        data: [
                          {name:'破损率',icon:'roundRect'},
                          {name:'破损数量',icon:'circle'}
                        ],
                        itemHeight:7,
                        itemWidth:15,
                        textStyle: {
                            color: "rgba(199, 235, 255, 0.6)",
                        }
                    },
                    grid: {//定义折线图距离左边多少右边多少上边多少的距离
                        left: '2%',
                        right:20,
                        top: '20%',
                        bottom: 0,
                        containLabel: true //grid 区域是否包含坐标轴的刻度标签。如果不写true，那么纵坐标的位置就不会算进上面设置的坐边右边上边下边里面去
                    },
                    xAxis: [//定义X轴
                        {
                            type: 'category',//设置X轴的类型
                            name: '',
                            nameGap: 30,
                            axisLabel: {//坐标轴刻度标签的相关设置。
                                color: "rgba(199, 235, 255, 0.6)",//设置颜色
                                fontSize: '12',//字体大小
                                interval: 1,//设置每个相邻之间少1个数
                                rotate: 0,//刻度标签旋转的角度
                            },
                            axisLine: {//坐标轴颜色
                                lineStyle: {//坐标轴颜色
                                    color: "rgba(255, 255, 255,0.11)",
                                },
                            },
                            splitLine :{
                              lineStyle: {
                                color: 'rgba(199, 235, 255, 0.6)'
                              }
                              },
                            data: this.xData//数据源
                        }
                    ],
                    yAxis: [//定义y轴
                          {
                              type: 'value',
                              name: '',
                              interval: 25,  
                              //双y轴刻度重合配置
                              max: this.maxD,
                              min: function(value) {
                                  return 0
                              },
                              interval : this.maxI,
                              axisLabel: {//坐标轴刻度标签的相关设置。
                                  color: "rgba(199, 235, 255, 0.6)",
                                  fontSize: '14',
                                  interval: 0,
                              },
                              axisLine: {//坐标轴颜色
                                  show:false,
                                  lineStyle: {//坐标轴颜色
                                      color: "rgba(199, 235, 255, 0.6)",
                                  },
                              },
                              axisLabel: {
                                  formatter: '{value} %'
                              },
                            splitLine :{
                              lineStyle: {
                                color: 'rgba(255, 255, 255,0.11)'
                              }
                              },
                          },
                         {
                            type: 'value',
                            name: '',
                            splitNumber:4,
                            //双y轴刻度重合配置
                            interval: this.max,   
                            max: this.max*4,
                            min: function(value) {
                                return 0
                            },
                            axisLabel: {//坐标轴刻度标签的相关设置。
                                color: "rgba(199, 235, 255, 0.6)",
                                fontSize: '14',
                                interval: 0,
                            },
                            axisLine: {//坐标轴颜色
                                show:false,
                                lineStyle: {//坐标轴颜色
                                    color: "rgba(255, 255, 255, 0.11)",
                                },
                            },
                            splitLine :{
                              lineStyle: {
                                color: 'rgba(255, 255, 255,0.11)'
                              }
                              },
                        },

                    ],
                    series: [//系列列表。每个系列通过 type 决定自己的图表类型
                        {
                            name: '破损率',//数据项名称。如果不写这个那么上面的2排里面就会少一个
                            type: 'line',//设置为折线图
                            smooth:true, 
                            data: [this.dataRate.dd01, this.dataRate.dd02, this.dataRate.dd03, this.dataRate.dd04,this.dataRate.dd05, this.dataRate.dd06, this.dataRate.dd07, this.dataRate.dd08, this.dataRate.dd09, this.dataRate.dd10, this.dataRate.dd11, this.dataRate.dd12, this.dataRate.dd13, this.dataRate.dd14, this.dataRate.dd15, this.dataRate.dd16,this.dataRate.dd17,this.dataRate.dd18,this.dataRate.dd19,this.dataRate.dd20,this.dataRate.dd21,this.dataRate.dd22,this.dataRate.dd23, this.dataRate.dd24, this.dataRate.dd25, this.dataRate.dd26, this.dataRate.dd27, this.dataRate.dd28, this.dataRate.dd29, this.dataRate.dd30, this.dataRate.dd31],
                            showAllSymbol: false,//示折线图上所有小标签
                            symbolSize: 1,//标记的大小
                            symbol: 'circle',
                            areaStyle: {
                              normal: {
                                  color: {
                                  type: 'linear',
                                  x: 0,
                                  y: 0,
                                  x2: 0,
                                  y2: 1,
                                  colorStops: [{
                                      offset: 0, color: 'rgba(255, 76, 106, 0.5)'
                                  }, {
                                      offset: 0.5, color: 'rgba(255, 76, 106, 0.6)'
                                  }, {
                                      offset: 1, color: 'rgba(250, 175, 187, 0)'
                                  }]
                                  }
                              }
                            },
                            itemStyle: {
                            normal: {
                                color: 'rgba(255, 76, 106, 1)',
                                borderColor: 'rgba(255, 76, 106, 1)',
                                borderWidth: 1,
                                lineStyle:{  
                                      color:'rgba(255, 76, 106, 1)'  
                              } 
                            }
                            },
                                xAxisIndex: 0,
                                yAxisIndex: 0,
                        },
                        {
                            name: '破损数量',
                            type: 'bar',
                            data: [this.dataTotal.dd01, this.dataTotal.dd02, this.dataTotal.dd03, this.dataTotal.dd04,this.dataTotal.dd05, this.dataTotal.dd06, this.dataTotal.dd07, this.dataTotal.dd08, this.dataTotal.dd09, this.dataTotal.dd10, this.dataTotal.dd11, this.dataTotal.dd12, this.dataTotal.dd13, this.dataTotal.dd14, this.dataTotal.dd15, this.dataTotal.dd16,this.dataTotal.dd17,this.dataTotal.dd18,this.dataTotal.dd19,this.dataTotal.dd20,this.dataTotal.dd21,this.dataTotal.dd22,this.dataTotal.dd23, this.dataTotal.dd24, this.dataTotal.dd25, this.dataTotal.dd26, this.dataTotal.dd27, this.dataTotal.dd28, this.dataTotal.dd29, this.dataTotal.dd30, this.dataTotal.dd31],
                            itemStyle : {
                                normal : {
                                    color:'rgba(181, 197, 204, 0.22)',
                                    label : {
                                        textStyle : {
                                            fontSize : '15',//柱状上的显示的文字
                                            color:'#0fdc97'
                                        }
                                    }
                                }
                            },
                            barWidth:8,
                            yAxisIndex: 1,
                        }
                    ]
        }
        this.tKpi.setOption(tKpiOptions,true)
      }
  },
  watch: {
    resize: {
      handler (value) {
        this.resizeMeth()
      }
    },
    refrush: {
      handler (value) {
        this.updateData()
        this.updateDataRate()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
$using: rgba(36, 202, 211, 1);
$not-used: rgba(247, 193, 48, 1);
$not-allowed: rgba(255, 95, 121, 1);
.outYear>.header {
  flex: 0 0 40px;
  line-height: 40px;
  width:100%;
  display: flex;
}
.header-title{
  position: relative;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  font-size:0.2rem;
  font-family:PingFang SC;
  font-weight:bold;
  text-align: center;
}
.outYear>.header>img{
   width: 25%;
  height: 30%;
  top:50%;
  transform: translateY(-50%);
  position: relative;
}
.outYear>.header>img:first-child{
  margin-right: 13%;
}
.outYear>.header>img:last-child{
  margin-left: 13%;
}
.outYear>.body:nth-last-child(2) {
  flex: 0 0 calc((100% - 40px) / 460 * 240);
  /* height: calc(100% / 275 * 215); */
  display: flex;
  flex-direction: column;
  .body-top {
    height: 100%;
    display: flex;
    justify-content: space-between;
  }
}
.body-top>div:first-child {
  // margin-right: calc(100% / 758 * 40);
  width: 45%;
  // height: calc(50% - 50% / 570 * 10);
  display: flex;
  justify-content: center;
  overflow: hidden;
}
.body-top>div:not(:first-child){
  width: 20%;

}
.transfC{
  height: calc(100%);
  width: calc(100% + 2em);
  line-height: 1.2;
  position: relative;
  background-image: url('~@img/icon/log/earth_transLug.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-size: auto 100%;
  .text{
    width: calc(50% - 50% / 570 * 20);
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    pointer-events: none;
    font-size: 0.14rem;
    font-family:PingFang SC;
    font-weight:bold;
    color:rgba(255,255,255,1);
    .num-st{
      margin-top: 0%;
      font-size: 0.52rem;
      font-family: 'DINPRO-MEDIUM';
      font-weight:normal;
      color:rgba(255,255,255,1);
      text-shadow:0px 0px 20px rgba(0, 0, 0, 1);
    }
  }
}
.bodyC {
  position: absolute;
  margin: 4% auto
}
.bodyC>.circle{
  width:100%
}
.bodyC>.text {
  .label {
    font-size:14px;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(199,235,255,1);
    opacity:0.6;
  }
  .number {
    font-size:20px;
    font-family:'DINPRO-MEDIUM';
    font-weight:500;
    color:rgba(255,255,255,1);
  }
}
.title-kpi{
   font-family:'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif;
    color: rgba(255,255,255,1);
    font-weight: bold;
    font-size: 14px;
    margin-top:5px ;
    margin-bottom:10px ;
    margin-left:5px ;
    text-align: left;
    height: 15px;
}
.tkpi{
    margin-top:10px
}
</style>