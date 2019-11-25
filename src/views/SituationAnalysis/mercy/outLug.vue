<template>
<!-- 出港行李动态分析 -->
    <div class="outBoundLug ceshi-block">
    <div class="header">
      <img :src="require('@icon/logo/outBound_titleL.png')"/>
      <div class="header-title font-st">出港行李动态分析</div>
      <img :src="require('@icon/logo/outBond_title.png')"/>
    </div>
    <div class="body">
        <div class="body-top">
            <div>
                <div class="body outBoundLugC">
                    <div class="text">
                        <div class="label font-rs">出港行李总数</div>
                        <div class="num-st font-white">{{data.loadAcftNum}}</div>
                    </div>
                </div>
            </div>
            <div>
              <div class="gauge-echart">
                <div id="lugCircle" class="gauge-canvas"></div>
                <div class="text">
                    <div class="label font-rs">开包率</div>
                    <div class="num-st font-white">{{openRate}}</div>
                </div>
               </div>
            </div>
        </div>
        <div class="body-bottom">
          <div class="body">
            <div id="lugkpiT" class="kpiLug"></div>
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
  computed : {
    openRate: function () {
      if(this.data.loadAcftNum != 0) {
        return Math.round((this.data.unpackNum/this.data.loadAcftNum * 100)) + '%'
      }else{
        return 0 +'%'
      }
    },
    openAgeL: function () {
       return (Math.round( this.openRate * 360 - 90 ))
    }
  },
  data () {
      return {
          //行李动态
          queryUrl: '/kpi/dynamic/queryDyanmicLugD',
          //折线图接口
          queryLugUrl:'/kpi/dynamic/queryFlightDistributeD',
          lugCircle: null,
          lugCircleEl: null,
          lugkpiT: null,
          lugkpiTEl: null,
          el: null,
          leaveLugNum: null,
          openAge: null,
          //行李动态
          data:{
            loadAcftNum: '--',
            unpackNum: '--',
            age:89
          },
          //折线图数据
          dataLug:{
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
      }
  },
  mounted () {
      this.lugCircleEl = document.getElementById('lugCircle')
      this.lugCircle = this.$echarts.init(this.lugCircleEl)
      this.lugkpiTEl = document.getElementById('lugkpiT')
      this.lugkpiT = this.$echarts.init(this.lugkpiTEl)
      this.el = document.getElementsByClassName('outBoundLug')[0]
      this.updateOptions()
      this.$nextTick(() => {
          let lugOpt = {
          height: this.el.clientHeight * 0.38,
          width: this.el.clientWidth * 0.38
          }
          this.lugCircle.resize(lugOpt)
          let kpiOpt= {
          height: this.el.clientHeight * 0.42,
          width: this.el.clientWidth * 0.94
          }
          this.lugkpiT.resize(kpiOpt)
          this.updateOptions()
      })
      // this.openAge = (Math.round( this.data.unpackNum/this.data.unpackNum * 360 - 90 ))
      // console.log(this.openAge)
  },
  methods: {
      //请求行李动态
      updateData () {
          let that = this
          queryAll(this.queryUrl).then(res => {
            if (res.data.code == 0) {
                if (JSON.stringify(res.data.data) == '{}') {
                    this.restore()
                } else {
                  // debugger
                    that.data.loadAcftNum = res.data.data[0].loadAcftNum
                    that.data.unpackNum = res.data.data[0].unpackNum
                    if(this.data.loadAcftNum != 0){
                        let rate = this.data.unpackNum/this.data.loadAcftNum
                        let agel = 90
                        if(rate != 0){
                          agel = 90- (this.data.unpackNum/this.data.loadAcftNum) * 360 + 1
                        } else {
                            agel = 90
                        }
                        this.$set(that.data,'age',agel)
                    }
                    that.updateOptions()
                }
                } else {
                this.restore()
                }
            }).catch(() => {
                this.restore()
          })
      },
      //请求折线图动态
      updateDataLug () {
        let that = this
        queryAll(this.queryLugUrl).then(res => {
            if (res.data.code == 0) {
                if (JSON.stringify(res.data.data) == '{}') {
                    this.restore()
                } else {
                  that.dataLug = res.data.data[0]
                    that.updateOptions()
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
            loadAcftNum: '--',
            unpackNum: '--',
            age:89
          }
      },
      restoreKpi () {
          this.dataLug = {
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
           let lug2 = {
              height: this.el.clientHeight * 0.38,
              width: this.el.clientWidth * 0.38
           }
           this.lugCircle.resize(lug2)
            let kpiOpt2= {
              height: this.el.clientHeight * 0.42,
              width: this.el.clientWidth * 0.94
            }
            this.lugCircle.resize(lug2)
            this.lugkpiT.resize(kpiOpt2)
            this.updateOptions()
       },
       updateOptions () {
         //仪表盘options
           let lugCircleOption = {
               series: [
                    {
                      name: '开包率',
                      type: 'gauge',
                      radius : '100%',
                      // silent: true,  
                      // 仪表盘轴线(轮廓线)相关配置。
                      startAngle: 90.9,
                      endAngle: this.data.age,
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
                          ],
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
                      // markArea: {
                      //   itemStyle: {
                      //     color: {
                      //       type: 'radial',
                      //       x: 0.5,
                      //       y: 0.5,
                      //       r: 0.5,
                      //       colorStops: [{
                      //           offset: 0, color: '#696BFF'
                      //       }, {
                      //           offset: 1, color: '#696BFF'
                      //       }],
                      //       global: false // 缺省为 false
                      //     }
                      //   },
                      // },
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
                      name: '开包率',
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
                      // markArea: {
                      //   itemStyle: {
                      //     color: {
                      //       type: 'radial',
                      //       x: 0.5,
                      //       y: 0.5,
                      //       r: 0.5,
                      //       colorStops: [{
                      //           offset: 0, color: '#696BFF'
                      //       }, {
                      //           offset: 1, color: '#34C8FF'
                      //       }],
                      //       global: false // 缺省为 false
                      //     }
                      //   },
                      // },
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
                      data: [{
                          value: 53.96
                      }]
                },
                {
                    type: 'gauge',
                    radius: '90%',
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
                    length: 14,
                    lineStyle: {
                        color: 'rgba(127, 187, 255, 1)',
                        width: 1.5
                    }
                    },
                    // 刻度样式。
                    axisTick: {
                    show: true,
                    lineStyle:{
                      color:'rgba(127, 187, 255, 0.3)'
                    }
                  //  
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
                    color: 'rgba(127, 187, 255, 1)'
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
           this.lugCircle.setOption(lugCircleOption,true)
           //这线图options
           let kpiOptions = {
                    title: {
                      text: '出港行李分布',
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
                    res+='<p>'+params[i].marker.replace('background-color:[object Object];', 'background: linear-gradient(to bottom, rgb(79, 77, 185), rgb(102, 214, 211));')+params[i].seriesName+':'+params[i].data+'</p>'
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
                    legend: {
                        data: ['出港行李数'],
                        textStyle: {
                            color: " rgba(199, 235, 255, 0.6)",
                        },
                        top: 14,
                        right: 10,
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
                            data: ['5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22' ,'23', '0', '1' ,'2', '3', '4']//数据源
                        }
                    ],
                    yAxis: [//定义y轴
                        {
                            type: 'value',
                            name: '/件',
                            minInterval :1,
                            splitNumber :4,
                            axisLabel: {//坐标轴刻度标签的相关设置。
                                color: "rgba(183, 228, 252, 0.5)",
                                fontSize: '14',
                                interval: 0,
                            },
                            axisLine: {//坐标轴颜色
                                show:false,
                                lineStyle: {//坐标轴颜色
                                    color: "rgba(183, 228, 252, 0.5)",
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
                            name: '出港行李数',//数据项名称。如果不写这个那么上面的2排里面就会少一个
                            type: 'line',//设置为折线图
                            smooth:true, 
                            data: [this.dataLug.hour05, this.dataLug.hour06, this.dataLug.hour07, this.dataLug.hour08, this.dataLug.hour09, this.dataLug.hour10, this.dataLug.hour11, this.dataLug.hour12, this.dataLug.hour13, this.dataLug.hour14, this.dataLug.hour15, this.dataLug.hour16,this.dataLug.hour17,this.dataLug.hour18,this.dataLug.hour19,this.dataLug.hour20,this.dataLug.hour21,this.dataLug.hour22,this.dataLug.hour23, this.dataLug.hour00, this.dataLug.hour01, this.dataLug.hour02, this.dataLug.hour03, this.dataLug.hour04],
                           showAllSymbol: false,//示折线图上所有小标签
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
                            areaStyle: {
                            normal: {
                                color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0, color: 'rgba(63,153,255,0.6)'
                                }, {
                                    offset: 0.5, color: 'rgba(63,153,255,0.3)'
                                }, {
                                    offset: 1, color: 'rgba(52,200,255,0)'
                                }]
                                }
                            }
                            },

                        },
                    ]
           }
           this.lugkpiT.setOption(kpiOptions,true)
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
        this.updateDataLug()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
$color:rgb(246, 198, 206);
.outBoundLug>.header {
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
.outBoundLug>.header>img{
  width: 25%;
  height: 30%;
  top:50%;
  transform: translateY(-50%);
  position: relative;
}
.outBoundLug>.header>img:first-child{
  // size: cover;
 margin-right: 8%;
}
.outBoundLug>.header>img:last-child{
  margin-left: 8%;
}
.outBoundLug>.body{
  height: calc(100% - 40px);
  display: flex;
  flex-direction: column;
}
// .outBoundLug>.body>div {
//   margin-top:2%; 
//   box-sizing: border-box;
//   height: calc(50% + 50% / 570 * 60 - 100% / 758 * 10);
//   margin-bottom: calc(100% / 758 * 10);
// }
.outBoundLug>.body>div:first-child {
  flex: 0 0 calc(100% / 460 * 240);
  display: flex;
}
.outBoundLugC{
  height: 100%;
  width: 100%;
  line-height: 1.2;
  position: relative;
  background-image:  url('~@img/icon/log/earth_outLug.png');
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
    color: rgba(199, 235, 255, 0.6);
    .label{
      font-size:14px;
      // width: 200px;
      font-family:PingFang SC;
      font-weight:bold;
      color:rgba(255,255,255,1);
      text-align: center
    }
    .num-st{
      margin-top: 1%;
      font-size: 0.52rem;
     font-family: 'DINPRO-MEDIUM';
      color:rgba(255,255,255,1);
      text-shadow:0px 0px 20px rgba(0, 0, 0, 1);
    }
  }
}
.body-top>div{
   width: 50%
}
.body-top>div:last-child{
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  margin-top: 1% ;
}
.gauge-echart {
  height: calc(100% / 420 * 270);
  width: 100%;
  position: relative;
}
.gauge-echart > .gauge-canvas {
  height: 100%;
   width: 90%;
  // margin-left: 35px;
  margin-top: 5%;
  display: flex;
  justify-content: center;
  margin-left: 11%
}
.gauge-echart>.text {
  position: absolute;
  width: fit-content;
  height: fit-content;
  top: 58px;
  bottom: 0;
  left: 35px;
  right: 0;
  margin: auto;
}
.gauge-echart>.text > .label {

    font-size:14px;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(199,235,255,0.6)
}
 .gauge-echart>.text>.num-st{

    font-size:30px;
    font-family: 'DINPRO-MEDIUM';
    color:rgba(255,255,255,1);
  }
.body-bottom{
    height:100%;
    .body{
      .kpiLug{
        height: 100%;
        display: flex;
        justify-content: center;
      }
    }
}
</style>