<template>
    <!-- 排班信息-新增、编辑、详情 -->
    <detail class="team-mana-detail" v-bind="$attrs" :visible="visible" v-on="$listeners" :title="title" :type="type" :form="form"></detail>
</template>

<script>
import Detail from '@/views/home/common/Detail'
import utilMixin from '@mixin/utilMixin'
import { queryAll } from '@/util/base'
import _ from 'lodash'

export default {
    components: {
        Detail
    },
    mixins: [utilMixin],
    props: ['data', 'type', 'visible'],
    data () {
        return {
            title: '班组信息',
            form: {
                key: 'teamId',
                loading: false,
                queryParam: {},
                detailColumn: [
                    [
                        {key: 'teamName', label:'班组名称', span: '12'},
                        {key: 'phone', label:'联系电话', span: '12'},
                    ],
                    [
                        {key: 'remark', label:'备注', span: '24'},
                    ],
                    [
                        {key: 'employeeTables', label:'班组人员', span: '24',type: 'table'}
                    ]
                ],
                column: [
                    {key: 'teamName',  label: '班组名称', type: 'input', maxlength: 10,},
                    {key: 'phone',  label: '联系电话', type: 'input', maxlength: 15,},
                    {key: 'remark',  label: '备注', type: 'textarea', rows: 2, maxlength: 1000,},
                    {key: 'lstEmpId', label: '人员选择', type: 'elTransfer', filterMethod: this.filterMethod, titles: ['未选员工','已选员工'], props: {key: 'empId',label: 'empName',pkey:'deptId',plabel:'deptName'},defaultVal:[],url:'/team/querySelectedTeamEmployee'},
                ],
                rules: {
                    phone: [
                        {type: 'require', trigger: 'blur'},
                        {type: 'regex', reg: /^((\d{3}-\d{8})|(\d{4}-\d{7,8})|((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8})?$/, info: '该号码格式或位数有误'}
                    ],
                    lstEmpId: [
                        {type: 'require', trigger: 'blur'}
                    ],
                    teamName: [
                        {type: 'require', trigger: 'blur'},
                        {type: 'unique', url: '/team', trigger: 'blur'},
                        {type: 'unique', url: '/team', trigger: 'change'},
                    ],
                    
                },
                data: {
                    lstEmpId:[]
                }
            },
            filterMethod(query, item) {
                return item.name.indexOf(query) > -1;
            },
            deptDatas: []

        }
    },
    methods: {
        changeData () {
            //获取所有部门
            queryAll('organization/department/queryUserDeptAndChild', {}).then(res => {
                if (res.data.code == 0) {
                    this.deptDatas = res.data.data;
                    this.form.column.forEach(item=> {
                        if(item.key == 'lstEmpId') {
                            this.$set(item, 'pOptions', this.deptDatas)
                        }
                    })
                } else {
                    this.$msg.error({
                        info: '获取部门数据失败 !'
                    })
                }
            })
            let teamId = null
            if(this.type == 'update') {
                teamId = this.data.teamId;
            }
            this.form.data = this.data || {}
            // console.log('this.form.data',this.data)

            // lstEmployee
            // this.form.data
            // this.$set(this.form.data, 'employeeTables', {})
            // this.$set(this.form.data.employeeTables, 'column', [
            //     [
            //         {key: 'index',  label: '序号', width: 80, type: 'slot'},
            //         {key: 'empName',  label: '姓名', width: 200},
            //         {key: 'teamName',  label: '职务', width: 160},
            //         {key: 'teamName',  label: '所属部门名称', width: 200},
            //     ],
            // ])
            // this.$set(this.form.data.employeeTables, 'data', this.data.lstEmployee || [])
            // this.form.data = {
            //     empName: '西部集团--悦泰',
            //     remark: '备注西部集团--悦泰西部集团--悦泰西部集团--悦泰西部集团--悦泰西部集团--悦泰西部集团--悦泰西部集团--悦泰西部集团--悦泰西部集团--悦泰',
            //     phone: 13110000000,
            //     selectedEmpIds: [1, 2],
            //     userOps: {
            //         column: [
            //             [
            //                 {key: 'index',  label: '序号', width: 80, type: 'slot'},
            //                 {key: 'empName',  label: '姓名', width: 200},
            //                 {key: 'teamName',  label: '职务', width: 160},
            //                 {key: 'teamName',  label: '所属部门名称', width: 200},
            //             ],
            //             [],
            //             []
            //         ],
            //         data: [
            //             {empId: 1, empName: '', deptId: 100,teamName:'研发'},
            //             {empId: 2, empName: '李四2', deptId: 100,teamName:'研发'}
            //         ]
            //     },
            //     userOps: [
            //         {empId: 1, empName: '', deptId: 100,teamName:'研发'},
            //         {empId: 2, empName: '李四2', deptId: 100,teamName:'研发研发研发研发研发研发研发研发研发研发研发研发研发研发'}
            //     ]

                
                
            // }
            // this.form.data = this.data
        },
    },
    watch: {
        data: {
            handler (data) {
                // this.changeData()
            },
            immediate: true
        },
        visible: {
            handler (visible) {
                if (visible) {
                    this.changeData()
                }
            }
        },
        type: {
            handler (type) {
                this.form.column.forEach((item, index) => {
                    this.$set(item, 'disabled', false)
                })
            },
            immediate: true
        }
    }
}
</script>

<style lang="scss" scoped>
$bodyHead: 32px;

.team-mana-detail {
    .dialog {
        .form {
            // padding: 0!important;
        }   
    }   
    
}
</style>
