import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
Vue.config.productionTip = false


// 导入公共样式
import '@/styles/base.less'

// 导入vant的注册文件
import '@/utils/vant'

// 导入flexible
import 'amfe-flexible'

// 导入moment
import moment from 'moment'
moment.locale('zh-cn')

// 全局过滤器
Vue.filter('relvTime', (val) => {

  return moment(val).fromNow()
})



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
