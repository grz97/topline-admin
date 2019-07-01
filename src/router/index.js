import Vue from 'vue'
import Router from 'vue-router'
import nprogress from 'nprogress'
Vue.use(Router)

const router = new Router({
  routes: [{
      // name: 'home',
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
    },
    {
      // name: 'layout',
      path: '/',
      component: () => import('@/views/layout'),
      children: [ // 所有 children子路由都显示到父路由的router-view中
        {
          name: 'article-comment', // 评论组件
          path: '/comment',
          component: () => import('@/views/comment')
        },
        {
          name: 'home',
          path: '', // 它就是layout 的默认子路由
          component: () => import('@/views/home')
        },
        {
          name: 'publish', // 发布文章
          path: '/publish',
          component: () => import('@/views/publish')
        },
        {
          name: 'publish-edit', // 编辑文章
          path: '/publish/:id',
          component: () => import('@/views/publish')
        },
        {
          name: 'article-list',
          path: '/article',
          component: () => import('@/views/article')
        },
        {
          name: 'account-setting', // 账户设置
          path: '/account',
          component: () => import('@/views/account')
        },
        {
          name: 'image', // 素材管理
          path: '/image',
          component: () => import('@/views/image')
        },
        {
          name: 'fans', // 粉丝
          path: '/fans',
          component: () => import('@/views/fans')
        }
      ]
    }
  ]
})
// 路由拦截器
// 所有路由导航都要经过这里
// to 去哪儿  from 来自哪里  next 允许通过的方法
router.beforeEach((to, from, next) => {
  // 进度导航条
  nprogress.start()
  const userInfo = window.localStorage.getItem('user_info')
  // 如果是非登录页面 /login ，判断其 登录状态
  if (to.path !== '/login') {
    // 如果没有登录，让它跳转到登陆页
    if (!userInfo) {
      return next({
        name: 'login'
      })
    } else {
      next() // 如果登录了 则允许通过
    }
  } else {
    // 如果登录了，就不允许访问登录页了
    if (userInfo) {
      next(false)
    } else {
      // 没有登录 才允许访问登录页
      next()
    }
  }
})
// 路由导航完成的时候会进入这里
router.afterEach((to, from) => {
  nprogress.done()
})
export default router
