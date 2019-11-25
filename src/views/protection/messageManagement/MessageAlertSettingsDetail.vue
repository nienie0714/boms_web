<template>
    <div class="msg-detail">
        <div class="close-btn" @click="close"></div>

        <div class="title">查看预警设置</div>

        <div class="row first-row">
            <div class="info left-info">
                <div class="info-title">
                    消息类型编号
                </div>
                <div class="info-label">
                    {{detailInfo.msgTypeNo}}
                </div>
            </div>
            <div class="info right-info">
                <div class="info-title">
                    消息类型名称
                </div>
                <div class="info-label">
                    {{detailInfo.msgTypeCn}}
                </div>
            </div>
        </div>

        <div class="split-line first-line"></div>

        <div class="row second-row">
            <div class="info left-info">
                <div class="info-title">
                    消息子类型编号
                </div>
                <div class="info-label">
                    {{detailInfo.msgTypeSubNo}}
                </div>
            </div>
            <div class="info right-info">
                <div class="info-title">
                    消息子类型名称
                </div>
                <div class="info-label">
                    {{detailInfo.msgTypeSubCn}}
                </div>
            </div>
        </div>

        <div class="split-line second-line"></div>

        <div class="row third-row">
            <div class="info left-info">
                <div class="info-title">
                    预警阈值1
                </div>
                <div class="info-label">
                    {{detailInfo.warning1}}
                </div>
            </div>
            <div class="info right-info">
                <div class="info-title">
                    预警阈值2
                </div>
                <div class="info-label">
                    {{detailInfo.warning2}}
                </div>
            </div>
        </div>

        <div class="split-line third-line"></div>

        <div class="remark">
            <div class="remark-title">
                备注
            </div>
            <div class="remark-label">
                {{detailInfo.remark}}
            </div>
        </div>
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

        .title-text {
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: rgba(137, 157, 178, 1);
            line-height: 14px;
            text-align: left;
        }

        .label-text {
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: rgba(61, 66, 77, 1);
            text-align: left;
            line-height: 16px;
        }

        .row {
            position: absolute;
            left: 0;
            height: 41px;
            width: 100%;

            .info {
                position: absolute;
                top: 0;
                height: 41px;
                width: 300px;

                .info-title {
                    @extend .title-text;
                    position: absolute;
                    top: 0;
                    left: 0;
                }

                .info-label {
                    @extend .label-text;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                }
            }

            .left-info {
                left: 21px;
            }

            .right-info {
                left: 326px;
            }

        }

        .first-row {
            top: 73px;
        }

        .second-row {
            top: 153px;
        }

        .third-row {
            top: 233px;
        }

        .split-line {
            position: absolute;
            left: 21px;
            right: 21px;
            height: 1px;
            background: rgba(221, 230, 237, 1);
        }

        .first-line {
            top: 133px;
        }

        .second-line {
            top: 214px;
        }

        .third-line {
            top: 295px;
        }

        .remark {
            position: absolute;
            top: 316px;
            left: 21px;
            right: 21px;
            bottom: 20px;

            .remark-title {
                @extend .title-text;
                position: absolute;
                top: 0;
                left: 0;
            }

            .remark-label {
                @extend .label-text;
                position: absolute;
                top: 24px;
                left: 0;
                line-height: 24px;
                width: 100%;
                bottom: 0;
                overflow: auto;
                text-align: left;
            }
        }
    }
</style>

<script>
    export default {
        name: "MessageAlertSettingsDetail",
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
