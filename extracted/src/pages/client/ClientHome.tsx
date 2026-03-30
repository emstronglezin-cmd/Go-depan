import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { serviceConfig, ServiceIcon } from '@/components/ServiceIcon';
import { useAuthStore } from '@/store/authStore';
import { useDataStore } from '@/store/dataStore';
import { 
  MapPin, 
  Star, 
  Search,
  Bell,
  Clock,
  ChevronRight
} from 'lucide-react';
import type { ServiceType } from '@/types';

export function ClientHome() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { depanneurs, getRequestsByClient } = useDataStore();
  const [searchQuery, setSearchQuery] = useState('');

  const clientRequests = user ? getRequestsByClient(user.id) : [];
  const activeRequest = clientRequests.find(r => 
    r.status === 'pending' || r.status === 'accepted' || r.status === 'in_progress'
  );

  const services = Object.entries(serviceConfig) as [ServiceType, typeof serviceConfig[ServiceType]][];
  const nearbyDepanneurs = depanneurs.filter(d => d.status === 'approved' && d.isAvailable).slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-orange-500 px-4 py-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Avatar name={user?.name} size="md" />
            <div>
              <p className="text-white/80 text-sm">Bonjour 👋</p>
              <h1 className="text-white font-bold text-lg">{user?.name}</h1>
            </div>
          </div>
          <button 
            onClick={() => navigate('/client/notifications')}
            className="relative w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
          >
            <Bell size={20} className="text-white" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
              2
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher un service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>
      </div>

      <div className="px-4 -mt-8 space-y-6">
        {/* Active Request Alert */}
        {activeRequest && (
          <Card 
            className="bg-blue-50 border-blue-200 cursor-pointer"
            onClick={() => navigate(`/client/request/${activeRequest.id}`)}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Clock size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-blue-900">Demande en cours</p>
                <p className="text-sm text-blue-700">{serviceConfig[activeRequest.serviceType].label}</p>
              </div>
              <Badge variant="info">
                {activeRequest.status === 'pending' ? 'En attente' : 
                 activeRequest.status === 'accepted' ? 'Acceptée' : 'En cours'}
              </Badge>
            </div>
          </Card>
        )}

        {/* Services */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Services</h2>
          <div className="grid grid-cols-3 gap-3">
            {services.map(([key, config]) => {
              const Icon = config.icon;
              return (
                <Card
                  key={key}
                  hover
                  className="text-center py-4"
                  onClick={() => navigate(`/client/search/${key}`)}
                >
                  <div className={`w-12 h-12 ${config.bgColor} rounded-full flex items-center justify-center mx-auto mb-2`}>
                    <Icon size={24} className={config.color} />
                  </div>
                  <p className="text-sm font-medium text-gray-700">{config.label}</p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Nearby Depanneurs */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900">Près de chez vous</h2>
            <button 
              onClick={() => navigate('/client/search')}
              className="text-orange-500 text-sm font-medium flex items-center"
            >
              Voir tout <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="space-y-3">
            {nearbyDepanneurs.map((depanneur) => (
              <Card 
                key={depanneur.id} 
                hover
                onClick={() => navigate(`/client/depanneur/${depanneur.id}`)}
              >
                <div className="flex items-center gap-3">
                  <Avatar src={depanneur.avatar} name={depanneur.name} size="lg" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{depanneur.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      {depanneur.services.slice(0, 2).map(service => (
                        <ServiceIcon key={service} service={service} size={16} />
                      ))}
                      <span className="text-sm text-gray-500">
                        {depanneur.services.map(s => serviceConfig[s].label).join(', ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center text-sm text-yellow-600">
                        <Star size={14} className="mr-0.5 fill-yellow-500" />
                        {depanneur.rating.toFixed(1)}
                      </span>
                      <span className="flex items-center text-sm text-gray-500">
                        <MapPin size={14} className="mr-0.5" />
                        {depanneur.location?.address?.split(',')[0]}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">À partir de</p>
                    <p className="font-bold text-orange-500">{depanneur.priceRange.min.toLocaleString()} F</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
