import React from 'react';
import { 
  LayoutDashboard, 
  Mic, 
  FileSearch, 
  Sprout, 
  FileText, 
  ShieldCheck 
} from 'lucide-react';

interface BottomNavProps {
  currentScreen: number;
  onSelectScreen: (screenIndex: number) => void;
  pendingBadges?: {
    rxPending?: boolean;
    safetyPending?: boolean;
  };
}

export const BottomNav: React.FC<BottomNavProps> = ({ 
  currentScreen, 
  onSelectScreen,
  pendingBadges 
}) => {
  const navItems = [
    { index: 1, label: 'Dashboard', icon: LayoutDashboard },
    { index: 2, label: 'Intake', icon: Mic },
    { index: 3, label: 'AI Analysis', icon: FileSearch },
    { index: 4, label: 'Plant ID', icon: Sprout },
    { index: 5, label: 'Prescription', icon: FileText, badge: pendingBadges?.rxPending },
    { index: 6, label: 'Decision', icon: ShieldCheck, badge: pendingBadges?.safetyPending },
  ];

  return (
    <nav className="bottom-nav-bar" aria-label="Bottom Navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentScreen === item.index;

        return (
          <button
            key={item.index}
            onClick={() => onSelectScreen(item.index)}
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            title={item.label}
          >
            <div className="nav-icon-container relative">
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
              {item.badge && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white"></span>
              )}
            </div>
            <span className="text-[10px] tracking-tight truncate max-w-[64px]">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
