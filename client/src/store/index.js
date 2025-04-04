import { defineStore } from 'pinia'  // 引入Pinia的defineStore函数

/**
 * 用户状态管理存储
 * 
 * 使用Pinia管理用户认证状态，包括令牌、用户信息等
 * 提供登录、注销和权限检查等功能
 */
export const useUserStore = defineStore('user', {
  /**
   * 状态定义
   * 初始化从localStorage加载持久化的用户数据
   */
  state: () => ({
    token: localStorage.getItem('token') || '',  // JWT令牌，持久化存储
    user: JSON.parse(localStorage.getItem('user') || '{}')  // 用户信息对象，持久化存储
  }),
  
  /**
   * 操作方法
   * 处理用户认证相关的异步操作和状态修改
   */
  actions: {
    /**
     * 用户登录
     * 
     * 验证用户凭据并设置令牌和用户信息
     * 注意：当前为模拟实现，实际应用中应调用后端API
     * 
     * @param {Object} credentials - 包含用户名和密码的对象
     * @returns {Promise<Object>} 登录成功返回用户数据，失败抛出错误
     */
    async login(credentials) {
      try {
        // 模拟登录验证 - 在实际应用中应替换为API调用
        if (credentials.username === 'admin' && credentials.password === 'admin') {
          // 创建模拟的登录响应数据
          const fakeData = {
            token: 'fake_jwt_token_' + Math.random().toString(36).substring(2),  // 生成随机令牌
            user: {
              id: 1,
              username: 'admin',
              name: 'Admin',
              role: 'admin',  // 用户角色，用于权限控制
              department: '管理部',
              email: 'admin@example.com',
              lastLogin: new Date().toISOString(),
              status: 'active'  // 账号状态
            }
          };
          
          // 更新状态
          this.token = fakeData.token;
          this.user = fakeData.user;
          
          // 持久化存储到localStorage
          localStorage.setItem('token', fakeData.token);
          localStorage.setItem('user', JSON.stringify(fakeData.user));
          
          return fakeData;  // 返回用户数据
        } else {
          // 验证失败
          throw new Error('用户名或密码错误');
        }
      } catch (error) {
        // 重新抛出错误，便于调用方处理
        throw error
      }
    },
    
    /**
     * 用户注销
     * 
     * 清除用户状态和本地存储的认证数据
     */
    logout() {
      // 清除状态
      this.token = ''
      this.user = {}
      
      // 清除localStorage中的持久化数据
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    
    /**
     * 检查用户认证状态
     * 
     * 验证当前用户是否已登录且令牌有效
     * 注意：当前为模拟实现，实际应用中应验证令牌有效性
     * 
     * @returns {Promise<boolean>} 认证有效返回true，否则返回false
     */
    async checkAuth() {
      if (!this.token) return false  // 无令牌则直接返回未认证
      
      // 模拟令牌验证过程
      // 在实际应用中，应调用后端API验证令牌有效性
      return true
    }
  },
  
  /**
   * 计算属性
   * 基于状态派生的只读属性
   */
  getters: {
    /**
     * 是否已认证
     * @returns {boolean} 用户是否已登录
     */
    isAuthenticated: (state) => !!state.token,
    
    /**
     * 用户角色
     * @returns {string} 当前用户角色，未登录则为'guest'
     */
    userRole: (state) => state.user.role || 'guest'
  }
}) 