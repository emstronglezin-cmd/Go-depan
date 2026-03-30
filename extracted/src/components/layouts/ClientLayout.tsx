import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, Clock, User } from 'lucide-react';

export function ClientLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Accueil', path: '/client' },
    { icon: Search, label: 'Recherche', path: '/client/search' },
    { icon: Clock, label: 'Historique', path: '/client/history' },
    { icon: User, label: 'Profil', path: '/client/profile' }
  ];

  const isActive = (path: string) => {
    if (path === '/client') return location.pathname === '/client';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-pb">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all ${
                  active ? 'text-orange-500' : 'text-gray-400'
                }`}
              >
                <item.icon 
                  size={24} 
                  className={active ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}
                />
                <span className={`text-xs mt-1 ${active ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
