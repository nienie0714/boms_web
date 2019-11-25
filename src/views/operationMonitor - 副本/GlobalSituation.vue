<template>
    <div class="operation-monitor">

        <img class="back-home"
             :src="require('@img/icon/icon_back_home.png')"
             @click="$router.push('/home')"/>

        <div class="app">
            <!-- 上方有底色的图片区域。显示已装机等信息 -->
            <div class="total-info-box">
                <div class="space-aside"></div>
                <!-- 顶部的数字 -->
                <div class="total-amount-box">
                    <div class="total-amount">
                        <div class="label">已卸机总数</div>
                        <div class="number-list">
                            <div class="number">0</div>
                            <div class="number">1</div>
                            <div class="number">2</div>
                            <div class="number">3</div>
                            <div class="number">4</div>
                        </div>
                    </div>
                </div>
                <div class="space-inner"></div>
                <div class="total-amount-box">
                    <div class="total-amount">
                        <div class="label">已装机总数</div>
                        <div class="number-list">
                            <div class="number">0</div>
                            <div class="number">1</div>
                            <div class="number">2</div>
                            <div class="number">3</div>
                            <div class="number">4</div>
                        </div>
                    </div>
                </div>
                <div class="space-inner"></div>
                <div class="total-amount-box">
                    <div class="total-amount">
                        <div class="label">中转行李总数</div>
                        <div class="number-list">
                            <div class="number">0</div>
                            <div class="number">1</div>
                            <div class="number">2</div>
                            <div class="number">3</div>
                            <div class="number">4</div>
                        </div>
                    </div>
                </div>
                <div class="space-inner"></div>
                <div class="total-amount-box">
                    <div class="total-amount">
                        <div class="label">异常报警总数</div>
                        <div class="number-list">
                            <div class="number warning"></div>
                            <div class="number warning">1</div>
                            <div class="number warning">2</div>
                            <div class="number warning">3</div>
                            <div class="number warning">4</div>
                        </div>
                    </div>
                </div>
                <div class="space-aside"></div>
            </div>

            <div class="airport-info-box">
                <div class="space-aside"></div>
                <a class="airport-box" :href="mapT1">
                    <AirportInfo :airport-type="'T1'"/>
                </a>
                <div class="space-inner"></div>
                <a class="airport-box" :href="mapT2">
                    <AirportInfo :airport-type="'T2'"/>
                </a>
                <div class="space-inner"></div>
                <a class="airport-box" :href="mapT3">
                    <AirportInfo :airport-type="'T3'"/>
                </a>
                <div class="space-inner"></div>
                <a class="airport-box" :href="mapInterT3">
                    <AirportInfo :airport-type="'T3 international'"/>
                </a>
                <div class="space-aside"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import AirportInfo from "./AirportInfo.vue";

    export default {
        components: {
            AirportInfo
        },
        data () {
            return {
                mapT1: '',
                mapT2: '',
                mapT3: '',
                mapInterT3: ''
            }
        },
        created () {
            this.mapT1 = window.location.origin + '/#/mapT1'
            this.mapT2 = window.location.origin + '/#/mapT2'
            this.mapT3 = window.location.origin + '/#/mapT3'
            this.mapInterT3 = window.location.origin + '/#/mapInterT3'
        }

    }

</script>

<style lang="scss" scoped>

    .operation-monitor {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background-image: url(~@img/gis/bg_dark_blue.jpg);
        background-size: 100% 100%;

        .back-home {
            position: absolute;
            top: 0;
            right: 0;
            width: 40px;
            height: 40px;
            cursor: pointer;
        }

        .app {
            position: absolute;
            width: 100%;
            min-width: 1980px;
            height: 1014px;
            top: 50%;
            transform: translateY(-50%);

            .total-info-box {
                position: absolute;
                top: 0;
                display: flex;
                height: 46px;
                width: 100%;

                .total-amount-box {
                    position: relative;
                    display: inline-block;
                    width: 400px;
                    height: 46px;
                    flex-grow: 10;

                    .total-amount {
                        position: absolute;
                        top: 0;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 400px;

                        .label {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 130px;
                            height: 46px;
                            line-height: 46px;
                            font-size: 16px;
                            font-family: Microsoft YaHei;
                            font-weight: 900;
                            color: #fff;
                        }

                        .number-list {
                            position: absolute;
                            top: 0;
                            left: 130px;
                            width: 270px;
                            height: 46px;
                            line-height: 46px;
                            display: flex;
                            justify-content: space-between;

                            .number {
                                display: inline-block;
                                width: 45px;
                                height: 46px;
                                border-radius: 12px;
                                background: #1c2b37;
                                line-height: 46px;
                                font-size: 32px;
                                font-family: DINPro;
                                font-weight: 900;
                                color: #fff;
                                -webkit-text-stroke: 0.5px #fff;
                                text-stroke: 0.5px #fff;
                            }
                        }
                    }

                }
            }

            .airport-info-box {
                position: absolute;
                top: 82px;
                display: flex;
                height: 932px;
                width: 100%;
            }
        }

        .space-aside {
            position: relative;
            display: inline-block;
            width: 88px;
            height: 100%;
            flex-grow: 2;
        }

        .space-inner {
            position: relative;
            display: inline-block;
            width: 46px;
            height: 100%;
            flex-grow: 1;
        }


        .number.warning {
            color: #FF5F79 !important;
            -webkit-text-stroke: 1px #FF5F79 !important;
            text-stroke: 1px #FF5F79 !important;
        }

        .airport-box {
            position: relative;
            display: inline-block;
            width: 400px;
            height: 100%;
            flex-grow: 10;

        }
    }

</style>
