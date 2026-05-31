'use client';

import * as React from 'react';
import Link from 'next/link';
import { Sparkles, Plus, Check, Loader2, ArrowRight, X } from 'lucide-react';
import { ThemeToggle } from '@/contexts/ThemeContext';

// AL.AI.DY Colors
const colors = {
  violet: { primary: '#8B5CF6', light: '#A78BFA', dark: '#7C3AED' },
  cyan: { primary: '#06B6D4', light: '#22D3EE', dark: '#0891B2' },
  amber: { primary: '#F59E0B', light: '#FBBF24', dark: '#D97706' },
  emerald: { primary: '#10B981', light: '#34D399', dark: '#059669' },
  rose: { primary: '#EC4899', light: '#F472B6', dark: '#DB2777' },
};

const categories = [
  { value: 'ai-assistants', label: 'مساعدون ذكيون' },
  { value: 'image-generation', label: 'توليد الصور' },
  { value: 'automation', label: 'أتمتة' },
  { value: 'coding', label: 'برمجة' },
  { value: 'audio', label: 'صوت' },
  { value: 'video', label: 'فيديو' },
  { value: 'search', label: 'بحث' },
  { value: 'writing', label: 'كتابة' },
];

const pricingOptions = [
  { value: 'free', label: 'مجاني' },
  { value: 'freemium', label: 'مجاني + مدفوع' },
  { value: 'paid', label: 'مدفوع' },
  { value: 'contact', label: 'تواصل للسعر' },
];

interface FormData {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  website_url: string;
  logo_url: string;
  category: string;
  pricing_type: string;
  starting_price: string;
  features: string[];
  pros: string[];
  cons: string[];
  is_featured: boolean;
}

export default function AddToolPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const [formData, setFormData] = React.useState<FormData>({
    name: '',
    slug: '',
    tagline: '',
    description: '',
    website_url: '',
    logo_url: '',
    category: '',
    pricing_type: '',
    starting_price: '',
    features: [''],
    pros: ['', ''],
    cons: ['', ''],
    is_featured: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Auto-generate slug from name
    if (name === 'name') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\u0600-\u06FF\s]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      setFormData(prev => ({ ...prev, slug }));
    }

    // Clear error on change
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleArrayChange = (field: 'features' | 'pros' | 'cons', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'features' | 'pros' | 'cons') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'features' | 'pros' | 'cons', index: number) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'اسم الأداة مطلوب';
    if (!formData.slug.trim()) newErrors.slug = 'الرابط مطلوب';
    if (!formData.description.trim()) newErrors.description = 'الوصف مطلوب';
    if (!formData.website_url.trim()) newErrors.website_url = 'رابط الموقع مطلوب';
    if (!formData.category) newErrors.category = 'اختر التصنيف';
    if (!formData.pricing_type) newErrors.pricing_type = 'اختر نوع التسعير';
    
    // Validate URL format
    if (formData.website_url && !/^https?:\/\/.+/.test(formData.website_url)) {
      newErrors.website_url = 'أدخل رابط صحيح (يبدأ بـ http:// أو https://)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real app, send to API
      console.log('Submitting tool:', {
        ...formData,
        features: formData.features.filter(f => f.trim()),
        pros: formData.pros.filter(p => p.trim()),
        cons: formData.cons.filter(c => c.trim()),
      });

      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting tool:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: colors.emerald.primary + '20' }}
          >
            <Check className="w-10 h-10" style={{ color: colors.emerald.primary }} />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-4">شكراً لك! 🎉</h1>
          <p className="text-muted-foreground mb-8">
            تم استلام طلبك بنجاح. سنراجع الأداة ونضيفها في أقرب وقت.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/tools"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-all"
              style={{ background: `linear-gradient(135deg, ${colors.violet.primary}, ${colors.cyan.primary})` }}
            >
              استكشف الأدوات <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: '', slug: '', tagline: '', description: '',
                  website_url: '', logo_url: '', category: '', pricing_type: '',
                  starting_price: '', features: [''], pros: ['', ''], cons: ['', ''],
                  is_featured: false,
                });
              }}
              className="px-6 py-3 rounded-xl font-medium border border-border hover:border-violet-500 transition-colors"
            >
              أضف أداة أخرى
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container-custom">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${colors.violet.primary}, ${colors.cyan.primary})` }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span 
                className="text-xl font-bold"
                style={{ background: `linear-gradient(135deg, ${colors.violet.primary}, ${colors.cyan.primary})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                AL.AI.DY
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/" className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">الرئيسية</Link>
              <Link href="/tools" className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">الأدوات</Link>
              <Link href="/blog" className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">المدونة</Link>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container-custom py-8 max-w-3xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${colors.violet.primary}, ${colors.cyan.primary})` }}
            >
              <Plus className="w-6 h-6 text-white" />
            </div>
            أضف أداة جديدة
          </h1>
          <p className="text-muted-foreground">
            شاركنا أداة الذكاء الاصطناعي المفضلة لديك وأضفها لقاعدة البيانات
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="rounded-2xl bg-card border border-border/50 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold" style={{ backgroundColor: colors.violet.primary + '20', color: colors.violet.primary }}>1</span>
              المعلومات الأساسية
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  اسم الأداة <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="مثال: ChatGPT"
                  className={`w-full px-4 py-3 rounded-xl bg-background border ${errors.name ? 'border-rose-500' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all`}
                />
                {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  الرابط (Slug) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="chatgpt"
                  dir="ltr"
                  className={`w-full px-4 py-3 rounded-xl bg-background border ${errors.slug ? 'border-rose-500' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all`}
                />
                <p className="text-xs text-muted-foreground mt-1">alaidy.vercel.app/tools/{formData.slug || '...'}</p>
                {errors.slug && <p className="text-xs text-rose-500 mt-1">{errors.slug}</p>}
              </div>
            </div>

            {/* Tagline */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">شعار الأداة (Tagline)</label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                placeholder="أذكى مساعد ذكي في العالم"
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                الوصف <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="صف الأداة بالتفصيل..."
                className={`w-full px-4 py-3 rounded-xl bg-background border ${errors.description ? 'border-rose-500' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all resize-none`}
              />
              {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description}</p>}
            </div>
          </div>

          {/* Links */}
          <div className="rounded-2xl bg-card border border-border/50 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold" style={{ backgroundColor: colors.cyan.primary + '20', color: colors.cyan.primary }}>2</span>
              الروابط
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Website URL */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  رابط الموقع <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  name="website_url"
                  value={formData.website_url}
                  onChange={handleChange}
                  placeholder="https://chat.openai.com"
                  dir="ltr"
                  className={`w-full px-4 py-3 rounded-xl bg-background border ${errors.website_url ? 'border-rose-500' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all`}
                />
                {errors.website_url && <p className="text-xs text-rose-500 mt-1">{errors.website_url}</p>}
              </div>

              {/* Logo URL */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">رابط الشعار (Logo)</label>
                <input
                  type="url"
                  name="logo_url"
                  value={formData.logo_url}
                  onChange={handleChange}
                  placeholder="https://example.com/logo.png"
                  dir="ltr"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Category & Pricing */}
          <div className="rounded-2xl bg-card border border-border/50 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold" style={{ backgroundColor: colors.rose.primary + '20', color: colors.rose.primary }}>3</span>
              التصنيف والتسعير
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  التصنيف <span className="text-rose-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl bg-background border ${errors.category ? 'border-rose-500' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all cursor-pointer`}
                >
                  <option value="">اختر التصنيف</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
                {errors.category && <p className="text-xs text-rose-500 mt-1">{errors.category}</p>}
              </div>

              {/* Pricing */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  نوع التسعير <span className="text-rose-500">*</span>
                </label>
                <select
                  name="pricing_type"
                  value={formData.pricing_type}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl bg-background border ${errors.pricing_type ? 'border-rose-500' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all cursor-pointer`}
                >
                  <option value="">اختر نوع التسعير</option>
                  {pricingOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                {errors.pricing_type && <p className="text-xs text-rose-500 mt-1">{errors.pricing_type}</p>}
              </div>
            </div>

            {/* Starting Price */}
            {formData.pricing_type === 'paid' && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">السعر المبدئي (بالدولار)</label>
                <input
                  type="number"
                  name="starting_price"
                  value={formData.starting_price}
                  onChange={handleChange}
                  placeholder="10"
                  min="0"
                  step="1"
                  dir="ltr"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                />
              </div>
            )}
          </div>

          {/* Features */}
          <div className="rounded-2xl bg-card border border-border/50 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold" style={{ backgroundColor: colors.emerald.primary + '20', color: colors.emerald.primary }}>4</span>
              المميزات
            </h2>

            <div className="space-y-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleArrayChange('features', index, e.target.value)}
                    placeholder={`ميزة ${index + 1}`}
                    className="flex-1 px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('features', index)}
                      className="p-3 rounded-xl hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('features')}
                className="flex items-center gap-2 text-sm text-violet-500 hover:text-violet-600 transition-colors"
              >
                <Plus className="w-4 h-4" /> إضافة ميزة أخرى
              </button>
            </div>
          </div>

          {/* Pros & Cons */}
          <div className="rounded-2xl bg-card border border-border/50 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold" style={{ backgroundColor: colors.amber.primary + '20', color: colors.amber.primary }}>5</span>
              المميزات والعيوب
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Pros */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <span className="text-emerald-500">✓</span> المميزات
                </label>
                <div className="space-y-3">
                  {formData.pros.map((pro, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={pro}
                        onChange={(e) => handleArrayChange('pros', index, e.target.value)}
                        placeholder={`ميزة ${index + 1}`}
                        className="flex-1 px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                      />
                      {formData.pros.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('pros', index)}
                          className="p-3 rounded-xl hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('pros')}
                    className="flex items-center gap-2 text-sm text-emerald-500 hover:text-emerald-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> إضافة ميزة
                  </button>
                </div>
              </div>

              {/* Cons */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <span className="text-rose-500">✗</span> العيوب
                </label>
                <div className="space-y-3">
                  {formData.cons.map((con, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={con}
                        onChange={(e) => handleArrayChange('cons', index, e.target.value)}
                        placeholder={`عيب ${index + 1}`}
                        className="flex-1 px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                      />
                      {formData.cons.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('cons', index)}
                          className="p-3 rounded-xl hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('cons')}
                    className="flex items-center gap-2 text-sm text-rose-500 hover:text-rose-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> إضافة عيب
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between gap-4">
            <Link 
              href="/tools"
              className="px-6 py-3 rounded-xl font-medium border border-border hover:border-violet-500 transition-colors"
            >
              إلغاء
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: `linear-gradient(135deg, ${colors.violet.primary}, ${colors.cyan.primary})` }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  إرسال الأداة
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border mt-16 bg-card/50">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${colors.violet.primary}, ${colors.cyan.primary})` }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span 
                className="text-xl font-bold"
                style={{ background: `linear-gradient(135deg, ${colors.violet.primary}, ${colors.cyan.primary})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                AL.AI.DY
              </span>
            </div>
            <p className="text-sm text-muted-foreground">© 2026 AL.AI.DY. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
