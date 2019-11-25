<template>
    <!-- 进港行李动态分析 -->
    <div class="inComLug ceshi-block">
        <div class="header">
          <img :src="require('@icon/logo/outBound_titleL.png')"/>
          <div class="header-title font-st">进港行李动态分析</div>
          <img :src="require('@icon/logo/outBond_title.png')"/>
        </div>
        <div class="body">
            <div class="body-top">
                <div>
                    <div class="body inComLugC">
                        <div class="text">
                            <div class="label font-rs">进港行李总数</div>
                            <div class="num-st font-white">{{data.totalNum}}</div>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="gauge-echart">
                        <div id="inLugGauge" class="gauge-canvas"></div>
                        <div class="text">
                            <div class="label font-rs">破损率</div>
                            <div class="num-st font-white">{{breakRate}}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="body">
                <div class="body-bottom">
                    <div>
                        <div id="inLugKpi" class="kpiLug"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { queryAll, update ,remove} from '@/util/base'
import echarts from 'echarts'
import Tabs from './Tabs/Tabs'
import { debug } from 'util'

export default {
  props: ['resize', 'refrush'],
  computed: {
    breakRate: function () {
      if(this.data.totalNum != 0){
         return Math.round((this.data.damageNum/this.data.totalNum * 100)) + '%'
        }else{
          return 0 + '%'
        }
    }
  },
  data () {
      return {
        //行李数据
          data:{
            totalNum: '--',
            damageNum: '--',
            age:89
          },
          inLugGaugeEl: null,
          inLugKpi: null,
          inLugKpiEl: null,
          el: null,
          //行李数据地址
          queryUrl: '/kpi/dynamic/queryDyanmicLugA',
          //图表数据地址
          queryLugUrl:'/kpi/dynamic/queryFlightDistributeA',
          //总量
          dataLugA:{
              hour00:0,
              hour01:0,
              hour02:0,
              hour03:0,
              hour04:0,
              hour05:0,
              hour06:0,
              hour07:0,
              hour08:0,
              hour09:0,
              hour10:0,
              hour11:0,
              hour12:0,
              hour13:0,
              hour14:0,
              hour15:0,
              hour16:0,
              hour17:0,
              hour18:0,
              hour19:0,
              hour20:0,
              hour21:0,
              hour22:0,
              hour23:0,
          },
          //地勤
          dataLugD:{
              hour00:0,
              hour01:0,
              hour02:0,
              hour03:0,
              hour04:0,
              hour05:0,
              hour06:0,
              hour07:0,
              hour08:0,
              hour09:0,
              hour10:0,
              hour11:0,
              hour12:0,
              hour13:0,
              hour14:0,
              hour15:0,
              hour16:0,
              hour17:0,
              hour18:0,
              hour19:0,
              hour20:0,
              hour21:0,
              hour22:0,
              hour23:0,
          },
          //东航
          dataLugE:{
              hour00:0,
              hour01:0,
              hour02:0,
              hour03:0,
              hour04:0,
              hour05:0,
              hour06:0,
              hour07:0,
              hour08:0,
              hour09:0,
              hour10:0,
              hour11:0,
              hour12:0,
              hour13:0,
              hour14:0,
              hour15:0,
              hour16:0,
              hour17:0,
              hour18:0,
              hour19:0,
              hour20:0,
              hour21:0,
              hour22:0,
              hour23:0,
          },
          //海航
          dataLugH:{
              hour00:0,
              hour01:0,
              hour02:0,
              hour03:0,
              hour04:0,
              hour05:0,
              hour06:0,
              hour07:0,
              hour08:0,
              hour09:0,
              hour10:0,
              hour11:0,
              hour12:0,
              hour13:0,
              hour14:0,
              hour15:0,
              hour16:0,
              hour17:0,
              hour18:0,
              hour19:0,
              hour20:0,
              hour21:0,
              hour22:0,
              hour23:0,
          }
      }
  },
  mounted () {
      this.inLugGaugeEl = document.getElementById('inLugGauge')
      this.inLugGauge = this.$echarts.init(this.inLugGaugeEl)
      this.inLugKpiEL = document.getElementById('inLugKpi')
      this.inLugKpi = this.$echarts.init(this.inLugKpiEL)
      //模块元素
      this.el = document.getElementsByClassName('inComLug')[0]
      this.updateOption()
      this.$nextTick(() => {
          let inOpt = {
              height: this.el.clientHeight * 0.38,
              width: this.el.clientWidth * 0.38
          }
          let kpiOpt = {
              height: this.el.clientHeight * 0.42,
              width: this.el.clientWidth * 0.94
          }
          this.inLugGauge.resize(inOpt)
          this.inLugKpi.resize(kpiOpt)
      })
  },
  methods: {
    //获取行李动态详情
      updateData () {
          let that = this
          queryAll(this.queryUrl).then(res => {
            if (res.data.code == 0) {
                if (JSON.stringify(res.data.data) == '{}') {
                    this.restore()
                } else {
                    that.data.totalNum = res.data.data[0].totalNum
                    that.data.damageNum = res.data.data[0].damageNum
                    if(this.totalNum != 0){
                      let rate = this.data.damageNum/this.data.totalNum 
                      let agel = 90
                      if(rate != 0 ){
                          agel = 90 - rate  *360 + 1
                      }else {
                         agel = 90
                      }
                      this.$set(that.data,'age',agel) 
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
      updateDataLug () {
        let that = this
        queryAll(this.queryLugUrl).then(res => {
            if (res.data.code == 0) {
                if (JSON.stringify(res.data.data) == '{}') {
                    this.restore()
                } else {
                  let arr = res.data.data
                  for(var i = 0; i< arr.length; i++){
                    let lugArr = arr[i]
                    // if(lugArr.agency=='ALL'){
                    //   that.dataLugA = lugArr
                    // }
                    if(lugArr.agency == '210'){
                      that.dataLugD = lugArr
                    }
                    if(lugArr.agency == '211'){
                      that.dataLugE = lugArr
                    }
                    if(lugArr.agency == '212'){
                      that.dataLugH = lugArr
                    }

                    this.$set(this.dataLugA,'hour00',parseInt(this.dataLugD.hour00)+parseInt(this.dataLugE.hour00)+parseInt( this.dataLugH.hour00))
                    this.$set(this.dataLugA,'hour01',parseInt(this.dataLugD.hour01)+parseInt(this.dataLugE.hour01)+parseInt( this.dataLugH.hour01))
                    this.$set(this.dataLugA,'hour02',parseInt(this.dataLugD.hour02)+parseInt(this.dataLugE.hour02)+parseInt( this.dataLugH.hour02))
                    this.$set(this.dataLugA,'hour03',parseInt(this.dataLugD.hour03)+parseInt(this.dataLugE.hour03)+parseInt( this.dataLugH.hour03))
                    this.$set(this.dataLugA,'hour04',parseInt(this.dataLugD.hour04)+parseInt(this.dataLugE.hour04)+parseInt( this.dataLugH.hour04))
                    this.$set(this.dataLugA,'hour05',parseInt(this.dataLugD.hour05)+parseInt(this.dataLugE.hour05)+parseInt( this.dataLugH.hour05))
                    this.$set(this.dataLugA,'hour06',parseInt(this.dataLugD.hour06)+parseInt(this.dataLugE.hour06)+parseInt( this.dataLugH.hour06))
                    this.$set(this.dataLugA,'hour07',parseInt(this.dataLugD.hour07)+parseInt(this.dataLugE.hour07)+parseInt( this.dataLugH.hour07))
                    this.$set(this.dataLugA,'hour08',parseInt(this.dataLugD.hour08)+parseInt(this.dataLugE.hour08)+parseInt( this.dataLugH.hour08))
                    this.$set(this.dataLugA,'hour09',parseInt(this.dataLugD.hour09)+parseInt(this.dataLugE.hour09)+parseInt( this.dataLugH.hour09))
                    this.$set(this.dataLugA,'hour10',parseInt(this.dataLugD.hour10)+parseInt(this.dataLugE.hour10)+parseInt( this.dataLugH.hour10))
                    this.$set(this.dataLugA,'hour11',parseInt(this.dataLugD.hour11)+parseInt(this.dataLugE.hour11)+parseInt( this.dataLugH.hour11))
                    this.$set(this.dataLugA,'hour12',parseInt(this.dataLugD.hour12)+parseInt(this.dataLugE.hour12)+parseInt( this.dataLugH.hour12))
                    this.$set(this.dataLugA,'hour13',parseInt(this.dataLugD.hour13)+parseInt(this.dataLugE.hour13)+parseInt( this.dataLugH.hour13))
                    this.$set(this.dataLugA,'hour14',parseInt(this.dataLugD.hour14)+parseInt(this.dataLugE.hour14)+parseInt( this.dataLugH.hour14))
                    this.$set(this.dataLugA,'hour15',parseInt(this.dataLugD.hour15)+parseInt(this.dataLugE.hour15)+parseInt( this.dataLugH.hour15))
                    this.$set(this.dataLugA,'hour16',parseInt(this.dataLugD.hour16)+parseInt(this.dataLugE.hour16)+parseInt( this.dataLugH.hour16))
                    this.$set(this.dataLugA,'hour17',parseInt(this.dataLugD.hour17)+parseInt(this.dataLugE.hour17)+parseInt( this.dataLugH.hour17))
                    this.$set(this.dataLugA,'hour18',parseInt(this.dataLugD.hour18)+parseInt(this.dataLugE.hour18)+parseInt( this.dataLugH.hour18))
                    this.$set(this.dataLugA,'hour19',parseInt(this.dataLugD.hour19)+parseInt(this.dataLugE.hour19)+parseInt( this.dataLugH.hour19))
                    this.$set(this.dataLugA,'hour20',parseInt(this.dataLugD.hour20)+parseInt(this.dataLugE.hour20)+parseInt( this.dataLugH.hour20))
                    this.$set(this.dataLugA,'hour21',parseInt(this.dataLugD.hour21)+parseInt(this.dataLugE.hour21)+parseInt( this.dataLugH.hour21))
                    this.$set(this.dataLugA,'hour22',parseInt(this.dataLugD.hour22)+parseInt(this.dataLugE.hour22)+parseInt( this.dataLugH.hour22))
                    this.$set(this.dataLugA,'hour23',parseInt(this.dataLugD.hour23)+parseInt(this.dataLugE.hour23)+parseInt( this.dataLugH.hour23))
                       
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
      //重置行李数据
      restore () {
        this.data = {
            totalNum: '--',
            damageNum: '--',
            age:89
        }
      },
      //重置图表数据
      restoreKpi() {
          this.dataLugA = {
              hour00:0,
              hour01:0,
              hour02:0,
              hour03:0,
              hour04:0,
              hour05:0,
              hour06:0,
              hour07:0,
              hour08:0,
              hour09:0,
              hour10:0,
              hour11:0,
              hour12:0,
              hour13:0,
              hour14:0,
              hour15:0,
              hour16:0,
              hour17:0,
              hour18:0,
              hour19:0,
              hour20:0,
              hour21:0,
              hour22:0,
              hour23:0,
          },
          this.dataLugD = {
              hour00:0,
              hour01:0,
              hour02:0,
              hour03:0,
              hour04:0,
              hour05:0,
              hour06:0,
              hour07:0,
              hour08:0,
              hour09:0,
              hour10:0,
              hour11:0,
              hour12:0,
              hour13:0,
              hour14:0,
              hour15:0,
              hour16:0,
              hour17:0,
              hour18:0,
              hour19:0,
              hour20:0,
              hour21:0,
              hour22:0,
              hour23:0,
          },
          this.dataLugE = {
              hour00:0,
              hour01:0,
              hour02:0,
              hour03:0,
              hour04:0,
              hour05:0,
              hour06:0,
              hour07:0,
              hour08:0,
              hour09:0,
              hour10:0,
              hour11:0,
              hour12:0,
              hour13:0,
              hour14:0,
              hour15:0,
              hour16:0,
              hour17:0,
              hour18:0,
              hour19:0,
              hour20:0,
              hour21:0,
              hour22:0,
              hour23:0,
          },
          this.dataLugH = {
              hour00:0,
              hour01:0,
              hour02:0,
              hour03:0,
              hour04:0,
              hour05:0,
              hour06:0,
              hour07:0,
              hour08:0,
              hour09:0,
              hour10:0,
              hour11:0,
              hour12:0,
              hour13:0,
              hour14:0,
              hour15:0,
              hour16:0,
              hour17:0,
              hour18:0,
              hour19:0,
              hour20:0,
              hour21:0,
              hour22:0,
              hour23:0,
          }
      },
      //适应屏幕宽高
      resizeMeth () {
          let inOpt2 = {
              height: this.el.clientHeight * 0.38,
              width: this.el.clientWidth * 0.38
          }
          let kpiOpt2 = {
              height: this.el.clientHeight * 0.42,
              width: this.el.clientWidth * 0.94
          }
          this.inLugGauge.resize(inOpt2)
          this.inLugKpi.resize(kpiOpt2)
          this.updateOption()
      },
      updateOption () {
        //仪表盘options
          let inGaugeOption = {
              series: [
                  {
                      name: '破损率',
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
                                  offset: 0.5,
                                  color: "#FAF563"
                                },
                                {
                                  offset: 1,
                                  color: "#F18D1A"
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
                      name: '破损率',
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
                    lineStyle: {
                        color: 'rgba(127, 187, 255, 0.3)',
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
                        length: '10%',
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
                }
              ]
          }
          this.inLugGauge.setOption(inGaugeOption ,true)
          //折线图options
          let kpiOptions = {
                    title: {
                      text: '进港行李分布',
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
                    res+='<p>'+params[i].marker+params[i].seriesName+':'+params[i].data+'</p>'
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
                        data: ['总量', '地勤', '东航', '海航'],
                        itemGap: 20,
                        top: 14,
                        right: 10,
                        textStyle: {
                            color: 'rgba(199, 235, 255, 0.6)',
                            fontSize: 0, // this.fontSizeRs,
                            fontFamily: `'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif`
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
                            minInterval : 1,
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
                            splitLine :{
                              lineStyle: {
                                color: 'rgba(255, 255, 255,0.11)'
                              }
                              },
                        },
                    ],
                    series: [//系列列表。每个系列通过 type 决定自己的图表类型
                        {
                            name: '总量',//数据项名称。如果不写这个那么上面的2排里面就会少一个
                            type: 'line',//设置为折线图
                            smooth:true, 
                            data: [this.dataLugA.hour05, this.dataLugA.hour06, this.dataLugA.hour07, this.dataLugA.hour08, this.dataLugA.hour09, this.dataLugA.hour10, this.dataLugA.hour11, this.dataLugA.hour12, this.dataLugA.hour13, this.dataLugA.hour14, this.dataLugA.hour15, this.dataLugA.hour16,this.dataLugA.hour17,this.dataLugA.hour18,this.dataLugA.hour19,this.dataLugA.hour20,this.dataLugA.hour21,this.dataLugA.hour22,this.dataLugA.hour23, this.dataLugA.hour00, this.dataLugA.hour01, this.dataLugA.hour02, this.dataLugA.hour03, this.dataLugA.hour04],
                            showAllSymbol: true,//示折线图上所有小标签
                            symbol: 'circle',
                            symbolSize: 1,//标记的大小
                            connectNulls: false,
                            lineStyle: {
                            opacity: 0
                            },
                            itemStyle: {
                            normal: {
                                color: 'rgba(69, 141, 242, 1)',
                                borderColor: 'rgba(69, 141, 242, 1)',
                                borderWidth: 1,
                                lineStyle:{  
                                        color:'rgba(69, 141, 242, 1)'  
                                    }
                            }
                            },

                        },
                        {
                            name: '地勤',//数据项名称。如果不写这个那么上面的2排里面就会少一个
                            type: 'line',//设置为折线图
                            smooth:true, 
                            data: [this.dataLugD.hour05, this.dataLugD.hour06, this.dataLugD.hour07, this.dataLugD.hour08, this.dataLugD.hour09, this.dataLugD.hour10, this.dataLugD.hour11, this.dataLugD.hour12, this.dataLugD.hour13, this.dataLugD.hour14, this.dataLugD.hour15, this.dataLugD.hour16,this.dataLugD.hour17,this.dataLugD.hour18,this.dataLugD.hour19,this.dataLugD.hour20,this.dataLugD.hour21,this.dataLugD.hour22,this.dataLugD.hour23, this.dataLugD.hour00, this.dataLugD.hour01, this.dataLugD.hour02, this.dataLugD.hour03, this.dataLugD.hour04],
                            showAllSymbol: true,//示折线图上所有小标签
                            symbol: 'circle',
                            symbolSize: 1,//标记的大小
                            connectNulls: false,
                            lineStyle: {
                            opacity: 0
                            },
                            itemStyle: {
                            normal: {
                                color: 'rgba(235, 191, 65, 1)',
                                borderColor: 'rgba(235, 191, 65, 1)',
                                borderWidth: 1,
                                lineStyle:{  
                                        color:'rgba(235, 191, 65, 1)'  
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
                                    offset: 0.1, color: 'rgba(247, 193, 48, 0.5)'
                                }, {
                                    offset: 1, color: 'rgba(63,153,255,0)'
                                }]
                                }
                            }
                            },
                        },
                        {
                            name: '东航',//数据项名称。如果不写这个那么上面的2排里面就会少一个
                            type: 'line',//设置为折线图
                            smooth:true, 
                            data: [this.dataLugE.hour05, this.dataLugE.hour06, this.dataLugE.hour07, this.dataLugE.hour08, this.dataLugE.hour09, this.dataLugE.hour10, this.dataLugE.hour11, this.dataLugE.hour12, this.dataLugE.hour13, this.dataLugE.hour14, this.dataLugE.hour15, this.dataLugE.hour16,this.dataLugE.hour17,this.dataLugE.hour18,this.dataLugE.hour19,this.dataLugE.hour20,this.dataLugE.hour21,this.dataLugE.hour22,this.dataLugE.hour23, this.dataLugE.hour00, this.dataLugE.hour01, this.dataLugE.hour02, this.dataLugE.hour03, this.dataLugE.hour04],
                            showAllSymbol: true,//示折线图上所有小标签
                            symbol: 'circle',
                            symbolSize: 1,//标记的大小
                            connectNulls: false,
                            lineStyle: {
                            opacity: 0
                            },
                            itemStyle: {
                            normal: {
                                color: 'rgba(108, 92, 240, 1)',
                                borderColor: 'rgba(108, 92, 240, 1)',
                                borderWidth: 1,
                                lineStyle:{  
                                        color:'rgba(108, 92, 240, 1)'  
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
                                    offset: 0.1, color: 'rgba(105, 107, 255, 0.5)'
                                }, {
                                    offset: 1, color: 'rgba(180, 181, 245,0)'
                                }]
                                }
                            }
                            },
                        },
                        {
                            name: '海航',//数据项名称。如果不写这个那么上面的2排里面就会少一个
                            type: 'line',//设置为折线图
                            smooth:true, 
                            data: [this.dataLugH.hour05, this.dataLugH.hour06, this.dataLugH.hour07, this.dataLugH.hour08, this.dataLugH.hour09, this.dataLugH.hour10, this.dataLugH.hour11, this.dataLugH.hour12, this.dataLugH.hour13, this.dataLugH.hour14, this.dataLugH.hour15, this.dataLugH.hour16,this.dataLugH.hour17,this.dataLugH.hour18,this.dataLugH.hour19,this.dataLugH.hour20,this.dataLugH.hour21,this.dataLugH.hour22,this.dataLugH.hour23, this.dataLugH.hour00, this.dataLugH.hour01, this.dataLugH.hour02, this.dataLugH.hour03, this.dataLugH.hour04],
                            showAllSymbol: true,//示折线图上所有小标签
                            symbol: 'circle',
                            symbolSize: 1,//标记的大小
                            connectNulls: false,
                            lineStyle: {
                            opacity: 0
                            },
                            itemStyle: {
                            normal: {
                                color: 'rgba(210, 81, 124, 1)',
                                borderColor: 'rgba(210, 81, 124, 1)',
                                borderWidth: 1,
                                lineStyle:{  
                                        color:'rgba(210, 81, 124, 1)'  
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
                                    offset: 0.1, color: 'rgba(255, 76, 106, 0.5)'
                                }, {
                                    offset: 1, color: 'rgba(246, 198, 206,0)'
                                }]
                                }
                            }
                            },
                        }
                    ]
          }
          this.inLugKpi.setOption(kpiOptions,true)
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
.inComLug>.header {
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
.inComLug>.header>img{
  width: 25%;
  height: 30%;
  top:50%;
  transform: translateY(-50%);
  position: relative;
}
.inComLug>.header>img:first-child{
  margin-right: 8%;
}
.inComLug>.header>img:last-child{
  margin-left: 8%;
}
.inComLug>.body {
  height: calc(100% - 40px);
  display: flex;
  flex-direction: column;
}

.inComLug>.body>div:first-child {
  flex: 0 0 calc(100% / 460 * 240);
  display: flex;
}
.inComLugC{
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
    color:rgba(255,255,255,1);
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
  margin-top: 10px ;
}
.gauge-echart {
  height: calc(100% / 420 * 270);
  width: 100%;
  position: relative;
}
.gauge-echart > .gauge-canvas {
  height: 100%;
  margin-left: 11%;
  width: 90%;
  margin-top: 3%;
  display: flex;
  justify-content: center;
}
// .gauge-canvas {
//   display: flex;
//   justify-content: center;
// }
.gauge-echart>.text {
  position: absolute;
  width: fit-content;
  height: fit-content;
  top: 50px;
  bottom: 0;
  left: 35px;
  right: 0;
  margin: auto;
}
.gauge-echart>.text > .label {

    font-size:14px;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(199, 235, 255, 0.6)
}
 .gauge-echart>.text>.num-st{

    font-size:30px;
   font-family: 'DINPRO-MEDIUM';
    color:rgba(255,255,255,1);
  }
</style>