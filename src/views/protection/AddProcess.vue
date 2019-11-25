<template>
  <div id="add-menu" class="add-menu" v-if="isCanvas" :class = "canvasColor == '' ? '' : 'darkMenu' ">
    <div class="flow-toolbar">
      <div class="operator-img">
        <div @click="addRelation($event)" :class="isClick ? 'select-line' : 'draw-line'">
          连线
        </div>
        <div @click="isExit" :class="remove.visible ? 'select-cancle' : 'draw-cancle'">
          取消
        </div>
        <div class="draw-save" @click="saveFlow">
          完成
        </div>
      </div>
      <div class="begin-end">
        <ul>
          <li>
            <div nodeName="开始" nodeNo="N-START" class="basicNode" :draggable="beginDragStatus" :isClick="isClick">
              <img src="~@img/flow/beginNode.png" />
              <div>开始</div>
            </div>
          </li>
          <li>
            <div nodeName="结束" nodeNo="N-END" class="basicNode" :draggable="endDragStatus" :isClick="isClick">
              <img src="~@img/flow/endNode.png" />
              <div>结束</div>
            </div>
          </li>
        </ul>
      </div>
      <div class="node-type" @mouseenter="chargeNodeType()" >
        <inputTag :disabled="nodeSelect" :prepend="'节点类型'" :type="'select'" :options="nodeType" :width="185"  :id="'nodeNo'" :label="'name'" v-model="nodeName" @change="selectNode($event)"></inputTag>
      </div>
      <div class="node-list">
        <ul>
          <li v-for="(item,index) in nodeList" :key="index" :style="{background : !item.dragStatus ? 'rgba(137, 157, 178, 0.2)' :''}">
            <div :nodeNo="item.nodeNo" :nodeName="item.nodeCn" class="basicNode" :id="item.nodeNo" :draggable=item.dragStatus :isClick="isClick">
              <img src="~@img/flow/flowNode.png" width="18px" height="18px" />
              <div>{{item.nodeCn}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div id="flowCanvas" class="flow-canvas"></div>
    <div class="flow-info">
      <div class="background-set">
        <div>画板颜色</div>
        <div @click="canvasColor = ''" :class = "canvasColor == '' ? 'borderBg' : '' "></div>
        <div @click="canvasColor = 'dark'" :class = "canvasColor == '' ? '' : 'borderBg' "></div>
      </div>
      <div>
        <div class="info-title">流程属性</div>
        <div class="info">
          <div>
            <inputTag :prepend="'流程编号'" :type="'input'" :width="232" v-model="flowInfo.processNo" :disabled="editProcessNo == '' ? false : true" :class="submitErrors.processNo !='' ? 'errorInput' :''" @change="chargeProcessNo($event)"></inputTag>
            <div v-if="submitErrors.processNo" class="error">{{ submitErrors.processNo }}</div>
          </div>
          <div>
            <inputTag :prepend="'流程名称'" :type="'input'" :width="232" v-model="flowInfo.processName" :class="submitErrors.processName !='' ? 'errorInput' :''" @change="chargeProcessName($event)"></inputTag>
            <div v-if="submitErrors.processName" class="error">{{ submitErrors.processName }}</div>
          </div>
          <div>
            <inputTag :prepend="'适用条件'" :type="'select'" :options="filterCondtionArr" :width="232" v-model="flowInfo.filterCondtion" :id="'condNo'" :label="'condCn'" :class="submitErrors.filterCondtion !='' ? 'errorInput' :''"></inputTag>
            <div v-if="submitErrors.filterCondtion" class="error">{{ submitErrors.filterCondtion }}</div>
            <!-- <inputTag :prepend="'适用条件'" :type="'select'" :options="filterCondtionArr" :width="232" v-model="flowInfo.filterCondtion" :id="'condNo'" :label="'condCn'"  v-if="editProcessNo == ''"></inputTag>
            <inputTag :prepend="'适用条件'" :type="'select'" :options="filterCondtionArr" :width="232" v-model="flowInfo.filterCondtion" :id="'condNo'" :label="'condCn'"  v-else></inputTag> -->
          </div>
          <div>
            <inputTag :prepend="'创建人员'" :type="'input'" :width="232" v-model="flowInfo.createdBy" :disabled=true :placeholder="''"></inputTag>
          </div>
          <div>
            <inputTag :prepend="'创建部门'" :type="'input'" :width="232" v-model="flowInfo.createdDept" :disabled=true :placeholder="''"></inputTag>
          </div>
          <div>
            <inputTag :prepend="'创建时间'" :type="'input'" :width="232" v-model="flowInfo.createdTime" :disabled=true :placeholder="''"></inputTag>
          </div>
          <div class="remark" style="margin-left:26px;text-align:left;">描述</div>
          <div>
            <textarea v-model="flowInfo.remark" placeholder="在此输入描述信息" style="width:232px;height:80px" v-if="editProcessNo == ''" :class="submitErrors.remark !='' ? 'errorInput' :''"></textarea>
            <textarea v-model="flowInfo.remark" placeholder="" style="width:232px;height:80px" v-else :class="submitErrors.remark !='' ? 'errorInput' :''"></textarea>
            <div v-if="submitErrors.remark" class="error">{{ submitErrors.remark }}</div>
          </div>
        </div>
      </div>
    </div>
    <confirm-tip :visible="remove.visible" :data="remove.data" @handleSubmit="changeVisible()" @handleClose="closeDialog()" :info="remove.info"></confirm-tip>
  </div>
</template>

<script>
import Raphael from 'raphael'
import InputTag from '@view/InputTag/InputTag'
import { postData, postAllData } from '@/util/base'
import { debug } from 'util';
import { flowView, dragChildNode, flow, registerClick, removeRegisterClick , saveFlowData } from './flow'
import ConfirmTip from '@/views/home/common/ConfirmTip'
import { setTimeout } from 'timers';

export default {
  components: {
    InputTag,
    ConfirmTip
  },
  props: {
    visible: {
      type:Boolean,
      default:false
    },
    editProcessNo:{
      type:String,
      default:""
    },
    editClassify:{
      type:String,
      default:""
    }
  },
  data() {
    return {
      paperWidth: 1150,
      paperHeight: 830,
      paper: null,
      beginAndEnd: [
        {
          nodeNo: "N-START",
          nodeName: "开始",
          // url: "~@img/flow/beginNode.png"
        }, {
          nodeNo: "N-END",
          nodeName: "结束",
          // url: "~@img/flow/endNode.png"
        }
      ],
      nodeType: [{name:"航班节点",nodeNo:"F"},{name:"行李节点",nodeNo:"L"}],
      nodeName: "",
      nodeList: [],
      isCanvas: false,
      isClick: false,
      isCancle: false,
      isSave: false,
      flowInfo: {
        processName: "",
        filterCondtion: "",
        createdDept: "",
        createdBy: "",
        createdTime: "",
        remark: ""
      },
      filterCondtionArr: [],
      filterCondNoArr:[],
      remove:{
        visible:false,
        data:"",
        info:"确认要退出流程编辑状态？"
      },
      canvasColor: "",
      nodeSelect: false,
      beginDrag: true,
      endDrag: true,
      submitErrors: {
        processNo: "",
        processName: "",
        filterCondtion: "",
        remark: ""
      },
      errorStaus: false,
      beginDragStatus: true,
      endDragStatus: true
    }
  },
  created() {
    this.isCanvas = this.visible

    this.getAllFilters()
  },
  methods: {
    chargeProcessNo (event) {
      this.submitErrors.processNo = ""
      if (event.match(/^[ ]*$/)) {
        this.submitErrors.processNo = '必填'
        return
      }else if (event.length > 20) {
        this.submitErrors.processName = '数据长度不能超过20'
        return
      }
      this.flowInfo.processNo = event.toUpperCase()
      postData('process/checkProcessNoUnique',{"processNo" : this.flowInfo.processNo}).then((response) => {
        if(response.data.code == 0) {
          this.submitErrors.processNo =  this.editProcessNo == "" ? (!response.data.data.isUnique ? "流程编号已存在" : "") : ""
        }
      })
    },
    chargeProcessName (event) {
      this.submitErrors.processName = ""
      if (event.match(/^[ ]*$/)) {
        this.submitErrors.processName = '必填'
        return
      }else if (event.length > 50) {
        this.submitErrors.processName = '数据长度不能超过50'
        return
      }
      this.flowInfo.processName = event.toUpperCase()
      if((this.submitErrors.processNo == "" || this.submitErrors.processNo == "流程编号已存在")  && this.flowInfo.processNo != "") {
        let paramObj = {
          type: "",
          processNo: "",
          processName: ""
        }
        paramObj.type = this.editProcessNo == "" ? "add" : "update"
        paramObj.processNo = this.flowInfo.processNo
        paramObj.processName = this.flowInfo.processName

        paramObj = JSON.stringify(paramObj)

        postAllData(['process/checkProcessNoUnique','process/checkProcessNameUnique'],[{"processNo": this.flowInfo.processNo}, paramObj]).then(response => {
          if(response[0].data.code == 0 && response[1].data.code == 0){
            this.submitErrors.processNo = this.editProcessNo == "" ? (!response[0].data.data.isUnique ? "流程编号已存在" : "") : ""
            this.submitErrors.processName = !response[1].data.data.isUnique ? "流程名称已存在" : ""
          }
          })
      }
    },
    chargeFilter () {
      this.submitErrors.filterCondtion = ""
      this.submitErrors.filterCondtion = (this.flowInfo.filterCondtion == "" || this.flowInfo.filterCondtion == null) ? "必填" : ""
    },
    chargeRemark () {
      this.submitErrors.remark = "" 
      this.submitErrors.remark = (this.flowInfo.remark && this.flowInfo.remark.length > 100) ? "备注信息过长" : ""
    },
    getAllFilters() {
      postData('filterCondition/queryAll', {}).then(response => {//过滤条件简单信息
        if (response.data.code == 0) {
          for (let count = 0; count < response.data.data.length; count++) {
            if(!response.data.data[count].used) {//没有在已有流程中使用的过滤条件筛选
              this.filterCondtionArr.push({condNo:response.data.data[count].condNo,condCn:response.data.data[count].condCn})
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
    addRelation(event) {
      this.isClick = !this.isClick

      if (this.isClick) {
        registerClick(flow.nodeIdArr, this.paper)
      } else {
        removeRegisterClick(flow.nodeIdArr, this.paper)
      }
    },
    isExit(){
      this.remove.visible = true
      this.beginDragStatus = true
      this.endDragStatus = true
    },
    changeVisible() {
      this.isCanvas = !this.isCanvas

      flow.nodeIdArr = []
      this.remove.visible = false
      this.isClick = false
      this.beginDragStatus = true
      this.endDragStatus = true
      this.$emit('visibleChanged', this.isCanvas)
    },
    closeDialog(){
      this.remove.visible = false
    },
    selectNode(event) {
      if(flow.nodeIdArr.length > 0 && this.nodeList.length > 0) {
        this.nodeSelect = true
        return
      } 
      let classify = event
      let param = { "classify": classify }
      param = JSON.stringify(param)

      postData('process/queryNodeDefinition', param).then(response => {
        if (response.data.code == 0) {
          this.nodeList = []
          response.data.data.forEach((editVal) => {
            if(editVal.nodeCn != "开始" && editVal.nodeCn != "结束") {
              editVal.dragStatus = true
              this.nodeList.push(editVal)
            }
            if(this.editProcessNo != "") {
              for(let i = 0; i < flow.nodeIdArr.length; i++){
              let curentNode = this.paper.getById(flow.nodeIdArr[i]);
              if(curentNode && curentNode.nodeName == editVal.nodeCn) {
                if (editVal.nodeCn == '开始') {
                  this.beginDragStatus = false
                }else if(editVal.nodeCn == '结束') {
                  this.endDragStatus = false
                }else {
                  editVal.dragStatus = false
                }
                  break
              }
              }
            }
          })
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
    isErrorStatus() {
      this.errorStaus = false
      for (var item in this.submitErrors) {
        if (this.submitErrors.hasOwnProperty(item)) {
          if (this.submitErrors[item] && this.submitErrors[item] !== '') {
            this.errorStaus = true
            return
          }
        }
      }
    },
    saveFlow () {
      this.chargeProcessNo(this.flowInfo.processNo)
      this.chargeProcessName(this.flowInfo.processName)
      this.chargeFilter()
      this.chargeRemark()

      setTimeout(() => {
        this.isErrorStatus()
        if(this.errorStaus) {
          return
        }

        if (flow.nodeIdArr.length == 0) {
          this.$msg.error({
                info: '未添加节点 !',
                tip: "请先添加节点，再保存！"
          })
          return
        }

        let paramObj = saveFlowData(this.paper , flow.nodeIdArr)

        //判断节点间是否有关系
        if (paramObj.relationArray.length == 0) {
          this.$msg.error({
                info: '未添加节点关系 !',
                tip: "请先添加节点关系，再保存！"
          })
          return
        }else if(paramObj.relationArray.length < flow.nodeIdArr.length - 1) {
          this.$msg.error({
                info: '节点关系未添加完全 !',
                tip: "请先添加完节点关系，再保存！"
          })
          return
        }

        if(paramObj.timeSpanError) {
          this.$msg.error({
                info: '标准时间约束为长度不超过6位数字 !',
                tip: "请检查标准时间约束，再保存！"
          })
          return
        }

        paramObj.processNo = this.flowInfo.processNo
        paramObj.processName = this.flowInfo.processName
        paramObj.classify = this.editProcessNo == "" ? this.nodeName : this.editClassify
        paramObj.condNo = this.flowInfo.filterCondtion
        paramObj.remark = this.flowInfo.remark

        paramObj = JSON.stringify(paramObj)

        postData('process/saveProcess', paramObj).then(response => {
          if (response.data.code == 0) {
            //提示弹框
              this.$msg.success({
                info: '保存成功 !'
              })

              this.changeVisible()
          } else {
            //无数据的情况
          }
        }).catch(err => {
          this.$msg.error({
                info: '保存失败 !',
                tip: response.data.msg
          })
        })
      },500)
    },
    resetData(){
      this.nodeList = []
      this.nodeName = ""
      this.flowInfo.processNo = ""
      this.flowInfo.processName = ""
      this.flowInfo.filterCondtion = ""
      this.flowInfo.createdBy = ""
      this.flowInfo.createdDept = ""
      this.flowInfo.createdTime = ""
      this.flowInfo.remark = ""

      this.submitErrors.processNo = ""
      this.submitErrors.processName = ""
      this.submitErrors.filterCondtion = ""
      this.submitErrors.remark = ""

      this.nodeSelect = false
    },
    renderEditFlow(processNo){
      let paramObj = {
        processNo
      }
      paramObj = JSON.stringify(paramObj)

      postAllData(['process/queryProcess', 'filterCondition/queryAll'],[paramObj, {}]).then(response => {
          if (response[0].data.code == 0 && response[1].data.code == 0) {
          let responseData = response[0].data.data
          let filterData = response[1].data.data
          this.filterCondtionArr = []
          for (let count = 0; count < filterData.length; count++) {
            if(!filterData[count].used) {//没有在已有流程中使用的过滤条件筛选
              this.filterCondtionArr.push({condNo: filterData[count].condNo,condCn: filterData[count].condCn})
            }
            if(filterData[count].condNo == responseData.condNo) {
              this.filterCondtionArr.push({condNo: filterData[count].condNo,condCn: filterData[count].condCn})
            }
          }
          flowView(this.paper, responseData, [], true)
          this.flowInfo.processNo = responseData.processNo
          this.flowInfo.processName = responseData.processName
          this.flowInfo.filterCondtion = responseData.condNo
          this.flowInfo.remark = responseData.remark
          this.flowInfo.createdDept = responseData.createDept
          this.flowInfo.createdBy = responseData.createEmp
          this.flowInfo.createdTime = responseData.createtime
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
    chargeNodeType(){
      if(flow.nodeIdArr.length > 0 && this.nodeList.length > 0) {
        this.nodeSelect = true
      } 
    }
  },
  watch: {
    visible: {
      handler(value) {
        this.isCanvas = this.visible
        flow.nodeIdArr = []
        this.resetData()
        if (value) {
          this.$nextTick(() => {
            this.paperWidth = document.getElementById("flowCanvas").offsetWidth
            this.paperHeight = document.getElementById("flowCanvas").offsetHeight
            this.paper = Raphael('flowCanvas',this.paperWidth, this.paperHeight)
            dragChildNode(this.paper)

            if(this.editProcessNo != ""){
              this.beginDragStatus = false
              this.endDragStatus = false
              this.renderEditFlow(this.editProcessNo)
            }
          }
          )
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.errorInput{
  border: 1px solid rgba(247, 84, 103, 0.8);
  -webkit-box-shadow: 0 0 0 2px rgba(247, 84, 103, 0.3);
  box-shadow: 0 0 0 2px rgba(247, 84, 103, 0.3);
}

.error {
  color: #f75467;
  font-size: 10px;
}

.info-title {
  margin-left: 26px;
  text-align: left;
  color: #3d424d;
  font-size: 16px;
  font-weight: bold;
  font-family: "MicrosoftYaHei-Bold";
  line-height: 16px;
  margin-top: 23px;
  margin-bottom: 15px;
}

.info > div {
  margin-bottom: 15px;
}

.flow-info {
  width: 282px;
  background: #ffffff;
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  box-shadow: 0px 0px 8px 0px rgba(104, 129, 153, 0.2);
}

.draw-line {
  padding-top: 23px;
  background-position-y: top;
  background-repeat: no-repeat;
  background-image: url(~@img/flow/drawLine.png);
  color: #3D424D;
}

.select-line {
  padding-top: 23px;
  background-position-y: top;
  background-repeat: no-repeat;
  background-image: url(~@img/flow/hoverDrawLine.png);
  color: #3392FF;
  cursor: pointer;
}

.draw-cancle {
  padding-top: 23px;
  background-position-y: top;
  background-repeat: no-repeat;
  background-image: url(~@img/flow/cancle.png);
  color: #3D424D;
}

.select-cancle {
  padding-top: 23px;
  background-position-y: top;
  background-repeat: no-repeat;
  background-image: url(~@img/flow/cancleHover.png);
  color: #3392FF;
}

.draw-save {
  padding-top: 23px;
  background-position-y: top;
  background-repeat: no-repeat;
  background-image: url(~@img/flow/save.png);
  color: #3D424D;
}

.draw-line:hover,
.draw-cancle:hover,
.draw-save:hover {
  /* background: #3392ff; */
  cursor: pointer;
}

.flow-canvas {
  /* width: 1160px; */
  /* background: #ffffff; */
  /* height: 836px; */

  width: calc(100% - 502px);
  height: 100%;
}

.add-menu {
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

.darkMenu {
  background-color: #364A5C;
}

.flow-toolbar {
  background: #ffffff;
  width: 220px;
  overflow-x: hidden;
  overflow-y: auto;
  box-shadow: 0px 0px 8px 0px rgba(104, 129, 153, 0.2);
  font-family: "MicrosoftYaHei";
  font-size: 14px;
  color: #899db2;
  line-height: 16px;
  font-weight: 400;
  overflow: hidden;
}

.operator-img {
  display: flex;
  font-family: "MicrosoftYaHei";
  font-size: 14px;
  color: #3d424d;
  text-align: center;
  margin: 15px 0px 13px -20px;
}

.operator-img > div {
  margin-left: 43px;
}

.operator-img > div > img {
  margin-bottom: 2px;
}

.begin-end li > div {
  color: #ffffff;
  display: inline-flex;
  padding: 18px 45px 12px 45px;
}

.begin-end li > div img,
.node-list li > div img {
  margin-right: 5px;
}

.begin-end li:first-child {
  width: 187px;
  height: 50px;
  background: linear-gradient(
    -90deg,
    rgba(1, 182, 116, 0.8),
    rgba(120, 208, 106, 0.8)
  );
  box-shadow: 0px 10px 20px 0px rgba(110, 208, 97, 0.5);
  border-radius: 8px;
  margin: 0px 15px 15px 15px;
}

.begin-end li:last-child {
  width: 187px;
  height: 50px;
  background: #f79f2d;
  box-shadow: 0px 10px 20px 0px rgba(247, 161, 46, 0.5);
  border-radius: 8px;
  margin: 0px 15px 15px 15px;
}

.node-type {
  margin-top: 20px;
}

.node-list {
  margin-top: 15px;
  height: 570px;
  overflow: auto;
}

.node-list li {
  width: 187px;
  height: 50px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 8px 0px rgba(104, 129, 153, 0.16);
  border-radius: 8px;
  margin: 0px 15px 15px 15px;
}

.node-list li > div {
  display: inline-flex;
  color: #3d424d;
  font-size: 15px;
  text-align: center;
  padding: 18px 45px 12px 45px;
}

.borderBg {
  border:2px solid #3392FF;
}

.background-set {
  padding: 23px 0px 15px 0px;
  color: #3d424d;
  font-size: 16px;
  font-weight: bold;
  font-family: "MicrosoftYaHei-Bold";
  line-height: 16px;
  display: inline-flex;
  border-bottom: 1px solid #dde6ed;
}

.background-set div:nth-child(1) {
  margin-right: 120px;
}

.background-set div:nth-child(2) {
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

textarea {
  border: 1px solid #dde6ed;
}
</style>


