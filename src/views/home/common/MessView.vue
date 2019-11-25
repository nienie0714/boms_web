<template>
    <div>
        <div v-show="$store.state.event.isMessViewDisplayShow"
             id="msg-dialog"
             :style="{
         top:`${dialogTop}px`,
         left:`${dialogLeft}px`
         }">

            <!-- 顶部拖动、搜索、关闭按钮 -->
            <div class="header">
                <div class="header-move"
                     @mousedown="_dialogBeginMove"
                     @mouseup="_dialogOverMove"></div>
                <div class="header-search"
                     :class="{focus:private_isSearching}"
                     @click="setSearchStatus(true)"></div>
                <div class="header-line"></div>
                <div class="header-close" @click="closeDialog"></div>
            </div>
            <!-- tab区域 -->
            <div class="tabs-row" v-if="!private_isSearching">
                <div class="tab-container">
                    <div class="tab"
                         :class="{focus:currentTab===private_tabs.flight}"
                         @click="selectTab(private_tabs.flight)">
                        航班动态
                        <div class="msg-count" v-if="this.msgListByType.flight">{{this.msgListByType.flight>99?'99+':this.msgListByType.flight}}</div>
                    </div>
                    <div class="tab"
                         :class="{focus:currentTab===private_tabs.task}"
                         @click="selectTab(private_tabs.task)">
                        任务派发
                        <div class="msg-count" v-if="this.msgListByType.task">{{this.msgListByType.task>99?'99+':this.msgListByType.task}}</div>
                    </div>
                    <div class="tab"
                         :class="{focus:currentTab===private_tabs.warn}"
                         @click="selectTab(private_tabs.warn)">
                        预警消息
                        <div class="msg-count" v-if="this.msgListByType.warn">{{this.msgListByType.warn>99?'99+':this.msgListByType.warn}}</div>
                    </div>
                    <div class="tab"
                         :class="{focus:currentTab===private_tabs.transfer}"
                         @click="selectTab(private_tabs.transfer)">
                        中转消息
                        <div class="msg-count" v-if="this.msgListByType.transfer">{{this.msgListByType.transfer>99?'99+':this.msgListByType.transfer}}</div>
                    </div>
                    <div class="tab"
                         :class="{focus:currentTab===private_tabs.totice}"
                         @click="selectTab(private_tabs.totice)">
                        通知公告
                        <div class="msg-count" v-if="this.msgListByType.totice">{{this.msgListByType.totice>99?'99+':this.msgListByType.totice}}</div>
                    </div>
                </div>
            </div>

            <!-- 搜索框 -->
            <div class="search-row" v-if="private_isSearching">
                <input type="text"
                       class="input"
                       placeholder="输入关键字搜索"
                       v-model="searchText"/>
                <div class="placeholder">{{_getSearchTypeText()}}</div>
                <div class="cancel-btn" @click="setSearchStatus(false)">取消</div>
                <div class="search-btn" @click="searchMsg">{{private_isSearching_Ajax?'搜索中':'搜索'}}</div>
            </div>

            <!-- 消息区域 -->
            <div class="msg-container"
                 :style="{
                 bottom:(focusMsgId!==null?'330px':'70px')
             }">
                <template v-for="item in filterMsgList">
                    <div class="msg"
                         :key="item.msgId"
                         :class="{focus:focusMsgId===item.msgId}"
                         @click="selectMsg(item.msgId)">
                        <div class="msg-icon"
                             :style="{backgroundImage:`url(${_getImageUrl(item)})`}"></div>
                        <!-- 标题 -->
                        <div class="msg-title">
                            <!-- 标题文本【预警消息的情况下，有特殊显示内容】 -->
                            <span class="msg-title-text">
                            <!-- 通知公告不显示航班号 -->
                            <template v-if="item.subtype!==private_tabs.totice && item.subtype!==private_tabs.task">
                               {{item.textBody.msgAir+item.textBody.msgFlightNo}}
                            </template>
                                <!-- 预警消息和通知公告，显示额外标题内容 -->
                            <template
                                    v-if="[private_tabs.warn,private_tabs.totice, private_tabs.task].indexOf(item.subtype)>-1">
                            {{item.textBody.msgTitle}}
                            </template>
                        </span>
                            <!-- 是否已读 -->
                            <span class="msg-title-red"
                                  v-if="item.read==='N'"></span>
                        </div>
                        <div class="msg-text">
                            <span>{{item.textBody.msgText}}</span>
                            <!-- <span class="msg-text-blue">{{item.blueText}}</span> -->
                        </div>
                        <div class="msg-time">
                            <!-- 以下方法作用："2019-09-19 16:54:59" 变为 "16:54" -->
                            {{
                            item.textBody.msgPublishTime.split(' ')[1].split(':').slice(0,2).join(':')
                            }}
                        </div>
                    </div>
                </template>

                <template v-if="!private_isLoadingHistory && filterMsgList.length===0">
                    <div>没有内容喔~~~</div>
                </template>

                <template v-if="private_isLoadingHistory">
                    <div>正在加载历史消息</div>
                </template>

            </div>

            <!-- 底部两个按钮 -->
            <div class="footter">
                <div class="footter-btn allread" @click="setAllMsgRead(false)">
                    <div class="footter-icon icon-read"></div>
                    <div class="footter-text">全部已读</div>
                </div>
                <div class="footter-btn allclear" @click="setAllClear">
                    <div class="footter-icon icon-clear"></div>
                    <div class="footter-text">一键清空</div>
                </div>
            </div>

            <!-- 查看详情 -->
            <div class="detail" v-if="focusMsgId!==null">
                <div class="close" @click="unSelectMsg"></div>
                <div class="icon"
                     :style="{backgroundImage:`url(${_getImageUrl(focusMsg)})`}"></div>
                <div class="title"
                     :class="{'is-task':focusMsg.subtype===private_tabs.task}">
                    <!-- 通知公告不显示航班号 -->
                    <template v-if="focusMsg.subtype!==private_tabs.totice && focusMsg.subtype!==private_tabs.task">
                        {{focusMsg.textBody.msgAir+focusMsg.textBody.msgFlightNo}}
                    </template>

                    <!-- 预警消息和通知公告，显示额外标题内容 -->
                    <template
                            v-if="[private_tabs.warn, private_tabs.totice, private_tabs.task].indexOf(focusMsg.subtype)>-1">
                        {{focusMsg.textBody.msgTitle}}
                    </template>
                </div>
                <div v-if="focusMsg.subtype===private_tabs.task"
                     class="from">
                    来自：{{focusMsg.textBody.msgSendId}}
                </div>
                <div class="line"></div>
                <div class="date">发送时间：{{focusMsg.textBody.msgPublishTime}}</div>
                <div class="content">
                    <span>{{focusMsg.textBody.msgText}}</span>
                    <!--<span class="blue">{{focusMsg.blueText}}</span>-->
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
    #msg-dialog {
        position: fixed;
        /*top: 0;*/
        /*left: 0;*/
        width: 440px;
        height: 750px;
        border-radius: 12px;
        background-color: #fff;
        box-shadow: 0px 0px 50px 0px rgba(107, 130, 153, 0.5);
        z-index: 20;   
        .header {
            position: absolute;
            top: 0;
            left: 0;
            height: 39px;
            width: 100%;

            .header-move {
                position: absolute;
                top: 0;
                left: 0;
                width: 368px;
                height: 25px;
                background-image: url(~@img/header/header_move.png);
                background-size: 100%;
                cursor: pointer;
            }

            .header-search {
                position: absolute;
                top: 9px;
                left: 377px;
                width: 14px;
                height: 14px;
                background-image: url(~@img/icon/icon_search_grey.png);
                background-size: 100%;
                cursor: pointer;
            }

            .header-search.focus {
                background-image: url(~@img/icon/icon_search_blue.png);
            }

            .header-line {
                position: absolute;
                top: 9px;
                left: 403px;
                height: 15px;
                width: 1px;
                background-color: #DDE6ED;
            }

            .header-close {
                position: absolute;
                top: 9px;
                left: 415px;
                width: 14px;
                height: 14px;
                background-image: url(~@img/icon/icon_close.png);
                background-size: 100%;
                cursor: pointer;
            }
        }

        .tabs-row {
            position: absolute;
            top: 39px;
            left: 0;
            height: 38px;
            width: 100%;

            .tab-container {
                position: absolute;
                left: 16px;
                top: 0;
                height: 38px;
                width: 408px;
                box-shadow: 0px 5px 30px 0px rgba(104, 129, 153, 0.25);
                border-radius: 18px;
                padding: 3px;

                .tab {
                    position: relative;
                    float: left;
                    vertical-align: top;
                    width: 78px;
                    height: 32px;
                    border-radius: 18px;
                    margin-right: 3px;
                    line-height: 32px;
                    font-size: 14px;
                    text-align: center;
                    color: #899DB2;
                    cursor: pointer;
                }

                .tab.focus {
                    color: #fff;
                    background: linear-gradient(-90deg, rgba(73, 130, 255, 1), rgba(63, 162, 249, 1));
                }

                .tab:last-child {
                    margin-right: 0;
                }

                .msg-count {
                  position: absolute;
                  height: 24px;
                  min-width: 24px;
                  line-height: 24px;
                  padding: 0 5px;
                  border-radius: 12px;
                  background: #F75467;
                  color: #FFFEFE;
                  font-family: 'MicrosoftYaHei';
                  font-size: 12px;
                  text-align: center;
                  vertical-align: bottom;
                  top: -12px;
                  left: 55px;
                  z-index: 10;
                }
            }
        }

        .search-row {
            position: absolute;
            top: 39px;
            left: 0;
            height: 38px;
            width: 100%;

            .input {
                position: absolute;
                top: 0;
                left: 16px;
                width: 262px;
                height: 38px;
                background: rgba(241, 245, 248, 1);
                border-radius: 6px;
                padding-left: 86px;
                border: none;
                font-size: 14px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: rgba(137, 157, 178, 1);
                outline: none;

                &::placeholder {
                    text-align: left;
                }

                &:focus {
                    outline: none;
                    border: none;
                    box-shadow: none;
                }

                &:hover {
                    outline: none;
                    border: none;
                    box-shadow: none;
                }
            }

            .placeholder {
                position: absolute;
                top: 12px;
                left: 29px;
                width: 65px;
                height: 15px;
                line-height: 15px;
                font-size: 14px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #899DB2;
                border-right: 1px solid #DDE6ED;
                text-align: left;
            }

            .btn {
                position: absolute;
                top: 0;
                width: 62px;
                height: 38px;
                line-height: 38px;
                background: rgba(255, 255, 255, 1);
                box-shadow: 0px 5px 20px 0px rgba(99, 126, 153, 0.25);
                border-radius: 6px;
                font-size: 14px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: rgba(137, 157, 178, 1);
                cursor: pointer;
            }

            .cancel-btn {
                @extend .btn;
                right: 88px;
                color: #637E99;
            }

            .search-btn {
                @extend .btn;
                right: 16px;
                background: linear-gradient(-90deg, rgba(73, 130, 255, 1), rgba(63, 162, 249, 1));
                color: #fff;
            }
        }
    }

    .msg-container {
        position: absolute;
        top: 92px;
        bottom: 70px;
        left: 0;
        width: 100%;
        overflow-x: hidden;
        overflow-y: auto;

        .msg {
            position: relative;
            width: 100%;
            height: 70px;
            margin-bottom: 2px;
            cursor: pointer;

            .msg-icon {
                position: absolute;
                top: 16px;
                left: 17px;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 1);
                box-shadow: 0px 5px 20px 0px rgba(99, 126, 153, 0.25);
                background-size: 100% 100%;
            }

            .msg-title {
                position: absolute;
                left: 67px;
                top: 16px;
                height: 16px;
                line-height: 16px;

                .msg-title-text {
                    font-size: 16px;
                    font-family: Microsoft YaHei;
                    font-weight: bold;
                    color: rgba(61, 66, 76, 1);
                    vertical-align: top;
                    display: inline-block;
                    width: 300px;
                    text-align: left;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .msg-title-red {
                    display: inline-block;
                    margin-left: 5px;
                    vertical-align: top;
                    width: 8px;
                    height: 8px;
                    background: rgba(247, 84, 103, 1);
                    border-radius: 50%;
                }

            }

            .msg-text {
                position: absolute;
                top: 41px;
                left: 67px;
                right: 60px;
                line-height: 14px;
                font-size: 14px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: rgba(137, 157, 178, 1);
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                text-align: left;

                .msg-text-blue {
                    color: #3392FF;
                    margin-left: 3px;
                }
            }

            .msg-time {
                position: absolute;
                right: 16px;
                top: 17px;
                height: 14px;
                line-height: 14px;
                font-size: 14px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: rgba(137, 157, 178, 1);
            }
        }

        .msg.focus {
            background: #d0eaff;
        }
    }

    .footter {
        position: absolute;
        bottom: 17px;
        left: 0;
        height: 38px;
        width: 100%;

        .footter-btn {
            position: absolute;
            top: 0;
            width: 198px;
            height: 38px;
            line-height: 38px;
            box-shadow: 0px 5px 20px 0px rgba(99, 126, 153, 0.25);
            border-radius: 6px;
            background-color: #fff;
            cursor: pointer;

            .footter-icon {
                position: absolute;
                top: 9px;
                left: 59px;
                height: 20px;
                width: 20px;
                background-size: 100% 100%;
            }

            .footter-text {
                position: absolute;
                top: 13px;
                left: 87px;
                height: 14px;
                line-height: 14px;
                font-size: 14px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: rgba(137, 157, 178, 1);
            }
        }

        .footter-btn.allread {
            .footter-icon {
                background-image: url(~@img/icon/icon_msg_allread.png);
            }
        }

        .footter-btn.allclear {
            .footter-icon {
                background-image: url(~@img/icon/icon_msg_allclear.png);
            }

            .footter-text {
                color: rgba(247, 84, 103, 1);
            }
        }

        .footter-btn.allread {
            left: 17px;
        }

        .footter-btn.allclear {
            right: 17px;
        }
    }

    .detail {
        position: absolute;
        left: 16px;
        bottom: 75px;
        width: 408px;
        height: 240px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 0px 40px 0px rgba(115, 134, 153, 0.3);
        border-radius: 10px;

        .close {
            position: absolute;
            top: 11px;
            right: 12px;
            width: 14px;
            height: 14px;
            background-image: url(~@img/icon/icon_close.png);
            background-size: 100%;
            cursor: pointer;
        }

        .icon {
            position: absolute;
            top: 13px;
            left: 13px;
            height: 40px;
            width: 40px;
            border-radius: 50%;
            box-shadow: 0px 5px 20px 0px rgba(99, 126, 153, 0.25);
            background-size: 100% 100%;
        }

        .title {
            position: absolute;
            top: 27px;
            left: 63px;
            height: 16px;
            line-height: 16px;
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: rgba(61, 66, 76, 1);
            width: 300px;
            display: inline-block;
            text-align: left;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .title.is-task {
            top: 15px;
        }

        .from {
            position: absolute;
            left: 63px;
            top: 39px;
            height: 14px;
            line-height: 14px;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: rgba(137, 157, 178, 1);
        }

        .line {
            position: absolute;
            top: 66px;
            left: 0;
            width: 100%;
            height: 0;
            border-top: 1px solid rgba(221, 230, 237, 1);
        }

        .date {
            position: absolute;
            top: 84px;
            left: 12px;
            height: 14px;
            line-height: 14px;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: rgba(137, 157, 178, 1);
        }

        .content {
            position: absolute;
            top: 106px;
            left: 13px;
            right: 12px;
            bottom: 13px;
            overflow-x: hidden;
            overflow-y: auto;
            white-space: pre-wrap;
            font-size: 16px;
            line-height: 24px;
            text-align: left;
        }

        .blue {
            font-size: 16px;
            color: #3392FF;
        }
    }
</style>
<script>
    import {getQueryAll as $get, queryAll as $post} from '@/util/base';

    import '@util/mqttjssdk.js';

    const MAXTOTALMESSAGEAMOUNT = 500;

    const IMYuetaiWS = window.IMYuetaiWS

    // 航标的 icon，需要提前加载好
    const IMAGEHREF = {
        "RO": require("@img/flightlogo/l_ro.png"),
        "SK": require("@img/flightlogo/l_sk.png"),
        "DEFAULT": require("@img/flightlogo/l_default.png"),
        "KL": require("@img/flightlogo/l_kl.png"),
        "KY": require("@img/flightlogo/l_ky.png"),
        "HU": require("@img/flightlogo/l_hu.png"),
        "KN": require("@img/flightlogo/l_kn.png"),
        "3U": require("@img/flightlogo/l_3u.png"),
        "D7": require("@img/flightlogo/l_d7.png"),
        "DV": require("@img/flightlogo/l_dv.png"),
        "QW": require("@img/flightlogo/l_qw.png"),
        "PR": require("@img/flightlogo/l_pr.png"),
        "DD": require("@img/flightlogo/l_dd.png"),
        "QR": require("@img/flightlogo/l_qr.png"),
        "Q2": require("@img/flightlogo/l_q2.png"),
        "SL": require("@img/flightlogo/l_sl.png"),
        "FM": require("@img/flightlogo/l_fm.png"),
        "DR": require("@img/flightlogo/l_dr.png"),
        "I4": require("@img/flightlogo/l_i4.png"),
        "KJ": require("@img/flightlogo/l_kj.png"),
        "JL": require("@img/flightlogo/l_jl.png"),
        "QF": require("@img/flightlogo/l_qf.png"),
        "GJ": require("@img/flightlogo/l_gj.png"),
        "EU": require("@img/flightlogo/l_eu.png"),
        "OQ": require("@img/flightlogo/l_oq.png"),
        "LJ": require("@img/flightlogo/l_lj.png"),
        "BA": require("@img/flightlogo/l_ba.png"),
        "B7": require("@img/flightlogo/l_b7.png"),
        "VD": require("@img/flightlogo/l_vd.png"),
        "AY": require("@img/flightlogo/l_ay.png"),
        "LH": require("@img/flightlogo/l_lh.png"),
        "OS": require("@img/flightlogo/l_os.png"),
        "9C": require("@img/flightlogo/l_9c.png"),
        "NS": require("@img/flightlogo/l_ns.png"),
        "MH": require("@img/flightlogo/l_mh.png"),
        "8C": require("@img/flightlogo/l_8c.png"),
        "TK": require("@img/flightlogo/l_tk.png"),
        "LO": require("@img/flightlogo/l_lo.png"),
        "LX": require("@img/flightlogo/l_lx.png"),
        "VV": require("@img/flightlogo/l_vv.png"),
        "CA": require("@img/flightlogo/l_ca.png"),
        "BR": require("@img/flightlogo/l_br.png"),
        "LY": require("@img/flightlogo/l_ly.png"),
        "8L": require("@img/flightlogo/l_8l.png"),
        "OX": require("@img/flightlogo/l_ox.png"),
        "9H": require("@img/flightlogo/l_9h.png"),
        "UA": require("@img/flightlogo/l_ua.png"),
        "TR": require("@img/flightlogo/l_tr.png"),
        "null": require("@img/flightlogo/airasia.png"),
        "CZ": require("@img/flightlogo/l_cz.png"),
        "AE": require("@img/flightlogo/l_ae.png"),
        "MF": require("@img/flightlogo/l_mf.png"),
        "MS": require("@img/flightlogo/l_ms.png"),
        "NH": require("@img/flightlogo/l_nh.png"),
        "CX": require("@img/flightlogo/l_cx.png"),
        "BK": require("@img/flightlogo/l_bk.png"),
        "VN": require("@img/flightlogo/l_vn.png"),
        "TG": require("@img/flightlogo/l_tg.png"),
        "AQ": require("@img/flightlogo/l_aq.png"),
        "CN": require("@img/flightlogo/l_cn.png"),
        "AF": require("@img/flightlogo/l_af.png"),
        "8Y": require("@img/flightlogo/l_8y.png"),
        "OZ": require("@img/flightlogo/l_oz.png"),
        "NZ": require("@img/flightlogo/l_nz.png"),
        "ZH": require("@img/flightlogo/l_zh.png"),
        "UQ": require("@img/flightlogo/l_uq.png"),
        "BX": require("@img/flightlogo/l_bx.png"),
        "AC": require("@img/flightlogo/l_ac.png"),
        "MU": require("@img/flightlogo/l_mu.png"),
        "CI": require("@img/flightlogo/l_ci.png"),
        "TV": require("@img/flightlogo/l_tv.png"),
        "NX": require("@img/flightlogo/l_nx.png"),
        "PN": require("@img/flightlogo/l_pn.png"),
        "SC": require("@img/flightlogo/l_sc.png"),
        "EY": require("@img/flightlogo/l_ey.png"),
        "N4_MOSIKE": require("@img/flightlogo/l_n4_mosike.png"),
        "KE": require("@img/flightlogo/l_ke.png"),
        "GS": require("@img/flightlogo/l_gs.png"),
        "S7": require("@img/flightlogo/l_s7.png"),
        "PL": require("@img/flightlogo/l_pl.png"),
        "GA": require("@img/flightlogo/l_ga.png"),
        "DZ": require("@img/flightlogo/l_dz.png"),
        "SL222": require("@img/flightlogo/l_sl222.png"),
        "FD": require("@img/flightlogo/l_fd.png"),
        "HO": require("@img/flightlogo/l_ho.png"),
        "JR": require("@img/flightlogo/l_jr.png"),
        "KA": require("@img/flightlogo/l_ka.png"),
        "SQ": require("@img/flightlogo/l_sq.png"),
        "EK": require("@img/flightlogo/l_ek.png"),
        "GT": require("@img/flightlogo/l_gt.png"),
        "G5": require("@img/flightlogo/l_g5.png"),
        "JD": require("@img/flightlogo/l_jd.png")
    }

    // 测试代码
    const wdLog = {
        test: true,
        warning: false,
        error: true
    }
    const logT = function () {
        if (!wdLog.test) {
            return;
        }
        console.log(...arguments);
    }
    const logW = function (msg) {
        if (!wdLog.warning) {
            return;
        }
        // console.warn(msg);
    }
    const logE = function (msg) {
        if (!wdLog.error) {
            return;
        }
        console.error(msg);
    }
    const createMQTT = function (userInfo, vue) {
        // 文档参照：http://1.82.253.56:3691/wangd/im_sdk_yuetai

        const mq = new IMYuetaiWS({
            onConnectSuccess: vue._onConnectSuccess,
            onConnectFaled: vue._onConnectFaled,
            onConnectClose: vue._onConnectClose,
            onReConnectSuccess: vue._onReConnectSuccess,
            beforePubilishMsg: vue._beforePubilishMsg,
            beforePubilishMsg: vue._beforePubilishMsg,
            onIMMsgRec: vue._onIMMsgRec,
            onMessageReceived: vue._onMessageReceived,
            onSubscribeSuccess: vue._onSubscribeSuccess,
            onSubscribeFailed: vue._onSubscribeFailed,
        });
        window.mq=mq;

        // console.warn('目前消息系统使用测试环境');
        // console.log(userInfo);
        mq.init({
            // url: 'wss://192.168.11.166:8989',
            // url: 'tcp://10.254.130.28:9090',
            // username: 'imsp2',
            // password: '123456',
            // userID: '120639176564244',
            url: userInfo.serverUrl,
            username: userInfo.username,
            password: userInfo.password,
            userID: userInfo.userId,
            receiver: '',
            // IMtopic: '',
        })
        return mq;
    }


    export default {
        created () {
            Promise.all([
                this.loadMsgHost(),
                this.loadHistoryMsg()
            ]).then(this._postServerMsgRec);
        },
        mounted () {
            // 设置初始位置
            const maxScreenWidth = window.document.body.clientWidth;
            const top = this.$store.state.base.ifFullscreen?82:162;
            const left = maxScreenWidth - 497;
            this.dialogLeft = left;
            this.dialogTop = top;
        },
        data () {
            return {
                // 弹窗是否隐藏
                private_isShow: true,

                private_isDialogMoving: false,
                // 开始移动时，鼠标初始x坐标
                private_beginMouseX: 0,
                // 开始移动时，鼠标初始y坐标
                private_beginMouseY: 0,
                // 开始移动时，css的top初始值
                private_beginDialogTop: 0,
                // 开始移动时，css的left初始值
                private_beginDialogLeft: 0,
                // 当前dialog的top和left的值
                dialogTop: 0,
                dialogLeft: 0,

                // tab列表
                private_tabs: {
                    flight: 1,  // 航班动态 subtype = "1"（数据的 value 是 number 类型，下同）
                    task: 2,   // 任务派发 2
                    transfer: 3,  // 中转消息 3
                    warn: 5, // 预警消息 5
                    totice: 4 // 通知公告 4
                },

                // 是否正在加载历史消息
                private_isLoadingHistory: true,

                // 当前tab
                currentTab: 1,

                // 是否处于搜索状态
                private_isSearching: false,
                // 是否正处于异步请求
                private_isSearching_Ajax: false,
                // 搜索框内容
                searchText: '',
                // 实际搜索的内容
                private_searchText: '',

                focusMsgId: null,
                msgList: [],

                // mqtt 的实例
                mq: null,
                userId: null,

                // 连接错误
                lastFailed: [],
                // 5 个 tab，每个 tab 的上限（这个和总上限不一样，总上限超过后，会去删消息，删到每个 tab 里的消息不超过这个值）
                limitInter: 100,

                //按类型的消息列表
                msgListByType: {}
            }
        },
        computed: {
            // 当前选中的消息
            focusMsg () {
                if (!this.focusMsgId) {
                    return null
                }
                let index = null;
                this.msgList.forEach((item, i) => {
                    if (item.msgId === this.focusMsgId) {
                        index = i
                    }
                });
                return this.msgList[index];
            },
            // msgList实际上存着各种类型的消息，这里是筛选出来真正应该显示的数据
            // 同时还考虑了被清空的消息应该在搜索时被显示的情况
            filterMsgList () {
                const msgList = this.msgList;
                const list = msgList.filter(item => {
                    if (this._isMsgShow(item)) {
                        return true;
                    } else {
                        return false;
                    }
                })
                // console.log(list);
                return list;
            }
        },
        watch: {
            // 鼠标移动时触发，用于解决消息浮窗移动的问题
            '$store.state.event.mouse' (newMouseEvenet) {
                this._dialogMove(newMouseEvenet);
            },
            '$store.state.base.ifFullscreen'(newVal) {
                this.dialogTop = newVal?82:162;;
            }
        },
        methods: {
            // 关闭弹窗
            closeDialog () {
                this.$store.commit('messViewChange');
            },

            // 设置search状态
            setSearchStatus (bool) {
                this.private_isSearching = bool;
            },

            // 切换tab标签
            selectTab (tab) {
                if (this.currentTab !== tab) {
                    this.currentTab = tab;
                    this.focusMsgId = null;
                }
            },

            // 浮窗移动
            _dialogMove (e) {
                // 如果当前不是移动中，那么直接返回
                if (!this._isDialogMoving) {
                    return
                }
                if (e.buttons === 0) {
                    this._dialogOverMove();
                    return;
                }
                const maxScreenWidth = window.document.body.clientWidth;
                const maxScreenHeight = window.document.body.clientHeight;

                let currentX = e.screenX;
                let currentY = e.screenY;
                // 相当于开始移动时，x和y坐标的偏移量
                let offerX = currentX - this.private_beginMouseX;
                let offerY = currentY - this.private_beginMouseY;
                // 计算当前tab应该在的位置
                let left = this.private_beginDialogLeft + offerX;
                let top = this.private_beginDialogTop + offerY;

                // 边界判断
                if (left <= -440 / 2) {
                    left = -440 / 2
                } else if (left > maxScreenWidth - 440 / 2) {
                    // 不能完全拖到最右边（至少要留50%）
                    left = maxScreenWidth - 440 / 2
                }
                if (top <= 0) {
                    top = 0;
                } else if (top > maxScreenHeight - 200) {
                    // 不能完全拖到最下边（至少要留200px高的内容）
                    top = maxScreenHeight - 200;
                }

                this.dialogTop = top;
                this.dialogLeft = left;
            },
            // 浮窗开始移动时（鼠标按下）触发本事件
            _dialogBeginMove (e) {
                this._isDialogMoving = true;
                this.private_beginMouseX = e.screenX;
                this.private_beginMouseY = e.screenY;
                this.private_beginDialogTop = this.dialogTop;
                this.private_beginDialogLeft = this.dialogLeft;
            },
            // 鼠标弹起触发本事件，修改为浮窗无法移动
            _dialogOverMove () {
                this._isDialogMoving = false;
            },
            // 点击某条消息查看
            selectMsg (msgId) {
                if (msgId === this.focusMsgId) {
                    this.focusMsgId = null
                } else {
                    this.focusMsgId = msgId
                }

                this._setMsgReaded(msgId)
            },
            // 取消查看消息详情
            unSelectMsg () {
                this.focusMsgId = null
            },

            // 设置全部清空
            setAllClear () {
                // 假清空，不需要和后端交互，给每个动态一个标记即可
                // 记得区分消息类型
                const type = this.currentTab;
                this.msgList = this.msgList.map(item => {
                    if (item.subtype === type) {
                        item.isClean = true;
                    }
                    return item;
                })
                this.focusMsgId = null;
                //清空后，更新消息数量
                this.updateMsgCount(this.currentTab, 'clearAll')
                this.setAllMsgRead(true);
            },

            // 私有，获取图片 url
            _getImageUrl (item) {
                if (item.subtype === this.private_tabs.totice) {
                    return require('@icon/icon_totice.png')
                } else if(item.subtype === this.private_tabs.transfer) {
                    return require('@icon/icon_transfer.png')
                } else if(item.subtype === this.private_tabs.task) {
                    return require('@icon/icon_task.png')
                } else {
                    try {
                        return IMAGEHREF[item.textBody.msgAir]?IMAGEHREF[item.textBody.msgAir]:IMAGEHREF['DEFAULT']
                    } catch (e) {
                        // console.warning(e);
                        return '';
                    }
                }
            },

            // 获取搜索框，当前搜索消息的类型的文本
            _getSearchTypeText () {
                const obj = {
                    [this.private_tabs.flight]: '航班动态',
                    [this.private_tabs.task]: '任务派发',
                    [this.private_tabs.warn]: '预警消息',
                    [this.private_tabs.totice]: '通知公告',
                    [this.private_tabs.transfer]: '中转消息'
                }
                return obj[this.currentTab];
            },

            // 搜索（前端搜索）
            searchMsg () {
                if (this.private_isSearching_Ajax) {
                    return;
                }
                let msg = this.searchText.trim();

                this.private_isSearching_Ajax = true;

                // 设置搜索关键词
                this.private_searchText = msg;
                this.private_isSearching_Ajax = false;
            },

            // 当前消息是否显示
            _isMsgShow (item) {
                // 非搜索状态下
                if (!this.private_isSearching) {
                    // 类型相符 + 非被清空状态
                    return item.subtype === this.currentTab && !item.isClean
                } else {
                    // 类型相符 + 标题或正文匹配
                    if (item.subtype !== this.currentTab) {
                        return false;
                    }

                    const searchKey = this.private_searchText.trim();
                    if (searchKey.length <= 0) {
                        return true;
                    }

                    let isMatch = true;
                    if (item.textBody.msgTitle.indexOf(searchKey) < 0 && item.textBody.msgText.indexOf(searchKey) < 0) {
                        isMatch = false;
                    }
                    return isMatch;
                }
            },

            // 获取即时消息地址、账号、密码
            loadMsgHost () {
                return $get('/imMessage/messageDefineAction/getImMessageHost').then(response => {
                    if (response.data.code !== 0) {
                        this.$msg.error({info: response.data.msg});
                        return
                    }
                    let userInfo = response.data.data;
                    this.userId = userInfo.userId;
                    // 每项最大值取自返回
                    this.limitInter = response.data.limitInter ? response.data.limitInter : this.limitInter;

                    return userInfo;
                })
            },

            // 获取历史消息
            loadHistoryMsg () {
                return $get('/imMessage/messageDefineAction/getMsgByTime').then(response => {
                    // console.log(response.data)
                    if (response.data.code !== 0) {
                        this.$msg.error({info: response.data.msg});
                        return
                    }
                    let data = response.data.data;
                    let msgList = [
                        ...data.flightDataList, // 航班动态 subtype=1
                        ...data.taskDataList,   // 任务派发 subtype=2
                        ...data.warnDataList,    // 预警消息 subtype=5
                        ...data.toticeDataList, // 通知公告 subtype=4
                        ...data.transferDataList    // 中转消息 subtype=3
                    ]

                    this.msgListByType.flight = this.getMsgCount(data.flightDataList) //初始化消息数量的对象
                    this.msgListByType.task = this.getMsgCount(data.taskDataList)
                    this.msgListByType.warn = this.getMsgCount(data.warnDataList)
                    this.msgListByType.totice = this.getMsgCount(data.toticeDataList)
                    this.msgListByType.transfer = this.getMsgCount(data.transferDataList)

                    msgList = msgList.map(item => {
                        return Object.assign(item, {
                            textBody: JSON.parse(item.textBody)
                        })
                    });
                    this.msgList = msgList
                    this.private_isLoadingHistory = false;
                    return data
                })
            },

            // 告诉服务器消息已接收（读取到历史消息时，调用）
            _postServerMsgRec (result) {
                this.changeIsHasUnread();
                const [userInfo, msgList] = result;
                const {userId} = userInfo
                // console.log('_postServerMsgRec:', userId, msgList)
                let payload = [];
                let reciveType = {
                    'flightDataList': this.private_tabs.flight,
                    'taskDataList': this.private_tabs.task,
                    'toticeDataList': this.private_tabs.totice,
                    'transferDataList': this.private_tabs.transfer,
                    'warnDataList': this.private_tabs.warn,

                }
                Object.keys(msgList).forEach(key => {
                    if (msgList[key].length > 0) {
                        payload.push({
                            "offset": msgList[key][0].msgId,                          //消息Id  最后一条消息的Id
                            "userId": userId,            //用户Id
                            "subType": reciveType[key]       // 消息类型，和 subtype 保持一致
                        })
                    }
                })

                $post('/imMessage/messageDefineAction/ackRecMsg', payload).then(result => {
                    logT('begin connecting')
                    this.mq = createMQTT(userInfo, this);
                })
            },

            // 设置单条消息已读
            // 设置消息为已读状态
            _setMsgReaded (msgId) {
                let index = null;
                let isHaveReaded = false;
                let Msg = {};
                this.msgList.forEach((item, i) => {
                    if (item.msgId === msgId) {
                        index = i;
                        Msg = item;
                        // 如果之前已读
                        if (item.read !== 'N') {
                            isHaveReaded = true;
                        }
                    }
                })
                // 之前已读，则直接返回
                if (isHaveReaded) {
                    return;
                }

                //设置未读后，更新消息数量
                this.updateMsgCount(this.currentTab, 'singleClick')
                // 设置未读为已读
                const item = this.msgList[index];
                item.read = 'Y';
                this.msgList = [
                    ...this.msgList.slice(0, index),
                    item,
                    ...this.msgList.slice(index + 1, this.msgList.length),
                ]
                this._postServerMsgRead(Msg);
            },

            // 检查是否已读
            changeIsHasUnread () {
                let isHasUnread = false;
                let isUnreadNum = 0;
                let isUnreadList = [];
                this.msgList.forEach((item, i) => {
                    if (item.read === 'N') {
                        isHasUnread = true;
                        isUnreadNum ++;
                        if(isUnreadNum <= 5) {
                            isUnreadList.push(item)
                        }
                    }
                })
                this.$store.commit('setUnread', isHasUnread);
                this.$store.commit('setUnreadNum', isUnreadNum);
                this.$store.commit('setUnreadList', isUnreadList);
            },

            // 设置全部已读
            setAllMsgRead (flag) {
                // console.log('全部已读');
                // 先获取当前的tab是哪个类型
                const currentTab = this.currentTab;
                // 找到最先匹配的那个，就是最新的消息
                let lastestMsg = null;
                // 遍历，使用 for 循环是为了方便中止
                for (let i = 0; i < this.msgList.length; i++) {
                    if (this.msgList[i].subtype === currentTab) {
                        // 已经是已读状态时，不需要已读
                        if (this.msgList[i].read !== 'N') {
                            break;
                        }
                        lastestMsg = this.msgList[i];
                        break;
                    }
                }

                // 设置所有已读
                this.msgList = this.msgList.map(item => {
                    if (item.subtype === currentTab) {
                        // 已经是已读状态时，不需要已读
                        item.read = 'Y'
                    }
                    return item
                })
                //全部已读后，更新消息数量
                this.updateMsgCount(this.currentTab, 'selectAll')
                // 如果没找到
                if(flag && lastestMsg === null) {
                    return
                } 
                if (lastestMsg === null) {
                    return this.$msg.error({
                        info: '找不到未读的消息，不需要点击全部已读喔'
                    });
                }

                this._postServerMsgRead(lastestMsg, true, flag);
            },

            // 告诉服务器某条消息已读
            _postServerMsgRead (Msg, isAllRead, flag) {
                this.changeIsHasUnread();
                const {
                    msgId,
                    subtype
                } = Msg;
                const payload = {
                    "offset": msgId,
                    "userId": this.userId,
                    'type': isAllRead ? 0 : 1,
                    'subType': subtype
                };
                $post('/imMessage/messageDefineAction/ackRedMsg', payload).then(response => {
                    // 如果不是全部已读，则不给任何提示
                    if (!isAllRead) {
                        return;
                    }
                    if (response.data.code !== 0) {
                        this.$msg.error({info: response.data.msg});
                        return
                    }
                    if(!flag) {
                        this.$msg.success({info: '全部已读设置成功'})
                    }
                    
                })
            },

            _onConnectSuccess () {
                logT('new onReConnectSuccess')
                // this.$msg.success({info: '消息系统连接成功'});
            },
            // mqttsdk 的生命周期函数，具体参照文档 http://1.82.253.56:3691/wangd/im_sdk_yuetai
            _onConnectFaled () {
                logE('new onConnectFaled');
                let t = Number(new Date())
                this.lastFailed.push(t);
                if (this.lastFailed.length > 3) {
                    // 如果连续 3 次的断线间隔小于 5 秒，认为当前网络有问题
                    if (t - this.lastFailed[this.lastFailed.length - 3] < 5000) {
                        this.$msg.error({info: '消息系统断开链接', tip: '请刷新页面恢复消息连接'});
                        this.mq.closeConnection();
                    }
                }
                // this.$msg.error({info: '消息系统断开链接', tip: '正在自动连接ing，或者请刷新页面'});
            },
            _onReConnectSuccess () {
                logT('new onReConnectSuccess')
                this.$msg.success({info: '消息系统重新连接成功'});
            },
            // 当收到推送消息时
            _onIMMsgRec (msg, msgObj, uint8arr) {
                logT(`new onIMMsgRec! msg:${msg}, msgObj:`, msgObj, ` uint8arr: `, uint8arr);
                let textBody = JSON.parse(msgObj.text);
                let recMsg = Object.assign({}, msgObj, {
                    textBody: textBody,
                    read: "N",
                    subtype: msgObj.subtype
                })
                // console.log('recMsg',recMsg);
                //消息推送后，更新消息数量
                this.updateMsgCount(recMsg, 'ws')
                // console.log(this.msgList);
                // 在最前面插入
                this.msgList.unshift(recMsg);
                // console.log('当前消息个数：', this.msgList.length)
                // 如果消息总数超过 MAXTOTALMESSAGEAMOUNT，则清除比较早的消息。每个消息只保存最近 50 条
                if (this.msgList.length > MAXTOTALMESSAGEAMOUNT) {
                    let msgCount = {
                        '1': 0,
                        '2': 0,
                        '3': 0,
                        '4': 0,
                        '5': 0,
                    }
                    // 过滤一遍
                    this.msgList = this.msgList.filter(item => {
                        
                        const type = item.subtype;
                        const typeCount = msgCount[type];
                        // 如果该类消息已经大于 this.limitInter 条（初始默认 50，数据取自后端，可能会改）
                        if (typeCount > this.limitInter) {
                            return false
                        }
                        msgCount[type] = msgCount[type] + 1;
                        return true;
                    })

                    /**
                     * 补充：重新计算每个tab下面未读消息的数量 
                     * 航班动态 subtype=1 
                     * 任务派发 subtype=2 
                     * 预警消息 subtype=5 
                     * 通知公告 subtype=4 
                     * 中转消息 subtype=3
                     */
                    let newMsgDataList = {
                        flightDataList: [],
                        taskDataList: [],
                        warnDataList: [],
                        toticeDataList: [],
                        transferDataList: []
                    }
                    this.msgList.forEach(item=>{
                        if(item.subtype == 1) {
                            newMsgDataList.flightDataList.push(item)
                        } else if(item.subtype == 2) {
                            newMsgDataList.taskDataList.push(item)
                        } else if(item.subtype == 5) {
                            newMsgDataList.warnDataList.push(item)
                        } else if(item.subtype == 4) {
                            newMsgDataList.toticeDataList.push(item)
                        } else if(item.subtype == 3) {
                            newMsgDataList.transferDataList.push(item)
                        }
                    })
                    this.msgListByType.flight = this.getMsgCount(newMsgDataList.flightDataList) //初始化消息数量的对象
                    this.msgListByType.task = this.getMsgCount(newMsgDataList.taskDataList)
                    this.msgListByType.warn = this.getMsgCount(newMsgDataList.warnDataList)
                    this.msgListByType.totice = this.getMsgCount(newMsgDataList.toticeDataList)
                    this.msgListByType.transfer = this.getMsgCount(newMsgDataList.transferDataList)
                    
                    // console.log('clear', this.msgList);
                }
                this.changeIsHasUnread();
                // 调用内置方法，设置消息已收到
                this.mq.msgReceived(msgObj.msgId);
            },
            _onSubscribeFailed (topic, err) {
                this.$msg.error({info: '消息系统推送接收失败', tip: '若不能正常接收消息，请刷新页面'});
            },
             getMsgCount (obj) { //初始化每种消息类型的未读消息数
               let count = 0
               for (var i = 0; i <= obj.length - 1; i++) {
                 if (obj[i].read == 'N') {
                   count = count + 1
                 }
               }
               return count
            },
            updateMsgCount (obj, msgType) { //消息推送 && 点击未读后，按照类型更新消息数量
              for (var msg in this.private_tabs) {
                if (this.private_tabs.hasOwnProperty(msg)) {
                  if (msgType == 'ws' && obj.subtype == this.private_tabs[msg]) {
                     this.msgListByType[msg] = this.msgListByType[msg] + 1
                  } else if (msgType == 'singleClick' && obj == this.private_tabs[msg]) {
                    this.msgListByType[msg] = this.msgListByType[msg] - 1
                  } else if (msgType == 'selectAll' && obj == this.private_tabs[msg]) {
                    this.msgListByType[msg] = 0
                  } else if (msgType == 'clearAll' && obj == this.private_tabs[msg]) {
                    this.msgListByType[msg] = 0
                    // this.msgListByType = {
                    //   flight: 0,
                    //   task: 0,
                    //   warn: 0,
                    //   totice: 0,
                    //   transfer: 0
                    // }
                  }
                }
              }
            }
        },
        destroyed () {
            // 防止出错
            try {
                this.mq.closeConnection();
            } catch (e) {
                // console.log(e);
            }
        }
    }
</script>


