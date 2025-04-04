# DBMIS API 接口文档

本文档详细描述了DBMIS系统提供的所有API接口，包括请求方法、URL、参数说明和响应格式。

## 基础信息

- 基础URL: `http://localhost:3001/api`
- 所有POST请求的Content-Type应为`application/json`
- 接口需要认证的，请在请求头中添加`Authorization: Bearer {token}`

## 响应格式

所有API响应均为JSON格式，包含以下基本字段：

```json
{
  "status": "success" | "error",  // 响应状态
  "message": "...",               // 状态描述（可选）
  "data": { ... }                 // 响应数据（成功时）
}
```

## 错误码说明

| 状态码 | 说明               |
|--------|-------------------|
| 200    | 请求成功           |
| 201    | 创建成功           |
| 400    | 请求参数错误       |
| 401    | 未认证/认证失败    |
| 403    | 权限不足           |
| 404    | 资源不存在         |
| 500    | 服务器内部错误     |

## 认证相关接口

### 登录

- **URL**: `/auth/login`
- **方法**: `POST`
- **描述**: 用户登录接口
- **请求参数**:

```json
{
  "username": "admin",  // 用户名
  "password": "admin"   // 密码
}
```

- **响应示例**:

```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5...",
  "user": {
    "id": 1,
    "username": "admin",
    "name": "系统管理员",
    "role": "admin",
    "status": "active",
    "email": "admin@example.com",
    "last_login": "2023-04-01T12:30:45.000Z"
  }
}
```

### 获取当前用户信息

- **URL**: `/auth/me`
- **方法**: `GET`
- **描述**: 获取当前登录用户的详细信息
- **认证**: 需要
- **响应示例**:

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "username": "admin",
    "name": "系统管理员",
    "role": "admin",
    "status": "active",
    "email": "admin@example.com",
    "last_login": "2023-04-01T12:30:45.000Z"
  }
}
```

### 修改密码

- **URL**: `/auth/change-password`
- **方法**: `POST`
- **描述**: 修改当前用户密码
- **认证**: 需要
- **请求参数**:

```json
{
  "oldPassword": "当前密码",
  "newPassword": "新密码"
}
```

- **响应示例**:

```json
{
  "status": "success",
  "message": "密码修改成功"
}
```

## 用户管理接口

### 获取所有用户

- **URL**: `/users`
- **方法**: `GET`
- **描述**: 获取所有用户的列表
- **认证**: 需要
- **权限**: 仅管理员可访问
- **查询参数**:
  - `page`: 页码（默认1）
  - `limit`: 每页条数（默认10）
  - `status`: 用户状态筛选（可选）
  - `search`: 搜索关键词（可选）
- **响应示例**:

```json
{
  "status": "success",
  "data": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "items": [
      {
        "id": 1,
        "username": "admin",
        "name": "系统管理员",
        "role": "admin",
        "status": "active",
        "email": "admin@example.com",
        "last_login": "2023-04-01T12:30:45.000Z"
      },
      // ...更多用户
    ]
  }
}
```

### 获取单个用户

- **URL**: `/users/:id`
- **方法**: `GET`
- **描述**: 获取指定ID的用户详细信息
- **认证**: 需要
- **权限**: 管理员可访问所有用户，普通用户只能访问自己
- **响应示例**:

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "username": "admin",
    "name": "系统管理员",
    "role": "admin",
    "status": "active",
    "email": "admin@example.com",
    "last_login": "2023-04-01T12:30:45.000Z",
    "created_at": "2023-01-01T10:00:00.000Z",
    "updated_at": "2023-01-01T10:00:00.000Z"
  }
}
```

### 创建用户

- **URL**: `/users`
- **方法**: `POST`
- **描述**: 创建新用户
- **认证**: 需要
- **权限**: 仅管理员可访问
- **请求参数**:

```json
{
  "username": "newuser",
  "password": "password123",
  "name": "新用户",
  "email": "newuser@example.com",
  "role": "user",
  "status": "active"
}
```

- **响应示例**:

```json
{
  "status": "success",
  "message": "用户创建成功",
  "data": {
    "id": 26,
    "username": "newuser",
    "name": "新用户",
    "role": "user",
    "status": "active"
  }
}
```

### 更新用户

- **URL**: `/users/:id`
- **方法**: `PUT`
- **描述**: 更新指定ID的用户信息
- **认证**: 需要
- **权限**: 管理员可更新所有用户，普通用户只能更新自己的非权限信息
- **请求参数**:

```json
{
  "name": "更新的名称",
  "email": "updated@example.com",
  "status": "inactive"
}
```

- **响应示例**:

```json
{
  "status": "success",
  "message": "用户更新成功",
  "data": {
    "id": 26,
    "username": "newuser",
    "name": "更新的名称",
    "email": "updated@example.com",
    "status": "inactive"
  }
}
```

### 删除用户

- **URL**: `/users/:id`
- **方法**: `DELETE`
- **描述**: 删除指定ID的用户
- **认证**: 需要
- **权限**: 仅管理员可访问
- **响应示例**:

```json
{
  "status": "success",
  "message": "用户删除成功"
}
```

## 业务数据接口

### 获取业务分类

- **URL**: `/business/categories`
- **方法**: `GET`
- **描述**: 获取所有业务分类
- **认证**: 需要
- **响应示例**:

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "广电独家",
      "description": "广电独家业务类型",
      "status": "active"
    },
    {
      "id": 2,
      "name": "频道回看",
      "description": "频道回看业务类型",
      "status": "active"
    },
    // ... 更多分类
  ]
}
```

### 获取业务服务

- **URL**: `/business/services`
- **方法**: `GET`
- **描述**: 获取所有业务服务
- **认证**: 需要
- **查询参数**:
  - `category_id`: 按分类ID筛选（可选）
  - `status`: 按状态筛选（可选）
- **响应示例**:

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "爱艺在线",
      "category_id": 1,
      "category_name": "广电独家",
      "description": "广电独家业务-爱艺在线",
      "status": "active"
    },
    // ... 更多服务
  ]
}
```

### 获取地区列表

- **URL**: `/business/regions`
- **方法**: `GET`
- **描述**: 获取所有地区
- **认证**: 需要
- **响应示例**:

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "南京市",
      "code": "320100",
      "status": "active"
    },
    // ... 更多地区
  ]
}
```

### 获取业务数据

- **URL**: `/business/data`
- **方法**: `GET`
- **描述**: 获取业务数据
- **认证**: 需要
- **查询参数**:
  - `year`: 年份（必填）
  - `month`: 月份（可选）
  - `region_id`: 地区ID（可选）
  - `service_id`: 服务ID（可选）
  - `category_id`: 分类ID（可选）
- **响应示例**:

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "year": 2023,
      "month": 1,
      "region_id": 1,
      "region_name": "南京市",
      "service_id": 1,
      "service_name": "爱艺在线",
      "category_id": 1,
      "category_name": "广电独家",
      "value": 1250.5,
      "unit": "人次"
    },
    // ... 更多数据
  ]
}
```

### 新增业务数据

- **URL**: `/business/data`
- **方法**: `POST`
- **描述**: 新增业务数据
- **认证**: 需要
- **请求参数**:

```json
{
  "year": 2023,
  "month": 3,
  "region_id": 1,
  "service_id": 1,
  "value": 1500.75,
  "unit": "人次",
  "remark": "数据备注"
}
```

- **响应示例**:

```json
{
  "status": "success",
  "message": "数据添加成功",
  "data": {
    "id": 5,
    "year": 2023,
    "month": 3,
    "region_id": 1,
    "service_id": 1,
    "value": 1500.75
  }
}
```

### 更新业务数据

- **URL**: `/business/data/:id`
- **方法**: `PUT`
- **描述**: 更新业务数据
- **认证**: 需要
- **请求参数**:

```json
{
  "value": 1600.25,
  "remark": "更新的备注"
}
```

- **响应示例**:

```json
{
  "status": "success",
  "message": "数据更新成功"
}
```

### 删除业务数据

- **URL**: `/business/data/:id`
- **方法**: `DELETE`
- **描述**: 删除业务数据
- **认证**: 需要
- **响应示例**:

```json
{
  "status": "success",
  "message": "数据删除成功"
}
```

## 数据分析接口

### 获取地区业务概览

- **URL**: `/data/region-overview`
- **方法**: `GET`
- **描述**: 获取地区业务数据概览
- **认证**: 需要
- **查询参数**:
  - `year`: 年份（必填）
  - `month`: 月份（可选）
- **响应示例**:

```json
{
  "status": "success",
  "data": {
    "regions": ["南京市", "无锡市", "徐州市", "..."],
    "categories": ["广电独家", "频道回看", "互动增值", "..."],
    "dataset": [
      {
        "region": "南京市",
        "values": [12500, 8500, 15000, "..."]
      },
      // ... 更多地区数据
    ]
  }
}
```

### 获取业务服务分布

- **URL**: `/data/service-distribution`
- **方法**: `GET`
- **描述**: 获取业务服务数据分布
- **认证**: 需要
- **查询参数**:
  - `year`: 年份（必填）
  - `month`: 月份（可选）
  - `region_id`: 地区ID（可选）
  - `category_id`: 分类ID（可选）
- **响应示例**:

```json
{
  "status": "success",
  "data": {
    "services": ["爱艺在线", "孝乐华夏", "..."],
    "values": [12500, 8500, "..."]
  }
}
```

### 获取趋势分析数据

- **URL**: `/data/trend-analysis`
- **方法**: `GET`
- **描述**: 获取业务数据趋势分析
- **认证**: 需要
- **查询参数**:
  - `year`: 年份（必填）
  - `region_id`: 地区ID（可选）
  - `service_id`: 服务ID（可选）
  - `category_id`: 分类ID（可选）
- **响应示例**:

```json
{
  "status": "success",
  "data": {
    "months": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    "series": [
      {
        "name": "南京市",
        "data": [12500, 13000, 12800, "..."]
      },
      // ... 更多地区或服务的数据
    ]
  }
}
```

## 系统管理接口

### 获取系统日志

- **URL**: `/system/logs`
- **方法**: `GET`
- **描述**: 获取系统操作日志
- **认证**: 需要
- **权限**: 仅管理员可访问
- **查询参数**:
  - `page`: 页码（默认1）
  - `limit`: 每页条数（默认20）
  - `start_date`: 开始日期（可选）
  - `end_date`: 结束日期（可选）
  - `user_id`: 用户ID（可选）
  - `action`: 操作类型（可选）
- **响应示例**:

```json
{
  "status": "success",
  "data": {
    "total": 156,
    "page": 1,
    "limit": 20,
    "items": [
      {
        "id": 1,
        "user_id": 1,
        "username": "admin",
        "action": "登录",
        "details": "用户登录成功",
        "ip": "192.168.1.100",
        "created_at": "2023-04-01T12:30:45.000Z"
      },
      // ... 更多日志
    ]
  }
}
``` 