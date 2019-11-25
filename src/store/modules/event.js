/**
 * Created by 王冬 on 2019-09-11.
 * QQ: 20004604
 * weChat: qq20004604
 * 功能说明：
 *
 */
export default {
    state: {
        // 鼠标坐标
        mouse: {
            screenX: 0,
            screenY: 0,
            isMouseDown: false,
        },
        // 这个用于标志是否变化
        isMessViewDisplayShow: false,
        isUnread: false,
        isUnreadNum: 0,
        isUnreadList:[]
    },
    mutations: {
        mouseMove (state, e) {
            const mouseState = {
                screenX: e.screenX,
                screenY: e.screenY,
                buttons: e.buttons
            }
            state.mouse = mouseState;
        },
        messViewChange (state, isShow) {
            if (isShow!==undefined) {
                state.isMessViewDisplayShow = isShow;
            } else {
                // state.isMessViewDisplayShow = !state.isMessViewDisplayShow
                state.isMessViewDisplayShow = false;
            }
        },
        setUnread (state, isUnread) {
            state.isUnread = isUnread;
        },
        setUnreadNum (state, isUnreadNum) {
            state.isUnreadNum = isUnreadNum;
        },
        setUnreadList (state, isUnreadList) {
            state.isUnreadList = isUnreadList;
        },

    }
}
