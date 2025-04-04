const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      status: 'error',
      message: '未提供认证令牌' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        status: 'error',
        message: '令牌无效或已过期' 
      });
    }
    
    req.user = user;
    next();
  });
};

module.exports = {
  authenticateToken
}; 