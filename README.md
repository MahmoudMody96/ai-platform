# AI Platform - Arabic AI Platform

> منصة شاملة لأدوات الذكاء الاصطناعي مع لوحة تحكم كاملة

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
│   │   ├── layout.tsx           # Root layout
│   │   ├── globals.css          # Design system
│   │   └── admin/               # Admin Dashboard
│   │       ├── page.tsx         # Dashboard home
│   │       ├── tools/           # Tools management
│   │       ├── articles/        # Articles management
│   │       ├── categories/      # Categories management
│   │       ├── users/           # Users management
│   │       ├── comments/        # Comments management
│   │       ├── api/             # API Management ⭐
│   │       └── settings/        # Settings
│   ├── components/
│   │   ├── ui/                  # UI components
│   │   ├── admin/               # Admin components
│   │   └── dashboard/           # Dashboard components
│   ├── lib/
│   │   ├── utils/               # Utilities
│   │   └── supabase/            # Supabase clients
│   ├── hooks/                   # React hooks
│   └── types/                   # TypeScript types
```

## ✨ Features

### Landing Page
- Hero section with search
- Statistics (tools, users, etc.)
- Categories grid
- Featured tools
- Call-to-action

### Admin Dashboard (`/admin`)
- **Dashboard**: Stats, charts, recent activity
- **Tools**: Add/Edit/Delete AI tools
- **Articles**: Manage articles
- **Categories**: Manage categories
- **Users**: User management
- **Comments**: Comment moderation
- **API**: API keys management ⭐ (for Loxel automation)
- **Settings**: Platform settings

### API Management Section
```
┌─────────────────────────────────────────────────────────────┐
│  API Management                                             │
├─────────────────────────────────────────────────────────────┤
│  🔑 API Keys Tab                                            │
│     - Create new API keys                                   │
│     - View/Copy/Delete keys                                │
│     - Rate limits                                           │
│     - Last used tracking                                    │
│                                                             │
│  🔌 Endpoints Tab                                           │
│     - GET /api/v1/tools                                     │
│     - POST /api/v1/tools                                    │
│     - GET /api/v1/articles                                 │
│     - POST /api/v1/articles                                │
│     - GET /api/v1/categories                               │
│     - GET /api/v1/search                                   │
│                                                             │
│  📖 Docs Tab                                                │
│     - Authentication guide                                  │
│     - Usage examples (curl)                                 │
│     - Rate limits                                           │
│     - Response codes                                        │
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| UI | Tailwind CSS + Radix UI |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| State | Zustand + React Query |
| Icons | Lucide React |

## 📝 Usage

### Add a Tool via API
```bash
curl -X POST 'http://localhost:3000/api/v1/tools' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "New AI Tool",
    "slug": "new-ai-tool",
    "description": "Description here",
    "pricing_model": "freemium",
    "website_url": "https://example.com"
  }'
```

### List Tools via API
```bash
curl -X GET 'http://localhost:3000/api/v1/tools' \
  -H 'Authorization: Bearer YOUR_API_KEY'
```

## 🎨 Design System

- **Colors**: Indigo (Primary), Cyan (Secondary), Amber (Accent)
- **Direction**: RTL (Right-to-Left)
- **Font**: IBM Plex Sans Arabic
- **Components**: Card, Badge, Button, Input, DataTable, Modal

## 📄 License

MIT