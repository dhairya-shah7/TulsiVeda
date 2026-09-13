import React from 'react';
import { Leaf, Bell, ChevronLeft, User } from 'lucide-react';

interface HeaderProps {
  currentScreen: number;
  onBack?: () => void;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ currentScreen, onBack }) => {
  return (
    <header className="flex items-center justify-between px-5 py-3.5 bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="flex items-center gap-2.5">
        {currentScreen > 1 ? (
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-emerald-700 transition-colors py-1 pr-2 rounded-lg"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-800">Back</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shadow-sm">
              <Leaf className="w-5 h-5 fill-emerald-600 text-emerald-600" />
            </div>
            <span className="font-heading font-bold text-lg tracking-tight text-gray-900">
              TulsiVeda <span className="text-emerald-700 font-extrabold">AI</span>
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white"></span>
        </button>
        <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-semibold text-xs shadow-sm">
          <User className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
};
