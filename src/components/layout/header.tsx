"use client";
import type { UserRole, SectionName } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeaderProps {
  activeTab: SectionName;
  onTabChange: (tab: SectionName) => void;
  currentUserRole: UserRole;
  onLoginAsPlayer: () => void;
  onLoginAsCoach: () => void;
  onLogout: () => void;
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
  currentUserRole,
  onLoginAsPlayer,
  onLoginAsCoach,
  onLogout,
}: HeaderProps) {
  return (
    <header className="bg-primary text-primary-foreground shadow-md fixed top-0 left-0 right-0 z-50 py-3 md:py-2">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="text-2xl font-bold mb-2 md:mb-0">桃園獵鷹宇宙</div>
        <nav>
          <ul className="flex flex-wrap justify-center md:justify-start items-center space-x-1 md:space-x-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <Button
                  variant="ghost"
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "text-primary-foreground hover:bg-primary/80 hover:text-accent-foreground px-2 py-1 md:px-3 md:py-1.5",
                    activeTab === item.id ? "border-b-2 border-warning text-warning" : ""
                  )}
                >
                  {item.label}
                </Button>
              </li>
            ))}
            <li className="flex gap-1 md:gap-2 mt-2 md:mt-0 md:ml-4">
              {currentUserRole === 'guest' ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onLoginAsPlayer}
                    className="border-secondary text-secondary hover:bg-secondary/80 hover:text-primary-foreground"
                  >
                    球員登入
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onLoginAsCoach}
                    className="border-secondary text-primary-foreground hover:bg-secondary/80"
                  >
                    教練登入
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLogout}
                  className="border-accent text-primary-foreground hover:bg-accent/80"
                >
                  登出 ({currentUserRole})
                </Button>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
