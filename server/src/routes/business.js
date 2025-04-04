const express = require('express');
const Business = require('../models/business');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// 获取所有业务分类
router.get('/categories', authenticateToken, async (req, res) => {
  try {
    const categories = await Business.findAllCategories();
    
    res.json({
      status: 'success',
      data: categories
    });
  } catch (error) {
    console.error('获取业务分类失败:', error);
    res.status(500).json({
      status: 'error',
      message: '服务器错误'
    });
  }
});

// 获取所有地区
router.get('/regions', authenticateToken, async (req, res) => {
  try {
    const regions = await Business.findAllRegions();
    
    res.json({
      status: 'success',
      data: regions
    });
  } catch (error) {
    console.error('获取地区失败:', error);
    res.status(500).json({
      status: 'error',
      message: '服务器错误'
    });
  }
});

// 获取所有业务服务
router.get('/services', authenticateToken, async (req, res) => {
  try {
    const services = await Business.findAllServices();
    
    res.json({
      status: 'success',
      data: services
    });
  } catch (error) {
    console.error('获取业务服务失败:', error);
    res.status(500).json({
      status: 'error',
      message: '服务器错误'
    });
  }
});

// 获取业务数据列表
router.get('/data', authenticateToken, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sort = 'id', 
      order = 'asc',
      search = '',
      category_id = '',
      region_id = '',
      year = '',
      month = '',
      status = ''
    } = req.query;
    
    // 构建过滤条件
    const filters = {};
    if (search) filters.search = search;
    if (category_id) filters.category_id = parseInt(category_id);
    if (region_id) filters.region_id = parseInt(region_id);
    if (year) filters.year = parseInt(year);
    if (month) filters.month = parseInt(month);
    if (status) filters.status = status;
    
    // 获取业务数据列表和总数
    const businessData = await Business.findAllBusinessData({
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
      order,
      ...filters
    });
    
    const total = await Business.countBusinessData(filters);
    
    res.json({
      status: 'success',
      data: businessData,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total
      }
    });
  } catch (error) {
    console.error('获取业务数据列表失败:', error);
    
    // 如果发生错误，返回空数据而不是错误状态
    // 这样前端可以显示后备数据
    res.json({
      status: 'success',
      data: [],
      pagination: {
        page: parseInt(req.query.page || 1),
        limit: parseInt(req.query.limit || 10),
        total: 0
      }
    });
  }
});

module.exports = router; 