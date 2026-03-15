import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { 
  Home, 
  FileText, 
  Users, 
  DollarSign, 
  CircleCheck, 
  Settings,
  LogOut,
  Plane,
  Calendar,
  UserCheck
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  title: string;
  role?: 'guest' | 'agency' | 'admin';
}

export default function Layout({ children, title, role = 'guest' }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const getNavItems = () => {
    if (role === 'guest') {
      return [
        { icon: Home, label: 'Dashboard', path: '/guest/dashboard' },
        { icon: Calendar, label: 'Create Itinerary', path: '/guest/itinerary-builder' },
      ];
    } else if (role === 'agency') {
      return [
        { icon: FileText, label: 'Review Queue', path: '/agency/review' },
        { icon: Users, label: 'Staff Management', path: '/agency/staff' },
      ];
    } else {
      return [
        { icon: Home, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: FileText, label: 'All Itineraries', path: '/admin/itineraries' },
        { icon: Users, label: 'Staff', path: '/agency/staff' },
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-blue-500 p-2">
                <Plane className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Travella</h1>
                <p className="text-xs text-gray-500 capitalize">{role} Portal</p>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/login')}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 border-b">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Page Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>

        {/* Main Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}