<template>
  <div class="tree" ref="tree">
    <div v-for="(node, index) in tree" :key="index" @click="clickNode(node)" :class="['tree-node', (activeId.length > 0) && (activeId == node[nodeKey]) ? 'active' : '']">
      <div class="tree-label">
        <span @click="showChild(node)"
        :class="[node.hasOwnProperty(nodeChild) ? 'icon iconfont icon-next icon-button' : '', node.hasOwnProperty('open') && node.open ? 'open' : '']"></span>
        <span v-if="selected" @click="selectCheckBox(node)"
        :class="['checkbox', ~selectNodeId.indexOf(node[nodeKey]) ? 'is-checked' : (~halfSelectNodeId.indexOf(node[nodeKey]) ? 'is-half-checked' : '')]"></span><!-- {{selectNodeId.indexOf(node[nodeKey])}} -->
        <span>{{node[nodeLabel]}}</span>
      </div>
      <tree v-if="node.hasOwnProperty(nodeChild)" v-show="node.hasOwnProperty('open') && node.open" ref="treeChild" class="tree-child"
      :data="node[nodeChild]" :selected="selected" :nodeKey="nodeKey" :nodeLabel="nodeLabel" :nodeChild="nodeChild"
      :selectNodeId="selectNodeId" :selectNode="selectNode" :halfSelectNodeId="halfSelectNodeId" :activeId="activeId" @clickNode="clickNode" @selectCheckBox="selectChildCheckBox"></tree>
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
    selectNode: {
      type: Array,
      default: function () {return []}
    },
    activeId: {
      type: Array,
      default: function () {return []}
    }
  },
  data () {
    return {
      tree: [],
      deepData: []
    }
  },
  mounted () {
    this.tree = JSON.parse(JSON.stringify(this.data))
    flattenDeep(this.tree, this.deepData)
  },
  methods: {
    selectCheckBox (node) {
      let index = this.selectNodeId.indexOf(node[this.nodeKey])
      let indexHalf = this.halfSelectNodeId.indexOf(node[this.nodeKey])
      if (~index) {
        this.selectNode.splice(index, 1)
        this.selectNodeId.splice(index, 1)
        if (node.hasOwnProperty(this.nodeChild)) {
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
          this.halfSelectNodeId.splice(indexHalf, 1)
        }
      } else {
        this.selectNode.push(node)
        this.selectNodeId.push(node[this.nodeKey])
        if (node.hasOwnProperty(this.nodeChild)) {
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
          this.halfSelectNodeId.splice(indexHalf, 1)
        }
      }
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
    showChild (node) {
      if (node.hasOwnProperty('open') && node.open) {
        node.open = false
      } else {
        this.$set(node, 'open', true)
      }
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
  }

  &.tree-child {
    padding: 5px 10px 5px 12px;
  }

  .tree-node {
    font-size: 16px;
    line-height: 20px;
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
      padding: 3px 12px 3px 18px;
      >.checkbox {
        margin-right: 5px;
      }

      >span {
        vertical-align: top;
      }

      &>.icon-next {
        display: inline-block;
        font-size: 18px;
        color: $gray-st;
        position: absolute;
        left: 0;
        &.open {
          transform: rotate(90deg);
        }
      }
    }
  }
}
</style>
