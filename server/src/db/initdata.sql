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

-- 插入广电独家业务数据
INSERT INTO business_services (name, category_id, description) VALUES 
('爱艺在线', 1, '广电独家业务-爱艺在线'),
('孝乐华夏', 1, '广电独家业务-孝乐华夏'),
('名师空中课堂', 1, '广电独家业务-名师空中课堂'),
('致敬经典', 1, '广电独家业务-致敬经典'),
('残疾人之家', 1, '广电独家业务-残疾人之家'),
('地方新闻', 1, '广电独家业务-地方新闻'),
('淮海e站', 1, '广电独家业务-淮海e站'),
('紫金文艺', 1, '广电独家业务-紫金文艺'),
('新冠康复专区', 1, '广电独家业务-新冠康复专区'),
('听8', 1, '广电独家业务-听8'),
('公安在线/反炸专区', 1, '广电独家业务-公安在线/反炸专区'),
('视界头条', 1, '广电独家业务-视界头条'),
('方志江苏', 1, '广电独家业务-方志江苏'),
('何以长江', 1, '广电独家业务-何以长江'),
('江苏演艺天地', 1, '广电独家业务-江苏演艺天地'),
('老年学习', 1, '广电独家业务-老年学习');

-- 插入互动增值业务数据
INSERT INTO business_services (name, category_id, description) VALUES 
('奇异影视', 3, '互动增值业务-奇异影视'),
('炫力少儿', 3, '互动增值业务-炫力少儿'),
('百视通', 3, '互动增值业务-百视通'),
('芒果', 3, '互动增值业务-芒果'),
('卡拉OK', 3, '互动增值业务-卡拉OK'),
('百映优生活', 3, '互动增值业务-百映优生活'),
('电竞视频', 3, '互动增值业务-电竞视频'),
('探奇动物界', 3, '互动增值业务-探奇动物界'),
('亲子乐园', 3, '互动增值业务-亲子乐园'),
('学霸宝盒', 3, '互动增值业务-学霸宝盒'),
('越剧专区', 3, '互动增值业务-越剧专区'),
('央视精选', 3, '互动增值业务-央视精选'),
('极视影院', 3, '互动增值业务-极视影院'),
('淘淘电竞', 3, '互动增值业务-淘淘电竞'),
('云电竞', 3, '互动增值业务-云电竞'),
('酷喵', 3, '互动增值业务-酷喵'),
('哔哩哔哩', 3, '互动增值业务-哔哩哔哩'),
('短剧', 3, '互动增值业务-短剧'),
('腾讯-云视听极光', 3, '互动增值业务-腾讯-云视听极光'),
('聚有趣', 3, '互动增值业务-聚有趣'),
('欢视少儿', 3, '互动增值业务-欢视少儿'),
('凤凰观天下', 3, '互动增值业务-凤凰观天下');

-- 插入互动基础点播业务数据
INSERT INTO business_services (name, category_id, description) VALUES 
('点8', 4, '互动基础点播业务-点8');

-- 频道回看业务
INSERT INTO business_services (name, category_id, description) VALUES 
('频道回看', 2, '频道回看业务');

-- 互动业务总量
INSERT INTO business_services (name, category_id, description) VALUES 
('互动业务总量', 5, '互动业务总量统计');

-- 插入示例业务数据
INSERT INTO business_data (year, month, region_id, service_id, value, unit) VALUES 
(2023, 1, 1, 1, 1250.5, '人次'),
(2023, 1, 2, 1, 980.25, '人次'),
(2023, 1, 1, 17, 2345.75, '人次'),
(2023, 2, 1, 1, 1300.0, '人次'); 