<template>
  <div>
    <div class="date-range-picker" v-if="dateRange.dateType == 'time'">
        <el-time-picker v-model="currentValue[dateRange.key1]" style="width: 47%;" :value-format="dateRange.valueFormat"
        :format="dateRange.format" :placeholder="'开始时间'" @change="handleDateChange"></el-time-picker>
        <span style="width: 4%; display: inline-block;"></span>
        <el-time-picker v-model="currentValue[dateRange.key2]" style="width: 47%;" :value-format="dateRange.valueFormat"
        :format="dateRange.format" :placeholder="'结束时间'" @change="handleDateChange"></el-time-picker>
    </div>
    <div class="date-range-picker" v-else>
      <el-date-picker v-model="currentValue[dateRange.key1]" :type="dateRange.dateType" style="width: 47%;" :value-format="dateRange.valueFormat"
      :format="dateRange.format" :placeholder="'开始时间2'" :picker-options="dateRange.hasOwnProperty('min') ? pickerOpt : {}" @change="handleDateChange"></el-date-picker>
        <span style="width: 4%; display: inline-block;"></span>
        <el-date-picker v-model="currentValue[dateRange.key2]" :type="dateRange.dateType" style="width: 47%;" :value-format="dateRange.valueFormat"
        :format="dateRange.format" :placeholder="'结束时间2'" :picker-options="dateRange.hasOwnProperty('max') ? pickerOpt : {}" @change="handleDateChange"></el-date-picker>
    </div>
  </div>
</template>

<script>
export default {
  props: ['dateRange', 'currentValue'],
  data () {
    return {
      pickerOpt: {
        disabledDate: (time) => {
          return (time.getTime() < new Date(this.dateRange.min).getTime() - 8.64e7) || (time.getTime() > new Date(this.dateRange.max).getTime())
        }
      }
    }
  },
  methods: {
    handleDateChange (event) {
      this.currentValue[this.dateRange.key] = {}
      this.$set(this.currentValue[this.dateRange.key], this.dateRange.key1, this.currentValue[this.dateRange.key1])
      this.$set(this.currentValue[this.dateRange.key], this.dateRange.key2, this.currentValue[this.dateRange.key2])
    }
  }
}
</script>
