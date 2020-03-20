import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入第三方插件树形表单
import TreeTable from 'vue-table-with-tree-grid'

// 富文本插件
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 导入nprogress包对应的js和css
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

// 导入数据请求包
import axios from 'axios'
// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 在request 拦截器中，显示进度条 Nprogress.start()
axios.interceptors.request.use(config => {
  Nprogress.start()
  // 请求拦截器，当客服端发送请求时，优先调用这个函数
  // 预处理
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

// 在 response 拦截器中，隐藏进度条 Nprogress.done()
axios.interceptors.response.use(config => {
  Nprogress.done()
  return config
})
Vue.prototype.axios = axios
Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

Vue.use(VueQuillEditor)

// 定义格式化时间
Vue.filter('dateFormat', function (originDate) {
  const date = new Date(originDate)
  const year = date.getFullYear()
  const month = (date.getMonth() + '').padStart(2, '0')
  const day = (date.getDay() + '').padStart(2, '0')
  const hour = (date.getHours() + '').padStart(2, '0')
  const mintues = (date.getMinutes() + '').padStart(2, '0')
  const second = (date.getMilliseconds() + '').padStart(2, '0')

  return `${year}-${month}-${day} ${hour}:${mintues}:${second}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
