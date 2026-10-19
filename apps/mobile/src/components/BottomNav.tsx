import React from 'react';
import { 
  Home, 
  BookOpen, 
  Sparkles, 
  Pill, 
  ShieldAlert 
} from 'lucide-react';
import { t, useCurrentLanguage } from '../services/localizationService';

export type ScreenId = 'home' | 'knowledge' | 'intake' | 'alternatives' | 'decision';

interface BottomNavProps {
  currentScreen: ScreenId;
  onSelectScreen: (screenId: ScreenId) => void;
  pendingBadges?: {
    rxPending?: boolean;
    safetyPending?: boolean;
  };
  userRole?: 'citizen' | 'asha' | 'doctor';
}

export const BottomNav: React.FC<BottomNavProps> = ({ 
  currentScreen, 
  onSelectScreen,
  pendingBadges,
  userRole = 'citizen' 
}) => {
  useCurrentLanguage(); // Reactively updates labels when language changes
  const isCitizen = userRole === 'citizen';
  const navItems: { id: ScreenId; label: string; icon: React.ElementType; badge?: boolean }[] = [
    { id: 'home', label: t('nav_home'), icon: Home },
    { id: 'knowledge', label: t('nav_knowledge'), icon: BookOpen },
    { id: 'intake', label: t('nav_intake'), icon: Sparkles },
    { id: 'alternatives', label: t('nav_alternatives'), icon: Pill, badge: pendingBadges?.rxPending },
    { id: 'decision', label: isCitizen ? t('safety_status') : t('nav_safety'), icon: ShieldAlert, badge: pendingBadges?.safetyPending },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3 pt-2 pb-[max(10px,env(safe-area-inset-bottom))] z-40 shadow-xl flex items-center justify-between" 
      aria-label="Bottom Navigation"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentScreen === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onSelectScreen(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all relative flex-1 min-w-[58px] ${
              isActive 
                ? 'text-emerald-700 font-extrabold scale-105' 
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
            title={item.label}
          >
            <div className={`p-1.5 rounded-xl transition-all relative ${
              isActive ? 'bg-emerald-100/80 text-emerald-800 shadow-2xs' : 'bg-transparent'
            }`}>
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              {item.badge && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </div>
            <span className="text-[10.5px] tracking-tight mt-1 truncate max-w-[68px]">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
