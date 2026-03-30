import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { useDataStore } from '@/store/dataStore';
import { useAuthStore } from '@/store/authStore';
import { 
  Users, 
  Wrench, 
  ClipboardList,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  LogOut,
  ChevronRight
} from 'lucide-react';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { getStats, depanneurs, requests, updateDepanneurStatus } = useDataStore();
  
  const stats = getStats();
  const pendingDepanneurs = depanneurs.filter(d => d.status === 'pending');
  const recentRequests = requests.slice(0, 5);

  const handleApprove = (id: string) => {
    updateDepanneurStatus(id, 'approved');
  };

  const handleReject = (id: string) => {
    updateDepanneurStatus(id, 'rejected');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Go Dépanne</h1>
            <p className="text-xs text-gray-500">Administration</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLogout}
          leftIcon={<LogOut size={18} />}
        >
          Déconnexion
        </Button>
      </div>

      <div className="p-4 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
                <p className="text-sm text-gray-500">Clients</p>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Wrench className="text-orange-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDepanneurs}</p>
                <p className="text-sm text-gray-500">Dépanneurs</p>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <ClipboardList className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.completedMissions}</p>
                <p className="text-sm text-gray-500">Missions</p>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-gray-500">FCFA Commission</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Pending Approvals */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="text-orange-500" size={20} />
              <h2 className="font-semibold text-gray-900">En attente de validation</h2>
            </div>
            <Badge variant="warning">{pendingDepanneurs.length}</Badge>
          </div>

          {pendingDepanneurs.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">
              Aucune demande en attente
            </p>
          ) : (
            <div className="space-y-3">
              {pendingDepanneurs.map((depanneur) => (
                <div 
                  key={depanneur.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                >
                  <Avatar name={depanneur.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900">{depanneur.name}</h3>
                    <p className="text-sm text-gray-500">{depanneur.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReject(depanneur.id)}
                      className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-200"
                    >
                      <XCircle size={18} className="text-red-600" />
                    </button>
                    <button
                      onClick={() => handleApprove(depanneur.id)}
                      className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center hover:bg-green-200"
                    >
                      <CheckCircle size={18} className="text-green-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Requests */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Dernières demandes</h2>
            <button className="text-orange-500 text-sm font-medium flex items-center">
              Voir tout <ChevronRight size={16} />
            </button>
          </div>

          <div className="space-y-3">
            {recentRequests.map((request) => (
              <div 
                key={request.id}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <div>
                  <p className="font-medium text-gray-900">{request.clientName}</p>
                  <p className="text-sm text-gray-500">
                    {request.depanneurName || 'En attente'} • {new Date(request.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <Badge 
                  variant={
                    request.status === 'completed' ? 'success' :
                    request.status === 'pending' ? 'warning' :
                    request.status === 'cancelled' ? 'danger' : 'info'
                  }
                >
                  {request.status === 'completed' ? 'Terminée' :
                   request.status === 'pending' ? 'En attente' :
                   request.status === 'cancelled' ? 'Annulée' : 'En cours'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* All Depanneurs */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Tous les dépanneurs</h2>
            <Badge>{depanneurs.length}</Badge>
          </div>

          <div className="space-y-3">
            {depanneurs.map((depanneur) => (
              <div 
                key={depanneur.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
              >
                <Avatar src={depanneur.avatar} name={depanneur.name} size="md" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900">{depanneur.name}</h3>
                  <p className="text-sm text-gray-500">
                    {depanneur.completedMissions} missions • {depanneur.rating.toFixed(1)} ⭐
                  </p>
                </div>
                <Badge 
                  variant={
                    depanneur.status === 'approved' ? 'success' :
                    depanneur.status === 'pending' ? 'warning' : 'danger'
                  }
                >
                  {depanneur.status === 'approved' ? 'Vérifié' :
                   depanneur.status === 'pending' ? 'En attente' : 'Bloqué'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
