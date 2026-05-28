// =============================================
// Admin API Management - API Keys & Docs
// =============================================

'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/modal';
import { generateApiKey, maskApiKey, copyToClipboard, formatRelativeTime } from '@/lib/utils';
import { Key, Plus, Copy, Trash2, Eye, EyeOff, Check, Code, Terminal, Zap } from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  prefix: string;
  permissions: string[];
  rate_limit: number;
  created_at: string;
  last_used: string | null;
  is_active: boolean;
}

const mockApiKeys: ApiKey[] = [
  { id: '1', name: 'Loxel Automation', key: 'aiplat_AbCdEfGh1234567890IjKlMnOp', prefix: 'aiplat_AbCd', permissions: ['tools:read', 'articles:read', 'categories:read'], rate_limit: 1000, created_at: '2026-05-20', last_used: '2026-05-28T10:30:00Z', is_active: true },
  { id: '2', name: 'Zapier Integration', key: 'aiplat_XyZwVuTs9876543210QaRsTuVw', prefix: 'aiplat_XyZw', permissions: ['tools:write', 'articles:write', 'categories:write'], rate_limit: 500, created_at: '2026-05-15', last_used: '2026-05-27T15:45:00Z', is_active: true },
];

const apiEndpoints = [
  { method: 'GET', path: '/api/v1/tools', description: 'جلب قائمة الأدوات', category: 'Tools' },
  { method: 'GET', path: '/api/v1/tools/:id', description: 'جلب أداة معينة', category: 'Tools' },
  { method: 'POST', path: '/api/v1/tools', description: 'إضافة أداة جديدة', category: 'Tools' },
  { method: 'PUT', path: '/api/v1/tools/:id', description: 'تحديث أداة', category: 'Tools' },
  { method: 'DELETE', path: '/api/v1/tools/:id', description: 'حذف أداة', category: 'Tools' },
  { method: 'GET', path: '/api/v1/articles', description: 'جلب قائمة المقالات', category: 'Articles' },
  { method: 'GET', path: '/api/v1/articles/:id', description: 'جلب مقال معين', category: 'Articles' },
  { method: 'POST', path: '/api/v1/articles', description: 'إضافة مقال جديد', category: 'Articles' },
  { method: 'GET', path: '/api/v1/categories', description: 'جلب الفئات', category: 'Categories' },
  { method: 'GET', path: '/api/v1/search', description: 'بحث شامل', category: 'Search' },
];

const methodColors: Record<string, string> = { GET: 'success', POST: 'info', PUT: 'warning', DELETE: 'error', PATCH: 'secondary' };

export function ApiManagement() {
  const [apiKeys, setApiKeys] = React.useState<ApiKey[]>(mockApiKeys);
  const [showKeyDialog, setShowKeyDialog] = React.useState(false);
  const [newKeyName, setNewKeyName] = React.useState('');
  const [newKey, setNewKey] = React.useState('');
  const [visibleKeys, setVisibleKeys] = React.useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const createApiKey = () => {
    const key = generateApiKey();
    const newKeyObj: ApiKey = {
      id: String(Date.now()),
      name: newKeyName || 'API Key',
      key,
      prefix: key.slice(0, 12),
      permissions: ['tools:read', 'articles:read', 'categories:read'],
      rate_limit: 1000,
      created_at: new Date().toISOString(),
      last_used: null,
      is_active: true,
    };
    setApiKeys([newKeyObj, ...apiKeys]);
    setNewKey(key);
    setNewKeyName('');
  };

  const toggleKeyVisibility = (id: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(id)) newVisible.delete(id);
    else newVisible.add(id);
    setVisibleKeys(newVisible);
  };

  const copyKey = async (key: string, id: string) => {
    await copyToClipboard(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">إدارة API</h2>
          <p className="text-muted-foreground">أنشئ مفاتيح API للتكامل مع لوكسيل وأدوات الأتمتة</p>
        </div>
        <Button onClick={() => setShowKeyDialog(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          إنشاء مفتاح جديد
        </Button>
      </div>

      <Tabs defaultValue="keys" className="space-y-6">
        <TabsList>
          <TabsTrigger value="keys" className="gap-2"><Key className="w-4 h-4" />المفاتيح</TabsTrigger>
          <TabsTrigger value="endpoints" className="gap-2"><Terminal className="w-4 h-4" />النقاط</TabsTrigger>
          <TabsTrigger value="docs" className="gap-2"><Code className="w-4 h-4" />التوثيق</TabsTrigger>
        </TabsList>

        {/* API Keys Tab */}
        <TabsContent value="keys">
          <Card>
            <CardHeader>
              <CardTitle>مفاتيح API النشطة</CardTitle>
              <CardDescription>المفاتيح المستخدمة للتكامل مع الأنظمة الخارجية</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiKeys.map((apiKey) => (
                  <div key={apiKey.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-primary-100">
                        <Key className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{apiKey.name}</p>
                          <Badge variant={apiKey.is_active ? 'success' : 'error'}>{apiKey.is_active ? 'نشط' : 'متوقف'}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground font-mono">
                          {visibleKeys.has(apiKey.id) ? apiKey.key : maskApiKey(apiKey.key)}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>الاستخدام: {apiKey.rate_limit}/min</span>
                          <span>آخر استخدام: {apiKey.last_used ? formatRelativeTime(apiKey.last_used) : 'لم يُستخدم'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon-sm" onClick={() => toggleKeyVisibility(apiKey.id)}>
                        {visibleKeys.has(apiKey.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => copyKey(apiKey.key, apiKey.id)}>
                        {copiedId === apiKey.id ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="icon-sm" className="text-error hover:bg-error-light">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Endpoints Tab */}
        <TabsContent value="endpoints">
          <Card>
            <CardHeader>
              <CardTitle>نقاط API المتاحة</CardTitle>
              <CardDescription>جميع نقاط API المتاحة للاستخدام</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {apiEndpoints.map((endpoint, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50">
                    <Badge variant={methodColors[endpoint.method] as 'success' | 'info' | 'warning' | 'error' | 'secondary'}>{endpoint.method}</Badge>
                    <code className="flex-1 font-mono text-sm">{endpoint.path}</code>
                    <span className="text-sm text-muted-foreground">{endpoint.description}</span>
                    <Badge variant="outline">{endpoint.category}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Docs Tab */}
        <TabsContent value="docs">
          <Card>
            <CardHeader>
              <CardTitle>توثيق API</CardTitle>
              <CardDescription>دليل شامل لاستخدام API المنصة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2"><Zap className="w-4 h-4 text-primary" />البداية</h3>
<div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  <p className="text-muted-foreground">// Example: Get all tools</p>
                  <p>curl -X GET https://api.aiplatform.com/v1/tools \</p>
                  <p>-H Authorization: Bearer YOUR_API_KEY \</p>
                  <p>-H Content-Type: application/json</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">المصادقة</h3>
                <p className="text-sm text-muted-foreground mb-2">استخدم مفتاح API في رأس Authorization:</p>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  <p>Authorization: Bearer aiplat_XXXXXXXXXXXXXXXX</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">الحدود</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 1000 طلب في الدقيقة للمفاتيح العادية</li>
                  <li>• 5000 طلب في الدقيقة للمفاتيح المميزة</li>
                  <li>• الحد الأقصى لحجم الطلب: 1MB</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">الأكواد</h3>
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div className="p-2 bg-success-light text-success rounded">200 OK</div>
                  <div className="p-2 bg-error-light text-error rounded">401 Unauthorized</div>
                  <div className="p-2 bg-warning-light text-warning rounded">429 Rate Limited</div>
                  <div className="p-2 bg-error-light text-error rounded">500 Server Error</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Key Dialog */}
      <Dialog open={showKeyDialog} onOpenChange={setShowKeyDialog}>
        <DialogContent>
          {newKey ? (
            <>
              <DialogHeader>
                <DialogTitle>تم إنشاء المفتاح!</DialogTitle>
                <DialogDescription>انسخ هذا المفتاح الآن. لن يظهر مرة أخرى.</DialogDescription>
              </DialogHeader>
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-mono text-sm break-all">{newKey}</p>
              </div>
              <DialogFooter>
                <Button onClick={() => { copyToClipboard(newKey); }} className="gap-2"><Copy className="w-4 h-4" />نسخ</Button>
                <Button variant="outline" onClick={() => { setNewKey(''); setShowKeyDialog(false); }}>إغلاق</Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>إنشاء مفتاح API جديد</DialogTitle>
                <DialogDescription>أدخل اسم للمفتاح لتمييزه</DialogDescription>
              </DialogHeader>
              <Input placeholder="مثال: Loxel Automation" value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} className="my-4" />
              <DialogFooter>
                <Button onClick={createApiKey} className="gap-2"><Key className="w-4 h-4" />إنشاء</Button>
                <Button variant="outline" onClick={() => setShowKeyDialog(false)}>إلغاء</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}