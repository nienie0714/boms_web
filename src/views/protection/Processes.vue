<template>
  <div id="processMenu" class="process-menu">
    <div class="process-list">
      <input type="text" placeholder="输入关键字搜索" class="search-input" @change="searchProcess($event)" />
      <div class="total-flow">
        <span>全部流程({{flowList.length}})</span>
      </div>
      <div class="flow-list">
        <ul>
          <li v-for="(item,index) in flowList" :key="index" :processNo="item.processNo" @click="clickItem($event)" :flowIndex="index" :class="index == checkLi ? 'selectLi' : 'normalLi'" :title="item.processName">
            <div :processNo="item.processNo">
              <img src="~@img/flow/itemImg.png" width="18px" height="18px" />
              <div>{{item.processName}}</div>
              <img src="~@img/flow/editflow.png" width="18px" height="18px" class="edit-img" title="编辑流程" @click="editFlow($event)" :processNo="item.processNo" :classify="item.classify">
              <img src="~@img/flow/deleteflow.png" width="18px" height="18px" class="edit-img" title="删除流程" :processNo="item.processNo" @click="isdelteFlow($event)" :flowIndex="index">
            </div>
          </li>
        </ul>
      </div>
      <div class="add-flow" @click="isAddFlow = !isAddFlow">
        <img src="~@img/flow/addflow.png" width="16px" height="16px" />
        <span>新建流程</span>
      </div>
    </div>
    <div id="myCanvas" class="my-canvas"></div>
    <div class="process-info">
      <div class="background-set">
        <div>画板颜色</div>
        <div @click="canvasBg = ''" :class = "canvasBg == '' ? 'borderBg' : '' "></div>
        <div @click="canvasBg = 'dark'" :class = "canvasBg == '' ? '' : 'borderBg' "></div>
      </div>
      <div class="process-define">
        <div>流程属性</div>
        <div class="flow-item">
          <ul>
            <li><div>流程名称：</div><div>{{flowItems.processName}}</div></li>
            <li><div>流程号：</div><div>{{flowItems.processNo}}</div></li>
            <li><div>流程适用条件：</div><div>{{flowItems.condCn}}</div></li>
            <li><div>创建部门：</div><div>{{flowItems.createDept}}</div></li>
            <li><div>创建人：</div><div>{{flowItems.createEmp}}</div></li>
            <li><div>创建时间：</div><div>{{flowItems.createtime}}</div></li>
            <li><div>描述：</div><div style="width: 190px">{{flowItems.remark}}</div></li>
          </ul>
        </div>
      </div>
      <div></div>
      <div></div>
    </div>
    <add-process :visible="isAddFlow" @visibleChanged="updateVisible" :editFlow="isEditFlow" :editProcessNo="editProcess" :editClassify="classify"></add-process>
    <confirm-tip :visible="remove.visible" :data="remove.data" :info="remove.info" @handleSubmit="deleteFlow()" @handleClose="closeDelDialog()"></confirm-tip>
  </div>
</template>

<script>
import Raphael from 'raphael'
import { postData } from '@/util/base'
import { flowView } from './flow'
import AddProcess from './AddProcess'
import ConfirmTip from '@/views/home/common/ConfirmTip'

export default {
  components: {
    AddProcess,
    ConfirmTip
  },
  data() {
    return {
      paper: null,
      paperWidth: 1150,
      paperHeight: 830,
      flowList: [],
      lightBackground: "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo3NjdkNmRmMS0wOTA0LWE1NGUtODQyNC0wYTVmZDI0YjM4MGMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzMzMzc1MEZCRDY1MTFFOUI1QkVFOUQ0MkE5MTJBMTgiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzMzMzc1MEVCRDY1MTFFOUI1QkVFOUQ0MkE5MTJBMTgiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OGU3YzRjY2YtZjM1MS1lZTRjLTg3NTMtNmJiZmM1ZWM4Y2Y5IiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6OWJmYjg1MjMtOTk3NC0xMWU5LWI1OWQtZWQ5YjVhZjIzMTUyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+KQSZPAAAADNJREFUeNpi/P//PwMtABMDjcCowaMGjyiDu+ZtLgVhWrmYkWiFo2XFqMGjBg+AwQABBgBjpQrG7CORBAAAAABJRU5ErkJggg==)",
      darkBackground: "",
      isAddFlow: false,
      flowItems: {
        processName:"",
        processNo:"",
        condCn:"",
        createDept:"",
        createEmp:"",
        createtime:"",
        remark:""
      },
      firstFlowNo: null,
      isEditFlow:false,
      editProcess:"",
      classify:"",
      checkLi:0,
      remove:{
        visible:false,
        data:"",
        info:"确认要删除此流程？"
      },
      deleteProcessNo:null,
      canvasBg:''
    }
  },
  created() {
    this.$nextTick(() => {
      document.getElementsByClassName('my-canvas')[0].style.backgroundImage = this.lightBackground
      this.paperHeight = document.getElementsByClassName('main')[0].offsetHeight - 15
      this.paperWidth = screen.availWidth == 1920 ? document.getElementsByClassName('main')[0].offsetWidth : document.getElementById('myCanvas').offsetWidth + 100
      this.paper = Raphael('myCanvas', this.paperWidth, this.paperHeight)
    })

    this.getFlowList()
  },
  mounted(){
    this.isAddFlow = false
  },
  destroyed() {
    if(document.getElementsByClassName('my-canvas')[0]) {
      document.getElementsByClassName('my-canvas')[0].style.backgroundImage = ""
    } 
    if(this.paper){
      this.paper.remove()
    }
  },
  methods: {
    searchProcess (event) {
      let val = event.target.value
      val = val.toUpperCase()
      this.getFlowList({"processName" : val})
    },
    updateVisible(val){
      this.isAddFlow = val
      this.isEditFlow = val
      this.editProcess = ""
      this.classify = ""
    },
    clearCanvas() {
      if(this.paper){
        this.paper.remove()
        this.paper = Raphael('myCanvas', this.paperWidth, this.paperHeight)
      }
    },
    getFlowList(paramObj) {
      let param = paramObj || {}
      this.checkLi = 0
      this.canvasBg = ''

      this.clearCanvas()
      postData('process/queryProcessDefinition',param).then(response => {
        if (response.data.code == 0) {
          if(response.data.data.length > 0) {
            this.flowList = response.data.data
            this.firstFlowNo = this.flowList[0].processNo
            this.renderFlow(this.firstFlowNo)
          }else {
            this.flowList = []
            this.flowItems.processName = ""
            this.flowItems.processNo = "" 
            this.flowItems.condCn = "" 
            this.flowItems.createDept = "" 
            this.flowItems.createEmp = "" 
            this.flowItems.createtime = "" 
            this.flowItems.remark = "" 
            this.$msg.error({
            info: '无匹配的流程！',
            tip: "请重新输入流程名"
          })
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
    clickItem(event) {
      if(event.target.className != "edit-img"){
        this.clearCanvas()
        let clickItem = event.target.tagName == "LI" ? event.target : event.target.parentNode.tagName == "LI" ? event.target.parentNode : event.target.parentNode.parentNode
        let processNo = clickItem.getAttribute("processNo")

        this.renderFlow(processNo)

        // clickItem.parentNode.children[this.checkLi].style.background = 'rgba(255,255,255,0)'
        // clickItem.style.background = '#dde6ed'
        this.checkLi = parseInt(clickItem.getAttribute("flowIndex")) 
      }
    },
    renderFlow(processNo) {
      let paramObj = {
        processNo
      }
      paramObj = JSON.stringify(paramObj)
      postData('process/queryProcess', paramObj).then(response => {
        if (response.data.code == 0) {
          let responseData = response.data.data
          flowView(this.paper, response.data.data, [], false)

          this.flowItems.processName = responseData.processName
          this.flowItems.processNo = responseData.processNo
          this.flowItems.condCn = responseData.condCn
          this.flowItems.createDept = responseData.createDept
          this.flowItems.createEmp = responseData.createEmp
          this.flowItems.createtime = responseData.createtime
          this.flowItems.remark = responseData.remark
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
    editFlow(event){
      this.isEditFlow = !this.isEditFlow
      this.isAddFlow = !this.isAddFlow
      this.editProcess = event.target.getAttribute("processNo")
      this.classify = event.target.getAttribute("classify")
    },
    isdelteFlow(event) {
      let currentProcessNo = this.flowList[event.target.getAttribute('flowindex')]
        this.deleteProcessNo = JSON.stringify({
          "processNo": currentProcessNo.processNo
        })
        this.remove.visible = true
    },
    deleteFlow() {//缺少删除接口
      postData('/process/delete', this.deleteProcessNo).then(response => {
          if(response.data.code == 0) {//删除成功
            this.$msg.success({
              info: '删除成功 !'
            })
            //刷新数据
            this.getFlowList()
          } else {
            this.$msg.success({
              info: response.data.msg
            })
          }

          this.remove.visible = false
          this.deleteProcessNo = ''
        })
    },
    closeDelDialog(){
      this.remove.visible = false
    }
  },
  watch:{
    isAddFlow:{
      handler(value){
        if(!value){
          this.getFlowList()
        }
      }
    },
    canvasBg:{
      handler(value) {
        if(value)  {
          document.getElementsByClassName('my-canvas')[0].style.backgroundColor = "#364A5C"
        }else{
          document.getElementsByClassName('my-canvas')[0].style.backgroundColor = "#E4EAF0"
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.flow-list{
  height: calc(100% - 60px);
  overflow-y: auto;
  overflow-x: hidden;
}

.my-canvas {
  width: calc(100% - 468px);
  overflow: auto;
  margin: -20px 0 -40px 0px;
}

.process-menu {
  display: flex;
}

.process-list {
  position: relative;
  background: #ffffff;
  width: 230px;
  overflow-x: hidden;
  overflow-y: hidden;
  margin: -20px 0 -40px -20px;
  box-shadow: 0px 0px 8px 0px rgba(104, 129, 153, 0.2);
  font-family: "MicrosoftYaHei";
  font-size: 14px;
  color: #899db2;
  line-height: 16px;
  font-weight: 400;
  /* position: absolute;
  height: calc(100% - 80px); */
}

.process-info {
  overflow: hidden;
  width: 282px;
  background: #ffffff;
  position: absolute;
  right: 0;
  top: 80px;
  height: calc(100% - 80px);
  box-shadow: 0px 0px 8px 0px rgba(104, 129, 153, 0.2);
}

.search-input {
  -webkit-appearance: none;
  width: 191px;
  height: 38px;
  background: rgba(221, 230, 237, 0.4);
  border-radius: 19px;
  margin: 24px 15px 21px 14px;
  text-align: left;
}

.total-flow {
  margin-bottom: 14px;
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.process-list ul li {
  text-align: left;
  height: 48px;
  color: #3d424d;
  font-size: 15px;
  line-height: 48px;
  cursor: default;
}

.process-list ul li > div{
  display: -webkit-box;
  margin: 0px 15px 0px 14px;
  border-bottom: 1px solid #dde6ed;
}

.process-list ul li:hover {
  background: #dde6ed;
  cursor: default;
}

/* .process-list ul li:first-child {
  background: #dde6ed;
  cursor: default;
} */

.selectLi {
  background-color: #dde6ed;
}

.normalLi {
  background-color: transparent;
}

.process-list ul li div > div{
  padding-left: 12px;
  width: 146px;
  height: 48px;
  line-height: 48px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.edit-img{
  display: none;
  margin-right: 2px;
}

.process-list ul li:hover .edit-img{
  display: inline-block;
  cursor: pointer;
}

.add-flow {
  width: 191px;
  height: 38px;
  background: #3392ffff;
  box-shadow: 0px 5px 15px 0px rgba(63, 153, 255, 0.3);
  border-radius: 6px;
  font-size: 14px;
  color: #ffffff;
  position: absolute;
  bottom: 20px;
  margin-left: 14px;
  line-height: 38px;
  text-align: center;
  cursor: pointer;
}

.add-flow span {
  padding-left: 8px;
}

.process-define {
  margin-left: 26px;
  text-align: left;
  color: #3d424d;
  font-size: 16px;
  font-weight: bold;
  font-family: "MicrosoftYaHei-Bold";
  line-height: 16px;
  margin-top: 23px;
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

.flow-item{
  margin-top: 15px;
  text-align: left;
  color: #899DB2;
  font-size: 14px;
  line-height: 28px;
}

.flow-item li{
  display: -webkit-box;
}

.borderBg {
  border:2px solid #3392FF;
}
</style>

