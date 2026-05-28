'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/contexts/ThemeContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { StarRating } from '@/components/reviews/StarRating';
import {
  Sparkles, Heart, User, Settings, BookOpen, Loader2,
  Search, Trash2, ExternalLink, FolderOpen, ChevronLeft
} from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface SavedItem {
  id: string;
  tool_id: string | null;
  article_id: string | null;
  tool?: { id: string; name: string; slug: string; description?: string; logo_url?: string; rating?: number; pricing_model?: string };
  article?: { id: string; title: string; slug: string; excerpt?: string; cover_image_url?: string };
  created_at: string;
}

type Tab = 'saved' | 'reviews' | 'collections';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { favorites, removeFavorite, isLoading: favoritesLoading } = useFavorites();

  const [activeTab, setActiveTab] = React.useState<Tab>('saved');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [savedItems, setSavedItems] = React.useState<SavedItem[]>([]);
  const [loadingItems, setLoadingItems] = React.useState(false);

  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  // Fetch full tool/article details for favorites
  React.useEffect(() => {
    const fetchDetails = async () => {
      if (!favorites.length) {
        setSavedItems([]);
        return;
      }

      setLoadingItems(true);
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

      if (!supabaseUrl || !supabaseAnonKey) {
        setLoadingItems(false);
        return;
      }

      const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
      const items: SavedItem[] = [];

      for (const fav of favorites) {
        if (fav.tool_id) {
          const { data } = await supabase.from('tools').select('id, name, slug, description, logo_url, stats').eq('id', fav.tool_id).single();
          if (data) {
            items.push({ ...fav, tool: { ...data, rating: data.stats?.rating } });
          }
        } else if (fav.article_id) {
          const { data } = await supabase.from('articles').select('id, title, slug, excerpt, cover_image_url').eq('id', fav.article_id).single();
          if (data) {
            items.push({ ...fav, article: data });
          }
        }
      }

      setSavedItems(items);
      setLoadingItems(false);
    };

    fetchDetails();
  }, [favorites]);

  const handleRemove = async (id: string) => {
    await removeFavorite(id);
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const filteredItems = savedItems.filter(item => {
    if (!searchQuery) return true;
    const name = item.tool?.name ?? item.article?.title ?? '';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'saved', label: 'المحفوظات', icon: <Heart className="w-4 h-4" /> },
    { key: 'reviews', label: 'مراجعاتي', icon: <StarRating rating={0} size="sm" showValue={false} /> },
    { key: 'collections', label: 'المجموعات', icon: <FolderOpen className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container-custom">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">AI Platform</span>
            </Link>
            <nav className="hidden md:flex items-center gap-4">
              <Link href="/tools" className="text-sm text-muted-foreground hover:text-foreground">الأدوات</Link>
              <Link href="/dashboard" className="text-sm font-medium text-primary">لوحة التحكم</Link>
              <Link href="/auth/profile" className="text-sm text-muted-foreground hover:text-foreground">الملف الشخصي</Link>
            </nav>
            <div className="flex items-center gap-2">
              <ThemeToggle variant="ghost" />
              <Link href="/auth/profile">
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user.name}</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container-custom py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">مرحباً، {user.name}!</h1>
          <p className="text-muted-foreground">إليك ملخص نشاطك على المنصة</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Heart className="w-6 h-6 mx-auto mb-2 text-red-500" />
              <div className="text-2xl font-bold">{savedItems.length}</div>
              <p className="text-xs text-muted-foreground">عنصر محفوظ</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <StarRating rating={0} showValue={false} />
              <div className="text-2xl font-bold mt-1">0</div>
              <p className="text-xs text-muted-foreground">مراجعة</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <FolderOpen className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">مجموعة</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Settings className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
              <div className="text-2xl font-bold capitalize">{user.plan === 'free' ? 'مجاني' : user.plan}</div>
              <p className="text-xs text-muted-foreground">خطتك</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-border mb-6">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Saved Tab */}
        {activeTab === 'saved' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="ابحث في المحفوظات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ps-10 rtl:ps-3"
                />
              </div>
              <Link href="/tools">
                <Button variant="outline" size="sm" className="gap-1">
                  <Sparkles className="w-4 h-4" /> استكشف أدوات جديدة
                </Button>
              </Link>
            </div>

            {favoritesLoading || loadingItems ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {filteredItems.map(item => (
                  <Card key={item.id} className="group hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      {item.tool ? (
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center text-xl font-bold text-primary flex-shrink-0">
                            {item.tool.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link href={`/tools/${item.tool.slug}`} className="font-semibold group-hover:text-primary transition-colors line-clamp-1">
                              {item.tool.name}
                            </Link>
                            {item.tool.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.tool.description}</p>
                            )}
                            <div className="flex items-center justify-between mt-2">
                              {item.tool.rating ? (
                                <StarRating rating={item.tool.rating} size="sm" />
                              ) : <span />}
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="w-7 h-7 text-muted-foreground hover:text-destructive"
                                  onClick={() => handleRemove(item.id)}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                                <Link href={`/tools/${item.tool.slug}`}>
                                  <Button variant="ghost" size="icon" className="w-7 h-7">
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : item.article ? (
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary-100 to-primary-100 flex items-center justify-center text-xl flex-shrink-0">
                            <BookOpen className="w-5 h-5 text-secondary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link href={`/blog/${item.article.slug}`} className="font-semibold group-hover:text-primary transition-colors line-clamp-1">
                              {item.article.title}
                            </Link>
                            {item.article.excerpt && (
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.article.excerpt}</p>
                            )}
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: ar })}
                              </span>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="w-7 h-7 text-muted-foreground hover:text-destructive"
                                  onClick={() => handleRemove(item.id)}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
                <h3 className="text-lg font-semibold mb-2">لا توجد محفوظات</h3>
                <p className="text-muted-foreground mb-4">ابدأ بحفظ الأدوات والمقالات المفضلة لديك</p>
                <Link href="/tools">
                  <Button>استكشف الأدوات</Button>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="text-center py-16">
            <StarRating rating={0} showValue={false} />
            <h3 className="text-lg font-semibold mb-2 mt-4">لا توجد مراجعات</h3>
            <p className="text-muted-foreground">اكتب مراجعتك الأولى لأي أداة</p>
          </div>
        )}

        {/* Collections Tab */}
        {activeTab === 'collections' && (
          <div className="text-center py-16">
            <FolderOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
            <h3 className="text-lg font-semibold mb-2">المجموعات قريباً</h3>
            <p className="text-muted-foreground">أنشئ مجموعات من الأدوات والمقالات</p>
          </div>
        )}
      </main>
    </div>
  );
}
