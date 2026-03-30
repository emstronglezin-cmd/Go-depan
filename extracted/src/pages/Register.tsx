import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/store/authStore';
import { serviceConfig } from '@/components/ServiceIcon';
import { Wrench, ArrowLeft, User, Briefcase, Check } from 'lucide-react';
import type { UserRole, ServiceType } from '@/types';

export function Register() {
  const navigate = useNavigate();
  const { register } = useAuthStore();
  
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<UserRole>('client');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    services: [] as ServiceType[],
    description: '',
    priceMin: 5000,
    priceMax: 50000
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleService = (service: ServiceType) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const success = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role,
        services: formData.services,
        description: formData.description,
        priceMin: formData.priceMin,
        priceMax: formData.priceMax
      });

      if (success) {
        if (role === 'depanneur') {
          navigate('/depanneur');
        } else {
          navigate('/client');
        }
      }
    } catch {
      setError('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-orange-500 px-4 py-6 pb-20">
        <button
          onClick={() => step > 1 ? setStep(step - 1) : navigate('/')}
          className="flex items-center text-white mb-4"
        >
          <ArrowLeft size={20} className="mr-2" />
          Retour
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
            <Wrench className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Inscription</h1>
            <p className="text-white/80 text-sm">Étape {step} sur {role === 'depanneur' ? 3 : 2}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="px-4 -mt-12">
        <Card className="p-6">
          {/* Step 1: Role Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Choisissez votre profil
              </h2>
              
              <button
                onClick={() => setRole('client')}
                className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${
                  role === 'client'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  role === 'client' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  <User size={24} />
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-semibold text-gray-900">Client</h3>
                  <p className="text-sm text-gray-500">Je cherche un dépanneur</p>
                </div>
                {role === 'client' && (
                  <Check className="text-orange-500" size={24} />
                )}
              </button>

              <button
                onClick={() => setRole('depanneur')}
                className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${
                  role === 'depanneur'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  role === 'depanneur' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  <Briefcase size={24} />
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-semibold text-gray-900">Dépanneur</h3>
                  <p className="text-sm text-gray-500">Je propose mes services</p>
                </div>
                {role === 'depanneur' && (
                  <Check className="text-orange-500" size={24} />
                )}
              </button>

              <Button
                fullWidth
                size="lg"
                onClick={() => setStep(2)}
              >
                Continuer
              </Button>
            </div>
          )}

          {/* Step 2: Personal Info */}
          {step === 2 && (
            <form onSubmit={role === 'depanneur' ? () => setStep(3) : handleSubmit} className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Informations personnelles
              </h2>

              <Input
                label="Nom complet"
                placeholder="Ex: Amadou Ouédraogo"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
              <Input
                label="Email"
                type="email"
                placeholder="votre@email.bf"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
              <Input
                label="Téléphone"
                type="tel"
                placeholder="+226 70 00 00 00"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                required
              />
              <Input
                label="Mot de passe"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
              />
              <Input
                label="Confirmer le mot de passe"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                required
              />

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button
                type="submit"
                fullWidth
                size="lg"
                isLoading={isLoading && role === 'client'}
              >
                {role === 'depanneur' ? 'Continuer' : 'Créer mon compte'}
              </Button>
            </form>
          )}

          {/* Step 3: Professional Info (Depanneur only) */}
          {step === 3 && role === 'depanneur' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Informations professionnelles
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Services proposés
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(serviceConfig) as [ServiceType, typeof serviceConfig[ServiceType]][]).map(([key, config]) => {
                    const Icon = config.icon;
                    const isSelected = formData.services.includes(key);
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => toggleService(key)}
                        className={`p-3 rounded-xl border-2 flex items-center gap-2 transition-all ${
                          isSelected
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <Icon size={20} className={isSelected ? 'text-orange-500' : 'text-gray-400'} />
                        <span className={`text-sm font-medium ${
                          isSelected ? 'text-orange-600' : 'text-gray-600'
                        }`}>
                          {config.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows={3}
                  placeholder="Décrivez votre expérience et vos compétences..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Prix min (FCFA)"
                  type="number"
                  value={formData.priceMin}
                  onChange={(e) => setFormData(prev => ({ ...prev, priceMin: Number(e.target.value) }))}
                />
                <Input
                  label="Prix max (FCFA)"
                  type="number"
                  value={formData.priceMax}
                  onChange={(e) => setFormData(prev => ({ ...prev, priceMax: Number(e.target.value) }))}
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button
                type="submit"
                fullWidth
                size="lg"
                isLoading={isLoading}
              >
                Créer mon compte
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Déjà un compte ?{' '}
              <Link to="/login" className="text-orange-500 font-semibold">
                Se connecter
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
