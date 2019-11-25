<template>
    <div class="body-none">
        <div class="body-none-title">
            <h3>功能描述：</h3>
            <p v-html="desc"></p>
        </div>
        
    </div>
</template>
<script>
export default {
    props: ['desc']
    
}
</script>
<style scoped lang="scss"> 
    .body-none {
        position: absolute;
        width: 100%;
        height: 100%;
        top:50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: url(~@img/bg/bg_blank.png) center center no-repeat;
        // /* background-size: 600px 300px; */
        // .body-none-img {
        //     position: absolute;
        //     width: 660px;
        //     height: 390px;
        //     top:50%;
        //     left: 50%;
        //     transform: translate(-50%, -50%);
        //     background: url(~@img/bg/bg_blank.png) center center no-repeat;
        // }
        .body-none-title {
            text-align: left;
            h3 {
                font-size: 16px;
                line-height: 30px;
            }
            p {
                font-size: 14px;
                line-height: 20px;
            }
        }
    }
</style>


