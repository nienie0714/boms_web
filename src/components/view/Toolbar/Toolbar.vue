<template>
  <div class="toolbar" >
    <div v-if="permissions.export" class="tool-button export" @click="openExport">
      <div class="icon"></div>
      <div class="label">导出</div>
    </div>
    <!-- <div class="tool-button remove">
      <div class="icon"></div>
      <div class="label">删除</div>
    </div> -->
    <div v-if="permissions.insert" class="tool-button insert" @click="openDetail">
      <div class="icon"></div>
      <div class="label">新增</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    permissions: {
      type: Object,
      default: ()=>{}
    }
  },
  methods: {
    openExport () {
      this.$emit('openExport')
    },
    openDetail () {
      this.$emit('openDetail', {type: 'insert'})
    }
  }
}
</script>

<style lang="scss" scoped>
.toolbar {
  display: inline-flex;

  >.tool-button {
    display: inline-flex;
    padding: 0 20px;
    font-size: 14px;
    cursor: pointer;

    >.icon {
      width: 20px;
      height: 20px;
    }

    >.label {
      margin-left: 6px;
    }

    &.export {
      >.icon {
        background-image: url(~@icon/toolbar/icon_export.png);
      }
      >.label {
        color: $gray-nd;
      }
    }

    &.insert {
      >.icon {
        background-image: url(~@icon/toolbar/icon_insert.png);
      }
      >.label {
        color: $blue;
      }
    }

    &:hover {
      opacity: .8;
    }

    &:not(:last-child) {
      border-right: 1px solid $gray-border;
    }
  }
}
</style>
