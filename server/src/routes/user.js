const express = require('express');
const User = require('../models/user');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// 中间件：检查管理员权限
const checkAdminRole = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      status: 'error',
      message: '需要管理员权限'
    });
  }
  next();
};

// 中间件：验证用户ID参数
const validateUserId = (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({
      status: 'error',
      message: '无效的用户ID'
    });
  }
  req.userId = id;
  next();
};

// 获取所有用户 (仅管理员)
router.get('/', authenticateToken, checkAdminRole, async (req, res) => {
  try {
    const users = await User.findAll();
    
    // 移除密码字段
    const usersWithoutPassword = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.json({
      status: 'success',
      data: usersWithoutPassword
    });
  } catch (error) {
    console.error('获取用户列表失败:', error);
    res.status(500).json({
      status: 'error',
      message: '服务器错误'
    });
  }
});

// 获取单个用户 (仅管理员)
router.get('/:id', authenticateToken, checkAdminRole, validateUserId, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: '用户不存在'
      });
    }
    
    // 移除密码字段
    const { password, ...userWithoutPassword } = user;
    
    res.json({
      status: 'success',
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('获取用户详情失败:', error);
    res.status(500).json({
      status: 'error',
      message: '服务器错误'
    });
  }
});

// 创建用户 (仅管理员)
router.post('/', authenticateToken, checkAdminRole, async (req, res) => {
  try {
    const { username, password, name, email, role, status } = req.body;
    
    // 验证必要的字段
    if (!username || !password || !name) {
      return res.status(400).json({
        status: 'error',
        message: '用户名、密码和姓名是必填信息'
      });
    }
    
    // 检查用户名是否已存在
    const existingUser = await User.findByUsername(username);
    
    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: '用户名已存在'
      });
    }
    
    // 创建用户
    const userId = await User.create({
      username,
      password,
      name,
      email: email || null,
      role: role || 'user',
      status: status || 'active',
      created_by: req.user.id,
      created_at: new Date(),
      updated_at: new Date()
    });
    
    res.status(201).json({
      status: 'success',
      message: '用户创建成功',
      data: { id: userId }
    });
  } catch (error) {
    console.error('创建用户失败:', error);
    res.status(500).json({
      status: 'error',
      message: '服务器错误'
    });
  }
});

// 更新用户 (仅管理员)
router.put('/:id', authenticateToken, checkAdminRole, validateUserId, async (req, res) => {
  try {
    // 检查用户是否存在
    const existingUser = await User.findById(req.userId);
    
    if (!existingUser) {
      return res.status(404).json({
        status: 'error',
        message: '用户不存在'
      });
    }
    
    const { username, name, email, role, status } = req.body;
    
    // 验证必要的字段
    if (!username || !name) {
      return res.status(400).json({
        status: 'error',
        message: '用户名和姓名是必填信息'
      });
    }
    
    // 如果修改了用户名，检查是否与其他用户冲突
    if (username !== existingUser.username) {
      const userWithSameUsername = await User.findByUsername(username);
      
      if (userWithSameUsername && userWithSameUsername.id !== req.userId) {
        return res.status(409).json({
          status: 'error',
          message: '用户名已存在'
        });
      }
    }
    
    // 更新用户
    await User.update(req.userId, {
      username,
      name,
      email: email || null,
      role,
      status,
      updated_by: req.user.id,
      updated_at: new Date()
    });
    
    res.json({
      status: 'success',
      message: '用户更新成功'
    });
  } catch (error) {
    console.error('更新用户失败:', error);
    res.status(500).json({
      status: 'error',
      message: '服务器错误'
    });
  }
});

// 重置用户密码 (仅管理员)
router.post('/:id/reset-password', authenticateToken, checkAdminRole, validateUserId, async (req, res) => {
  try {
    const { newPassword } = req.body;
    
    // 验证必要的字段
    if (!newPassword) {
      return res.status(400).json({
        status: 'error',
        message: '请提供新密码'
      });
    }
    
    // 检查用户是否存在
    const existingUser = await User.findById(req.userId);
    
    if (!existingUser) {
      return res.status(404).json({
        status: 'error',
        message: '用户不存在'
      });
    }
    
    // 重置密码
    await User.changePassword(req.userId, newPassword);
    
    res.json({
      status: 'success',
      message: '密码重置成功'
    });
  } catch (error) {
    console.error('重置密码失败:', error);
    res.status(500).json({
      status: 'error',
      message: '服务器错误'
    });
  }
});

// 删除用户 (仅管理员)
router.delete('/:id', authenticateToken, checkAdminRole, validateUserId, async (req, res) => {
  try {
    // 检查用户是否存在
    const existingUser = await User.findById(req.userId);
    
    if (!existingUser) {
      return res.status(404).json({
        status: 'error',
        message: '用户不存在'
      });
    }
    
    // 不能删除自己
    if (req.userId === req.user.id) {
      return res.status(400).json({
        status: 'error',
        message: '不能删除当前登录用户'
      });
    }
    
    // 删除用户
    await User.delete(req.userId);
    
    res.json({
      status: 'success',
      message: '用户删除成功'
    });
  } catch (error) {
    console.error('删除用户失败:', error);
    res.status(500).json({
      status: 'error',
      message: '服务器错误'
    });
  }
});

module.exports = router; 