"use client";
import type { SectionName } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import { LogOut } from 'lucide-react';
import Link from 'next/link'; // Import Link
import { USER_ROLES } from '@/lib/types'; // Import USER_ROLES

interface HeaderProps {
  activeTab: SectionName;
  onTabChange: (tab: SectionName) => void;
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

  return (    <header className="bg-[#1d3557] text-white shadow-md fixed top-0 left-0 right-0 z-50 py-3 md:py-2 header-nav">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="text-2xl font-bold mb-2 md:mb-0 text-[#f1faee]">桃園獵鷹宇宙</div>
        {isAuthenticated && (          <nav className="w-full md:w-auto">
            <ul className="flex flex-wrap justify-center md:justify-start items-center gap-1 md:gap-0 md:space-x-2">
              {navItems.map((item) => (
                <li key={item.id} className="mb-1 md:mb-0">
                  <Button
                    variant="ghost"
                    onClick={() => onTabChange(item.id)}
                    className={cn(
                      "text-[#f1faee] hover:bg-[#457b9d]/40 hover:text-[#f1faee] px-2 py-1 md:px-3 md:py-1.5 transition-colors duration-200 text-sm md:text-base",
                      activeTab === item.id ? "border-b-2 border-[#e63946] text-[#e9c46a] font-medium" : ""
                    )}
                  >
                    {item.label}
                  </Button>
                </li>
              ))}
              {/* Add Admin link if user is admin */}
              {currentUserRole === USER_ROLES.ADMIN && (
                <li className="mb-1 md:mb-0">
                  <Link href="/admin" className="inline-block">
                    <Button
                      variant="ghost"
                      className="text-[#f1faee] hover:bg-[#457b9d]/40 hover:text-[#f1faee] px-2 py-1 md:px-3 md:py-1.5 transition-colors duration-200 text-sm md:text-base"
                    >
                      管理後台
                    </Button>
                  </Link>
                </li>
              )}
            </ul>
            <div className="flex justify-center md:justify-end mt-2 md:mt-3 items-center">
                <span className="text-xs md:text-sm text-[#f1faee]/80 mr-2">
                  {username} <span className="hidden md:inline">({currentUserRole})</span>
                </span>
                <Button
                  size="sm"
                  onClick={logout}
                  className="bg-[#e63946] text-white hover:bg-[#e63946]/90 font-semibold transition-colors duration-200 text-xs md:text-sm"
                >
                  <LogOut className="mr-1 h-3 w-3 md:h-4 md:w-4" />
                  登出
                </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
