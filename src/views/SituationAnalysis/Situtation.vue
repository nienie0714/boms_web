<template>
    <div class="situation">
        <img class="back-home" :src="require('@img/icon/icon_back_home.png')" @click="$router.push('/comprhsQuery/flights')" />
        <div class="merge-body">
            <div class="left">
              <div class="top">
                  <out-bound :resize="resize" :refrush="refrush"></out-bound>
                  <!-- <div class="lb-left">
                  <Green :resize="resize" :refrush="refrush"></Green>
                  </div> -->
              </div>
              <div class="bottom">
                  <incom :resize="resize" :refrush="refrush"></incom>
              </div>
            </div>
              <div class="center">
                <div class="top">
                  <out-lug :resize="resize" :refrush="refrush"></out-lug>
                </div>
                <div class="bottom">
                  <in-lug :resize="resize" :refrush="refrush"></in-lug>
                </div>
              </div>
            <div class="right">
              <div class="top">
                  <outLug-year :resize="resize" :refrush="refrush"></outLug-year>
              </div>
              <div class="bottom">
                  <transf :resize="resize" :refrush="refrush"></transf>
              </div>
            </div>
        </div>
    </div>
</template>
<script>
import echarts from 'echarts'
import Incom from './mercy/Incom'
import OutBound from './mercy/outBound'
import OutLugYear from './mercy/OutLugYear'
import Transf from './mercy/transfLug'
import OutLug from './mercy/outLug'
import InLug from './mercy/InLug';
export default {
  components: {
    Incom,
    OutBound,
    OutLugYear,
    Transf,
    OutLug,
    InLug
  },
  data () {
    return {
      // 任务调度、航班查询特殊设置
      // pageStyle: [{
      //   key: 'background',
      //   value: 'url(' + require('@icon/log/icon_logout.png') + ') top repeat-x'
      // }, {
      //   key: 'background-color',
      //   value: '#060d14'
      // }],
      resize: false,
      intervalTime: 60 * 1000,
      refrush: false
    }
  },
  mounted () {
    // let bodyView = this.$root.$el.querySelector('.body-view')
    // this.pageStyle.forEach(item => {
    //   bodyView.style[item.key] = item.value
    // })
    this.refrushTime()
    this.timer = setInterval(this.refrushTime, this.intervalTime)
    window.onresize = () => {
      this.$nextTick(() => {
        this.resize = !this.resize
      })
    }
  },
  methods: {
    refrushTime () {
      this.refrush = !this.refrush
    }
  }
}
</script>
<style lang="scss" scoped>
.situation {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-image: url(~@img/icon/icon_bgS.jpg);
  background-size: 100% 100%;
  .back-home {
    position: absolute;
    top: 0;
    right: 0;
    width: 40px;
    height: 40px;
    cursor: pointer;
  }
}
.merge-body {
  padding: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  overflow-x: auto;
  overflow-y: auto;

}
.left,.center, .right {
  display: flex;
  flex-direction: column;
  position: relative;
}
.left,.center {
  width: calc((100% - 80px) / 1860 * 570);
  margin-right: 20px;
}
.right {
  width: calc((100% - 80px) / 1860 * 760);
}
.top, .bottom {
  position: relative;
}
.top {
  margin-bottom: 20px;   

}
.bottom {
  
  
}
.left > .bottom {
  height: calc((100% - 20px) / 2);
}
.left > .top {
  display: flex;
  height: calc((100% - 20px) / 2);
}
.center > .bottom {
  // height: calc((100% - 2%) / 950 * 475);
  height: calc((100% - 20px) / 2);
}
.center > .top {
  // height: calc((100% - 2%) / 950 * 475);
  display: flex;
  height: calc((100% - 20px) / 2);
}
.right > .top {
  // height: calc((100% - 2%) / 950 * 475);
  display: flex;
  height: calc((100% - 20px) / 2);
}
.right > .bottom {
  // height: calc((100% - 2%) / 950 * 475);
  height: calc((100% - 20px) / 2);
}
// @media (min-width: 1920px) and (max-aspect-ratio: 16/9) {
//   .merge-body {
//     overflow-y: hidden !important;
//   }
// }
// @media (min-width: 1920px) {
//   .merge-body {
//     flex-direction: row;
//   }
//   .left {
//     // width: calc((100% - 1%) / 1860 * 590);
//     height: 0;
//     // padding-bottom: calc((100% - 1%) / 1860 * 970);
//   }
//   .center {
//     // margin-left: 1%;
//     // margin-right: 0%;
//     // width: calc((100% - 1%) / 1860 * 590);
//     height: 0;
//     // padding-bottom: calc((100% - 1%) / 1860 * 970);
//   }
//   .right {
//     margin-left: 1%;
//     margin-right: 1%;
//     width: calc((100% - 1%) / 1860 * 800);
//     height: 0;
//     padding-bottom: calc((100% - 1%) / 1860 * 970);
//   }
// }
// @media (max-width: 1919px) {
//   .merge-body {
//     flex-direction: column;
//   }
//   .left {
//     width: 100%;
//     height: 0;
//     padding-bottom: calc(100% / 1060 * 970);
//   }
//   .center {
//     width: 100%;
//     height: 0;
//     padding-bottom: calc(100% / 1060 * 970);
//   }
//   .right {
//     /* margin-top: 20px; */
//     width: 100%;
//     height: 0;
//     padding-bottom: calc(100% / 1060 * 970);
//   }
// }
</style>