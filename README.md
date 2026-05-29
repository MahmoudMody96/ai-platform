# AI Platform - منصة الذكاء الاصطناعي العربية

> منصة شاملة لأدوات الذكاء الاصطناعي مع لوحة تحكم كاملة وإدارة API

## 🚀 Quick Start

```bash
cd D:\MAHMOUD\projects\ai-platform
npm run dev
# Open: http://localhost:3000
# Admin: http://localhost:3000/admin
```

## 📁 Project Structure

```
ai-platform/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── layout.tsx             # Root layout (RTL, Arabic)
│   │   ├── globals.css            # Design system
│   │   ├── tools/                # Tools pages
│   │   │   ├── page.tsx          # Tools list
│   │   │   └── [slug]/           # Tool detail
│   │   ├── blog/                 # Blog pages
│   │   ├── categories/           # Categories pages
│   │   ├── dashboard/            # User dashboard
│   │   ├── auth/                 # Authentication
│   │   └── admin/                # Admin Dashboard
│   │       ├── page.tsx          # Dashboard home
│   │       ├── tools/            # Tools management
│   │       ├── articles/         # Articles management
│   │       ├── categories/       # Categories management
│   │       ├── users/            # Users management
│   │       ├── comments/         # Comments management
│   │       ├── api/              # API Management
│   │       └── settings/         # Settings
│   ├── components/
│   │   ├── ui/                  # UI components
│   │   ├── admin/               # Admin components
│   │   ├── search/              # Search components
│   │   ├── reviews/             # Reviews components
│   │   └── favorites/          # Favorites components
│   ├── lib/
│   │   ├── utils.ts            # Utilities
│   │   └── supabase/           # Supabase clients
│   ├── hooks/                   # React hooks
│   ├── contexts/                # React contexts (Auth)
│   └── types/                   # TypeScript types
```

## ✨ Features

### Landing Page
- Hero section مع بحث متقدم
- إحصائيات المنصة
- شبكة الفئات
- الأدوات المميزة
- Call-to-action للتسجيل

### Tools Pages (`/tools`)
- عرض شبكي/قائمة للأدوات
- بحث وفلترة متقدمة
- صفحة تفاصيل كل أداة مع:
  - المراجعات والتقييمات
  - معلومات التسعير
  - البدائل المشابهة
  - مشاركة على السوشيال ميديا

### Admin Dashboard (`/admin`)
- **Dashboard**: إحصائيات، رسوم بيانية، النشاط الأخير
- **Tools**: إضافة/تعديل/حذف أدوات AI
- **Articles**: إدارة المقالات
- **Categories**: إدارة الفئات
- **Users**: إدارة المستخدمين
- **Comments**: مراجعة التعليقات
- **API**: إدارة مفاتيح API
- **Settings**: إعدادات المنصة

### API Endpoints

```
Base URL: /api

Tools:
  GET    /tools           # List all tools
  POST   /tools           # Create new tool
  GET    /tools/[id]      # Get tool by ID
  PUT    /tools/[id]      # Update tool
  DELETE /tools/[id]      # Delete tool

Articles:
  GET    /articles        # List all articles
  POST   /articles        # Create new article
  GET    /articles/[id]   # Get article by ID
  PUT    /articles/[id]   # Update article
  DELETE /articles/[id]   # Delete article

Categories:
  GET    /categories      # List all categories
  POST   /categories      # Create new category
  GET    /categories/[id] # Get category by ID
  PUT    /categories/[id] # Update category
  DELETE /categories/[id] # Delete category

Admin:
  GET    /admin/users           # List users
  PUT    /admin/users           # Update user
  DELETE /admin/users/[id]      # Delete user
  GET    /admin/comments        # List comments
  PUT    /admin/comments        # Update comment
  DELETE /admin/comments/[id]   # Delete comment

Other:
  GET    /search?q=            # Search tools/articles
  POST   /newsletter           # Subscribe to newsletter
  GET    /favorites            # User favorites
  POST   /favorites            # Add to favorites
  GET    /reviews              # Get reviews
  POST   /reviews              # Create review
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| UI | Tailwind CSS + Custom Components |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| State | React Context + Hooks |
| Icons | Lucide React |
| TypeScript | Strict mode |

## 📝 API Usage Examples

### List Tools
```bash
curl -X GET 'http://localhost:3000/api/tools'
```

### Create Tool
```bash
curl -X POST 'http://localhost:3000/api/tools' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "ChatGPT",
    "slug": "chatgpt",
    "description": "مساعد ذكي للمحادثة",
    "pricing_type": "freemium",
    "website_url": "https://chat.openai.com",
    "category_id": "1"
  }'
```

### Search
```bash
curl -X GET 'http://localhost:3000/api/search?q=كتابة'
```

## 🎨 Design System

- **Colors**: Indigo (Primary), Cyan (Secondary), Amber (Accent)
- **Direction**: RTL (Right-to-Left)
- **Font**: IBM Plex Sans Arabic
- **Components**: Card, Badge, Button, Input, DataTable, Modal, Dialog

## 🔐 Authentication

- Demo credentials (development):
  - Admin: `admin@aiplatform.com` / `admin123`
  - User: `user@aiplatform.com` / `user123`

## 📄 License

MIT
