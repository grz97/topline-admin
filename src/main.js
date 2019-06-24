import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import axios from 'axios'

// 优先查找文件，如果文件找不到则找目录
// 找到目录，优先加载目录中的index.js
import './styles/index.less'
// 引入进度导航条
import 'nprogress/nprogress.css'
// import Axios from 'axios';
// 配置axios的基础路径
// 也就是说配置了这个东西你就不用每次都写长长的 http://xxx
// 只需要写 例如 axios({ url: '/'})
// 路劲中的 ./ 多退少补
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'

/**
 *   Axios 请求拦截器 所有使用axios发起的请求都要先经过这里
 *  config 是本次请求相关的配置对象
 * return config 就是允许通过的方式
 *  */
axios.interceptors.request.use(config => {
  const userInfo = JSON.parse(window.localStorage.getItem('user_info'))
  config.headers.Authorization = `Bearer ${userInfo.token}`
  return config
}, error => {
  return Promise.reject(error)
})

/**
 * Axios 响应拦截器
 */
axios.interceptors.response.use(response => {
  return response
}, error => {
  return Promise.reject(error);
});

// 几乎每个组件都要使用axios 去发请求 频繁的 import 就变得非常麻烦
//  我们可以将一些频繁使用的成员放到Vue.prototype 中 然后就可以在 组件中 this.xxx使用了
//  为什么 ？ 因为所有组件都是Vue的实例
// 所以往 Vue.prototype 中添加的成员可以直接通过组建实例 this进行访问
// 往Vue原型对象中添加成员，尽量使用$名字 起名字，目的是为了防止和组件中的成员冲突
Vue.prototype.$http = axios
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
