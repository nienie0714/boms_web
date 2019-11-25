<template>
  <div>
    <my-dialog :visible="visible" :footer="false" :position="'right'" class="flt-detail-dialog lug-list-dialog under-head-dialog" @handleClose="handleClose">
      <template v-slot:header>
        <tabs :tabsData="tabsData" @tabItemClick="tabItemClick"></tabs>
      </template>
      <tables :tableData="tableData" :loading="tableData.loading">
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
    <lug v-if="showComp.visible" :row="showComp.row"></lug>
  </div>
</template>

<script>
import Tables from '@view/Table/Table'
import Tabs from '@view/Tabs/Tabs'
import Lug from './LugDetail'
import utilMixin from '@mixin/utilMixin'
import { queryAll } from '@/util/base'
import _ from 'lodash'

export default {
  components: {
    Tables,
    Tabs,
    Lug
  },
  mixins: [utilMixin],
  props: ['row', 'isComp', 'isHistory'],
  data () {
    return {
      emptyTime: '----/--/-- --:--:--',
      visible: false,
      title: '',
      selectKey: '0',
      tabsData: [
        {
          key: '0',
          label: '未分拣'
        },
        {
          key: '1',
          label: '已分拣'
        }
      ],
      showComp: {
        visible: false,
        lugUrl: '/integrated/luggage/detail',
        row: null
      },
      tableData: {
        key: '',
        value: null,
        truckUrl: '/integrated/dynamicFlight/queryFlightNodeLug',
        loadAircraftUrl: '/integrated/dynamicFlight/queryFlightNodeLug',
        loading: false,
        queryParam: {
          dynamicFlightId: null
        },
        column: [
          [
            {key: 'flightNo',  label: '航班号', width: 110, title: true},
            {key: 'execDate', label: '航班日期', width: 110, format: [0, 10]},
            {key: 'inOutFlag', label: '进出港类型', width: 100, type: 'slot'},
            {key: 'lugNo',  label: '行李号', width: 160, colClass: 'bold-underline', class: 'bold', title: true, clickMethod: this.showLugDetail},
            {key: 'nameCh',  label: '旅客姓名', width: 160,title: true, type: 'slot'},
          ],
          [],
          []
        ],
        data: []
      }
    }
  },
  mounted () {
    // window.onresize = () => {
    //   this.$nextTick(() => {
    //     return (() => {
    //       this.changeTableHeight()
    //     })()
    //   })
    // }
  },
  methods: {
    changeData () {
      this.$nextTick(() => {
        // this.changeTableHeight()
      })
      queryAll(this.tableData[this.isComp + 'Url'], {
          flightNodeNo: this.isComp == 'truck'?'N-LOAD-TRUCK':'N-LOAD-AIRCRAFT', 
          dynamicFlightId: this.tableData.queryParam.dynamicFlightId,
          flightDate: this.row.execDate.substr(0,10),
          marking: this.selectKey
        }).then(res => {
          if (res.data.code == 0) {
            this.tableData.data = res.data.data
          }
        })
      this.visible = true
    },
    handleClose () {
      this.visible = false
      this.$emit('closeTruck');
    },
    showLugDetail (row) {
      let idObj;
      idObj = {
        lugId: row['lugId'],
        execDate: row['execDate'].substr(0, 10)
      }
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
    changeTableHeight () {
      let dlgBody = document.getElementsByClassName('table-body')[1]
      if (dlgBody) {
        // dlgBody.parentNode.style.height = '100%';
        dlgBody.parentNode.style.height = dlgBody.parentNode.parentNode.offsetHeight;
      }
    },
    tabItemClick (key) {
      this.selectKey = key;
      this.changeData();
    },
    formatHHMM (value) {
      if (value) {
        return value.substr(11, 5)
      } else {
        return ''
      }
    },
    formatDate (value) {
      if (value) {
        return value.substr(0, 10)
      } else {
        return ''
      }
    },
  },
  watch: {
    isComp: {
      handler (value) {
        if(value == 'truck') {
          this.tabsData = [
            {key: '0', label: '未分拣'},
            {key: '1', label: '已分拣'}];
        } else if(value == 'loadAircraft') {
          this.tabsData = [
            {key: '0', label: '未装机'},
            {key: '1', label: '已装机'}];
        }
        this.selectKey = '0';
        
      },
      immediate: true
    },
    row: {
      handler (data) {
        this.tableData.queryParam.dynamicFlightId = data.dynamicFlightId;
        this.changeData()
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss">
.flt-detail-dialog {
  .dialog {
    >.header {
      height: 80px !important;
      .tabs {
        height: 38px;
        line-height: 24px;
      }
    }
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
  // /deep/>.main>.body>.table {
  //   height: 100%!important;
  // }
}
/deep/.left-table {
  overflow-y: auto!important;
}
.text {
  margin-left: 5px;
  word-break: break-all;
}
</style>
