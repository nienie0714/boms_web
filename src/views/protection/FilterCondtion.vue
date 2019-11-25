<template>
  <div class="nodeContent">
    <!-- <div class="nodeHeader">
      <div class="nodeLeft">
        <span>过滤条件列表</span>
        <span>共{{tableData.length}}条数据</span>
      </div>
      <div class="nodeRight" @click="changeAdd()">
        <img src="~@img/flow/add.png" width="20px" height="20px" />
        <div>新增</div>
      </div>
    </div> -->
    <div class="tableContent">
      <div class="tableLeft">
        <div>
          <table>
          <thead>
            <tr>
              <th v-for="(item,index) in tableTh" :key="index" style="font-weight:bolder;color:#718499" :style="{width:item.width}">{{item.name}}</th>
            </tr>
          </thead>
          </table>
        </div>
        <div>
          <table>
          <tbody>
            <tr v-for="(item,index) in tableData" :key="index" :condIndex="index">
              <td>{{item.condNo}}</td>
              <td>{{item.condCn}}</td>
              <td>{{item.tableName}}</td>
              <td>{{item.remark}}</td>
              <td>
                <div>
                  <div :condNo="item.condNo" :condIndex="index" @click="editCond($event)"></div>
                  <div :condNo="item.condNo" :condIndex="index" :condName="item.condCn" @click="deleteCond($event)"></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>
    </div>
    <div class="nodeHeader">
      <div class="nodeLeft">
        <span>过滤条件列表</span>
        <span>共{{tableData.length}}条数据</span>
      </div>
      <div class="nodeRight" @click="changeAdd()">
        <img src="~@img/flow/add.png" width="20px" height="20px" />
        <div>新增</div>
      </div>
    </div>
    <my-dialog :visible="isShowAdd || isShowEdit" :title="isShowAdd ? condInsertTitle : condEditTitle" @handleClose="closeDialog()" @submitDialog="submitCondInfo()" :top="dialogTop">
      <div class="nodeDailog">
        <div class="childFirst">
          <div>
            <inputTag :prepend="'编号'" :type="'input'" :width="292" v-model="condsInfo.condNo" v-if="isShowAdd" :class="submitErrors.condNo !='' ? 'errorInput' :''"></inputTag>
            <inputTag :prepend="'编号'" :type="'input'" :width="292" :placeholder="condsInfo.condNo" :disabled="true" v-else></inputTag>
            <div v-if="submitErrors.condNo" class="error">{{ submitErrors.condNo }}</div>
          </div>
          <div>
            <inputTag :prepend="'名称'" :type="'input'" :width="292" v-model="condsInfo.condCn" :class="submitErrors.condCn !='' ? 'errorInput' :''"></inputTag>
            <div v-if="submitErrors.condCn" class="error">{{ submitErrors.condCn }}</div>
          </div>
        </div>
        <div class="remark">备注</div>
        <div>
          <textarea width="400" v-model="condsInfo.remark" placeholder="在此输入备注信息" :class="submitErrors.remark !='' ? 'errorInput' :'remarkText'"></textarea>
          <div v-if="submitErrors.remark" class="error">{{ submitErrors.remark }}</div>
        </div>
        <div class="remark">过滤条件项</div>
        <div class="childFirst">
          <div class="conds" @click="appendConds($event)" sqlval="AND">与</div>
          <div class="conds" @click="appendConds($event)" sqlval="OR">或</div>
          <div class="conds" v-for="item in conds" :key="item.tableName" @click="getFilterTableKeys($event)" :tableName="item.tableName">{{item.tableNameCn}}</div>
        </div>
        <div class="childFirst">
          <div class="conds" v-for="item in operator" :key="item.symbol" @click="appendConds($event)" :symbol="item.symbol" :sqlval="item.sqlval">{{item.symbol}}</div>
        </div>
        <div class="sql-cn-en" :class="submitErrors.condSql !='' ? 'errorInput' :''">
          <div class="createConds">
            <div class="condsItem" id="condsItem">{{condsPlace}}</div>
          </div>
          <div class="condsButs">
            <button @click="backToPrev">回删</button>
            <button @click="clearAll">清空</button>
            <button @click="viewSql">预览</button>
          </div>
          <div class="viewConds">{{sqlPlace}}</div>
        </div>
        <div true class="error">{{submitErrors.condSql}}</div>
      </div>
    </my-dialog>
    <confirm-tip :visible="remove.visible" :data="remove.data" :info="remove.info" @handleSubmit="sureDelte()" @handleClose="closeDelDialog()" :submit="remove.submit"></confirm-tip>
  </div>
</template>

<script>
import { postData, remove, postAllData } from '@/util/base'
import InputTag from '@view/InputTag/InputTag'
import ConfirmTip from '@/views/home/common/ConfirmTip'

export default {
  components: {
    InputTag,
    ConfirmTip
  },
  data() {
    return {
      conds: [],
      dialogTop: 80,
      tableTh: [{ name: '编号', width: '380px' }, { name: '名称', width: '380px' }, { name: '对应表', width: '400px' }, { name: '备注', width: '630px' }, { name: '操作', width: '100px' }],
      condsPlace: '请点击上方按钮拼接条件',
      sqlPlace: '生成SQL条件预览',
      tableData: [],
      elementArr: [],
      operator: [{ cn: '等于', symbol: '=' ,sqlval: '=' }, { cn: '大于', symbol: '>' ,sqlval: '>' }, { cn: '不等于', symbol: '≠' ,sqlval: '!=' }, { cn: '包含', symbol: 'in(' ,sqlval: 'in(' }, { cn: '左括号', symbol: '(' ,sqlval: '(' }, { cn: '右括号', symbol: ')' ,sqlval: ')' }, { cn: '是否', symbol: 'IS' ,sqlval: 'IS' }],
      isShowAdd: false,
      isShowEdit: false,
      condInsertTitle: '过滤条件新增',
      condEditTitle: '过滤条件编辑',
      remove: {
        visible: false,
        data: '',
        info:'确认要删除该过滤条件？',
        submit: true
      },
      condsInfo: {
        condNo: '',
        condCn: '',
        remark: '',
        condSql: '',
        condDisplaly: ''
      },
      submitErrors: {
        condNo: '',
        condCn: '',
        condSql: '',
        remark: ''
      },
      errorStaus: false,
      deleteCondIds: {},
      currentTable: '',
      target: {
        index: null,
        name: null
      },
      editTableCn:null
    }
  },
  created() {
    this.initTableData()
    this.getFilterTables()
  },
  methods: {
    getFilterTables() {//获取所有过滤条件表信息
      postData('filterCondition/queryFilterTable', {}).then(response => {
        if (response.data.code == 0) {
          this.conds = response.data.data
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
    initTableData() {//初始化所有过滤条件数据
      postData('filterCondition/queryAll', {}).then(response => {
        if (response.data.code == 0) {
          this.tableData = response.data.data
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
    appendSelectNode(data,tableName) {
      this.condsPlace = ''
      let tempNode = document.createElement('select')
      tempNode.style.cssFloat = 'left'
      tempNode.style.color = '#3392FF'
      tempNode.style.background = 'rgba(51, 146, 255, 0.1)'
      tempNode.style.marginLeft = '20px'
      let tempHtml = ''
      tempHtml += '<option sqlval=' + tableName +'>' + this.currentTable + '</option>'
      data.forEach((node) => {
        tempHtml += '<option sqlval=' + node.columnName + '>' + node.columnNameCn + '</option>'
      })
      tempNode.innerHTML = tempHtml

      return tempNode
    },
    getFilterTableKeys(event) {//根据过滤条件表名，获取过滤条件选项
      let selectEle = document.getElementById("condsItem")

      let tableName = event.target.getAttribute('tablename')
      this.currentTable = event.target.innerHTML
      let currentSelect = null
      let ishasSelect = false

      for (let se = 0; se < selectEle.children.length; se++) {
        if ((selectEle.children[se].tagName == "SELECT" && this.currentTable != selectEle.children[se].children[0].value) || (selectEle.children[se].getAttribute("tablecn") && this.currentTable != selectEle.children[se].getAttribute("tablecn"))) {
          ishasSelect = true
          postData('filterCondition/queryFilterColumn', { "tableName": tableName }).then(response => {
            console.log(event.target.getAttribute('tablename'))
            if (response.data.code == 0) {
              currentSelect = this.appendSelectNode(response.data.data,event.target.getAttribute('tablename'))
              selectEle.replaceChild(currentSelect, selectEle.children[se])
              //缓存的dom数组需要更改
              return
            }
          })
        }
      }

      if (!ishasSelect) {
        postData('filterCondition/queryFilterColumn', { "tableName": tableName }).then(response => {
          if (response.data.code == 0) {
            currentSelect = this.appendSelectNode(response.data.data,event.target.getAttribute('tablename'))
            this.elementArr.push(currentSelect)
            selectEle.append(currentSelect)
          }
        })
      }
    },
    appendConds(event) {//追加条件项
      this.condsPlace = ''
      let parentDiv = document.getElementById('condsItem')
      let childNode = event.target.cloneNode(true)
      this.elementArr.push(childNode)
      parentDiv.append(childNode)

      if (event.target.getAttribute('symbol') && event.target.getAttribute('symbol') != ')') {
        let inputNode = document.createElement('input')
        inputNode.style.cssFloat = 'left'
        inputNode.style.background = 'rgba(51, 146, 255, 0.1)'
        inputNode.style.marginLeft = '20px'
        inputNode.style.color = '#3392FF'
        inputNode.style.width = '130px'
        
        this.elementArr.push(inputNode)
        parentDiv.append(inputNode)

        inputNode.setSelectionRange(1,1)
        inputNode.focus()
      }
    },
    backToPrev() {//回删
      let parentElement = document.getElementById('condsItem')
      if (parentElement.children.length > 0) {
        let lastChild = parentElement.children[parentElement.children.length - 1]
        parentElement.removeChild(lastChild)

        this.elementArr.splice(this.elementArr.length - 1,1)
      }
    },
    clearAll() {
      document.getElementById('condsItem').innerHTML = ""
      this.condsPlace = "请点击上方按钮拼接条件"
      this.sqlPlace = "生成SQL条件预览"
      this.elementArr = []
    },
    getCondSql() {
      let element = document.getElementById('condsItem')
      let condSql = "";
      for (let t = 0; t < element.children.length; t++) {
        if (element.children[t].tagName == 'INPUT') {
            condSql += (element.children[t].getAttribute('sqlval') || element.children[t].value) + " "
          } else {
            if (element.children[t].tagName == "SELECT") {
              let selectedIndex = element.children[t].selectedIndex
              condSql += (element.children[t].options[selectedIndex].getAttribute('sqlval')) + " "
            } else {
              condSql += (element.children[t].getAttribute('sqlval') || element.children[t].value) + " "
            }
          }
      }
      return condSql
    },
    getCondDisplay() {
      let ele = document.getElementById('condsItem')
      let condDisplay = "";
      for (let i = 0; i < ele.children.length; i++) {
        if (i > 0) {
          if ((ele.children[i].tagName == 'INPUT' || ele.children[i].getAttribute('symbol') == ')') && ele.children[i + 1]) {
            condDisplay += (ele.children[i].value || ele.children[i].getAttribute('sqlval')) + " "
            condDisplay += (ele.children[0].value || ele.children[0].getAttribute('sqlval')) + " "
          } else {
            condDisplay += (ele.children[i].value || ele.children[i].getAttribute('sqlval')) + " "
          }
        }
      }
      return condDisplay
    },
    viewSql() {
      // this.sqlPlace = this.getCondDisplay()
      this.sqlPlace = this.getCondSql()
    },
    closeDelDialog() {
      this.remove.visible = false
      this.remove.submit = true
    },
    deleteCond(event) {
      let currentCondItem = this.tableData[event.target.getAttribute('condindex')]
      this.deleteCondIds = {}
      this.deleteCondIds.ids = []
      this.deleteCondIds.ids.push(currentCondItem.condNo)
      this.deleteCondIds = JSON.stringify(this.deleteCondIds)

      this.remove.visible = true
      this.remove.info = currentCondItem.used ? '此"'+ currentCondItem.condCn +'"过滤条件已在流程中使用，不允许删除！' : '确认要删除"'+ currentCondItem.condCn +'"过滤条件信息？'
      this.remove.submit = currentCondItem.used ? false : true
    },
    sureDelte() {
      remove('filterCondition', this.deleteCondIds).then(response => {
        if (response.data.code == 0) {//删除成功
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
        this.deleteCondIds = {}
      })
    },
    stringToNode(string) {
      this.elementArr = []
      let condsDom = document.getElementById('condsItem')
      for (let s = 0; s < string.length; s++) {
        if (string[s].type == "INPUT") {
          let inputNode = document.createElement('input')
          inputNode.value = string[s].value
          inputNode.setAttribute('sqlval', string[s].value)

          inputNode.style.cssFloat = 'left'
          inputNode.style.background = 'rgba(51, 146, 255, 0.1)'
          inputNode.style.marginLeft = '20px'
          inputNode.style.color = '#3392FF'
          inputNode.style.width = '130px'
          
          condsDom.append(inputNode)
          this.elementArr.push(inputNode)

          inputNode.setSelectionRange(1,1)
          inputNode.focus()
        } else if (string[s].type == "SELECT") {
          let selectNode = document.createElement("div")
          selectNode.className = "conds"
          selectNode.innerHTML = string[s].value
          selectNode.setAttribute("sqlval", string[s].sqlval)

          condsDom.append(selectNode)
          this.elementArr.push(selectNode)
          selectNode.setAttribute("tableName", string[s].tableName)
          selectNode.setAttribute("tableCn", string[s].tableCn)
          selectNode.setAttribute("index", s)
          //注册点击事件，加载select
          selectNode.addEventListener('click', (event) => {
            this.target.index = parseInt(event.target.getAttribute("index"))
            this.target.name = event.target.innerHTML
            postData('filterCondition/queryFilterColumn', { "tableName": event.target.getAttribute("tableName") }).then(response => {
              if (response.data.code == 0) {
                let tempNode = document.createElement('select')
                tempNode.style.cssFloat = 'left'
                tempNode.style.color = '#3392FF'
                tempNode.style.background = 'rgba(51, 146, 255, 0.1)'
                tempNode.style.marginLeft = '20px'
                let tempHtml = ''
                tempHtml += '<option sqlval=' + event.target.getAttribute("tableName") + '>' + event.target.getAttribute("tableCn") + '</option>'
                response.data.data.forEach((node) => {
                  tempHtml += '<option sqlval=' + node.columnName + '>' + node.columnNameCn + '</option>'
                })
                tempNode.innerHTML = tempHtml

                let parentDiv = document.getElementById('condsItem')
                parentDiv.replaceChild(tempNode, parentDiv.children[this.target.index])
              }
            })
          })
        } else {
          let divNode = document.createElement("div")
          divNode.className = "conds"
          divNode.innerHTML = string[s].value
          divNode.setAttribute("sqlval", string[s].sqlval)
          divNode.setAttribute("symbol", string[s].value)

          condsDom.append(divNode)
          this.elementArr.push(divNode)
        }
      }
    },
    editCond(event) {
      this.changeEdit()
      let currentCondItem = this.tableData[parseInt(event.target.getAttribute('condindex'))]
      this.condsInfo.condNo = currentCondItem.condNo
      this.condsInfo.condCn = currentCondItem.condCn
      this.condsInfo.remark = currentCondItem.remark
      // this.sqlPlace = currentCondItem.condDisplay
      this.sqlPlace = currentCondItem.condSql

      this.condsPlace = ""

      let currentCondsql = currentCondItem.jaCondSqlJson //DOM信息数组
      // currentCondsql = [{ "type": "DIV", "value": "与" }, { "type": "SELECT", "value": "航班过滤条件表", "tableName": "VIEW_FLIGHT" }, { "type": "DIV", "value": "=" }, { "type": "INPUT", "value": "载人" }]

      this.$nextTick(() => {
        this.stringToNode(currentCondsql)
      })
    },
    closeDialog() {
      if (this.isShowEdit) {
        this.changeEdit()
      }
      if (this.isShowAdd) {
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
      this.elementArr = []

      this.condsInfo.condNo = ""
      this.condsInfo.condCn = ""
      this.condsInfo.remark = ""
      this.condsPlace = "请点击上方按钮拼接条件"
      this.sqlPlace = "生成SQL条件预览"

      this.submitErrors.condNo = ""
      this.submitErrors.condCn = ""
      this.submitErrors.condSql = ""
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
    dataCheck(insertParam) {
      //数据校验
      //1、非空校验，过滤条件编号唯一性校验，长度限制为20
      //2、非空校验，过滤条件名称唯一性校验，长度限制为50
      //3、SQL语句非空校验
      this.submitErrors.condNo = ""
      this.submitErrors.condCn = ""
      this.submitErrors.condSql = ""
      this.submitErrors.remark = ""
      if(insertParam.condNo == "" || !insertParam.condNo) {
        this.submitErrors.condNo = "必填"
      }else {
        this.submitErrors.condNo = insertParam.condNo.length > 20 ? '数据长度不能超过20' : ""
        insertParam.condNo = insertParam.condNo.toUpperCase()
        this.condsInfo.condNo = this.condsInfo.condNo.toUpperCase()
      }
      if(insertParam.condCn == "" || !insertParam.condCn) {
        this.submitErrors.condCn = "必填"
      }else {
        this.submitErrors.condCn = insertParam.condCn.length > 50 ? '数据长度不能超过50' : ""
        insertParam.condCn = insertParam.condCn.toUpperCase()
        this.condsInfo.condCn = this.condsInfo.condCn.toUpperCase()
      }
      
      if(this.condsPlace == "请点击上方按钮拼接条件") {
        this.submitErrors.condSql = "必填"
      }

      if(this.condsInfo.remark && this.condsInfo.remark.length > 100) {
        this.submitErrors.remark = "备注信息过长"
      }

      let paramObj = {
        type: "",
        condNo: "",
        condCn: ""
      }
      paramObj.type = this.isShowEdit ? "update" : "add"
      paramObj.condNo = insertParam.condNo
      paramObj.condCn = insertParam.condCn

      paramObj = JSON.stringify(paramObj)

      //唯一性校验
      if(this.submitErrors.condNo == "") {
        if(this.submitErrors.condCn == "") {
          postAllData(['filterCondition/checkCondNoUnique','filterCondition/checkCondCnUnique'],[{"condNo": insertParam.condNo}, paramObj]).then(response => {
            if(response[0].data.code == 0 && response[1].data.code == 0){
              this.submitErrors.condNo = this.isShowAdd ? (!response[0].data.data.isUnique ? "过滤条件编号已存在" : "") : ""
              this.submitErrors.condCn = !response[1].data.data.isUnique ? "过滤条件名称已存在" : ""

              this.submitRequest(insertParam)
            }
          })
        }else {
          postData("filterCondition/checkCondNoUnique",{"condNo": insertParam.condNo}).then((response) => {
            if(response.data.code == 0) {
              this.submitErrors.condNo = this.isShowAdd ? (!response.data.data.isUnique ? "过滤条件编号已存在" : "") : ""
              this.submitRequest(insertParam)
            }
          })
        }
      }else {
        this.submitRequest()
      }
    },
    submitRequest(insertParam) {
      this.isErrorStatus()
      if(this.errorStaus) {
        return
      }

      insertParam = JSON.stringify(insertParam)

      postData('filterCondition/save', insertParam).then(response => {
        let responseStatus = response.data.code
        if (responseStatus == 0) {//保存成功
          //提示弹框
          this.$msg.success({
            info: '保存成功 !'
          })
          this.initTableData()
          this.isShowAdd = false
          this.isShowEdit = false
        } else {//保存失败
          this.$msg.error({
            info: 'SQL拼接有误，保存失败!',
            tip: "请检查SQL"
          })
        }
      })
    },
    nodeToString(node) {
      let tempNode = document.createElement("div")
      tempNode.appendChild(node.cloneNode(true))
      var str = tempNode.innerHTML
      tempNode = node = null
      return str
    },
    submitCondInfo() {
      let insertParam = {}

      let allEleArrs = []
      for (let el = 0; el < this.elementArr.length; el++) {
        let elementObj = {}
        elementObj.type = this.elementArr[el].tagName
        if (elementObj.type == "DIV") {
          elementObj.value = this.elementArr[el].innerHTML
          elementObj.sqlval = this.elementArr[el].getAttribute("sqlval")
        } else if (elementObj.type == "INPUT") {
          elementObj.value = this.elementArr[el].value
        } else if (elementObj.type == "SELECT") {
          //当前选中字段
          elementObj.value = this.elementArr[el].selectedOptions[0].value
          elementObj.sqlval = this.elementArr[el].selectedOptions[0].getAttribute("sqlval") 
          // elementObj.value = this.elementArr[el].children[0].value
          elementObj.tableName = this.elementArr[el].children[0].getAttribute('sqlval')
          insertParam.tableName = elementObj.tableName
          elementObj.tableCn = this.elementArr[el].children[0].value
        }
        allEleArrs.push(elementObj)
      }

      insertParam.condNo = this.condsInfo.condNo
      insertParam.condCn = this.condsInfo.condCn
      // insertParam.tableName = "VIEW_LUGGAGE" //待确认，唯一
      insertParam.condSql = this.getCondSql()
      insertParam.condDisplay = this.getCondDisplay()
      insertParam.remark = this.condsInfo.remark
      insertParam.jaCondSqlJson = allEleArrs

      this.dataCheck(insertParam)
    }
  }

}
</script>

<style lang="scss" scoped>
.errorInput{
  border: 1px solid rgba(247, 84, 103, 0.8);
  -webkit-box-shadow: 0 0 0 2px rgba(247, 84, 103, 0.3);
  box-shadow: 0 0 0 2px rgba(247, 84, 103, 0.3);
}

.error {
  color: #f75467;
  font-size: 10px;
}

select {
  float: left;
}

.condsItem {
  text-align: left;
  font-size: 14px;
}

.remarkText {
  height: 80px;
}

.sql-cn-en{
  border-radius: 8px;
  margin-left: 20px;
  width: 600px;
  border: 1px solid #dde6ed;
}

.createConds {
  overflow-y: auto;
  border-radius: 8px;
  width: 600px;
  height: 150px;
  padding-left: 20px;
}

.viewConds {
  text-align: left;
  margin-top: 8px;
  width: 600px;
  border-top: 1px solid #dde6ed;
  height: 180px;
  padding-left: 20px;
  font-size: 14px;
}

.condsButs {
  padding-left: 380px;
  padding-top: 8px;
}

.condsButs button {
  margin-right: 12px;
}

.condsButs button:last-child {
  color: white;
  background: linear-gradient(to right, #46a6f9, #578cfe);
}

/deep/.conds {
  float: left;
  color: #3392ff;
  font-size: 14px;
  border-radius: 4px;
  padding: 0 5px 0 5px;
  line-height: 34px;
  text-align: center;
  height: 34px;
  margin-left: 20px;
  margin-bottom: 20px;
  background: rgba(51, 146, 255, 0.1);
  cursor: pointer;
}

.dialogClass {
  top: 80px;
}



table {
  text-align: left;
}

.tableLeft, .tableLeft > div {
  width: 100%;
}

.tableLeft {
  overflow: hidden;
}

.tableLeft table th,
table td {
  padding-left: 20px;
}

.tableLeft table {
  width: inherit;
}

.tableLeft > div:nth-child(2) {
    height: calc(100% - 33px);
    overflow-y: auto;
  }

.container cross dialog{
  top:80px;
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
    border-radius: 10px;
    background: #ffffff;
    // height: 724px;
    height: 100%;
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
    width: 60px;
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
    max-width: 238px;
  }

  table tr:nth-child(2n) {
    // background: #f5f7f9;
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
    margin-left: 100px;
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

/deep/.footer {
  z-index: 9;
}
</style>

