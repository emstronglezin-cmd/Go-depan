import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { serviceConfig } from '@/components/ServiceIcon';
import { useAuthStore } from '@/store/authStore';
import { useDataStore } from '@/store/dataStore';
import { ArrowLeft, MapPin, Clock, MessageCircle } from 'lucide-react';

type TabType = 'pending' | 'active' | 'completed';

export function DepanneurRequests() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getPendingRequests, getRequestsByDepanneur, updateRequestStatus } = useDataStore();
  
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  
  const pendingRequests = getPendingRequests();
  const myRequests = getRequestsByDepanneur(user?.id || '');
  const activeRequests = myRequests.filter(r => r.status === 'accepted' || r.status === 'in_progress');
  const completedRequests = myRequests.filter(r => r.status === 'completed');

  const tabs: { key: TabType; label: string; count: number }[] = [
    { key: 'pending', label: 'En attente', count: pendingRequests.length },
    { key: 'active', label: 'En cours', count: activeRequests.length },
    { key: 'completed', label: 'Terminées', count: completedRequests.length }
  ];

  const currentRequests = 
    activeTab === 'pending' ? pendingRequests :
    activeTab === 'active' ? activeRequests :
    completedRequests;

  const handleAccept = (requestId: string) => {
    updateRequestStatus(requestId, 'accepted', user?.id, user?.name);
    setActiveTab('active');
  };

  const handleRefuse = (requestId: string) => {
    updateRequestStatus(requestId, 'cancelled');
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Demandes</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                activeTab === tab.key
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center ${
                  activeTab === tab.key ? 'bg-white/20' : 'bg-gray-200'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {currentRequests.length === 0 ? (
          <div className="text-center py-12">
            <Clock size={48} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-semibold text-gray-700">Aucune demande</h3>
            <p className="text-gray-500 mt-1">
              {activeTab === 'pending' 
                ? 'Aucune nouvelle demande pour le moment'
                : activeTab === 'active'
                ? 'Aucune demande en cours'
                : 'Aucune demande terminée'}
            </p>
          </div>
        ) : (
          currentRequests.map((request) => (
            <Card key={request.id}>
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${serviceConfig[request.serviceType].bgColor}`}>
                  {(() => {
                    const Icon = serviceConfig[request.serviceType].icon;
                    return <Icon size={24} className={serviceConfig[request.serviceType].color} />;
                  })()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{request.clientName}</h3>
                      <p className="text-sm text-orange-500 font-medium">
                        {serviceConfig[request.serviceType].label}
                      </p>
                    </div>
                    {activeTab === 'pending' && <Badge variant="warning">Nouveau</Badge>}
                    {activeTab === 'active' && <Badge variant="info">En cours</Badge>}
                    {activeTab === 'completed' && <Badge variant="success">Terminée</Badge>}
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-2">
                    {request.description}
                  </p>
                  
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {request.location.address.split(',')[0]}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {formatDate(request.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {activeTab === 'pending' && (
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleRefuse(request.id)}
                  >
                    Refuser
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleAccept(request.id)}
                  >
                    Accepter
                  </Button>
                </div>
              )}

              {activeTab === 'active' && (
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    leftIcon={<MessageCircle size={16} />}
                    onClick={() => navigate(`/depanneur/chat/${request.id}`)}
                  >
                    Chat
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => navigate(`/depanneur/request/${request.id}`)}
                  >
                    Détails
                  </Button>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
