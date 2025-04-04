const { pool } = require('../config/db');
const bcrypt = require('bcrypt');

class User {
  // 根据用户名查找用户
  static async findByUsername(username) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error('查询用户出错:', error);
      throw error;
    }
  }

  // 根据ID查找用户
  static async findById(id) {
    try {
      const [rows] = await pool.query(
        'SELECT id, username, name, role, department, email, last_login, status FROM users WHERE id = ?',
        [id]
      );
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error('查询用户出错:', error);
      throw error;
    }
  }

  // 创建新用户
  static async create(userData) {
    const { username, password, name, role, department, email, status = 'active' } = userData;
    
    try {
      // 密码加密
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const [result] = await pool.query(
        'INSERT INTO users (username, password, name, role, department, email, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [username, hashedPassword, name, role, department, email, status]
      );
      
      return result.insertId;
    } catch (error) {
      console.error('创建用户出错:', error);
      throw error;
    }
  }

  // 更新用户
  static async update(id, userData) {
    const { name, role, department, email, status } = userData;
    
    try {
      const [result] = await pool.query(
        'UPDATE users SET name = ?, role = ?, department = ?, email = ?, status = ? WHERE id = ?',
        [name, role, department, email, status, id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('更新用户出错:', error);
      throw error;
    }
  }

  // 修改密码
  static async changePassword(id, newPassword) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      const [result] = await pool.query(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('修改密码出错:', error);
      throw error;
    }
  }

  // 获取所有用户
  static async findAll() {
    try {
      const [rows] = await pool.query(
        'SELECT id, username, name, role, department, email, last_login, status FROM users'
      );
      return rows;
    } catch (error) {
      console.error('查询所有用户出错:', error);
      throw error;
    }
  }

  // 删除用户
  static async delete(id) {
    try {
      const [result] = await pool.query(
        'DELETE FROM users WHERE id = ?',
        [id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('删除用户出错:', error);
      throw error;
    }
  }

  // 更新最后登录时间
  static async updateLastLogin(id) {
    try {
      await pool.query(
        'UPDATE users SET last_login = NOW() WHERE id = ?',
        [id]
      );
    } catch (error) {
      console.error('更新登录时间出错:', error);
      // 继续执行，不阻止登录
    }
  }
}

module.exports = User; 