const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * 用户登录接口
 * 
 * 验证用户名和密码，如果验证通过则颁发JWT令牌
 * POST /api/auth/login
 * 
 * @body {string} username - 用户名
 * @body {string} password - 密码（明文）
 * @returns {object} 成功返回用户信息和JWT令牌，失败返回错误信息
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 验证请求参数，确保用户名和密码都已提供
    if (!username || !password) {
      return res.status(400).json({
        status: 'error',
        message: '请提供用户名和密码'
      });
    }
    
    // 根据用户名查找用户
    const user = await User.findByUsername(username);
    
    // 如果用户不存在，返回401错误
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: '用户名或密码错误'  // 出于安全考虑，不明确指出是用户名还是密码错误
      });
    }
    
    // 使用bcrypt比较提供的密码和存储的哈希密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    // 如果密码不匹配，返回401错误
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: '用户名或密码错误'
      });
    }
    
    // 验证用户账号状态，确保只有活跃账号可以登录
    if (user.status !== 'active') {
      return res.status(403).json({
        status: 'error',
        message: '账号已被禁用'
      });
    }
    
    // 生成JWT令牌，包含用户ID、用户名和角色等信息
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username,
        role: user.role 
      },
      process.env.JWT_SECRET,  // 使用环境变量中的密钥
      { expiresIn: process.env.JWT_EXPIRES_IN }  // 设置令牌有效期
    );
    
    // 更新用户的最后登录时间
    await User.updateLastLogin(user.id);
    
    // 从用户对象中移除密码字段，避免密码泄露
    const { password: _, ...userWithoutPassword } = user;
    
    // 添加调试日志
    console.log('登录成功:', { username: user.username, role: user.role });
    
    // 返回成功响应，包含令牌和用户信息
    res.json({
      status: 'success',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    // 处理异常情况，记录错误并返回500状态码
    console.error('登录失败:', error);
    res.status(500).json({
      status: 'error',
      message: '服务器错误'
    });
  }
});

/**
 * 获取当前用户信息接口
 * 
 * 返回已认证用户的详细信息
 * GET /api/auth/me
 * 
 * 需要JWT认证，通过Authorization请求头传递令牌
 * @returns {object} 成功返回用户详细信息，失败返回错误信息
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    // 通过用户ID查找用户详细信息
    const user = await User.findById(req.user.id);
    
    // 如果用户不存在，返回404错误
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: '用户不存在'
      });
    }
    
    // 返回用户信息
    res.json({
      status: 'success',
      data: user
    });
  } catch (error) {
    // 处理异常情况
    console.error('获取用户信息失败:', error);
    res.status(500).json({
      status: 'error',
      message: '服务器错误'
    });
  }
});

/**
 * 修改密码接口
 * 
 * 允许已认证用户修改自己的密码
 * POST /api/auth/change-password
 * 
 * 需要JWT认证，通过Authorization请求头传递令牌
 * @body {string} oldPassword - 旧密码
 * @body {string} newPassword - 新密码
 * @returns {object} 成功返回成功消息，失败返回错误信息
 */
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    // 验证请求参数
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        status: 'error',
        message: '请提供旧密码和新密码'
      });
    }
    
    // 获取完整的用户信息（包含密码哈希）
    const user = await User.findByUsername(req.user.username);
    
    // 如果用户不存在，返回404错误
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: '用户不存在'
      });
    }
    
    // 验证旧密码是否正确
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    
    // 如果旧密码不正确，返回401错误
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: '旧密码错误'
      });
    }
    
    // 调用用户模型中的方法更新密码
    await User.changePassword(user.id, newPassword);
    
    // 返回成功响应
    res.json({
      status: 'success',
      message: '密码修改成功'
    });
  } catch (error) {
    // 处理异常情况
    console.error('修改密码失败:', error);
    res.status(500).json({
      status: 'error',
      message: '服务器错误'
    });
  }
});

module.exports = router; 