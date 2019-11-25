<template>
    <div class="lugManaContent">
        <!-- <None :desc="description"></None> -->
        <!-- <div class="tab-group">
            <div class="tab"
                 :class="{focus: selectKey === 'D',}"
                 @click="selectType('D')">
                出港
            </div>
            <div class="tab"
                 :class="{focus:selectKey==='A'}"
                 @click="selectType('A')">
                进港
            </div>
        </div>  -->
        <div class="templateContent">
            <tabs :tabsData="tabsData" @tabItemClick="tabItemClick"></tabs>
        </div>
        <OutBound v-if="selectKey == 'D'" :selectKey="selectKey"></OutBound>
        <InComing v-else :selectKey="selectKey"></InComing>
    </div>
</template>
<script>
import None from'../home/common/none'
import Tabs from '@view/Tabs/Tabs'
import OutBound from './OutBoundFlit'
import InComing from './IncomingFlit'

export default {
    components: {
       // None
       Tabs,
       OutBound,
       InComing
    },
    data() {
        return {
            // description: '1、支持某一出港航班已值机行李，对其分拣环节、装机环节的保障时间进行批量维护。实现保障节点时间的增、删、改、查功能。<br />2、支持某一进港航班行李，对其卸机环节、上转盘环节的保障时间进行批量维护。实现保障节点时间的增、删、改、查功能。<br />3、支持系统存在的出港行李，对其分拣环节、装机环节的保障时间进行维护。实现保障节点时间的增、删、改、查功能。<br />4、支持系统存在的进港行李，对其卸机环节、上转盘环节的保障时间进行维护。实现保障节点时间的增、删、改、查功能。',
            axiosChildArr: [],
            queryUrl: '/integrated/luggageSecurity/queryFlightInfo', // /',pageQuery
            selectKey: 'D',
            tabsData: [
                {
                key: 'D',
                label: '出港航班',
                },
                {
                key: 'A',
                label: '进港航班',
                }
            ],
        }   
    },
    created(){
        this.selectKey = 'D'
    },
    methods:{
        tabItemClick (key) {
            this.selectKey = key
        },
        selectType (type) {
            this.selectKey = type
            this.private_type = type;
            // 清空选择
            this.selectValue = '';
    },
    }

}
</script>
<style lang="scss" scoped>

// .tab-group{
// display: -webkit-box;
// display: -ms-flexbox;
// position: absolute;
// top: 100px;
// left: 50%;
// // right: 725px;
// margin: auto;
// display: flex;
// height: 36px;
// margin-left: 16px;
// margin-right: 17px;
// margin-bottom: 20px;
// transform: translateX(-50%);
// width: 248px;
// height: 38px;
// background: rgba(255, 255, 255, 1);
// box-shadow: 0px 0px 40px 0px rgba(115, 134, 153, 0.3);
// border-radius: 18px;
// padding: 3px 3px;

// // justify-content: center;
// // display: flex;

// // border-radius:30px

// }


// .tab {
//     display: inline-block;
//     position: relative;
//     width: 121px;
//     height: 32px;
//     line-height: 32px;
//     background: #fff;
//     border-radius: 16px;
//     font-size: 16px;
//     font-family: Microsoft YaHei;
//     font-weight: 400;
//     color: #899DB2;
//     cursor: pointer;
// }

// .tab.focus {
//     color: rgba(255, 255, 255, 1);
//     /*background: linear-gradient(90deg, #3b97f5, #4276fb);*/
//     background: linear-gradient(-90deg, rgba(105, 107, 255, 1), rgba(80, 185, 240, 1));
// }

// .tab.disable {
//     cursor: not-allowed;
// }
.templateContent {
   padding: 0px 20px 20px 6px;
   position: absolute;
   top:100px;
   left:900px;
}

/deep/.templateContent .tabs {
  width: 240px;
  font-size: 15px;
  text-align: center
}

/deep/.templateContent .tabs .tab-item.current-item {
  flex: 1;
}


</style>


