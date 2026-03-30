import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { serviceConfig } from '@/components/ServiceIcon';
import { useDataStore } from '@/store/dataStore';
import { useAuthStore } from '@/store/authStore';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Phone, 
  MessageCircle,
  Clock,
  Award,
  Send
} from 'lucide-react';

export function DepanneurProfile() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getDepanneurById, createRequest } = useDataStore();
  const { user } = useAuthStore();
  
  const depanneur = getDepanneurById(id || '');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!depanneur) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Dépanneur non trouvé</p>
      </div>
    );
  }

  const handleSendRequest = async () => {
    if (!user || !selectedService) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const request = createRequest({
      clientId: user.id,
      clientName: user.name,
      depanneurId: depanneur.id,
      depanneurName: depanneur.name,
      serviceType: selectedService as any,
      description,
      location: user.location || { lat: 12.3714, lng: -1.5197, address: 'Ouagadougou' },
      status: 'pending'
    });
    
    setIsSubmitting(false);
    setShowRequestModal(false);
    navigate(`/client/request/${request.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header with Avatar */}
      <div className="bg-orange-500 px-4 pt-4 pb-16 relative">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white">
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="px-4 -mt-12">
        {/* Profile Card */}
        <Card className="text-center pb-6">
          <div className="-mt-12 mb-4">
            <Avatar 
              src={depanneur.avatar} 
              name={depanneur.name} 
              size="xl" 
              className="mx-auto border-4 border-white shadow-lg"
            />
          </div>
          
          <h1 className="text-xl font-bold text-gray-900">{depanneur.name}</h1>
          
          <div className="flex items-center justify-center gap-1 mt-1">
            <Star size={16} className="text-yellow-500 fill-yellow-500" />
            <span className="font-semibold text-gray-700">{depanneur.rating.toFixed(1)}</span>
            <span className="text-gray-400">({depanneur.totalReviews} avis)</span>
          </div>

          <div className="flex items-center justify-center gap-1 mt-2 text-gray-500">
            <MapPin size={16} />
            <span className="text-sm">{depanneur.location?.address}</span>
          </div>

          <div className="flex justify-center gap-2 mt-4">
            {depanneur.isAvailable ? (
              <Badge variant="success" size="md">Disponible</Badge>
            ) : (
              <Badge variant="default" size="md">Indisponible</Badge>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {depanneur.services.map(s => (
              <span 
                key={s}
                className={`px-3 py-1 rounded-full text-sm font-medium ${serviceConfig[s].bgColor} ${serviceConfig[s].color}`}
              >
                {serviceConfig[s].label}
              </span>
            ))}
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <Card className="text-center py-3">
            <Award className="mx-auto text-orange-500 mb-1" size={24} />
            <p className="text-lg font-bold text-gray-900">{depanneur.completedMissions}</p>
            <p className="text-xs text-gray-500">Missions</p>
          </Card>
          <Card className="text-center py-3">
            <Clock className="mx-auto text-blue-500 mb-1" size={24} />
            <p className="text-lg font-bold text-gray-900">{depanneur.interventionZone}km</p>
            <p className="text-xs text-gray-500">Zone</p>
          </Card>
          <Card className="text-center py-3">
            <Star className="mx-auto text-yellow-500 mb-1" size={24} />
            <p className="text-lg font-bold text-gray-900">{depanneur.rating.toFixed(1)}</p>
            <p className="text-xs text-gray-500">Note</p>
          </Card>
        </div>

        {/* Description */}
        <Card className="mt-4">
          <h3 className="font-semibold text-gray-900 mb-2">À propos</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{depanneur.description}</p>
        </Card>

        {/* Pricing */}
        <Card className="mt-4">
          <h3 className="font-semibold text-gray-900 mb-2">Tarifs indicatifs</h3>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Prix d'intervention</span>
            <span className="font-bold text-orange-500">
              {depanneur.priceRange.min.toLocaleString()} - {depanneur.priceRange.max.toLocaleString()} FCFA
            </span>
          </div>
        </Card>

        {/* Contact Buttons */}
        <div className="flex gap-3 mt-4">
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            leftIcon={<Phone size={20} />}
          >
            Appeler
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            leftIcon={<MessageCircle size={20} />}
          >
            Message
          </Button>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
        <Button
          fullWidth
          size="lg"
          onClick={() => setShowRequestModal(true)}
          disabled={!depanneur.isAvailable}
          leftIcon={<Send size={20} />}
        >
          {depanneur.isAvailable ? 'Demander une intervention' : 'Indisponible'}
        </Button>
      </div>

      {/* Request Modal */}
      <Modal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        title="Demande d'intervention"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de service
            </label>
            <div className="grid grid-cols-2 gap-2">
              {depanneur.services.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedService(s)}
                  className={`p-3 rounded-xl border-2 flex items-center gap-2 transition-all ${
                    selectedService === s
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <span className={`text-sm font-medium ${
                    selectedService === s ? 'text-orange-600' : 'text-gray-600'
                  }`}>
                    {serviceConfig[s].label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Décrivez votre problème
            </label>
            <textarea
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows={4}
              placeholder="Ex: Ma climatisation ne refroidit plus depuis hier..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <Button
            fullWidth
            size="lg"
            onClick={handleSendRequest}
            isLoading={isSubmitting}
            disabled={!selectedService || !description}
          >
            Envoyer la demande
          </Button>
        </div>
      </Modal>
    </div>
  );
}
