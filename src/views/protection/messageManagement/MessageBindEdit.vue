<template>
    <div class="msg-edit">
        <div class="close-btn"
             @click="close(false)"></div>
        <div class="tab-list">
            <div class="tab"
                 :class="{focus: private_type === 'department', disable: edit_type === 'single'}"
                 @click="selectType('department')">
                部门
            </div>
            <div class="tab"
                 :class="{focus:private_type==='role',disable:edit_type==='single'}"
                 @click="selectType('role')">
                角色
            </div>
        </div>

        <div class="search-box">
            <div class="search-left">
                <div class="search-type">
                    {{private_type==='department'?'部门':'角色'}}
                </div>
                <el-select v-model="selectValue"
                           multiple
                           collapse-tags
                           placeholder="请选择"
                           :disabled="edit_type === 'single'"
                           clearable>
                    <el-option v-for="item in selectOptions"
                               :key="item.id"
                               :label="item.label"
                               :value="item.id">
                    </el-option>
                </el-select>
            </div>

            <div class="search-btn" @click="queryStaffData">查询</div>
        </div>

        <div class="tree-title">
            <div class="title-staff">员工</div>
            <div class="title-msg">已绑消息</div>
        </div>
        <!-- 两棵树 -->
        <div class="tree">
            <!-- 员工树 -->
            <div class="tree-staff">
                <div class="tree-msg-header">
                    <div class="tree-msg-check"
                         :class="{allcheck:staffAllChecked}" @click="checkAllStaff"></div>
                    <div class="all-check-label">全选</div>
                </div>
                <!-- expanded 默认展开 -->
                <!-- default-checked-keys 默认选中 -->
                <el-tree :data="staffData"
                         show-checkbox
                         node-key="id"
                         default-expand-all
                         :empty-text="staffEmptyText"
                         :props="defaultSProps"
                         @check-change="isStaffAllChecked"
                         ref="staffTree">
                </el-tree>
            </div>

            <!-- 消息树 -->
            <div class="tree-msg">
                <div class="tree-msg-header">
                    <div class="tree-msg-check"
                         :class="{allcheck:msgAllChecked}" @click="checkAllMsg"></div>
                    <div class="all-check-label">全选</div>
                </div>
                <el-tree :data="msgData"
                         show-checkbox
                         node-key="id"
                         default-expand-all
                         :empty-text="msgEmptyText"
                         :props="defaultSProps"
                         @check-change="isMsgAllChecked"
                         ref="msgTree">
                </el-tree>
            </div>
        </div>

        <!-- 按钮 -->
        <div class="close" @click="close(false)">取消</div>
        <div class="ok"
             :class="{disable:private_msg_committing}"
             @click="commit">{{private_msg_committing?'提交中':'确定'}}
        </div>
    </div>
</template>

<script>
    import {getQueryAll as $get, queryAll as $post} from '@/util/base';

    export default {
        name: "MessageBindEdit",
        created () {
            if (this.edit_type !== 'single') {
                // 拉取部门、角色下拉框列表数据。编辑单个人的时候不需要
                this.querySelect();
            }

            // 请求所有消息
            this.queryAllMsg();
        },
        mounted () {
            // 编辑单个人的时候执行特别的权限逻辑
            if (this.edit_type === 'single') {
                this.privateInitWhenSingle();
            } else {
                this.queryStaffData(true);
            }
            window.tree = this.$refs.msgTree;
            this.$refs.msgTree.$data.store.lazy = false;
        },
        props: {
            edit_type: String,
            closeEdit: Function,
            singleRowData: Object
        },
        data () {
            return {
                // 当前选择的类型
                private_type: 'role', // 标签，部门 department，角色 role

                // 以下三个用于：加载全部消息 + 加载当前人员绑定的消息 ——》在全部消息中，勾选当前人员绑定的消息
                private_single_load_bind_success: false,    // 编辑单人时，该人员绑定消息是否加载完毕
                private_allmsg_success: false,  // 全部消息是否加载完毕
                private_single_bind_msg: [],    // 单人绑定的消息列表

                // 存储部门和角色的内容
                DeptAndRoleList: {
                    // 这个属性存在并为 true 时，表示还没拉取到数据。拉取到数据（正确：不存在这个属性。报错：值为 false）
                    // 单人模式下，isLoading没什么意义——因为禁止选择下拉框
                    isLoading: true,
                    isError: false,     // 这个属性存在并未 true 会时，代表加载错误
                },

                // 下拉框选中的值
                selectValue: [],

                defaultSProps: {
                    children: 'children',   // 值的 key 表示子节点的 key 是 children
                    label: 'text'  // 值代表的 key 表示 显示的文字
                },

                // defaultMsgProps: {
                //     children: 'children',   // 值的 key 表示子节点的 key 是 children
                //     label: 'text'  // 值代表的 key 表示 显示的文字
                // },

                staffData: [
                    // 示例数据
                    // {
                    //     id: 1,
                    //     label: '一级 1',
                    //     disabled: true, // 表示禁用
                    //     children1: [
                    //         {
                    //             id: 4,
                    //             label: '二级 1-1'
                    //         }
                    //     ]
                    // },
                ],
                // 没有数据时显示的内容
                staffEmptyText: '待查询',

                msgData: [],
                // 没有数据时显示的内容
                msgEmptyText: '待查询',

                // 已绑定消息是否全选
                msgAllChecked: false,
                // 所有人员是否全选
                staffAllChecked: false,

                // 是否提交中
                private_msg_committing: false,
            }
        },
        computed: {
            // 下拉选项，待查询内容，根据 type 不同显示不同
            selectOptions () {
                // 如果是加载中
                if (this.DeptAndRoleList.isLoading) {
                    return [
                        {
                            id: null,
                            label: '加载中',
                            disabled: true
                        }
                    ]
                }

                // 如果是加载错误
                if (this.DeptAndRoleList.isError) {
                    return [
                        {
                            id: null,
                            label: '加载错误',
                            disabled: true
                        }
                    ]
                }

                // 如果是部门
                if (this.private_type === 'department') {
                    return this.DeptAndRoleList.dept;
                } else /*if (this.private_type === 'role')*/ {
                    return this.DeptAndRoleList.role;
                }
            },
        },
        methods: {
            // 当选中个人的时候，需要执行特殊的初始化逻辑
            privateInitWhenSingle () {
                const rowData = Object.assign({}, this.singleRowData, {
                    text: this.singleRowData.empName,
                    id: this.singleRowData.userId
                });
                this.staffData = [
                    rowData
                ]
                // 设置左边树只有这个人并默认选中这个人
                this.$refs.staffTree.setCheckedKeys([rowData.id])
                this.isStaffAllChecked();

                // 拉取这个人选中的消息
                $post('/imMessage/messageSubscribe/querySubThemeUserBing', {
                    userId: rowData.userId
                }).then(response => {
                    // console.log(response.data)
                    if (response.data.code !== 0) {
                        this.$msg.error({
                            info: response.data.msg
                        });
                        return;
                    }
                    let data = response.data.data;
                    let checkedIdList = data.map(item => item.routerkey);
                    // console.log(checkedIdList)
                    this.private_single_bind_msg = checkedIdList;
                    this.private_single_load_bind_success = true;
                    this.checkSingleTypeBindMsg();
                })
            },

            // 选中某个人绑定的消息
            checkSingleTypeBindMsg () {
                // 非单人模式下，直接返回
                if (this.edit_type !== 'single') {
                    return;
                }
                if (this.private_single_load_bind_success && this.private_allmsg_success) {
                    const private_single_bind_msg = this.private_single_bind_msg;
                    // console.log('private_single_bind_msg', private_single_bind_msg)
                    // 设置右边树这个人绑定的消息（左边已经在之前选中了）
                    this.$refs.msgTree.setCheckedKeys(private_single_bind_msg.map(item => item))
                }
            },

            // 关闭弹窗，取消状态下关闭
            close (isUpdate) {
                this.closeEdit(isUpdate);
            },

            // 选择当前类型，
            selectType (type) {
                if (this.edit_type === 'single') {
                    return;
                }
                this.private_type = type;
                // 清空选择
                this.selectValue = [];
            },

            // 拉取部门列表
            querySelect () {
                $get('/imMessage/messageSubscribe/getDeptAndRole').then(response => {
                    // console.log(response.data)
                    if (response.data.code !== 0) {
                        this.$msg.error({
                            info: response.data.msg
                        });
                        return;
                    }
                    const data = response.data.data;
                    // console.log(data);
                    // 处理一遍数据，让 label = 描述， value = id
                    let obj = {
                        dept: [],
                        role: []
                    }
                    if (data.dept) {
                        obj.dept = data.dept.map(item => {
                            return Object.assign({}, item, {
                                id: item.deptId,
                                label: item.deptName
                            })
                        })
                    }
                    if (data.role) {
                        obj.role = data.role.map(item => {
                            return Object.assign({}, item, {
                                id: item.roleId,
                                label: item.name
                            })
                        })
                    }


                    this.DeptAndRoleList = obj;
                }).catch(() => {
                    this.$msg.error({
                        info: '未知错误'
                    });
                    this.DeptAndRoleList.isLoading = false;
                    this.DeptAndRoleList.isError = true;
                })
            },

            // 查询员工 tree
            queryStaffData (isAllStaffQuery) {
                // 单人模式下禁止查询
                if (this.edit_type === 'single') {
                    return;
                }
                this.staffEmptyText = '加载中';

                let queryData = {}
                if (isAllStaffQuery === true) {
                    queryData = {
                        paramFlag: null,
                        queryParam: null
                    }
                } else {
                    queryData = {
                        paramFlag: this.private_type === 'role' ? 'role' : 'dept',
                        queryParam: this.selectValue
                    }
                }

                $post('/organization/department/queyByDeptOrRole', queryData).then(response => {
                    // console.log(response.data)
                    if (response.data.code !== 0) {
                        this.$msg.error({
                            info: response.data.msg
                        });
                        return
                    }
                    const data = response.data.data;
                    // console.log(data);
                    this.staffData = data;
                    this.staffEmptyText = '未查询到任何数据';
                }).catch(() => {
                    this.staffEmptyText = '未知错误'
                })
            },

            // 查询所有可以绑定的消息
            queryAllMsg () {
                this.msgEmptyText = '加载中';
                $get('/imMessage/messageDefineAction/queryAllTheme').then(response => {
                    // console.log(response.data)
                    if (response.data.code !== 0) {
                        this.$msg.error({info: response.data.msg});
                        return
                    }
                    const data = response.data.data;
                    // console.log(data);
                    this.msgData = data;
                    this.msgEmptyText = '未查询到任何数据';
                    this.private_allmsg_success = true;
                    this.checkSingleTypeBindMsg();
                    this.isMsgAllChecked();
                }).catch(() => {
                    this.msgEmptyText = '未知错误'
                })
            },

            // 已绑定消息是否全选
            isMsgAllChecked (runTime) {
                // console.log('isMsgAllChecked', this.$refs.msgTree);
                // 先获取选中的消息
                let currentChecked = this.$refs.msgTree.getCheckedNodes();

                // 本来不想这么写，但似乎树有缓存。
                // 具体来说，树应该有值，但 currentChecked 的 length 却为 0
                // 推测是因为 vue 的 tree 的渲染速度问题，导致拿不到值。
                // 并且该情况不是必发的，而是偶发的
                if (currentChecked.length === 0) {
                    let nowTime = 0;
                    if (typeof runTime === 'number') {
                        nowTime = runTime
                    }
                    if (nowTime < 4) {
                        // console.log('this.msgData', this.msgData)
                        setTimeout(() => {
                            this.isMsgAllChecked(nowTime + 1)
                        }, 1)
                        return;
                    }
                }
                // 筛选出子消息
                currentChecked = currentChecked.filter(item => item.children === null || item.children === undefined).map(item => item.id)

                let isAllChecked = true;
                // 目前只支持 msg 是两层消息结构
                this.msgData.forEach(mainMsg => {
                    if (mainMsg.children) {
                        mainMsg.children.forEach(msgChild => {
                            // 如果有一个消息不在 currentChecked 中，则说明其未选中，认为没有全选
                            if (currentChecked.indexOf(msgChild.id) === -1) {
                                isAllChecked = false;
                            }
                        })
                    }
                })
                this.msgAllChecked = isAllChecked;
            },

            isStaffAllChecked (runTime) {
                let isAllChecked = true;

                let currentChecked = this.$refs.staffTree.getCheckedNodes();

                if (currentChecked.length === 0) {
                    let nowTime = 0;
                    if (typeof runTime === 'number') {
                        nowTime = runTime
                    }
                    if (nowTime < 4) {
                        setTimeout(() => {
                            this.isStaffAllChecked(nowTime + 1)
                        }, 1)
                        return;
                    }
                }

                // 筛选出子消息
                currentChecked = currentChecked.filter(item => item.children === null || item.children === undefined).map(item => item.id)

                // 两种情况，第一种是针对个人的，第二种是批量修改时
                if (this.edit_type === 'single') {
                    // 针对个人时
                    isAllChecked = currentChecked.indexOf(this.staffData[0].id) > -1;

                    this.staffAllChecked = isAllChecked;
                    return;
                }

                // 批量修改时
                this.staffData.forEach(mainStaff => {
                    if (mainStaff.children) {
                        mainStaff.children.forEach(stffChild => {
                            // 如果有一个消息不在 currentChecked 中，则说明其未选中，认为没有全选
                            if (currentChecked.indexOf(stffChild.id) === -1) {
                                isAllChecked = false;
                            }
                        })
                    }
                })
                this.staffAllChecked = isAllChecked;
            },

            // 全选所有消息
            checkAllMsg () {
                // 先判断当前是否全选
                if (this.msgAllChecked) {
                    // 如果全选，则取消全选
                    this.$refs.msgTree.setCheckedKeys([]);
                } else {
                    // 否则，拿到所有节点，并选中
                    // 所有 msg 的没有选中 id 的集合
                    const msgIdList = [];
                    // 目前只支持 msg 是两层消息结构
                    this.msgData.forEach(mainMsg => {
                        if (mainMsg.children) {
                            mainMsg.children.forEach(msgChild => {
                                msgIdList.push(msgChild.id);
                            })
                        }
                    })
                    this.$refs.msgTree.setCheckedKeys(msgIdList);
                }
            },
            // 全选、取消全选所有人员
            checkAllStaff () {
                // 先判断当前是否全选
                if (this.staffAllChecked) {
                    // 如果全选，则取消全选
                    this.$refs.staffTree.setCheckedKeys([]);
                } else {
                    // 否则，拿到所有节点，并选中
                    // 所有 msg 的没有选中 id 的集合
                    const staffIdList = [];
                    // 目前只支持 msg 是两层消息结构
                    this.staffData.forEach(staff => {
                        staffIdList.push(staff.id);
                    })
                    this.$refs.staffTree.setCheckedKeys(staffIdList);
                }
            },

            // 提交绑定消息
            commit () {
                if (this.private_msg_committing) {
                    return
                }

                // 先获取选中的人，此时数据包含部门，因此要筛选掉部门。筛选条件是 children 为 null 则不是部门
                const StaffTreeSelect = this.$refs.staffTree.getCheckedNodes()
                const StaffSelect = StaffTreeSelect.filter(item => item.children === null || item.children === undefined);
                // console.log(StaffSelect)
                if (StaffSelect.length === 0) {
                    this.$msg.error({
                        info: '你没有选中任何一个用户，不能提交绑定'
                    })
                    return;
                }

                // 再获取选中的消息，筛选条件同上面
                const msgTreeSelect = this.$refs.msgTree.getCheckedNodes();
                const msgSelect = msgTreeSelect.filter(item => item.children === null || item.children === undefined);
                // console.log(msgSelect)

                const payload = {
                    userIdList: StaffSelect.map(item => item.id),
                    themeIdList: msgSelect.map(item => item.id)
                }

                // console.log(payload);

                this.private_msg_committing = true;
                $post('/imMessage/messageSubscribe/bingThemeToUserId', payload).then(response => {
                    // console.log(response.data)
                    if (response.data.code !== 0) {
                        this.$msg.error({info: response.data.msg});
                        return
                    }
                    this.$msg.success({info: '绑定成功'});
                    // 关闭窗帘
                    this.close(true);
                }).catch(() => {
                    this.$msg.error({info: '未知错误'});
                }).finally(() => {
                    this.private_msg_committing = false;
                })
            }
        }
    }
</script>

<style lang="scss" scoped>

    .msg-edit {
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

        .tab-list {
            position: absolute;
            top: 24px;
            left: 50%;
            transform: translateX(-50%);
            width: 248px;
            height: 38px;
            background: rgba(255, 255, 255, 1);
            box-shadow: 0px 0px 40px 0px rgba(115, 134, 153, 0.3);
            border-radius: 18px;
            padding: 3px 3px;

            .tab {
                display: inline-block;
                position: relative;
                width: 121px;
                height: 32px;
                line-height: 32px;
                background: #fff;
                border-radius: 16px;
                font-size: 16px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #899DB2;
                cursor: pointer;
            }

            .tab.focus {
                color: rgba(255, 255, 255, 1);
                /*background: linear-gradient(90deg, #3b97f5, #4276fb);*/
                background: linear-gradient(to right, rgb(70, 166, 249), rgb(87, 140, 254));
            }

            .tab.disable {
                cursor: not-allowed;
            }
        }

        .search-box {
            position: absolute;
            top: 80px;
            left: 20px;
            right: 20px;
            height: 38px;

            .search-left {
                position: relative;
                height: 38px;
                width: 526px;
                background: rgba(255, 255, 255, 1);
                border: 1px solid rgba(221, 230, 237, 1);
                border-radius: 6px;
                overflow: hidden;

                .search-type {
                    position: relative;
                    width: 54px;
                    height: 38px;
                    line-height: 38px;
                    background: rgba(221, 230, 237, 1);
                    font-size: 14px;
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    color: rgba(137, 157, 178, 1);
                    z-index: 10;
                }

                .el-select {
                    position: absolute;
                    top: 0;
                    left: 53px;
                    right: 0;
                    height: 38px;

                }
            }

            .search-btn {
                position: absolute;
                top: 0;
                right: 0;
                width: 62px;
                height: 38px;
                line-height: 38px;
                background: linear-gradient(to right, rgb(70, 166, 249), rgb(87, 140, 254));
                box-shadow: 0px 5px 15px 0px rgba(63, 153, 255, 0.3);
                border-radius: 6px;
                font-size: 14px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: rgba(255, 255, 255, 1);
                cursor: pointer;
            }
        }

        .tree-title {
            position: absolute;
            top: 139px;
            height: 12px;
            left: 0;

            .text {
                position: absolute;
                height: 12px;
                width: 100px;
                line-height: 12px;
                font-size: 14px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: rgba(137, 157, 178, 1);
                text-align: left;
            }

            .title-staff {
                @extend .text;
                left: 20px;
            }

            .title-msg {
                @extend .text;
                left: 331px;
            }
        }

        .tree {
            position: absolute;
            top: 165px;
            height: 390px;
            width: 100%;

            .tree-msg-header {
                position: absolute;
                top: 0;
                height: 40px;
                left: 22px;
                right: 20px;
                border-bottom: 1px solid rgba(221, 230, 237, 1);

                .tree-msg-check {
                    position: absolute;
                    top: 13px;
                    width: 16px;
                    height: 16px;
                    background: rgba(255, 255, 255, 1);
                    border: 1px solid #DCDFE6;
                    box-shadow: 0px 2px 4px 0px rgba(221, 230, 237, 0.4);
                    border-radius: 4px;
                    cursor: pointer;
                }

                .tree-msg-check.allcheck {
                    background-image: url(~@img/icon/icon_checked.png);
                    background-size: 100% 100%;
                }

                .all-check-label {
                    position: absolute;
                    left: 26px;
                    top: 14px;
                    height: 14px;
                    line-height: 14px;
                    font-size: 14px;
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    color: rgba(137, 157, 178, 1);
                }
            }

            .tree-staff {
                position: absolute;
                top: 0;
                left: 20px;
                height: 100%;
                width: 290px;
                height: 390px;
                background: rgba(255, 255, 255, 1);
                border: 1px solid rgba(221, 230, 237, 1);
                border-radius: 6px;
                padding-top: 45px;
                overflow: auto;
            }

            .tree-msg {
                position: absolute;
                top: 0;
                right: 20px;
                height: 100%;
                width: 290px;
                height: 390px;
                background: rgba(255, 255, 255, 1);
                border: 1px solid rgba(221, 230, 237, 1);
                border-radius: 6px;
                padding-top: 45px;
                overflow: auto;

            }
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
        }
    }
</style>
<style lang="scss">
    .msg-edit {
        .search-box {
            .search-left {
                .el-input__inner {
                    border: none !important;
                }

                .el-input:hover {
                    outline: none;
                }

                .el-select:hover {
                    outline: none;
                }

                .el-input__inner:focus {
                    outline: none;
                }
            }
        }
    }
</style>
