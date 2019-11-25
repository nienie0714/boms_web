<template>
  <div class="input-tag" :style="`width: ${width}px`">
    <div v-if="prepend" class="prepend">{{prepend}}</div>
    <div class="value">
      <inputs v-if="type == 'input'" :type="type" v-model="currentValue"
      :defaultVal="defaultVal" :placeholder="placeholder" :disabled="disabled"
      :maxlength="maxlength" :minlength="minlength" :width="width"
      @change="change($event)" @enter="enter($event)"></inputs>
      <tab-button v-else-if="type == 'tab'" v-model="currentValue" :options="options" :id="id" :label="label" :require="required" :defaultVal="defaultVal" @click="change($event)"></tab-button>
      <el-select v-else-if="type == 'select'" v-model="currentValue" :disabled="disabled" :multiple="multiple" :multiple-limit="multipleLimit" :collapse-tags="multipleShow" :filterable="filterable" :clearable="clearable" @change="change($event)">
        <el-option v-for="(item, index) in options" :value="id ? item[id] : item" :key="index" :label="label ? item[label] : (id ? item[id] : item)"> </el-option>
      </el-select>
      <date-pickers v-else-if="type == 'datepicker'" :type="datetype" v-model="currentValue" :defaultVal="defaultVal" :placeholder="placeholder" :disabled="disabled" :max="max" :min="min" @change="change($event)"></date-pickers>
      <el-time-picker v-else-if="type == 'elTime'" v-model="currentValue" format="HH:mm" value-format="HH:mm" @change="change($event)" :clearable="clearable" :default-value="defaultValue"
        :picker-options="pickerOptions"
        placeholder="选择时间"></el-time-picker>
      <el-time-picker v-else-if="type == 'elTimeRange'" is-range v-model="currentValue" format="HH:mm" value-format="HH:mm" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" @change="change($event)" :default-value="defaultValue">
    </el-time-picker>
      <el-date-picker v-else-if="type == 'elDate'" popper-class="modifyPicker" :type="datetype" :picker-options="pickerOptions" v-model="currentValue" placeholder="选择日期" :format="format" :value-format="valueFormat" :clearable="clearable" @change="change($event)" :default-value="defaultVal" ></el-date-picker>
      <el-date-picker v-else-if="type == 'elDateTimeRange'" v-model="currentValue" :type="datetype" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :format="format" :value-format="valueFormat" :clearable="clearable" @change="change($event)" :default-value="defaultVal">
      </el-date-picker>
      <el-date-picker v-else-if="type == 'elDateRange'" v-model="currentValue" :type="datetype" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :format="format" :value-format="valueFormat" :clearable="clearable" @change="change($event)" :default-value="defaultVal">
      </el-date-picker>
      <el-input-number v-else-if="type == 'number'" v-model.trim.lazy="currentValue" controls-position="right" @change="change($event)" :min="minNumber" :max="maxNumber"></el-input-number>
      <!-- <selects v-else-if="type == 'selectPg'" v-model="currentValue" :options="options" :id="id" :label="label" :require="required" :defaultVal="defaultVal" @change="change($event)"></selects> -->
      <!-- <input-list v-else-if="type == 'inputlist'" v-model="currentValue" :options="options" :id="id" :label="label" :defaultVal="defaultVal" :placeholder="placeholder" @change="change($event)"></input-list> -->
      <input-list-more v-else-if="type == 'inputlistmore'" v-model="currentValue" :id="id" :label="label" :options="options" :disabled="disabled" @change="change($event)"></input-list-more>
      <!-- <Date-range-picker v-if="type == 'error'" v-model="currentValue[key]" :currentValue="currentValue" :dateRange="item"></Date-range-picker> -->
    </div>
    <div v-if="append" class="append">{{append}}</div>
  </div>
</template>

<script>
import Inputs from '@view/Inputs/Inputs'
import TabButton from '@view/TabButton/TabButton'
import InputList from '@view/InputList/InputList'
import Selects from '@view/Selects/Selects'
import InputListMore from '@view/InputListMore/InputListMore'
// import DateRangePicker from '@view/DateRangePicker/DateRangePicker'

export default {
  components: {
    Inputs,
    TabButton,
    InputListMore
  },
  props: {
    width: {
      type: Number,
      default: 292
    },
    type: {
      type: String,
      default: 'input'
    },
    datetype: {
      type: String,
      default: 'date' // datetime-local  date
    },
    value: {
      type: [String, Number, Object, Array],
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入'
    },
    prepend: {
      type: String,
      default: ''
    },
    append: {
      type: String,
      default: ''
    },
    // 单选
    options: {
      type: Array,
      default: function () { return [] }
    },
    // 多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 多选显示方式
    multipleShow: {
      type: Boolean,
      default: true
    },
    // 多选限制选项
    multipleLimit: {
      type: Number,
      default: 0
    },
    id: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: null
    },
    defaultVal: {
      type: [String, Number, Object, Array],
    },
    disabled: {
      type: Boolean,
      default: false
    },
    filterable: {
      type: Boolean,
      default: true
    },
    clearable: {
      type: Boolean,
      default: true
    },
    maxlength: {
      type: Number,
      default: null
    },
    minlength: {
      type: Number,
      default: null
    },
    max: {
      type: String,
      default: null
    },
    min: {
      type: String,
      default: null
    },
    minNumber: {
      type: Number,
      default: -Infinity
    },
    maxNumber: {
      type: Number,
      default: Infinity
    },
    dateValue: {
      type: Array,
      default: ()=>{
        return ['', '']
      }
    },
    format: {
      type: String,
      default: 'yyyy-MM-dd HH:mm'
    },
    valueFormat: {
      type: String,
      default: 'yyyy-MM-dd HH:mm'
    },
    defaultValue: {
      type: String,
    },
    pickerOptions: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  data () {
    return {
    }
  },
  methods: {
    change (val) {
      let tempVal = "" //增加变量过渡，直接赋值计算属性不生效
      if(!this.clearable && !val && (this.type == 'datepicker' || this.type == 'elDate' || this.type == 'elDateTimeRange' || this.type == 'elDateRange')) {
        tempVal = this.defaultVal ? this.defaultVal : val
      } else {
        tempVal = val
      }
      
      this.$emit('change', tempVal)
    },
    enter (val) {
      this.$emit('enter', val)
    }
  },
  watch: {
  },
  computed: {
    currentValue: {
      get: function () {
        return this.value
      },
      set: function (val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>
<style lang="scss">
.input-tag {
  display: inline-flex;
  border-radius: 6px;
  border: 1px solid rgba($color: $gray-border, $alpha: 1);
  height: 40px;
  box-sizing: border-box;
  font-size: 14px;

  >.prepend, >.append {
    display: inline-block;
    color: $gray-nd;
    line-height: 40px;
    padding: 0 12px;
    background-color: rgba($color: $gray-border, $alpha: .4);
  }
  >.value {
    display: inline-block;
    height: 100%;
    flex: 1;

    >.inputs, >.input-list {
      width: 100%;
      >input {
        vertical-align: 1px;
        border: none;
        // border-radius: 0;

        &:focus, &:hover {
          border: none;
          box-shadow: none;
        }
      }
    }

    >textarea {
        vertical-align: 1px;
        border: none;
        border-radius: 0;
        resize: none;

        &:focus, &:hover {
          border: none;
          box-shadow: none;
        }
    }

    >.selects {

      >select {
        vertical-align: 1px;
        border: none;
        border-radius: 0;

        &:focus, &:hover {
          border: none;
          box-shadow: none;
        }
      }
    }

    .ivu-select-large.ivu-select-single .ivu-select-selection {
      height: 38px;
    }
    .ivu-select {
      vertical-align: baseline!important;
    }
    .ivu-select-selection-focused, .ivu-select-selection:hover {
      border: none;
      box-shadow: none;
    }
    .ivu-select-visible .ivu-select-selection {
      border: none!important;
      box-shadow: none!important;
    }
    .ivu-select-selection {
      border: none!important;
    }
    .ivu-select-single .ivu-select-selection .ivu-select-placeholder, .ivu-select-single .ivu-select-selection .ivu-select-selected-value {
      height: 32px!important;
      line-height: 32px!important;
      font-size: 14px!important;
    }

    // 日期
    .ivu-input-large {
      height: 38px!important;
    }

    .ivu-input:focus {
      border: none!important;
      outline: 0;
      box-shadow: none!important;
    }
    .ivu-date-picker {
      width: 100%;
    }
    .ivu-date-picker-focused input {
      border: none!important;
      outline: 0;
      box-shadow: none!important;
    }
    .ivu-input:hover {
      border: none!important;
      outline: 0;
      box-shadow: none;
    }
    .ivu-input {
      border: none;
    }
    input:focus, input:hover, textarea:focus, textarea:hover, select:focus, select:hover {
      border: none;
      box-shadow: none;
    }

    >.tab-button {
      border: none;
      // border-radius: 0;
      margin: 0 auto;
    }

    .el-date-editor--datetimerange.el-input, .el-date-editor--datetimerange.el-input__inner,
    .el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner {
      width: 304px;
    }
    .el-date-editor--date.el-input, .el-date-editor--date.el-input__inner {
      width: 132px;
    }
    .el-date-editor--timerange {
      width: 200px;
      .el-range-separator {
        width: 11%;
      }
    }
    .el-input__inner {
      height: 38px;
      line-height: 38px;
      border: none;
    }

    .el-input-number {
      width: 90px!important;
    }
    .el-input-number.is-controls-right .el-input__inner {
      padding-right: 20px;
      padding-left: 5px;
    }
    .el-input-number__decrease, .el-input-number__increase {
      width: 20px;
    }

    .modifyPicker {
      position: absolute;
      z-index: 999;
    }
  }
  &:focus-within, &:hover {
    border: 1px solid rgba(63, 153, 255, 0.8);
    box-shadow: 0 0 0 2px rgba($color: $blue-shadow, $alpha: .3);
  }
}

input::-ms-input-placeholder {
    text-align: center;
}

input::-webkit-input-placeholder {
    text-align: center;
}
</style>
