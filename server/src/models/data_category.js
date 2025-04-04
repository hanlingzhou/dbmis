const { pool } = require('../config/db');

class DataCategory {
  // 根据ID查找数据类别
  static async findById(id) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM data_categories WHERE id = ?',
        [id]
      );
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error('查询数据类别出错:', error);
      throw error;
    }
  }

  // 获取所有数据类别
  static async findAll() {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM data_categories ORDER BY name'
      );
      return rows;
    } catch (error) {
      console.error('查询所有数据类别出错:', error);
      throw error;
    }
  }

  // 创建新数据类别
  static async create(categoryData) {
    const { name, description, status, created_by, updated_by } = categoryData;
    
    try {      
      const [result] = await pool.query(
        `INSERT INTO data_categories 
         (name, description, status, created_by, created_at, updated_by, updated_at) 
         VALUES (?, ?, ?, ?, NOW(), ?, NOW())`,
        [name, description, status, created_by, updated_by]
      );
      
      if (result.insertId) {
        return this.findById(result.insertId);
      }
      
      return null;
    } catch (error) {
      console.error('创建数据类别出错:', error);
      throw error;
    }
  }

  // 更新数据类别
  static async update(id, categoryData) {
    const { name, description, status, updated_by } = categoryData;
    
    try {
      const [result] = await pool.query(
        `UPDATE data_categories 
         SET name = ?, description = ?, status = ?, updated_by = ?, updated_at = NOW() 
         WHERE id = ?`,
        [name, description, status, updated_by, id]
      );
      
      if (result.affectedRows > 0) {
        return this.findById(id);
      }
      
      return null;
    } catch (error) {
      console.error('更新数据类别出错:', error);
      throw error;
    }
  }

  // 删除数据类别
  static async delete(id) {
    try {
      const [result] = await pool.query(
        'DELETE FROM data_categories WHERE id = ?',
        [id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('删除数据类别出错:', error);
      throw error;
    }
  }
}

module.exports = DataCategory; 