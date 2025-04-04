const express = require('express');  // 引入Express框架
const cors = require('cors');  // 引入CORS中间件，用于处理跨域请求
const dotenv = require('dotenv');  // 引入dotenv用于加载环境变量

// 导入路由模块
const authRoutes = require('./routes/auth');  // 身份验证相关路由
const userRoutes = require('./routes/user');  // 用户管理相关路由
const dataRoutes = require('./routes/data');  // 数据处理相关路由
const businessRoutes = require('./routes/business');  // 业务逻辑相关路由

// 导入数据库测试连接函数
const { testConnection } = require('./config/db');  // 从数据库配置模块导入连接测试函数

// 加载环境变量，从.env文件中读取配置
dotenv.config();

// 创建Express应用实例
const app = express();
const PORT = process.env.PORT || 3000;  // 设置服务器端口，如环境变量中未设置则默认使用3000

// 配置中间件
app.use(cors());  // 启用跨域资源共享
app.use(express.json());  // 解析JSON格式的请求体
app.use(express.urlencoded({ extended: true }));  // 解析URL编码的请求体，extended:true允许解析复杂对象

// 测试数据库连接
testConnection();  // 在服务器启动时进行数据库连接测试

// 注册API路由
app.use('/api/auth', authRoutes);  // 挂载身份验证路由到/api/auth路径
app.use('/api/users', userRoutes);  // 挂载用户管理路由到/api/users路径
app.use('/api/data', dataRoutes);  // 挂载数据处理路由到/api/data路径
app.use('/api/business', businessRoutes);  // 挂载业务逻辑路由到/api/business路径

// 配置根路由，用于API健康检查
app.get('/api', (req, res) => {
  res.json({
    status: 'success',
    message: 'DBMIS API 运行正常',
    version: '1.0.0'
  });
});

// 处理未定义的路由，返回404错误
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: '请求的资源不存在'
  });
});

// 启动服务器，监听指定端口
app.listen(PORT, () => {
  console.log(`服务器运行在端口: ${PORT}`);  // 服务器成功启动后的日志信息
});

// 全局错误处理
// 处理未捕获的异常，防止服务器崩溃
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
});

// 处理未处理的Promise拒绝，防止服务器不稳定
process.on('unhandledRejection', (error) => {
  console.error('未处理的Promise拒绝:', error);
}); 