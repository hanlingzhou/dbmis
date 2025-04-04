const express = require('express');
const DataCategory = require('../models/data_category');
const DataItem = require('../models/data_item');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// 中间件：验证数据类别ID参数
const validateCategoryId = (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({
      status: 'error',
      message: '无效的数据类别ID'
    });
  }
  req.categoryId = id;
  next();
};

// 中间件：验证数据项ID参数
const validateItemId = (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({
      status: 'error',
      message: '无效的数据项ID'
    });
  }
  req.itemId = id;
  next();
};

// 获取所有数据类别
router.get('/categories', authenticateToken, async (req, res) => {
  try {
    const categories = await DataCategory.findAll();
    
    res.json({
      status: 'success',
      data: categories
    });
  } catch (error) {
    console.error('获取数据类别失败:', error);
    res.status(500).json({
      status: 'error',
      message: '服务器错误'
    });
  }
});

// 获取单个数据类别
router.get('/categories/:id', authenticateToken, validateCategoryId, async (req, res) => {
  try {
    const category = await DataCategory.findById(req.categoryId);
    
    if (!category) {
      return res.status(404).json({
        status: 'error',
        message: '数据类别不存在'
      });
    }
    
    res.json({
      status: 'success',
      data: category
    });
  } catch (error) {
    console.error('获取数据类别失败:', error);
    res.status(500).json({
      status: 'error',
      message: '服务器错误'
    });
  }
});

// 创建数据类别
router.post('/categories', authenticateToken, async (req, res) => {
  try {
    const { name, description, status = 'active' } = req.body;
    
    if (!name) {
      return res.status(400).json({
        status: 'error',
        message: '缺少必要的字段: name'
      });
    }
    
    const categoryData = {
      name,
      description,
      status,
      created_by: req.user.id,
      updated_by: req.user.id
    };
    
    const newCategory = await DataCategory.create(categoryData);
    
    res.status(201).json({
      status: 'success',
      data: newCategory
    });
  } catch (error) {
    console.error('创建数据类别失败:', error);
    res.status(500).json({
      status: 'error',
      message: '服务器错误'
    });
  }
});

// 更新数据类别
router.put('/categories/:id', authenticateToken, validateCategoryId, async (req, res) => {
  try {
    const { name, description, status } = req.body;
    
    if (!name) {
      return res.status(400).json({
        status: 'error',
        message: '缺少必要的字段: name'
      });
    }
    
    const categoryData = {
      name,
      description,
      status,
      updated_by: req.user.id
    };
    
    const updatedCategory = await DataCategory.update(req.categoryId, categoryData);
    
    if (!updatedCategory) {
      return res.status(404).json({
        status: 'error',
        message: '数据类别不存在'
      });
    }
    
    res.json({
      status: 'success',
      data: updatedCategory
    });
  } catch (error) {
    console.error('更新数据类别失败:', error);
    res.status(500).json({
      status: 'error',
      message: '服务器错误'
    });
  }
});

// 删除数据类别
router.delete('/categories/:id', authenticateToken, validateCategoryId, async (req, res) => {
  try {
    // 检查该类别下是否存在数据项
    const itemsCount = await DataItem.countByCategoryId(req.categoryId);
    
    if (itemsCount > 0) {
      return res.status(400).json({
        status: 'error',
        message: '该类别下存在数据项，无法删除'
      });
    }
    
    const result = await DataCategory.delete(req.categoryId);
    
    if (!result) {
      return res.status(404).json({
        status: 'error',
        message: '数据类别不存在'
      });
    }
    
    res.json({
      status: 'success',
      message: '数据类别已删除'
    });
  } catch (error) {
    console.error('删除数据类别失败:', error);
    res.status(500).json({
      status: 'error',
      message: '服务器错误'
    });
  }
});

// 获取数据项列表
router.get('/items', authenticateToken, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sort = 'id', 
      order = 'asc',
      search = '',
      category_id = '',
      status = ''
    } = req.query;
    
    // 构建过滤条件
    const filters = {};
    if (search) filters.search = search;
    if (category_id) filters.category_id = parseInt(category_id);
    if (status) filters.status = status;
    
    // 获取数据项列表和总数
    const items = await DataItem.findAll({
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
      order,
      ...filters
    });
    
    const total = await DataItem.count(filters);
    
    res.json({
      status: 'success',
      data: items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total
      }
    });
  } catch (error) {
    console.error('获取数据项列表失败:', error);
    res.status(500).json({
      status: 'error',
      message: '服务器错误'
    });
  }
});

// 获取单个数据项
router.get('/items/:id', authenticateToken, validateItemId, async (req, res) => {
  try {
    const item = await DataItem.findById(req.itemId);
    
    if (!item) {
      return res.status(404).json({
        status: 'error',
        message: '数据项不存在'
      });
    }
    
    res.json({
      status: 'success',
      data: item
    });
  } catch (error) {
    console.error('获取数据项失败:', error);
    res.status(500).json({
      status: 'error',
      message: '服务器错误'
    });
  }
});

// 创建数据项
router.post('/items', authenticateToken, async (req, res) => {
  try {
    const { name, category_id, content, data_type, status = 'active' } = req.body;
    
    if (!name || !category_id) {
      return res.status(400).json({
        status: 'error',
        message: '缺少必要的字段: name, category_id'
      });
    }
    
    // 检查类别是否存在
    const category = await DataCategory.findById(category_id);
    if (!category) {
      return res.status(400).json({
        status: 'error',
        message: '指定的数据类别不存在'
      });
    }
    
    const itemData = {
      name,
      category_id,
      content,
      data_type,
      status,
      created_by: req.user.id,
      updated_by: req.user.id
    };
    
    const newItem = await DataItem.create(itemData);
    
    res.status(201).json({
      status: 'success',
      data: newItem
    });
  } catch (error) {
    console.error('创建数据项失败:', error);
    res.status(500).json({
      status: 'error',
      message: '服务器错误'
    });
  }
});

// 更新数据项
router.put('/items/:id', authenticateToken, validateItemId, async (req, res) => {
  try {
    const { name, category_id, content, data_type, status } = req.body;
    
    if (!name || !category_id) {
      return res.status(400).json({
        status: 'error',
        message: '缺少必要的字段: name, category_id'
      });
    }
    
    // 检查类别是否存在
    if (category_id) {
      const category = await DataCategory.findById(category_id);
      if (!category) {
        return res.status(400).json({
          status: 'error',
          message: '指定的数据类别不存在'
        });
      }
    }
    
    const itemData = {
      name,
      category_id,
      content,
      data_type,
      status,
      updated_by: req.user.id
    };
    
    const updatedItem = await DataItem.update(req.itemId, itemData);
    
    if (!updatedItem) {
      return res.status(404).json({
        status: 'error',
        message: '数据项不存在'
      });
    }
    
    res.json({
      status: 'success',
      data: updatedItem
    });
  } catch (error) {
    console.error('更新数据项失败:', error);
    res.status(500).json({
      status: 'error',
      message: '服务器错误'
    });
  }
});

// 删除数据项
router.delete('/items/:id', authenticateToken, validateItemId, async (req, res) => {
  try {
    const result = await DataItem.delete(req.itemId);
    
    if (!result) {
      return res.status(404).json({
        status: 'error',
        message: '数据项不存在'
      });
    }
    
    res.json({
      status: 'success',
      message: '数据项已删除'
    });
  } catch (error) {
    console.error('删除数据项失败:', error);
    res.status(500).json({
      status: 'error',
      message: '服务器错误'
    });
  }
});

module.exports = router; 