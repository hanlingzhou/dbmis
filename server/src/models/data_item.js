const { pool } = require('../config/db');

class DataItem {
  // 根据ID查找数据项
  static async findById(id) {
    try {
      const [rows] = await pool.query(
        `SELECT di.*, dc.name as category_name
         FROM data_items di
         LEFT JOIN data_categories dc ON di.category_id = dc.id
         WHERE di.id = ?`,
        [id]
      );
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error('查询数据项出错:', error);
      throw error;
    }
  }

  // 获取所有数据项列表（支持分页、排序和过滤）
  static async findAll({ page = 1, limit = 10, sort = 'id', order = 'asc', ...filters } = {}) {
    let sql = `
      SELECT di.*, dc.name as category_name
      FROM data_items di
      LEFT JOIN data_categories dc ON di.category_id = dc.id
      WHERE 1=1
    `;
    
    const sqlParams = [];
    
    // 添加过滤条件
    if (filters.search) {
      sql += ` AND (di.name LIKE ? OR di.content LIKE ?)`;
      const searchParam = `%${filters.search}%`;
      sqlParams.push(searchParam, searchParam);
    }
    
    if (filters.category_id) {
      sql += ` AND di.category_id = ?`;
      sqlParams.push(filters.category_id);
    }
    
    if (filters.status) {
      sql += ` AND di.status = ?`;
      sqlParams.push(filters.status);
    }
    
    // 添加排序
    const validSortFields = ['id', 'name', 'category_id', 'data_type', 'status', 'created_at', 'updated_at'];
    const validSortOrders = ['asc', 'desc'];
    
    const sortField = validSortFields.includes(sort) ? sort : 'id';
    const sortOrder = validSortOrders.includes(order.toLowerCase()) ? order : 'asc';
    
    sql += ` ORDER BY di.${sortField} ${sortOrder}`;
    
    // 添加分页
    const offset = (page - 1) * limit;
    sql += ` LIMIT ? OFFSET ?`;
    sqlParams.push(parseInt(limit), parseInt(offset));
    
    try {
      const [rows] = await pool.query(sql, sqlParams);
      return rows;
    } catch (error) {
      console.error('查询数据项列表出错:', error);
      throw error;
    }
  }
  
  // 计算数据项总数（用于分页）
  static async count(filters = {}) {
    let sql = `
      SELECT COUNT(*) as total
      FROM data_items
      WHERE 1=1
    `;
    
    const sqlParams = [];
    
    // 添加过滤条件
    if (filters.search) {
      sql += ` AND (name LIKE ? OR content LIKE ?)`;
      const searchParam = `%${filters.search}%`;
      sqlParams.push(searchParam, searchParam);
    }
    
    if (filters.category_id) {
      sql += ` AND category_id = ?`;
      sqlParams.push(filters.category_id);
    }
    
    if (filters.status) {
      sql += ` AND status = ?`;
      sqlParams.push(filters.status);
    }
    
    try {
      const [result] = await pool.query(sql, sqlParams);
      return result[0].total;
    } catch (error) {
      console.error('计算数据项总数出错:', error);
      throw error;
    }
  }
  
  // 计算特定类别下的数据项数量
  static async countByCategoryId(categoryId) {
    try {
      const [result] = await pool.query(
        `SELECT COUNT(*) as total
         FROM data_items
         WHERE category_id = ?`,
        [categoryId]
      );
      return result[0].total;
    } catch (error) {
      console.error('计算类别数据项总数出错:', error);
      throw error;
    }
  }

  // 创建新数据项
  static async create(itemData) {
    const { name, category_id, content, data_type, status, created_by, updated_by } = itemData;
    
    try {      
      const [result] = await pool.query(
        `INSERT INTO data_items 
         (name, category_id, content, data_type, status, created_by, created_at, updated_by, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, NOW())`,
        [name, category_id, content, data_type, status, created_by, updated_by]
      );
      
      if (result.insertId) {
        return this.findById(result.insertId);
      }
      
      return null;
    } catch (error) {
      console.error('创建数据项出错:', error);
      throw error;
    }
  }

  // 更新数据项
  static async update(id, itemData) {
    const { name, category_id, content, data_type, status, updated_by } = itemData;
    
    try {
      const [result] = await pool.query(
        `UPDATE data_items 
         SET name = ?, category_id = ?, content = ?, data_type = ?, status = ?, updated_by = ?, updated_at = NOW() 
         WHERE id = ?`,
        [name, category_id, content, data_type, status, updated_by, id]
      );
      
      if (result.affectedRows > 0) {
        return this.findById(id);
      }
      
      return null;
    } catch (error) {
      console.error('更新数据项出错:', error);
      throw error;
    }
  }

  // 删除数据项
  static async delete(id) {
    try {
      const [result] = await pool.query(
        'DELETE FROM data_items WHERE id = ?',
        [id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('删除数据项出错:', error);
      throw error;
    }
  }
}

module.exports = DataItem; 