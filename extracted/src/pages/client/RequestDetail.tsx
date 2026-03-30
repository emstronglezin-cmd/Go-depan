import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { serviceConfig } from '@/components/ServiceIcon';
import { useDataStore } from '@/store/dataStore';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  MessageCircle,
  Star,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import type { RequestStatus } from '@/types';

const statusConfig: Record<RequestStatus, { 
  label: string; 
  variant: 'default' | 'success' | 'warning' | 'danger' | 'info';
  description: string;
}> = {
  pending: { 
    label: 'En attente', 
    variant: 'warning',
    description: 'Votre demande est en attente d\'acceptation'
  },
  accepted: { 
    label: 'Acceptée', 
    variant: 'info',
    description: 'Le dépanneur a accepté votre demande'
  },
  in_progress: { 
    label: 'En cours', 
    variant: 'info',
    description: 'L\'intervention est en cours'
  },
  completed: { 
    label: 'Terminée', 
    variant: 'success',
    description: 'L\'intervention a été effectuée'
  },
  cancelled: { 
    label: 'Annulée', 
    variant: 'danger',
    description: 'La demande a été annulée'
  }
};

export function RequestDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { requests, getDepanneurById, rateRequest, updateRequestStatus } = useDataStore();
  
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  
  const request = requests.find(r => r.id === id);
  const depanneur = request?.depanneurId ? getDepanneurById(request.depanneurId) : null;

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Demande non trouvée</p>
      </div>
    );
  }

  const status = statusConfig[request.status];
  const service = serviceConfig[request.serviceType];
  const ServiceIcon = service.icon;

  const handleRate = () => {
    rateRequest(request.id, rating, review);
    setShowRatingModal(false);
  };

  const handleCancel = () => {
    updateRequestStatus(request.id, 'cancelled');
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className={`${service.bgColor} px-4 py-6 pb-16`}>
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-700">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Détails de la demande</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
            <ServiceIcon size={28} className={service.color} />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">{service.label}</h2>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-8 space-y-4">
        {/* Status Card */}
        <Card>
          <div className="flex items-center gap-3">
            {request.status === 'completed' ? (
              <CheckCircle className="text-green-500" size={24} />
            ) : request.status === 'cancelled' ? (
              <XCircle className="text-red-500" size={24} />
            ) : (
              <Clock className="text-blue-500" size={24} />
            )}
            <div>
              <p className="font-semibold text-gray-900">{status.label}</p>
              <p className="text-sm text-gray-500">{status.description}</p>
            </div>
          </div>
        </Card>

        {/* Depanneur Info */}
        {depanneur && (
          <Card>
            <h3 className="font-semibold text-gray-900 mb-3">Dépanneur</h3>
            <div className="flex items-center gap-3">
              <Avatar src={depanneur.avatar} name={depanneur.name} size="lg" />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{depanneur.name}</h4>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  <span>{depanneur.rating.toFixed(1)}</span>
                  <span>({depanneur.totalReviews} avis)</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                leftIcon={<Phone size={16} />}
              >
                Appeler
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                leftIcon={<MessageCircle size={16} />}
                onClick={() => navigate(`/client/chat/${request.id}`)}
              >
                Chat
              </Button>
            </div>
          </Card>
        )}

        {/* Request Details */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-3">Détails</h3>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Adresse</p>
                <p className="text-gray-900">{request.location.address}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Clock size={18} className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Date de la demande</p>
                <p className="text-gray-900">{formatDate(request.createdAt)}</p>
              </div>
            </div>
            
            {request.price && (
              <div className="flex items-start gap-3">
                <span className="text-gray-400 font-bold">₣</span>
                <div>
                  <p className="text-sm text-gray-500">Prix</p>
                  <p className="text-gray-900 font-bold">{request.price.toLocaleString()} FCFA</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Description */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-2">Description du problème</h3>
          <p className="text-gray-600">{request.description}</p>
        </Card>

        {/* Rating (if completed) */}
        {request.status === 'completed' && request.rating && (
          <Card>
            <h3 className="font-semibold text-gray-900 mb-2">Votre évaluation</h3>
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star}
                  size={24} 
                  className={star <= request.rating! ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'} 
                />
              ))}
            </div>
            {request.review && (
              <p className="text-gray-600 text-sm">{request.review}</p>
            )}
          </Card>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
        {request.status === 'pending' && (
          <Button
            fullWidth
            size="lg"
            variant="danger"
            onClick={handleCancel}
          >
            Annuler la demande
          </Button>
        )}
        
        {request.status === 'completed' && !request.rating && (
          <Button
            fullWidth
            size="lg"
            onClick={() => setShowRatingModal(true)}
            leftIcon={<Star size={20} />}
          >
            Évaluer le dépanneur
          </Button>
        )}
        
        {(request.status === 'accepted' || request.status === 'in_progress') && (
          <Button
            fullWidth
            size="lg"
            onClick={() => navigate(`/client/chat/${request.id}`)}
            leftIcon={<MessageCircle size={20} />}
          >
            Contacter le dépanneur
          </Button>
        )}
      </div>

      {/* Rating Modal */}
      <Modal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        title="Évaluer le dépanneur"
      >
        <div className="space-y-4">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="p-1"
              >
                <Star 
                  size={36} 
                  className={star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'} 
                />
              </button>
            ))}
          </div>
          
          <textarea
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            rows={3}
            placeholder="Laissez un commentaire (optionnel)"
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
          
          <Button fullWidth size="lg" onClick={handleRate}>
            Soumettre l'évaluation
          </Button>
        </div>
      </Modal>
    </div>
  );
}
