<template>
   <!-- 出港航班动态分析 -->
  <div class="outBound ceshi-block">
    <div class="header">
      <img :src="require('@icon/logo/outBound_titleL.png')"/>
      <div class="header-title font-st">出港航班动态分析</div>
      <img :src="require('@icon/logo/outBond_title.png')"/>
    </div>
    <div class="body">
      <div class="body-top">
        <div>
          <div class="body outBroundCricle">
            <!-- <div id="outFltCirlcle" class="flightCircle"></div> -->
            <div class="text">
                <div class="label">出港航班总数</div>
                <div class="num-st font-white">{{data.totalFlight}}</div>
            </div>
          </div>
        </div>
        <div>
          <div class="prograss-top">
            <div class="device-row">
              <div class="device-row-con">
                <div class="left">
                  <div class="label">异常</div>
                  <div class="number num-rd">{{data.abnormalFlight}}</div>
                </div>
                <div class="right">
                    <div class="label">正常</div>
                    <div class="number num-rd">{{data.normalFlight}}</div>
                </div>
              </div>
              <div class="device-percent">
                  <div class="percent-abnormal" :style="{width: aLeavePercent}"></div>
                  <div class="percent-normal" :style="{width: pLeavePercent}"></div>
              </div>
            </div>
          </div>
          <div class="prograss-bottom">
            <div class="device-row">
              <div class="device-row-con">
                <div class="left">
                  <div class="label">国内出港</div>
                  <div class="number num-rd">{{data.domesticFlight}}</div>
                </div>
                <div class="right">
                    <div class="label">国际出港</div>
                    <div class="number num-rd">{{data.intlFlight}}</div>
                </div>
              </div>
              <div class="device-percent">
                  <div class="percent-inland" :style="{width: nLeavePercent}"></div>
                  <div class="percent-internation" :style="{width: dLeavePercent}"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="body">
      <div class="body-bottom">
        <div id="outKpi" class="kpi"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { queryAll, update ,remove} from '@/util/base'
import echarts from 'echarts'
export default {
  props: ['resize', 'refrush'],
  computed: {
    aLeavePercent:function () {
      return(this.data.abnormalFlight/(this.data.abnormalFlight+this.data.normalFlight) * 100 ) + '%'
    },
    pLeavePercent: function () {
      return(this.data.normalFlight/(this.data.abnormalFlight+this.data.normalFlight) * 100 - 2) + '%'
    },
    nLeavePercent: function () {
      return(this.data.domesticFlight/(this.data.domesticFlight+this.data.intlFlight) * 100 - 2) + '%'
    },
    dLeavePercent: function () {
       return(this.data.intlFlight/(this.data.domesticFlight+this.data.intlFlight) * 100 ) + '%'
    }
  },
  data () {
    return {
      outKpi: null,
      outKpiEl: null,
      //航班动态数据接口
      queryUrl: '/kpi/dynamic/queryDynamicFlightD',
      //折线图数据接口
      queryFltUrl: '/kpi/dynamic/queryFlightPlanOrRealD',
      percent: null,
      el: null,
      data: {
        abnormalFlight : '--',
        normalFlight: '--',
        domesticFlight: '--',
        intlFlight: '--',
        totalFlight:'--'
      },
        //计划出港
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
        //计划出港
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
      openRate: null,
      fontSizeTh: null,
    }
  },
  mounted () {
    this.outKpiEl = document.getElementById('outKpi')
    this.outKpi = this.$echarts.init(this.outKpiEl)
    this.percent = document.getElementsByClassName('prograss-top')[0]
    //模块宽高
    this.el = document.getElementsByClassName('ceshi-block')[0]
    this.updateOption()
    this.$nextTick(() => {
        let kpiOpts = {
          height: this.el.clientHeight * 0.42,
          width: this.el.clientWidth * 0.95
        }
        this.outKpi.resize(kpiOpts)
        this.updateOption()
    }) 
    this.fontSizeTh = this.percent.clientHeight * 0.9
  },
  methods: {
    //请求航班动态
      updateData () {
        let that = this
        queryAll(this.queryUrl).then(res => {
            if (res.data.code == 0) {
                if (JSON.stringify(res.data.data) == '{}') {
                    this.restore()
                } else {
                    that.data.abnormalFlight = res.data.data[0].abnormalFlight
                    that.data.normalFlight = res.data.data[0].normalFlight
                    that.data.domesticFlight = res.data.data[0].domesticFlight
                    that.data.intlFlight = res.data.data[0].intlFlight
                    that.data.totalFlight = res.data.data[0].totalFlight
                    that.updateOption()
                }
                } else {
                this.restore()
                }
            }).catch(() => {
                this.restore()
        })
      },
      //请求折线图数据
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
                    if(fltArr.dataType=='PLAN'){
                      that.dataFltP = fltArr
                    }else{
                      that.dataFltR = fltArr
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
            abnormalFlight : '--',
            normalFlight: '--',
            domesticFlight: '--',
            intlFlight: '--',
            totalFlight:'--'
          }
      },
      restoreKpi () {
        //计划出港
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
        //计划出港
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
      resizeMeth () {
        let kpiOpts2 = {
          height: this.el.clientHeight * 0.42,
          width: this.el.clientWidth * 0.95
        }
        this.outKpi.resize(kpiOpts2)
        this.updateOption()
      },
      updateOption () {
        //折线图Options
        let kpiOptions = {
                    title: {
                      text: '出港航班分布',
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
                     console.log(params[0].marker)
                    var res='<div><p>'+params[0].name+':00</p></div>' 
                    for(var i=0;i<params.length;i++){
                      let color = 'background: linear-gradient(to bottom, rgb(232, 132, 22), rgb(242, 247, 109));'
                      if (params[i].seriesName === '实际出港航班') {
                        color = 'background: linear-gradient(to bottom, rgb(232, 132, 22), rgb(242, 247, 109));'
                      }
                      if (params[i].seriesName === '计划出港航班') {
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
                    legend: {//这里定义了折线图上面那2排的颜色，显示的样子
                        align: 'auto',
                        inactiveColor: 'rgba(122, 147, 158, 0.6)',
                        itemGap: 20,
                        top: 20,
                        right: 10,
                        data: [{name:'计划出港航班',icon:'roundRect',color:'rgb(242, 247, 109)'},
                                {name:'实际出港航班',icon:'roundRect',color:'rgb(102, 214, 211)'}
                                ],
                        textStyle: {
                            color: ' rgba(199, 235, 255, 0.6)',
                            fontSize: 0, // this.fontSizeRs,
                            fontFamily: `'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif`
                        },
                        // icon:'roundRect',
                        itemHeight:5,
                        itemWidth:20,
                    },
                    grid: {
                        left: '3%',
                        right: 10,
                        top: 50,
                        bottom: 0,
                        containLabel: true
                    },
                    xAxis: [//定义X轴
                        {
                            type: 'category',//设置X轴的类型
                            name: '',
                            boundaryGap: false,
                            axisLabel: {//坐标轴刻度标签的相关设置。
                                color: "rgba(199, 235, 255, 0.6)",//设置颜色
                                fontSize: '12',//字体大小
                                interval: 1,//设置每个相邻之间少1个数
                                rotate: 0,//刻度标签旋转的角度
                            },
                            axisLine: {//坐标轴颜色
                                lineStyle: {//坐标轴颜色
                                    color: "rgba(255, 255, 255, 0.11)",
                                },
                            },
                             splitLine :{
                                lineStyle: {
                                  color: 'rgba(255, 255, 255,0.11)'
                                }
                              },
                            data: ['5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22' ,'23', '0', '1', '2', '3', '4']//数据源
                        }
                    ],
                    yAxis: [//定义y轴
                        {
                            type: 'value',
                            name: '/架次',
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
                            axisLabel: {//坐标轴刻度标签的相关设置。
                                color: "rgba(183, 228, 252, 0.5)",
                                fontSize: '14',
                                interval: 0,
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
                            name: '实际出港航班',//数据项名称。如果不写这个那么上面的2排里面就会少一个
                            type: 'line',//设置为折线图
                            smooth:true, 
                            data: [this.dataFltR.hour05, this.dataFltR.hour06, this.dataFltR.hour07, this.dataFltR.hour08, this.dataFltR.hour09, this.dataFltR.hour10, this.dataFltR.hour11, this.dataFltR.hour12, this.dataFltR.hour13, this.dataFltR.hour14, this.dataFltR.hour15, this.dataFltR.hour16,this.dataFltR.hour17,this.dataFltR.hour18,this.dataFltR.hour19,this.dataFltR.hour20,this.dataFltR.hour21,this.dataFltR.hour22,this.dataFltR.hour23, this.dataFltR.hour00, this.dataFltR.hour01, this.dataFltR.hour02, this.dataFltR.hour03, this.dataFltR.hour04],
                            showAllSymbol: true,//示折线图上所有小标签
                            symbolSize: 1,//标记的大小
                            symbol: 'circle',
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

                        },
                        {
                            name: '计划出港航班',
                            type: 'line',
                            smooth:true, 
                            data: [this.dataFltP.hour05, this.dataFltP.hour06, this.dataFltP.hour07, this.dataFltP.hour08, this.dataFltP.hour09, this.dataFltP.hour10, this.dataFltP.hour11, this.dataFltP.hour12, this.dataFltP.hour13, this.dataFltP.hour14, this.dataFltP.hour15, this.dataFltP.hour16,this.dataFltP.hour17,this.dataFltP.hour18,this.dataFltP.hour19,this.dataFltP.hour20,this.dataFltP.hour21,this.dataFltP.hour22,this.dataFltP.hour23, this.dataFltP.hour00, this.dataFltP.hour01, this.dataFltP.hour02, this.dataFltP.hour03, this.dataFltP.hour04],
                            showAllSymbol: true,//示折线图上所有小标签
                            symbol: 'circle',
                            symbolSize: 1,
                            connectNulls: false,
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
                        }
                    ]
        }
        this.outKpi.setOption(kpiOptions,true)
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
        this.updateDataFlt()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
$abnormal: rgba(223, 96, 147, 1);
$normal-1: rgb(115, 95, 250);
$normal-0: rgb(50, 193, 249);
$inland-1:rgb(115, 95, 251);
$inland-0:rgb(80, 152, 252);
$internation-0:rgb(221, 254, 247);
$internation-1:rgb(0, 239, 255);
$color:rgba(127,187,255,0);

.outBound>.header {
  flex: 0 0 40px;
  line-height: 40px;
  width:100%;
  display: flex;
}
.outBound>.header>img{
  width: 25%;
  height: 30%;
  top:50%;
  transform: translateY(-50%);
  position: relative;
}
.outBound>.header>img:first-child{
  // size: cover;
 margin-right: 6%;
}
.outBound>.header>img:last-child{
  margin-left: 6%;
}
.outBound>.header>.header-title{

  position: relative;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  font-size:0.2rem;
  font-family:PingFang SC;
  font-weight:bold;
  text-align: center;
}
.outBound>.body:nth-last-child(2) {
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
  width: 40%;
  height:calc(100%);
  display: flex;
  flex-direction: column;
}
.outBroundCricle {
  height: calc(100%);
  width: calc(100% + 2em);
  line-height: 1.2;
  position: relative;
  background-image: url('~@img/icon/log/earth_outBoundFlt.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-size: auto 100%;
}
.outBroundCricle>.flitCircle {
  height: calc(100%);
}
.outBroundCricle>.text {
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
}
.outBroundCricle>.text>div:last-child {
  margin-top: 0%;
  font-size: 0.52rem;
  font-family: 'DINPRO-MEDIUM';
  font-weight:normal;
  color:rgba(255,255,255,1);
  text-shadow:0px 0px 20px rgba(0, 0, 0, 1);
}
.prograss-top{
  height: 50%;
  .device-row{
    position: relative;
    height: 100%;
    width: 100%;
    padding: 10px 0 10px;
    .device-row-con {
      display: flex;
      justify-content: space-between;
      .label{
        height: 16px; 
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color:  rgba(199, 235, 255, 0.6);
        margin-bottom: 6px;
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
    bottom: 14px;
    left:0px;
    height: 6%;
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

    .percent-abnormal{
      @extend .percent-bar;
      background: $abnormal;
      margin-right: 0.5%;
    }
    .percent-normal{
     @extend .percent-bar;
     background: -webkit-linear-gradient(left, $normal-0 , $normal-1);
      margin-right: 0.5%;
      border-radius: 0px 3px 3px 0px
    }

   }
  }
}
.prograss-bottom{
  height: 50%;
  .device-row{
    position: relative;
    height: 100%;
    width: 100%;
    padding: 10px 0 20px;
    .device-row-con {
      display: flex;
      justify-content: space-between;
      .label{
        height: 0.16rem; 
        font-size: 0.14rem;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color:  rgba(199, 235, 255, 0.6);
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
        bottom: 17px;
        left:0px;
        height: 6%;
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
.left .label,.left .number {
  text-align: left;
}
.right .label,.right .number {
  text-align: right;
}
</style>