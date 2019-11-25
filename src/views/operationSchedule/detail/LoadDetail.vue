<template>
    <!-- 员工上岗查询-新增、编辑、详情 -->
    <my-dialog v-bind="$attrs" v-on="$listeners" :visible="visible" :position="'right'" class="form-dialog under-head-dialog" :title="title + typeName" @handleClose="handleClose">
        <template>
            <div v-if="typeName=='详情'">
                <div class="form" >
                <Row v-for="(item, index) in detailColumn" :key="index" justify="start" class="his-info-normal">
                    <i-col v-for="obj in item" :key="obj.key" :span="obj.span">
                        <div class="his-info-title">{{obj.label}}</div>
                        <div class="his-info-cont" :style="`color: ${obj.key == 'flightNo2' || obj.key == 'stand' || obj.key == 'chute'?'#3392FF':''}`">
                            <template v-if="obj.type == 'tree'">
                                <el-tree :data="obj.value" :props="{children: 'children',label: 'text'}"></el-tree>
                            </template>
                            <template v-else>
                                <template v-if="typeof obj.value === 'object'">
                                    <span v-for="(val, index) in obj.value" :key="index" style="margin-right: 5px">{{val}}</span>
                                </template>
                                <template v-else>
                                    {{obj.value}}
                                </template>
                            </template>
                        </div>
                    </i-col>
                </Row>
                </div>
            </div>
        </template>
        <template v-slot:footer="{closeDialog}">
                <button @click="closeDialog">取 消</button>
                <button v-if="submit" type="primary" @click="handleSubmit">确 认</button>
        </template>

    </my-dialog>
</template>

<script>

import utilMixin from '@mixin/utilMixin'
import { queryAll,queryAllGet } from '@/util/base'
import _ from 'lodash'

export default {
    components: {

    },
    mixins: [utilMixin],
    props: ['data', 'type', 'visible', 'date'],
    data () {
        return {
            title: '员工上岗',
            detailColumn: [
                [        
                    {key: 'teamName', label:'班组名称', span: '12'},
                    {key: 'empName', label:'班组人员', span: '6'},
                    {key: 'nodeCn', label:'保障环节', span: '6'},
                ],
                [
                    {key: 'flightNo1', label:'计划保障航班号', span: '24'},
                ],
                [
                    {key: 'flightNo2', label:'保障中航班号', span: '24'},
                ],
                [
                    {key: 'stand', label:'保障中航班机位', span: '24'},
                ],
                [
                    {key: 'chute', label:'保障中滑槽号', span: '24'},
                ],
                [
                    {key: 'flightNo3', label:'已保障航班号', span: '24'},
                ],
            ],
            typeName: '',
            submit: false,
            formData: {},
            errors: {},
            detailHis: {},
        }
    },
    created() {
    },
    methods: {
        handleChange (item, val) {
            let value = val
            if (_.isNumber(value) || _.isString(value)) {
                value = value.toString().trim()
                if (item.hasOwnProperty('toUpper') && item.toUpper) {
                    value = value.toUpperCase()
                }
            }
            if (item.hasOwnProperty('method')) {
                let method = item.method
                method(this.data[item.key], param => {
                    if (param) {
                        if (Array.isArray(param)) {
                            param.forEach(item => {
                                this.$set(this.data, item.key, item.value)
                            })
                        } else {
                            this.$set(this.data, param.key, param.value)
                        }
                    }
                })
            }
            this.handleError(item.key, value)
            // this.$emit('changeData', {data: this.data, type: this.type})
        },
        handleSubmit () {
            // let nodes = this.$refs.chuteTree.getCheckedKeys();
            
            // this.errors = {}
            let hiddenKeys = []
            // 表单字段隐藏时不校验
            this.formColumn.forEach((item, index) => {
                if (item.hasOwnProperty('isHidden')) {
                    hiddenKeys.push(item.key)
                }
            })
            _.forEach(this.rules, (arr, key) => {
                if(!hiddenKeys.includes(key)) {
                    if (!this.errors.hasOwnProperty(key)) {
                        this.handleError(key, this.formData[key])
                    }
                }
            })
            if (!_.isEmpty(this.errors)) {
                return
            } else {
                this.$emit('handleSubmit', {data: this.formData, type: this.type})
            }
        },
        handleError (key, value) {
            this.$delete(this.errors, key)
            if (this.type == 'detail') {
                return
            }
            if (this.rules.hasOwnProperty(key)) {
                let arr = this.rules[key]
                for (let i = 0; i < arr.length; i++) {
                    let item = arr[i]
                    if (item.type == 'require') {
                        if(Array.isArray(value)) {
                            if(!value.length) {
                                this.$set(this.errors, key, '必填')
                                break
                            }
                        } else {
                            if (!value && value !== 0) {
                                this.$set(this.errors, key, '必填')
                                break
                            }
                        }

                    } else if (item.type == 'unique') {
                        let k = item.hasOwnProperty('key') ? item['key'] : key
                        if (value || value === 0) {
                            let url = item.url + '/checkExist'
                            let data = {}
                            let k = item.hasOwnProperty('key') ? item['key'] : key
                            this.$set(data, k, value)
                            if (this.formData == null) {
                                queryAll(url, data).then(res => {
                                    if (res.data.code == 0 && res.data.data.hasOwnProperty('exist')) {
                                        this.$set(this.errors, key, '数据已存在')
                                    }
                                }).catch(err => {
                                    this.$msg.error({
                                        info: '请求异常 !',
                                        tip: err
                                    })
                                })
                            } else if (value != this.formData[k]) {
                                queryAll(url, data).then(res => {
                                    if (res.data.code == 0 && res.data.data.hasOwnProperty('exist')) {
                                        this.$set(this.errors, key, '数据已存在')
                                    }
                                }).catch(err => {
                                    this.$msg.error({
                                        info: '请求异常 !',
                                        tip: err
                                    })
                                })
                            }
                        }
                    } else if (item.type == 'regex') { // 匹配
                        let reg = item.reg
                        if (!reg.test(value)) {
                            let info = item.hasOwnProperty('info') ? item['info'] : '数据格式有误'
                            this.$set(this.errors, key, info)
                            break
                        }
                    } else if (item.type == 'regexRvs') { // 不匹配
                        let reg = item.reg
                        if (reg.test(value)) {
                            let info = item.hasOwnProperty('info') ? item['info'] : '数据格式有误'
                            this.$set(this.errors, key, info)
                            break
                        }
                    } else if (item.type == 'method') {
                        let method = item.method
                        method(value, param => {
                        })
                    }
                }
            }
        },
        handleClose () {
          // this.updateData()// 新增页面关闭后打开字段不清空。bug:编辑页面修改后取消 重新打开会保留上次错误信息
            // this.$emit('handleClose')
        },
    },
    watch: {
        data: {
            handler (data) {
                
            },
            immediate: true
        },
        visible: {
            handler (visible) {
                if (visible) {
                    let type = this.type
                    switch (type) {
                        case 'detail': this.typeName = '详情'
                        if (this.detailColumn ) {
                          for (let i = 0; i < this.detailColumn.length; i++) {
                            for (let j = 0; j < this.detailColumn[i].length; j++) {
                              if (this.detailColumn[i][j].formatter && this.data[this.detailColumn[i][j].key]) {
                                this.$set(this.detailColumn[i][j], 'value', this.data[this.detailColumn[i][j].key].substr(0, 10))
                              } else {
                                this.$set(this.detailColumn[i][j], 'value', this.data[this.detailColumn[i][j].key])
                              }
                            }
                          }
                        }
                        this.submit = false;
                        break
                        case 'insert': this.typeName = '新增'
                        this.submit = true;
                        this.formData = {};
                        break
                        case 'update': this.typeName = '编辑'
                        this.submit = true;
                        this.$set(this, 'formData', JSON.parse(JSON.stringify(this.data)));
                        break
                    }
                } 
            },
            
        },   
    }
}
</script>

<style lang="scss" scoped>

.form-dialog {
    .body {
        overflow: hidden;
    }
    .form {
        height: 100%;
        padding: 0 20px;
        overflow-x: hidden;
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
    }

    .form-row, .form-item {
        min-height: 60px;
        display: flex;
        // align-items: center;
        justify-content: flex-start;
    }
    .form-item {
        flex-wrap: nowrap;
        flex-direction: column;
        position: relative;
        .table-insert {
            display: flex;
            width: 52px;
            position: absolute;
            top: 0;
            right: 0;
            >.icon {
                width: 20px;
                height: 20px;
                background-image: url(~@icon/toolbar/icon_insert.png);
            }
            >.label {
                margin-left: 6px;
            }
        }
        // overflow: auto;
        &:nth-child(odd) {
        }
        &:nth-child(1) {
            width: 286px;
            height: 400px;
            margin-right: 16px;
            position: relative;
        }
        &:nth-child(2) {
            width: 286px;
            height: 400px;
            position: relative;
        }

        &.whole-width {
            width: 100%;
            margin-right: 0px;
        }
        &.error {
            .input-tag {
                border: 1px solid rgba($color: $red-shadow, $alpha: 0.8);
                box-shadow: 0 0 0 2px rgba($color: $red-shadow, $alpha: 0.3);
            }
            textarea {
                border: 1px solid rgba($color: $red-shadow, $alpha: 0.8);
                box-shadow: 0 0 0 2px rgba($color: $red-shadow, $alpha: 0.3);
            }
        }
        >.error {
            color: $red;
            font-size: 10px;
            display: inline;
        }
        >.label {
            font-size: 12px;
            margin-bottom: 5px;
            color: $gray-nd;
            align-self: flex-start;
        }
        .choose-btn {
            position: absolute;
            right: -200px;
            button {
                height: 38px;
            }
        }

        textarea {
            border: 1px solid rgba($color: $gray-border, $alpha: 1);
            border-radius: 6px;
            font-size: 14px;
            width: 100%;
            min-height: 80px;
            resize: none;
            margin-bottom: 20px;

            &:focus, &:hover {
                border: 1px solid rgba(63, 153, 255, 0.8);
                box-shadow: 0 0 0 2px rgba($color: $blue-shadow, $alpha: .3);
            }
        }

        .tree-wrapper {
            border: 1px solid rgba($color: $gray-border, $alpha: 1);
            border-radius: 6px;
            width: 100%;
        }
    }
    .form-radio {
        color: #899db2;
        font-size: 14px;
        line-height: 40px;
        label {
            display: inline-block;
            width: 80px;
            text-align: left;
        }
    }
    .his-info-normal {
        width: 100%;
        height: fit-content;
        padding: 20px 0;
        border-bottom: 1px solid rgba(221,230,237,1);
        &:last-child{
            border-bottom: none;
        }
        &:first-child{
            padding-top: 0px;
        }
    }
    .his-info-title {
        font-size: 14px;
        color: #899DB2;
        text-align: left;
        margin-bottom: 8px;
    }
    .his-info-cont {
        max-width: 600px;
        padding-right: 6px;
        overflow-y: auto;
        font-size: 16px;
        min-height: 16px;
        line-height: 16px;
        color: #3d424d;
        text-align: left;
        word-wrap: break-word;
        word-break: break-all;
    }

    .ivu-tree ul {
        font-size: 16px;
    }

    // 选择人员和滑槽
    .schedule-form {
        width: 100%;
        height: 380px;
        .schedule-form-item {
            height: 100%;
            width: 100%;
            text-align: left;
            >span {
                font-size: 14px;
                color: #899DB2;
            }
            >div.tree {
                height: calc(100% - 35px);
                margin-top: 10px;
                padding: 10px;
                border: 1px solid #DDE6ED;
                border-radius: 6px;
                overflow: auto;
            }
        }
        /deep/.el-tree {
            font-size: 14px;
            .el-tree-node__expand-icon {
                width: 16px;
                height: 16px;
                background: #64717f;
                border-radius: 50%;
                position: relative;
                margin-right: 2px;
            }
            .el-icon-caret-right:before {
                content: "\e6e0";
                position: absolute;
                top: 3px;
                left: 2px;
                color: #fff;
            }
            .el-checkbox__inner {
                width: 16px;
                height: 16px;
                border-radius: 20%;
                &::after {
                   
                }
            }
            .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
                background-color: #3392ff;
                border-color: #3392ff;
            }
            .el-tree-node__content>.el-checkbox {
                margin-right: 10px;
            }
        }
    }

    /deep/.el-radio {
        .el-radio__inner {
            width: 16px;
            height: 16px;
        }
        .el-radio__original {
            height: 0;
        }
    }
}
</style>
