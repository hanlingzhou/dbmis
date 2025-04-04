# DBMIS 部署文档

本文档详细描述了DBMIS系统的部署步骤和配置要求，包括开发环境和生产环境的部署指南。

## 1. 系统要求

### 1.1 硬件要求

#### 最低配置
- CPU: 双核处理器
- 内存: 4GB RAM
- 存储: 20GB 可用空间
- 网络: 100Mbps 网络连接

#### 推荐配置
- CPU: 四核处理器或更高
- 内存: 8GB RAM 或更高
- 存储: 50GB SSD 存储
- 网络: 1Gbps 网络连接

### 1.2 软件要求

#### 必需软件
- Node.js: v16.0.0 或更高版本
- MySQL: v8.0 或更高版本
- npm: v8.0.0 或更高版本

#### 可选软件
- Nginx: 用于生产环境的反向代理和负载均衡
- PM2: 用于Node.js应用程序的进程管理
- Docker: 用于容器化部署

## 2. 开发环境部署

开发环境部署适用于本地开发和测试。

### 2.1 前期准备

#### 安装 Node.js 和 npm
```bash
# 使用 nvm 安装 Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
source ~/.bashrc  # 或 source ~/.zshrc
nvm install 16
nvm use 16
```

#### 安装 MySQL
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server

# macOS
brew install mysql
brew services start mysql

# Windows
# 下载并安装 MySQL Installer: https://dev.mysql.com/downloads/installer/
```

### 2.2 数据库设置

#### 创建数据库和用户
```bash
# 登录 MySQL
mysql -u root -p

# 在 MySQL 中执行
CREATE DATABASE dbmis;
CREATE USER 'dbmis_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON dbmis.* TO 'dbmis_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### 初始化数据库
```bash
# 导入表结构
mysql -u dbmis_user -p dbmis < server/src/db/structure.sql

# 导入初始数据
mysql -u dbmis_user -p dbmis < server/src/db/initdata.sql
```

### 2.3 服务器部署

#### 安装依赖
```bash
# 克隆项目
git clone https://github.com/yourusername/dbmis.git
cd dbmis

# 安装服务器依赖
cd server
npm install

# 配置环境变量
cp .env.example .env
```

编辑 `.env` 文件，配置数据库连接：
```
PORT=3001
DB_HOST=localhost
DB_USER=dbmis_user
DB_PASSWORD=your_password
DB_NAME=dbmis
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d
```

#### 启动服务器
```bash
# 开发模式启动
npm run dev
```

服务器将在 http://localhost:3001 上运行。

### 2.4 客户端部署

#### 安装依赖
```bash
# 进入客户端目录
cd ../client
npm install
```

#### 启动开发服务器
```bash
npm run dev
```

客户端开发服务器将在 http://localhost:5173 上运行。

## 3. 生产环境部署

生产环境部署适用于正式上线的系统。

### 3.1 服务器准备

#### 安装必要软件
```bash
# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs

# 安装 MySQL
sudo apt update
sudo apt install -y mysql-server

# 安装 Nginx
sudo apt install -y nginx

# 安装 PM2
sudo npm install -g pm2
```

#### 配置防火墙
```bash
# 允许 HTTP、HTTPS 和 SSH 连接
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

### 3.2 数据库设置

与开发环境相同，但要设置更安全的密码并限制远程访问。

```bash
# 登录 MySQL
sudo mysql

# 在 MySQL 中执行
CREATE DATABASE dbmis;
CREATE USER 'dbmis_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON dbmis.* TO 'dbmis_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# 导入数据库结构和初始数据
mysql -u dbmis_user -p dbmis < server/src/db/structure.sql
mysql -u dbmis_user -p dbmis < server/src/db/initdata.sql

# 配置 MySQL 安全设置
sudo mysql_secure_installation
```

### 3.3 应用程序部署

#### 获取代码
```bash
# 克隆项目
git clone https://github.com/yourusername/dbmis.git
cd dbmis
```

#### 配置服务器
```bash
cd server
npm install --production
cp .env.example .env
```

编辑 `.env` 文件，配置生产环境变量：
```
PORT=3001
DB_HOST=localhost
DB_USER=dbmis_user
DB_PASSWORD=strong_password
DB_NAME=dbmis
JWT_SECRET=your_very_secure_jwt_secret
JWT_EXPIRES_IN=1d
NODE_ENV=production
```

#### 构建客户端
```bash
cd ../client
npm install
npm run build
```

#### 将构建后的客户端代码复制到服务器静态目录
```bash
mkdir -p ../server/public
cp -r dist/* ../server/public/
```

#### 使用 PM2 启动服务器
```bash
cd ../server
pm2 start src/index.js --name "dbmis-api" --env production
pm2 save
pm2 startup
```

### 3.4 Nginx 配置

创建 Nginx 配置文件：
```bash
sudo nano /etc/nginx/sites-available/dbmis
```

添加以下配置：
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

启用站点并重启 Nginx：
```bash
sudo ln -s /etc/nginx/sites-available/dbmis /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 3.5 配置 HTTPS (推荐)

使用 Let's Encrypt 获取 SSL 证书：
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 4. 负载均衡配置 (高可用部署)

对于需要高可用性的生产环境，可以配置多个应用服务器实例和负载均衡。

### 4.1 多实例部署

在每个应用服务器上执行以下步骤：

1. 按照上述生产环境部署步骤安装应用
2. 确保所有实例使用相同的数据库

### 4.2 Nginx 负载均衡配置

在负载均衡服务器上配置 Nginx：
```bash
sudo nano /etc/nginx/sites-available/dbmis
```

添加以下配置：
```nginx
upstream dbmis_backend {
    server app-server-1:3001;
    server app-server-2:3001;
    # 添加更多服务器实例
}

server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://dbmis_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 4.3 数据库主从配置

配置 MySQL 主从复制以提高数据库可用性：

#### 主服务器配置
编辑 MySQL 配置文件：
```bash
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
```

添加以下配置：
```
[mysqld]
server-id = 1
log_bin = mysql-bin
binlog_format = ROW
binlog_do_db = dbmis
```

重启 MySQL：
```bash
sudo systemctl restart mysql
```

在主服务器上创建复制用户：
```sql
CREATE USER 'replication_user'@'%' IDENTIFIED BY 'replication_password';
GRANT REPLICATION SLAVE ON *.* TO 'replication_user'@'%';
FLUSH PRIVILEGES;

SHOW MASTER STATUS;
```

记下输出中的 File 和 Position 值。

#### 从服务器配置
编辑 MySQL 配置文件：
```bash
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
```

添加以下配置：
```
[mysqld]
server-id = 2
log_bin = mysql-bin
binlog_format = ROW
relay_log = mysql-relay-bin
log_slave_updates = 1
read_only = 1
```

重启 MySQL：
```bash
sudo systemctl restart mysql
```

配置从服务器连接到主服务器：
```sql
STOP SLAVE;
CHANGE MASTER TO
    MASTER_HOST='主服务器IP',
    MASTER_USER='replication_user',
    MASTER_PASSWORD='replication_password',
    MASTER_LOG_FILE='上面记下的File值',
    MASTER_LOG_POS=上面记下的Position值;
START SLAVE;
SHOW SLAVE STATUS\G
```

检查 Slave_IO_Running 和 Slave_SQL_Running 是否都为 Yes。

## 5. Docker 部署 (可选)

如果希望使用 Docker 进行容器化部署，可以按照以下步骤进行。

### 5.1 创建 Docker 配置文件

#### 创建 docker-compose.yml
```bash
nano docker-compose.yml
```

添加以下内容：
```yaml
version: '3'

services:
  mysql:
    image: mysql:8
    container_name: dbmis-mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: dbmis
      MYSQL_USER: dbmis_user
      MYSQL_PASSWORD: dbmis_password
    volumes:
      - ./mysql-data:/var/lib/mysql
      - ./server/src/db/structure.sql:/docker-entrypoint-initdb.d/01-structure.sql
      - ./server/src/db/initdata.sql:/docker-entrypoint-initdb.d/02-initdata.sql
    ports:
      - "3306:3306"
    networks:
      - dbmis-network

  backend:
    build:
      context: ./server
      dockerfile: Dockerfile
    container_name: dbmis-backend
    restart: always
    environment:
      PORT: 3001
      DB_HOST: mysql
      DB_USER: dbmis_user
      DB_PASSWORD: dbmis_password
      DB_NAME: dbmis
      JWT_SECRET: your_jwt_secret
      JWT_EXPIRES_IN: 1d
      NODE_ENV: production
    ports:
      - "3001:3001"
    depends_on:
      - mysql
    networks:
      - dbmis-network

  frontend:
    build:
      context: ./client
      dockerfile: Dockerfile
    container_name: dbmis-frontend
    restart: always
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - dbmis-network

networks:
  dbmis-network:
    driver: bridge
```

#### 创建后端 Dockerfile
```bash
nano server/Dockerfile
```

添加以下内容：
```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3001

CMD ["node", "src/index.js"]
```

#### 创建前端 Dockerfile
```bash
nano client/Dockerfile
```

添加以下内容：
```dockerfile
# 构建阶段
FROM node:16-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### 创建 Nginx 配置文件
```bash
nano client/nginx.conf
```

添加以下内容：
```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 5.2 启动 Docker 容器
```bash
# 确保 Docker 和 Docker Compose 已安装
docker-compose up -d
```

### 5.3 验证部署
```bash
# 检查容器状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

访问 http://your-server-ip 验证系统是否正常运行。

## 6. 系统维护

### 6.1 备份策略

#### 数据库备份
```bash
# 创建备份目录
mkdir -p /backup/dbmis

# 创建备份脚本
nano /backup/backup-dbmis.sh
```

添加以下内容：
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/dbmis"
MYSQL_USER="dbmis_user"
MYSQL_PASS="your_password"
DB_NAME="dbmis"

# 创建备份
mysqldump -u $MYSQL_USER -p$MYSQL_PASS $DB_NAME | gzip > $BACKUP_DIR/dbmis_$DATE.sql.gz

# 删除超过30天的备份
find $BACKUP_DIR -name "dbmis_*.sql.gz" -type f -mtime +30 -delete
```

设置执行权限并添加到定时任务：
```bash
chmod +x /backup/backup-dbmis.sh
crontab -e
```

添加以下内容：
```
0 1 * * * /backup/backup-dbmis.sh
```

#### 代码备份
```bash
# 在代码仓库中定期提交更改
git add README.md docs/
git add -u  # 添加所有已修改但未暂存的文件
git commit -m "Regular code backup"
git push origin main
```

### 6.2 监控和日志

#### 使用 PM2 监控
```bash
# 查看应用状态
pm2 status

# 查看日志
pm2 logs dbmis-api

# 监控资源使用情况
pm2 monit
```

#### 配置日志轮转
```bash
sudo nano /etc/logrotate.d/dbmis
```

添加以下内容：
```
/var/log/dbmis/*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    create 640 node node
    sharedscripts
    postrotate
        [ -f /var/run/nginx.pid ] && kill -USR1 `cat /var/run/nginx.pid`
    endscript
}
```

### 6.3 系统更新

#### 更新应用代码
```bash
# 拉取最新代码
git pull

# 安装依赖
cd server
npm install --production

cd ../client
npm install
npm run build

# 复制构建文件并重启服务
cp -r dist/* ../server/public/
cd ../server
pm2 restart dbmis-api
```

#### 更新操作系统和软件
```bash
# 更新系统包
sudo apt update
sudo apt upgrade -y

# 更新 Node.js
sudo npm install -g n
sudo n stable

# 重启服务
pm2 restart all
```

## 7. 故障排除

### 7.1 常见问题

#### 数据库连接问题
```bash
# 检查 MySQL 服务状态
sudo systemctl status mysql

# 检查能否连接到数据库
mysql -u dbmis_user -p -e "SELECT 1"

# 检查服务器日志中的数据库错误
pm2 logs dbmis-api | grep "database\|DB\|mysql"
```

#### 服务器启动失败
```bash
# 检查错误日志
pm2 logs dbmis-api

# 手动启动并检查错误
cd /path/to/dbmis/server
node src/index.js
```

#### 前端无法访问后端 API
```bash
# 检查 Nginx 配置
sudo nginx -t

# 测试 API 可访问性
curl -I http://localhost:3001/api

# 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/error.log
```

### 7.2 性能问题

#### 服务器负载过高
```bash
# 检查系统资源使用情况
top
htop

# 检查哪些进程占用资源
ps aux --sort=-%cpu | head -10
ps aux --sort=-%mem | head -10

# 检查网络连接
netstat -tunapl
```

#### 数据库性能慢
```bash
# 启用慢查询日志
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
```

添加以下内容：
```
slow_query_log = 1
slow_query_log_file = /var/log/mysql/mysql-slow.log
long_query_time = 1
```

重启 MySQL 并分析慢查询：
```bash
sudo systemctl restart mysql
sudo tail -f /var/log/mysql/mysql-slow.log
```

## 8. 安全注意事项

### 8.1 防火墙配置

只开放必要的端口：
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

### 8.2 安全最佳实践

1. 定期更新系统和依赖项
2. 使用强密码并定期更改
3. 启用 HTTPS
4. 限制 SSH 访问，使用密钥认证
5. 定期检查日志文件中的可疑活动
6. 备份敏感数据并测试恢复过程
7. 实施 IP 限制和请求速率限制
8. 使用安全的 JWT 密钥并定期轮换
9. 使用自动化工具进行安全扫描 