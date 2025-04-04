const mysql = require('mysql2/promise');  // 引入mysql2的promise版本，支持异步/await操作
const dotenv = require('dotenv');  // 引入dotenv用于加载环境变量

// 加载环境变量配置
dotenv.config();

// 创建数据库连接池
// 连接池可以重用连接，提高性能并处理连接断开的情况
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',  // 数据库主机地址，默认为localhost
  user: process.env.DB_USER || 'root',  // 数据库用户名，默认为root
  password: process.env.DB_PASSWORD || '',  // 数据库密码，默认为空
  database: process.env.DB_NAME || 'dbmis',  // 数据库名称，默认为dbmis
  waitForConnections: true,  // 当没有可用连接时，是否等待连接（true）或立即抛出错误（false）
  connectionLimit: 10,  // 连接池中最大连接数
  queueLimit: 0  // 连接池队列限制，0表示不限制队列大小
});

/**
 * 测试数据库连接
 * 
 * 尝试从连接池获取一个连接，并在测试完成后释放连接
 * 用于验证数据库配置是否正确，服务器启动时会调用此函数
 * 
 * @returns {Promise<boolean>} 连接成功返回true，失败返回false
 */
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();  // 从连接池获取一个连接
    console.log('数据库连接成功!');  // 连接成功的日志
    connection.release();  // 重要：使用完毕后释放连接，返回到连接池
    return true;
  } catch (error) {
    console.error('数据库连接失败:', error);  // 连接失败的错误日志
    return false;
  }
};

// 导出模块内容
module.exports = {
  pool,  // 导出连接池供其他模块使用
  testConnection  // 导出测试连接函数
}; 