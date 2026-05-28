// =============================================
// Blog Layout - RTL Arabic Design
// =============================================

import * as React from 'react';

export const metadata = {
  title: 'المدونة | منصة الذكاء الاصطناعي',
  description: 'مقالات يومية، شروحات تفصيلية، ومراجعات صادقة لأفضل أدوات AI بالعربية',
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen" dir="rtl">
      {children}
    </div>
  );
}
