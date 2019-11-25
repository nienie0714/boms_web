import axios from 'axios'
import router from './router.js'
import Vue from 'vue'

// const forwardURL = '/boms-web'
// const forwardURL = '/api'
const forwardURL = ''

axios.defaults.timeout = 100000
axios.defaults.baseURL = forwardURL

function request (request) {
  if (request.url != 'auth') {
    request.headers.Authorization = localStorage.getItem('token')
  }
  return request
}

function requestError (error) {
  if (error) {
    let vue = new Vue()
    vue.$msg.error({
      info: '请求失败 !',
      tip: '请检查本地网络连接 !'
    })
  }
}

function response (response) {
  if (response.data.code == -1 && response.data.msg == 'diffToken') {
    router.push({path: '/'})
    return Promise.reject(response.data.msg)
  } else {
    return response
  }
}

function responseErr (error) {
  if (axios.isCancel(error)) { // 取消请求的情况下，终端Promise调用链
    return new Promise(() => {})
  } else {
    if (error.hasOwnProperty('response')) {
      if (error.response.status != 400) {
        let vue = new Vue()
        vue.$msg.error({
          info: '请求失败 !',
          tip: '与服务器通信异常，请检查网络连接 !'
        })
      }
    } else {
      let vue = new Vue()
      vue.$msg.error({
        info: '请求失败 !',
        tip: '与服务器通信异常，请检查网络连接 !'
      })
    }
  }
}

const axiosReq = axios.create({
  baseURL: forwardURL + '/boms-web',
  headers: {
    'Content-Type': 'application/json;charset-UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'x-requested-with,content-type'
    // 'Authorization': 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ3eSIsImVtcElkIjoxMTExLCJJUCI6IjA6MDowOjA6MDowOjA6MSIsImVtcE5hbWUiOiLnjovlqpsiLCJleHAiOjE1NDczMzE5NTEsInVzZXJJZCI6ImZlMjZkYjIzNGQ4NDRiMTU4NWZjZTAwZjQ5N2RmNTE4In0._UuDoi5W1hPAQeozrk-2I_05WEPALF1LaDbDDOIyHkkbnKCISyQHqb84SDz75fG-1bY9beHESU2PulpeUn2QNQ'
  }
})
axiosReq.all = axios.all
axiosReq.spread = axios.spread
axiosReq.interceptors.request.use(request, requestError)
axiosReq.interceptors.response.use(response, responseErr)

const axiosReqj = axios.create({
  baseURL: forwardURL + '/boms-job',
  headers: {
    'Content-Type': 'application/json;charset-UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'x-requested-with,content-type'
  }
})
axiosReqj.all = axios.all
axiosReqj.spread = axios.spread
axiosReqj.interceptors.request.use(request, requestError)
axiosReqj.interceptors.response.use(response, responseErr)

export {axiosReq,axiosReqj}
