<template>
  <!-- 异常预警行李 -->
  <div>
    <my-dialog :visible="visible" :footer="false" :position="'right'" class="flt-detail-dialog lug-list-dialog under-head-dialog" @handleClose="handleClose">
    <template v-slot:header>
        <div class="title">{{isComp == 'ablug'?'异常预警行李':(isComp == 'load'?'卸机行李':'追加行李')}}</div>
    </template>    
      <tables :tableData="tableData" :loading="tableData.loading"><!--  @handleDblClick="showLugDetail" -->
        <template v-slot:slot-body="{index, row, item}">
          <template v-if="item.key == 'inOutFlag'">
            <div v-if="row[item.key] == 'D'">出港</div>
            <div v-if="row[item.key] == 'A'">进港</div>
          </template>
          <template v-if="item.key == 'nameCh'">{{row[item.key]?row[item.key]:(row['nameEn'])}}
          </template>
        </template>
      </tables>
    </my-dialog>
    <!-- 行李详情 -->
    <lug v-if="showComp.visible" :row="showComp.row"></lug>
  </div>
</template>

<script>
import Tables from '@view/Table/Table'
import Lug from './LugDetail'
import utilMixin from '@mixin/utilMixin'
import { queryAll } from '@/util/base'
import _ from 'lodash'

export default {
  components: {
    Tables,
    Lug
  },
  mixins: [utilMixin],
  props: ['row', 'isComp', 'isHistory'],
  data () {
    return {
      emptyTime: '----/--/-- --:--:--',
      visible: false,
      title: '异常预警行李',
      selectKey: '',
      showComp: {
        visible: false,
        lugUrl: '/integrated/luggage/detail',
        row: null
      },
      tableData: {
        key: '',
        value: null,
        url: '/integrated/dynamicFlight/queryFlightWaringNum',
        ablugUrl: '/integrated/dynamicFlight/queryFlightWaringNum',
        loadUrl: '/integrated/dynamicFlight/queryFlightNodeLug',
        addDUrl: '/integrated/dynamicFlight/queryFlightAdditionNum',
        addAUrl: '/integrated/dynamicFlight/queryFlightExtraLug',
        loading: false,
        queryParam: {
          dynamicFlightId: null
        },
        column: [
          [
            {key: 'flightNo',  label: '航班号', width: 100, title: true},
            {key: 'execDate', label: '航班日期', width: 100, format: [0, 10]},
            {key: 'inOutFlag', label: '进出港类型', width: 100, type: 'slot'},
            {key: 'lugNo',  label: '行李号', width: 60, colClass: 'bold-underline', class: 'bold', title: true, clickMethod: this.showLugDetail},
            {key: 'nodeNoCn',  label: '预警节点', width: 120, title: true,},
            {key: 'nameCh',  label: '旅客姓名', width: 100,title: true, type: 'slot'},
          ],
          [],
          []
        ],
        data: []
      }
    }
  },
  mounted () {
    window.onresize = () => {
      this.$nextTick(() => {
        return (() => {
          this.changeWindowSize()
        })()
      })
    }
  },
  methods: {
    changeData () {
      this.$nextTick(() => {
        this.changeWindowSize()
      })
      if(this.isComp == 'ablug') {
        this.$set(this.tableData.column, 0, [
          {key: 'flightNo',  label: '航班号', width: 100, title: true},
          {key: 'execDate', label: '航班日期', width: 100, format: [0, 10]},
          {key: 'inOutFlag', label: '进出港类型', width: 100, type: 'slot',},
          {key: 'lugNo',  label: '行李号', width: 100, colClass: 'bold-underline', class: 'bold', title: true, clickMethod: this.showLugDetail},
          {key: 'nodeNoCn',  label: '预警节点', width: 120, title: true,},
          {key: 'nameCh',  label: '旅客姓名', width: 120,title: true, type: 'slot'},
        ])
        this.tableData.queryParam.execDate = this.row.execDate.substr(0, 10);
        queryAll(this.tableData[this.isComp + 'Url'], this.tableData.queryParam).then(res => {
          if (res.data.code == 0) {
            this.tableData.data = res.data.data
          }
        })
      } else if(this.isComp == 'load') {
        this.$set(this.tableData.column, 0, [
          {key: 'flightNo',  label: '航班号', width: 140, title: true},
          {key: 'execDate', label: '航班日期', width: 100, format: [0, 10]},
          {key: 'inOutFlag', label: '进出港类型', width: 100, type: 'slot',},
          {key: 'lugNo',  label: '行李号', width: 140, colClass: 'bold-underline', class: 'bold', title: true, clickMethod: this.showLugDetail},
          {key: 'nameCh',  label: '旅客姓名', width: 160,title: true, type: 'slot'},
        ])

        queryAll(this.tableData[this.isComp + 'Url'], {
          flightNodeNo: "N-UNLOAD-AIRCRAFT", 
          dynamicFlightId: this.tableData.queryParam.dynamicFlightId,
          flightDate: this.row.execDate.substr(0,10),
          marking: '1'
        }).then(res => {
          if (res.data.code == 0) {
            this.tableData.data = res.data.data
          }
        })
      } else if(this.isComp == 'add') {
        this.$set(this.tableData.column, 0, [
          {key: 'flightNo',  label: '航班号', width: 140, title: true},
          {key: 'execDate', label: '航班日期', width: 100, format: [0, 10]},
          {key: 'inOutFlag', label: '进出港类型', width: 100, type: 'slot',},
          {key: 'lugNo',  label: '行李号', width: 140, colClass: 'bold-underline', class: 'bold', title: true, clickMethod: this.showLugDetail},
          {key: 'nameCh',  label: '旅客姓名', width: 160,title: true, type: 'slot'},
        ])

        queryAll(this.tableData[this.isComp + this.row.inOutFlag + 'Url'], this.row.inOutFlag == 'D' ?{
          inOutFlag: "D",
          dynamicFlightId: this.tableData.queryParam.dynamicFlightId,
          flightDate: this.row.execDate.substr(0,10)
        }:{
          flightNodeNo: "N-UNLOAD-AIRCRAFT", 
          dynamicFlightId: this.tableData.queryParam.dynamicFlightId,
          flightDate: this.row.execDate.substr(0,10)
        }).then(res => {
          if (res.data.code == 0) {
            this.tableData.data = res.data.data
          }
        })
      }
      
      this.visible = true
    },
    handleClose () {
      this.visible = false;
      this.$emit('closeablug');
    },
    showLugDetail (row) {
      let idObj;
      // if(this.isHistory) {
        idObj = {
          lugId: row['lugId'],
          execDate: row['execDate'].substr(0, 10)
        }
      // } else {
        // idObj = {
          // lugId: row['lugId']
        // }
      // }
      queryAll(this.showComp.lugUrl, idObj).then(res => {
        if (res.data.code == 0) {
          this.showComp.row = res.data.data
          this.showComp.visible = true
        } else {
          this.$msg.error({
            info: '获取详情失败 !',
            tip: res.data.msg
          })
        }
      })
    },
    changeWindowSize () {
      let dlgBody = document.getElementsByClassName('table-body')[1]
      if (dlgBody) {
        this.tableData.height = document.body.offsetHeight - document.getElementsByClassName('table-body')[1].getBoundingClientRect().top + 8
      }
    },
    formatHHMM (value) {
      if (value) {
        return value.substr(11, 5)
      } else {
        return '--:--'
      }
    },
    formatDate (value) {
        if (value) {
            return value.substr(0, 10)
        } else {
            return '----/--/--'
        }
    },
  },
  watch: {
    isComp: {
        handler (value) {
          if(value) {
            this.selectKey = value;
            // this.changeData()
          }    
        },
        immediate: true
    },
    row: {
        handler (data) {
          this.tableData.queryParam.dynamicFlightId = data.dynamicFlightId;
          this.changeData();
        },
        immediate: true
    }
  }
}
</script>

<style lang="scss">
.flt-detail-dialog {
  .dialog {
    >.main {
      height: calc(100% - 80px) !important;
    }
  }
}
.lug-list-dialog {
  .main>.body>.table {
    height: 100%!important;
  }     
}
</style>

<style lang="scss" scoped>
$bodyHead: 32px;
.dialog {
  width: 30px;
  height: 50px;
}
/deep/.left-table {
  overflow-y: auto!important;
}
.body {
  >.block {
    >.header {
      height: $bodyHead;
      line-height: $bodyHead;
      text-align: left;
      padding-left: 20px;
      font-size: 14px;
      color: $gray-nd;
      background-color: #edf1f5;
    }
    >.body {
      .row {
        margin: 0 20px;
        padding: 20px 0;
        &:not(:last-child) {
          border-bottom: 1px solid $gray-rs;
        }
        >.col {
          text-align: left;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          font-size: 16px;
          >.text {
            margin-top: 12px;
            margin-left: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: normal;
            word-break: break-all;
          }
        }
      }
    }
    .label {
      color: $gray-rd;
      font-size: 16px;
      height: 16px;
      line-height: 16px;
    }
    .text {
      color: $gray-st;
      font-size: 16px;
      height: 16px;
      line-height: 16px;
    }
    &.flt-block {
      &.block-first {
        justify-content: center;
        align-items: center;
        padding: 20px 20px 30px 20px;
        >.info {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: center;
          &:first-child {
            margin-right: 40px;
          }
          &:last-child {
            margin-left: 40px;
          }
          >.first-row {
            height: 16px;
            line-height: 16px;
            display: flex;
            justify-content: center;
          }
          >.second-row {
            height: 36px;
            line-height: 36px;
            font-size: 36px;
            font-weight: bold;
            margin: 20px 20px;
            font-family: 'DINPRO-MEDIUM-BOLD';
          }
          >.third-row {
            display: flex;
            >div {
              &:not(:first-child) {
                margin-left: 40px;
              }
              >div:last-child {
                margin-top: 12px;
              }
            }
          }
          >.time-block {
            $height: 20px;
            position: absolute;
            right: 10px;
            top: 28px;
            width: 36px;
            height: $height;
            font-size: 12px;
            font-weight: bold;
            color: #fff;
            border-radius: 6px;
            overflow: hidden;
            >div {
              height: 100%;
              width: 100%;
              line-height: $height;
            }
            .time-e {
              background-color: #33a6ff;
            }
            .time-s {
              background-color: #01b674;
            }
          }
        }
        >.img {
          width: 80px;
          height: 16px;
          margin-top: -36px;
          background-image: url(~@icon/icon_airline.png);
        }
      }
      >.body {
        padding-bottom: 10px;
      }
    }
    &.flt-lug-block {
      .body-second {
        overflow: hidden;
        >div {
          >.table-body {
            overflow-x: hidden;
          }
        }
        .mark {
          $wh: 16px;
          width: $wh;
          height: $wh;
          display: flex;
          align-items: center;
          &.marking {
            background-image: url(~@lug/mark_marking.png);
          }
        }
      }
    }
  }
}
.text {
  margin-left: 5px;
  word-break: break-all;
}
</style>
