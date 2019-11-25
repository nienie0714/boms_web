<template>
    <div class="msg-detail">
        <div class="close-btn" @click="close(false)"></div>

        <div class="title">{{selectRowData.msgWarnId?'编辑':'新增'}}预警设置</div>

        <div class="input-box first-row left">
            <div class="label">
                消息类型编号
            </div>
            <input class="input" type="text" v-model="msgTypeNo">
        </div>
        <div class="input-box first-row right">
            <div class="label">
                消息类型名称
            </div>
            <input class="input" type="text" v-model="msgTypeCn">
        </div>
        <div class="input-box second-row left">
            <div class="label">
                消息子类型编号
            </div>
            <input class="input" type="text" v-model="msgTypeSubNo">
        </div>
        <div class="input-box second-row right">
            <div class="label">
                消息子类型名称
            </div>
            <input class="input" type="text" v-model="msgTypeSubCn">
        </div>
        <div class="input-box third-row left">
            <div class="label">
                预警阈值1
            </div>
            <input class="input" type="text" v-model="warning1" @blur="blurWarning1">
            <!-- <p class="tip">说明：-99~99之前的整数，且阈值1小于等于阈值2</p> -->
        </div>
        <div class="input-box third-row right">
            <div class="label">
                预警阈值2
            </div>
            <input class="input" type="text" v-model="warning2" @blur="blurWarning2">
        </div>

        <div class="remark-title">备注</div>
        <textarea class="remark-textarea" v-model="remark" maxlength="1000"></textarea>

        <div class="close" @click="close(false)">取消</div>
        <div class="ok"
             :class="{disable:private_isloading||isWarningValueError()}"
             @click="save">
            {{private_isloading?"保存中":"保存"}}
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

        .input-box {
            position: absolute;
            width: 292px;
            height: 38px;
            background-color: #fff;
            border: 1px solid rgba(221, 230, 237, 1);
            border-radius: 6px;
            display: flex;
            padding-right: 3px;

            .label {
                height: 36px;
                line-height: 36px;
                background: #eff3f7;
                text-align: center;
                padding: 0 12px;
                font-size: 14px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: rgba(137, 157, 178, 1);
                display: inline-block;
                white-space: nowrap;
            }

            .input {
                flex-grow: 1;
                height: 36px;
                display: inline-block;
                border: none;
                border-radius: 0;
                outline: none;
            }

            .input:focus {
                border: none;
                outline: none;
            }

            .input:hover {
                border: none;
                outline: 0 rgba(0, 0, 0, 0);
            }
        }

        .first-row {
            top: 72px;
        }

        .second-row {
            top: 130px;
        }

        .third-row {
            top: 188px;
            &.left {
                position: relative;
                .tip {
                    position: absolute;
                    bottom: -20px;
                    left: 0;
                    font-size: 12px;
                    color: #899db2;
                }
            }
            
        }

        .left {
            left: 20px;
        }

        .right {
            left: 328px;
        }

        .remark-title {
            position: absolute;
            top: 247px;
            left: 20px;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: rgba(137, 157, 178, 1);
            line-height: 14px;
        }

        .remark-textarea {
            position: absolute;
            top: 272px;
            left: 20px;
            width: 600px;
            min-height: 80px;
            max-height: 400px;
            background: rgba(255, 255, 255, 1);
            border: 1px solid rgba(221, 230, 237, 1);
            border-radius: 6px;
        }

        .base-bottom-btn {
            position: absolute;
            bottom: 20px;
            width: 100px;
            height: 38px;
            line-height: 38px;
            box-shadow: 0px 5px 20px 0px rgba(99, 126, 153, 0.25);
            border-radius: 6px;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            cursor: pointer;
        }

        .close {
            @extend .base-bottom-btn;
            left: 237px;
            background: rgba(255, 255, 255, 1);
            color: rgba(137, 157, 178, 1);
        }

        .ok {
            @extend .base-bottom-btn;
            left: 354px;
            background: linear-gradient(to right, rgb(70, 166, 249), rgb(87, 140, 254));
            color: #FFFFFF;
        }

        .ok.disable {
            cursor: not-allowed;
            background: #c8c9cc;
            border-color: #c8c9cc;
        }
    }
</style>

<script>
    import {queryAll as $post, update as $put} from '@/util/base';

    export default {
        name: "MessageAlertSettingsEdit",
        created () {
            const msgWarnId = this.selectRowData.msgWarnId;
            if (msgWarnId) {
                this.msgTypeNo = this.selectRowData.msgTypeNo;
                this.msgTypeCn = this.selectRowData.msgTypeCn;
                this.msgTypeSubNo = this.selectRowData.msgTypeSubNo;
                this.msgTypeSubCn = this.selectRowData.msgTypeSubCn;
                this.warning1 = this.selectRowData.warning1;
                this.warning2 = this.selectRowData.warning2;
                this.remark = this.selectRowData.remark || "";
            }
        },
        props: {
            closeEdit: Function,
            selectRowData: Object
        },
        data () {
            return {
                private_isloading: false,

                msgTypeNo: '',
                msgTypeCn: '',
                msgTypeSubNo: '',
                msgTypeSubCn: '',
                warning1: '',
                warning2: '',
                remark: ''
            }
        },
        watch: {
            msgTypeNo (newValue, oldValue) {
                this.msgTypeNo = newValue.replace(/[^0-9a-zA-Z_\-]/g, '').slice(0, 20)
            },
            msgTypeSubNo (newValue, oldValue) {
                // /[^\u4E00-\u9FA5]/g
                this.msgTypeSubNo = newValue.replace(/[^0-9a-zA-Z_\-]/g, '').slice(0, 20)
            },
            msgTypeCn (newValue, oldValue) {
                this.msgTypeCn = newValue.replace(/[^\u4E00-\u9FA5]/g, '').slice(0, 20)
            },
            msgTypeSubCn (newValue, oldValue) {
                this.msgTypeSubCn = newValue.replace(/[^\u4E00-\u9FA5]/g, '').slice(0, 20)
            },
            warning1 (newValue, oldValue) {
                // 规则：
                // 1 > 2
                // 且两个值范围处于 -99~99（含） 之间
                // 当一个为 0 时，认为失效，另一个不受范围限制
                // debugger;
                let v = 0;
                // 转为数字
                if (typeof newValue === 'string') {
                    let n = newValue.replace(/[^0-9\-]/g, '');
                    if (n === '-' || n === '') {
                        this.warning1 = n;
                        return
                    } else {
                        v = Number(n);
                    }
                } else {
                    v = newValue
                }
                // 排除不合法情况（如 NaN）
                if (v !== v) {
                    v = 0;
                } else if (v > 99) {
                    // 先约束 v 的最大最小值
                    v = 99;
                } else if (v < -99) {
                    v = -99;
                }

                this.warning1 = v;
            },
            warning2 (newValue) {
                // 规则：
                // 1 > 2
                // 且两个值范围处于 -99~99（含） 之间
                // 当一个为 0 时，认为失效，另一个不受范围限制
                // debugger;
                let v = 0;
                // 转为数字
                if (typeof newValue === 'string') {
                    let n = newValue.replace(/[^0-9\-]/g, '');
                    if (n === '-' || n === '') {
                        this.warning2 = n;
                        return
                    } else {
                        v = Number(n);
                    }
                } else {
                    v = newValue
                }
                // 排除不合法情况（如 NaN）
                if (v !== v) {
                    v = 0;
                } else if (v > 99) {
                    // 先约束 v 的最大最小值
                    v = 99;
                } else if (v < -99) {
                    v = -99;
                }

                this.warning2 = v;
            },
            remark (newValue) {
                this.remark = newValue.slice(0, 1000);
            }
        },
        methods: {
            // 注：目前没有写关于更新时的相关逻辑
            close (isUpdate) {
                this.closeEdit(isUpdate);
            },

            // 保存，先验逻辑
            save () {
                if (this.private_isloading) {
                    return;
                }
                if (this.isWarningValueError()) {
                    return this.$msg.error({
                        info: '灰色按钮时，表示输入内容不合法，请修正后再输入'
                    });
                }
                // console.log('保存');
                const data = {
                    msgTypeNo: this.msgTypeNo,
                    msgTypeCn: this.msgTypeCn,
                    msgTypeSubNo: this.msgTypeSubNo,
                    msgTypeSubCn: this.msgTypeSubCn,
                    warning1: this.warning1,
                    warning2: this.warning2,
                    remark: this.remark,
                };

                let isEmpty = false;
                Object.keys(data).forEach(key => {
                    // 内容为 0，并且不是备注。则不允许提交
                    if (data[key].length === 0 && key !== 'remark' && key !== 'warning1' && key !== 'warning2') {
                        isEmpty = true;
                    }
                })

                // 如果为空，返回，提示错误信息
                if (isEmpty) {
                    return this.$msg.error({
                        info: '有内容为空'
                    })
                }
                // 如果值为 0，视为空
                if (Number(data.warning2) === 0) {
                    data.warning2 = 0;
                }
                if (Number(data.warning1) === 0) {
                    data.warning1 = 0
                }

                const msgWarnId = this.selectRowData.msgWarnId;

                this.private_isloading = true;

                if (msgWarnId) {
                    data.msgWarnId = msgWarnId;
                    this.update(data);
                } else {
                    this.add(data);
                }
            },

            // 新增
            add (data) {
                $post('/imMessage/messageWarning', data).then(response => {
                    if (response.data.code !== 0) {
                        return this.$msg.error({info: response.data.msg});
                    }
                    // 此时说明新增成功，关闭窗口
                    this.close(true);
                }).catch(() => {
                    this.$msg.error({info: '未知错误'});
                }).finally(() => {
                    this.private_isloading = false;
                })
            },

            // 编辑
            update (data) {
                $put('/imMessage/messageWarning', data).then(response => {
                    if (response.data.code !== 0) {
                        return this.$msg.error({info: response.data.msg});
                    }
                    // 此时说明新增成功，关闭窗口
                    this.close(true);
                }).catch(() => {
                    this.$msg.error({info: '未知错误'});
                }).finally(() => {
                    this.private_isloading = false;
                })
            },

            blurWarning1 () {
                // 规则：
                // 1 > 2
                // 且两个值范围处于 -99~99（含） 之间
                // 当一个为 0 时，认为失效，另一个不受范围限制
                // 这里处理 2 个值的联动
                let v1 = this.warning1;
                let v2 = this.warning2;

                // 排除一切特殊情况，将值设置为 0，此时对 2 的值不影响
                if (Number(v1) !== Number(v1) || v1 == 0) {
                    this.warning1 = 0;
                    return;
                }
                // v2 等于 0 时，v1 可以是 -99~99 的任何值
                if (v2 == 0) {
                    return;
                }

                // 如果 1 比 2 大，那么强制让 1 等于 2
                if (v1 > v2) {
                    if (v1 != 99) {
                        this.warning1 = this.warning2 
                    }
                }
                // 统一处理的情况是 1 比 2 大，只要排除 1 和 2 都是 99 的时候的情况，让 2 等于 99 即可
                if (v1 === 99) {
                    this.warning2 = 99;
                }
            },

            blurWarning2 () {
                // 规则：
                // 1 > 2
                // 且两个值范围处于 -99~99（含） 之间
                // 当一个为 0 时，认为失效，另一个不受范围限制
                // 这里处理 2 个值的联动
                let v1 = this.warning1;
                let v2 = this.warning2;

                // 排除一切特殊情况，将值设置为 0，此时对 2 的值不影响
                if (Number(v2) !== Number(v2) || v2 == 0) {
                    this.warning2 = 0;
                    return;
                }
                // v1 等于 0 时，v2 可以是 -99~99 的任何值
                if (v2 == 0) {
                    return;
                }

                // 如果 1 比 2 大 ，那么强制让 2 等于 1
                if (v1 > v2) {
                    if (v1 != -99) {
                        this.warning2 = this.warning1 
                    }
                }
                // 统一处理的情况是 1 比 2 大，只要排除 1 和 2 都是 99 的时候的情况，让 2 等于 99 即可
                if (v1 === -99) {
                    this.warning2 = -99;
                }
            },


            isWarningValueError () {
                const v1 = this.warning1;
                const v2 = this.warning2;
                // warning1 需要大于 warning2
                // warning1 为 0 的前提是 warning2 为 0
                if (v1 === 0 || v2 === 0) {
                    return false;
                }
                if (this.warning1 > this.warning2) {
                    return true;
                }
            }
        }
    }
</script>
