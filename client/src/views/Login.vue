<template>
  <div class="login-container">
    <div class="login-background">
      <div class="gradient-sphere gradient-sphere-1"></div>
      <div class="gradient-sphere gradient-sphere-2"></div>
      <div class="gradient-sphere gradient-sphere-3"></div>
      <svg class="grid-pattern" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255, 255, 255, 0.05)" stroke-width="0.5" />
          </pattern>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <rect width="50" height="50" fill="url(#smallGrid)" />
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
    
    <div class="login-box-wrapper">
      <div class="login-box">
        <div class="login-header">
          <div class="app-logo">
            <div class="logo-icon">
              <span class="logo-text">DB</span>
            </div>
          </div>
          <h1 class="app-title">
            <span class="gradient-text">数据库</span>管理信息系统
          </h1>
        </div>
        
        <div class="form-container">
          <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules">
            <el-form-item prop="username">
              <el-input 
                v-model="loginForm.username" 
                placeholder="用户名" 
                class="login-input"
              />
            </el-form-item>
            
            <el-form-item prop="password">
              <el-input 
                v-model="loginForm.password" 
                type="password" 
                placeholder="密码" 
                class="login-input"
                @keyup.enter="handleLogin"
              />
            </el-form-item>
            
            <el-form-item>
              <el-button 
                type="primary" 
                class="login-button" 
                :loading="loading" 
                @click="handleLogin"
              >
                登录
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        
        <div class="login-footer">
          <p class="copyright">© {{ new Date().getFullYear() }} 华博在线</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../store'

const router = useRouter()
const userStore = useUserStore()

const loginForm = reactive({
  username: '',
  password: ''
})

const loading = ref(false)

const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

const loginFormRef = ref(null)

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    await loginFormRef.value.validate()
    
    loading.value = true
    
    try {
      // 调用登录API，符合store中定义的方式
      await userStore.login({
        username: loginForm.username,
        password: loginForm.password
      })
      
      ElMessage({
        type: 'success',
        message: '登录成功',
        duration: 1500
      })
      
      // 登录成功后重定向到首页
      router.push({ path: '/' })
    } catch (error) {
      ElMessage.error(error.message || '登录失败')
    } finally {
      loading.value = false
    }
  } catch (error) {
    console.log('表单验证失败', error)
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  background-color: #f9fafb;
}

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(120deg, #f8f9fa, #f0f2f5);
  z-index: 0;
  overflow: hidden;
}

.grid-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  opacity: 0.4;
  animation: fadeIn 2s ease-in-out forwards;
}

.gradient-sphere {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0;
  z-index: 1;
}

.gradient-sphere-1 {
  background: var(--gradient-blue);
  width: 500px;
  height: 500px;
  top: -150px;
  right: -100px;
  animation: float 20s infinite alternate ease-in-out, fadeIn 2s ease-in-out forwards;
}

.gradient-sphere-2 {
  background: var(--gradient-purple);
  width: 600px;
  height: 600px;
  bottom: -200px;
  left: -150px;
  animation: float 25s infinite alternate-reverse ease-in-out, fadeIn 2.5s ease-in-out forwards;
}

.gradient-sphere-3 {
  background: var(--gradient-green);
  width: 400px;
  height: 400px;
  top: 60%;
  right: 20%;
  animation: float 18s infinite alternate ease-in-out, fadeIn 3s ease-in-out forwards;
}

.login-box-wrapper {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 480px;
  animation: slideUp 0.8s ease-out forwards;
}

.login-box {
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0, 0, 0, 0.1);
  padding: 40px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.7);
  transform: translateY(30px);
  opacity: 0;
  animation: fadeInUp 0.8s ease-out 0.3s forwards;
}

.login-box:hover {
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1), 0 0 1px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.app-logo {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.logo-icon {
  width: 60px;
  height: 60px;
  border-radius: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--gradient-blue);
  color: white;
  font-weight: bold;
  font-size: 28px;
  box-shadow: 0 8px 20px rgba(0, 120, 255, 0.25);
  position: relative;
  overflow: hidden;
  animation: pulse 2s infinite alternate ease-in-out;
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

.app-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--apple-text);
  margin: 0;
  letter-spacing: -0.5px;
  animation: fadeIn 1s ease-out;
}

.gradient-text {
  background: var(--gradient-blue);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
}

.form-container {
  margin-bottom: 30px;
  opacity: 0;
  animation: fadeIn 0.8s ease-out 0.6s forwards;
}

.login-input {
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.login-input:deep(.el-input__wrapper) {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.04);
  padding: 8px 15px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.login-input:deep(.el-input__wrapper:hover) {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
  border-color: rgba(0, 0, 0, 0.08);
}

.login-input:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.2), 0 2px 10px rgba(0, 0, 0, 0.06);
  transform: translateY(-1px);
}

.login-input:deep(.el-input__prefix) {
  margin-right: 10px;
  font-size: 18px;
  color: var(--apple-text-secondary);
}

.login-input:deep(.el-input__inner) {
  height: 42px;
  color: var(--apple-text);
  font-size: 15px;
}

.login-button {
  width: 100%;
  height: 46px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  background: var(--gradient-blue);
  border: none;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease !important;
  transform: translateY(0);
  box-shadow: 0 5px 15px rgba(0, 122, 255, 0.25);
}

.login-button::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: var(--gradient-blue);
  z-index: -1;
  filter: blur(10px);
  opacity: 0;
  transition: all 0.3s ease;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 122, 255, 0.35);
  background: linear-gradient(135deg, #007bff, #1e88e5);
}

.login-button:hover::before {
  opacity: 0.6;
}

.login-button:active {
  transform: translateY(0);
  box-shadow: 0 4px 8px rgba(0, 122, 255, 0.2);
}

.login-footer {
  text-align: center;
  opacity: 0;
  animation: fadeIn 0.8s ease-out 0.9s forwards;
}

.copyright {
  color: var(--apple-text-secondary);
  font-size: 12px;
  margin: 0;
}

.divider {
  margin: 0 8px;
  color: var(--apple-border);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes float {
  0% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-20px) translateX(10px);
  }
  100% {
    transform: translateY(0) translateX(0);
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 8px 20px rgba(0, 120, 255, 0.25);
    transform: scale(1);
  }
  100% {
    box-shadow: 0 12px 30px rgba(0, 120, 255, 0.4);
    transform: scale(1.05);
  }
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