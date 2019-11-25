<template>
    <!-- 排班管理 -->
    <div class="task-query">
        <!-- <div id="msg-icon-box" @click="setMessViewDisplay">
            <img src="~@img/flow/notice.png" class="msg-icon">
            <div class="red-dotted" v-if="$store.state.event.isUnread"></div>
        </div> -->
        <router-view></router-view>
        <!-- <MessView></MessView> -->
    </div>
</template>
<script>
    // import MessView from '../home/common/MessView'

    export default {
        mounted () {
            // this.$store.commit('messViewChange', true);
        },
        components: {
            // MessView
        },
        data () {
            return {}
        },
        methods: {
            setMessViewDisplay () {
                // this.$store.commit('messViewChange');
            }
        }
    }
</script>
<style scoped lang="scss">
    .task-query {
        height: calc(100% - 60px);
    }

    #msg-icon-box {
        position: absolute;
        right: 20px;
        top: 5px;
        width: 38px;
        height: 38px;
        background: linear-gradient(-90deg, rgba(105, 107, 255, 0.4), rgba(80, 185, 240, 0.4)) #3392FF;
        box-shadow: 0px 5px 15px 0px rgba(63, 153, 255, 0.3);
        border-radius: 19px;
        cursor: pointer;

        .msg-icon {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        .red-dotted {
            position: absolute;
            top: 1px;
            right: 1px;
            width: 8px;
            height: 8px;
            background: rgba(247, 84, 103, 1);
            border-radius: 50%;
        }
    }
</style>


