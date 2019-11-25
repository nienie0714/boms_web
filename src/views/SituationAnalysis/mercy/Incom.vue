<template>
    <div class="incomFlit ceshi-block">
       <div class="header">
          <div class="header-title">进港航班动态分析</div>
          <div class="tabsI echartsTab">
              <tabs :tabsData="tabsData" @tabItemClick="tabItemClick"></tabs>
          </div>
      </div> 
      <div class="body">
        <div class="body-topI">
            <div>
                <div class="body inComCircle">
                    <!-- <div class="flitCircle" id="inComCircle"></div> -->
                    <div class="text">
                        <div class="label">进港航班总数</div>
                        <div class="num-st font-white">{{data.totalFlight}}</div>
                    </div>
                </div>
            </div>
            <div>
              <div class="prograss-top">
                <div class="device-row">
                  <div class="device-row-con">
                    <div class="left">
                      <div class="state-icon plan"></div>
                      <div class="label font-rs">计划进港</div>
                      <div class="number num-rd">{{data.planFlight}}</div>
                    </div>
                    <div class="right">
                        <div class="state-icon has"></div>
                        <div class="label font-rs">已进港</div>
                        <div class="number num-rd">{{data.arrFlight}}</div>
                    </div>
                  </div>
                  <div class="device-percent">
                      <div class="percent-planIn" :style="{width: planEnterPercent}"></div>
                      <!-- <div class="percent-normal" :style="{width: pEnterPercent}"></div> -->
                  </div>
                  <div class="device-percent">
                      <div class="percent-hasIn" :style="{width: hasEnterPercent}"></div>
                      <!-- <div class="percent-normal" :style="{width: pEnterPercent}"></div> -->
                  </div>
                </div>
              </div>
              <div class="prograss-bottom">
                <div class="device-row">
                  <div class="device-row-con">
                    <div class="left">
                        <div class="label font-rs">国内进港</div>
                        <div class="number num-rd">{{data.domesticFlight}}</div>
                    </div>
                    <div class="right">
                        <div class="label font-rs">国际进港</div>
                        <div class="number num-rd">{{data.intlFlight}}</div>
                    </div>                    
                  </div>

                  <div class="device-percent">
                      <div class="percent-inland" :style="{width: nEnterPercent}"></div>
                      <div class="percent-internation" :style="{width: dEnterPercent}"></div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
      <div class="body">
        <div class="body-bottom">
          <div id="kpiTable" class="kpiTable">

          </div>
        </div>
      </div>
    </div>
</template>
<script>
import { queryAll, update ,remove} from '@/util/base'
import echarts from 'echarts'
import Tabs from './Tabs/Tabs'

export default {
  components: {
    Tabs
  },
  computed: {
    //进度条style
    hasEnterPercent: function () {
      if(this.data.arrFlight > this.data.planFlight){
        return ( 100 ) + '%'
      } else {
      // if(this.data.arrFlight <= this.data.planFlight){
        return (this.data.arrFlight/(this.data.planFlight) * 100 ) + '%'
      // }
      }
    },
    planEnterPercent: function () {
      if(this.data.arrFlight < this.data.planFlight){
        return ( 100 ) + '%'
      } else {
      // if(this.data.arrFlight >= this.data.planFlight){
        return (this.data.planFlight/(this.data.arrFlight) * 100 ) + '%'
      // }
      }
    },
    nEnterPercent: function () {
      return(this.data.domesticFlight/(this.data.domesticFlight+this.data.intlFlight) * 100 - 1) + '%'
    },
    dEnterPercent: function () {
      return(this.data.intlFlight/(this.data.domesticFlight+this.data.intlFlight) * 100 ) + '%'
    }
  },
  props: ['resize', 'refrush'],
  data () {
      return {
          inComCircleEl: null,
          inComCircle: null,
          kpiTable: null,
          kpiTableEl: null,
          percent: null,
          el: null,
          //航班总量数据
          queryUrl: '/kpi/dynamic/queryDynamicFlightA',
          //折线图数据接口
          queryFltUrl: '/kpi/dynamic/queryFlightPlanOrRealA',
          selectKey: '210',
          tabsData: [
            {
            key: '210',
            label: '地勤',
            icon: 'mercy_diq'
            },
            {
            key: '212',
            label: '海航',
            icon: 'mercy_hai'
            },
            {
            key: '211',
            label: '东航',
            icon: 'mercy_est'
            }
          ],
          data: {
            totalFlight: '--',
            domesticFlight: '--' ,
            planFlight: '--' ,
            intlFlight: '--' ,
            arrFlight: '--' ,
          },
          //计划进港
          dataFltP: {
            hour05:'',
            hour06:'',
            hour07:'',
            hour08:'',
            hour09:'',
            hour10:'',
            hour11:'',
            hour12:'',
            hour13:'',
            hour14:'',
            hour15:'',
            hour16:'',
            hour17:'',
            hour18:'',
            hour19:'',
            hour20:'',
            hour21:'',
            hour22:'',
            hour23:'',
            hour00:'',
            hour01:'',
            hour02:'',
            hour03:'',
            hour04:'',
            },
            //已进港
          dataFltR: {
            hour00:'',
            hour01:'',
            hour02:'',
            hour03:'',
            hour04:'',
            hour05:'',
            hour06:'',
            hour07:'',
            hour08:'',
            hour09:'',
            hour10:'',
            hour11:'',
            hour12:'',
            hour13:'',
            hour14:'',
            hour15:'',
            hour16:'',
            hour17:'',
            hour18:'',
            hour19:'',
            hour20:'',
            hour21:'',
            hour22:'',
            hour23:'',
            },
          breakRate:null,
      }
  },
    created(){
        this.selectKey = '210'
    },
  mounted () {
      this.kpiTableEl = document.getElementById('kpiTable')
      this.kpiTable = this.$echarts.init(this.kpiTableEl)
      this.percent = document.getElementsByClassName('prograss-top')[0]
      //模块元素宽高
      this.el = document.getElementsByClassName('incomFlit')[0]
      this.updateOption()
      this.$nextTick(() => {
        let kpiOpts = {
          height: this.el.clientHeight * 0.41,
          width: this.el.clientWidth * 0.95
        }
        this.kpiTable.resize(kpiOpts)
      })
      this.breakRate = '56.9%'
  },
  methods: {
    //获取航班总数
      updateData () {
        let that = this
        // debugger
        queryAll(this.queryUrl).then(res => {
            if (res.data.code == 0) {
                if (JSON.stringify(res.data.data) == '{}') {
                    this.restore()
                } else {
                  let arr = res.data.data
                  for(var i = 0; i < arr.length; i++){
                    let fltArr = arr[i]
                    if(that.selectKey == fltArr.agency){
                      this.$set(this, 'data', fltArr)
                      // that.data = fltArr
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
      //获取折线图数据
      updateDataFlt(){
        let that = this
        queryAll(this.queryFltUrl).then(res => {
            if (res.data.code == 0) {
                if (JSON.stringify(res.data.data) == '{}') {
                    this.restore()
                } else {
                  let arr = res.data.data
                  for(var i = 0; i<arr.length; i++){
                    let fltArr = arr[i]
                    if(that.selectKey == fltArr.agency) {
                        if(fltArr.dataType == 'PLAN'){
                          that.dataFltP = fltArr
                        }else{
                          that.dataFltR = fltArr
                        }
                    }
                  }
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
              totalFlight: '--',
              domesticFlight: '--' ,
              planFlight: '--' ,
              intlFlight: '--' ,
              arrFlight: '--' ,
          }
      },
      restoreKpi () {
          this.dataFltP = {
            hour05:'',
            hour06:'',
            hour07:'',
            hour08:'',
            hour09:'',
            hour10:'',
            hour11:'',
            hour12:'',
            hour13:'',
            hour14:'',
            hour15:'',
            hour16:'',
            hour17:'',
            hour18:'',
            hour19:'',
            hour20:'',
            hour21:'',
            hour22:'',
            hour23:'',
            hour00:'',
            hour01:'',
            hour02:'',
            hour03:'',
            hour04:'',
            },
            //已进港
          this.dataFltR = {
            hour00:'',
            hour01:'',
            hour02:'',
            hour03:'',
            hour04:'',
            hour05:'',
            hour06:'',
            hour07:'',
            hour08:'',
            hour09:'',
            hour10:'',
            hour11:'',
            hour12:'',
            hour13:'',
            hour14:'',
            hour15:'',
            hour16:'',
            hour17:'',
            hour18:'',
            hour19:'',
            hour20:'',
            hour21:'',
            hour22:'',
            hour23:'',
            }
      },
      //图表大小适应屏幕宽高
      resizeMeth () {
        let kpiOpts2 = {
          height: this.el.clientHeight * 0.41,
          width: this.el.clientWidth * 0.95
        }
        this.kpiTable.resize(kpiOpts2)
        this.updateOption()
      },
      updateOption () {
        let height = 200
        //图表option
        let kpiOptions = {
                    title: {
                      text: '进港航班分布',
                      top: 0,
                      left: 20,
                      bottom:5,
                      textStyle : {
                        color: '#FFFFFF',
                        fontSize: 14,
                        fontWeight: 'bolder',
                        fontFamily: 'PingFang SC',
                        padding: [30]
                      }
                    },
                    tooltip: {
                    trigger: 'axis',
                    confine: true,
                    formatter: function (params) {
                    var res='<div><p>'+params[0].name+':00</p></div>' 
                    for(var i=0;i<params.length;i++){
                      let color = 'background: linear-gradient(to bottom, rgb(232, 132, 22), rgb(242, 247, 109));'
                      if (params[i].seriesName === '实际进港航班') {
                        color = 'background: linear-gradient(to bottom, rgb(232, 132, 22), rgb(242, 247, 109));'
                      }
                      if (params[i].seriesName === '计划进港航班') {
                        color = 'background: linear-gradient(to bottom, rgb(79, 77, 185), rgb(102, 214, 211));'
                      }
                    res+='<p>'+params[i].marker.replace('background-color:[object Object];', color)+params[i].seriesName+':'+params[i].data+'</p>'
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
                        // show:true,
                        // selectedMode:'single',    //设置显示单一图例的图形，点击可切换
                        top: 20,
                        right: 10,
                        data: ['计划进港航班', '已进港航班'],
                        textStyle: {
                            color: "rgba(199, 235, 255, 0.6)",
                        },
                        icon:'roundRect',
                        itemHeight:5,
                        itemWidth:20,
                    },
                    grid: {//定义折线图距离左边多少右边多少上边多少的距离
                        left: '2%',
                        right: 10,
                        bottom: 0,
                        top: 50,
                        containLabel: true //grid 区域是否包含坐标轴的刻度标签。如果不写true，那么纵坐标的位置就不会算进上面设置的坐边右边上边下边里面去
                    },
                    xAxis: [//定义X轴
                        {
                            type: 'category',//设置X轴的类型
                            name: '',
                            nameTextStyle: {
                              color: 'rgba(183, 228, 252, 0.5)'
                            },
                            axisLabel: {//坐标轴刻度标签的相关设置。
                                color: "rgba(183, 228, 252, 0.5)",//设置颜色
                                fontSize: '12',//字体大小
                                interval: 1,//设置每个相邻之间少1个数
                                rotate: 0,//刻度标签旋转的角度
                            },
                            axisLine: {//坐标轴颜色
                                lineStyle: {//坐标轴颜色
                                    color: "rgba(255, 255, 255, 0.11)",
                                },
                            },
                            data: ['5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22' ,'23', '0', '1', '2', '3', '4']//数据源
                        }
                    ],
                    yAxis: [//定义y轴
                        {
                            type: 'value',
                            name: '/架次',
                            nameTextStyle: {
                              color: 'rgba(183, 228, 252, 0.5)'
                            },
                            splitNumber :4,
                            axisLabel: {//坐标轴刻度标签的相关设置。
                                color: "rgba(183, 228, 252, 0.5)",
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
                                color: 'rgba(255, 255, 255, 0.11)'
                              }
                              },
                        },
                    ],
                    series: [//系列列表。每个系列通过 type 决定自己的图表类型
                        {
                            name: '计划进港航班',//数据项名称。如果不写这个那么上面的2排里面就会少一个
                            type: 'line',//设置为折线图
                            smooth:true,
                            data: [this.dataFltP.hour05, this.dataFltP.hour06, this.dataFltP.hour07, this.dataFltP.hour08, this.dataFltP.hour09, this.dataFltP.hour10, this.dataFltP.hour11, this.dataFltP.hour12, this.dataFltP.hour13, this.dataFltP.hour14, this.dataFltP.hour15, this.dataFltP.hour16,this.dataFltP.hour17,this.dataFltP.hour18,this.dataFltP.hour19,this.dataFltP.hour20,this.dataFltP.hour21,this.dataFltP.hour22,this.dataFltP.hour23, this.dataFltP.hour00, this.dataFltP.hour01, this.dataFltP.hour02, this.dataFltP.hour03, this.dataFltP.hour04],
                            showAllSymbol: true,//示折线图上所有小标签
                            symbolSize: 1,//标记的大小
                            symbol: 'circle',
                            itemStyle: {
                                normal: {
                                    color: '#3f99ff',
                                    borderColor: '#3f99ff',
                                    borderWidth: 1,
                                    lineStyle:{  
                                            color:'#3f99ff'  
                                        }
                                }
                            },
                        },
                        {
                            name: '已进港航班',
                            type: 'line',
                            smooth:true,
                            data: [this.dataFltR.hour05, this.dataFltR.hour06, this.dataFltR.hour07, this.dataFltR.hour08, this.dataFltR.hour09, this.dataFltR.hour10, this.dataFltR.hour11, this.dataFltR.hour12, this.dataFltR.hour13, this.dataFltR.hour14, this.dataFltR.hour15, this.dataFltR.hour16,this.dataFltR.hour17,this.dataFltR.hour18,this.dataFltR.hour19,this.dataFltR.hour20,this.dataFltR.hour21,this.dataFltR.hour22,this.dataFltR.hour23, this.dataFltR.hour00, this.dataFltR.hour01, this.dataFltR.hour02, this.dataFltR.hour03, this.dataFltR.hour04],
                            showAllSymbol: true,//示折线图上所有小标签
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
                                    offset: 0, color: 'rgba(243, 157, 20, 0.6)'
                                }, {
                                    offset: 0.5, color: 'rgba(243, 157, 20, 0.3)'
                                }, {
                                    offset: 1, color: 'rgba(60, 166, 200, 0)'
                                }]
                                }
                            }
                            },
                            itemStyle: {
                                normal: {
                                    color: 'rgb(247,193,48)',
                                    borderColor: 'rgb(247,193,48)',
                                    borderWidth: 1,
                                    lineStyle:{  
                                            color:'rgb(247,193,48)'  
                                        }
                                }
                            },
                        }
                    ]
        }
        this.kpiTable.setOption(kpiOptions,true)
      },
      tabItemClick (key) {
          this.selectKey = key
          this.updateData()
          this.updateDataFlt()
      },
      refrushTime () {
      this.refrush = !this.refrush
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
        this.updateData ()
        this.updateDataFlt ()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$plan-1: #735FFB;
$plan-0:#33C5FD;
$has-1: #D58337;
$has-0: rgb(223, 233, 131);
$inland-1:rgb(115, 95, 251);
$inland-0:rgb(82, 152, 252);
$internation-0:rgb(9, 219, 254);
$internation-1:rgb(223, 255, 248);
.incomFlit {
  padding-top: 10px;
}
.incomFlit>.header {
  flex: 0 0 30px;
  line-height: 30px;
  width:100%;
  display: inline-block;
  // margin-bottom: calc(100% / 750 * 10);
}
.incomFlit>.header>.header-title{
  position: relative;
  // top:30%;
  text-align: left;
  color: #fff;
  font-size: 0.2rem;
  font-family:PingFang SC;
  font-weight:bold;
  height: 40%;
  width: 40%;
  display: inline-block;
  // margin-bottom:15px
}
.incomFlit>.header>.tabsI{
  float: right;
  position: relative;
  top: 0;
  right: -5%;
  width:55%;
  height:34px;
}

.incomFlit>.body:nth-last-child(2) {
  flex: 0 0 calc((100% - 40px) / 460 * 240);
  /* height: calc(100% / 275 * 215); */
  display: flex;
  flex-direction: column;
  .body-topI {
    height: 100%;
    display: flex;
    justify-content: space-between;
  }
}
// .incomFlit>.body> {
//   margin: 0 calc(100% / 800 * 20) calc(100% / 800 * 20) calc(100% / 800 * 20);
//   height: calc(100% - (100% / 570 * 60) - calc(100% / 570 * 20));
//   /* height: calc(100% / 275 * 215); */
//   display: flex;
//   flex-direction: column;

// }
// .incomFlit>.body>div {
//   box-sizing: border-box;
//   height: calc(50% + 50% / 570 * 60 - 100% / 758 * 10);
//   margin-bottom: calc(100% / 758 * 10);
// }
// .incomFlit>.body>div:first-child {
//   display: flex;
//   height: calc(50% - 50% / 570 * 20);
// }
// .body-topI>div{
//   margin-right: calc(100% / 758 * 40);
//   width: calc(50% - 50% / 570 * 20);
//   display: flex;
//   justify-content: center;
//   overflow: hidden;
// }
.body-topI>div:first-child {
  // margin-right: calc(100% / 758 * 40);
  width: 45%;
  // height: calc(50% - 50% / 570 * 10);
  display: flex;
  justify-content: center;
  overflow: hidden;
}
.body-topI>div:last-child{
  width: 40%;
  height:calc(100%);
  display: flex;
  flex-direction: column;
}

.inComCircle {
  height: calc(100%);
  width: calc(100% + 2em);
  line-height: 1.2;
  position: relative;
  background-image:  url('~@img/icon/log/earth_incomFlt.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-size: auto 100%;

}

.inComCircle>.text {
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
  font-size:14px;
  font-family:PingFang SC;
  font-weight:bold;
  color:rgba(255,255,255,1);

}
.inComCircle>.text>div:last-child {
  margin-top: 0%;
  font-size:3.4em;
  line-height: 1.2;
  font-family: 'DINPRO-MEDIUM';
  font-weight:normal;
  color:rgba(255,255,255,1);
  text-shadow:0px 0px 20px rgba(0, 0, 0, 1);
}

.prograss-top{
    height: 50%;
  .device-row{
    position: relative;
    width: 100%;
    padding: 10% 0 5%;
    .device-row-con{
      position: relative;
      display: flex;
      justify-content: space-between;
      .state-icon {
        position: absolute;
        top: 10%;
        width: 13px;
        height: 6px;
        border-radius: 3px;
    }
      .plan{
        background: -webkit-linear-gradient(left, $plan-0, $plan-1);
      }
      .has{
        background: -webkit-linear-gradient(left, $has-0 , $has-1);
      }
        .label{
          height: 16px; 
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(199, 235, 255, 0.6);
          margin-bottom: 6px;
          padding-left: 20px;
        }
        .number{
          font-size: 0.30rem;
          line-height: 35px;
          font-family: 'DINPRO-BOLD';
          // font-weight: bold;
          color: rgba(255, 254, 254, 1);
          -webkit-text-stroke: 1px #04243A;
        }
      }

.device-percent{
    position: absolute;
    width: 100%;
    top: 0.9rem;
    left:0;
    height: 6px;
    border-radius: 3px;
    overflow: hidden;
    vertical-align: top;
    .percent-bar {
      display: inline-block;
      float:left;
      height: 100%;
      min-width: 1px;
      white-space: nowrap;
    }

    .percent-planIn{
      @extend .percent-bar;
      background: -webkit-linear-gradient(left, $plan-0, $plan-1);
      margin-right: 0.5%;
    }
    .percent-hasIn{
     @extend .percent-bar;
     background: -webkit-linear-gradient(left, $has-0 , $has-1);
      margin-right: 0.5%;
      // border-radius: 3px
    }

   }
  }
}
.prograss-top>.device-row>.device-percent:last-child{
  margin-top: 0.16rem;
}
.prograss-bottom{
  height: 50%;
  .device-row{
    position: relative;
    height: 100%;
    width: 100%;
    padding: 10% 0 10%;
    .device-row-con {
      display: flex;
      justify-content: space-between;
      .label{
        height: 16px; 
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(199, 235, 255, 0.6);
        margin-bottom: 6px;
      }
      .number{
        font-size: 0.30rem;
        line-height: 0.35rem;
        font-family: 'DINPRO-BOLD';
        // font-weight: bold;
        color: rgba(255, 254, 254, 1);
        -webkit-text-stroke: 1px #04243A;
      }
    }

.device-percent{
    position: absolute;
    width: 100%;
    top: 0.8rem;
    left:0;
    height: 6px;
    border-radius: 3px;
    overflow: hidden;
    vertical-align: top;
    .percent-bar {
      display: inline-block;
      float: left;
      height: 100%;
      min-width: 1px;
      white-space: nowrap;
    }

    .percent-inland{
    @extend .percent-bar;
      background: -webkit-linear-gradient(left, $inland-0 , $inland-1);
      margin-right: 0.5%;
    }
    .percent-internation{
      @extend .percent-bar;
      float: left;
      background: -webkit-linear-gradient(left, $internation-0 , $internation-1);
      margin-right: 0.5%;
      border-radius: 0px 3px 3px 0px
    }
   }
  }
}
.device-row>.text:nth-of-type(1) {
    position: absolute;
    top:7%;
    left:7%;
}
.device-row>.text:nth-of-type(2) {
    position: absolute;
    top:7%;
    left: 70%;
    text-align: right
}

.left .label,.left .number {
  text-align: left;
}
.right .label,.right .number {
  text-align: right;
}
</style>