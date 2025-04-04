<!-- 
  应用程序根组件 
  所有的路由视图将在这里渲染
-->
<template>
  <div class="app-container">
    <!-- 路由视图容器，根据当前路由显示相应组件 -->
    <router-view />
  </div>
</template>

<script setup>
// 根组件逻辑
// 使用Vue 3 Composition API中的setup语法糖
// 此组件主要作为应用容器，没有复杂的业务逻辑
</script>

<style>
/**
 * 全局CSS样式
 * 定义了整个应用的基础风格，采用类似Apple设计风格
 */

/* 重置基本样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none; /* 防止文本被选中 */
}

/* CSS变量定义，便于全局主题一致性 */
:root {
  /* 基础颜色 */
  --apple-background: #f5f7fa; /* 背景色 */
  --apple-card-bg: #ffffff;    /* 卡片背景 */
  --apple-primary: #0071e3;    /* 主色调 */
  --apple-primary-hover: #0062c3; /* 主色调悬停状态 */
  --apple-secondary: #8e8e93;  /* 次要色调 */
  --apple-text: #1d1d1f;       /* 主要文本颜色 */
  --apple-text-secondary: #86868b; /* 次要文本颜色 */
  --apple-border: #e8e8ed;     /* 边框颜色 */
  --apple-success: #34c759;    /* 成功状态颜色 */
  --apple-warning: #ff9f0a;    /* 警告状态颜色 */
  --apple-error: #ff3b30;      /* 错误状态颜色 */
  --apple-shadow: rgba(0, 0, 0, 0.04); /* 阴影颜色 */
  
  /* 图表颜色 - 用于数据可视化 */
  --apple-chart-1: #4ab8ef;
  --apple-chart-2: #54c2b7;
  --apple-chart-3: #1cb5b5;
  --apple-chart-4: #5e50db;
  --apple-chart-5: #af88df;
  --apple-chart-6: #f7ac5a;
  
  /* 渐变色 - 用于按钮和强调元素 */
  --gradient-blue: linear-gradient(135deg, #0077f7, #0095ff);
  --gradient-green: linear-gradient(135deg, #34c759, #30d158);
  --gradient-purple: linear-gradient(135deg, #5e50db, #af88df);
  --gradient-orange: linear-gradient(135deg, #ff9f0a, #ffbd59);
  
  /* 圆角大小定义 */
  --apple-radius-lg: 16px; /* 大圆角 */
  --apple-radius-md: 12px; /* 中圆角 */
  --apple-radius-sm: 8px;  /* 小圆角 */
  
  /* 过渡动画效果 */
  --transition-normal: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1); /* 标准过渡 */
  --transition-bounce: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); /* 弹性过渡 */
  
  /* 防止文本选择 */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* 动画关键帧定义 */
/* 浮动动画 - 用于卡片和其它UI元素 */
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
}

/* 脉冲动画 - 用于强调点击元素 */
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(74, 184, 239, 0.2); }
  70% { box-shadow: 0 0 0 10px rgba(74, 184, 239, 0); }
  100% { box-shadow: 0 0 0 0 rgba(74, 184, 239, 0); }
}

/* 淡入动画 - 用于元素加载 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 基础文档样式 */
body {
  /* 使用苹果系统字体，优先使用SF Pro */
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', 
    'Helvetica', 'Arial', sans-serif;
  -webkit-font-smoothing: antialiased; /* 字体平滑渲染 */
  -moz-osx-font-smoothing: grayscale;
  color: var(--apple-text);
  background-color: var(--apple-background);
  line-height: 1.5;
  font-weight: 400;
}

/* 标题样式 */
h1, h2, h3, h4, h5, h6 {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', 
    'Helvetica', 'Arial', sans-serif;
  font-weight: 500;
}

/* 应用容器 - 填充整个视口高度 */
.app-container {
  height: 100vh;
}

/* 
 * Element Plus UI库样式重写
 * 使其符合应用的设计语言
 */

/* 按钮基础样式 */
.el-button {
  border-radius: var(--apple-radius-sm) !important;
  transition: var(--transition-normal);
  height: 32px;
  padding: 0 15px;
  font-size: 14px;
}

/* 按钮悬停效果 */
.el-button:hover {
  transform: translateY(-2px); /* 上移效果增强交互感 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 主按钮样式 */
.el-button--primary {
  background: var(--gradient-blue) !important;
  border-color: var(--apple-primary) !important;
  font-weight: 500 !important;
  color: white !important;
}

/* 主按钮悬停和聚焦状态 */
.el-button--primary:hover, 
.el-button--primary:focus {
  background: var(--gradient-blue) !important;
  border-color: var(--apple-primary-hover) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 113, 227, 0.25);
}

/* 警告按钮样式 */
.el-button--warning {
  background: var(--gradient-orange) !important;
  border-color: var(--apple-warning) !important;
  color: white !important;
}

/* 警告按钮悬停和聚焦状态 */
.el-button--warning:hover,
.el-button--warning:focus {
  background: var(--gradient-orange) !important;
  border-color: var(--apple-warning) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 159, 10, 0.25);
}

/* 危险按钮样式 */
.el-button--danger {
  background: linear-gradient(135deg, #ff3b30, #ff6b58) !important;
  border-color: var(--apple-error) !important;
  color: white !important;
}

/* 危险按钮悬停和聚焦状态 */
.el-button--danger:hover,
.el-button--danger:focus {
  background: linear-gradient(135deg, #ff3b30, #ff6b58) !important;
  border-color: var(--apple-error) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 59, 48, 0.25);
}

/* 卡片组件样式 */
.el-card {
  border-radius: var(--apple-radius-md) !important;
  border: none !important;
  box-shadow: 0 1px 5px var(--apple-shadow), 0 0 1px var(--apple-shadow) !important;
  overflow: hidden;
  transition: var(--transition-normal);
}

/* 卡片悬停效果 */
.el-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px var(--apple-shadow) !important;
}

/* 菜单组件样式 */
.el-menu {
  border-right: none !important; /* 移除默认右侧边框 */
}

/* 输入框样式 */
.el-input__wrapper {
  border-radius: var(--apple-radius-sm) !important;
  box-shadow: 0 0 0 1px var(--apple-border) inset !important;
  transition: all 0.3s;
}

/* 输入框聚焦状态 */
.el-input__wrapper.is-focus {
  box-shadow: 0 0 0 2px var(--apple-primary) inset !important; /* 突出显示聚焦状态 */
}

/* 表格样式 */
.el-table {
  border-radius: var(--apple-radius-sm) !important;
  overflow: hidden;
}

/* 表格表头样式 */
.el-table th {
  background-color: var(--apple-background) !important;
  font-weight: 500 !important;
}

/* 分页组件样式 */
.el-pagination {
  justify-content: center;
  margin-top: 20px;
}

.el-tabs__item {
  font-weight: 500 !important;
}

.el-tabs__nav-wrap::after {
  height: 1px !important;
  background-color: var(--apple-border) !important;
}

.el-select__popper, 
.el-dropdown-menu {
  border-radius: var(--apple-radius-sm) !important;
  box-shadow: 0 8px 16px var(--apple-shadow) !important;
  border: none !important;
}

.el-dialog {
  border-radius: var(--apple-radius-md) !important;
  box-shadow: 0 20px 40px var(--apple-shadow) !important;
  overflow: hidden;
}

.el-dialog__header {
  padding: 24px !important;
  margin: 0 !important;
  border-bottom: 1px solid var(--apple-border);
}

.el-dialog__footer {
  padding: 16px 24px !important;
  margin: 0 !important;
  border-top: 1px solid var(--apple-border);
}

.el-form--label-top .el-form-item__label {
  padding: 0 0 8px !important;
}

/* 全局标题渐变样式 */
h1.gradient-title, 
h2.gradient-title, 
h3.gradient-title, 
h4.gradient-title,
.gradient-title,
.el-table th,
.page-title,
.section-title,
.card-title {
  background: linear-gradient(90deg, #003B8C, #0066E0, #00A1FF);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  font-weight: 600;
}

.el-table th {
  font-weight: 600 !important;
}

/* 全局统一样式 */
/* 页面容器 */
.dashboard-container,
.employees-container,
.departments-container,
.positions-container,
.system-container {
  padding: 20px;
  animation: fadeIn 0.5s ease-in-out;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

/* 卡片样式统一 */
.el-card {
  border-radius: var(--apple-radius-md);
  border: none;
  box-shadow: 0 1px 5px var(--apple-shadow), 0 0 1px var(--apple-shadow);
  transition: all 0.3s ease;
}

.el-card:hover {
  box-shadow: 0 5px 15px var(--apple-shadow), 0 0 2px var(--apple-shadow);
  transform: translateY(-2px);
}

.el-card__header {
  border-bottom: 1px solid var(--apple-border);
  padding: 15px 20px;
}

/* 表格统一样式 */
.el-table {
  border-radius: var(--apple-radius-sm);
  overflow: hidden;
}

.el-table th {
  background-color: rgba(0, 119, 247, 0.05);
  color: var(--apple-text);
}

.el-table tr {
  transition: all 0.2s ease;
}

.el-table tr:hover > td {
  background-color: rgba(0, 119, 247, 0.03);
}

/* 按钮统一样式 */
.el-button {
  border-radius: var(--apple-radius-sm);
  transition: all 0.3s ease;
}

.el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.el-button--primary {
  background: linear-gradient(90deg, #0066E0, #00A1FF);
  border: none;
}

.el-button--primary:hover {
  background: linear-gradient(90deg, #005AFF, #00A1FF);
}

/* 统一动画 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style> 