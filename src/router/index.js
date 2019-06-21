import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [{
    name: 'home',
    // 路由的名字和组件名没关系，是path的别名
    // 跳转的时候可以直接$router.push({name:'xxx'})
    // 给路由起名字是好的做法
    // @表示src目录，无论当前文件在哪里，@都是src
    path: '/',
    component: () => import('@/views/home')
  },
  {
    name: 'login',
    path: '/login',
    component: () => import('@/views/login')
  }
  ]
})
