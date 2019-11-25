<template>
    <!-- 状态监控 -->
    <div class="satusContent">
        <!-- <None :desc="description"></None> -->
        <div class="tab-group">
            <tabs :tabsData="tabsData" defaultKey="1" @tabItemClick="tabItemClick"></tabs>
        </div>
        
        <MonitorDetail :tabKey="selectKey" ref="MonitorDetail"></MonitorDetail>
    </div>
</template>
<script>
import Tabs from '@view/Tabs/Tabs'
import MonitorDetail from './detail/MonitorDetail'
// import None from'../home/common/none'
export default {
    components: {
        Tabs,
        MonitorDetail,
        // None
    },
    data() {
        return {
            description: '各种值班记录的查询功能，输入日期等关键字，可以查看当天的人员/班组值班情况。<br />1、列表显示任务派发后，接收班组/人员对任务的实时保障情况；<br />2、人员是否接收处理，以及任务开始时间、结束时间、是否超时、是否异常等；',
            tabsData: [
                {
                    key: 'N-LOAD-TRUCK',
                    label: '离港分拣'
                },
                {
                    key: 'N-LOAD-AIRCRAFT',
                    label: '卸车装机'
                },
                {
                    key: 'N-UNLOAD-AIRCRAFT',
                    label: '进港卸机'
                },
                {
                    key: 'N-UPLOAD',
                    label: '到达卸车'
                },
            ],
            selectKey: 'N-LOAD-TRUCK',
        }
    },
    methods: {
        tabItemClick(key) {
            this.selectKey = key;
            this.$refs.MonitorDetail.init(this.selectKey)
        }
    }


}
</script>
<style lang="scss" scoped>
.satusContent {
    border-radius: 10px;
    height: 100%;
    // overflow-y: auto;
    position: relative;
    .tab-group {
        position: absolute;
        top: -60px;
        left: 50%;
        transform: translateX(-50%);
    }
}
</style>


