<template>
  <div class="query-row">
    <div v-for="item in dataHis" :key="item.key" v-show="item.hasOwnProperty('type')" class="query-item">
      <input-tag v-model="item.value" :width="item.width" :type="item.type" :prepend="item.label" :append="item.endLabel" :placeholder="'请输入'"
      :options="item.options" :id="item.itemValue" :label="item.itemLabel" :require="item.require" :defaultVal="item.defaultVal"
      @change="handleChange(item.value)" @enter="handleEnter(item, $event)"></input-tag>
    </div>
  </div>
</template>

<script>
import InputTag from '@view/InputTag/InputTag'
import { queryAll } from '@/util/base'
import { getNewObjArr } from '@/util/util'

export default {
  components: {
    InputTag
  },
  props: {
    data: {
      type: Array
    }
  },
  model: {
    prop: 'data',
    event: 'change'
  },
  data () {
    return {
      dataHis: null,
    }
  },
  methods: {
    updateData (arr) {
      if (arr) {
        arr.forEach(index => {
          this.dataHis.splice(index, 1, this.data[index])
          if (this.dataHis[index].hasOwnProperty('url')) {
            queryAll(this.dataHis[index].url, this.data[index].param).then(res => {
              if (res.data.code == 0) {
                this.$set(this.data[index], 'options', res.data.data)
              } else {
                this.$msg.error({
                  info: '获取' + this.dataHis[index].label + '失败 !'
                })
              }
            })
          } else if (this.dataHis[index].hasOwnProperty('enumKey')) {
            this.$set(this.dataHis[index], 'options', this.$store.getters.getOptions(this.dataHis[index].enumKey))
          }
        })
      } else {
        this.data.forEach(item => {
          if (!item.hasOwnProperty('value')) {
            this.$set(item, 'value', '')
          }
          if (item.hasOwnProperty('url')) {
            queryAll(item.url, item.param).then(res => {
              if (res.data.code == 0) {
                this.$set(item, 'options', res.data.data)
              } else {
                this.$msg.error({
                  info: '获取' + item.label + '失败 !'
                })
              }
            })
          } else if (item.hasOwnProperty('enumKey')) {
            this.$set(item, 'options', this.$store.getters.getOptions(item.enumKey))
          }
        })
        this.$set(this, 'dataHis', _.partition(this.data, 'type')[0])
      }
    },
    handleChange (value) {
      this.$emit('change', value)
    },
    handleEnter (item, val) {
      if (item.toUpper) {
        this.toUpper(item, val)
      }
      this.$emit('handleEnter')
    },
    toUpper (item, val) {
      this.$set(item, 'value', val.trim().toUpperCase())
    }
  },
  watch: {
    data: {
      handler (data) {
        if (this.dataHis) {
          let arr = getNewObjArr(data, this.dataHis, ['key'], ['url', 'enumKey'])
          if (arr.length > 0) {
            this.updateData(arr)
          }
        } else {
          this.updateData()
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.query-row {
  flex-wrap: wrap;
}
.query-row, .query-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.query-item {
  flex-wrap: nowrap;
  flex-direction: column;
  &:not(:last-child) {
    margin-right: 10px;
  }
  >.label {
    font-size: 12px;
    margin-bottom: 5px;
    color: $blue;
    align-self: flex-start;
    visibility: hidden;
  }
  &:hover, &:focus-within {
    >.label {
      visibility: visible;
    }
  }
}
</style>
