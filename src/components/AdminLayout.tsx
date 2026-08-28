import { Link, useLocation, Outlet, useNavigate } from 'react-router';
import { 
  LayoutDashboard, Users, FileQuestion, DollarSign, 
  FileCheck, Bell, Shield, LogOut, Menu, X, BookOpen, Newspaper, BarChart3, Key
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check if user is admin
  if (user?.role !== 'admin') {
    navigate('/');
    return null;
  }

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: '/admin/users', label: 'Users', icon: <Users className="w-5 h-5" /> },
    { path: '/admin/questions', label: 'Questions', icon: <FileQuestion className="w-5 h-5" /> },
    { path: '/admin/resources', label: 'Resources', icon: <BookOpen className="w-5 h-5" /> },
    { path: '/admin/articles', label: 'Articles', icon: <Newspaper className="w-5 h-5" /> },
    { path: '/admin/analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { path: '/admin/payments', label: 'Payments', icon: <DollarSign className="w-5 h-5" /> },
    { path: '/admin/irembo', label: 'Irembo', icon: <FileCheck className="w-5 h-5" /> },
    { path: '/admin/notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
    { path: '/admin/fraud-logs', label: 'Fraud Logs', icon: <Shield className="w-5 h-5" /> },
    { path: '/admin/api-keys', label: 'API Keys', icon: <Key className="w-5 h-5" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#F4F7F9] dark:bg-[#1A1A2E] transition-colors duration-300">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#1A1A2E]/80 backdrop-blur-xl border-b border-gray-200/20 dark:border-gray-700/20">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            
            <Link to="/" className="flex items-center space-x-2">
              <img src="/android-chrome-192x192.png" alt="ISHAMI" className="w-8 h-8 rounded-lg" />
              <span className="text-gray-900 dark:text-white">ISHAMI Admin</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              View Site
            </Link>
            
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed top-16 left-0 bottom-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
        transition-transform duration-300 z-40
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                ${isActive(item.path)
                  ? 'bg-[#00A3AD] text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 pt-16">
        <Outlet />
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
