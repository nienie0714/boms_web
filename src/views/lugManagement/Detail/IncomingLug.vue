<template>
    <div class="IncomingLug">
        <my-dialog :visible="visible" :top="100" :width="1200" :footer="false" :position="'right'" class="flt-detail-dialog under-head-dialog" @handleClose="handleClose" :title="title">
            <template >   
                <tables  :tableData="tableData" :loading="tableData.loading" style="height:750px;" ref="tables">
                    <template v-slot:slot-body="{index, row, item}">
                      <template v-if="item.type=='slot'">
                        <div></div>
                      </template>
                      <template v-if="row.execDate ==dateStr +' 00:00:00'">
                        <template v-if="['loadAirAtTimeEnd','transportAtTimeStart','transportAtTimeEnd','unLoadCarAtTime','selfAtTime'].includes(item.key)">
                          <div v-if="row.mainTain===1&&row[item.key]==null">
                              <div class="label-img"  @click="activeTd(index, item.key)">                        
                                <div :class="['label-img-inside', popList[index][item.key] ? 'label-img-active' : '']">
                                  <span>{{ formartValue(row,item)}}</span>
                                  <img v-if="popList[index][item.key]" :src="require('@icon/toolbar/icon_row_edit.png')" @click="openPop(row, item.key,$event)">
                                </div>
                              </div>
                            </div> 
                            <div v-if="row.mainTain===1&&row[item.key]!=null">
                              <span>{{formartValue(row,item)}}</span>
                            </div> 
                            <div v-if="row.mainTain===0">
                              <div class="label-img"  @click="activeTd(index, item.key,)">                        
                                <div :class="['label-img-inside', popList[index][item.key] ? 'label-img-active' : '']">
                                  <span>{{formartValue(row,item)}}</span>
                                  <img v-if="popList[index][item.key]" :src="require('@icon/toolbar/icon_row_edit.png')" @click="openPop(row, item.key,$event)">
                                </div>
                              </div>
                            </div> 
                        </template>
                      </template>
                        <template v-if="row.execDate !=dateStr +' 00:00:00'">
                            <template v-if="item.key=='loadAirAtTimeEnd'&&row[item.key]!=null">
                              <div v-if="row.loadAirAtTimeEndUser&&row.loadAirAtTimeEndUser=='1'">
                                <span>{{formartValue(row,item)}}</span>
                              </div>
                              <div v-if="row.loadAirAtTimeEndUser&&row.loadAirAtTimeEndUser=='0'">
                                <span style="color:#899DB2">{{formartValue(row,item)}}</span>
                              </div>
                            </template>
                            <template v-if="item.key=='transportAtTimeStart'&&row[item.key]!=null">
                              <div v-if="row.transportAtTimeStartUser&&row.transportAtTimeStartUser=='1'">
                                <span>{{formartValue(row,item)}}</span>
                              </div>
                              <div v-if="row.transportAtTimeStartUser&&row.transportAtTimeStartUser=='0'">
                                <span style="color:#899DB2">{{formartValue(row,item)}}</span>
                              </div>
                            </template>
                            <template v-if="item.key=='transportAtTimeEnd'&&row[item.key]!=null">
                              <div v-if="row.transportAtTimeEndUser&&row.transportAtTimeEndUser=='1'">
                                <span>{{formartValue(row,item)}}</span>
                              </div>
                              <div v-if="row.transportAtTimeEndUser&&row.transportAtTimeEndUser=='0'">
                                <span style="color:#899DB2">{{formartValue(row,item)}}</span>
                              </div>
                            </template>
                            <template v-if="item.key=='unLoadCarAtTime'&&row[item.key]!=null">
                              <div v-if="row.unLoadCarAtTimeUser&&row.unLoadCarAtTimeUser=='1'">
                                <span>{{formartValue(row,item)}}</span>
                              </div>
                              <div v-if="row.unLoadCarAtTimeUser&&row.unLoadCarAtTimeUser=='0'">
                                <span style="color:#899DB2">{{formartValue(row,item)}}</span>
                              </div>
                            </template>
                            <template v-if="item.key=='selfAtTime'&&row[item.key]!=null">
                              <div v-if="row.selfAtTimeUser&&row.selfAtTimeUser=='1'">
                                <span>{{formartValue(row,item)}}</span>
                              </div>
                              <div v-if="row.selfAtTimeUser&&row.selfAtTimeUser=='0'">
                                <span style="color:#899DB2">{{formartValue(row,item)}}</span>
                              </div>
                            </template>
                        </template>
                    </template>
                </tables>
            </template>
                
        </my-dialog>
        <!-- 编辑行李实际时间节点 -->
        <my-dialog :visible="popData.visible" :header="false" :footer="false"  :position="'center'" :height="187" :width="232" class="td-popover" @handleClose="closeEditPop"
        :dialogClass="'counter-class'" :top="pop.top" :left="pop.left">
          <div class="td-popover counter-popover">
            <el-main>
              <el-form :model="editData" :label-position="'top'" ref="ruleForm" size="mini" class="edit-form">
                <div class="pop-aircraft" style="margin-top:12px">进港行李列表编辑</div>
                  <el-time-picker  v-model="editData[editData.key]"  :picker-options="{ selectableRange:'00:00:00 - 23:59:59'}"  placeholder="选择时间" format="HH:mm" value-format="HH:mm" style="margin-top:10px" >
                  </el-time-picker> 
              </el-form>
            </el-main>
            <el-footer>
              <div class="footer-all">
                <button type="info" @click="closeEditPop">取消</button>
                <button type="primary" @click="saveEditPop(editData.key)">确定</button>
              </div>
            </el-footer>
          </div>
        </my-dialog>
    </div>
</template>

<script>
import Tables from '@view/Table/Table'
import tableMixin from '@mixin/tableMixin'
import formMixin from '@mixin/formMixin'
import { queryAll, download, update } from '@/util/base'


import _ from 'lodash'

export default {
    components: {
        Tables,
    },
    mixins:[tableMixin,formMixin],
    props: ['row','visible','pRow'],
    data() {
        return {
           //visible:false,
            title:'进港行李列表',  
            tableData:{
                 key:'lugId',
                 height: 600,
                 multSelection: [],
                 loading: false,
                 url:'/integrated/luggageSecurity/queryLugByFlightId',
                 queryParam:{
                   dynamicFlightId: null,
                   flightDate:null
                 },
                 column:[
                     //left
                     [
                    //   {key:'lugNo',label:'进港行李号',width:100},  
                     ],
                     //center
                     [
                       {key:'lugNo',label:'进港行李号',width:90},  
                        {key:'loadAirEtTimeEnd',label:'预计卸机装车时间',width:140,format: [11, 5]},
                        {key:'loadAirAtTimeEnd',label:'实际卸机装车时间',width:140,type:'slot'},
                        {key:'transportEtTimeStart',label:'预计开始运输时间',width:140,format: [11, 5]},
                        {key:'transportAtTimeStart',label:'实际开始运输时间',width:140,type:'slot'},
                        {key:'transportEtTimeEnd',label:'预计运输结束时间',width:140,format: [11, 5]},
                        {key:'transportAtTimeEnd',label:'实际运输结束时间',width:140,type:'slot'},
                        {key:'unLoadCarEtTime',label:'预计卸车上转盘时间',width:140,format: [11, 5]},
                        {key:'unLoadCarAtTime',label:'实际卸车上转盘时间',width:140,type:'slot'},
                        {key:'selfAtTime',label:'实际提取核验时间',width:140,type:'slot'},
                     ],
                     //right
                      [
                         {label: '', width: 5,type:'slot'}
                      ]
                     
                 ],
                 data:[]
            },
            popList: [],
            editData: {},
            popData: {
              visible: false
            },
            pop: {
              left: 0,
              top: 0
            },
            dateStr:null
        }
    },
    mounted() {
       let today = new Date()
       this.dateStr = `${today.getFullYear()}-${this.addZero(today.getMonth() + 1)}-${this.addZero(today.getDate())}`
    },
    methods: {
      activeTd(index,key){
        this.closeAllPop()
        this.popList[index][key] = true
        this.$set(this.popList[index], key, this.popList[index][key]) 
      },
    // 并清空弹框
      closeAllPop() {
        this.$set(this, 'popList', [])
        for(let i = 0; i<this.tableData.data.length; i++) {
          this.popList.push({loadAirAtTimeEnd: false, transportAtTimeStart: false, transportAtTimeEnd: false, unLoadCarAtTime: false,selfAtTime:false})
        }

      },
      //过滤截取时间
      formartValue(row,item){
        let value = row[item.key]
        if(row[item.key]!=null){
        value = value.substring(11,16)
          return value
        }else{
          return value
        }
      },
      //添加时间00
      addZero (value) {
        if (value < 10) {
          return `0${value}`
        } else {
          return value
        }
      },

      changeData() {
        this.tableData.data = this.row
        this.closeAllPop()
      },
      //打开编辑弹窗
      openPop(row, key,$event) {
        if ($event.clientY > 650) {
          // 向上展示
          this.pop.top = $event.clientY - 187 - 30
        } else {
          // 向下展示
          this.pop.top = $event.clientY + 30
        }
        if ($event.clientX > 1686) {
          // 偏左展示
          this.pop.left = $event.clientX - 232
        } else {
          // 居中展示
          this.pop.left = $event.clientX - 232 / 2
        }
        this.popData.visible = true
        this.editData = {}
        this.editData = Object.assign({}, row)
        this.editData.key = key
      },
      //关闭编辑弹窗
      closeEditPop() {
        this.popData.visible = false
        this.editData = {}
      },
      //提交编辑结果
      saveEditPop(key) {
        let data = this.editData
        for (let editItem of Object.keys(this.editData)) {
          if (editItem == this.editData.key) {
              if(this.editData[editItem].length<=5){
                  data[editItem] =this.dateStr+' '+ this.editData[editItem]+':00'
                }else{
                  data[editItem] = this.editData[editItem]
                }
          }
        }
        this.$set(data,'editFlag','lug')
        this.$delete(data,'key')
        queryAll('/integrated/luggageSecurity/editLugNodeInfo', data).then(res => {
          if (res.data.code == 0) {
             this.$msg.success({
                info: '保存成功 !'
              })
              this.popData.visible = false
              this.$parent.showLugDetail(this.pRow)
              //  this.handleClose()

          } else {
            this.$msg.error({
              info: '保存失败 !'
            })
            this.popData.visible = false
          }
        }).catch(err => {
          this.$msg.error({
            info: '请求异常 !'
          })
          this.popData.visible = false
        })
      },
      handleClose () {
        this.$emit('handleClose')
        // this.visible = false
        // this.$options.parent.row = {}
      },

    },
     watch: {
       row:{
          handler (data) {
            if (data) {
              this.changeData()
            }
          },
          immediate: true
       }

     }
}
</script>

<style lang="scss" scoped>
.label-img {
  height: 48px;
  line-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  .label-img-inside {
    margin: 0 4px;
    padding: 0 15px;
    height: 30px;
    line-height: 30px;
    border-radius: 3px;
    &.label-img-active {
      background-color: #EAF4FF;
      color: #3392FF;
    }
    img {
      cursor: pointer;
      margin-left: 12px;
    }
  }
}
/deep/.counter-class {
  margin:0 !important;
}
</style>