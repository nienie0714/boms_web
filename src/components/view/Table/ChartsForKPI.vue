<!-- 上图（charts）下表（table）模式-->
<template>
    <div class="kpi-table-charts">
        <!-- charts 图表 -->
        <div class="charts-container" ref="charts">

        </div>
    </div>
</template>

<script>
    import echarts from 'echarts';

    export default {
        name: "ChartsForKPI",
        props: {
            dataForCharts: Array,
            optionForCharts: Object
        },
        mounted () {
            // 基于准备好的dom，初始化echarts实例
            this.myChart = echarts.init(this.$refs.charts);
            this.ininCharts();
        },
        data () {
            return {
                myChart: null
            }
        },
        watch: {
            'dataForCharts' () {
                this.ininCharts()
            }
        },
        methods: {
            exportByExcel () {
                console.log('abc')
            },

            // 生成图表
            ininCharts () {
                // 绘制图表
                this.myChart.setOption(this.optionForCharts);
            }
        }
    }
</script>

<style scoped lang="scss">
    .kpi-table-charts {
        @import "~@style/global.scss";
        position: relative;
        height: 100%;
        width: 100%;

        .charts-container {
            position: relative;
            height: 250px;
            width: 100%;
            text-align: left;
        }
    }
</style>
