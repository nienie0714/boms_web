<template>
    <!-- 状态监控 -->
    <div class="gantt-contain">
        <div class="gantt-header">
            <div class="gantt-left-header">
                <div>保障人员</div>
                <div>航班号</div>
            </div>
            <!-- 时间轴 -->
            <div class="gantt-right-header" 
                ref="ganttRightH" 
                @scroll="ganttRightHScroll"
                @mousedown.prevent="ganttRightHDown"
                @mouseup.prevent="ganttRightHUp">
                <div class="gantt-right-box" ref="ganttxAxis">
                    <div v-for="(item,index) in xAxis" :key="index">
                        <i>{{item}}</i>
                        <div>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>    
                    </div>
                </div>
            </div>
        </div>
        <div class="gantt-body">
            <div class="gantt-left" ref="ganttLeft">
                <div v-for="item in sourceData" :key="item.empId" class="gantt-left-item">
                    <div class="item-title" :title="item.pname">{{item.pname}}</div>
                    <ul class="item-flight" >
                        <template v-for="(child, childIndex) in item.flightDatas" >
                            <li :key="childIndex">{{child.flightNo}}</li>
                        </template>
                        
                    </ul>
                </div>
            </div>
            <div class="gantt-right" 
                ref="ganttRight" 
                @mousewheel="scrollEvent" 
                @scroll="ganttRightScroll"
                @mousedown.prevent="ganttRightDown"
                @mouseup.prevent="ganttRightUp">
                <div class="gantt-right-box">
                    <div v-for="(item,index) in sourceData" :key="item.empId" class="gantt-right-item">
                        <!-- 航班背景虚线 -->
                        <ul class="gantt-bgLine" >
                            <template v-for="(child, childIndex) in item.flightDatas" >
                                <li :key="childIndex">{{child.flightNo}}</li>
                            </template>
                        </ul>
                        <!-- 航班时间段线条 -->
                        <template v-for="(child,childIndex) in renderData[item.empId]" >
                            <div class="gantt-line-contain" :key="childIndex" :style="`left: ${child.startP}px; top: ${9 + 26 * child.top - 13}px;width: ${child.width}px;`">
                                <div class="gantt-line" :key="childIndex" :style="`width: ${child.width}px;`" :class="child.type === 0? 'gray':(child.type === 1 ?'blue':(child.type === 2 || child.type === 4?'red':'green'))" @mouseenter="enterTrigger(child, index + '' + childIndex, $event)" @mouseleave="leaveTrigger($event)">
                                </div>
                                <i class="text-left" ref="textLeft" v-if="child.type !== 0" :class="child.type === 0? 'gray':(child.type === 1 ?'blue':(child.type === 2 || child.type === 4?'red':'green'))">{{formatSubstr(child.start,[11,5])}}</i>
                                <i class="text-right" ref="textRight" v-if="child.type !== 0" :class="child.type === 0? 'gray':(child.type === 1 ?'blue':(child.type === 2 || child.type === 4?'red':'green'))">{{formatSubstr(child.end,[11,5])}}</i>
                            </div>
                            
                        </template>
                    </div>
                    <!-- 当前时间线 -->
                    <span class="gantt-curLine" :style="`left:${curPosition}px;`"></span>
                </div>
            </div>
        </div>

        <!-- 文字说明提示 -->
        <div class="tip-content" v-if="isShowTip" :style="`top: ${tipTop}px; left:${tipLeft}px;`">
            <h6>{{activeData.pname}}</h6>
            <div class="tip-prop">
                <span>计划开始 / 实际开始</span>
                <span>计划结束 / 实际结束</span>
            </div>
            <div class="tip-value">
                <span>{{formatSubstr(activeData.startE,[11,5])}} / {{formatSubstr(activeData.start,[11,5])}}</span>
                <span>{{formatSubstr(activeData.endE,[11,5])}} / {{formatSubstr(activeData.end,[11,5])}}</span>
            </div>
            <span class="tip-arrow" :class="tipArrowTop?'tipArrowTop':''"></span>
        </div>

        <!-- 头尾时间提示 -->
        <!-- <i class="text-left" v-if="child.type !== 0 && !isShowTip">{{formatSubstr(child.start,[11,5])}}</i> -->
        <!-- <i class="text-right" v-if="child.type !== 0 && !isShowTip">{{formatSubstr(child.end,[11,5])}}</i> -->

        <!-- 底部统计和图例 -->
        <div class="gantt-footer" >
            <div class="gantt-left-footer" v-if="tabKey == 'N-LOAD-TRUCK' || tabKey == 'N-LOAD-AIRCRAFT'">
                <!-- <span>保障人员：{{sourceData.length||0}}</span>
                <span>正常航班：{{flightNum.normalNum}}</span>
                <span>异常航班：{{flightNum.abnormalNum}}</span>
                <span>已完成：{{flightNum.finishedNum}}</span>
                <span>未完成：{{flightNum.unfinishedNum}}</span>
                <span>保障中：{{flightNum.doingNUm}}</span> -->
            </div>
            <div class="gantt-left-footer" v-else>
                <!-- <span>保障人员：{{sourceData.length || 0}}</span>
                <span>国内保障航班：{{flightNum.DfightNum}}</span>
                <span>国际保障航班：{{flightNum.IflightNum}} </span> -->
            </div>
            <div class="gantt-right-footer">
                <span class="gray"></span>计划/预计 <span class="blue"></span>保障中（正常） <span class="red"></span>保障超时 <span class="green"></span>保障完成（正常）
            </div>
        </div>
    </div>
</template>

<script>
import {dateFormat} from '@/util/util'
import { queryAll } from '@/util/base'
import { setInterval, clearInterval } from 'timers';
export default {
    props: ['tabKey'],
    data () {
        return {
            baseUrl: '/gantt/queryByNodeNo',
            sourceData: [],
            renderData: {},
            flightNum:  {
                normalNum: 0,          //正常航班：正常进行中、正常完成 1 3
                abnormalNum: 0,        //异常航班：超时完成、超时进行中 2 4
                finishedNum: 0,        //已完成：正常完成、超时完成 3 4
                unfinishedNum: 0,      //未完成：未开始、超时进行中、正常进行中 0 1 2
                doingNUm: 0,           //正在保障中：超时进行中、正常进行中 1 2
                IflightNum: 0,         //国际
                DfightNum: 0,          //国内
            },
            xAxis: [],
            unit: 8,            //一分钟的时间刻度对应8px
            currentTime: '',
            curPosition: 0,
            isShowTip: false,
            activeIndex: 0,
            activeData: {},
            tipTop: 0,
            tipLeft: 0,
            tipArrowTop: false,
            onceTimer: null,    //定时器
            halfWidth: 720,     //90min*8px
            isDown: false,
            isHDown: false,
        }
    },
    created() {
        // 处理时间轴横坐标
        this.xAxis = [].concat(this.getXAxis(),this.getXAxis(),this.getXAxis());
        // 初始化数据，先处理一种节点类型的数据  离港分拣
        this.init(this.tabKey);
    },
    mounted() {
        //设置当前时刻标记线的位置，并设置这个线的在屏幕中间显示
        this.onceTimer = setInterval(()=>{
            this.init(this.tabKey)
        }, 60 * 1000)     
    },
    destroyed() {
        clearInterval(this.onceTimer);
        this.onceTimer = null;
    },
    methods: {
        /**
         * 获取服务器当前时间
         */
        getServerDate(){
            var xhr = null;
            if(window.XMLHttpRequest){
                xhr = new window.XMLHttpRequest();
            }else{
                xhr = new ActiveXObject("Microsoft");
            }
            xhr.open("GET", "/?uuid="+new Date().getTime(), false);
            xhr.send(null);
            var date = xhr.getResponseHeader("Date");
            console.log('date',date)
            return new Date(date);
        },
        /**
         * 初始化数据 
         * param nodeNo-流程节点
         */
        init(nodeNo) {
            queryAll(this.baseUrl, {nodeNo: nodeNo}).then(res => {
                if (res.data.code == 0) {
                    this.sourceData = Object.assign([],res.data.data);
                    if(!res.data.data.length) {
                        // this.flightNum = {
                        //     normalNum: 0,         
                        //     abnormalNum: 0, 
                        //     finishedNum: 0,
                        //     unfinishedNum: 0,
                        //     doingNUm: 0,
                        //     IflightNum: 0,
                        //     DfightNum: 0,
                        // };
                        return;
                    }
                    this.setCurPosition();
                    this.formatData(this.tabKey,res.data.data);
                } else {
                    this.$msg.error({
                        info: '获取数据失败 !',
                        tip: res.data.msg
                    })
                }
            })
        },
        formatData(nodeNo,data) {
            this.renderData = {};
            // this.flightNum = {
            //     normalNum: 0,         
            //     abnormalNum: 0, 
            //     finishedNum: 0,
            //     unfinishedNum: 0,
            //     doingNUm: 0,
            //     IflightNum: 0,
            //     DfightNum: 0,
            // };
            data.forEach(item => {
                let arr = [];
                let i = 1;
                item.flightDatas.forEach((child,childIndex) => {
                    if(child.startE) {
                        let obj1 = {};
                        obj1.pname = item.pname;
                        obj1.flightNo = child.flightNo;
                        obj1.start = child.startE;
                        obj1.end = child.endE;
                        obj1.type = 0;
                        obj1.top = i;
                        obj1.startP = this.getPositionandLen(child.startE,child.endE).start_p;
                        obj1.width = this.getPositionandLen(child.startE,child.endE).start_w;
                        if(obj1.width) {
                            arr.push(obj1)
                        }
                    }
                    if(child.startA) {
                        let obj2 = {};
                        obj2.pname = item.pname;
                        obj2.flightNo = child.flightNo;
                        obj2.start = child.startA;
                        obj2.end = child.endA;
                        obj2.startE = child.startE;
                        obj2.endE = child.endE;
                        obj2.type = child.status;
                        obj2.top = i;
                        obj2.startP = this.getPositionandLen(child.startA,child.endA).start_p;
                        obj2.width = this.getPositionandLen(child.startA,child.endA).start_w;
                        if(obj2.width) {
                            arr.push(obj2)
                        } 
                    }
                    // 统计信息，后期加----
                    // if(child.status === 1 || child.status === 3) {
                    //     this.flightNum.normalNum ++;
                    // }
                    // if(child.status === 2 || child.status === 4) {
                    //     this.flightNum.abnormalNum ++;
                    // }
                    // if(child.status === 3 || child.status === 4) {
                    //     this.flightNum.finishedNum ++;
                    // }
                    // if(child.status === 0 || child.status === 1 || child.status === 2) {
                    //     this.flightNum.unfinishedNum ++;
                    // }
                    // if(child.status === 1 || child.status === 2) {
                    //     this.flightNum.doingNUm ++;
                    // }
                    // if(child.attr === 'D') {
                    //     this.flightNum.DfightNum ++;
                    // } else if(child.attr === 'I') {
                    //     this.flightNum.IflightNum ++;
                    // }
                    // 统计信息，后期加----
                    i++;
                })
                this.$set(this.renderData,item.empId,arr)
            })
        },
        /**
         * 航班时间tip显示
         */
         // 鼠标移入
        enterTrigger(row, index, $event) {
            if(row.type === 0) {
                this.isShowTip = false;
                return 
            }
            this.activeData = row;
            this.activeIndex = index;
            this.isShowTip = true;
            if($event.clientY < 360) {
                // 在线条下面显示
                this.tipTop = $event.clientY + 20;
                this.tipLeft = $event.clientX;
                this.tipArrowTop = true;
            } else {
                // 在线条上面显示
                this.tipTop = $event.clientY - 120;
                this.tipLeft = $event.clientX;
                this.tipArrowTop = false;
            }
        },
        // 鼠标移出
        leaveTrigger($event) {
            this.activeData = {};
            this.isShowTip = false;
        },
        setCurPosition() {
            // 获取当前时刻
            this.currentTime = this.getServerDate();
            // 获取当前时刻的位置，并绘制时刻线
            this.curPosition = new Date(this.currentTime).getHours()*60*this.unit + new Date(this.currentTime).getMinutes()*this.unit + 24*60*this.unit;
            /**
             * 让当前时间在屏幕的中间显示
             * 假如现在是03:00，则中间位置时间为4:30,则时间在03:00 -04:30时中间位置始终是04:30；
             * 假如现在是02:59，则中间位置时间为1:30,则时间在01:30 -02:59时中间位置始终是01:30；
             * 假如时间在04:30 -01:39时，取当前时间为中间位置；
             */
            let ganttRight = this.$refs['ganttRight'] ? this.$refs['ganttRight']: null;
            let ganttRightH = this.$refs['ganttRightH'] ? this.$refs['ganttRightH']: null;
            
            if(ganttRight) {
                ganttRight.scrollLeft = this.curPosition < this.halfWidth ? 0 :this.curPosition - this.halfWidth;
            }
            if(ganttRightH) {
                ganttRightH.scrollLeft = this.curPosition < this.halfWidth ? 0 :this.curPosition - this.halfWidth;
            }
        },
        // 生成时间轴 xAxs 前天 今天 明天
        getXAxis() {
            let arr = [];
            for(let i = 0; i < 24; i ++) {
                let h = this.dealHour(i);
                for(let j = 0; j < 60 ; j +=5){
                    let m = this.dealHour(j);
                    arr.push(`${h}:${m}`);
                }
            }
            return arr;
        },
        // 时间不够两位前面补0
        dealHour(h){
            let sh = String(h);
            if(sh.length===1){
                sh = `0${sh}`;
            }
            return sh;
        },
        // 格式化航班时间段数据，获取时间段的位置（start_m-分钟  start_p-位置left  start_w长度width）
        getPositionandLen(start, end) {
            // 基准日期
            let baseDate = new Date(this.currentTime - 24*3600*1000).toLocaleDateString()
            //this.unit-1分钟是8px;
            let start_m =  (new Date(this.formatSubstr(start,[0,16])).getTime() - new Date(baseDate + ' 00:00:00').getTime()) / 1000 / 60 
            let start_p = start_m * this.unit;
            let start_w = (new Date(this.formatSubstr(end,[0,16])).getTime() - new Date(this.formatSubstr(start,[0,16])).getTime()) / 1000 / 60 * this.unit;
            return {
                start_p: start_p,
                start_w: start_w,
            }
        },
        // 格式化时间
        formatSubstr (value, indexArr) {
            if(!value) return;
            return value.substr(indexArr[0], indexArr[1])
        },
        scrollEvent(event) {
            let scrollTop = event.wheelDeltaY;
            let ganttRight = this.$refs['ganttRight'] ? this.$refs['ganttRight'][0] : null;
            if(ganttRight) {
                if(scrollTop < 0) {
                    // 向上滚动
                    ganttRight.scrollTop -= scrollTop
                } else if(scrollTop > 0) {
                    // 向下滚动
                    ganttRight.scrollTop -= scrollTop
                } else {
                    ganttRight.scrollTop -= scrollTop
                }
            }
        },
        // ganttBody scroll事件
        ganttRightScroll(e) {
            let ganttLeft = this.$refs['ganttLeft'] ? this.$refs['ganttLeft']: null;
            let ganttRightH = this.$refs['ganttRightH'] ? this.$refs['ganttRightH']: null;
            let scrollTop = e.currentTarget.scrollTop;
            let scrollLeft = e.currentTarget.scrollLeft;
            if (ganttLeft) {
                ganttLeft.scrollTop = scrollTop;
            }
            if(ganttRightH) {
                ganttRightH.scrollLeft = scrollLeft;
            }        
        },
        ganttRightHScroll(e) {
            let ganttRight = this.$refs['ganttRight'] ? this.$refs['ganttRight']: null;
            let scrollLeft = e.currentTarget.scrollLeft;    
            ganttRight.scrollLeft = scrollLeft;
        },
        ganttRightDown(e) {
            let _that = this;
            _that.isDown = true;
            _that.isHDown = false;
            let x = e.clientX;
            let disX = 0;
            let preScrollleft = e.currentTarget.scrollLeft;
            let ganttRightH = _that.$refs['ganttRightH'];
            e.currentTarget.onmousemove = function(event) {
                if(!_that.isDown) return;
                let nx = event.clientX;
                disX = nx - x;
                //大于0 向右移，小于0 向左移
                ganttRightH.scrollLeft = preScrollleft - disX;
                x = nx;
                preScrollleft = ganttRightH.scrollLeft;
                if(preScrollleft < 0 || preScrollleft > 10028) {
                    return 
                }
            }
        },
        ganttRightUp(e) {
            this.isDown = false;
            this.isHDown = false;
            this.$refs['ganttRight'].onmousemove = null;
        },
        ganttRightHDown(e) {
            let _that = this;
            _that.isDown = false;
            _that.isHDown = true;
            let x = e.clientX;
            let disX = 0;
            let preScrollleft = e.currentTarget.scrollLeft;
            let ganttRight = _that.$refs['ganttRight'];
            e.currentTarget.onmousemove = function(event) {
                if(!_that.isHDown) return;
                let nx = event.clientX;
                disX = nx - x;
                //大于0 向右移，小于0 向左移
                ganttRight.scrollLeft = preScrollleft - disX;
                x = nx;
                preScrollleft = ganttRight.scrollLeft;
                if(preScrollleft < 0 || preScrollleft > 10028) {
                    return 
                }
            }

        },
        ganttRightHUp(e) {
            this.isDown = false;
            this.isHDown = false;
            this.$refs['ganttRightH'].onmousemove = null;
        },
    },
    watch: {
        tabKey(val) {
            // this.init(val)
        },
        // '$store.state.base.ifFullscreen'(val) {
        //     if(val) {
        //     }
        // }
    }
}
</script>

<style lang="scss" scoped>
.gantt-contain {
    ul,li {
        list-style: none;
        margin: 0;
    }
    width: 100%;
    height: 100%;
    padding-bottom: 39px;
    border-radius: 8px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    .gantt-header {
        width: 100%;
        flex: 0 0 60px;
        display: flex;
        overflow: hidden;
        font-size: 14px;
        font-weight: bold;
        color: #718499;
        .gantt-left-header {
            flex: 0 0 180px;
            padding: 20px 10px 20px 20px;
            display: flex;
            justify-content: space-between;
            >div {

            }
        }
        .gantt-right-header {
            flex: 1;
            overflow-x: hidden;
            overflow-y: hidden;
            -moz-user-select:none; 
            -webkit-user-select:none; 
            -ms-user-select:none; 
            -khtml-user-select:none; 
            -o-user-select:none;
            user-select:none; 
            >div.gantt-right-box {
                width: 100%;
                height: 100%;
                padding-top: 10px;
                display: flex;
                >div {
                    flex: 0 0 40px;
                    text-align: left;
                    i {
                        font-style: normal;
                        font-size: 12px;
                    }
                    // &:nth-child(-n+288) {
                    //     border-left: 1px solid red;
                    // }
                    // &:nth-child(n+577) {
                    //     // border-left: 1px solid blue;
                    // }
                    >div {
                        height: 30px;
                        border-left: 1px solid #899DB2;
                        display: flex;
                        
                        &:last-child {
                            border-left: 1px solid #899DB2;
                        }
                        span {
                            flex: 1;
                            height: 12px;
                            border-right: 1px solid #899DB2;
                            &:last-child {
                                border-right: 0;
                            }
                        }
                    }

                }
            }  
        }

    }
    .gantt-body {
        width: 100%;
        height: 100%;
        display: flex;
        background-color: #fff;
        overflow: hidden;
    }
    .gantt-left {
        flex: 0 0 180px;
        height: 100%;
        overflow: hidden;
        .gantt-left-item {
            font-size: 14px;
            line-height: 26px;
            color: #525660;
            padding: 10px 10px 10px 20px;
            border-bottom: 1px solid #DDE6ED;
            display: flex;
            justify-content:space-between;
            &:nth-child(even) {
                background-color: rgba(221,230,237,0.2);
            }
            .item-title {
                width: 90px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                text-align: left;
            }
        }
    }
    .gantt-right {
        flex: 1;
        overflow-x: hidden;
        overflow-y: auto;
        >div.gantt-right-box {
            position: relative;
            span.gantt-curLine {
                position: absolute;
                top: 0;
                left: 0;
                width: 1px;
                height: 100%;
                border-right: 1px solid #04A3FF;
                box-shadow: 0px 4px 8px 0px rgba(104,129,153,0.1);
            }
            .gantt-right-item {
                display: flex;
                width: 34560px;
                min-height: 47px;
                line-height: 40px;
                padding: 10px 0 10px 20px;
                border-bottom: 1px solid #DDE6ED;
                position: relative;
                &:nth-child(even) {
                    background-color: rgba(221,230,237,0.2);
                }
                >ul.gantt-bgLine {
                    width: 100%;
                    font-size: 14px;
                    line-height: 26px;
                    text-align: left;
                    color: transparent;
                    li {
                        position: relative;
                        &::before {
                            position: absolute;
                            content: '';
                            width: 100%;
                            height: 1px;
                            top: 13px;
                            left: -16px;
                            border-bottom: 1px dashed #DDE6ED;
                        }
                    }
                }
                .gantt-line-contain {
                    position: absolute;
                    i.text-left {
                        position: absolute;
                        font-size: 12px;
                        font-style: normal;
                        top: -32px;
                        left: -1px;
                        transform: translateX(-100%);
                    }
                    i.text-right {
                        position: absolute;
                        font-size: 12px;
                        font-style: normal;
                        top: -32px;
                        right: -1px;
                        transform: translateX(100%);
                    }
                    i.text-left,i.text-right {
                        &.green {
                            color: #01B674;
                        }
                        &.blue {
                            color: #3392FF;
                        }
                        &.red {
                            color: #F75467;
                        }
                    }
                }
                .gantt-line {
                    position: absolute;
                    cursor: pointer;
                    z-index: 10;
                    &::before {
                        position: absolute;
                        content: '';
                        left: 0;
                        top: -4px;
                        width: 3px;
                        height: 11px;
                        background-color: #A7B9CC;
                    }
                    &::after {
                        position: absolute;
                        content: '';
                        right: 0;
                        top: -4px;
                        width: 3px;
                        height: 11px;
                        background-color: #A7B9CC;
                    }
                    
                    &.gray {
                        border-bottom: 3px dashed #A7B9CC;
                    }
                    &.green {
                        height: 5px;
                        background-color: #01B674;
                        margin-top: -1px;
                        &::before,&::after {
                            top: -3px;
                            background-color: #01B674;
                        }
                        &:hover {
                            height: 11px;
                            margin-top: -4px;
                            // border: 4px solid #dbf9ee;
                            border-radius: 2px;
                            box-shadow: 0px 0px 0 4px rgba(1, 182, 116, 0.2);
                            transition: all 0.1s;
                            &::before,&::after {
                                width: 0;
                            }
                        }
                    }
                    &.blue {
                        height: 5px;
                        background-color: #3392FF;
                        margin-top: -1px;

                        &::before,&::after {
                            top: -3px;
                            background-color: #3392FF;
                        }
                        &:hover {
                            height: 11px;
                            margin-top: -4px;
                            // border: 4px solid #e1f1fb;
                            border-radius: 2px;
                            box-shadow: 0px 0px 0 4px rgba(53, 181, 255, 0.2);
                            transition: all 0.1s;
                            &::before,&::after {
                                width: 0;
                            }
                        }
                    }
                    &.red {
                        height: 5px;
                        background-color: #F75467;
                        margin-top: -1px;
                        &::before,&::after {
                            top: -3px;
                            background-color: #F75467;
                        }
                        &:hover {
                            height: 11px;
                            margin-top: -4px;
                            // border: 4px solid #ffe0e4;
                            border-radius: 2px;
                            box-shadow: 0px 0px 0 4px rgba(247, 84, 103, 0.2);
                            transition: all 0.1s;
                            &::before,&::after {
                                width: 0;
                            }
                        }
                    }

                    

                }
                
            }
            
        }
        
    }

    .tip-content {
        position: fixed;
        width: 300px;
        height: 100px;
        padding: 10px 16px;
        background: rgba(24,43,61,0.9);
        border-radius: 8px;
        z-index: 2;
        text-align: left;
        left: 50%;
        transform: translateX(-50%);
        z-index: 11;
        // 小三角
        >span.tip-arrow {
            position: absolute;
            width:0; 
            height:0; 
            border-top: 8px solid rgba(24,43,61,0.9);
            border-left: 8px solid transparent; 
            border-right: 8px solid transparent;
            bottom: -8px;
            left: 50%;
            transform: translateX(-50%);
            &.tipArrowTop {
                top: -8px;
                transform: rotateZ(180deg);
            }
        }
        >h6 {
            font-size: 16px;
            line-height: 22px;
            color: #fff;
        }
        >div.tip-prop {
            height: 24px;
            margin-top: 12px;
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            color: #fff;
            opacity: 0.6;
        }
        >div.tip-value {
            display: flex;
            justify-content: space-between;
            font-size: 16px;
            color: #fff;
        }
    }

    .gantt-footer {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 40px;
        padding: 0 20px;
        border-top: 1px solid #DDE6ED;
        display: flex;
        justify-content: space-between;
        line-height: 40px;
        font-size: 16px;
        color: #718499;
        .gantt-left-footer {
            span {
                margin-right: 20px;
            }
        }
        .gantt-right-footer {
            font-size: 14px;
            span {
                display: inline-block;
                vertical-align: middle;
                width: 27px;
                height: 11px;
                margin-left: 20px;
                margin-right: 10px;
                &.gray {
                    background-image: url(~@img/icon/icon_legend_gray.png);
                }
                &.blue {
                    background-image: url(~@img/icon/icon_legend_blue.png);
                }
                &.red {
                    background-image: url(~@img/icon/icon_legend_red.png);
                }
                &.green {
                    background-image: url(~@img/icon/icon_legend_green.png);
                }
            }
            
        }

    }
}
</style>
