<template>
    <!-- 排班模板-新增、编辑、详情 -->
    <my-dialog v-bind="$attrs" v-on="$listeners" :visible="visible" :position="'right'" class="form-dialog under-head-dialog" :title="title + typeName" @handleClose="handleClose">
        <template>
            <div v-if="typeName=='详情'">
                <div class="form" >
                    <Row v-for="(item, index) in detailColumn" :key="index" justify="start" class="his-info-normal">
                        <i-col v-for="obj in item" :key="obj.key" :span="obj.span">
                            <div class="his-info-title">{{obj.label}}</div>
                            <div class="his-info-cont">
                                <template v-if="obj.type == 'tree'">
                                    <el-tree :data="obj.value" :props="{children: 'children',label: 'text'}"></el-tree>
                                </template>
                                <template v-else-if="obj.type == 'table'">
                                    <el-table
                                        class="detail-table"
                                        :data="obj.value"
                                        ref="elTable" 
                                        style="width: 100%;"
                                        highlight-current-row>   
                                        <el-table-column type="index" label="序号" width="50"></el-table-column> 
                                         <el-table-column prop="empName" label="班组人员" min-width="100">
                                            <template slot-scope="scope" >
                                                <span :title="scope.row.empName">{{scope.row.empName}}</span>
                                            </template>
                                         </el-table-column>
                                        <el-table-column prop="teamName" label="班组名称" width="80">
                                            <template slot-scope="scope" >
                                                <span :title="scope.row.teamName">{{scope.row.teamName}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="chute" label="保障滑槽编号" width="110" align="center">    
                                            <template slot-scope="scope" >
                                                <span :title="scope.row.chute">{{scope.row.chute}}</span>
                                            </template>            
                                        </el-table-column>
                                        <el-table-column prop="sortkey1" label="第一天" width="100" align="center">
                                            <template slot-scope="scope">
                                                <span :class="['operate-icon',scope.row.sortkey1 === '1'?'active':'']" >{{scope.row.sortkey1 === '1'?'上班':'休息'}}</span>

                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="sortkey2" label="第二天" width="100" align="center">    
                                            <template slot-scope="scope">
                                                <span :class="['operate-icon',scope.row.sortkey2 === '1'?'active':'']" >{{scope.row.sortkey2 === '1'?'上班':'休息'}}</span>

                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="sortkey3" label="第三天" width="100" align="center" v-if="formData.cycle != 1">
                                            <template slot-scope="scope">
                                                <span :class="['operate-icon', scope.row.sortkey3 === '1'?'active':'']">{{scope.row.sortkey3 === '1'?'上班':'休息'}}</span>

                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="sortkey4" label="第四天" width="100" align="center" v-if="formData.cycle == 3">
                                            <template slot-scope="scope">
                                                 <span :class="['operate-icon',scope.row.sortkey4 === '1'?'active':'']" >{{scope.row.sortkey4 === '1'?'上班':'休息'}}</span>

                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </template>
                                <template v-else>
                                    <template v-if="typeof obj.value === 'object'">
                                        <span v-for="(val, index) in obj.value" :key="index" style="margin-right: 5px">{{val}}</span>
                                    </template>
                                    <template v-else-if="obj.key === 'cycle'">
                                       {{obj.value === '1'?'上一休一':(obj.value === '2'?'上二休一':'上二休二')}}
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
            
            <div v-else>
                <div class="form" >
                    <!-- 模板基本信息 -->
                    <div v-for="(item, index) in formColumn" :key="index" v-show="!item.isHidden" :class="['value', item.cloClass, item.key in errors ? 'error' : '', item.type == 'textarea' || item.type == 'tree' || item.type == 'tab' || item.type == 'elDateRange' || item.type == 'table' ? 'whole-width' : '', item.isHidden ? '': 'form-item']">
                        <div v-if="item.type == 'table'" class="table-insert" @click="handleInsert">
                            <div class="icon"></div>
                            <div class="label">新增</div>
                        </div>
                        <div class="label" v-if="item.type == 'textarea' || item.type == 'tree' || item.type == 'elTransfer' || item.type == 'table'">{{ item.label }}
                        </div>
                        <textarea v-if="item.type == 'textarea'" v-model.trim="formData[item.key]" :maxlength="item.maxlength" :minlength="item.minlength" :placeholder="item.placeholder" :disabled="item.disabled" :rows="item.rows" cols="80" @change="handleChange(item, $event)"></textarea>
                        <!-- 排班信息 -->  
                        <div v-else-if="item.type=='table'" class="form-table">
                            <el-table
                                class="opera-table"
                                :data="formData.lstScheduleTmplEmpVO"
                                ref="elTable" 
                                style="width: 100%; margin-bottom: 20px;"
                                highlight-current-row>    
                                <el-table-column type="index" label="序号" width="50"></el-table-column>
                                <el-table-column prop="empName" label="班组人员" width="100">
                                    <template slot-scope="scope" >
                                        <span :title="scope.row.empName">{{scope.row.empName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="teamName" label="班组名称" width="80">
                                    <template slot-scope="scope" >
                                        <span :title="scope.row.teamName">{{scope.row.teamName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="chute" label="保障滑槽编号" width="110" align="center">    
                                    <template slot-scope="scope" >
                                        <span :title="scope.row.chute">{{scope.row.chute}}</span>
                                    </template>            
                                </el-table-column>
                                <el-table-column prop="sortkey1" label="第一天" width="100" align="center">
                                    <template slot-scope="scope">
                                        <span :class="['operate-icon',scope.row.sortkey1 === '1'?'active':'']" @click="toggleStatus('sortkey1',scope.row,scope.$index)">{{scope.row.sortkey1 === '1'?'上班':'休息'}}</span>

                                    </template>
                                </el-table-column>
                                <el-table-column prop="sortkey2" label="第二天" width="100" align="center">
                                    <template slot-scope="scope">
                                        <span :class="['operate-icon',scope.row.sortkey2 === '1'?'active':'']" @click="toggleStatus('sortkey2',scope.row,scope.$index)">{{scope.row.sortkey2 === '1'?'上班':'休息'}}</span>

                                    </template>
                                </el-table-column>
                                <el-table-column prop="sortkey3" label="第三天" width="100" align="center" v-if="formData.cycle != 1">
                                    <template slot-scope="scope">
                                        <span :class="['operate-icon', scope.row.sortkey3 === '1'?'active':'']" @click="toggleStatus('sortkey3',scope.row,scope.$index)">{{scope.row.sortkey3 === '1'?'上班':'休息'}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="sortkey4" label="第四天" width="100" align="center" v-if="formData.cycle == 3">
                                    <template slot-scope="scope">
                                        <span :class="['operate-icon',scope.row.sortkey4 === '1'?'active':'']" @click="toggleStatus('sortkey4',scope.row,scope.$index)">{{scope.row.sortkey4 === '1'?'上班':'休息'}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="operate" label="操作" width="100" align="center" fixed="right">
                                    <template slot-scope="scope">
                                        <div class="operation-cell">
                                            <div class="table-opr update" @click="handelUpdate(scope.row,scope.$index)"></div>
                                            <div class="table-opr remove" @click="handelRemove(scope.row,scope.$index)"></div>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div> 
                        <input-tag v-else v-model.trim="formData[item.key]" :type="item.type" :datetype="item.dateType" :prepend="item.label" :append="item.endLabel" :placeholder="item.disabled ? '' :'请输入'" :maxlength="item.maxlength" :minlength="item.minlength" :valueFormat="item.valueFormat" :format="item.format"
                        :options="item.options" :id="item.itemValue" :label="item.itemLabel" :require="item.require" :defaultVal="item.defaultVal" :disabled="item.disabled"
                        :multiple="item.multiple"
                        :style="`${item.width ? ('width: ' + item.width + 'px;') : 'auto'};${item.paddingright ? ('padding-right: ' + item.paddingright + 'px;') : 'auto'}`"
                        @change="handleChange(item, $event)"></input-tag>
                        <div v-if="item.key in errors" class="error">{{ errors[item.key] }}</div>
                        <div v-if="item.key == 'templateName'" class="choose-btn" >
                            <button type="primary" @click="toChooseModel">选择模板</button>
                        </div>
                    </div>   
                </div>
                     
            </div>
        </template>
        <template v-slot:footer="{closeDialog}">
                <button @click="closeDialog">取 消</button>
                <button v-if="submit" type="primary" @click="handleSubmit">确 认</button>
        </template>

        <!-- 选择模板 -->
        <my-dialog v-bind="$attrs" v-on="$listeners" :visible="modelVisible" :position="'center'" :height="740" :width="640" :close="false" class="model-dialog under-head-dialog">
            <template v-slot:header>
                <div class="header-title">
                    <div class="title">选择模板</div>
                    <span class="icon iconfont icon-close icon-button" @click="modelClose"></span>
                </div>
            </template>
            <template>
                <el-table
                    height="600"
                    class="detail-table"
                    :data="modelDatas"
                    ref="elTable" 
                    style="width: 100%;"
                    highlight-current-row>  
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <div class="expand-item">
                                <div class="label">模板名称:</div>
                                <div class="value">{{ props.row.templateName}}</div>
                            </div>
                            <div class="expand-item">
                                <div class="label">开始日期:</div>
                                <div class="value">{{ props.row.beginTime}}</div>
                            </div>
                            <div class="expand-item">
                                <div class="label">结束日期:</div>
                                <div class="value">{{ props.row.endTime}}</div>
                            </div>
                            <div class="expand-item">
                                <div class="label">排班周期:</div>
                                <div class="value">{{ props.row.cycle === '1'?'上一休一' :(props.row.cycle === '2'?'上二休一' : '上二休二')}}</div>
                            </div>
                            <div class="expand-item">
                                <div class="label">备注:</div>
                                <div class="value">{{ props.row.remark}}</div>
                            </div>
                            <div class="expand-item">
                                <div class="label">排班信息:</div>
                                <div class="value">
                                    <el-table
                                        class="opera-table"
                                        :data="props.row.lstScheduleTmplEmpVO"
                                        ref="elTable" 
                                        style="width: 100%;"
                                        highlight-current-row>    
                                        <el-table-column type="index" label="序号" width="50"></el-table-column>
                                        <el-table-column prop="empName" label="班组人员" width="100">
                                            <template slot-scope="scopeChild" >
                                                <span :title="scopeChild.row.empName">{{scopeChild.row.empName}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="teamName" label="班组名称" width="80">
                                            <template slot-scope="scopeChild" >
                                                <span :title="scopeChild.row.teamName">{{scopeChild.row.teamName}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="chute" label="保障滑槽编号" width="110" align="center">
                                            <template slot-scope="scopeChild" >
                                                <span :title="scopeChild.row.chute">{{scopeChild.row.chute}}</span>
                                            </template>  
                                        </el-table-column>
                                        <el-table-column prop="sortkey1" label="第一天" width="100" align="center">
                                            <template slot-scope="scopeChild">
                                                <span :class="['operate-icon',scopeChild.row.sortkey1 === '1'?'active':'']" >{{scopeChild.row.sortkey1 === '1'?'上班':'休息'}}</span>

                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="sortkey2" label="第二天" width="100" align="center">    
                                            <template slot-scope="scopeChild">
                                                <span :class="['operate-icon',scopeChild.row.sortkey2 === '1'?'active':'']" >{{scopeChild.row.sortkey2 === '1'?'上班':'休息'}}</span>

                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="sortkey3" label="第三天" width="100" align="center" v-if="props.row.cycle != 1">
                                            <template slot-scope="scopeChild">
                                                <span :class="['operate-icon', scopeChild.row.sortkey3 === '1'?'active':'']">{{scopeChild.row.sortkey3 === '1'?'上班':'休息'}}</span>

                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="sortkey4" label="第四天" width="100" align="center" v-if="props.row.cycle == 3">
                                            <template slot-scope="scopeChild">
                                                 <span :class="['operate-icon',scopeChild.row.sortkey4 === '1'?'active':'']" >{{scopeChild.row.sortkey4 === '1'?'上班':'休息'}}</span>

                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </div>
                        </template>
                     </el-table-column>
                    <el-table-column type="index" label="序号" width="100">
                        <template slot-scope="scope">
                            <div class="model-radio" >
                                <el-radio v-model="checked" @change="modelChecked(scope.row)" :label="scope.$index + 1"></el-radio>
                            </div>
                        </template>
                    </el-table-column> 
                    <el-table-column prop="templateName" label="模板名称" min-width="200" align="center">
                        <template slot-scope="scope">
                            <span :title="scope.row.templateName" >{{scope.row.templateName}}</span>        
                        </template>
                     </el-table-column>
                    <el-table-column prop="remark" label="备注" min-width="100" align="center">
                        <template slot-scope="scope">
                            <span :title="scope.row.remark">{{scope.row.remark}}</span>        
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <template v-slot:footer>
                <div class="footer-btn">
                    <button @click="modelClose">取 消</button>
                    <button v-if="submit" type="primary" @click="modelSubmit">确 认</button>
                </div>
            </template>
        </my-dialog>

        <!-- 选择人员和滑槽 排班信息弹窗-->
        <my-dialog v-bind="$attrs" v-on="$listeners" :visible="scheduleVisible" :position="'center'" :height="640" :width="640" :close="false" class="schedule-dialog model-dialog under-head-dialog">
            <template v-slot:header>
                <div class="header-title">
                    <div class="title">{{scheduleTitle}}</div>
                    <span class="icon iconfont icon-close icon-button" @click="scheduleClose"></span>
                </div>
            </template>
            <template>
                <div class="schedule-form">
                    <div class="schedule-form-item">
                        <span>班组名称</span>
                        <div class="tree">
                            <el-tree
                                ref="empTree"
                                default-expand-all
                                :data="empTreeData"
                                node-key="id"
                                :check-strictly="true" 
                                :expand-on-click-node="false"
                                :props="empProps">
                                <div slot-scope="{ node, data }">
                                    <div v-if="data.type == 'team'">
                                        {{node.label}}
                                    </div>
                                    <div v-else>
                                        <el-radio v-model="empChecked" @change="empCheckChange(data)" :label="data.id">{{node.label}}</el-radio>
                                    </div>
                                    
                                </div>
                            </el-tree>
                        </div>
                        <div v-if="empError" class="error">必填</div>
                    </div>
                    <div class="schedule-form-item">
                        <span>保障滑槽编号</span>
                        <div class="tree">
                            <el-tree
                                ref="chuteTree"
                                default-expand-all
                                :data="chuteTreeData"
                                show-checkbox
                                node-key="label"
                                :props="chuteProps"
                                :default-checked-keys="chuteCheckData"
                                @check="chuteCheck">
                            </el-tree>
                        </div>
                        <div v-if="chuteError" class="error">必填</div>
                    </div>
                </div>
            </template>
            <template v-slot:footer>
                <div class="footer-btn">
                    <button @click="scheduleClose">取 消</button>
                    <button type="primary" @click="scheduleSubmit">保 存</button>
                </div>
            </template>
        </my-dialog>
        <!-- 删除排班信息 -->
        <confirm-tip :visible="delScheduleVisible" :data="delScheduleData" @handleSubmit="handleSchedule(delScheduleData)" @handleClose="delScheduleVisible = false" ></confirm-tip>
    </my-dialog>
</template>

<script>
import ConfirmTip from '@/views/home/common/ConfirmTip'
import InputTag from '@view/InputTag/InputTag'
import utilMixin from '@mixin/utilMixin'
import { queryAll, queryAllGet } from '@/util/base'
import _ from 'lodash'

export default {
    components: {
        InputTag,
        ConfirmTip
    },
    mixins: [utilMixin],
    props: ['data', 'type', 'visible'],
    data () {
        return {
            title: '排班模板',
            detailColumn: [
                [
                    {key: 'templateName', label:'模板名称', span: '12'},
                    {key: 'beginTime', label:'开始日期', span: '6', formatter: true},
                    {key: 'endTime', label:'结束日期', span: '6', formatter: true},
                ],
                [
                    {key: 'cycle', label:'排班周期', span: '24'},
                ],
                [
                    {key: 'remark', label:'备注', span: '24'},
                ],
                [
                    {key: 'lstScheduleTmplEmpVO', label:'排班信息', span: '24',type: 'table'}
                ],
                
            ],
            formColumn: [
                {key: 'templateName',  label: '模板名称', type: 'input', maxlength: 50,},
                {key: 'scheduTime',  label: '排班日期', type: 'elDateRange', dateType: 'daterange',format:'yyyy-MM-dd',valueFormat:'yyyy-MM-dd', width:600},
                // {key: 'endTime',  label: '结束日期', type: 'elDate'},
                {key: 'cycle',  label: '排班周期', type: 'tab', enumKey: 'cycle', itemValue: 'code', itemLabel: 'name', width:600, method: this.setSortWork},
                {key: 'remark',  label: '备注', type: 'textarea', maxlength: 1000, rows: 2,},
                {key: 'lstScheduleTmplEmpVO',  label: '排班信息', type: 'table',},
                
            ],
            tableColumn: [

            ],
            rules: {
                templateName: [
                    {type: 'require', trigger: 'blur'},
                    {type: 'unique', url: '/scheduleTemplate', trigger: 'blur'}
                ],
                scheduTime: [
                    {type: 'require', trigger: 'change'}
                ],
            },
            typeName: '',
            submit: false,
            formData: {},
            errors: {},
            detailHis: {},
            // 模板
            modelVisible: false,
            modelDatas: [],
            checkedModelData: null,
            checked: false,
            // 人员和滑槽
            scheduleVisible: false,
            scheduleTitle: '新增',
            schedulIndex: '',
            empTreeData: [],
            empProps: {
                children: 'children',
                label: 'label'
            },
            // 选中的人员信息-简单类型
            empChecked: '',
            empCheckedData: null,
            empError: true,
            chuteTreeData: [],
            chuteProps: {
                children: 'children',
                label: 'label',
                id: 'id'
            },
            // 选中的滑槽id
            chuteCheckData: [],
            // 删除排班信息弹窗
            delScheduleVisible: false,
            delScheduleData: null,
            chuteError: false,
        }
    },
    methods: {
        updateData () {
            this.errors = {};
            this.formColumn.forEach(item => {
                if (this.type == 'insert') {
                    this.$set(this.formData, item.key, item.hasOwnProperty('defaultVal') ? item.defaultVal : null)
                    if (item.hasOwnProperty('saveKey')) {
                        if (item.type == 'tree' || item.type == 'elTransfer') {
                            this.$set(this.formData, item.saveKey, [])
                        } else {
                            this.$set(this.formData, item.saveKey, null)
                        }
                    }
                } else if (!this.formData.hasOwnProperty(item.key)) {
                    this.$set(this.formData, item.key, null)
                }

                if (this.type == 'detail') {
                    this.$set(item, 'disabled', true)
                }
                if (item.hasOwnProperty('url')) {
                    let https = queryAll
                    if (item.hasOwnProperty('urlType')) {
                        switch (item.urlType) {
                            case 'get': https = queryAllGet
                            break
                            case 'post': https = queryAll
                            break
                        }
                    }
                    https(item.url, item.param || {}).then(res => {
                        if (res.data.code == 0) {
                            this.$set(item, 'options', [])
                            item.options = res.data.data
                        } else {
                            this.$msg.error({
                                info: '获取' + item.label + '失败 !'
                            })
                        }
                    })
                } else if (item.hasOwnProperty('enumKey')) {
                    this.$set(item, 'options', this.$store.getters.getOptions(item.enumKey))
                }
            })
        },
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
                method(this.formData[item.key], param => {
                    if (param) {
                        if (Array.isArray(param)) {
                            param.forEach(item => {
                                this.$set(this.formData, item.key, item.value)
                            })
                        } else {
                            this.$set(this.formData, param.key, param.value)
                        }
                    }
                })
            }
            this.handleError(item.key, value)
        },
        handleSubmit () { 
            // this.errors = {}
            let hiddenKeys = []
            // 表单字段隐藏时不校验
            this.formColumn.forEach((item, index) => {
                if (item.hasOwnProperty('isHidden')) {
                    hiddenKeys.push(item.key)
                }
            })
            // console.log('errors11',this.errors)
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
                this.$set(this.formData,'beginTime',this.formData.scheduTime[0]);
                this.$set(this.formData,'endTime',this.formData.scheduTime[1]);
                if(!this.formData.lstScheduleTmplEmpVO) {
                    this.$message.warning('请添加排班信息')
                    return    
                }
                
                //1.判断人数是否对应
                if(this.formData.cycle == 1) {
                    if(this.formData.lstScheduleTmplEmpVO.length < 2) {
                        this.$message.warning('排班信息人数与排班周期不匹配')
                        return
                    }
                } else if(this.formData.cycle == 2) {
                    if(this.formData.lstScheduleTmplEmpVO.length < 3) {
                        this.$message.warning('排班信息人数与排班周期不匹配')
                        return
                    }
                } else if(this.formData.cycle == 3) {
                    if(this.formData.lstScheduleTmplEmpVO.length < 4) {
                        this.$message.warning('排班信息人数与排班周期不匹配')
                        return
                    }
                }
                //2.组合班组信息到lstWork
                this.formData.lstScheduleTmplEmpVO.forEach(item=>{
                    item.lstWork = [];
                    item.lstWork.push({sortkey: '1', isWork: item.sortkey1})
                    item.lstWork.push({sortkey: '2', isWork: item.sortkey2})
                    if(this.formData.cycle > 1) {
                        item.lstWork.push({sortkey: '3', isWork: item.sortkey3})
                    }
                    if(this.formData.cycle > 2) {
                        item.lstWork.push({sortkey: '4', isWork: item.sortkey4})
                    }
                })


                //3.排班信息每个人的排班制度必须和排班周期保持一致
                if(this.formData.cycle == 1) {
                    let isCheck = this.formData.lstScheduleTmplEmpVO.some(item=> {
                        let i = 0;
                        item.lstWork.forEach(child=>{
                            child.isWork == 1? i ++ : i
                        })
                        return i != 1
                    })
                    if(isCheck) {
                        this.$message.warning('选择的人员排班制度必须为上一休一')
                        return ;
                    }

                } else if(this.formData.cycle == 2) {
                    let isCheck = this.formData.lstScheduleTmplEmpVO.some(item=> {
                        let i = 0;
                        item.lstWork.forEach(child=>{
                            child.isWork == 1? i ++ : i
                        })
                        return i != 2
                    })
                    if(isCheck) {
                        this.$message.warning('选择的人员排班制度必须为上二休一')
                        return ;
                    }
                } else if(this.formData.cycle == 3) {
                    let isCheck = this.formData.lstScheduleTmplEmpVO.some(item=> {
                        let i = 0;
                        item.lstWork.forEach(child=>{
                            child.isWork == 1? i ++ : i
                        })
                        return i != 2
                    })
                    if(isCheck) {
                        this.$message.warning('选择的人员排班制度必须为上二休二')
                        return ;
                    }
                }        

                // 4.排班日期分开
                this.$set(this.formData, 'beginTime',this.formData.scheduTime[0]);
                this.$set(this.formData, 'endTime',this.formData.scheduTime[1]);

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
                            if (this.data == null) {
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
                            } else if (value != this.data[k]) {
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

        /**
         * 选择模板
         */
        toChooseModel() {
            this.modelVisible = true;
            this.modelDatas = [];
            queryAll('/scheduleTemplate/queryAll', {templateName: null}).then(res => {
                if(res.data.code == 0) {
                    this.modelDatas = res.data.data;
                    this.modelDatas.forEach(item=>{
                        this.$set(item, 'scheduTime', [item.beginTime,item.endTime])
                        item.lstScheduleTmplEmpVO.forEach((child)=>{
                            child.lstWork.forEach(node=>{
                                child['sortkey' + node.sortkey] = node.isWork
                            })
                        })
                    })
                }
            })

        },
        modelChecked(row) {
            this.checkedModelData = row;
        },
        // 关闭选择模板弹窗
        modelClose() {
            this.modelVisible = false;
            this.checked = false;
            this.checkedModelData = null;
        },
        // 确认选择模板
        modelSubmit() {
            if(this.checkedModelData) {
                //新增-模板id为空，编辑-模板id为原来的
                this.formData = this.checkedModelData;
                this.$set(this.formData, 'templateId', this.type == 'insert'?null:this.data.templateId)
                this.modelVisible = false;
                this.checked = false;
            } else {
                this.$message.warning('请选择模板')
                return  
            }
        },
        /**
         * 排班周期改变时
         */
        setSortWork(value,callback) {
            if(value) {
                if(!this.formData.lstScheduleTmplEmpVO || this.formData.lstScheduleTmplEmpVO && !this.formData.lstScheduleTmplEmpVO.length ) {
                    return
                }
                if(value == 2 || value == 3) {
                    this.formData.lstScheduleTmplEmpVO.forEach(item =>{
                        if(!item.sortkey3 || item.sortkey3 == null) {
                            this.$set(item, 'sortkey3','2')

                        }
                    })
                } 
                if(value == 3) {
                    this.formData.lstScheduleTmplEmpVO.forEach(item =>{
                        if(!item.sortkey4 || item.sortkey4 == null) {
                            this.$set(item, 'sortkey4','2') 
                        }
                    })
                }
                callback()
            }
        },
        /**
         * 班组信息操作
         */
        // 上班、休息状态切换
        toggleStatus(key,row, index) {
            row[key] = row[key] === '1'? '2':'1';
            this.$set(this.formData.lstScheduleTmplEmpVO, index, row); 
        },
        // 新增班组信息:人员和滑槽
        handleInsert() {
            this.scheduleTitle = '新增';
            this.scheduleVisible = true;

            // 一条排班信息
            this.empChecked = null;
            this.empCheckedData = {};
            this.chuteCheckData = [];

            queryAll('/scheduleTemplate/queryTeamAndChuteTree',{}).then(res => {
                if(res.data.code == 0) {
                    this.empTreeData = res.data.data.empTree;
                    this.chuteTreeData = res.data.data.chuteTree;
                    if(!this.empTreeData.length || !this.chuteTreeData.length) {
                        return
                    }
                    let empUnchecked = []
                    if(!this.formData.lstScheduleTmplEmpVO || !this.formData.lstScheduleTmplEmpVO.length) {
                        return
                    }
                    this.formData.lstScheduleTmplEmpVO.forEach(item=>{
                        empUnchecked.push(item.empId)
                    })
                    this.empTreeData.forEach(item=>{
                        item.children = item.children.filter(val => empUnchecked.indexOf(val.id) === -1)
                    })
                }
            })
            // console.log('this.empTreeData',this.empTreeData)
        },
        // 人员节点变化-单选
        empCheckChange(data) {
            // console.log('empCheckChange-------------',data)
            this.empCheckedData.teamId = data.parentId;
            this.empCheckedData.teamName = data.name;
            this.empCheckedData.empId = data.id;
            this.empCheckedData.empName = data.label;
        },
        // 滑槽节点变化
        chuteCheckChange() {
            let nodes = this.$refs.chuteTree.getCheckedNodes();
            this.chuteCheckData = [];
            if(nodes.length) {
                nodes.forEach(e => {
                    if(e.type == "chute") {
                        this.chuteCheckData.push(e.label);
                    }
                })
            }
        },
        // 选中节点时
        chuteCheck(data) {
            if(data && data.type == 'terminal') {
                let nodes = this.$refs.chuteTree.getCheckedNodes();
                let chuteCurrData = [];
                nodes.forEach(e => {
                    if(e.type == "chute") {
                        chuteCurrData.push(e.label);
                    }
                })
                if(chuteCurrData.length > 3) {
                    this.$refs.chuteTree.setChecked(data, false,true);
                    this.$message.warning('选择保障滑槽号不能超过3个');
                    let newNodes = this.$refs.chuteTree.getCheckedNodes();
                    chuteCurrData = [];
                    newNodes.forEach(e => {
                        if(e.type == "chute") {
                            chuteCurrData.push(e.label);
                            
                        }
                    })
                    this.chuteCheckData = chuteCurrData;
                    return;
                }
            }
            let nodes = this.$refs.chuteTree.getCheckedNodes();
            let chuteCurrData = [];
            if(nodes.length) {
                nodes.forEach(e => {
                    if(e.type == "chute") {
                        chuteCurrData.push(e.label);
                    }
                })
            }
            if(chuteCurrData.length > 3) {
                this.$refs.chuteTree.setChecked(data, false);
                this.chuteCheckData = chuteCurrData.filter(item => {return item != data.label});
                this.$message.warning('选择保障滑槽号不能超过3个')
            } else {
                this.chuteCheckData = chuteCurrData
            }
            
        },
        // 编辑人员和滑槽
        handelUpdate(row,index) {
            this.scheduleTitle = '编辑';
            this.scheduleVisible = true;
            // 选中的那条排班信息
            this.schedulIndex = index;
            this.empCheckedData = _.cloneDeep(row);
            this.empChecked = row.empId;
            this.chuteCheckData = row.chute.split(',');
            queryAll('/scheduleTemplate/queryTeamAndChuteTree',{}).then(res => {
                if(res.data.code == 0) {
                    this.empTreeData = res.data.data.empTree;
                    this.chuteTreeData = res.data.data.chuteTree;
                    if(!this.empTreeData.length || !this.chuteTreeData.length) {
                        return
                    }
                    let empUnchecked = []
                    if(!this.formData.lstScheduleTmplEmpVO || !this.formData.lstScheduleTmplEmpVO.length) {
                        return
                    }
                    this.formData.lstScheduleTmplEmpVO.forEach(item=>{
                        if(item.empId != row.empId) {
                            empUnchecked.push(item.empId)
                        }
                        
                    })
                    this.empTreeData.forEach(item=>{
                        item.children = item.children.filter(val => empUnchecked.indexOf(val.id) === -1)
                    })
                }
            })

        },
        // 删除人员和滑槽
        handelRemove(row) {
            this.delScheduleVisible = true;
            this.delScheduleData = row;  
        },
        // 确认删除人员和滑槽
        handleSchedule(row) {
            // 删除一条班组信息
            let i = this.formData.lstScheduleTmplEmpVO.indexOf(row);
            this.formData.lstScheduleTmplEmpVO.splice(i,1)
            this.delScheduleVisible = false;
        },
        // 关闭弹窗
        scheduleClose() {
            this.scheduleVisible = false;
            this.empChecked = null;
            this.empCheckedData = null,
            this.chuteCheckData = [];
        },
        // 保存人员和滑槽
        scheduleSubmit() {
            if(!this.empChecked || !this.chuteCheckData.length) {
                if(!this.empChecked) {
                    this.empError = true;
                }
                if(!this.chuteCheckData.length) {
                    this.chuteError = true;
                }   
                return 
            }
            if(this.scheduleTitle == '新增') {
                let obj = {
                    empId: this.empCheckedData.empId,
                    empName: this.empCheckedData.empName,
                    teamName: this.empCheckedData.teamName,
                    teamId: this.empCheckedData.teamId,
                    chute: this.chuteCheckData.join(','),
                    sortkey1: '2',
                    sortkey2: '2',
                }
                if(this.formData.cycle == 2) {
                    obj.sortkey3 = '2'
                }
                if(this.formData.cycle == 3) {
                    obj.sortkey3 = '2'
                    obj.sortkey4 = '2'
                }
                if(!this.formData.lstScheduleTmplEmpVO) {
                    this.$set(this.formData, 'lstScheduleTmplEmpVO', [])
                }
                this.formData.lstScheduleTmplEmpVO.push(obj);
            } else {
                //编辑
                this.formData.lstScheduleTmplEmpVO[this.schedulIndex].empId = this.empCheckedData.empId;
                this.formData.lstScheduleTmplEmpVO[this.schedulIndex].empName = this.empCheckedData.empName;
                this.formData.lstScheduleTmplEmpVO[this.schedulIndex].teamName = this.empCheckedData.teamName;
                this.formData.lstScheduleTmplEmpVO[this.schedulIndex].teamId = this.empCheckedData.teamId;
                this.formData.lstScheduleTmplEmpVO[this.schedulIndex].chute = this.chuteCheckData.join(',');
            }
            this.scheduleVisible = false;

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
                        this.$set(this, 'formData', JSON.parse(JSON.stringify(this.data)))
                        this.formData.lstScheduleTmplEmpVO.forEach((item,index)=>{
                            item.lstWork.forEach(child=>{
                                item['sortkey' + child.sortkey] = child.isWork
                            })
                        })
                        if (this.detailColumn) {
                            for (let i = 0; i < this.detailColumn.length; i++) {
                                for (let j = 0; j < this.detailColumn[i].length; j++) {
                                    if (this.detailColumn[i][j].formatter && this.formData[this.detailColumn[i][j].key]) {
                                        this.$set(this.detailColumn[i][j], 'value', this.formData[this.detailColumn[i][j].key].substr(0, 10))
                                    } else {
                                        this.$set(this.detailColumn[i][j], 'value', this.formData[this.detailColumn[i][j].key])
                                    }
                                }
                            }
                        }
                        this.submit = false
                        break
                        case 'insert': this.typeName = '新增'
                        this.$set(this.formData, {})
                        this.formData = {};
                        this.formColumn.forEach(item=>{
                            if(item.key == 'cycle') {
                                this.$set(item, 'defaultVal', '1')    
                            }
                        })
                        this.submit = true;
                        break
                        case 'update': this.typeName = '编辑'
                        this.submit = true;
                        this.formColumn.forEach(item=>{
                                this.$delete(item, 'defaultVal')    
                        })
                        this.$set(this, 'formData', JSON.parse(JSON.stringify(this.data)))
                        this.$set(this.formData, 'scheduTime', [this.data.beginTime,this.data.endTime])
                        this.formData.lstScheduleTmplEmpVO.forEach((item,index)=>{
                            item.lstWork.forEach(child=>{
                                item['sortkey' + child.sortkey] = child.isWork
                            })
                        })
                        break
                    }
                    this.updateData()
                } 
            },
        },
        type: {
            handler (type) {
                this.formColumn.forEach((item, index) => {
                    this.$set(item, 'disabled', false)
                })
            },
            immediate: true
        },
        'formData.templateName': {
            handler(val) {
                if(val) {
                    // this.handleChange (this.formColumn[0], val)
                    this.handleError('templateName', val)
                }    
            },
            immediate: true
        },
        empChecked: {
            handler(val) {
                this.empError = val?false: true;
            },
            immediate: true
        },  
        chuteCheckData: {
            handler(val) {
                if(val && val.length) {
                    this.chuteError = false;
                } else {
                    this.chuteError = true;
                }
            },
            immediate: true
        }

    }
}
</script>

<style lang="scss" scoped>

.form-dialog {
    /deep/.dialog > .main > .body{
        overflow: auto!important;
    }   
    .body {
        overflow: auto;
    }
    .form {
        height: 100%;
        padding: 0 20px;
        overflow-x: hidden;
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
    }
    /deep/.detail-table{
        td .cell {
            line-height: 30px!important;
            .operate-icon {
                &.active {
                    padding: 6px 24px;
                    border-radius: 6px;
                    color: #fff;
                    background: linear-gradient(to right, #3fa2f9, #4982ff)
                }
            }
        }
        .expand-item {
            display: flex;
            padding: 6px 20px;
            line-height: 30px;
            >div.label {
                flex: 0 0 70px;
                font-size: 14px;
                font-weight: bold;
                color: #90A3B6;
            }
            &:last-child {
                flex-direction: column;
                >div.label {
                    flex: 0 0 30px;
                }
            }
        }
    }
    /deep/.form-table {
        width: 100%;
        .el-table td, .el-table th {
            padding: 8px 0;
        }
        .el-table__fixed-right {
            .operation-cell {
                display: flex;
                justify-content: center;
                align-items: center;
                .table-opr {
                    width: 24px;
                    height: 24px;
                    cursor: pointer;

                    &:not(:last-child) {
                        margin-right: 16px;
                    }
                    &.detail {
                        background-image: url(~@icon/table/icon_detail.png);
                        &:hover {
                            background-image: url(~@icon/table/icon_detail_hover.png);
                        }
                    }
                    &.remove {
                        background-image: url(~@icon/table/icon_delete.png);
                        &:hover {
                          background-image: url(~@icon/table/icon_delete_hover.png);
                        }
                    }
                    &.reset {
                        background-image: url(~@icon/table/icon_reset.png);
                        &:hover {
                          background-image: url(~@icon/table/icon_reset_hover.png);
                        }
                    }
                    &.update {
                        background-image: url(~@icon/table/icon_update.png);
                        &:hover {
                          background-image: url(~@icon/table/icon_update_hover.png);
                        }
                    }
                }
            }
        }
        td .cell {
            line-height: 30px!important;
            .operate-icon {
                cursor: pointer;
                color: #52565F;
                padding: 6px 24px;
                border-radius: 6px;
                box-shadow: 0px 5px 20px 0px rgba(99, 126, 153, 0.25);
                &.active {
                    color: #fff;
                    background: linear-gradient(to right, #3fa2f9, #4982ff);
                    box-shadow: none;
                }
            }
        }
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
            cursor: pointer;
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
            // margin-right: 16px; 
        }
        &:nth-child(1) {
            margin-right: 0;
            // width: 100%;
            position: relative;
        }
        &:nth-child(2) {
            margin-right: 16px;
        }
        &:last-child {
            // overflow: auto;
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
            right: -300px;
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
            resize: vertical;
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
        .transfer-wrapper {
            text-align: left;
            /deep/.el-transfer-panel {
                width: 240px;
                input {
                    &::placeholder{
                        text-align: left;
                    }
                }
                .el-checkbox__inner {
                    width: 16px;
                    height: 16px;
                    border: 1px solid rgba($color: #c6d1da, $alpha: .7);
                    &::after {
                        border: none;
                        height: 8px;
                        left: 5px;
                    }
                }
                .el-transfer-panel__item.el-checkbox {
                    display: block;
                }
                .el-checkbox__input.is-checked .el-checkbox__inner,{
                    background-color: $blue !important;
                    border-color: $blue !important;
                    &:before,
                    &:after {
                        content: '';
                        display: block;
                        background: #fff;
                        position: absolute;
                        border-radius: 10px;
                    }

                    &:before {
                        width: 2px;
                        height: 6px;
                        transform: rotate(-45deg);
                        top: 6px;
                        left: 4px;
                    }

                    &:after {
                        height: 10px;
                        width: 2px;
                        transform: rotate(45deg);
                        left: 8px;
                        top: 3px;
                    }

                }
                .el-checkbox__input.is-indeterminate .el-checkbox__inner {
                    background-color: $blue !important;
                    border-color: $blue !important;
                    &::before {
                        width: 8px;
                        top: 6px;
                        left: 3px;
                        transform: none;
                    }
                }
            }
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
        &:nth-last-child(2) {
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

    // 选择模板
    .model-dialog {
        .header-title {
            width: 100%;
            position: relative;
            height: 72px;
            line-height: 72px;  
            .title {
                font-size: 16px;
                font-weight: bold;
                text-align: center;
                color: #3d424d;
            }
            .icon {
                font-size: 20px;
                position: absolute;
                top: -14px;
                right: -8px;
            }
        }
        .footer-btn {
            margin: 0 auto;
            button:first-child {
                margin-right: 12px;
            }
        }
        .cell {
        }
    }

    // 选择人员和滑槽
    .schedule-dialog {
        .schedule-form {
            display: flex;
            justify-content: space-between;
            height: calc(100% - 60px);
            padding: 0 20px;
            .schedule-form-item {
                width: 48.4%;
                text-align: left;
                position: relative;
                >span {
                    font-size: 14px;
                    color: #899DB2;
                }
                >div.tree {
                    height: 100%;
                    margin-top: 10px;
                    padding: 10px;
                    border: 1px solid #DDE6ED;
                    border-radius: 6px;
                    overflow: auto;
                }
                >.error {
                    position: absolute;
                    bottom: -52px;
                    left: 134px;
                    color: $red;
                    font-size: 10px;
                    display: inline;
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
