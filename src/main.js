import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import axios from 'axios'
// 处理js大数字
import JSONbig from 'json-bigint'

// 优先查找文件，如果文件找不到则找目录
// 找到目录，优先加载目录中的index.js
import './styles/index.less'
// 引入进度导航条
import 'nprogress/nprogress.css'

// 几乎每个组件都要使用axios 去发请求 频繁的 import 就变得非常麻烦
//  我们可以将一些频繁使用的成员放到Vue.prototype 中 然后就可以在 组件中 this.xxx使用了
//  为什么 ？ 因为所有组件都是Vue的实例
// 所以往 Vue.prototype 中添加的成员可以直接通过组建实例 this进行访问
// 往Vue原型对象中添加成员，尽量使用$名字 起名字，目的是为了防止和组件中的成员冲突
Vue.prototype.$http = axios
Vue.use(ElementUI)
Vue.config.productionTip = false
// import Axios from 'axios';
// 配置axios的基础路径
// 也就是说配置了这个东西你就不用每次都写长长的 http://xxx
// 只需要写 例如 axios({ url: '/'})
// 路劲中的 ./ 多退少补
axios.defaults.baseURL = 'http://toutiao.course.itcast.cn/mp/v1_0/'
// 使用JSONbig 处理返回住居中超出js安全整数范围的数字
// JSONbig自己会分析数据中的哪个数字超出整数范围了
 //  由于后端的数据id超出了js安全正数范围 所以导致正数无法精确表示
  // 可以使用JSON-biginit 它会帮你把超出范围的数字给处理好
axios.defaults.transformResponse = [function(data) {
  // JSONbig.parse类似于JSON.parse，它的作用是将JSON格式字符串转换为javascript对象
  // 唯一的区别就是：JSONbig.parse会检测被转发数据是否超出js安全整数范围
  // 如果data 不是一个JSON 格式字符串，会导致JSONbig.parse转换失败并异常
  // 例如我们执行删除操作，后端会返回一个204状态码，但是没有返回任何数据，也就是空字符串
  // 那这里JSONbig.parse(空) 空字符串 就报错了
  // data是未经处理的后端响应数据：JSON 字符串
    // data数据可能不是标准的JSON格式字符串，否则会导致JSONbig.parse(data)转换失败报错
    return JSONbig.parse(data)
}]
/**
 *   Axios 请求拦截器 所有使用axios发起的请求都要先经过这里
 *  config 是本次请求相关的配置对象
 * return config 就是允许通过的方式
 *  */
axios.interceptors.request.use(config => {
  const userInfo = JSON.parse(window.localStorage.getItem('user_info'))
  // console.log(userInfo)
  if (userInfo) {
    // 如果登录了，才给那些需要 token 的接口统一添加token令牌
    // 登录相关接口不需要添加 token令牌 因为 token 令牌是通过登录获取的
    config.headers.Authorization = `Bearer ${userInfo.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

// /**
//  * Axios 响应拦截器
//  */ 统一处理响应的数据格式

axios.interceptors.response.use(response => { // >= 200或者 < 400 的状态码进入这里
  // 如果返回的数据格式是对象‘
  if (typeof response.data === 'object' && response.data.data) {
    return response.data.data
  } else {
    return response.data
  }
}, error => { // >= 400 的状态码会进入这里
  const status = error.response.status
  if (status === 401) {
    // 如果状态码为401 那么就需要删除本地存储中的用户信息，因为此时的token已经无效，
    // 删除完用户信息之后 需要跳转到登录页面 重新登录
    // 删除本地存储中的用户信息数据user_info
    window.localStorage.removeItem('user_info')
    // router.push({
    //   name: 'login'
    // })
  }
  return Promise.reject(error);
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
