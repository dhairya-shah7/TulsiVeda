import React, { useState } from 'react';
import { 
  X, Bell, AlertTriangle, ShieldCheck, Info, Check, 
  Trash2, Volume2, ArrowRight, Activity 
} from 'lucide-react';
import { t, useCurrentLanguage, getStoredLanguage } from '../services/localizationService';
import { playNativeTTS } from './AudioNarrator';

interface NotificationItem {
  id: string;
  type: 'danger' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionScreen?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'danger',
    title: 'High ADR Alert: Ashwagandha + Warfarin',
    message: 'Pharmacovigilance cluster detected: Elevated INR risk and cytochrome P450 2C9 inhibition flagged in western Maharashtra.',
    timestamp: '10 mins ago',
    read: false,
    actionScreen: 'safety'
  },
  {
    id: 'notif-2',
    type: 'warning',
    title: 'Monsoon Seasonal Outbreak Advisory',
    message: 'Spike in viral fevers across Konkan belt. Jan Aushadhi Paracetamol 650mg & Giloy decoctions mobilized to local PHCs.',
    timestamp: '2 hours ago',
    read: false,
    actionScreen: 'alternatives'
  },
  {
    id: 'notif-3',
    type: 'info',
    title: 'Knowledge Book Updated (OTA)',
    message: 'Added 5 new clinical monographs to Veda Pustak: Kalmegh, Punarnava, Shankhpushpi, Guggulu, and Haritaki.',
    timestamp: 'Yesterday',
    read: true,
    actionScreen: 'knowledge'
  },
  {
    id: 'notif-4',
    type: 'success',
    title: 'On-Device Pharmacopeia Synced',
    message: 'Offline causal graph verified with latest 2026 AYUSH & CDSCO clinical advisories.',
    timestamp: '2 days ago',
    read: true
  }
];

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (screen: string) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  useCurrentLanguage();
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const stored = localStorage.getItem('tulsiveda_notifications');
    if (stored) {
      try { return JSON.parse(stored); } catch { return INITIAL_NOTIFICATIONS; }
    }
    return INITIAL_NOTIFICATIONS;
  });

  if (!isOpen) return null;

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('tulsiveda_notifications', JSON.stringify(updated));
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.setItem('tulsiveda_notifications', JSON.stringify([]));
  };

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    localStorage.setItem('tulsiveda_notifications', JSON.stringify(updated));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[88vh] overflow-hidden shadow-2xl border border-emerald-100 flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white relative">
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-extrabold flex items-center justify-center shadow-md">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">{t('notifications_title')}</h2>
              <p className="text-xs text-emerald-100 font-medium">National Surveillance & Safety Alerts</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white border border-white/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <span className="font-semibold">{notifications.length} Total Alerts</span>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
            {notifications.length > 0 && (
              <button 
                onClick={clearAll}
                className="text-slate-400 hover:text-red-600 font-medium flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">All clear! No active alerts</p>
              <p className="text-xs text-slate-400">Your health intake and pharmacopeia are up to date.</p>
            </div>
          ) : (
            notifications.map((item) => {
              const borderStyles = {
                danger: 'border-l-4 border-l-red-500 bg-red-50/40',
                warning: 'border-l-4 border-l-amber-500 bg-amber-50/40',
                info: 'border-l-4 border-l-blue-500 bg-blue-50/40',
                success: 'border-l-4 border-l-emerald-500 bg-emerald-50/40'
              }[item.type];

              const icon = {
                danger: <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />,
                warning: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />,
                info: <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />,
                success: <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              }[item.type];

              return (
                <div 
                  key={item.id}
                  onClick={() => markAsRead(item.id)}
                  className={`p-4 rounded-2xl border border-slate-200/80 transition-all ${borderStyles} ${
                    item.read ? 'opacity-70 bg-white' : 'shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      {icon}
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-slate-900 leading-snug">{item.title}</h4>
                          {!item.read && (
                            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.message}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                    <span>{item.timestamp}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playNativeTTS(`${item.title}. ${item.message}`, getStoredLanguage());
                        }}
                        className="p-1 hover:text-emerald-700 transition-colors"
                        title="Listen alert"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      {item.actionScreen && onNavigate && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                            onNavigate(item.actionScreen!);
                          }}
                          className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                        >
                          View
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5 font-medium text-emerald-800">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            Pharmacovigilance: Live CDSCO & AYUSH Node
          </span>
          <button 
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 font-semibold text-slate-700 transition-all"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
