# phortay
# 菩提食堂 Phor Tay — 餐厅全栈管理系统

一个面向中小餐饮商户的全栈网站，涵盖菜单管理、在线预订、多语言支持和管理员后台，商户可自主管理全部内容。

## 技术栈

- **前端**：原生 HTML / CSS / JavaScript（单文件 SPA）
- **后端 & 数据库**：Supabase（PostgreSQL + Auth + Row Level Security）
- **图片托管**：Cloudinary
- **字体**：Google Fonts（Playfair Display + Source Sans 3 + DM Mono）
- **版本管理**：GitHub

## 功能特性

### 用户端
- 首页 Hero 展示 + 招牌推荐
- 菜单浏览（分类筛选 + 菜品详情 + 上下架状态展示）
- 在线预订（表单提交 → 写入数据库）
- 关于我们 / 联系方式页面
- 三语言切换（中文 / English / Bahasa Malaysia）
- 用户注册与登录（管理员审批制）
- 响应式设计（移动端汉堡菜单 + 自适应布局）

### 管理后台
- 仪表盘（菜品数、分类数、预订统计）
- 首页内容管理（Hero 图片/标题/副标题、推荐菜品选择）
- 菜单管理（菜品 CRUD、分类管理、上下架切换、Cloudinary 图片上传）
- 预订管理（查看全部预订、状态流转：待确认 → 已确认 / 已取消）
- 站点信息管理（关于我们、联系方式）

## 数据结构

| 表名 | 说明 |
|------|------|
| profiles | 用户资料（id, name, email, role, avatar_url） |
| categories | 菜品分类（id, name, sort_order + 多语言字段） |
| menu_items | 菜品（id, name, desc, price, image_url, category_id, is_available, sort_order + 多语言字段） |
| reservations | 预订记录（id, guest_name, email, phone, date, time, party_size, notes, status, user_id） |
| site_settings | 站点配置（key-value 存储 hero / about / contact / featured_ids） |

## 多语言架构

菜品名称与描述以字段级多语言存储（name_en / name_zh / name_ms），前端根据当前语言动态拼接字段名，回退至 _en 默认语言。UI 文本通过翻译对象 T 实现三语全覆盖。

## 开发工具

| 工具 | 用途 |
|------|------|
| MiMo v2.5 Pro | 全栈代码生成、数据库设计、调试排错 |
| Claude Code | 代码审查、架构建议 |
| Reptile | 资源采集与数据整理 |

本项目由零编程基础通过 AI 辅助独立完成。MiMo v2.5 Pro 承担了核心开发工作，包括 Supabase Auth 流程设计、数据库表结构、前端 CRUD 逻辑、Cloudinary 集成和响应式布局的代码生成与调试。
