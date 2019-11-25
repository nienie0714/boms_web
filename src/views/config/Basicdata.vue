<template>
    <!-- 基础数据管理 -->
    <div class="task-query">
        <router-view></router-view>
    </div>
</template>
<script>
export default {
    components: {
        
    },
    data() {
        return {

        }
    }

}
</script>
<style lang="scss">
    .task-query {
        height: calc(100% - 60px);
    }
</style>