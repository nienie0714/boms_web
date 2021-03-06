import Vue from 'vue'

var vue = new Vue({})

export function queryPageDataList (url, data) {
  return vue.axios({
    url: url,
    method: 'post',
    data: {
      pageNum: data.pageNum,
      pageSize: data.pageSize,
      data: data.data
    }
  })
}

export function getQueryAll (url, data) {
  return vue.axios({
    url: url,
    method: 'get',
    data: data
  })
}

export function postDataEndPage (urls, datas) {
  var arr = []
  urls.forEach((url, index) => {
    if (index == urls.length - 1) {
      arr.push(queryPageDataList(url, datas[index]))
    } else {
      arr.push(postData(url, datas[index]))
    }
  })
  return vue.axios.all(arr)
}

export function postAllData (urls, datas) {
  var arr = []
  urls.forEach((url, index) => {
    arr.push(postData(url, datas[index]))
  })
  return vue.axios.all(arr)
}

export function postData (url, data) {
  return vue.axios({
    url: url,
    method: 'post',
    data: data
  })
}

export function download (url, data, pageSize) {
  return vue.axios({
    url: url,
    method: 'post',
    responseType: 'blob',
    data: pageSize ? {
      data: data,
      pageSize: pageSize,
      pageNum: 1
    } : data
  })
}

export function downloadFile (url) {
  return vue.axios({
    url: url,
    method: 'get',
    responseType: 'blob'
  })
}

export function queryClassifyType () {
  postData('basicdata/classifyCode/queryAllClassify', null).then(response => {
    return response.data.data
  })
}

export function queryAllClassify () {
  postData('basicdata/classifyCode/queryAll', {}).then(response => {
    return response.data.data
  })
}

export function insert (url, data) {
  return vue.axios({
    url: url,
    method: 'post',
    data: data
  })
}

export function update (url, data) {
  return vue.axios({
    url: url,
    method: 'put',
    data: data
  })
}

export function remove (url, data) {
  return vue.axios({
    url: url,
    method: 'delete',
    data: data
  })
}

export function queryAll (url, data) {
  if (!data) {
    data = {}
  }
  return vue.axios({
    url: url,
    method: 'post',
    data: data
  })
}

export function queryAllGet (url) {
  return vue.axios({
    url: url,
    method: 'get'
  })
}

export function query (url, data) {
  return vue.axios({
    url: url,
    method: 'post',
    data: {
      pageNum: -1,
      pageSize: 0,
      data: data
    }
  })
}

export function pageQuery (url, data, pageData) {
  return vue.axios({
    url: url,
    method: 'post',
    data: {
      pageNum: pageData.num,
      pageSize: pageData.size,
      data: data
    }
  })
}

export function nopageQuery (url, data) {
  return vue.axios({
    url: url,
    method: 'post',
    data: data
  })
}



// 针对定时任务模块的接口
export function nopageQueryj (url, data) {
  return vue.axiosj({
    url: url,
    method: 'post',
    data: data
  })
}

export function queryAllj (url, data) {
  if (!data) {
    data = {}
  }
  return vue.axiosj({
    url: url,
    method: 'post',
    data: data
  })
}
