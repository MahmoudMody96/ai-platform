// =============================================
// UI Components - Input, Textarea, Select
// =============================================

import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { error?: string; icon?: React.ReactNode }>(
  ({ className, type, error, icon, ...props }, ref) => (
    <div className="relative w-full">
      {icon && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</div>}
      <input type={type} className={cn("flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50", icon && "pr-10", error && "border-error", className)} ref={ref} {...props} />
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  )
);
Input.displayName = "Input";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }>(
  ({ className, error, ...props }, ref) => (
    <div className="w-full">
      <textarea className={cn("flex min-h-32 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50 resize-none", error && "border-error", className)} ref={ref} {...props} />
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  )
);
Textarea.displayName = "Textarea";

const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & { error?: string }>(
  ({ className, error, children, ...props }, ref) => (
    <div className="w-full">
      <select className={cn("flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50", error && "border-error", className)} ref={ref} {...props}>
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  )
);
Select.displayName = "Select";

export { Input, Textarea, Select };