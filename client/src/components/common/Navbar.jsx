import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Sprout,
  Menu,
  X,
  Globe,
  Bell,
  User,
  LogOut,
  ShieldAlert,
  Volume2,
  VolumeX,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { LANGUAGE_OPTIONS, useLanguage } from '../../context/LanguageContext.jsx';
import { useNotifications } from '../../context/NotificationContext.jsx';

export const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin, isExpert } = useAuth();
  const { lang, setLang, t, isSpeaking, stopSpeaking } = useLanguage();
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
    setNotifDropdownOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const closeDesktopMenu = () => {
      if (window.innerWidth >= 1280) setMobileMenuOpen(false);
    };
    closeDesktopMenu();
    window.addEventListener('resize', closeDesktopMenu);
    return () => window.removeEventListener('resize', closeDesktopMenu);
  }, []);

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    ...(isAuthenticated
      ? [
          { name: t('nav.dashboard'), path: '/dashboard' },
          { name: t('nav.features'), path: '/features' },
          { name: t('nav.soilAnalysis'), path: '/soil-analysis' },
          { name: t('nav.cropRecommend'), path: '/crop-recommendation' },
          { name: t('nav.fertilizer'), path: '/fertilizer-advisory' },
          { name: t('nav.disease'), path: '/disease-detection' },
          { name: t('nav.weather'), path: '/weather' },
          { name: t('nav.expenses'), path: '/calculator' },
          { name: t('nav.market'), path: '/market-prices' },
          { name: t('nav.schemes'), path: '/schemes' },
          { name: t('nav.calendar'), path: '/calendar' },
          { name: t('nav.community'), path: '/community' },
          { name: t('nav.expert'), path: '/ask-expert' },
          { name: t('nav.sustainability'), path: '/sustainability' },
          { name: t('nav.affordableFarming'), path: '/affordable-farming' },
          { name: t('nav.insurance'), path: '/insurance' },
          { name: 'Smart Water', path: '/water' }
        ]
      : [
          { name: t('nav.features'), path: '/features' },
          { name: t('nav.about'), path: '/about' },
          { name: t('nav.soilAnalysis'), path: '/soil-analysis' },
          { name: t('nav.cropRecommend'), path: '/crop-recommendation' },
          { name: t('nav.fertilizer'), path: '/fertilizer-advisory' },
          { name: t('nav.disease'), path: '/disease-detection' },
          { name: t('nav.weather'), path: '/weather' },
          { name: t('nav.expenses'), path: '/calculator' },
          { name: t('nav.market'), path: '/market-prices' },
          { name: t('nav.schemes'), path: '/schemes' },
          { name: t('nav.calendar'), path: '/calendar' },
          { name: t('nav.community'), path: '/community' },
          { name: t('nav.expert'), path: '/ask-expert' },
          { name: t('nav.sustainability'), path: '/sustainability' },
          { name: 'Smart Water', path: '/water' },
          { name: t('nav.affordableFarming'), path: '/affordable-farming' },
          { name: t('nav.insurance'), path: '/insurance' }
        ])
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <nav className="relative sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-primary-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-700 to-primary-500 flex items-center justify-center text-white shadow-md shadow-primary-200 transition-transform group-hover:scale-105">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-primary-950 flex items-center gap-1">
                Mitti<span className="text-primary-600">Mitra</span>
              </span>
              <span className="block text-[10px] text-slate-500 font-medium tracking-wide -mt-1 hidden sm:block">
                Better Soil. Better Crops.
              </span>
            </div>
          </Link>

          {/* Desktop Links (Main items; remaining tools appear in More) */}
          <div className="hidden xl:flex items-center space-x-1 flex-1 justify-center min-w-0 mx-3">
            {navLinks.slice(0, 5).map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-primary-50 text-primary-800 font-semibold'
                      : 'text-slate-600 hover:text-primary-700 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* More dropdown for additional tools */}
            {navLinks.length > 5 && (
              <div className="relative group">
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-primary-700 hover:bg-slate-50">
                  <span>More</span>
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute right-0 mt-1 w-56 max-h-[70vh] overflow-y-auto bg-white rounded-xl shadow-lg border border-slate-100 py-2 hidden group-hover:block transition-all z-50">
                  {navLinks.slice(5).map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-800"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Utility Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Voice reading stop indicator if speaking */}
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                title="Stop Voice Reader"
                className="flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold animate-pulse"
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span>Reading...</span>
              </button>
            )}

            {/* Language Switcher */}
            <label className="notranslate flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-sand-100 border border-slate-200" translate="no" title="Choose website language">
              <Globe className="w-3.5 h-3.5 text-primary-700" />
              <select value={lang} onChange={(e) => setLang(e.target.value)} className="notranslate max-w-[112px] bg-transparent text-xs font-bold outline-none" translate="no" aria-label="Website language" title="Choose a state language for the entire website">
                {LANGUAGE_OPTIONS.map((language) => (
                  <option key={language.code} value={language.code} title={language.states} className="notranslate" translate="no">
                    {language.native}
                  </option>
                ))}
              </select>
            </label>

            {/* Notifications Button */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="relative p-2 text-slate-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50">
                    <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                      <span className="font-bold text-sm text-slate-800">Notifications ({unreadCount})</span>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllRead}
                          className="text-xs text-primary-700 hover:underline font-medium"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-center text-xs text-slate-500">No notifications yet.</p>
                      ) : (
                        notifications.slice(0, 6).map((n) => (
                          <div
                            key={n._id}
                            onClick={() => {
                              markRead(n._id);
                              if (n.link) navigate(n.link);
                              setNotifDropdownOpen(false);
                            }}
                            className={`p-3 text-xs cursor-pointer hover:bg-slate-50 transition-colors ${
                              !n.read ? 'bg-primary-50/50 font-medium' : ''
                            }`}
                          >
                            <p className="text-slate-800 font-semibold">{n.title}</p>
                            <p className="text-slate-600 text-[11px] mt-0.5 line-clamp-2">{n.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {new Date(n.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile Dropdown / Sign In Buttons */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-primary-50 hover:bg-primary-100 border border-primary-200 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-primary-700 text-white flex items-center justify-center font-bold text-xs">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-xs font-semibold text-slate-800 hidden md:block max-w-[100px] truncate">
                    {user?.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 capitalize">{user?.role} • {user?.district}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-primary-50 hover:text-primary-800"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Farm Profile</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-amber-700 hover:bg-amber-50 font-semibold"
                      >
                        <ShieldAlert className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 text-left border-t border-slate-100 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('nav.logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-primary-800 hover:bg-primary-50 transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-primary-700 hover:bg-primary-800 shadow-sm transition-all"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg shrink-0"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Compact responsive navigation drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden absolute inset-x-0 top-full bg-white border-b border-slate-200 px-4 py-4 shadow-xl max-h-[min(70vh,520px)] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 max-w-7xl mx-auto">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-800"
            >
              {link.name}
            </Link>
          ))}

          {isAuthenticated && (
            <>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-primary-50"
              >
                Farm Profile & Settings
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-amber-700 hover:bg-amber-50 font-semibold"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 mt-2"
              >
                {t('nav.logout')}
              </button>
            </>
          )}
          </div>
        </div>
      )}
    </nav>
  );
};

