# DBMIS 数据库设计文档

## 1. 数据库概述

DBMIS系统采用MySQL关系型数据库作为数据存储引擎，数据库名为`dbmis`。数据库设计遵循第三范式（3NF）原则，确保数据结构的合理性、完整性和无冗余性。

数据库主要存储以下几类数据：
- 用户账号和权限信息
- 地区信息（江苏省13个设区市）
- 业务分类和服务信息
- 业务数据统计信息

## 2. 数据表设计

### 2.1 用户表 (users)

存储系统用户信息，包括管理员和普通用户。

| 字段名      | 数据类型         | 约束                 | 描述                          |
|-------------|------------------|----------------------|-------------------------------|
| id          | INT              | PRIMARY KEY, AUTO_INCREMENT | 用户ID，自增主键             |
| username    | VARCHAR(50)      | NOT NULL, UNIQUE     | 用户名，唯一                  |
| password    | VARCHAR(255)     | NOT NULL             | 密码哈希（bcrypt加密）        |
| name        | VARCHAR(100)     | NOT NULL             | 用户真实姓名                  |
| email       | VARCHAR(100)     |                      | 用户邮箱                      |
| role        | ENUM             | NOT NULL, DEFAULT 'user' | 用户角色（admin/manager/user） |
| status      | ENUM             | NOT NULL, DEFAULT 'active' | 账号状态（active/inactive）   |
| last_login  | DATETIME         |                      | 最后登录时间                  |
| created_by  | INT              | FOREIGN KEY          | 创建者ID，关联users表         |
| created_at  | DATETIME         | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 创建时间     |
| updated_by  | INT              | FOREIGN KEY          | 更新者ID，关联users表         |
| updated_at  | DATETIME         | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

**索引**:
- PRIMARY KEY (id)
- UNIQUE INDEX (username)
- INDEX (role)
- INDEX (status)

**示例数据**:
```sql
INSERT INTO users (username, password, name, role, created_at, updated_at)
VALUES ('admin', '$2b$10$KzM0bL/BWzzMNjrS5Lgj5.xxfr0KWSM4.n00S.m9LhsYwmIB8PyVe', '系统管理员', 'admin', NOW(), NOW());
```

### 2.2 地区表 (regions)

存储江苏省13个设区市信息。

| 字段名      | 数据类型         | 约束                 | 描述                          |
|-------------|------------------|----------------------|-------------------------------|
| id          | INT              | PRIMARY KEY, AUTO_INCREMENT | 地区ID，自增主键             |
| name        | VARCHAR(50)      | NOT NULL, UNIQUE     | 地区名称，唯一                |
| code        | VARCHAR(20)      |                      | 地区编码                      |
| status      | ENUM             | NOT NULL, DEFAULT 'active' | 状态（active/inactive）      |
| created_at  | DATETIME         | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 创建时间     |
| updated_at  | DATETIME         | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

**索引**:
- PRIMARY KEY (id)
- UNIQUE INDEX (name)
- INDEX (code)

**示例数据**:
```sql
INSERT INTO regions (name, code) VALUES 
('南京市', '320100'),
('无锡市', '320200'),
('徐州市', '320300'),
('常州市', '320400'),
('苏州市', '320500'),
('南通市', '320600'),
('连云港市', '320700'),
('淮安市', '320800'),
('盐城市', '320900'),
('扬州市', '321000'),
('镇江市', '321100'),
('泰州市', '321200'),
('宿迁市', '321300');
```

### 2.3 业务分类表 (business_categories)

存储业务分类信息。

| 字段名      | 数据类型         | 约束                 | 描述                          |
|-------------|------------------|----------------------|-------------------------------|
| id          | INT              | PRIMARY KEY, AUTO_INCREMENT | 分类ID，自增主键             |
| name        | VARCHAR(100)     | NOT NULL, UNIQUE     | 分类名称，唯一                |
| description | TEXT             |                      | 分类描述                      |
| status      | ENUM             | NOT NULL, DEFAULT 'active' | 状态（active/inactive）      |
| created_at  | DATETIME         | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 创建时间     |
| updated_at  | DATETIME         | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

**索引**:
- PRIMARY KEY (id)
- UNIQUE INDEX (name)

**示例数据**:
```sql
INSERT INTO business_categories (name, description) VALUES 
('广电独家', '广电独家业务类型'),
('频道回看', '频道回看业务类型'),
('互动增值', '互动增值业务类型'),
('互动基础点播', '互动基础点播业务类型'),
('互动业务总量', '互动业务总量数据');
```

### 2.4 业务服务表 (business_services)

存储具体业务服务信息。

| 字段名      | 数据类型         | 约束                 | 描述                          |
|-------------|------------------|----------------------|-------------------------------|
| id          | INT              | PRIMARY KEY, AUTO_INCREMENT | 服务ID，自增主键             |
| name        | VARCHAR(100)     | NOT NULL             | 服务名称                      |
| category_id | INT              | NOT NULL, FOREIGN KEY | 所属分类ID，关联business_categories表 |
| description | TEXT             |                      | 服务描述                      |
| status      | ENUM             | NOT NULL, DEFAULT 'active' | 状态（active/inactive）      |
| created_at  | DATETIME         | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 创建时间     |
| updated_at  | DATETIME         | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

**索引**:
- PRIMARY KEY (id)
- INDEX (name)
- INDEX (category_id)
- INDEX (status)

**外键约束**:
- FOREIGN KEY (category_id) REFERENCES business_categories(id) ON DELETE RESTRICT

**示例数据**:
```sql
INSERT INTO business_services (name, category_id, description) VALUES 
('爱艺在线', 1, '广电独家业务-爱艺在线'),
('孝乐华夏', 1, '广电独家业务-孝乐华夏'),
('名师空中课堂', 1, '广电独家业务-名师空中课堂');
```

### 2.5 业务数据表 (business_data)

存储各地区各业务的统计数据。

| 字段名      | 数据类型         | 约束                 | 描述                          |
|-------------|------------------|----------------------|-------------------------------|
| id          | INT              | PRIMARY KEY, AUTO_INCREMENT | 数据ID，自增主键             |
| year        | INT              | NOT NULL             | 年份                          |
| month       | INT              | NOT NULL             | 月份（1-12）                  |
| region_id   | INT              | NOT NULL, FOREIGN KEY | 地区ID，关联regions表         |
| service_id  | INT              | NOT NULL, FOREIGN KEY | 服务ID，关联business_services表 |
| value       | DECIMAL(15,2)    | DEFAULT 0            | 数据值                        |
| unit        | VARCHAR(20)      | DEFAULT ''           | 单位（如：人次、万元等）      |
| remark      | TEXT             |                      | 备注说明                      |
| created_by  | INT              | FOREIGN KEY          | 创建者ID，关联users表         |
| created_at  | DATETIME         | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 创建时间     |
| updated_by  | INT              | FOREIGN KEY          | 更新者ID，关联users表         |
| updated_at  | DATETIME         | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

**索引**:
- PRIMARY KEY (id)
- UNIQUE KEY unique_data (year, month, region_id, service_id) - 确保同一年月、同一地区、同一服务的数据唯一
- INDEX (year)
- INDEX (month)
- INDEX (region_id)
- INDEX (service_id)

**外键约束**:
- FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE RESTRICT
- FOREIGN KEY (service_id) REFERENCES business_services(id) ON DELETE RESTRICT
- FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
- FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL

**示例数据**:
```sql
INSERT INTO business_data (year, month, region_id, service_id, value, unit) VALUES 
(2023, 1, 1, 1, 1250.5, '人次'),
(2023, 1, 2, 1, 980.25, '人次'),
(2023, 1, 1, 17, 2345.75, '人次'),
(2023, 2, 1, 1, 1300.0, '人次');
```

## 3. 数据库关系图

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    users    │       │   regions   │       │ business_   │
│             │◄──────┼─────────────┼───────┤ categories  │
└──────┬──────┘       │             │       └──────┬──────┘
       │              └──────┬──────┘              │
       │                     │                      │
       │                     │                      │
       │                     │                      ▼
       │                     │              ┌─────────────┐
       ▼                     │              │  business_  │
┌─────────────┐             │              │  services   │
│   users     │             │              └──────┬──────┘
│ (自关联)    │             │                     │
└─────────────┘             │                     │
                            │                     │
                            ▼                     ▼
                      ┌─────────────────────────────┐
                      │       business_data         │
                      │                             │
                      └─────────────────────────────┘
```

## 4. 数据库初始化

数据库初始化分为两部分：表结构创建和初始数据填充。

### 4.1 表结构创建脚本 (structure.sql)

```sql
-- 创建数据库
CREATE DATABASE IF NOT EXISTS dbmis;
USE dbmis;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  role ENUM('admin', 'manager', 'user') NOT NULL DEFAULT 'user',
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  last_login DATETIME,
  created_by INT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_by INT,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 地区表，存储江苏省13个设区市信息
CREATE TABLE IF NOT EXISTS regions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  code VARCHAR(20),
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 业务分类表
CREATE TABLE IF NOT EXISTS business_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 具体业务表
CREATE TABLE IF NOT EXISTS business_services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category_id INT NOT NULL,
  description TEXT,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES business_categories(id) ON DELETE RESTRICT
);

-- 业务数据表，存储各地区各业务的统计数据
CREATE TABLE IF NOT EXISTS business_data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  year INT NOT NULL,
  month INT NOT NULL,
  region_id INT NOT NULL,
  service_id INT NOT NULL,
  value DECIMAL(15,2) DEFAULT 0,
  unit VARCHAR(20) DEFAULT '',
  remark TEXT,
  created_by INT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_by INT,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE RESTRICT,
  FOREIGN KEY (service_id) REFERENCES business_services(id) ON DELETE RESTRICT,
  UNIQUE KEY unique_data (year, month, region_id, service_id)
);
```

### 4.2 初始数据填充脚本 (initdata.sql)

```sql
USE dbmis;

-- 创建初始管理员账号
INSERT INTO users (username, password, name, role, created_at, updated_at)
VALUES ('admin', '$2b$10$KzM0bL/BWzzMNjrS5Lgj5.xxfr0KWSM4.n00S.m9LhsYwmIB8PyVe', '系统管理员', 'admin', NOW(), NOW());

-- 插入江苏省13个设区市数据
INSERT INTO regions (name, code) VALUES 
('南京市', '320100'),
('无锡市', '320200'),
('徐州市', '320300'),
('常州市', '320400'),
('苏州市', '320500'),
('南通市', '320600'),
('连云港市', '320700'),
('淮安市', '320800'),
('盐城市', '320900'),
('扬州市', '321000'),
('镇江市', '321100'),
('泰州市', '321200'),
('宿迁市', '321300');

-- 插入业务分类数据
INSERT INTO business_categories (name, description) VALUES 
('广电独家', '广电独家业务类型'),
('频道回看', '频道回看业务类型'),
('互动增值', '互动增值业务类型'),
('互动基础点播', '互动基础点播业务类型'),
('互动业务总量', '互动业务总量数据');

-- 插入业务服务数据
INSERT INTO business_services (name, category_id, description) VALUES 
('爱艺在线', 1, '广电独家业务-爱艺在线'),
('孝乐华夏', 1, '广电独家业务-孝乐华夏'),
('名师空中课堂', 1, '广电独家业务-名师空中课堂');

-- 插入示例业务数据
INSERT INTO business_data (year, month, region_id, service_id, value, unit) VALUES 
(2023, 1, 1, 1, 1250.5, '人次'),
(2023, 1, 2, 1, 980.25, '人次');
```

## 5. 数据库查询示例

### 5.1 基础查询

获取所有业务分类及其服务数量：

```sql
SELECT 
  bc.id, 
  bc.name, 
  bc.description, 
  COUNT(bs.id) AS service_count 
FROM 
  business_categories bc 
LEFT JOIN 
  business_services bs ON bc.id = bs.category_id 
WHERE 
  bc.status = 'active' 
GROUP BY 
  bc.id 
ORDER BY 
  bc.id;
```

### 5.2 复杂查询

获取特定年月各地区各分类的业务数据汇总：

```sql
SELECT 
  r.name AS region_name,
  bc.name AS category_name,
  SUM(bd.value) AS total_value,
  bd.unit
FROM 
  business_data bd
JOIN 
  regions r ON bd.region_id = r.id
JOIN 
  business_services bs ON bd.service_id = bs.id
JOIN 
  business_categories bc ON bs.category_id = bc.id
WHERE 
  bd.year = 2023 AND bd.month = 1
GROUP BY 
  r.id, bc.id, bd.unit
ORDER BY 
  r.id, bc.id;
```

### 5.3 业务分析查询

获取特定业务服务的月度趋势数据：

```sql
SELECT 
  bd.month,
  r.name AS region_name,
  SUM(bd.value) AS total_value
FROM 
  business_data bd
JOIN 
  regions r ON bd.region_id = r.id
WHERE 
  bd.year = 2023 AND
  bd.service_id = 1
GROUP BY 
  bd.month, r.id
ORDER BY 
  bd.month, r.id;
```

## 6. 数据库维护与优化

### 6.1 索引优化

为提高查询性能，系统对常用查询条件和连接字段创建了适当的索引。主要包括：

- 业务数据表的年份、月份字段
- 各表的外键字段
- 各表的状态字段

### 6.2 数据库备份策略

系统采用以下备份策略保证数据安全：

- **每日增量备份**：每天凌晨对前一天变更的数据进行备份
- **每周全量备份**：每周日进行一次全量数据库备份
- **备份文件存储**：备份文件存储在独立的备份服务器上，保留期限为30天

### 6.3 性能监控

系统对数据库性能进行监控，主要关注以下指标：

- 慢查询日志：记录执行时间超过500ms的SQL查询
- 连接池使用情况：监控连接池的使用率和等待数
- 服务器资源使用情况：CPU、内存、磁盘I/O等

## 7. 数据库扩展计划

随着业务增长，数据库可能面临的挑战及相应的扩展计划：

### 7.1 数据量增长扩展方案

- **分表策略**：按年度对业务数据表进行水平分表，如business_data_2023, business_data_2024
- **归档策略**：历史数据（如超过3年的数据）移至归档表，减轻主表负担

### 7.2 高可用方案

- **主从复制**：配置MySQL主从复制，读写分离
- **多主方案**：考虑采用MySQL Group Replication或ProxySQL等解决方案

### 7.3 安全加固方案

- **数据加密**：敏感字段采用加密存储
- **访问控制**：细化数据库用户权限，实施最小权限原则
- **审计日志**：启用MySQL审计功能，记录关键操作 