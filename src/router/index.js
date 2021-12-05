import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'


Vue.use(VueRouter)

// 导入login
const login = () => import('@/views/login')
const layout = () => import('@/views/layout')
const home = () => import('@/views/home')
const ask = () => import('@/views/ask')
const video = () => import('@/views/video')
const mine = () => import('@/views/mine')
const edit = () => import('@/views/mine/edit')
const article = () => import('@/views/article')
const search = () => import('@/views/search')
const result = () => import('@/views/search/result')
const chat = () => import('@/views/mine/chat')

const routes = [
  { path: '', redirect: '/layout/home' },
  { name: 'login', path: '/login', component: login },
  { name: 'article', path: '/article', component: article },
  { name: 'search', path: '/search', component: search },
  { name: 'result', path: '/search/result', component: result, meta: { needKeep: true } },
  { name: 'chat', path: '/mine/chat', component: chat },
  { name: 'edit', path: '/mine/edit', component: edit, meta: { needLogin: true } },
  {
    name: 'layout',
    path: '/layout',
    component: layout,
    children: [
      { name: 'home', path: 'home', component: home, meta: { needKeep: true } },
      { name: 'ask', path: 'ask', component: ask },
      { name: 'video', path: 'video', component: video },
      {
        name: 'mine',
        path: 'mine',
        component: mine,
        meta: {
          // 标记这个路由为需要登录的路由
          needLogin: true
        }
      }
    ]
  },
]

const router = new VueRouter({
  routes
})

// 前置钩子
// to：去哪的路由信息
// from：从哪来
// next：放行，调用就代表放行
router.beforeEach((to, from, next) => {

  // 先判断你去的地方是不是一个需要登录的页面，如果是，才判断有没有登录
  // 如果不是需要登录的页面,就直接放行
  if (to.meta.needLogin) {

    // 有token代表登录了，没token代表没登录
    if (store.state.tokenObj.token) {
      next()
    } else {

      // 弹出消息：请先登录
      Vue.prototype.$toast.fail('请先登录')
      // 没登录打回登录页，并且记录登录成功后该回的页面
      next({
        name: 'login',
        query: {
          // to.path就是我本来想去的页面，但是没去成，打回登录页了
          back: to.path
        }
      })
    }

  } else {
    // 不需要登录的页面直接放行
    next()
  }
})


// 防止vue-router给我们的警告，加如下代码即可
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

export default router
