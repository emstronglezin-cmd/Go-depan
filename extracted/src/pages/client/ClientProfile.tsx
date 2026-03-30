import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { useAuthStore } from '@/store/authStore';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Star
} from 'lucide-react';

export function ClientProfile() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { icon: User, label: 'Modifier le profil', path: '/client/edit-profile' },
    { icon: Bell, label: 'Notifications', path: '/client/notifications' },
    { icon: Star, label: 'Mes avis', path: '/client/reviews' },
    { icon: Shield, label: 'Sécurité', path: '/client/security' },
    { icon: HelpCircle, label: 'Aide & Support', path: '/client/help' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-orange-500 px-4 py-8 pb-16">
        <h1 className="text-2xl font-bold text-white">Mon Profil</h1>
      </div>

      <div className="px-4 -mt-10 space-y-4">
        {/* Profile Card */}
        <Card className="text-center">
          <Avatar name={user?.name} size="xl" className="mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
          <p className="text-gray-500 text-sm">Client</p>
          
          <div className="flex flex-col gap-2 mt-4 text-left">
            <div className="flex items-center gap-3 text-gray-600">
              <Mail size={18} className="text-gray-400" />
              <span className="text-sm">{user?.email}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Phone size={18} className="text-gray-400" />
              <span className="text-sm">{user?.phone}</span>
            </div>
            {user?.location && (
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin size={18} className="text-gray-400" />
                <span className="text-sm">{user.location.address}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Menu Items */}
        <Card padding="none">
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors ${
                index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <item.icon size={20} className="text-orange-500" />
              </div>
              <span className="flex-1 text-left font-medium text-gray-700">
                {item.label}
              </span>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          ))}
        </Card>

        {/* Logout */}
        <Button
          variant="outline"
          fullWidth
          size="lg"
          onClick={handleLogout}
          leftIcon={<LogOut size={20} />}
          className="border-red-200 text-red-500 hover:bg-red-50"
        >
          Déconnexion
        </Button>

        {/* Version */}
        <p className="text-center text-gray-400 text-sm">
          Go Dépanne v1.0.0
        </p>
      </div>
    </div>
  );
}
