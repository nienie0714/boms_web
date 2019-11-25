<template>
    <!-- 2019行李年度分析 -->
    <div class="outYear ceshi-block">
       <div class="header">
         <img :src="require('@icon/logo/outBound_titleL.png')"/>
          <div class="header-title font-st">2019年出港行李年度分析</div>
          <img :src="require('@icon/logo/outBond_title.png')"/>
      </div> 
      <div class="body">
          <div class="body-top">
            <div>
                <div class="circle">
                    <div class="outLug label font-rs">出港行李高峰期</div>
                    <div class="circle">
                        <div id="lugMouth" class="gauge"></div>
                        <div class="text">
                            {{maxMounth}}<span class="label font-rs"> 月</span>
                        </div>
                    </div>
                </div>
                <div class="circle">
                    <div class="outLug label font-rs">出港总量同比2018</div>
                    <div class="circle">
                        <div id="lugUp" class="gauge"></div>
                        <div class="text">
                            <img :src="require('@icon/mercy_triangle.png')">
                            <span class="numberR font-rs">{{updateRate}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div class="leveLugCircle" id="lugYearCircle"></div>
            </div>
          </div>
      </div>
      <div class="body">
          <div class="body-bottom">
              <div>
                  <div id="lugKpi" class="lugKpi"></div>
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
          lugYearCircle: null,
          lugYearCircleEl:null,
          lugKpi: null,
          lugKpiEl: null,
          lugMouth: null,
          lugMouthEl: null,
          lugUp: null,
          el: null,
          lugUpEL:null,
          //环比接口
          queryUrl: '/kpi/dynamic/queryRingRatioD',
          //高峰期借口
          queryMunthUrl:'/kpi/dynamic/queryHightMonth',
          //同比2018接口
          queryRateUrl: '/kpi/dynamic/queryYearRatioD',
          //折线图接口
          queryLug: '/kpi/dynamic/queryDamageNum',
          //每月环比
          data: {
            mm01: null,
            mm02: null,
            mm03: null,
            mm04: null,
            mm05: null,
            mm06: null,
            mm07: null,
            mm08: null,
            mm09: null,
            mm10: null,
            mm11: null,
            mm12: null
          },
          //迟运率
          dataLate:{
            dd01: '0.000',
            dd02: '0.000',
            dd03: '0.000',
            dd04: '0.000',
            dd05: '0.000',
            dd06: '0.000',
            dd07: '0.000',
            dd08: '0.000',
            dd09: '0.000',
            dd10: '0.000',
            dd11: '0.000',
            dd12: '0.000',
            dd13: '0.000',
            dd14: '0.000',
            dd15: '0.000',
            dd16: '0.000',
            dd17: '0.000',
            dd18: '0.000',
            dd19: '0.000',
            dd20: '0.000',
            dd21: '0.000',
            dd22: '0.000',
            dd23: '0.000',
            dd23: '0.000',
            dd24: '0.000',
            dd25: '0.000',
            dd26: '0.000',
            dd27: '0.000',
            dd28: '0.000',
            dd29: '0.000',
            dd30: '0.000',
            dd31: '0.000',
          },
          //破损率
          dataBreak: {
            dd01: '0.000',
            dd02: '0.000',
            dd03: '0.000',
            dd04: '0.000',
            dd05: '0.000',
            dd06: '0.000',
            dd07: '0.000',
            dd08: '0.000',
            dd09: '0.000',
            dd10: '0.000',
            dd11: '0.000',
            dd12: '0.000',
            dd13: '0.000',
            dd14: '0.000',
            dd15: '0.000',
            dd16: '0.000',
            dd17: '0.000',
            dd18: '0.000',
            dd19: '0.000',
            dd20: '0.000',
            dd21: '0.000',
            dd22: '0.000',
            dd23: '0.000',
            dd23: '0.000',
            dd24: '0.000',
            dd25: '0.000',
            dd26: '0.000',
            dd27: '0.000',
            dd28: '0.000',
            dd29: '0.000',
            dd30: '0.000',
            dd31: '0.000',
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
          age: 89,
          //破速率最大值
          maxD: 0,
          //迟运率最大值
          maxL: 0,
          //概率最大值
          max: 0,
          //破损数最大值
          vM: 0,
          maxMounth: null,
          updateRate: null,
          muAge: 90
      }
  },
  mounted () {
      this.lugYearCircleEl = document.getElementById('lugYearCircle')
      this.lugYearCircle = this.$echarts.init(this.lugYearCircleEl)
      this.lugMouthEl = document.getElementById('lugMouth')
      this.lugMouth = this.$echarts.init(this.lugMouthEl)
      this.lugUpEL = document.getElementById('lugUp')
      this.lugUp = this.$echarts.init(this.lugUpEL)
      this.lugKpiEl = document.getElementById('lugKpi')
      this.lugKpi = this.$echarts.init(this.lugKpiEl)
      this.el = document.getElementsByClassName('outYear')[0]
      this.updateOption()
      this.$nextTick(() => {
        let outOpts = {
          height:this.el.clientHeight * 0.49,
          width: this.el.clientWidth * 0.45 
        }
        let simalOpt = {
          height:this.el.clientHeight * 0.27,
          width: this.el.clientWidth * 0.17
        }
        let kpiOpts = {
          height: this.el.clientHeight * 0.42,
          width: this.el.clientWidth * 0.95
        }
        this.lugYearCircle.resize(outOpts)
        this.lugMouth.resize(simalOpt)
        this.lugUp.resize(simalOpt)
        this.lugKpi.resize(kpiOpts)
         this.updateOption()
    })
  },
  methods: {
    //请求环比
      updateData () {
        let that = this
        queryAll(this.queryUrl).then(res => {
            if (res.data.code == 0) {
                if (JSON.stringify(res.data.data) == '{}') {
                    this.restore()
                } else {
                  let arr = res.data.data
                  for(var i = 0; i < arr.length; i++){
                    let cirArr = arr[i]
                    if(cirArr.mm == 1){
                      that.data.mm01 = cirArr.ringRatio
                    }
                    if(cirArr.mm == 2){
                      that.data.mm02 = cirArr.ringRatio
                    }
                    if(cirArr.mm == 3){
                      that.data.mm03 = cirArr.ringRatio
                    }
                    if(cirArr.mm == 4){
                      that.data.mm04 = cirArr.ringRatio
                    }
                    if(cirArr.mm == 5){
                      that.data.mm05 = cirArr.ringRatio
                    }
                    if(cirArr.mm == 6){
                      that.data.mm06 = cirArr.ringRatio
                    }
                    if(cirArr.mm == 7){
                      that.data.mm07 = cirArr.ringRatio
                    }
                    if(cirArr.mm == 8){
                      that.data.mm08 = cirArr.ringRatio
                    }
                    if(cirArr.mm == 9){
                      that.data.mm09 = cirArr.ringRatio
                    }
                    if(cirArr.mm == 10){
                      that.data.mm10 = cirArr.ringRatio
                    }
                    if(cirArr.mm == 11){
                      that.data.mm12 = cirArr.ringRatio
                    }
                    if(cirArr.mm == 12){
                      that.data.mm12 = cirArr.ringRatio
                    }
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
      //请求月份比
      updateDataMounth () {
          let that = this
          queryAll(this.queryMunthUrl).then(res => {
            if (res.data.code == 0) {
                if (JSON.stringify(res.data.data) == '{}') {
                    this.restore()
                } else {
                  that.maxMounth = res.data.data[0].mm
                if(this.maxMounth == 1||this.maxMounth == 3||this.maxMounth == 5||this.maxMounth == 7||this.maxMounth == 8||this.maxMounth == 10||this.maxMounth == 12){
                  this.xData = ['1', '2','3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22' ,'23', '24','25', '26', '27', '28', '29', '30', '31']
                }
                if(this.maxMounth == 4||this.maxMounth == 6||this.maxMounth == 9||this.maxMounth == 11){
                  this.xData = ['1', '2','3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22' ,'23', '24','25', '26', '27', '28', '29', '30']
                }
                if(this.maxMounth == 2){
                  this.xData = ['1', '2','3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22' ,'23', '24','25', '26', '27', '28']
                }
                    that.updateOption()
                    that.muAge = 90 - that.maxMounth * 30
                }
                } else {
                this.restoreM()
                }
            }).catch(() => {
                this.restoreM()
          })
      },
      //同比2018
      updateDataMRate () {
          let that = this
          queryAll(this.queryRateUrl).then(res => {
            if (res.data.code == 0) {
                if (JSON.stringify(res.data.data) == '{}') {
                    this.restore()
                } else {
                  that.updateRate = res.data.data[0].yearRatio + '%'
                   let agel = 90 - (res.data.data[0].yearRatio/100 * 360)
                    this.age = agel                  
                    that.updateOption()
 
                }
                } else {
                this.restoreR()
                }
            }).catch(() => {
                this.restoreR()
          })
      },
      //折线图数据
      updateDataLug () {
        let that = this
        queryAll(this.queryLug).then(res => {
            if (res.data.code == 0) {
                if (JSON.stringify(res.data.data) == '{}') {
                    this.restore()
                } else {
                  let arr = res.data.data
                    var lateArr = []
                    var damaArr = []
                    var lateRate = []
                    var damaRate = []
                  for(var i = 0;i <arr.length; i++){
                    //计算概率及最大值
                    let rateArr = arr[i]
                    lateArr.push(arr[i].delayNum) 
                    damaArr.push(arr[i].damageNum)
                    if(rateArr.dd == 1 && rateArr.totalNum != 0 && rateArr.totalNum != 0){
                      lateRate.push((rateArr.delayNum/rateArr.totalNum * 100).toFixed(3))
                      damaRate.push((rateArr.damageNum/rateArr.totalNum * 100).toFixed(3))
                      that.dataLate.dd01 = (rateArr.delayNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataBreak.dd01 = (rateArr.damageNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataTotal.dd01 = rateArr.damageNum
                    }
                    if(rateArr.dd == 2 && rateArr.totalNum != 0){
                      lateRate.push((rateArr.delayNum/rateArr.totalNum * 100).toFixed(3))
                      damaRate.push((rateArr.damageNum/rateArr.totalNum * 100).toFixed(3))
                      that.dataLate.dd02 = (rateArr.delayNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataBreak.dd02 = (rateArr.damageNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataTotal.dd02 = rateArr.damageNum
                    }
                    if(rateArr.dd == 3 && rateArr.totalNum != 0){
                      lateRate.push((rateArr.delayNum/rateArr.totalNum * 100).toFixed(3))
                      damaRate.push((rateArr.damageNum/rateArr.totalNum * 100).toFixed(3))
                      that.dataLate.dd03 = (rateArr.delayNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataBreak.dd03 = (rateArr.damageNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataTotal.dd03 = rateArr.damageNum
                    }
                    if(rateArr.dd == 4 && rateArr.totalNum != 0){
                      lateRate.push((rateArr.delayNum/rateArr.totalNum * 100).toFixed(3))
                      damaRate.push((rateArr.damageNum/rateArr.totalNum * 100).toFixed(3))
                      that.dataLate.dd04 = (rateArr.delayNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataBreak.dd04 = (rateArr.damageNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataTotal.dd04 = rateArr.damageNum
                    }
                    if(rateArr.dd == 5 && rateArr.totalNum != 0){
                      lateRate.push((rateArr.delayNum/rateArr.totalNum * 100).toFixed(3))
                      damaRate.push((rateArr.damageNum/rateArr.totalNum * 100).toFixed(3))
                      that.dataLate.dd05 = (rateArr.delayNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataBreak.dd05 = (rateArr.damageNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataTotal.dd05 = rateArr.damageNum
                    }
                    if(rateArr.dd == 6 && rateArr.totalNum != 0){
                      lateRate.push((rateArr.delayNum/rateArr.totalNum * 100).toFixed(3))
                      damaRate.push((rateArr.damageNum/rateArr.totalNum * 100).toFixed(3))
                      that.dataLate.dd06 = (rateArr.delayNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataBreak.dd06 = (rateArr.damageNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataTotal.dd06 = rateArr.damageNum
                    }
                    if(rateArr.dd == 7 && rateArr.totalNum != 0){
                      lateRate.push((rateArr.delayNum/rateArr.totalNum * 100).toFixed(3))
                      damaRate.push((rateArr.damageNum/rateArr.totalNum * 100).toFixed(3))
                      that.dataLate.dd07 = (rateArr.delayNum/rateArr.totalNum * 100).toFixed(3)
                       that.dataBreak.dd07 = (rateArr.damageNum/rateArr.totalNum * 100).toFixed(3)
                       that.dataTotal.dd07 = rateArr.damageNum
                    }
                    if(rateArr.dd == 8 && rateArr.totalNum != 0){
                      lateRate.push((rateArr.delayNum/rateArr.totalNum * 100).toFixed(3))
                      damaRate.push((rateArr.damageNum/rateArr.totalNum * 100).toFixed(3))
                      that.dataLate.dd08 = (rateArr.delayNum/rateArr.totalNum * 100).toFixed(3)
                       that.dataBreak.dd08 = (rateArr.damageNum/rateArr.totalNum * 100).toFixed(3)
                       that.dataTotal.dd08 = rateArr.damageNum
                    }
                    if(rateArr.dd == 9 && rateArr.totalNum != 0){
                      lateRate.push((rateArr.delayNum/rateArr.totalNum * 100).toFixed(3))
                      damaRate.push((rateArr.damageNum/rateArr.totalNum * 100).toFixed(3))
                      that.dataLate.dd09 = (rateArr.delayNum/rateArr.totalNum * 100).toFixed(3)
                       that.dataBreak.dd09 = (rateArr.damageNum/rateArr.totalNum * 100).toFixed(3)
                       that.dataTotal.dd09 = rateArr.damageNum
                    }
                    if(rateArr.dd == 10 && rateArr.totalNum != 0){
                      lateRate.push((rateArr.delayNum/rateArr.totalNum * 100).toFixed(3))
                      damaRate.push((rateArr.damageNum/rateArr.totalNum * 100).toFixed(3))
                      that.dataLate.dd10 = (rateArr.delayNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataBreak.dd10 = (rateArr.damageNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataTotal.dd10 = rateArr.damageNum
                    }
                    if(rateArr.dd == 11 && rateArr.totalNum != 0){
                      lateRate.push((rateArr.delayNum/rateArr.totalNum * 100).toFixed(3))
                      damaRate.push((rateArr.damageNum/rateArr.totalNum * 100).toFixed(3))
                      that.dataLate.dd11 = (rateArr.delayNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataBreak.dd11 = (rateArr.damageNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataTotal.dd11 = rateArr.damageNum
                    }
                    if(rateArr.dd == 12 && rateArr.totalNum != 0){
                      lateRate.push((rateArr.delayNum/rateArr.totalNum * 100).toFixed(3))
                      damaRate.push((rateArr.damageNum/rateArr.totalNum * 100).toFixed(3))
                      that.dataLate.dd12 = (rateArr.delayNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataBreak.dd12= (rateArr.damageNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataTotal.dd12 = rateArr.damageNum
                    }
                    if(rateArr.dd == 13 && rateArr.totalNum != 0){
                      lateRate.push((rateArr.delayNum/rateArr.totalNum * 100).toFixed(3))
                      damaRate.push((rateArr.damageNum/rateArr.totalNum * 100).toFixed(3))
                      that.dataLate.dd13 = (rateArr.delayNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataBreak.dd13= (rateArr.damageNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataTotal.dd13 = rateArr.damageNum
                    }
                    if(rateArr.dd == 14 && rateArr.totalNum != 0){
                      lateRate.push((rateArr.delayNum/rateArr.totalNum * 100).toFixed(3))
                      damaRate.push((rateArr.damageNum/rateArr.totalNum * 100).toFixed(3))
                      that.dataLate.dd14 = (rateArr.delayNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataBreak.dd14 = (rateArr.damageNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataTotal.dd14 = rateArr.damageNum
                    }
                    if(rateArr.dd == 15 && rateArr.totalNum != 0){
                      lateRate.push((rateArr.delayNum/rateArr.totalNum * 100).toFixed(3))
                      damaRate.push((rateArr.damageNum/rateArr.totalNum * 100).toFixed(3))
                      that.dataLate.dd15 = (rateArr.delayNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataBreak.dd15 = (rateArr.damageNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataTotal.dd15 = rateArr.damageNum
                    }
                    if(rateArr.dd == 16 && rateArr.totalNum != 0){
                      lateRate.push((rateArr.delayNum/rateArr.totalNum * 100).toFixed(3))
                      damaRate.push((rateArr.damageNum/rateArr.totalNum * 100).toFixed(3))
                      that.dataLate.dd16 = (rateArr.delayNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataBreak.dd16 = (rateArr.damageNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataTotal.dd16 = rateArr.damageNum
                    }
                    if(rateArr.dd == 17 && rateArr.totalNum != 0){
                      lateRate.push((rateArr.delayNum/rateArr.totalNum * 100).toFixed(3))
                      damaRate.push((rateArr.damageNum/rateArr.totalNum * 100).toFixed(3))
                      that.dataLate.dd17 = (rateArr.delayNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataBreak.dd17 = (rateArr.damageNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataTotal.dd17 = rateArr.damageNum
                    }
                    if(rateArr.dd == 18 && rateArr.totalNum != 0){
                      lateRate.push((rateArr.delayNum/rateArr.totalNum * 100).toFixed(3))
                      damaRate.push((rateArr.damageNum/rateArr.totalNum * 100).toFixed(3))
                      that.dataLate.dd18 = (rateArr.delayNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataBreak.dd18 = (rateArr.damageNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataTotal.dd18 = rateArr.damageNum
                    }
                    if(rateArr.dd == 19 && rateArr.totalNum != 0){
                      lateRate.push((rateArr.delayNum/rateArr.totalNum * 100).toFixed(3))
                      damaRate.push((rateArr.damageNum/rateArr.totalNum * 100).toFixed(3))
                      that.dataLate.dd19 = (rateArr.delayNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataBreak.dd19 = (rateArr.damageNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataTotal.dd19 = rateArr.damageNum
                    }
                    if(rateArr.dd == 20 && rateArr.totalNum != 0){
                      lateRate.push((rateArr.delayNum/rateArr.totalNum * 100).toFixed(3))
                      damaRate.push((rateArr.damageNum/rateArr.totalNum * 100).toFixed(3))
                      that.dataLate.dd20 = (rateArr.delayNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataBreak.dd20 = (rateArr.damageNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataTotal.dd20 = rateArr.damageNum
                    }
                    if(rateArr.dd == 21 && rateArr.totalNum != 0){
                      lateRate.push((rateArr.delayNum/rateArr.totalNum * 100).toFixed(3))
                      damaRate.push((rateArr.damageNum/rateArr.totalNum * 100).toFixed(3))
                      that.dataLate.dd21 = (rateArr.delayNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataBreak.dd21 = (rateArr.damageNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataTotal.dd21 = rateArr.damageNum
                    }
                    if(rateArr.dd == 22 && rateArr.totalNum != 0){
                      lateRate.push((rateArr.delayNum/rateArr.totalNum * 100).toFixed(3))
                      damaRate.push((rateArr.damageNum/rateArr.totalNum * 100).toFixed(3))
                      that.dataLate.dd22 = (rateArr.delayNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataBreak.dd22 = (rateArr.damageNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataTotal.dd22 = rateArr.damageNum
                    }
                    if(rateArr.dd == 23 && rateArr.totalNum != 0){
                      lateRate.push((rateArr.delayNum/rateArr.totalNum * 100).toFixed(3))
                      damaRate.push((rateArr.damageNum/rateArr.totalNum * 100).toFixed(3))
                      that.dataLate.dd23 = (rateArr.delayNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataBreak.dd23 = (rateArr.damageNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataTotal.dd23 = rateArr.damageNum
                    }
                    if(rateArr.dd == 24 && rateArr.totalNum != 0){
                      lateRate.push((rateArr.delayNum/rateArr.totalNum * 100).toFixed(3))
                      damaRate.push((rateArr.damageNum/rateArr.totalNum * 100).toFixed(3))
                      that.dataLate.dd24 = (rateArr.delayNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataBreak.dd24 = (rateArr.damageNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataTotal.dd24 = rateArr.damageNum
                    }
                    if(rateArr.dd == 25 && rateArr.totalNum != 0){
                      lateRate.push((rateArr.delayNum/rateArr.totalNum * 100).toFixed(3))
                      damaRate.push((rateArr.damageNum/rateArr.totalNum * 100).toFixed(3))
                      that.dataLate.dd25 = (rateArr.delayNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataBreak.dd25 = (rateArr.damageNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataTotal.dd25 = rateArr.damageNum
                    }
                    if(rateArr.dd == 26 && rateArr.totalNum != 0){
                      lateRate.push((rateArr.delayNum/rateArr.totalNum * 100).toFixed(3))
                      damaRate.push((rateArr.damageNum/rateArr.totalNum * 100).toFixed(3))
                      that.dataLate.dd26 = (rateArr.delayNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataBreak.dd26 = (rateArr.damageNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataTotal.dd26 = rateArr.damageNum
                    }
                    if(rateArr.dd == 27 && rateArr.totalNum != 0){
                      lateRate.push((rateArr.delayNum/rateArr.totalNum * 100).toFixed(3))
                      damaRate.push((rateArr.damageNum/rateArr.totalNum * 100).toFixed(3))
                      that.dataLate.dd27 = (rateArr.delayNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataBreak.dd27 = (rateArr.damageNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataTotal.dd27 = rateArr.damageNum
                    }
                     if(rateArr.dd == 28 && rateArr.totalNum != 0){
                      lateRate.push((rateArr.delayNum/rateArr.totalNum * 100).toFixed(3))
                      damaRate.push((rateArr.damageNum/rateArr.totalNum * 100).toFixed(3))
                      that.dataLate.dd28 = (rateArr.delayNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataBreak.dd28 = (rateArr.damageNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataTotal.dd28 = rateArr.damageNum
                    }
                    if(rateArr.dd == 29 && rateArr.totalNum != 0){
                      lateRate.push((rateArr.delayNum/rateArr.totalNum * 100).toFixed(3))
                      damaRate.push((rateArr.damageNum/rateArr.totalNum * 100).toFixed(3))
                      that.dataLate.dd29 = (rateArr.delayNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataBreak.dd29 = (rateArr.damageNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataTotal.dd29 = rateArr.damageNum
                    }
                    if(rateArr.dd == 30 && rateArr.totalNum != 0){
                      lateRate.push((rateArr.delayNum/rateArr.totalNum * 100).toFixed(3))
                      damaRate.push((rateArr.damageNum/rateArr.totalNum * 100).toFixed(3))
                      that.dataLate.dd030 = (rateArr.delayNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataBreak.dd30 = (rateArr.damageNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataTotal.dd30 = rateArr.damageNum
                    }
                    if(rateArr.dd == 31 && rateArr.totalNum != 0){
                      lateRate.push((rateArr.delayNum/rateArr.totalNum * 100).toFixed(3))
                      damaRate.push((rateArr.damageNum/rateArr.totalNum * 100).toFixed(3))
                      that.dataLate.dd31 = (rateArr.delayNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataBreak.dd31 = (rateArr.damageNum/rateArr.totalNum * 100).toFixed(3)
                      that.dataTotal.dd31 = rateArr.damageNum
                    }   
                  }
                  this.maxD = parseFloat((Math.max(...damaRate)).toFixed(3))
                  this.maxL = parseFloat((Math.max(...lateRate)).toFixed(3))
                  let dama = Math.max(...damaArr)
                  let late = Math.max(...lateArr)
                  this.max = parseFloat((Math.max(this.maxD,this.maxL)/4 + 0.001).toFixed(3))
                  this.vM = Math.round(dama/4) + 1
                    that.updateOption()
                }
                } else {
                this.restoreKpi()
                }
            }).catch(() => {
                this.restoreKpi()
        })
      },
      restore () {
          this.data = {
            mm01: 0,
            mm02: 0,
            mm03: 0,
            mm04: 0,
            mm05: 0,
            mm06: 0,
            mm07: 0,
            mm08: 0,
            mm09: 0,
            mm10: 0,
            mm11: 0,
            mm12: 0
          }
      },
      restoreM () {
          this.maxMounth = ''
      },
      restoreR () {
          this.updateRate = '--' + '%'
      },
      restoreKpi () {
          //迟运率
          this.dataLate = {
            dd01: '0.000',
            dd02: '0.000',
            dd03: '0.000',
            dd04: '0.000',
            dd05: '0.000',
            dd06: '0.000',
            dd07: '0.000',
            dd08: '0.000',
            dd09: '0.000',
            dd10: '0.000',
            dd11: '0.000',
            dd12: '0.000',
            dd13: '0.000',
            dd14: '0.000',
            dd15: '0.000',
            dd16: '0.000',
            dd17: '0.000',
            dd18: '0.000',
            dd19: '0.000',
            dd20: '0.000',
            dd21: '0.000',
            dd22: '0.000',
            dd23: '0.000',
            dd23: '0.000',
            dd24: '0.000',
            dd25: '0.000',
            dd26: '0.000',
            dd27: '0.000',
            dd28: '0.000',
            dd29: '0.000',
            dd30: '0.000',
            dd31: '0.000',
          },
          //破损率
          this.dataBreak = {
            dd01: '0.000',
            dd02: '0.000',
            dd03: '0.000',
            dd04: '0.000',
            dd05: '0.000',
            dd06: '0.000',
            dd07: '0.000',
            dd08: '0.000',
            dd09: '0.000',
            dd10: '0.000',
            dd11: '0.000',
            dd12: '0.000',
            dd13: '0.000',
            dd14: '0.000',
            dd15: '0.000',
            dd16: '0.000',
            dd17: '0.000',
            dd18: '0.000',
            dd19: '0.000',
            dd20: '0.000',
            dd21: '0.000',
            dd22: '0.000',
            dd23: '0.000',
            dd23: '0.000',
            dd24: '0.000',
            dd25: '0.000',
            dd26: '0.000',
            dd27: '0.000',
            dd28: '0.000',
            dd29: '0.000',
            dd30: '0.000',
            dd31: '0.000',
          },
          //破损数量
          this.dataTotal = {
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
          height:this.el.clientHeight * 0.49,
          width: this.el.clientWidth * 0.45 
        }
        let simalOpt2 = {
          height:this.el.clientHeight * 0.27,
          width: this.el.clientWidth * 0.17
        }
        let kpiOpts2 = {
          height: this.el.clientHeight * 0.42,
          width: this.el.clientWidth * 0.95
        }
        this.lugYearCircle.resize(outOpts2)
        this.lugMouth.resize(simalOpt2)
        this.lugUp.resize(simalOpt2)
        this.lugKpi.resize(kpiOpts2)
        this.updateOption()
        // this.lugUp.resize(simalOpt2)
      },
      updateOption () {
          //饼图options
          let lugCoptions = {
            tooltip: {
            trigger: 'item',
            confine: true,
            extraCssText:
                `background-color: rgba(1, 22, 38, 0.8);
                border: 1px solid rgba(60, 166, 200, 0.7);
                box-shadow:0px 10px 20px 0px rgba(0, 0, 0, 0.4);
                border-radius:8px;`
            },
            calculable:false,
            series: [
            {
                name: '',
                type: 'pie',
                radius : [16, 47],
                center : ['40%', '55%'],
                 roseType : 'radius',
                avoidLabelOverlap: true,
                label: {
                 normal: {
                    show: true,
                    color: '#fff',
                     fontSize:14,
                     formatter: function(data) { 
                        let b = data.name;
                        let c = data.value;
                          return b + ' {img|}' + c + '%'
                    } ,
                      rich : {
                        //这里设置您的图片引用名称
                        img : {
                        //引入图片
                          backgroundColor : {
                            image : require('@icon/mercy_triangle.png'),
                          },
                           height: 10,
                           width: 10,
                           align: 'center',
                        },
                      },
									position : 'right',
									show : true,
                 },
                //  }
                },
                data: [
                {value: this.data.mm01, name: '1月', itemStyle: {color: 'rgba(40, 112, 212, 1)'}},
                {value: this.data.mm02, name: '2月', itemStyle: {color: 'rgba(121, 0, 250, 1)'}},
                {value: this.data.mm03, name: '3月', itemStyle: {color: 'rgba(99, 108, 242, 1)'}},
                {value: this.data.mm04, name: '4月', itemStyle: {color: 'rgba(35, 139, 251, 1'}},
                {value: this.data.mm05, name: '5月', itemStyle: {color: 'rgba(105, 165, 255, 1)'}},
                {value: this.data.mm06, name: '6月', itemStyle: {color: 'rgba(142, 199, 251, 1)'}},
                {value: this.data.mm07, name: '7月', itemStyle: {color: 'rgba(142, 199, 251, 1)'}},
                {value: this.data.mm08, name: '8月', itemStyle: {color: 'rgba(51, 197, 253, 1)'}},
                {value: this.data.mm09, name: '9月', itemStyle: {color: 'rgb(75, 187, 253)'}},
                {value: this.data.mm10, name: '10月', itemStyle: {color: 'rgb(134, 248, 251)'}},
                {value: this.data.mm11, name: '11月', itemStyle: {color: 'rgb(207, 252, 246)'}},
                {value: this.data.mm12, name: '12月', itemStyle: {color: 'rgb(56, 157, 194)'}}
                ]
            },
            ]
          }
          //高峰期仪表盘options
          let mouthOptions = {
              series: [
                    {
                      name: '',
                      type: 'gauge',
                      radius: '100%',
                      // 仪表盘轴线(轮廓线)相关配置。
                    startAngle: 180,
                    endAngle: -179.9,
                      axisLine: {
                          show: true,
                          lineStyle: {
                              width: 6,
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
                },
                 {
                    type: 'gauge',
                    radius: '85%',
                    startAngle: 180,
                    endAngle: -179,
                    splitNumber: 12,
                    // 仪表盘轴线(轮廓线)相关配置。
                    axisLine: {
                        show: false,

                    },
                    // 分隔线样式。
                    splitLine: {
                    show: true,
                    // interval: 100,
                    length: 8,
                    lineStyle: {
                        color: 'rgba(127, 187, 255, 0.5)',
                        width: 1.5
                    }
                    },
                    // 刻度样式。
                    axisTick: {
                    show: false,
                    lineStyle: {
                        color: 'rgba(127, 187, 255, 0.5)',
                        width: 1.5
                    }
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
                        length: '5%',
                        width: 0
                    },
                    itemStyle: {
                    color: '#3DA6CC'
                    },
                    // data: [{
                    //     value: 0
                    // }],
                    detail: {
                    show: false
                    }
                },
                 {
                    type: 'gauge',
                    radius: '85%',
                    startAngle: this.muAge + 3,
                    endAngle:  this.muAge - 3,
                    splitNumber: 1,
                    // 仪表盘轴线(轮廓线)相关配置。
                    axisLine: {
                        show: true,
                        lineStyle: {
                            width: 6,
                          color: [
                            [1,new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                              {
                                offset: 0.1,
                                color: "#30B5EC"
                              },
                              // {
                              //   offset: 0.6,
                              //   color: "#30D27C"
                              // },
                              {
                                offset: 1,
                                color: "#43A5FB"
                              }
                            ])
                          ]
                        ]
                        }
                    },
                    // 分隔线样式。
                    splitLine: {
                    show: false,
                    },
                    // 刻度样式。
                    axisTick: {
                    show: false,
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
                        length: '5%',
                        width: 0
                    },
                    itemStyle: {
                    color: '#43A5FB'
                    },
                    // data: [{
                    //     value: 0
                    // }],
                    detail: {
                    show: false
                    }
                 }
              ]
          }
          this.lugMouth.setOption(mouthOptions,true)
          //总量同比仪表盘
          let updateOptions = {
              series: [
                    {
                      name: '',
                      type: 'gauge',
                      radius : '100%',
                      startAngle: 90,
                      endAngle: this.age,
                      axisLine: {
                          show: true,
                          lineStyle: {
                              width: 6,
                            color: [
                              [1,new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                {
                                  offset: 0.1,
                                  color: "#34C8FF"
                                },
                                // {
                                //   offset: 0.6,
                                //   color: "#30D27C"
                                // },
                                {
                                  offset: 1,
                                  color: "#696BFF"
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
                      radius: '100%',
                      // 仪表盘轴线(轮廓线)相关配置。
                    startAngle: 90,
                    endAngle: -269.9,
                      axisLine: {
                          show: true,
                          lineStyle: {
                              width: 6,
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
          this.lugUp.setOption(updateOptions,true)
          //折线图options
          let kpiOptions = {
                title: {
                  text: `2019年${this.maxMounth}月破损率、迟运率分布`,
                  top: 0,
                  left: 20,
                  // bottom:10,
                  textStyle : {
                    color: '#FFFFFF',
                    fontSize: 14,
                    fontWeight: 'bolder',
                    fontFamily: 'PingFang SC',
                    padding: [30]
                  }
                },
            legend: {
                align: 'auto',
                inactiveColor: 'rgba(122, 147, 158, 0.6)',
                itemGap: 20,
                top: 0,
                right: 50,
                textStyle: {
                    color: 'rgba(199, 235, 255, 0.6)',
                    fontSize: 0, // this.fontSizeRs,
                    fontFamily: `'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif`
                },
                data: [
                  {name:'破损率',icon:'roundRect'},
                  {name:'迟运率',icon:'roundRect'},
                  {name:'破损数量',icon:'circle'}
                 ],
                // icon:'roundRect,',
                itemHeight:7,
                itemWidth:15,
            },
            grid: {
                left: '2%',
                right: 50,
                top: 48,
                bottom: 0,
                containLabel: true
            },
            tooltip: {
            trigger: 'axis',
            confine: true,
            formatter: function (params) {
            var res='<div><p>'+params[0].name+'号</p></div>' 
            for(var i=0;i<params.length;i++){
              let name = '%'
              if(params[i].seriesName === '破损率' || params[i].seriesName === '迟运率') {
                name = '%'
              } else {
                name = '/件'
              }
            res+='<p>'+params[i].marker+params[i].seriesName+':'+params[i].data+name+'</p>'
            }
            return res;
            },
            extraCssText:
                `background-color: rgba(1, 22, 38, 0.8);
                box-shadow:0px 10px 20px 0px rgba(0, 0, 0, 0.4);
                border-radius:8px;`,
            axisPointer: {
                lineStyle: {
                color: 'rgba(60,166,200,0.7)'
                }
            }
            },
            xAxis: [
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
                    data: ['1', '2','3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22' ,'23', '24','25', '26', '27', '28', '29', '30', '31']
                }
            ],
            yAxis: [//定义y轴
                {
                    type: 'value',
                    name: '',
                    //双y轴刻度对称
                    max: this.max * 4,
                    min: 0,
                    interval : this.max,
                    // minInterval  :this.max,
                    splitNumber: 4,
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
                    axisLabel: {//坐标轴刻度标签的相关设置。
                        show: true,
                        color: "rgba(199, 235, 255, 0.6)",
                        fontSize: '14',
                        interval: 0,
                    },
                    max: this.vM * 4,
                    min: function(value) {
                        return 0
                    },
                    interval : this.vM,
                    // minInterval: Math.ceil(this.maxD/5),
                    splitNumber: 5,
                    axisLine: {//坐标轴颜色
                        show:false,
                        lineStyle: {//坐标轴颜色
                            color: "rgba(199, 235, 255, 0.6)",
                        },
                    },
                    splitLine :{
                                lineStyle: {
                                  color: 'rgba(255, 255, 255, 0.11)'
                                }
                     },
                },
            ],
            series: [
                {
                    id: 'avg',
                    name: '破损率',
                    type: 'line',
                    data:  [this.dataBreak.dd01, this.dataBreak.dd02, this.dataBreak.dd03, this.dataBreak.dd04,this.dataBreak.dd05, this.dataBreak.dd06, this.dataBreak.dd07, this.dataBreak.dd08, this.dataBreak.dd09, this.dataBreak.dd10, this.dataBreak.dd11, this.dataBreak.dd12, this.dataBreak.dd13, this.dataBreak.dd14, this.dataBreak.dd15, this.dataBreak.dd16,this.dataBreak.dd17,this.dataBreak.dd18,this.dataBreak.dd19,this.dataBreak.dd20,this.dataBreak.dd21,this.dataBreak.dd22,this.dataBreak.dd23, this.dataBreak.dd24, this.dataBreak.dd25, this.dataBreak.dd26, this.dataBreak.dd27, this.dataBreak.dd28, this.dataBreak.dd29, this.dataBreak.dd30, this.dataBreak.dd31],
                    symbol: 'circle',
                    symbolSize: 1,
                    smooth: true,
                    connectNulls: false,
                    // encode: {
                    // x: 'day',
                    // y: 'avg'
                    // },
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
                    lineStyle: {
                    opacity: 0
                    },
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
                     yAxisIndex: 0,
                },
                {
                    id: 'emp',
                    name: '迟运率',
                    type: 'line',
                    symbol: 'circle',
                    symbolSize: 1,
                    smooth: true,
                    connectNulls: false,
                    itemStyle: {
                    normal: {
                        color: 'rgba(247, 193, 48, 1)',
                        borderColor: 'rgba(247, 193, 48, 1)',
                        borderWidth: 1,
                        lineStyle:{  
                              color:'rgba(247, 193, 48, 1)'  
                       } 
                    }
                    },
                    lineStyle: {
                    opacity: 0
                    },
                    data:  [this.dataLate.dd01, this.dataLate.dd02, this.dataLate.dd03, this.dataLate.dd04,this.dataLate.dd05, this.dataLate.dd06, this.dataLate.dd07, this.dataLate.dd08, this.dataLate.dd09, this.dataLate.dd10, this.dataLate.dd11, this.dataLate.dd12, this.dataLate.dd13, this.dataLate.dd14, this.dataLate.dd15, this.dataLate.dd16,this.dataLate.dd17,this.dataLate.dd18,this.dataLate.dd19,this.dataLate.dd20,this.dataLate.dd21,this.dataLate.dd22,this.dataLate.dd23, this.dataLate.dd24, this.dataLate.dd25, this.dataLate.dd26, this.dataLate.dd27, this.dataLate.dd28, this.dataLate.dd29, this.dataLate.dd30, this.dataLate.dd31],
                    areaStyle: {
                    normal: {
                        color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: 'rgba(247, 193, 48, 0.5)'
                        }, {
                            offset: 0.5, color: 'rgba(243, 208, 112, 0.5)'
                        }, {
                            offset: 1, color: 'rgba(245, 231, 195, 0)'
                        }]
                        },

                    }
                    },
                     yAxisIndex: 0,
                },
                {
                    name:'破损数量',
                    type:'bar',
                    data:  [this.dataTotal.dd01, this.dataTotal.dd02, this.dataTotal.dd03, this.dataTotal.dd04,this.dataTotal.dd05, this.dataTotal.dd06, this.dataTotal.dd07, this.dataTotal.dd08, this.dataTotal.dd09, this.dataTotal.dd10, this.dataTotal.dd11, this.dataTotal.dd12, this.dataTotal.dd13, this.dataTotal.dd14, this.dataTotal.dd15, this.dataTotal.dd16,this.dataTotal.dd17,this.dataTotal.dd18,this.dataTotal.dd19,this.dataTotal.dd20,this.dataTotal.dd21,this.dataTotal.dd22,this.dataTotal.dd23, this.dataTotal.dd24, this.dataTotal.dd25, this.dataTotal.dd26, this.dataTotal.dd27, this.dataTotal.dd28, this.dataTotal.dd29, this.dataTotal.dd30, this.dataTotal.dd31],
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
                    xAxisIndex: 0,
                    yAxisIndex: 1,
                },
            ]
          }
        this.lugYearCircle.setOption(lugCoptions, true)
        this.lugKpi.setOption(kpiOptions,true)
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
        this.updateDataMounth()
        this.updateDataMRate()
        this.updateDataLug()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
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
  margin-right: 8%;
}
.outYear>.header>img:last-child{
  margin-left: 8%;
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
.circle > .gauge {
  height: 100%;
  display: flex;
  justify-content: center;
}
.circle >.label{
    font-size:14px;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(199,235,255,1);
    opacity:0.6;
    width:125px
}

.circle>.circle{
  margin-top: 10%;
  position: relative;
}
.outYear>.body>div:first-child {
  display: flex;
  height: calc(50% - 50% / 570 * 60);
}
.body-top>div:first-child {
  margin-top: 20px;
  width:60%;
  display: flex;
  justify-content: center;
  overflow: hidden;
}
.body-top>div:last-child{
   width:40%;
   position:absolute;
   right:5%
}
.body-top>div>.circle:first-child{
    margin-right: 70px
}
.outYear>.leveLugCircle{
  height: 100%;

}
.circle>.text{
      position: absolute;
      height: 50%;
      width: 50%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 0.38rem;
      font-family: 'DINPRO-MEDIUM';
      color:rgba(255,255,255,1);
        .label{
            position: relative;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: rgba(199, 235, 255, 0.6);
            text-align: left;
        }
      img{
        position: absolute;
        top: 35%;
        left: -16%;
      }
      .numberR {
        margin-left: 10px;
        height: 17px;
        line-height: 17px;
        font-size:0.38rem;
        font-family: 'DINPRO-MEDIUM';
        color:rgba(255,255,255,1);
      }
}
</style>