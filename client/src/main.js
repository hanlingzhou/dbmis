import { createApp } from 'vue'  // 引入Vue 3的createApp函数，用于创建应用实例
import ElementPlus from 'element-plus'  // 引入Element Plus UI组件库
import 'element-plus/dist/index.css'  // 引入Element Plus的CSS样式
import App from './App.vue'  // 引入根组件
import router from './router'  // 引入Vue Router路由配置
import { createPinia } from 'pinia'  // 引入Pinia状态管理库

// 创建Vue应用实例
const app = createApp(App)

// 创建Pinia状态管理实例
const pinia = createPinia()

// 注册插件
app.use(ElementPlus)  // 注册Element Plus UI库
app.use(router)       // 注册路由系统
app.use(pinia)        // 注册Pinia状态管理

// 挂载应用到DOM
app.mount('#app')  // 将应用挂载到id为'app'的DOM元素 