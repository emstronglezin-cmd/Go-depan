import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { serviceConfig } from '@/components/ServiceIcon';
import { useAuthStore } from '@/store/authStore';
import type { Depanneur } from '@/types';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Star,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Shield,
  Award
} from 'lucide-react';

export function DepanneurProfile() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const depanneur = user as Depanneur;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { icon: User, label: 'Modifier le profil', path: '/depanneur/edit-profile' },
    { icon: Settings, label: 'Services & Tarifs', path: '/depanneur/services' },
    { icon: MapPin, label: 'Zone d\'intervention', path: '/depanneur/zone' },
    { icon: Shield, label: 'Documents', path: '/depanneur/documents' },
    { icon: HelpCircle, label: 'Aide & Support', path: '/depanneur/help' }
  ];

  const statusConfig = {
    pending: { label: 'En attente de validation', variant: 'warning' as const },
    approved: { label: 'Compte vérifié', variant: 'success' as const },
    rejected: { label: 'Compte rejeté', variant: 'danger' as const },
    blocked: { label: 'Compte bloqué', variant: 'danger' as const }
  };

  const status = statusConfig[depanneur?.status || 'pending'];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 px-4 py-8 pb-20">
        <h1 className="text-2xl font-bold text-white">Mon Profil</h1>
      </div>

      <div className="px-4 -mt-14 space-y-4">
        {/* Profile Card */}
        <Card className="text-center">
          <Avatar name={depanneur?.name} size="xl" className="mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-900">{depanneur?.name}</h2>
          <Badge variant={status.variant} size="md" className="mt-2">
            {status.label}
          </Badge>
          
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{depanneur?.rating?.toFixed(1) || '0.0'}</p>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                Note
              </div>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{depanneur?.completedMissions || 0}</p>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Award size={14} />
                Missions
              </div>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{depanneur?.totalReviews || 0}</p>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                Avis
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-6 text-left border-t border-gray-100 pt-4">
            <div className="flex items-center gap-3 text-gray-600">
              <Mail size={18} className="text-gray-400" />
              <span className="text-sm">{depanneur?.email}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Phone size={18} className="text-gray-400" />
              <span className="text-sm">{depanneur?.phone}</span>
            </div>
            {depanneur?.location && (
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin size={18} className="text-gray-400" />
                <span className="text-sm">{depanneur.location.address}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
            {depanneur?.services?.map(s => (
              <span 
                key={s}
                className={`px-3 py-1 rounded-full text-sm font-medium ${serviceConfig[s].bgColor} ${serviceConfig[s].color}`}
              >
                {serviceConfig[s].label}
              </span>
            ))}
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
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <item.icon size={20} className="text-gray-600" />
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

        <p className="text-center text-gray-400 text-sm">
          Go Dépanne v1.0.0
        </p>
      </div>
    </div>
  );
}
