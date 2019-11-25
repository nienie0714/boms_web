<template>
  <div class="my-transfer-panel el-transfer-panel">
    <p class="el-transfer-panel__header">
      <el-checkbox
        v-model="allChecked"
        @change="handleAllCheckedChange"
        :indeterminate="isIndeterminate">
        {{ title }}
        <span>{{ checkedSummary }}</span>
      </el-checkbox>
    </p>
    <div class="el-transfer-panel__select">
      <div class="prepend">选择部门</div>
      <el-select v-model="selectValue" clearable placeholder="全部">
        <el-option
          v-for="item in parentData"
          :key="item.deptId"
          :label="item.deptName"
          :value="item.deptId">
        </el-option>
      </el-select>
    </div>
    <div class="select_header">
      <span>姓名</span>
      <span>职务</span>
      <span>所属部门名称</span>
    </div>
    <div :class="['el-transfer-panel__body', hasFooter ? 'is-with-footer' : '']">
      <!-- <div style="">
        <div :key="item[keyProp]" v-for="(item, index) in filteredData"
        @click="handleClick(item, keyProp)"
        style="display: flex;">
          <div :class="['el-checkbox__input', ~checked.indexOf(item[keyProp])?'is-checked':'']"><div class="el-checkbox__inner"></div></div>
          <span :key="index">{{item[labelProp]}}</span>
        </div>

      </div> -->
      <!-- <div class="el-checkbox__inner" @click="handleClick"></div> -->
      <el-checkbox-group
        v-model="checked"
        v-show="!hasNoMatch && data.length > 0"
        :class="{ 'is-filterable': filterable }"
        class="el-transfer-panel__list">
        <el-checkbox
          class="el-transfer-panel__item"
          :label="item[keyProp]"
          :disabled="item[disabledProp]"
          :key="item[keyProp]"
          v-for="(item,index) in filteredData">
          <span :key="index" class="" :title="item[labelProp]">{{item[labelProp]}}</span>
          <span class="el-checkbox__label_center" :title="item.post">{{item.post}}</span>
          <span class="el-checkbox__label_right" :title="item.deptName">{{item.deptName}}</span>
        </el-checkbox>
      </el-checkbox-group>
      <p
        class="el-transfer-panel__empty"
        v-show="hasNoMatch"></p>
      <p
        class="el-transfer-panel__empty"
        v-show="data.length === 0 && !hasNoMatch"></p>
        <el-input
        class="el-transfer-panel__filter"
        v-model="query"
        size="small"
        :placeholder="placeholder"
        @mouseenter.native="inputHover = true"
        @mouseleave.native="inputHover = false"
        v-if="filterable">
        <i slot="prefix"
          :class="['el-input__icon', 'el-icon-' + inputIcon]"
          @click="clearQuery"
        ></i>
      </el-input>
    </div>
    <p class="el-transfer-panel__footer" v-if="hasFooter">
      <slot></slot>
    </p>
  </div>
</template>

<script>
  import Locale from './locale';
  export default {
    mixins: [Locale],
    name: 'MyTransferPanel',
    componentName: 'MyTransferPanel',
    components: {
      // OptionContent: {
      //   props: {
      //     option: Object
      //   },
      //   render(h) {
      //     const getParent = vm => {
      //       if (vm.$options.componentName === 'MyTransferPanel') {
      //         return vm;
      //       } else if (vm.$parent) {
      //         return getParent(vm.$parent);
      //       } else {
      //         return vm;
      //       }
      //     };
      //     const panel = getParent(this);
      //     const transfer = panel.$parent || panel;
      //     // console.log('panel----',panel)
      //     // console.log('transfer----',transfer)
      //     // return panel.renderContent
      //       // ? panel.renderContent(h, this.option)
      //       // : transfer.$scopedSlots.default
      //         // ? transfer.$scopedSlots.default({ option: this.option }):<span></span>
      //         // : <span>{ this.option[panel.labelProp] || this.option[panel.keyProp] }</span>;
      //   }
      // }
    },

    props: {
      data: {
        type: Array,
        default() {
          return [];
        }
      },
      parentData: {
        ype: Array,
        default() {
          return [];
        }
      },
      renderContent: Function,
      placeholder: String,
      title: String,
      filterable: Boolean,
      format: Object,
      filterMethod: Function,
      defaultChecked: Array,
      props: Object
    },

    data() {
      return {
        dataList: [],
        checked: [],
        allChecked: false,
        query: '',
        inputHover: false,
        checkChangeByUser: true,
        // 部门
        selectValue: '',

      };
    },
    created() {
      this.dataList = Object.assign([],this.data);
    },
    watch: {
      checked(val, oldVal) {
        this.updateAllChecked();
        if (this.checkChangeByUser) {
          const movedKeys = val.concat(oldVal)
            .filter(v => val.indexOf(v) === -1 || oldVal.indexOf(v) === -1);
          this.$emit('checked-change', val, movedKeys);
        } else {
          this.$emit('checked-change', val);
          this.checkChangeByUser = true;
        }
      },
      
      data(val) {
        this.dataList = Object.assign([],this.data);
      },

      dataList(val) {

        const checked = [];
        const filteredDataKeys = this.filteredData.map(item => item[this.keyProp]);
        this.checked.forEach(item => {
          if (filteredDataKeys.indexOf(item) > -1) {
            checked.push(item);
          }
        });
        this.checkChangeByUser = false;
        this.checked = checked;
      },
      

      checkableData() {
        this.updateAllChecked();
      },

      defaultChecked: {
        immediate: true,
        handler(val, oldVal) {
          if (oldVal && val.length === oldVal.length &&
            val.every(item => oldVal.indexOf(item) > -1)) return;
          const checked = [];
          const checkableDataKeys = this.checkableData.map(item => item[this.keyProp]);
          val.forEach(item => {
            if (checkableDataKeys.indexOf(item) > -1) {
              checked.push(item);
            }
          });
          this.checkChangeByUser = false;
          this.checked = checked;
        }
      },

      selectValue(val) {
        let s = []
        if(!val) {
          s = this.data;
        } else {
          s = this.data.filter(item => item[this.pkeyProp] == val);
        }
        this.dataList = Object.assign([],s);
      },  

    },

    computed: {
      filteredData: {
        get: function() {
          return this.dataList.filter(item => {
            if (typeof this.filterMethod === 'function') {
              return this.filterMethod(this.query, item);
            } else {
              const label = item[this.labelProp] || item[this.keyProp].toString();
              return label.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
            }
          });
        },
        set: function(newValue) {
          this.dataList = newValue;
        }
      },

      checkableData() {
        return this.filteredData.filter(item => !item[this.disabledProp]);
      },

      checkedSummary() {
        const checkedLength = this.checked.length;
        const dataLength = this.data.length;
        const { noChecked, hasChecked } = this.format;
        if (noChecked && hasChecked) {
          return checkedLength > 0
            ? hasChecked.replace(/\${checked}/g, checkedLength).replace(/\${total}/g, dataLength)
            : noChecked.replace(/\${total}/g, dataLength);
        } else {
          return `${ checkedLength }/${ dataLength }`;
        }
      },

      isIndeterminate() {
        const checkedLength = this.checked.length;
        return checkedLength > 0 && checkedLength < this.checkableData.length;
      },

      hasNoMatch() {
        return this.query.length > 0 && this.filteredData.length === 0;
      },

      inputIcon() {
        return this.query.length > 0 && this.inputHover
          ? 'circle-close'
          : 'search';
      },

      labelProp() {
        return this.props.label || 'label';
      },

      keyProp() {
        return this.props.key || 'key';
      },

      plabelProp() {
        return this.props.plabel || 'plabel';
      },

      pkeyProp() {
        return this.props.pkey || 'pkey';
      },

      disabledProp() {
        return this.props.disabled || 'disabled';
      },

      hasFooter() {
        return !!this.$slots.default;
      }
    },

    methods: {
      handleClick (item, key) {
        let index = _.findIndex(this.checked, [key, item[key]])
        if (~index) {
          this.checked.splice(index, 1)
        } else {
          this.checked.push(item[key])
        }
      },
      changeAuto($event) {
        if(this.allChecked) {
          this.allChecked = true
        } else {
          this.allChecked = false
        }
        
      },
      updateAllChecked() {
        const checkableDataKeys = this.checkableData.map(item => item[this.keyProp]);
        this.allChecked = checkableDataKeys.length > 0 &&
          checkableDataKeys.every(item => this.checked.indexOf(item) > -1);
      },

      handleAllCheckedChange(value) {
        this.checked = value
          ? this.checkableData.map(item => item[this.keyProp])
          : [];
      },

      clearQuery() {
        if (this.inputIcon === 'circle-close') {
          this.query = '';
        }
      }
    }
  };
</script>

<style lang="scss">
.my-transfer-panel {
  .select_header {
    height: 36px;
    line-height: 36px;
    display: flex;
    padding-left: 34px;
    background-color: #F1F5F8;
    border-top: 1px solid #DDE6ED;
    border-bottom: 1px solid #DDE6ED;
    span {
      color: #899DB2;
      font-weight: bold;
      text-align: left;
      // white-space: nowrap;
      // overflow: hidden;
      // text-overflow: ellipsis;
      &:nth-child(1) {
        width: 36%;
      }
      &:nth-child(2) {
        width: 24%;
      }
      &:nth-child(3) {
        width: 40%;
        border-right: none;
      }
    }
  }
  .el-transfer-panel__select {
    display: flex;
    margin: 10px;
    height: 38px;
    border: 1px solid #DDE6ED;
    border-radius: 6px;
    line-height: 38px;
    font-size: 14px;
    text-align: center;
    .prepend {
      flex: 0 0 80px;
      height: 100%;
      color: #899DB2;
      background-color: #F1F5F8;

    }
    .el-input__inner {
      display: block;
      height: 36px;
      line-height: 36px;
      text-align: center;
      border: none;
      &::placeholder {
        text-align: center!important;
      }
    }
    input:focus, input:hover, textarea:focus, textarea:hover, select:focus, select:hover {
      border: none;
      box-shadow: none;
    }
    
  }
  .el-transfer-panel__body {
    height: 300px;
    position: relative;
    .el-transfer-panel__list.is-filterable {
      height: 250px;
    }
    .el-transfer-panel__item {
      display: block;
      height: 40px;
      padding-left: 10px;
      margin-right: 0px;
      color: #899DB2;
      font-size: 14px;
      border-bottom: 1px solid #DDE6ED;
      &:last-child {
        border-bottom: none;
      }
      .el-checkbox__input {
        top: 13px;
        &.is-checked+.el-checkbox__label {
          color: #3D424D;
        }
      }
      .el-checkbox__label {
        line-height: 40px;
        display: flex;
        justify-content: space-between;
        
        >span:nth-child(1) {
          flex: 0 0 83px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        >span:nth-child(2) {
          flex: 0 0 50px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        >span:nth-child(3) {
          flex: 0 0 90px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
    .el-transfer-panel__filter {
      width: 248px;
      margin: 0 10px 10px;
      position: absolute;
      bottom: 0;
      .el-input__inner {
        display: block;
        height: 38px;
        padding-left: 36px;
        border-radius: 6px;
        line-height: 38px;
        font-size: 14px;
        text-align: left;
        border: 1px solid #DDE6ED;
        background-color: #F1F5F8;
        &::placeholder {
          color: #899DB2;
        }
      }
      .el-input__icon {
        font-size: 16px;
        line-height: 38px;
      }
    }
  }
}

</style>
