'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Sparkles, Search, Star } from 'lucide-react';

const categories = [
  { 
    name: 'الكتابة', 
    icon: '✍️', 
    count: 150, 
    color: '#6366F1',
    description: 'أدوات لكتابة المحتوى، المقالات، والكتابة الإبداعية',
    featuredTools: ['ChatGPT', 'Claude', 'Notion AI', 'Jasper']
  },
  { 
    name: 'التصميم', 
    icon: '🎨', 
    count: 120, 
    color: '#EC4899',
    description: 'أدوات تصميم الجرافيك وتوليد الصور',
    featuredTools: ['Midjourney', 'DALL-E 3', 'Canva AI']
  },
  { 
    name: 'التطوير', 
    icon: '💻', 
    count: 180, 
    color: '#10B981',
    description: 'أدوات البرمجة وتطوير البرمجيات',
    featuredTools: ['GitHub Copilot', 'Perplexity']
  },
  { 
    name: 'الأتمتة', 
    icon: '⚡', 
    count: 90, 
    color: '#F59E0B',
    description: 'أدوات لأتمتة المهام والعمليات',
    featuredTools: ['Zapier', 'Make']
  },
  { 
    name: 'التسويق', 
    icon: '📊', 
    count: 110, 
    color: '#3B82F6',
    description: 'أدوات التسويق الرقمي والإعلانات',
    featuredTools: ['Jasper', 'Gamma']
  },
  { 
    name: 'الفيديو', 
    icon: '🎬', 
    count: 80, 
    color: '#8B5CF6',
    description: 'أدوات إنتاج وتحرير الفيديو',
    featuredTools: ['Runway', 'Descript']
  },
  { 
    name: 'التعليم', 
    icon: '📚', 
    count: 70, 
    color: '#14B8A6',
    description: 'أدوات للتعلم والتعليم',
    featuredTools: ['Khanmigo', 'Duolingo']
  },
  { 
    name: 'البحث', 
    icon: '🔍', 
    count: 60, 
    color: '#F97316',
    description: 'محركات بحث ذكية وأدوات بحث',
    featuredTools: ['Perplexity', 'Phind']
  },
  { 
    name: 'الصوت', 
    icon: '🎙️', 
    count: 45, 
    color: '#EF4444',
    description: 'أدوات تحويل النص إلى صوت وتعديل الصوت',
    featuredTools: ['ElevenLabs', 'Murf AI']
  },
  { 
    name: 'العروض', 
    icon: '📽️', 
    count: 40, 
    color: '#84CC16',
    description: 'أدوات لإنشاء العروض التقديمية',
    featuredTools: ['Gamma', 'Tome']
  },
];

const allTools = [
  { name: 'ChatGPT', url: '/tools/1', category: 'الكتابة', pricing: 'freemium', rating: 4.8 },
  { name: 'Midjourney', url: '/tools/2', category: 'التصميم', pricing: 'paid', rating: 4.7 },
  { name: 'Claude', url: '/tools/3', category: 'الكتابة', pricing: 'freemium', rating: 4.9 },
  { name: 'GitHub Copilot', url: '/tools/4', category: 'التطوير', pricing: 'paid', rating: 4.6 },
  { name: 'DALL-E 3', url: '/tools/5', category: 'التصميم', pricing: 'paid', rating: 4.7 },
  { name: 'ElevenLabs', url: '/tools/6', category: 'الصوت', pricing: 'freemium', rating: 4.8 },
  { name: 'Notion AI', url: '/tools/7', category: 'الكتابة', pricing: 'paid', rating: 4.5 },
  { name: 'Canva AI', url: '/tools/8', category: 'التصميم', pricing: 'freemium', rating: 4.4 },
  { name: 'Jasper', url: '/tools/9', category: 'التسويق', pricing: 'paid', rating: 4.3 },
  { name: 'Runway', url: '/tools/10', category: 'الفيديو', pricing: 'paid', rating: 4.6 },
  { name: 'Perplexity', url: '/tools/11', category: 'البحث', pricing: 'freemium', rating: 4.7 },
  { name: 'Gamma', url: '/tools/12', category: 'العروض', pricing: 'freemium', rating: 4.5 },
];

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  const filteredTools = selectedCategory
    ? allTools.filter(tool => tool.category === selectedCategory)
    : allTools;

  const searchedTools = searchQuery
    ? filteredTools.filter(tool => 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredTools;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container-custom">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">AI Platform</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">الرئيسية</Link>
              <Link href="/tools" className="text-sm text-muted-foreground hover:text-foreground">الأدوات</Link>
              <Link href="/categories" className="text-sm font-medium text-primary">الفئات</Link>
              <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground">لوحة التحكم</Link>
            </nav>
            <Link href="/admin"><Button size="sm">الدخول للأدمن</Button></Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-custom py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">الفئات</h1>
          <p className="text-muted-foreground">تصفح الأدوات حسب الفئة</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">الفئات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-start px-4 py-3 rounded-lg transition-colors ${
                    !selectedCategory 
                      ? 'bg-primary text-white' 
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>جميع الفئات</span>
                    <Badge variant="secondary">{allTools.length}</Badge>
                  </div>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full text-start px-4 py-3 rounded-lg transition-colors ${
                      selectedCategory === cat.name 
                        ? 'bg-primary text-white' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{cat.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{cat.name}</span>
                          <Badge variant="secondary">{cat.count}</Badge>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Tools Grid */}
          <div className="lg:col-span-3">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="ابحث في الفئة..."
                  className="ps-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Selected Category Info */}
            {selectedCategory && (
              <Card className="mb-6" style={{ borderColor: categories.find(c => c.name === selectedCategory)?.color }}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                      style={{ backgroundColor: `${categories.find(c => c.name === selectedCategory)?.color}20` }}
                    >
                      {categories.find(c => c.name === selectedCategory)?.icon}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold mb-1">{selectedCategory}</h2>
                      <p className="text-muted-foreground mb-3">
                        {categories.find(c => c.name === selectedCategory)?.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">
                          {categories.find(c => c.name === selectedCategory)?.count} أداة
                        </Badge>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedCategory(null)}
                    >
                      مسح الفلتر
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results Count */}
            <div className="mb-4">
              <p className="text-muted-foreground">
                تم العثور على {searchedTools.length} أداة
              </p>
            </div>

            {/* Tools */}
            {searchedTools.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchedTools.map((tool) => (
                  <Link key={tool.name} href={tool.url}>
                    <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center text-xl font-bold text-primary">
                            {tool.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold hover:text-primary">{tool.name}</h3>
                            <Badge variant="outline" className="mt-1">{tool.category}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-accent fill-accent" />
                            <span className="text-sm font-medium">{tool.rating}</span>
                          </div>
                          <Badge variant={tool.pricing === 'free' ? 'success' : tool.pricing === 'freemium' ? 'info' : 'secondary'}>
                            {tool.pricing === 'free' ? 'مجاني' : tool.pricing === 'freemium' ? 'مجاني + مدفوع' : 'مدفوع'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">لم يتم العثور على أدوات</h3>
                  <p className="text-muted-foreground mb-4">جرب البحث بكلمات مختلفة</p>
                  <Button 
                    variant="outline"
                    onClick={() => setSearchQuery('')}
                  >
                    مسح البحث
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-border mt-16">
        <div className="container-custom text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold">AI Platform</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 AI Platform. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
