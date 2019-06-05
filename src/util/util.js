import _ from 'lodash'

export function compareNum (prop) {
  return function (obj1, obj2) {
    var val1 = obj1[prop]
    var val2 = obj2[prop]
    if (val1 < val2) {
      return -1
    } else if (val1 > val2) {
      return 1
    } else {
      return 0
    }
  }
}

// 数组排序方式
export function compareSort (sortKey, sortMeth) {
  if (sortMeth == 'asc') {
    return function (a, b) {
      var value1 = a[sortKey]
      var value2 = b[sortKey]
      return value1 - value2
    }
  } else {
    return function (a, b) {
      var value1 = a[sortKey]
      var value2 = b[sortKey]
      return value2 - value1
    }
  }
}

// 深度平铺MAP
export function flattenDeep (arr, tmpArr, pNode) {
  if (arr && !_.isEmpty(arr)) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].hasOwnProperty('children') && (arr[i].children != null) && (arr[i].children.length > 0)) {
        let obj = JSON.parse(JSON.stringify(arr[i]))
        obj.pNode = pNode || null
        delete obj.children
        tmpArr.push(obj)
        flattenDeep(arr[i].children, tmpArr, arr[i])
      } else {
        let obj = JSON.parse(JSON.stringify(arr[i]))
        obj.pNode = pNode || null
        tmpArr.push(obj)
      }
    }
  } else {
    tmpArr = []
  }
}

// 递归按顺序组装数组
export function flattenDeepSort (data, key, index, tmp) {
  var arr
  if (!tmp) {
    arr = new Array(filterDeep(data, key))
  } else {
    arr = tmp
  }
  data.forEach(row => {
    if (!arr[index]) {
      arr[index] = []
    }
    if (row.hasOwnProperty(key)) {
      if (!arr[index + 1]) {
        arr[index + 1] = []
      }
      arr[index + 1].concat(flattenDeepSort(row[key], key, index + 1, arr))
    }
    arr[index].push(row)
  })
  if (index == 0) {
    return arr
  } else {
    return arr[index]
  }
}

// 递归查询深度
export function filterDeep (arr, key) {
  let data = arr
  let floor = 0
  let max = 0
  function each (data, floor) {
    data.forEach(row => {
      row.floor = floor
      if (floor > max) {
        max = floor
      }
      if (row.hasOwnProperty(key)) {
        each(row[key], floor + 1)
      }
    })
  }
  each(data, 1)
  return max
}

// 递归按顺序组装数组
export function flattenDeepChild (arr, key) {
  let tmp = []
  arr.forEach(row => {
    if (row.hasOwnProperty(key)) {
      tmp = tmp.concat(flattenDeepChild(row[key], key))
    } else {
      tmp.push(row)
    }
  })
  return tmp
}

export function getNewObjArr (newData, oldData, keys, diffKeys) {
  let arr = []
  newData.forEach((item, index) => {
    let obj = _.find(oldData, tmp => {
      let result = true
      for (let i = 0; i < keys.length; i++) {
        if (item[keys[i]] != tmp[keys[i]]) {
          result = false
          break
        }
      }
      return result
    })
    if (obj) {
      for (let i = 0; i < keys.length; i++) {
        if (item[keys[i]] != obj[keys[i]]) {
          arr.push(index)
          break
        }
      }
    } else {
      arr.push(index)
    }
  })
  return arr
}