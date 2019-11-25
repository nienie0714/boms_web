<template>
<div class="parent-bg">
  <div class="img-but">
    <button @click="showImg($event)" val="one" :class="first ? 'choose' : ''">first</button>
    <button @click="showImg($event)" val="two" :class="second ? 'choose' : ''">second</button>
    <button @click="showImg($event)" val="three" :class="third ? 'choose' : ''">third</button>
    <button @click="showImg($event)" val="four" :class="four ? 'choose' : ''">four</button>
  </div>
  <img src="~@img/bg/dynamic_first.png" v-if="first" width="100%" height="100%">
  <img src="~@img/bg/dynamic_second.png" v-if="second" width="100%" height="100%">
  <img src="~@img/bg/dynamic_third.png" v-if="third" width="100%" height="100%">
  <img src="~@img/bg/dynamic_four.png" v-if="four" width="100%" height="100%">
</div>
</template>
<script>
export default {
    data () {
      return {
        first: true,
        second: false,
        third: false,
        four: false
      }
    },
    methods: {
      showImg (event) {
        let val = event.target.getAttribute('val');
        if(val == "one") {
          this.first = true
          this.second = false
          this.third = false
          this.four = false
        }else if (val == "two"){
          this.first = false
          this.second = true
          this.third = false
          this.four = false
        }else if (val == "three"){
          this.first = false
          this.second = false
          this.third = true
          this.four = false
        }else if (val == "four"){
          this.first = false
          this.second = false
          this.third = false
          this.four = true
        }
      }
    }
}
</script>
<style scoped>
.parent-bg {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.img-but {
  float: left;
}

.img-but button {
  margin-right: 20px;
  margin-bottom: 5px;
}

.choose {
  background: linear-gradient(to right, #46a6f9, #578cfe);
  box-shadow: 0 0 20px rgba(51, 146, 255, 0.4);
  color: #fff;
}
</style>


