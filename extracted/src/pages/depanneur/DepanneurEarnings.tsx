import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/store/authStore';
import { useDataStore } from '@/store/dataStore';
import type { Depanneur } from '@/types';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown,
  Wallet,
  Calendar,
  ArrowUpRight
} from 'lucide-react';

export function DepanneurEarnings() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getRequestsByDepanneur } = useDataStore();
  
  // Used for future features
  void (user as Depanneur);
  const myRequests = getRequestsByDepanneur(user?.id || '');
  const completedRequests = myRequests.filter(r => r.status === 'completed');

  const totalEarnings = completedRequests.reduce((acc, r) => acc + (r.price || 0), 0);
  const commission = totalEarnings * 0.1;
  const netEarnings = totalEarnings - commission;

  // Mock weekly data
  const weeklyData = [
    { day: 'Lun', amount: 25000 },
    { day: 'Mar', amount: 35000 },
    { day: 'Mer', amount: 20000 },
    { day: 'Jeu', amount: 45000 },
    { day: 'Ven', amount: 30000 },
    { day: 'Sam', amount: 55000 },
    { day: 'Dim', amount: 15000 }
  ];

  const maxAmount = Math.max(...weeklyData.map(d => d.amount));

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 px-4 py-6 pb-20">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-white">Revenus</h1>
        </div>

        <div className="text-center">
          <p className="text-white/60 text-sm mb-1">Solde total</p>
          <h2 className="text-4xl font-bold text-white">
            {netEarnings.toLocaleString()} <span className="text-lg">FCFA</span>
          </h2>
          <div className="flex items-center justify-center gap-1 mt-2 text-green-400">
            <TrendingUp size={16} />
            <span className="text-sm">+12% cette semaine</span>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-12 space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <ArrowUpRight size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total brut</p>
                <p className="font-bold text-gray-900">{totalEarnings.toLocaleString()} F</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <TrendingDown size={20} className="text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Commission (10%)</p>
                <p className="font-bold text-gray-900">{commission.toLocaleString()} F</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Weekly Chart */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Cette semaine</h3>
            <button className="flex items-center gap-1 text-sm text-orange-500">
              <Calendar size={14} />
              7 derniers jours
            </button>
          </div>
          
          <div className="flex items-end justify-between h-32 gap-2">
            {weeklyData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-orange-500 rounded-t-lg transition-all"
                  style={{ height: `${(data.amount / maxAmount) * 100}%` }}
                />
                <p className="text-xs text-gray-500 mt-2">{data.day}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">Dernières transactions</h3>
          
          <div className="space-y-3">
            {completedRequests.slice(0, 5).map((request) => (
              <div 
                key={request.id}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Wallet size={18} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{request.clientName}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(request.completedAt!).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <p className="font-bold text-green-600">
                  +{(request.price || 0).toLocaleString()} F
                </p>
              </div>
            ))}

            {completedRequests.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                Aucune transaction récente
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
