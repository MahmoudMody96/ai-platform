// =============================================
// Admin Login Page Layout
// No auth protection - this is the login page
// =============================================

import { AuthProvider } from '@/contexts/AuthContext';

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
