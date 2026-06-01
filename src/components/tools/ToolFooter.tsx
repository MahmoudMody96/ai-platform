// =============================================
// ToolDetail - Footer
// =============================================

import { Sparkles } from 'lucide-react';

export function ToolFooter() {
  return (
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
  );
}
