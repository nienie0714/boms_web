<template>
    <div class="msg-detail">
        <div class="close-btn" @click="close"></div>
        <div class="title">查看消息绑定</div>
        <div class="header">
            <table class="h-table">
                <thead>
                <tr>
                    <th class="label">员工编号</th>
                    <th class="label">员工姓名</th>
                    <th class="label">所属部门</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td class="text">{{detailInfo.empNo}}</td>
                    <td class="text">{{detailInfo.empName}}</td>
                    <td class="text">{{detailInfo.deptName||'无'}}</td>
                </tr>
                </tbody>
            </table>
            <table class="h-table">
                <thead>
                <tr>
                    <th class="label">角色</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td class="text">
                        {{detailInfo.roleList && detailInfo.roleList.length > 0 ? detailInfo.roleList.join("，") :
                        '无'}}
                    </td>
                </tr>
                </tbody>
            </table>
            <!--            <div class="empNo">-->
            <!--                <div class="label">-->
            <!--                    员工编号-->
            <!--                </div>-->
            <!--                <div class="text">-->
            <!--                    -->
            <!--                </div>-->
            <!--            </div>-->
            <!--            <div class="empName">-->
            <!--                <div class="label">-->
            <!--                    员工姓名-->
            <!--                </div>-->
            <!--                <div class="text">-->
            <!--                    -->
            <!--                </div>-->
            <!--            </div>-->
            <!--            <div class="roleList">-->
            <!--                <div class="label">-->
            <!--                    角色-->
            <!--                </div>-->
            <!--                <div class="text">-->
            <!--                    {{detailInfo.roleList && detailInfo.roleList.length > 0 ? detailInfo.roleList.join("，") : '无'}}-->
            <!--                </div>-->
            <!--            </div>-->
            <!--            <div class="deptName">-->
            <!--                <div class="label">-->
            <!--                    所属部门-->
            <!--                </div>-->
            <!--                <div class="text">-->
            <!--                    -->
            <!--                </div>-->
            <!--            </div>-->
        </div>

        <div class="split-line"></div>

        <div class="msg-list">
            <div class="msg-title">已绑消息</div>

            <div class="msg-row">
                <div class="msg-label">
                    航班动态
                </div>
                <div class="msg-infos">
                    <!--<div class="msg-info flight">-->
                    <!--航班预计时间变更-->
                    <!--</div>-->
                    <template v-if="detailInfo.subscriMap && detailInfo.subscriMap.flight">
                        <template v-for="msg in detailInfo.subscriMap.flight">
                            <div class="msg-info flight" :key="msg">
                                {{msg}}
                            </div>
                        </template>
                    </template>
                    <div class="clearfix"></div>
                </div>
            </div>
            <div class="msg-row">
                <div class="msg-label">
                    中转消息
                </div>
                <div class="msg-infos">
                    <!--<div class="msg-info transfer">-->
                    <!--航班预计时间变更-->
                    <!--</div>-->
                    <template v-if="detailInfo.subscriMap && detailInfo.subscriMap.transfer">
                        <template v-for="msg in detailInfo.subscriMap.transfer">
                            <div class="msg-info transfer" :key="msg">
                                {{msg}}
                            </div>
                        </template>
                    </template>
                    <div class="clearfix"></div>
                </div>
            </div>
            <div class="msg-row">
                <div class="msg-label">
                    任务派发
                </div>
                <div class="msg-infos">
                    <!--<div class="msg-info task">-->
                    <!--任务派发-->
                    <!--</div>-->
                    <template v-if="detailInfo.subscriMap && detailInfo.subscriMap.task">
                        <template v-for="msg in detailInfo.subscriMap.task">
                            <div class="msg-info task" :key="msg">
                                {{msg}}
                            </div>
                        </template>
                    </template>
                    <div class="clearfix"></div>
                </div>
            </div>
            <div class="msg-row">
                <div class="msg-label">
                    预警消息
                </div>
                <div class="msg-infos">
                    <!-- <div class="msg-info warning">-->
                    <!-- 航班预计时间变更-->
                    <!-- </div>-->
                    <template v-if="detailInfo.subscriMap && detailInfo.subscriMap.warning">
                        <template v-for="msg in detailInfo.subscriMap.warning">
                            <div class="msg-info warning" :key="msg">
                                {{msg}}
                            </div>
                        </template>
                    </template>
                    <div class="clearfix"></div>
                </div>
            </div>
        </div>

        <!--        <div class="bottom-close-btn" @click="close">关闭</div>-->
    </div>
</template>

<style lang="scss" scoped>
    .msg-detail {
        position: absolute;
        right: -10px;
        top: -70px;
        bottom: -10px;
        width: 640px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 0px 100px 0px rgba(107, 130, 153, 0.6);
        border-radius: 12px;
        padding: 0 21px;
        z-index: 2;

        .close-btn {
            position: absolute;
            top: 15px;
            right: 13px;
            width: 14px;
            height: 14px;
            background-image: url(~@img/icon/icon_close.png);
            background-size: 100% 100%;
            cursor: pointer;
        }

        .title {
            position: absolute;
            top: 27px;
            width: 100%;
            height: 16px;
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: rgba(61, 66, 77, 1);
            line-height: 16px;
        }

        .header {
            position: relative;
            margin-top: 73px;
            /*height: 40px;*/
            left: 0;
            width: 100%;

            .h-table {
                text-align: left;
                width: 100%;

                .label {
                    height: 24px;
                    line-height: 20px;
                    font-size: 14px;
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    color: rgba(137, 157, 178, 1);
                }

                .text {
                    min-height: 24px;
                    line-height: 20px;
                    font-size: 16px;
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    color: rgba(61, 66, 77, 1);
                }
            }
        }

        .split-line {
            position: relative;
            margin-top: 10px;
            height: 1px;
            width: 100%;
            background: rgba(221, 230, 237, 1);
        }

        .msg-list {
            position: relative;
            margin-top: 10px;
            overflow-y: auto;
            width: 100%;

            .msg-title {
                position: relative;
                height: 24px;
                line-height: 14px;
                font-size: 14px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: rgba(137, 157, 178, 1);
                vertical-align: top;
                text-align: left;
            }

            .msg-row {
                position: relative;
                padding-left: 85px;
                min-height: 32px;
                margin-bottom: 10px;

                .msg-label {
                    position: absolute;
                    left: 0;
                    top: 0;
                    height: 32px;
                    line-height: 32px;
                    font-size: 16px;
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    color: rgba(61, 66, 77, 1);
                }

                .msg-infos {
                    width: 100%;
                    height: 100%;
                    min-height: 42px;

                    .msg-info {
                        display: inline-block;
                        height: 32px;
                        line-height: 32px;
                        padding: 0 9px;
                        border-radius: 6px;
                        vertical-align: top;
                        float: left;
                        margin-right: 10px;
                        margin-bottom: 10px;
                    }

                    .flight {
                        background: #e7f3fe;
                        color: #33a1ff;
                    }

                    .transfer {
                        background: #eeeefe;
                        color: #696BFF;
                    }

                    .task {
                        background: #e1f7ef;
                        color: #01B674;
                    }

                    .warning {
                        background: #fff0e5;
                        color: #FF8022;
                    }
                }
            }
        }

        .bottom-close-btn {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            bottom: 20px;
            width: 100px;
            height: 38px;
            line-height: 38px;
            background: #fff;
            box-shadow: 0px 5px 15px 0px rgba(63, 153, 255, 0.3);
            border-radius: 6px;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: rgba(137, 157, 178, 1);
            cursor: pointer;
        }


        .clearfix {
            zoom: 1;
        }

        .clearfix:before, .clearfix:after {
            content: "";
            display: table;
        }

        .clearfix:after {
            clear: both;
        }

    }
</style>

<script>
    export default {
        name: "MessageBindDetail",
        props: {
            closeDetail: Function,
            detailInfo: Object
        },
        methods: {
            close () {
                this.closeDetail();
            }
        }
    }
</script>
