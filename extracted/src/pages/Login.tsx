import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/authStore';
import { Wrench, Mail, Lock, ArrowLeft, User, Briefcase, Shield } from 'lucide-react';
import type { UserRole } from '@/types';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('client');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password, role);
      if (success) {
        if (role === 'admin') {
          navigate('/admin');
        } else if (role === 'depanneur') {
          navigate('/depanneur');
        } else {
          navigate('/client');
        }
      } else {
        setError('Email ou mot de passe incorrect');
      }
    } catch {
      setError('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    { email: 'client@godepanne.bf', role: 'client' as UserRole, label: 'Client' },
    { email: 'depanneur@godepanne.bf', role: 'depanneur' as UserRole, label: 'Dépanneur' },
    { email: 'admin@godepanne.bf', role: 'admin' as UserRole, label: 'Admin' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-orange-500 px-4 py-6 pb-20">
        <button
          onClick={() => navigate('/')}
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
            <h1 className="text-xl font-bold text-white">Connexion</h1>
            <p className="text-white/80 text-sm">Accédez à votre compte</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="px-4 -mt-12">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* Role Selection */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {[
              { value: 'client', icon: User, label: 'Client' },
              { value: 'depanneur', icon: Briefcase, label: 'Dépanneur' },
              { value: 'admin', icon: Shield, label: 'Admin' }
            ].map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => setRole(value as UserRole)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  role === value
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <Icon
                  size={24}
                  className={`mx-auto mb-1 ${
                    role === value ? 'text-orange-500' : 'text-gray-400'
                  }`}
                />
                <span
                  className={`text-xs font-medium ${
                    role === value ? 'text-orange-500' : 'text-gray-500'
                  }`}
                >
                  {label}
                </span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="votre@email.bf"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail size={20} />}
              required
            />
            <Input
              label="Mot de passe"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock size={20} />}
              required
            />

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={isLoading}
            >
              Se connecter
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-orange-500 font-semibold">
                S'inscrire
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Accounts */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <p className="text-sm font-medium text-blue-900 mb-2">
            🎮 Comptes de démonstration :
          </p>
          <div className="space-y-1">
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                onClick={() => {
                  setEmail(account.email);
                  setPassword('demo');
                  setRole(account.role);
                }}
                className="block w-full text-left text-sm text-blue-700 hover:text-blue-900"
              >
                <span className="font-medium">{account.label}:</span> {account.email}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
