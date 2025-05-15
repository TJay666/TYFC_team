
"use client";
import type { UserRole, SectionName } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import { LogOut } from 'lucide-react';

interface HeaderProps {
  activeTab: SectionName;
  onTabChange: (tab: SectionName) => void;
  // currentUserRole, onLoginAsPlayer, onLoginAsCoach, onLogout are removed as they are handled by AuthContext
}

const navItems: { id: SectionName; label: string }[] = [
  { id: 'matches', label: '比賽管理' },
  { id: 'leagues', label: '聯賽管理' },
  { id: 'players', label: '球員管理' },
  { id: 'statistics', label: '統計數據' },
];

export function Header({
  activeTab,
  onTabChange,
}: HeaderProps) {
  const { currentUserRole, username, logout, isAuthenticated } = useAuth();

  return (
    <header className="bg-primary text-primary-foreground shadow-md fixed top-0 left-0 right-0 z-50 py-3 md:py-2">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="text-2xl font-bold mb-2 md:mb-0">桃園獵鷹宇宙</div>
        {isAuthenticated && (
          <nav>
            <ul className="flex flex-wrap justify-center md:justify-start items-center space-x-1 md:space-x-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <Button
                    variant="ghost"
                    onClick={() => onTabChange(item.id)}
                    className={cn(
                      "text-primary-foreground hover:bg-primary/80 hover:text-accent-foreground px-2 py-1 md:px-3 md:py-1.5",
                      activeTab === item.id ? "border-b-2 border-accent text-accent" : "" // Use accent for active tab indicator
                    )}
                  >
                    {item.label}
                  </Button>
                </li>
              ))}
              <li className="flex gap-1 md:gap-2 mt-2 md:mt-0 md:ml-4 items-center">
                <span className="text-sm hidden md:inline">
                  角色: {currentUserRole} | 使用者: {username}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="border-accent text-accent hover:bg-accent hover:text-accent-foreground font-semibold"
                >
                  <LogOut className="mr-1.5 h-4 w-4" />
                  登出
                </Button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
