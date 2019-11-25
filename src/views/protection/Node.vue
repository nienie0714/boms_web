<template>
  <!-- 作业节点管理 -->
  <div class="nodeContent">
    <div class="tableContent">
      <div class="tableLeft">
        <div>
          <table>
          <thead>
            <tr>
              <th v-for="(item,index) in tableTh" :key="index" style="font-weight:bolder;color:#718499">{{item}}</th>
            </tr>
          </thead>
          </table>
        </div>
        <div>
          <table>
          <tbody>
            <tr v-for="(item,index) in tableData" :key="index" :nodeIndex="index">
              <td>{{item.nodeNo}}</td>
              <td>{{item.nodeName}}</td>
              <td>{{item.nodeType}}</td>
              <td>{{item.adType}}</td>
              <td>{{item.createEmp}}</td>
              <td>{{item.createtime}}</td>
              <td>
                <div>
                  <div :nodeNo="item.nodeNo" :nodeName="item.nodeName" :nodeIndex="index" @click="editNode($event)"></div>
                  <div :nodeNo="item.nodeNo" :nodeName="item.nodeName" :nodeIndex="index" :isUsed="item.used" @click="deleteNode($event)"></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>
    </div>
    <div class="nodeHeader">
      <div class="nodeLeft"><span>节点列表</span><span>共{{tableData.length}}条数据</span></div>
      <div class="nodeRight" @click="changeAdd()"><img src="~@img/flow/add.png" width="20px" height="20px">新增
      </div>
    </div>
    <my-dialog :visible='isShowAdd || isShowEdit' :title="isShowAdd ? nodeInsertTitle : nodeEditTitle" @handleClose="closeDialog()" @submitDialog="submitNodeInfo()" :top='dialogTop'>
      <div class="nodeDailog">
        <div class="childFirst">
          <div>
            <inputTag :prepend="'节点编号'" :type="'input'" :width="292" v-model="nodeInfo.nodeNo" v-if="isShowAdd" :class="submitErrors.nodeNo !='' ? 'errorInput' :''"></inputTag>
            <inputTag :prepend="'节点编号'" :type="'input'" :width="292" :placeholder="nodeInfo.nodeNo" :disabled=true v-else></inputTag>
            <div v-if="submitErrors.nodeNo" class="error">{{ submitErrors.nodeNo }}</div>
          </div>
          <div>
            <inputTag :prepend="'节点名称'" :type="'input'" :width="292" v-model="nodeInfo.nodeName" :class="submitErrors.nodeName !='' ? 'errorInput' :''"></inputTag>
            <div v-if="submitErrors.nodeName" class="error">{{ submitErrors.nodeName }}</div>
          </div>
        </div>
        <div class="childFirst">
          <div>
            <inputTag :prepend="'节点类型'" :type="'select'" :options="nodeType" :width="292" v-model="nodeInfo.nodeType" :class="submitErrors.nodeType !='' ? 'errorInput' :''"></inputTag>
            <div v-if="submitErrors.nodeType" class="error">{{ submitErrors.nodeType }}</div>
          </div>
          <div>
            <inputTag :prepend="'进出港标识'" :type="'inputlistmore'" :options="adType" :width="292" v-model="nodeInfo.adType" :id="'adType'" :label="'label'" :class="submitErrors.adType !='' ? 'errorInput' :''"></inputTag>
            <div v-if="submitErrors.adType" class="error">{{ submitErrors.adType }}</div>
          </div>
        </div>
        <div class="remark">描述</div>
        <div class="remark-textarea">
          <textarea width='400' v-model="nodeInfo.remark" placeholder="在此输入备注信息" :class="submitErrors.remark !='' ? 'errorInput' :''" maxlength="100"></textarea>
          <div v-if="submitErrors.remark" class="error">{{ submitErrors.remark }}</div>
        </div>
        <div class="childFirst">
          <div>
            <inputTag :prepend="'创建者'" :type="'input'" :width="292" :placeholder="isShowAdd ? '' : nodeInfo.createdby" :disabled=true></inputTag>
          </div>
          <div>
            <inputTag :prepend="'创建时间'" :type="'input'" :width="292" :placeholder="isShowAdd ? '' : nodeInfo.createdTime" :disabled=true></inputTag>
          </div>
        </div>
      </div>
    </my-dialog>
    <confirm-tip :visible="remove.visible" :data="remove.data" :info="remove.info" @handleSubmit="sureDelte()" @handleClose="closeDelDialog()" :submit="remove.submit"></confirm-tip>
  </div>
</template>

<script>
  import { postData, postAllData } from '@/util/base'
  import InputTag from '@view/InputTag/InputTag'
  import ConfirmTip from '@/views/home/common/ConfirmTip'

  export default {
    components: {
      InputTag,
      ConfirmTip
    },
    data() {
      return {
        dialogTop:80,
        tableTh: ['节点编号', '节点名称', '节点类型', '进出港标识', '创建者', '创建时间','操作'],
        tableData: [],
        isShowAdd: false,
        isShowEdit: false,
        nodeType: ['航班节点', '行李节点', '航班行李节点'],
        adType: [{ adType: '进港', label: '进港' }, { adType: '出港', label: '出港' }],
        nodeInsertTitle: '节点信息新增',
        nodeEditTitle: '节点信息编辑',
        remove: {
          visible: false,
          data: '',
          info: "确认要删除此节点？",
          submit: true
        },
        nodeInfo: {
          nodeNo: '',
          nodeName: '',
          nodeType: '',
          adType: '',
          remark: '',
          createdby: '',
          createdTime: ''
        },
        submitErrors: {
          nodeNo: '',
          nodeName: '',
          nodeType: '',
          adType: '',
          remark: ''
        },
        errorStaus: false,
        deleteNodeNo: ''
      }
    },
    created() {
      this.initTableData()
    },
    methods: {
      //初始化数据
      initTableData() {
        postData('nodeDefinition/queryAll', {}).then(response => {
          if(response.data.code == 0) {
            this.tableData = response.data.data
            this.formatData()
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
      closeDelDialog() {
        this.remove.visible = false
        this.remove.submit = true
      },
      deleteNode(event) {
        let currentNode = this.tableData[event.target.getAttribute('nodeindex')]
        this.remove.visible = true
        this.remove.info = currentNode.used ? '此"'+ currentNode.nodeName +'"节点已在流程中使用，不允许删除！' : '确认要删除"'+ currentNode.nodeName +'"节点信息？'
       
        if(currentNode.used){
           this.remove.submit = false
           return
        }
        this.deleteNodeNo = JSON.stringify({
          "nodeNo": currentNode.nodeNo
        })
      },
      sureDelte() {
        postData('nodeDefinition/delete', this.deleteNodeNo).then(response => {
          if(response.data.code == 0) {//删除成功
            this.$msg.success({
              info: '删除成功 !'
            })
            //刷新数据
            this.initTableData()
          } else {
            this.$msg.success({
              info: response.data.msg
            })
          }

          this.remove.visible = false
          this.deleteNodeNo = ''
        })
      },
      editNode(event) {
        this.changeEdit()
        let currentNode = this.tableData[event.target.getAttribute('nodeindex')]
        this.nodeInfo.nodeName = currentNode.nodeName
        this.nodeInfo.nodeNo = currentNode.nodeNo
        this.nodeInfo.nodeType = currentNode.nodeType
        if(currentNode.reserved2 == 'A') {
          this.nodeInfo.adType = ['进港']
        } else {
          this.nodeInfo.adType = currentNode.reserved2 == 'AD' ? ['进港', '出港'] : ['出港']
        }
        this.nodeInfo.remark = currentNode.remark
        //创建者和创建时间
        this.nodeInfo.createdby = currentNode.createEmp
        this.nodeInfo.createdTime = currentNode.createtime
      },
      formatData() {
        if(this.tableData && this.tableData.length > 0) {
          for(var t = 0; t < this.tableData.length; t++) {
            this.tableData[t].nodeName = this.tableData[t].nodeCn
            this.tableData[t].nodeType = this.tableData[t].classify == 'LF' ? '航班行李节点' :(this.tableData[t].classify == 'L' ? '行李节点' : '航班节点') 
            if(this.tableData[t].reserved2 == 'A') {
              this.tableData[t].adType = '进港'
            } else {
              this.tableData[t].adType = this.tableData[t].reserved2 == 'AD' ? '进港，出港' : '出港'
            }
          }
        }
      },
      closeDialog() {
        if(this.isShowEdit) {
          this.changeEdit()
        }
        if(this.isShowAdd) {
          this.changeAdd()
        }
      },
      changeAdd() {
        this.isShowAdd = !this.isShowAdd
        this.resetData()
      },
      changeEdit() {
        this.isShowEdit = !this.isShowEdit
        this.resetData()
      },
      resetData() {
        this.submitErrors = {
          nodeNo: '',
          nodeName: '',
          nodeType: '',
          adType: '',
          remark: ''
        }
        this.nodeInfo = {
          nodeNo: '',
          nodeName: '',
          nodeType: '',
          adType: '',
          remark: '',
          createdby: '',
          createdTime: ''
        }
      },
      isErrorStatus() {
        this.errorStaus = false
        for(var item in this.submitErrors) {
          if(this.submitErrors.hasOwnProperty(item)) {
            if(this.submitErrors[item] && this.submitErrors[item] !== '') {
              this.errorStaus = true
              return
            }
          }
        }
      },
      dataCheck () {
        if(!this.nodeInfo.nodeName || this.nodeInfo.nodeName == '') {
          this.submitErrors.nodeName = '必填'
          } else {
            //节点名称长度限制：0~50
            this.nodeInfo.nodeName = this.nodeInfo.nodeName.toUpperCase()
            if(this.nodeInfo.nodeName.length > 4) {
              this.submitErrors.nodeName = '数据长度不能超过4'
            } else {
              this.submitErrors.nodeName =  this.submitErrors.nodeName == "节点名称已存在" ? this.submitErrors.nodeName : ''
            }
          }
          
        //节点类型、进出港标识必选
        if(!this.nodeInfo.nodeType || this.nodeInfo.nodeType == '') {
          this.submitErrors.nodeType = '必填'
        } else {
          this.submitErrors.nodeType = ''
        }
        if(!this.nodeInfo.adType || this.nodeInfo.adType == '') {
          this.submitErrors.adType = '必填'
        } else {
          this.submitErrors.adType = ''
        }

        this.submitErrors.remark = (this.nodeInfo.remark && this.nodeInfo.remark.length > 100) ? "备注信息过长" : ""
        //判断提交状态，是否可以向后台提交数据
        this.isErrorStatus()
        if(this.errorStaus) {
          return
        }

        let data = {
          "nodeNo": this.nodeInfo.nodeNo,
          "nodeCn": this.nodeInfo.nodeName,
          "classify": this.nodeInfo.nodeType,
          "reserved1": '000',
          "reserved2": this.nodeInfo.adType == '进港' ? 'A' : 'D',
          // "createby": this.nodeInfo.createdby,
          //备注字段
          "remark":this.nodeInfo.remark
        }

        if(this.nodeInfo.nodeType == '航班节点'){
          data.classify = 'F'
        }else{
          data.classify = this.nodeInfo.nodeType == '行李节点' ? 'L' : 'FL'
        }

        if(this.nodeInfo.adType.length == 1) {
          data.reserved2 = this.nodeInfo.adType[0] == '进港' ? 'A' : 'D'
        } else {
          data.reserved2 = 'AD'
        }

        data = JSON.stringify(data)

        postData('nodeDefinition/save', data).then(response => {
          let responseStatus = response.data.code
          if(responseStatus == 0) {//保存成功
            //提示弹框
            this.$msg.success({
              info: '保存成功 !'
            })
            this.initTableData()
          } else {//保存失败
            this.$msg.error({
              info: '保存失败 !',
              tip: response.data.msg
            })
          }
        })

        //重置数据状态
        this.closeDialog()
      },
      submitNodeInfo() {
        if(!this.nodeInfo.nodeNo || this.nodeInfo.nodeNo == '') {
          this.submitErrors.nodeNo = '必填'
          this.dataCheck()
        } else {
          this.nodeInfo.nodeNo = this.nodeInfo.nodeNo.toUpperCase()
          //节点编号唯一性校验，字母，小写转大写，长度限制20
          if(this.nodeInfo.nodeNo.length > 20) {
            this.submitErrors.nodeNo = '数据长度不能超过20'
            this.dataCheck()
          }else {
            if(!this.nodeInfo.nodeName || this.nodeInfo.nodeName == '') {
              this.submitErrors.nodeName = '必填'
            } else {
              //节点名称长度限制：0~50
              this.nodeInfo.nodeName = this.nodeInfo.nodeName.toUpperCase()
              if(this.nodeInfo.nodeName.length > 4) {
                this.submitErrors.nodeName = '数据长度不能超过4'
              } else {
                this.submitErrors.nodeName = ''
              }
            }
            let paramObj = {
              type: "",
              nodeNo: "",
              nodeCn: ""
            }
            paramObj.type = this.isShowEdit ? "update" : "add"
            paramObj.nodeNo = this.nodeInfo.nodeNo
            paramObj.nodeCn = this.nodeInfo.nodeName

            paramObj = JSON.stringify(paramObj)
            if(this.submitErrors.nodeName != "") {
              postData('nodeDefinition/checkNodeNoUnique',{"nodeNo": this.nodeInfo.nodeNo}).then(response => {
                this.submitErrors.nodeNo = this.isShowAdd ? (!response.data.data.isUnique ? "节点编号已存在" : "") : ""
                this.dataCheck()
              })
            }else {
              postAllData(['nodeDefinition/checkNodeNoUnique', 'nodeDefinition/checkNodeCnUnique'],[{"nodeNo": this.nodeInfo.nodeNo},paramObj]).then(response => {
                this.submitErrors.nodeNo = this.isShowAdd ? (!response[0].data.data.isUnique ? "节点编号已存在" : "") : ""
                this.submitErrors.nodeName = !response[1].data.data.isUnique ? "节点名称已存在" : ""
                this.dataCheck()
              })
            } 
          }
        }
      }
    }

  }
</script>

<style scoped lang="scss">
.errorInput{
  border: 1px solid rgba(247, 84, 103, 0.8);
  -webkit-box-shadow: 0 0 0 2px rgba(247, 84, 103, 0.3);
  box-shadow: 0 0 0 2px rgba(247, 84, 103, 0.3);
}

.error {
  color: #f75467;
  font-size: 10px;
}

.container cross dialog{
  top:80px;
}

  .remark {
    font-size: 14px;
    margin-bottom: 10px;
    color: #899db2;
    text-align: left;
    margin-left: 20px;
  }

  textarea {
    width: 600px;
    height: 120px;
    overflow: hidden;
    border: 1px solid #dde6ed;
    margin-bottom: 10px;
  }
  .childFirst {
    display: flex;
    max-height: 60px;
  }

  .childFirst > div {
    margin-left: 20px;
    margin-bottom: 20px;
  }

  .nodeTitle {
    font-size: 16px;
    color: #3d424d;
    font-weight: bold;
    margin: 0 auto;
  }

  .nodeContent {
    height: 100%;
    border-radius: 10px;
    background: #ffffff;
    /* height: 724px; */
  }

  .nodeHeader {
    display: flex;
    justify-content: space-between;
    height: 52px;
    padding: 0 20px;
    border-top: 1px solid $gray-border;
  }

  .nodeLeft {
    width: calc(100% - 75px);
    text-align: left;
    line-height: 52px;
    font-size: 16px;
  }

  .nodeLeft span:first-child {
    font-weight: bold;
  }

  .nodeLeft span:nth-child(2) {
    margin-left: 20px;
    color: #899db2;
  }


  .nodeRight {
    color: #3392ff;
    font-size: 14px;
    font-weight: bold;
    line-height: 52px;
    cursor: pointer;
  }
  .nodeRight img {
    float: left;
    margin-top: 16px;
    margin-right: 5px;
  }

  .tableContent {
    height: calc(100% - 52px);
    display: flex;
    border-top: 1px solid #dde6ed;
    box-sizing: border-box;
    text-align: left;
    overflow-y: auto;
    border-top: none
  }

  .tableLeft {
    width: 1140px;
    overflow: hidden;
  }

  .tableLeft > div:nth-child(2) {
    height: calc(100% - 33px);
    overflow-y: auto;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
    text-align: center;
  }
  table th {
    width: 238px;
    max-width: 238px;
    max-height: 32px;
    height: 32px;
    line-height: 32px;
    background-color: rgba(221, 230, 237, 0.2);
    border-bottom: 1px solid #dde6ed;
    font-weight: normal;
    font-size: 14px;
    color: #90a3b6;
  }

  table td {
    width: 238px;
    
    /* max-width: 238px; */
  }

  table tr:nth-child(2n) {
    /* background: #f5f7f9; */
  }

  table thead tr {
    height: 32px;
  }
  table tr {
    height: 49px;
    line-height: 49px;
    font-size: 15px;
    color: #3d424d;
    border-bottom: 1px solid rgb(221, 230, 237);
    box-sizing: border-box;
  }

  table tr div {
    display: flex;
  }

  table tr div div:first-child {
    background-image: url(~@img/flow/edit.png);
    width: 24px;
    height: 24px;
    margin-left: 140px;
    cursor: pointer;
  }

  table tr div div:first-child:hover {
    background-image: url(~@img/flow/hoverEdit.png);
  }

  table tr div div:nth-child(2) {
    background-image: url(~@img/flow/delete.png);
    width: 24px;
    height: 24px;
    margin-left: 10px;
  }

  table tr div div:nth-child(2):hover {
    background-image: url(~@img/flow/hoverDelete.png);
  }

  .nodeRight:hover {
    opacity: 0.8;
  }



table {
  text-align: left;
}

.tableLeft{
  width:100%;
}

.tableLeft table th,table td{
  padding-left: 20px;
}

.tableLeft table{
  width: inherit;
}

.tableLeft table th:last-child{
  text-align: right;
  padding-right: 20px;
}

.tableLeft table td:last-child > div {
  float: right;
  padding-right: 20px;
}
</style>

