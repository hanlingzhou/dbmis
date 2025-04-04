const { pool } = require('../config/db');

class Business {
  // 获取所有业务分类
  static async findAllCategories() {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM business_categories WHERE status = "active" ORDER BY name'
      );
      return rows;
    } catch (error) {
      console.error('查询业务分类出错:', error);
      throw error;
    }
  }

  // 获取所有地区
  static async findAllRegions() {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM regions WHERE status = "active" ORDER BY name'
      );
      return rows;
    } catch (error) {
      console.error('查询地区出错:', error);
      throw error;
    }
  }

  // 获取所有业务服务
  static async findAllServices() {
    try {
      const [rows] = await pool.query(
        `SELECT bs.id, bs.name, bc.name AS category, bs.description, bs.status
         FROM business_services bs
         JOIN business_categories bc ON bs.category_id = bc.id
         ORDER BY bc.name, bs.name`
      );
      return rows;
    } catch (error) {
      console.error('查询业务服务出错:', error);
      throw error;
    }
  }

  // 获取业务数据列表（支持分页、排序和过滤）
  static async findAllBusinessData({ page = 1, limit = 10, sort = 'id', order = 'asc', ...filters } = {}) {
    try {
      // 首先检查是否有业务数据
      const [dataCount] = await pool.query('SELECT COUNT(*) as count FROM business_data');
      const hasData = dataCount[0].count > 0;

      // 如果没有业务数据，则返回业务服务列表作为替代
      if (!hasData) {
        console.log('业务数据表为空，将返回业务服务列表');
        const services = await this.findAllServices();
        
        // 将业务服务转换为业务数据格式
        return services.slice(0, limit).map(service => ({
          id: service.id,
          name: service.name,
          category: service.category,
          region: '全省',
          value: 0,
          unit: '人次',
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          status: service.status
        }));
      }
      
      // 正常查询业务数据
      let sql = `
        SELECT bd.id, bs.name, bc.name AS category, r.name AS region, 
               bd.value, bd.unit, bd.year, bd.month, bs.status
        FROM business_data bd
        JOIN business_services bs ON bd.service_id = bs.id
        JOIN business_categories bc ON bs.category_id = bc.id
        JOIN regions r ON bd.region_id = r.id
        WHERE 1=1
      `;
      
      const sqlParams = [];
      
      // 添加过滤条件
      if (filters.search) {
        sql += ` AND (bs.name LIKE ? OR bc.name LIKE ? OR r.name LIKE ?)`;
        const searchParam = `%${filters.search}%`;
        sqlParams.push(searchParam, searchParam, searchParam);
      }
      
      if (filters.category_id) {
        sql += ` AND bc.id = ?`;
        sqlParams.push(filters.category_id);
      }
      
      if (filters.region_id) {
        sql += ` AND r.id = ?`;
        sqlParams.push(filters.region_id);
      }
      
      if (filters.year) {
        sql += ` AND bd.year = ?`;
        sqlParams.push(filters.year);
      }
      
      if (filters.month) {
        sql += ` AND bd.month = ?`;
        sqlParams.push(filters.month);
      }
      
      if (filters.status) {
        sql += ` AND bs.status = ?`;
        sqlParams.push(filters.status);
      }
      
      // 添加排序
      const validSortFields = ['id', 'name', 'category', 'region', 'value', 'year', 'month', 'status'];
      const validSortOrders = ['asc', 'desc'];
      
      const sortField = validSortFields.includes(sort) ? sort : 'id';
      const sortOrder = validSortOrders.includes(order.toLowerCase()) ? order : 'asc';
      
      // 处理排序字段映射
      let orderByField;
      switch(sortField) {
        case 'name':
          orderByField = 'bs.name';
          break;
        case 'category':
          orderByField = 'bc.name';
          break;
        case 'region':
          orderByField = 'r.name';
          break;
        case 'status':
          orderByField = 'bs.status';
          break;
        default:
          orderByField = `bd.${sortField}`;
      }
      
      sql += ` ORDER BY ${orderByField} ${sortOrder}`;
      
      // 添加分页
      const offset = (page - 1) * limit;
      sql += ` LIMIT ? OFFSET ?`;
      sqlParams.push(parseInt(limit), parseInt(offset));
      
      try {
        const [rows] = await pool.query(sql, sqlParams);
        return rows;
      } catch (error) {
        console.error('执行业务数据查询出错:', error);
        throw error;
      }
    } catch (error) {
      console.error('查询业务数据列表出错:', error);
      throw error;
    }
  }
  
  // 计算业务数据总数（用于分页）
  static async countBusinessData(filters = {}) {
    try {
      // 首先检查是否有业务数据
      const [dataCount] = await pool.query('SELECT COUNT(*) as count FROM business_data');
      if (dataCount[0].count === 0) {
        // 如果没有业务数据，则返回业务服务数量
        const [serviceCount] = await pool.query('SELECT COUNT(*) as count FROM business_services');
        return serviceCount[0].count;
      }
      
      let sql = `
        SELECT COUNT(*) as total
        FROM business_data bd
        JOIN business_services bs ON bd.service_id = bs.id
        JOIN business_categories bc ON bs.category_id = bc.id
        JOIN regions r ON bd.region_id = r.id
        WHERE 1=1
      `;
      
      const sqlParams = [];
      
      // 添加过滤条件
      if (filters.search) {
        sql += ` AND (bs.name LIKE ? OR bc.name LIKE ? OR r.name LIKE ?)`;
        const searchParam = `%${filters.search}%`;
        sqlParams.push(searchParam, searchParam, searchParam);
      }
      
      if (filters.category_id) {
        sql += ` AND bc.id = ?`;
        sqlParams.push(filters.category_id);
      }
      
      if (filters.region_id) {
        sql += ` AND r.id = ?`;
        sqlParams.push(filters.region_id);
      }
      
      if (filters.year) {
        sql += ` AND bd.year = ?`;
        sqlParams.push(filters.year);
      }
      
      if (filters.month) {
        sql += ` AND bd.month = ?`;
        sqlParams.push(filters.month);
      }
      
      if (filters.status) {
        sql += ` AND bs.status = ?`;
        sqlParams.push(filters.status);
      }
      
      const [result] = await pool.query(sql, sqlParams);
      return result[0].total;
    } catch (error) {
      console.error('计算业务数据总数出错:', error);
      // 出错时返回0，避免前端报错
      return 0;
    }
  }
}

module.exports = Business; 