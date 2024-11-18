import { Montserrat } from 'next/font/google';  // google font import
import { ThemeProvider } from '@/components/theme-provider';  // theme context provider
import { Toaster } from '@/components/ui/toaster';  // notification toaster component
import { AuthProvider } from '@/components/auth-provider';  // authentication context provider
import { cn } from '@/lib/utils';  // utility function for classnames
import './globals.css';  // global styles import

// font configuration
const montserrat = Montserrat({ subsets: ['latin'] });

// page metadata
export const metadata = {
  title: 'healthpredict AI - Chronic Condition Management Platform',
  description: 'AI-powered health prediction and monitoring platform for chronic conditions',
};

// root layout component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>  
      <body className={cn(
        'min-h-screen bg-background font-sans antialiased',
        montserrat.className
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}  
            <Toaster />  
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
