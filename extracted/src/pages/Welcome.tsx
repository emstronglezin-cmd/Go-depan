import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Wrench, Users, Shield, ArrowRight } from 'lucide-react';

export function Welcome() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: Wrench,
      title: 'Dépannage rapide',
      description: 'Trouvez un dépanneur qualifié près de chez vous en quelques secondes.'
    },
    {
      icon: Users,
      title: 'Professionnels vérifiés',
      description: 'Tous nos dépanneurs sont vérifiés et évalués par la communauté.'
    },
    {
      icon: Shield,
      title: 'Paiement sécurisé',
      description: 'Payez en toute sécurité via Mobile Money ou en espèces.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-400 flex flex-col">
      {/* Header */}
      <div className="p-6 pt-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-lg mb-4">
          <Wrench className="w-10 h-10 text-orange-500" />
        </div>
        <h1 className="text-3xl font-bold text-white">Go Dépanne</h1>
        <p className="text-white/80 mt-1">Burkina Faso</p>
      </div>

      {/* Slider */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full">
          <div className="text-center">
            {slides.map((slide, index) => {
              const Icon = slide.icon;
              return (
                <div
                  key={index}
                  className={`transition-all duration-300 ${
                    currentSlide === index ? 'block' : 'hidden'
                  }`}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-orange-500" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {slide.title}
                  </h2>
                  <p className="text-gray-500">{slide.description}</p>
                </div>
              );
            })}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentSlide === index
                    ? 'w-6 bg-orange-500'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 pb-10 space-y-3">
        <Button
          fullWidth
          size="lg"
          onClick={() => navigate('/login')}
          className="bg-white text-orange-500 hover:bg-gray-50"
          rightIcon={<ArrowRight size={20} />}
        >
          Se connecter
        </Button>
        <Button
          fullWidth
          size="lg"
          variant="ghost"
          onClick={() => navigate('/register')}
          className="text-white hover:bg-white/20"
        >
          Créer un compte
        </Button>
      </div>
    </div>
  );
}
