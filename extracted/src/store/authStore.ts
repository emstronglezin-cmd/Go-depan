import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Depanneur, Client, UserRole, ServiceType, DepanneurStatus } from '@/types';

interface AuthState {
  user: User | Depanneur | Client | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<User | Depanneur>) => void;
  updateAvailability: (isAvailable: boolean) => void;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  services?: ServiceType[];
  description?: string;
  priceMin?: number;
  priceMax?: number;
}

// Données de démonstration
const mockUsers: Record<string, User | Depanneur | Client> = {
  'client@godepanne.bf': {
    id: 'client-1',
    email: 'client@godepanne.bf',
    phone: '+226 70 00 00 01',
    name: 'Amadou Ouédraogo',
    role: 'client',
    createdAt: new Date(),
    location: {
      lat: 12.3714,
      lng: -1.5197,
      address: 'Ouagadougou, Zone du Bois'
    }
  } as Client,
  'depanneur@godepanne.bf': {
    id: 'depanneur-1',
    email: 'depanneur@godepanne.bf',
    phone: '+226 70 00 00 02',
    name: 'Ibrahim Sawadogo',
    role: 'depanneur',
    services: ['electricite', 'climatisation'],
    description: 'Électricien professionnel avec 10 ans d\'expérience. Spécialisé dans les installations électriques et la climatisation.',
    status: 'approved' as DepanneurStatus,
    rating: 4.8,
    totalReviews: 156,
    priceRange: { min: 5000, max: 50000 },
    isAvailable: true,
    interventionZone: 15,
    totalEarnings: 2450000,
    completedMissions: 156,
    createdAt: new Date(),
    location: {
      lat: 12.3650,
      lng: -1.5100,
      address: 'Ouagadougou, Pissy'
    }
  } as Depanneur,
  'admin@godepanne.bf': {
    id: 'admin-1',
    email: 'admin@godepanne.bf',
    phone: '+226 70 00 00 00',
    name: 'Administrateur',
    role: 'admin',
    createdAt: new Date()
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, _password: string, _role: UserRole) => {
        // Simulation de connexion
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const user = mockUsers[email.toLowerCase()];
        if (user) {
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },

      register: async (data: RegisterData) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const id = `user-${Date.now()}`;
        let newUser: User | Depanneur | Client;

        if (data.role === 'depanneur') {
          newUser = {
            id,
            email: data.email,
            phone: data.phone,
            name: data.name,
            role: 'depanneur',
            services: data.services || [],
            description: data.description || '',
            status: 'pending' as DepanneurStatus,
            rating: 0,
            totalReviews: 0,
            priceRange: { min: data.priceMin || 5000, max: data.priceMax || 50000 },
            isAvailable: false,
            interventionZone: 10,
            totalEarnings: 0,
            completedMissions: 0,
            createdAt: new Date()
          } as Depanneur;
        } else {
          newUser = {
            id,
            email: data.email,
            phone: data.phone,
            name: data.name,
            role: 'client',
            createdAt: new Date()
          } as Client;
        }

        mockUsers[data.email.toLowerCase()] = newUser;
        set({ user: newUser, isAuthenticated: true });
        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateUser: (data) => {
        const { user } = get();
        if (user) {
          const updatedUser = { ...user, ...data };
          set({ user: updatedUser });
        }
      },

      updateAvailability: (isAvailable: boolean) => {
        const { user } = get();
        if (user && user.role === 'depanneur') {
          set({ user: { ...user, isAvailable } as Depanneur });
        }
      }
    }),
    {
      name: 'godepanne-auth'
    }
  )
);
