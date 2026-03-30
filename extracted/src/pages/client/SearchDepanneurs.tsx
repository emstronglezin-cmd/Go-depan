import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { serviceConfig, ServiceIcon } from '@/components/ServiceIcon';
import { useDataStore } from '@/store/dataStore';
import { ArrowLeft, Star, MapPin, Filter, Map } from 'lucide-react';
import type { ServiceType } from '@/types';

export function SearchDepanneurs() {
  const navigate = useNavigate();
  const { service } = useParams<{ service?: string }>();
  const { depanneurs } = useDataStore();
  
  const [selectedService, setSelectedService] = useState<ServiceType | null>(
    service as ServiceType || null
  );
  const [showMap, setShowMap] = useState(false);

  const filteredDepanneurs = useMemo(() => {
    return depanneurs.filter(d => {
      if (d.status !== 'approved') return false;
      if (selectedService && !d.services.includes(selectedService)) return false;
      return true;
    });
  }, [depanneurs, selectedService]);

  const services = Object.entries(serviceConfig) as [ServiceType, typeof serviceConfig[ServiceType]][];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 flex-1">
            {selectedService ? serviceConfig[selectedService].label : 'Dépanneurs'}
          </h1>
          <button
            onClick={() => setShowMap(!showMap)}
            className={`p-2 rounded-lg ${showMap ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'}`}
          >
            <Map size={20} />
          </button>
          <button className="p-2 rounded-lg bg-gray-100 text-gray-600">
            <Filter size={20} />
          </button>
        </div>

        {/* Service Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          <button
            onClick={() => setSelectedService(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              !selectedService
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tous
          </button>
          {services.map(([key, config]) => (
            <button
              key={key}
              onClick={() => setSelectedService(key)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedService === key
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <ServiceIcon service={key} size={16} className={selectedService === key ? 'text-white' : config.color} />
              {config.label}
            </button>
          ))}
        </div>
      </div>

      {showMap ? (
        // Map View Placeholder
        <div className="h-96 bg-gray-200 flex items-center justify-center m-4 rounded-2xl">
          <div className="text-center">
            <Map size={48} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">Carte interactive</p>
            <p className="text-sm text-gray-400">Intégration Google Maps requise</p>
          </div>
        </div>
      ) : (
        // List View
        <div className="p-4 space-y-3">
          <p className="text-sm text-gray-500 mb-2">
            {filteredDepanneurs.length} dépanneur{filteredDepanneurs.length > 1 ? 's' : ''} trouvé{filteredDepanneurs.length > 1 ? 's' : ''}
          </p>

          {filteredDepanneurs.map((depanneur) => (
            <Card 
              key={depanneur.id}
              hover
              onClick={() => navigate(`/client/depanneur/${depanneur.id}`)}
            >
              <div className="flex gap-3">
                <Avatar src={depanneur.avatar} name={depanneur.name} size="lg" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{depanneur.name}</h3>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium text-gray-700">
                          {depanneur.rating.toFixed(1)}
                        </span>
                        <span className="text-sm text-gray-400">
                          ({depanneur.totalReviews} avis)
                        </span>
                      </div>
                    </div>
                    {depanneur.isAvailable ? (
                      <Badge variant="success">Disponible</Badge>
                    ) : (
                      <Badge variant="default">Indisponible</Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {depanneur.services.map(s => (
                      <span 
                        key={s}
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${serviceConfig[s].bgColor} ${serviceConfig[s].color}`}
                      >
                        {serviceConfig[s].label}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span className="flex items-center text-sm text-gray-500">
                      <MapPin size={14} className="mr-1" />
                      {depanneur.location?.address?.split(',')[0]}
                    </span>
                    <span className="text-orange-500 font-bold">
                      {depanneur.priceRange.min.toLocaleString()} - {depanneur.priceRange.max.toLocaleString()} F
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {filteredDepanneurs.length === 0 && (
            <div className="text-center py-12">
              <ServiceIcon 
                service={selectedService || 'autres'} 
                size={48} 
                className="mx-auto text-gray-300 mb-3"
              />
              <h3 className="text-lg font-semibold text-gray-700">Aucun dépanneur trouvé</h3>
              <p className="text-gray-500 mt-1">
                Aucun dépanneur n'est disponible pour ce service
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setSelectedService(null)}
              >
                Voir tous les services
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
