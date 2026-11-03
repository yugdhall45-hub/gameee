import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  Bell, 
  BookOpen, 
  Calendar, 
  FileText, 
  CheckSquare, 
  Users, 
  Menu, 
  X, 
  Plus, 
  User, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  user, 
  onOpenUpload, 
  onOpenProfile, 
  announcements = [],
  searchQuery,
  setSearchQuery
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'vault', label: 'Study Vault', icon: BookOpen },
    { id: 'events', label: 'Events & Fests', icon: Calendar },
    { id: 'academics', label: 'Academic Hub', icon: CheckSquare },
    { id: 'notices', label: 'Notices', icon: FileText },
    { id: 'community', label: 'Community & Clubs', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-40 bg-navy-950 text-white shadow-lg border-b border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & University Brand */}
          <div 
            onClick={() => setActiveTab('overview')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-500 to-sky-300 flex items-center justify-center text-navy-950 shadow-md group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-7 h-7 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight text-white font-display">
                  Campus<span className="text-brand-400">Connect</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-navy-800 text-brand-300 rounded-full border border-navy-700">
                  Student Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium tracking-wide">
                Your College, Your Community
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-navy-800/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Utilities */}
          <div className="flex items-center space-x-3">
            
            {/* Quick Upload Resource Button */}
            <button
              onClick={onOpenUpload}
              className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-brand-500 hover:bg-brand-400 text-navy-950 shadow-sm hover:shadow-brand-500/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Upload Note</span>
            </button>

            {/* Notification Bell with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-navy-800 focus:outline-none transition-colors"
                title="Campus Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-brand-400 rounded-full ring-2 ring-navy-950 animate-pulse"></span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <h4 className="font-semibold text-sm text-navy-900">Campus Alerts & Notices</h4>
                    <span className="text-[11px] bg-brand-100 text-brand-700 font-semibold px-2 py-0.5 rounded-full">
                      {announcements.length} Active
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {announcements.map((anc) => (
                      <div 
                        key={anc.id}
                        onClick={() => {
                          setActiveTab('notices');
                          setNotificationsOpen(false);
                        }}
                        className="px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            anc.priority === 'urgent' 
                              ? 'bg-rose-100 text-rose-700' 
                              : 'bg-brand-100 text-brand-700'
                          }`}>
                            {anc.category}
                          </span>
                          <span className="text-[10px] text-slate-400">{anc.date}</span>
                        </div>
                        <p className="text-xs font-semibold text-navy-950 line-clamp-1">{anc.title}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{anc.summary}</p>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 pt-2 border-t border-slate-100 text-center">
                    <button 
                      onClick={() => {
                        setActiveTab('notices');
                        setNotificationsOpen(false);
                      }}
                      className="text-xs text-brand-600 font-semibold hover:underline"
                    >
                      View All Announcements →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Badge */}
            <button
              onClick={onOpenProfile}
              className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-full bg-navy-900 hover:bg-navy-800 border border-navy-700/80 transition-colors"
            >
              <img 
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"} 
                alt={user?.name || "Student"} 
                className="w-7 h-7 rounded-full object-cover ring-1 ring-brand-400/60"
              />
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold leading-tight text-white">{user?.name || "Alex Morgan"}</p>
                <p className="text-[10px] text-brand-300 font-medium leading-none">GPA {user?.gpa || '3.84'}</p>
              </div>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-navy-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-navy-900 border-b border-navy-800 px-4 pt-3 pb-5 space-y-1 animate-in slide-in-from-top-4 duration-200">
          <div className="mb-3 px-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Navigation</p>
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-500 text-navy-950 font-bold'
                    : 'text-slate-200 hover:bg-navy-800'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-navy-950' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t border-navy-800">
            <button
              onClick={() => {
                onOpenUpload();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-brand-500 text-navy-950 font-bold text-sm shadow-md"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Upload Notes or PYQ</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

