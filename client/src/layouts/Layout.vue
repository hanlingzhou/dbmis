<template>
  <div class="layout-container">
    <!-- 侧边栏 -->
    <div class="sidebar">
      <div class="sidebar-header">
        <div class="logo-container">
          <div class="app-logo">
            <div class="logo-icon">
              <span class="logo-text">DB</span>
            </div>
          </div>
          <h1 class="app-name">
            <span class="gradient-text">华博在线</span>
          </h1>
        </div>
      </div>
      
      <!-- 菜单区域 -->
      <div class="sidebar-menu-container">
        <el-scrollbar>
          <el-menu
            class="sidebar-menu"
            :default-active="activeMenu"
            :unique-opened="true"
            @select="navigateTo"
          >
            <el-menu-item index="/dashboard" class="menu-item">
              <span class="menu-title">数据可视化展示</span>
            </el-menu-item>
            <el-menu-item index="/business" class="menu-item">
              <span class="menu-title">业务信息</span>
            </el-menu-item>
            <el-menu-item index="/system" class="menu-item">
              <span class="menu-title">管理控制中心</span>
            </el-menu-item>
          </el-menu>
        </el-scrollbar>
      </div>
    </div>
    
    <!-- 主内容区 -->
    <div class="main-content">
      <div class="header">
        <div class="header-left">
          <div class="breadcrumb">
            <h2>{{ currentPageTitle }}</h2>
          </div>
        </div>
        <div class="header-right">
          <div class="user-info">
            <div class="user-avatar">
              {{ userStore.user.name ? userStore.user.name.charAt(0) : 'U' }}
            </div>
            <div class="user-name">{{ userStore.user.name || '用户' }}</div>
            <div class="user-role">{{ userStore.user.department || '未分配部门' }}</div>
          </div>
          <button class="logout-btn" @click="handleLogout">
            <i class="el-icon-switch-button"></i>
            <span>退出</span>
          </button>
        </div>
      </div>
      
      <div class="content">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../store'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 当前激活的菜单
const activeMenu = ref(route.path)
// 当前页面标题
const currentPageTitle = computed(() => route.meta.title || '')

// 监听路由变化
watch(
  () => route.path,
  (val) => {
    activeMenu.value = val
  }
)

// 菜单选择处理
const navigateTo = (path) => {
  if (route.path === path) {
    // 如果点击当前页面，则刷新页面内容
    window.location.reload()
  } else {
    // 跳转到新页面
    router.push(path)
  }
}

// 退出登录
const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}

// 添加淡入淡出动画
onMounted(() => {
  const animateItems = () => {
    const menuItems = document.querySelectorAll('.sidebar-menu .el-menu-item, .sidebar-menu .el-sub-menu')
    menuItems.forEach((item, index) => {
      item.style.opacity = '0'
      item.style.transform = 'translateX(-10px)'
      setTimeout(() => {
        item.style.transition = 'all 0.3s ease'
        item.style.opacity = '1'
        item.style.transform = 'translateX(0)'
      }, 100 + index * 50)
    })
  }
  
  animateItems()
})
</script>

<style scoped>
.layout-container {
  height: 100vh;
  display: flex;
  overflow: hidden;
}

.sidebar {
  width: 260px;
  height: 100%;
  background-color: var(--apple-card-bg);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 10;
  overflow: hidden;
  border-right: 1px solid var(--apple-border);
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  height: 70px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--apple-border);
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}

.logo-container {
  display: flex;
  align-items: center;
  overflow: hidden;
}

.app-logo {
  display: flex;
  align-items: center;
}

.logo-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--gradient-blue);
  color: white;
  font-weight: bold;
  font-size: 16px;
  box-shadow: 0 4px 10px rgba(0, 120, 255, 0.2);
  position: relative;
  overflow: hidden;
  transform: translateZ(0);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.logo-icon:hover {
  transform: scale(1.08) translateZ(0);
  box-shadow: 0 6px 16px rgba(0, 120, 255, 0.3);
}

.logo-icon:after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: rotate(45deg);
  animation: shine 3s infinite;
}

.logo-text {
  position: relative;
  z-index: 1;
}

.app-name {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 0 12px;
  white-space: nowrap;
  color: var(--apple-text);
}

.gradient-text {
  background: var(--gradient-blue);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.sidebar-menu-container {
  flex: 1;
  overflow: hidden;
}

.sidebar-menu-container :deep(.el-scrollbar__wrap) {
  overflow-x: hidden;
}

.sidebar-menu {
  border-right: none !important;
  background-color: transparent;
  flex: 1;
}

.el-menu-item, .el-sub-menu__title {
  height: 50px;
  line-height: 50px;
  font-size: 15px;
  font-weight: 500;
  transition: var(--transition-normal);
}

.menu-item {
  margin: 6px 10px;
  border-radius: var(--apple-radius-sm);
  transition: all 0.3s ease;
}

.menu-title {
  transition: var(--transition-normal);
  letter-spacing: 0.5px;
}

.el-menu-item.is-active {
  background: rgba(0, 113, 227, 0.08) !important;
  color: var(--apple-primary) !important;
  font-weight: 600;
}

.el-menu-item:hover {
  background-color: rgba(0, 119, 237, 0.08) !important;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--apple-background);
}

.header {
  height: 60px;
  background-color: var(--apple-card-bg);
  border-bottom: 1px solid var(--apple-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 1px 3px var(--apple-shadow);
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 20px;
  background-color: rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
}

.user-info:hover {
  background-color: rgba(0, 0, 0, 0.06);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--gradient-blue);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  margin-right: 10px;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--apple-text);
}

.user-role {
  font-size: 12px;
  color: var(--apple-text-secondary);
  margin-left: 6px;
}

.logout-btn {
  margin-left: 10px;
  padding: 6px 12px;
  border-radius: 20px;
  background-color: rgba(255, 59, 48, 0.08);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: var(--apple-error);
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background-color: rgba(255, 59, 48, 0.15);
  transform: translateY(-1px);
}

.logout-btn span {
  margin-left: 5px;
}

.breadcrumb h2 {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.3px;
  background: linear-gradient(90deg, #003B8C, #0066E0, #00A1FF);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.content {
  flex: 1;
  overflow: auto;
  padding: 24px;
}

/* Animations */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.5s cubic-bezier(0.7, 0, 0.3, 1);
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

@keyframes shine {
  0% {
    transform: translateX(-150%) translateY(-150%) rotate(45deg);
  }
  100% {
    transform: translateX(150%) translateY(150%) rotate(45deg);
  }
}
</style> 