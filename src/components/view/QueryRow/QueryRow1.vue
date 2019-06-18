<template>
  <div class="query-row">
    <div v-for="(item, index) in data" :key="item.key" class="query-item">
      <div class="label">{{ item.label }}</div>
      <div class="value" :style="item.hasOwnProperty('width')?`width: ${item.width}px;`:''">
        <input v-if="item.type == 'datalist'" v-model="item.value" :list="item.key" style="width: inherit;" :placeholder="'请输入'+item.label" @keyup.enter.stop="handleEnter(item, $event)"/>
        <component :is="item.type" :id="item.key" v-model="item.value" :type="item.inputType" :min="item.min" :max="item.max"
        class="value-component" :placeholder="'请输入'+item.label"
        @blur="item.toUpper&&toUpper(item, $event)"
        @change="handleChange(index, $event)" @keyup.enter.stop="handleEnter(item, $event)">
          <template v-if="item.type=='datalist'">
            <option v-for="(opt, idx) in item.options" :key="idx" :value="(opt.constructor==Object)?opt[item.itemValue]:opt">{{(opt.constructor==Object)?opt[item.itemLabel]:opt}}</option>
          </template>
        </component>
        <template v-if="item.type == 'select'">
          <component :is="item.type" v-model="item.value" :type="item.inputType" :min="item.min" :max="item.max" class="value-component">
            <template v-if="item.type=='select'">
              <option v-for="opt in item.options" :key="opt[item.itemKey]" :value="opt[item.itemKey]">{{opt[item.itemLabel]}}</option>
            </template>
          </component>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { queryAll } from '@/util/base'
import { getNewObjArr } from '@/util/util'

export default {
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
          if (this.data[index].hasOwnProperty('url')) {
            queryAll(this.data[index].url, this.data[index].param).then(res => {
              if (res.data.code == 0) {
                this.$set(this.data[index], 'options', res.data.data)
              } else {
                this.$msg.error({
                  info: '获取' + this.data[index].label + '失败 !'
                })
              }
            })
          } else if (this.data[index].hasOwnProperty('enumKey')) {
            this.$set(this.data[index], 'options', this.$store.getters.getOptions(this.data[index].enumKey))
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
        this.dataHis = JSON.parse(JSON.stringify(this.data))
      }
    },
    handleChange (index, event) {
      this.$options.propsData.data[index].value = event.target.value.trim()
    },
    handleEnter (item, event) {
      if (item.toUpper) {
        this.toUpper(item, event)
      }
      this.$emit('handleEnter')
    },
    toUpper (item, event) {
      let value = item.value.trim().toUpperCase()
      event.target.value = value
      this.$set(item, 'value', item.value.trim().toUpperCase())
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
          this.dataHis = JSON.parse(JSON.stringify(this.data))
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
.label {
  padding: 0 5px 0 0;
}
.value-component {
  width: inherit;
  box-sizing: border-box;
}
</style>
