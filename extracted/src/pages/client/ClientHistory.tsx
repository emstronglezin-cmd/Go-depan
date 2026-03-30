import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { serviceConfig } from '@/components/ServiceIcon';
import { useAuthStore } from '@/store/authStore';
import { useDataStore } from '@/store/dataStore';
import { Clock, CheckCircle, XCircle, AlertCircle, ChevronRight } from 'lucide-react';
import type { RequestStatus } from '@/types';

const statusConfig: Record<RequestStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info'; icon: typeof Clock }> = {
  pending: { label: 'En attente', variant: 'warning', icon: Clock },
  accepted: { label: 'Acceptée', variant: 'info', icon: AlertCircle },
  in_progress: { label: 'En cours', variant: 'info', icon: AlertCircle },
  completed: { label: 'Terminée', variant: 'success', icon: CheckCircle },
  cancelled: { label: 'Annulée', variant: 'danger', icon: XCircle }
};

export function ClientHistory() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getRequestsByClient } = useDataStore();

  const requests = user ? getRequestsByClient(user.id) : [];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Historique</h1>
        <p className="text-gray-500 text-sm mt-1">Vos demandes d'intervention</p>
      </div>

      <div className="p-4 space-y-3">
        {requests.length === 0 ? (
          <div className="text-center py-12">
            <Clock size={48} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-semibold text-gray-700">Aucune demande</h3>
            <p className="text-gray-500 mt-1">
              Vous n'avez pas encore fait de demande d'intervention
            </p>
          </div>
        ) : (
          requests.map((request) => {
            const status = statusConfig[request.status];
            const StatusIcon = status.icon;
            
            return (
              <Card 
                key={request.id} 
                hover
                onClick={() => navigate(`/client/request/${request.id}`)}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${serviceConfig[request.serviceType].bgColor}`}>
                    <StatusIcon size={20} className={serviceConfig[request.serviceType].color} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {serviceConfig[request.serviceType].label}
                        </h3>
                        {request.depanneurName && (
                          <p className="text-sm text-gray-500">{request.depanneurName}</p>
                        )}
                      </div>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {request.description}
                    </p>
                    
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-400">
                        {formatDate(request.createdAt)}
                      </span>
                      {request.price && (
                        <span className="font-semibold text-orange-500">
                          {request.price.toLocaleString()} FCFA
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <ChevronRight size={20} className="text-gray-400 flex-shrink-0" />
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
