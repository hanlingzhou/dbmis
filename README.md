# 数据库管理信息系统 (DBMIS)

<div align="center">
  <img src="docs/images/logo.png" alt="DBMIS Logo" width="200">
  <p>现代化、高效的数据库管理信息系统</p>
</div>

## 项目简介

DBMIS（数据库管理信息系统）是一个专为数据管理和业务分析设计的全栈web应用。系统采用现代化的技术栈和优雅的设计，提供直观的用户界面和强大的数据处理能力，帮助用户高效管理和分析业务数据。

### 主要功能

- **数据可视化**：直观展示业务数据，支持多种图表类型
- **用户管理**：完善的用户权限管理系统
- **业务数据管理**：灵活的数据录入、编辑和导出功能
- **地区业务分析**：基于地区的业务数据统计和比较
- **系统管理**：提供系统配置和日志管理功能

## 技术架构

### 前端技术栈

- **框架**：Vue 3 (Composition API)
- **UI库**：Element Plus
- **状态管理**：Pinia
- **路由**：Vue Router
- **HTTP客户端**：Axios
- **图表**：ECharts

### 后端技术栈

- **运行环境**：Node.js
- **Web框架**：Express.js
- **数据库**：MySQL
- **ORM**：原生SQL查询
- **认证**：JWT (JSON Web Token)

## 系统架构图

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   客户端    │      │   服务器    │      │   数据库    │
│  (Vue.js)   │<────>│  (Express)  │<────>│  (MySQL)    │
└─────────────┘      └─────────────┘      └─────────────┘
      │                     │                    │
      v                     v                    v
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   组件层    │      │   路由层    │      │   表结构    │
│ (Vue组件)   │      │ (API路由)   │      │ (数据模型)  │
└─────────────┘      └─────────────┘      └─────────────┘
      │                     │                    │
      v                     v                    v
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   状态层    │      │   控制层    │      │   数据层    │
│  (Pinia)    │      │ (Controller)│      │ (数据操作)  │
└─────────────┘      └─────────────┘      └─────────────┘
```

## 快速开始

### 前置条件

- Node.js (v16+)
- MySQL (v8+)

### 安装与配置

#### 1. 克隆项目

```bash
git clone https://github.com/yourusername/dbmis.git
cd dbmis
```

#### 2. 安装依赖

```bash
# 安装服务器依赖
cd server
npm install

# 安装客户端依赖
cd ../client
npm install
```

#### 3. 配置数据库

- 创建MySQL数据库
- 复制`.env.example`为`.env`并配置数据库连接参数

```bash
cd ../server
cp .env.example .env
```

编辑`.env`文件，配置数据库连接：

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=dbmis
```

#### 4. 初始化数据库

```bash
# 运行SQL脚本
mysql -u root -p < src/db/structure.sql
mysql -u root -p < src/db/initdata.sql
```

### 启动应用

#### 开发模式

```bash
# 启动服务器（位于server目录下）
npm run dev

# 启动客户端（位于client目录下）
npm run dev
```

#### 生产模式

```bash
# 构建客户端
cd client
npm run build

# 启动服务器（生产模式）
cd ../server
npm start
```

### 访问系统

- 开发模式：http://localhost:5173（客户端）和http://localhost:3001（服务器API）
- 生产模式：http://your-server-ip:3001

### 默认账户

- 用户名：`admin`
- 密码：`admin`

## 项目结构

```
dbmis/
├── client/                 # 前端代码
│   ├── public/             # 静态资源
│   │   ├── assets/         # 项目资源文件
│   │   ├── components/     # 公共组件
│   │   ├── layouts/        # 布局组件
│   │   ├── router/         # 路由配置
│   │   ├── store/          # Pinia状态管理
│   │   ├── views/          # 页面组件
│   │   ├── App.vue         # 根组件
│   │   └── main.js         # 入口文件
│   └── package.json        # 前端依赖配置
├── server/                 # 后端代码
│   ├── src/
│   │   ├── config/         # 配置文件
│   │   ├── db/             # 数据库相关
│   │   ├── middleware/     # 中间件
│   │   ├── models/         # 数据模型
│   │   ├── routes/         # API路由
│   │   └── index.js        # 服务器入口
│   └── package.json        # 后端依赖配置
├── docs/                   # 项目文档
└── README.md               # 项目说明
```

## API文档

请参考[API文档](docs/API.md)了解完整的API接口描述。

## 截图展示

<div align="center">
  <img src="docs/images/dashboard.png" alt="仪表板截图" width="80%">
  <p>系统仪表板</p>
</div>

## 贡献指南

欢迎贡献代码或提出问题，请遵循以下步骤：

1. Fork本仓库
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个Pull Request

## 许可证

本项目采用MIT许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

项目负责人 - your.email@example.com

项目链接: [https://github.com/yourusername/dbmis](https://github.com/yourusername/dbmis) 