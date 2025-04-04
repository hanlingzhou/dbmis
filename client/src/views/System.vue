<template>
  <div class="system-container">
    <div class="page-header">
      <h2>管理控制中心</h2>
    </div>

    <div class="empty-content">
      <el-empty description="暂无可用功能" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

onMounted(() => {
  // 初始化数据
})
</script>

<style scoped>
.system-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  font-size: 22px;
  font-weight: 600;
  margin: 0;
  background: linear-gradient(90deg, #003B8C, #0066E0, #00A1FF);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.empty-content {
  background-color: var(--apple-card-bg);
  border-radius: var(--apple-radius-md);
  padding: 40px;
  box-shadow: 0 1px 5px var(--apple-shadow), 0 0 1px var(--apple-shadow);
  animation: fadeIn 0.5s ease forwards;
  animation-delay: 0.2s;
  opacity: 0;
  transform: translateY(10px);
}
</style> 