import { Link, useRouterState } from '@tanstack/react-router';
import { LayoutDashboard, History, FileText, Activity, Heart, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Prediction History', href: '/prediction-history', icon: History },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Health Analytics', href: '/health-analytics', icon: Activity },
  { name: 'Recommendations', href: '/recommendations', icon: Lightbulb },
];

export default function Sidebar() {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-card/80 backdrop-blur-sm border-r border-border/40 flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-lg">
            <Heart className="w-6 h-6 text-primary-foreground fill-current" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Health Analytics</h1>
            <p className="text-xs text-muted-foreground">Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = currentPath === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                'hover:bg-primary/10 hover:translate-x-1',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer info */}
      <div className="p-4 border-t border-border/40">
        <div className="text-xs text-muted-foreground text-center">
          <p className="font-semibold text-foreground mb-1">AI-Powered Health</p>
          <p>Risk Assessment Tool</p>
        </div>
      </div>
    </aside>
  );
}
