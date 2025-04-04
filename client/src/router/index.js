import { createRouter, createWebHistory } from 'vue-router'  // 引入Vue Router相关函数

/**
 * 路由配置数组
 * 定义应用的所有路由路径及其对应的组件
 */
const routes = [
  {
    path: '/',  // 根路径
    component: () => import('../layouts/Layout.vue'),  // 主布局组件，使用动态导入实现代码分割
    redirect: '/dashboard',  // 重定向到仪表盘页面
    meta: { requiresAuth: true },  // 元数据：需要身份验证
    children: [  // 嵌套路由，这些路由将在Layout组件内的router-view中渲染
      {
        path: 'dashboard',  // 路径：/dashboard
        name: 'Dashboard',  // 路由名称
        component: () => import('../views/Dashboard.vue'),  // 仪表盘组件
        meta: { title: '数据可视化展示', requiresAuth: true }  // 页面标题和权限要求
      },
      {
        path: 'business',  // 路径：/business
        name: 'Business',  // 路由名称
        component: () => import('../views/Business.vue'),  // 业务信息组件
        meta: { title: '业务信息', requiresAuth: true }  // 页面标题和权限要求
      },
      {
        path: 'system',  // 路径：/system
        name: 'System',  // 路由名称
        component: () => import('../views/System.vue'),  // 系统管理组件
        meta: { title: '管理控制中心', requiresAuth: true }  // 页面标题和权限要求
      }
    ]
  },
  {
    path: '/login',  // 登录页路径
    name: 'Login',  // 路由名称
    component: () => import('../views/Login.vue'),  // 登录页组件
    meta: { title: '登录' }  // 页面标题，不需要身份验证
  },
  {
    path: '/:pathMatch(.*)*',  // 通配符路径，匹配所有未定义路由
    name: 'NotFound',  // 路由名称
    component: () => import('../views/NotFound.vue'),  // 404页面组件
    meta: { title: '404' }  // 页面标题
  }
]

/**
 * 创建路由实例
 * 使用HTML5 History模式，可以使用正常的URL格式而非hash模式(#)
 */
const router = createRouter({
  history: createWebHistory(),  // 使用HTML5 History模式
  routes  // 应用路由配置
})

/**
 * 全局前置守卫
 * 在路由跳转前执行，用于权限控制和页面标题设置
 * 
 * @param {Object} to - 目标路由对象
 * @param {Object} from - 来源路由对象
 * @param {Function} next - 跳转函数，控制路由流程
 */
router.beforeEach((to, from, next) => {
  // 设置页面标题，使用路由元数据中的title属性
  document.title = to.meta.title ? `${to.meta.title} - 数据库管理信息系统` : '数据库管理信息系统'
  
  // 从本地存储中获取令牌，判断用户是否已登录
  const token = localStorage.getItem('token')
  
  // 检查目标路由是否需要身份验证
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 路由需要登录访问
    if (!token) {
      // 未登录状态，重定向到登录页
      next({ 
        path: '/login',
        query: { redirect: to.fullPath }  // 保存原目标路由，便于登录后跳转
      })
    } else {
      // 已登录状态，允许访问
      next()
    }
  } else {
    // 路由不需要登录访问
    if (to.path === '/login' && token) {
      // 已登录用户访问登录页，重定向到仪表盘页面
      next({ path: '/dashboard' })
    } else {
      // 其他情况，允许访问
      next()
    }
  }
})

export default router  // 导出路由实例 