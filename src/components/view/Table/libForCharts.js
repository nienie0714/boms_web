/**
 * Created by 王冬 on 2019/10/8.
 * QQ: 20004604
 * weChat: qq20004604
 * 功能说明：
 *
 */


// TAB区域的部门、班组（不一定有）、个人。天、周、月、年
// 前面的 key 是固定的，后面根据异步请求的字段来
const CLASSIFICATIONKEYS = {
    'TABLE': 'table', // 部门
    'CHARTS': 'chart',      // 班组
    'PERSONAL': 'personal',     // 个人
    'DAY': 'day',    // 天
    'WEEK': 'week',  // 周
    'MONTH': 'month',   // 月
    'YEAR': 'year'      // 年
}
// 中文名，很多地方要用
const CLASSIFICATION = {
    [CLASSIFICATIONKEYS.TABLE]: '统计表单',
    [CLASSIFICATIONKEYS.CHARTS]: '统计图表',
    [CLASSIFICATIONKEYS.PERSONAL]: '个人',
    [CLASSIFICATIONKEYS.DAY]: '天',
    [CLASSIFICATIONKEYS.WEEK]: '周',
    [CLASSIFICATIONKEYS.MONTH]: '月',
    [CLASSIFICATIONKEYS.YEAR]: '年',
}

const getXAxisData = function (type, dataLength = 0) {
    let data = [];
    // 天，返回 1~24 的数组，表示 24 个小时
    if (type === 'day') {
        for (let i = 1; i < 24 + 1; i++) {
            data.push(i)
        }
    } else if (type === 'week') {
        return ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
    } else if (type === 'month') {
        // 月的话，需要考虑是 28？29？30？31 天？
        // 具体天数从参数二取，其值取返回数据的长度（return 时处理）
        for (let i = 1; i < 31 + 1; i++) {
            data.push(i)
        }
    } else if (type === 'year') {
        for (let i = 1; i < 13; i++) {
            data.push(i)
        }
    } else {
        return []
    }
    // 由于数据可能不足，因此根据数据的长度截取实际的 x 坐标的长度
    return data.slice(0, dataLength);
}

// 获取标题
const getTitleText = function (type) {
    const Text = {
        'day': '天',
        'week': '周',
        'month': '月',
        'year': '年'
    }
    return `按${Text[type]}统计`;
}

// 获取指定列数据（即从一行数据里，只取出指定 key 的数据）
const getColumnData = function (tableData, col) {
    const result = tableData.map(item => {
        return item[col]
    })
    return result
}

export {
    CLASSIFICATIONKEYS,
    CLASSIFICATION,
    getXAxisData,
    getTitleText,
    getColumnData
}
