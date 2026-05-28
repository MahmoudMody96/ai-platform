// =============================================
// Admin - Settings Page
// =============================================

'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Save, Mail, Bell, Shield, Palette, Loader2, Check } from 'lucide-react';

interface SettingsFormData {
  // General
  siteName: string;
  siteUrl: string;
  siteEmail: string;
  siteDescription: string;
  
  // Email
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
  
  // Notifications
  notifyComment: boolean;
  notifyTool: boolean;
  notifyUser: boolean;
  notifyNewsletter: boolean;
  notifyReports: boolean;
  
  // Appearance
  primaryColor: string;
  direction: 'rtl' | 'ltr';
  darkMode: boolean;
}

const initialFormData: SettingsFormData = {
  siteName: 'منصة الذكاء الاصطناعي',
  siteUrl: 'https://aiplatform.com',
  siteEmail: 'contact@aiplatform.com',
  siteDescription: 'منصتك الأولى لاكتشاف وتعلم أدوات الذكاء الاصطناعي باللغة العربية',
  smtpHost: 'smtp.resend.com',
  smtpPort: '587',
  smtpUser: '',
  smtpPassword: '',
  fromEmail: 'noreply@aiplatform.com',
  fromName: 'AI Platform',
  notifyComment: true,
  notifyTool: true,
  notifyUser: false,
  notifyNewsletter: true,
  notifyReports: true,
  primaryColor: '#6366f1',
  direction: 'rtl',
  darkMode: false,
};

export default function AdminSettingsPage() {
  const [formData, setFormData] = React.useState<SettingsFormData>(initialFormData);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const handleSave = async (section: string) => {
    try {
      setSaving(true);
      setSaved(false);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would save to the database
      console.log('Saving settings for section:', section, formData);
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const colorPresets = [
    { name: 'بنفسجي', color: '#6366F1' },
    { name: 'وردي', color: '#EC4899' },
    { name: 'أخضر', color: '#10B981' },
    { name: 'برتقالي', color: '#F59E0B' },
    { name: 'أزرق', color: '#3B82F6' },
    { name: 'بنفسجي داكن', color: '#8B5CF6' },
    { name: 'تركواز', color: '#14B8A6' },
    { name: 'أحمر', color: '#EF4444' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">الإعدادات</h2>
        <p className="text-muted-foreground">إدارة إعدادات المنصة</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="justify-start">
          <TabsTrigger value="general" className="gap-2"><Shield className="w-4 h-4" />عام</TabsTrigger>
          <TabsTrigger value="email" className="gap-2"><Mail className="w-4 h-4" />البريد</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2"><Bell className="w-4 h-4" />الإشعارات</TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2"><Palette className="w-4 h-4" />المظهر</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>الإعدادات العامة</CardTitle>
              <CardDescription>معلومات المنصة الأساسية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">اسم المنصة</label>
                <Input 
                  value={formData.siteName} 
                  onChange={(e) => setFormData({...formData, siteName: e.target.value})}
                  placeholder="اسم المنصة"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">رابط المنصة</label>
                <Input 
                  value={formData.siteUrl} 
                  onChange={(e) => setFormData({...formData, siteUrl: e.target.value})}
                  placeholder="https://..."
                  type="url"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">البريد الإلكتروني</label>
                <Input 
                  value={formData.siteEmail} 
                  onChange={(e) => setFormData({...formData, siteEmail: e.target.value})}
                  placeholder="contact@example.com"
                  type="email"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">وصف المنصة</label>
                <textarea 
                  className="w-full h-24 p-3 rounded-lg border border-input text-sm bg-background"
                  value={formData.siteDescription} 
                  onChange={(e) => setFormData({...formData, siteDescription: e.target.value})}
                  placeholder="وصف مختصر للمنصة..."
                />
              </div>
              <div className="flex items-center gap-4">
                <Button onClick={() => handleSave('general')} disabled={saving} className="gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {saved ? 'تم الحفظ!' : 'حفظ التغييرات'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات البريد الإلكتروني</CardTitle>
              <CardDescription>إعدادات إرسال البريد الإلكتروني عبر SMTP</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">خادم SMTP</label>
                  <Input 
                    value={formData.smtpHost} 
                    onChange={(e) => setFormData({...formData, smtpHost: e.target.value})}
                    placeholder="smtp.resend.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">المنفذ</label>
                  <Input 
                    value={formData.smtpPort} 
                    onChange={(e) => setFormData({...formData, smtpPort: e.target.value})}
                    placeholder="587"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">اسم المستخدم</label>
                  <Input 
                    value={formData.smtpUser} 
                    onChange={(e) => setFormData({...formData, smtpUser: e.target.value})}
                    placeholder="username"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">كلمة المرور</label>
                  <Input 
                    value={formData.smtpPassword} 
                    onChange={(e) => setFormData({...formData, smtpPassword: e.target.value})}
                    type="password"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">بريد المرسل</label>
                  <Input 
                    value={formData.fromEmail} 
                    onChange={(e) => setFormData({...formData, fromEmail: e.target.value})}
                    placeholder="noreply@example.com"
                    type="email"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">اسم المرسل</label>
                  <Input 
                    value={formData.fromName} 
                    onChange={(e) => setFormData({...formData, fromName: e.target.value})}
                    placeholder="AI Platform"
                  />
                </div>
              </div>
              <div className="pt-4 border-t">
                <Button onClick={() => handleSave('email')} disabled={saving} className="gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {saved ? 'تم الحفظ!' : 'حفظ'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الإشعارات</CardTitle>
              <CardDescription>تحكم في أنواع الإشعارات التي تستلمها</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {/* Comment Notification */}
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <label htmlFor="notify-comment" className="text-sm font-medium cursor-pointer">
                      إشعار عند إضافة تعليق جديد
                    </label>
                    <p className="text-xs text-muted-foreground">ستصلك إشعار عند كل تعليق جديد على المحتوى</p>
                  </div>
                  <Switch 
                    id="notify-comment" 
                    checked={formData.notifyComment}
                    onCheckedChange={(checked) => setFormData({...formData, notifyComment: checked})}
                  />
                </div>

                {/* Tool Notification */}
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <label htmlFor="notify-tool" className="text-sm font-medium cursor-pointer">
                      إشعار عند إضافة أداة جديدة
                    </label>
                    <p className="text-xs text-muted-foreground">ستصلك إشعار عند إضافة أدوات جديدة للمنصة</p>
                  </div>
                  <Switch 
                    id="notify-tool" 
                    checked={formData.notifyTool}
                    onCheckedChange={(checked) => setFormData({...formData, notifyTool: checked})}
                  />
                </div>

                {/* User Notification */}
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <label htmlFor="notify-user" className="text-sm font-medium cursor-pointer">
                      إشعار عند تسجيل مستخدم جديد
                    </label>
                    <p className="text-xs text-muted-foreground">ستصلك إشعار عند كل مستخدم جديد</p>
                  </div>
                  <Switch 
                    id="notify-user" 
                    checked={formData.notifyUser}
                    onCheckedChange={(checked) => setFormData({...formData, notifyUser: checked})}
                  />
                </div>

                {/* Newsletter */}
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <label htmlFor="notify-newsletter" className="text-sm font-medium cursor-pointer">
                      النشرة البريدية اليومية
                    </label>
                    <p className="text-xs text-muted-foreground">ملخص يومي بأحدث الأدوات والمقالات</p>
                  </div>
                  <Switch 
                    id="notify-newsletter" 
                    checked={formData.notifyNewsletter}
                    onCheckedChange={(checked) => setFormData({...formData, notifyNewsletter: checked})}
                  />
                </div>

                {/* Reports */}
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <label htmlFor="notify-reports" className="text-sm font-medium cursor-pointer">
                      تقارير أسبوعية
                    </label>
                    <p className="text-xs text-muted-foreground">تقارير أسبوعية عن أداء المنصة</p>
                  </div>
                  <Switch 
                    id="notify-reports" 
                    checked={formData.notifyReports}
                    onCheckedChange={(checked) => setFormData({...formData, notifyReports: checked})}
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button onClick={() => handleSave('notifications')} disabled={saving} className="gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {saved ? 'تم الحفظ!' : 'حفظ'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>المظهر</CardTitle>
              <CardDescription>إعدادات شكل المنصة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Primary Color */}
              <div>
                <label className="text-sm font-medium mb-3 block">اللون الأساسي</label>
                <div className="flex flex-wrap gap-3">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.color}
                      onClick={() => setFormData({...formData, primaryColor: preset.color})}
                      className={`w-12 h-12 rounded-lg border-2 transition-all hover:scale-105 ${
                        formData.primaryColor === preset.color 
                          ? 'border-foreground ring-2 ring-offset-2 ring-offset-background' 
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: preset.color }}
                      title={preset.name}
                    />
                  ))}
                  <input
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({...formData, primaryColor: e.target.value})}
                    className="w-12 h-12 rounded-lg border border-input cursor-pointer"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  اللون الحالي: <span style={{ color: formData.primaryColor }}>{formData.primaryColor}</span>
                </p>
              </div>

              {/* Direction */}
              <div>
                <label className="text-sm font-medium mb-2 block">اتجاه النص</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="direction"
                      value="rtl"
                      checked={formData.direction === 'rtl'}
                      onChange={() => setFormData({...formData, direction: 'rtl'})}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">من اليمين لليسار (RTL)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="direction"
                      value="ltr"
                      checked={formData.direction === 'ltr'}
                      onChange={() => setFormData({...formData, direction: 'ltr'})}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">من اليسار لليمين (LTR)</span>
                  </label>
                </div>
              </div>

              {/* Dark Mode */}
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div>
                  <label htmlFor="dark-mode" className="text-sm font-medium cursor-pointer">
                    الوضع الداكن
                  </label>
                  <p className="text-xs text-muted-foreground">تفعيل المظهر الداكن للمنصة</p>
                </div>
                <Switch 
                  id="dark-mode" 
                  checked={formData.darkMode}
                  onCheckedChange={(checked) => setFormData({...formData, darkMode: checked})}
                />
              </div>

              <div className="pt-4 border-t">
                <Button onClick={() => handleSave('appearance')} disabled={saving} className="gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {saved ? 'تم الحفظ!' : 'حفظ'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
