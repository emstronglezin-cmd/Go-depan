import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { serviceConfig } from '@/components/ServiceIcon';
import { useAuthStore } from '@/store/authStore';
import { useDataStore } from '@/store/dataStore';
import type { Depanneur } from '@/types';
import { 
  Bell, 
  TrendingUp,
  Clock,
  CheckCircle,
  MapPin,
  Power,
  ChevronRight,
  Wallet
} from 'lucide-react';

export function DepanneurHome() {
  const navigate = useNavigate();
  const { user, updateAvailability } = useAuthStore();
  const { getPendingRequests, getRequestsByDepanneur } = useDataStore();
  
  const depanneur = user as Depanneur;
  const pendingRequests = getPendingRequests();
  const myRequests = getRequestsByDepanneur(user?.id || '');
  const activeRequests = myRequests.filter(r => r.status === 'in_progress' || r.status === 'accepted');
  const completedThisMonth = myRequests.filter(r => r.status === 'completed').length;

  const toggleAvailability = () => {
    updateAvailability(!depanneur.isAvailable);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 px-4 py-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Avatar name={depanneur?.name} size="md" />
            <div>
              <p className="text-white/80 text-sm">Bonjour 👋</p>
              <h1 className="text-white font-bold text-lg">{depanneur?.name}</h1>
            </div>
          </div>
          <button 
            onClick={() => navigate('/depanneur/notifications')}
            className="relative w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"
          >
            <Bell size={20} className="text-white" />
            {pendingRequests.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                {pendingRequests.length}
              </span>
            )}
          </button>
        </div>

        {/* Availability Toggle */}
        <Card className={`${depanneur?.isAvailable ? 'bg-green-50 border-green-200' : 'bg-gray-100 border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                depanneur?.isAvailable ? 'bg-green-500' : 'bg-gray-400'
              }`}>
                <Power size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {depanneur?.isAvailable ? 'Vous êtes en ligne' : 'Vous êtes hors ligne'}
                </h3>
                <p className="text-sm text-gray-500">
                  {depanneur?.isAvailable 
                    ? 'Vous pouvez recevoir des demandes' 
                    : 'Activez pour recevoir des demandes'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleAvailability}
              className={`w-14 h-8 rounded-full p-1 transition-all ${
                depanneur?.isAvailable ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                depanneur?.isAvailable ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </Card>
      </div>

      <div className="px-4 -mt-8 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="text-center py-4">
            <Wallet className="mx-auto text-orange-500 mb-1" size={24} />
            <p className="text-lg font-bold text-gray-900">
              {(depanneur?.totalEarnings || 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">FCFA gagnés</p>
          </Card>
          <Card className="text-center py-4">
            <CheckCircle className="mx-auto text-green-500 mb-1" size={24} />
            <p className="text-lg font-bold text-gray-900">{completedThisMonth}</p>
            <p className="text-xs text-gray-500">Ce mois</p>
          </Card>
          <Card className="text-center py-4">
            <TrendingUp className="mx-auto text-blue-500 mb-1" size={24} />
            <p className="text-lg font-bold text-gray-900">{depanneur?.rating?.toFixed(1) || '0.0'}</p>
            <p className="text-xs text-gray-500">Note</p>
          </Card>
        </div>

        {/* Active Requests */}
        {activeRequests.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">En cours</h2>
            {activeRequests.map((request) => (
              <Card 
                key={request.id}
                hover
                className="mb-3"
                onClick={() => navigate(`/depanneur/request/${request.id}`)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${serviceConfig[request.serviceType].bgColor}`}>
                    <Clock size={20} className={serviceConfig[request.serviceType].color} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{request.clientName}</h3>
                    <p className="text-sm text-gray-500">{serviceConfig[request.serviceType].label}</p>
                  </div>
                  <Badge variant="info">
                    {request.status === 'accepted' ? 'Acceptée' : 'En cours'}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* New Requests */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900">Nouvelles demandes</h2>
            <button 
              onClick={() => navigate('/depanneur/requests')}
              className="text-orange-500 text-sm font-medium flex items-center"
            >
              Voir tout <ChevronRight size={16} />
            </button>
          </div>

          {pendingRequests.length === 0 ? (
            <Card className="text-center py-8">
              <Clock size={40} className="mx-auto text-gray-300 mb-2" />
              <p className="text-gray-500">Aucune nouvelle demande</p>
              <p className="text-sm text-gray-400">Les demandes apparaîtront ici</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {pendingRequests.slice(0, 3).map((request) => (
                <Card key={request.id} hover onClick={() => navigate(`/depanneur/request/${request.id}`)}>
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${serviceConfig[request.serviceType].bgColor}`}>
                      {(() => {
                        const Icon = serviceConfig[request.serviceType].icon;
                        return <Icon size={20} className={serviceConfig[request.serviceType].color} />;
                      })()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-gray-900">{request.clientName}</h3>
                        <Badge variant="warning">Nouveau</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {request.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                        <MapPin size={14} />
                        <span>{request.location.address}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" className="flex-1">
                      Refuser
                    </Button>
                    <Button size="sm" className="flex-1">
                      Accepter
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
