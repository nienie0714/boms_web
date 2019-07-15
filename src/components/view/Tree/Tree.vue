<template>
  <div class="tree" ref="tree">
    <div v-for="(node, index) in tree" :key="index" @click.stop="clickNode(node)" :class="['tree-node', (activeId.length > 0) && (activeId == node[nodeKey]) ? 'active' : '']">
      <div class="tree-label">
        <span @click.stop="showChild(node)"
        :class="[node.hasOwnProperty(nodeChild) ? 'icon iconfont icon-next icon-button' : '', node.hasOwnProperty('open') && node.open ? 'open' : '']"></span>
        <span v-if="selected" @click.stop="!disabled && selectCheckBox(node)"
        :class="['checkbox', ~selectNodeId.indexOf(node[nodeKey]) ? 'is-checked' : (~halfSelectNodeId.indexOf(node[nodeKey]) ? 'is-half-checked' : '')]"></span><!-- {{selectNodeId.indexOf(node[nodeKey])}} -->
        <span>{{node[nodeLabel]}}</span>
      </div>
      <tree v-if="node.hasOwnProperty(nodeChild) && node[nodeChild]" v-show="node.hasOwnProperty('open') && node.open" ref="treeChild" class="tree-child"
      :deep="deep + 1" :expendAll="expendAll" :expendLevel="expendLevel"
      :data="node[nodeChild]" :selected="selected" :disabled="disabled || (node.hasOwnProperty(disabledKey) ? node[disabledKey] : false)" :nodeKey="nodeKey" :nodeLabel="nodeLabel" :nodeChild="nodeChild"
      :selectNodeId="selectNodeId" :selectNode="selectNode" :halfSelectNodeId="halfSelectNodeId" :activeId="activeId" :autoSelectNodeId="autoSelectChildNodeId" :allSelectNodeId="allSelectNodeId"
      @clickNode="clickNode" @selectCheckBox="selectChildCheckBox"></tree>
    </div>
  </div>
</template>

<script>
import { flattenDeep } from '@/util/util'
import _ from 'lodash'

export default {
  name: 'tree',
  props: {
    data: {
      type: Array,
      default: function () {return []}
    },
    selected: {
      type: Boolean,
      default: false
    },
    expendAll: {
      type: Boolean,
      default: false
    },
    expendLevel: {
      type: Number,
      default: -1
    },
    disabled: {
      type: Boolean,
      default: false
    },
    disabledKey: {
      type: String,
      default: 'disabled'
    },
    nodeKey: {
      type: String,
      default: 'id'
    },
    nodeLabel: {
      type: String,
      default: 'label'
    },
    nodeChild: {
      type: String,
      default: 'children'
    },
    selectNodeId: {
      type: Array,
      default: function () {return []}
    },
    halfSelectNodeId: {
      type: Array,
      default: function () {return []}
    },
    allSelectNodeId: {
      type: Array,
      default: function () {return []}
    },
    autoSelectNodeId: {
      type: Array,
      default: function () {return []}
    },
    selectNode: {
      type: Array,
      default: function () {return []}
    },
    activeId: {
      type: Array,
      default: function () {return []}
    },
    deep: {
      type: Number,
      default: 0
    }
  },
  model: {
    prop: 'allSelectNodeId',
    event: 'changeIds'
  },
  data () {
    return {
      tree: [],
      deepData: [],
      autoSelectChildNodeId: []
    }
  },
  mounted () {
  },
  methods: {
    selectCheckBox (node) {
      let index = this.selectNodeId.indexOf(node[this.nodeKey])
      let indexHalf = this.halfSelectNodeId.indexOf(node[this.nodeKey])
      if (~index) {
        this.selectNode.splice(index, 1)
        this.selectNodeId.splice(index, 1)
        if (node.hasOwnProperty(this.nodeChild) && node[this.nodeChild]) {
          let tmp = []
          let arr = []
          flattenDeep(node[this.nodeChild], arr, node)
          let keys = _.map(arr, this.nodeKey)

          arr.forEach(node => {
            let i = _.findIndex(this.selectNode, [this.nodeKey, node[this.nodeKey]])
            this.selectNode.splice(i, 1)
          })

          keys.forEach(node => {
            let i = _.findIndex(this.selectNodeId, (i) => {return i == node})
            this.selectNodeId.splice(i, 1)
          })
          if (~indexHalf) {
            this.halfSelectNodeId.splice(indexHalf, 1)
          }
        }
      } else {
        this.selectNode.push(node)
        this.selectNodeId.push(node[this.nodeKey])
        if (node.hasOwnProperty(this.nodeChild) && node[this.nodeChild] && node[this.nodeChild].length > 0) {
          let tmp = []
          let arr = []
          let set = new Set()
          flattenDeep(node[this.nodeChild], arr, node)
          let keys = _.map(arr, this.nodeKey)
          
          tmp = JSON.parse(JSON.stringify(this.selectNode))
          set = [...tmp, ...arr]
          this.selectNode.splice(0, this.selectNode.length, ...new Set(set))

          tmp = JSON.parse(JSON.stringify(this.selectNodeId))
          set = [...tmp, ...keys]
          this.selectNodeId.splice(0, this.selectNodeId.length, ...new Set(set))
          set.forEach(id => {
            let i = _.findIndex(this.halfSelectNodeId, (o) => {
              return o === id
            })
            if (~i) {
              this.halfSelectNodeId.splice(i, 1)
            }
          })
          if (~indexHalf) {
            this.halfSelectNodeId.splice(indexHalf, 1)
          }
        }
      }
      let all = [...this.selectNodeId, ...this.halfSelectNodeId]
      this.allSelectNodeId.splice(0, this.allSelectNodeId.length, ...new Set(all))
      this.$emit('changeIds', this.allSelectNodeId)
      this.$emit('selectCheckBox', node)
    },
    selectChildCheckBox (node) {
      let index = this.selectNodeId.indexOf(node[this.nodeKey])
      let obj = _.find(this.deepData, [this.nodeKey, node[this.nodeKey]])
      let pObj = obj.pNode
      if (obj && pObj) {
        let arr = []
        flattenDeep(pObj[this.nodeChild], arr, pObj)
        let ids = _.map(arr, this.nodeKey)
        let hasArr = _.intersection(this.selectNodeId, ids)
        let tmp = []
        let set = new Set()
        if (~index) {
          // 子节点勾选时
          if (hasArr.length == ids.length) {
            // 子节点全部勾选
            // 添加node
            tmp = JSON.parse(JSON.stringify(this.selectNode))
            set = [...tmp, pObj]
            this.selectNode.splice(0, this.selectNode.length, ...new Set(set))
            // 添加id
            tmp = JSON.parse(JSON.stringify(this.selectNodeId))
            set = [...tmp, pObj[this.nodeKey]]
            this.selectNodeId.splice(0, this.selectNodeId.length, ...new Set(set))
            // 移除半id
            _.remove(this.halfSelectNodeId, (i) => {return i == pObj[this.nodeKey]})
          } else {
            // 子节点半勾选
            // 添加半id
            tmp = JSON.parse(JSON.stringify(this.halfSelectNodeId))
            set = [...tmp, pObj[this.nodeKey]]
            this.halfSelectNodeId.splice(0, this.halfSelectNodeId.length, ...new Set(set))
            // 移除node
            _.remove(this.selectNode, [this.nodeKey, pObj[this.nodeKey]])
            // 移除id
            _.remove(this.selectNodeId, (i) => {return i == pObj[this.nodeKey]})
          }
        } else if (pObj) {
          // 子节点取消勾选时
          if (hasArr.length == 0) {
            // 子节点全部取消勾选
            // 移除半id
            _.remove(this.halfSelectNodeId, (i) => {return i == pObj[this.nodeKey]})
            // 移除node
            _.remove(this.selectNode, [this.nodeKey, pObj[this.nodeKey]])
            // 移除id
            _.remove(this.selectNodeId, (i) => {return i == pObj[this.nodeKey]})
          } else {
            // 子节点半勾选
            // 添加半id
            tmp = JSON.parse(JSON.stringify(this.halfSelectNodeId))
            set = [...tmp, pObj[this.nodeKey]]
            this.halfSelectNodeId.splice(0, this.halfSelectNodeId.length, ...new Set(set))
            // 移除node
            _.remove(this.selectNode, [this.nodeKey, pObj[this.nodeKey]])
            // 移除id
            _.remove(this.selectNodeId, (i) => {return i == pObj[this.nodeKey]})
          }
        }
      }
      this.$emit('selectCheckBox', pObj)
    },
    clickNode (node) {
      if (this.activeId.length > 0) {
        this.activeId.splice(0, 1)
      }
      this.activeId.push(node[this.nodeKey])
      this.$emit('clickNode', node)
    },
    showChild (node, status) {
      if (status) {
        this.$set(node, 'open', true)
      } else {
        if (node.hasOwnProperty('open') && node.open) {
          node.open = false
        } else {
          this.$set(node, 'open', true)
        }
      }
    }
  },
  watch: {
    data: {
      handler (data) {
        this.tree = JSON.parse(JSON.stringify(data))
        flattenDeep(this.tree, this.deepData)
        let ids = this.autoSelectNodeId
        if (ids && ids.length > 0) {
          this.autoSelectChildNodeId = []
          ids.forEach(id => {
            let obj = _.find(data, [this.nodeKey, id])
            if (obj) {
              this.selectCheckBox(obj)
            } else {
              this.autoSelectChildNodeId.push(id)
            }
          })
        }
        if ((this.deep < this.expendLevel) || this.expendAll) {
          this.tree.forEach(node => {
            this.showChild(node, true)
          })
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.tree {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  
  &:not(.tree-child) {
    padding: 10px 0;

    >.tree-node {
      >.tree-label {
        >span:last-child {
          font-size: 16px;
        }
      }
    }
  }

  &.tree-child {
    padding: 5px 10px 5px 20px;

    >.tree-node {
      >.tree-label {
        >span:last-child {
          font-size: 14px;
        }
      }
    }
  }

  .tree-node {
    line-height: 32px;
    width: 100%;
    color: $gray-st;
    position: relative;
    text-align: left;
    cursor: pointer;

    &.active {
      >.tree-label {
        background-color: rgba($color: $blue-shadow, $alpha: .3);
      }
    }

    >.tree-label {
      padding: 0 12px 0 30px;
      height: 32px;
      >.checkbox {
        margin-right: 5px;
      }

      >span {
        vertical-align: middle;

        &:last-child {
          margin-left: 11px;
        }
      }

      &>.icon-next {
        display: inline-block;
        margin: 8px 0;
        width: 16px;
        height: 16px;
        line-height: 16px;
        text-align: center;
        font-size: 6px;
        font-weight: bold;
        color: #fff;
        border-radius: 50%;
        background-color: rgba(100, 113, 127, 1);
        position: absolute;
        left: 12px;
        &.open {
          transform: rotate(90deg);
        }
      }
    }
  }
}
</style>
