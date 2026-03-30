import { create } from 'zustand';
import type { ServiceRequest, Depanneur, Message, Stats, ServiceType, RequestStatus, DepanneurStatus } from '@/types';

interface DataState {
  // Dépanneurs
  depanneurs: Depanneur[];
  getDepanneursByService: (service: ServiceType) => Depanneur[];
  getDepanneurById: (id: string) => Depanneur | undefined;
  updateDepanneurStatus: (id: string, status: DepanneurStatus) => void;
  
  // Demandes
  requests: ServiceRequest[];
  getRequestsByClient: (clientId: string) => ServiceRequest[];
  getRequestsByDepanneur: (depanneurId: string) => ServiceRequest[];
  getPendingRequests: () => ServiceRequest[];
  createRequest: (request: Omit<ServiceRequest, 'id' | 'createdAt'>) => ServiceRequest;
  updateRequestStatus: (id: string, status: RequestStatus, depanneurId?: string, depanneurName?: string) => void;
  rateRequest: (id: string, rating: number, review?: string) => void;
  
  // Messages
  messages: Message[];
  getMessagesByRequest: (requestId: string) => Message[];
  sendMessage: (message: Omit<Message, 'id' | 'createdAt'>) => void;
  
  // Stats
  getStats: () => Stats;
}

// Données de démonstration - Dépanneurs
const mockDepanneurs: Depanneur[] = [
  {
    id: 'depanneur-1',
    email: 'ibrahim@godepanne.bf',
    phone: '+226 70 12 34 56',
    name: 'Ibrahim Sawadogo',
    role: 'depanneur',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    services: ['electricite', 'climatisation'],
    description: 'Électricien professionnel avec 10 ans d\'expérience.',
    status: 'approved',
    rating: 4.8,
    totalReviews: 156,
    priceRange: { min: 5000, max: 50000 },
    isAvailable: true,
    interventionZone: 15,
    totalEarnings: 2450000,
    completedMissions: 156,
    createdAt: new Date(),
    location: { lat: 12.3650, lng: -1.5100, address: 'Pissy, Ouagadougou' }
  },
  {
    id: 'depanneur-2',
    email: 'fatou@godepanne.bf',
    phone: '+226 76 98 76 54',
    name: 'Fatou Traoré',
    role: 'depanneur',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    services: ['plomberie'],
    description: 'Plombière qualifiée. Installation et réparation.',
    status: 'approved',
    rating: 4.6,
    totalReviews: 89,
    priceRange: { min: 3000, max: 35000 },
    isAvailable: true,
    interventionZone: 10,
    totalEarnings: 1280000,
    completedMissions: 89,
    createdAt: new Date(),
    location: { lat: 12.3800, lng: -1.5300, address: 'Tanghin, Ouagadougou' }
  },
  {
    id: 'depanneur-3',
    email: 'moussa@godepanne.bf',
    phone: '+226 70 45 67 89',
    name: 'Moussa Kaboré',
    role: 'depanneur',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    services: ['mecanique'],
    description: 'Mécanicien automobile toutes marques.',
    status: 'approved',
    rating: 4.9,
    totalReviews: 234,
    priceRange: { min: 10000, max: 150000 },
    isAvailable: false,
    interventionZone: 20,
    totalEarnings: 5670000,
    completedMissions: 234,
    createdAt: new Date(),
    location: { lat: 12.3500, lng: -1.4900, address: 'Zone 1, Ouagadougou' }
  },
  {
    id: 'depanneur-4',
    email: 'ali@godepanne.bf',
    phone: '+226 78 11 22 33',
    name: 'Ali Compaoré',
    role: 'depanneur',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    services: ['informatique'],
    description: 'Technicien informatique. Réparation PC et réseau.',
    status: 'approved',
    rating: 4.7,
    totalReviews: 67,
    priceRange: { min: 5000, max: 40000 },
    isAvailable: true,
    interventionZone: 12,
    totalEarnings: 890000,
    completedMissions: 67,
    createdAt: new Date(),
    location: { lat: 12.3900, lng: -1.5000, address: 'Patte d\'Oie, Ouagadougou' }
  },
  {
    id: 'depanneur-5',
    email: 'jean@godepanne.bf',
    phone: '+226 70 99 88 77',
    name: 'Jean-Paul Nikiéma',
    role: 'depanneur',
    services: ['climatisation', 'electricite'],
    description: 'Spécialiste climatisation et froid.',
    status: 'pending',
    rating: 0,
    totalReviews: 0,
    priceRange: { min: 8000, max: 60000 },
    isAvailable: false,
    interventionZone: 15,
    totalEarnings: 0,
    completedMissions: 0,
    createdAt: new Date(),
    location: { lat: 12.3600, lng: -1.5400, address: 'Dassasgho, Ouagadougou' }
  }
];

// Données de démonstration - Demandes
const mockRequests: ServiceRequest[] = [
  {
    id: 'req-1',
    clientId: 'client-1',
    clientName: 'Amadou Ouédraogo',
    depanneurId: 'depanneur-1',
    depanneurName: 'Ibrahim Sawadogo',
    serviceType: 'electricite',
    description: 'Panne électrique dans la cuisine. Les prises ne fonctionnent plus.',
    location: { lat: 12.3714, lng: -1.5197, address: 'Zone du Bois, Ouagadougou' },
    status: 'completed',
    price: 15000,
    createdAt: new Date(Date.now() - 86400000 * 3),
    acceptedAt: new Date(Date.now() - 86400000 * 3 + 1800000),
    completedAt: new Date(Date.now() - 86400000 * 3 + 7200000),
    rating: 5,
    review: 'Excellent travail, très professionnel!'
  },
  {
    id: 'req-2',
    clientId: 'client-1',
    clientName: 'Amadou Ouédraogo',
    depanneurId: 'depanneur-2',
    depanneurName: 'Fatou Traoré',
    serviceType: 'plomberie',
    description: 'Fuite d\'eau sous l\'évier de la salle de bain.',
    location: { lat: 12.3714, lng: -1.5197, address: 'Zone du Bois, Ouagadougou' },
    status: 'in_progress',
    price: 12000,
    createdAt: new Date(Date.now() - 3600000),
    acceptedAt: new Date(Date.now() - 1800000)
  },
  {
    id: 'req-3',
    clientId: 'client-2',
    clientName: 'Aïcha Zongo',
    serviceType: 'mecanique',
    description: 'Ma voiture ne démarre plus. Besoin d\'un mécanicien urgentment.',
    location: { lat: 12.3800, lng: -1.5100, address: 'Tampouy, Ouagadougou' },
    status: 'pending',
    createdAt: new Date()
  }
];

const mockMessages: Message[] = [
  {
    id: 'msg-1',
    requestId: 'req-2',
    senderId: 'client-1',
    senderName: 'Amadou Ouédraogo',
    content: 'Bonjour, êtes-vous en route?',
    createdAt: new Date(Date.now() - 1200000)
  },
  {
    id: 'msg-2',
    requestId: 'req-2',
    senderId: 'depanneur-2',
    senderName: 'Fatou Traoré',
    content: 'Oui, j\'arrive dans 10 minutes.',
    createdAt: new Date(Date.now() - 900000)
  }
];

export const useDataStore = create<DataState>((set, get) => ({
  depanneurs: mockDepanneurs,
  requests: mockRequests,
  messages: mockMessages,

  getDepanneursByService: (service: ServiceType) => {
    return get().depanneurs.filter(d => 
      d.services.includes(service) && 
      d.status === 'approved' && 
      d.isAvailable
    );
  },

  getDepanneurById: (id: string) => {
    return get().depanneurs.find(d => d.id === id);
  },

  updateDepanneurStatus: (id: string, status: DepanneurStatus) => {
    set(state => ({
      depanneurs: state.depanneurs.map(d =>
        d.id === id ? { ...d, status } : d
      )
    }));
  },

  getRequestsByClient: (clientId: string) => {
    return get().requests.filter(r => r.clientId === clientId);
  },

  getRequestsByDepanneur: (depanneurId: string) => {
    return get().requests.filter(r => r.depanneurId === depanneurId);
  },

  getPendingRequests: () => {
    return get().requests.filter(r => r.status === 'pending');
  },

  createRequest: (requestData) => {
    const newRequest: ServiceRequest = {
      ...requestData,
      id: `req-${Date.now()}`,
      createdAt: new Date()
    };
    set(state => ({
      requests: [newRequest, ...state.requests]
    }));
    return newRequest;
  },

  updateRequestStatus: (id, status, depanneurId?, depanneurName?) => {
    set(state => ({
      requests: state.requests.map(r =>
        r.id === id
          ? {
              ...r,
              status,
              depanneurId: depanneurId || r.depanneurId,
              depanneurName: depanneurName || r.depanneurName,
              acceptedAt: status === 'accepted' ? new Date() : r.acceptedAt,
              completedAt: status === 'completed' ? new Date() : r.completedAt
            }
          : r
      )
    }));
  },

  rateRequest: (id, rating, review) => {
    set(state => ({
      requests: state.requests.map(r =>
        r.id === id ? { ...r, rating, review } : r
      )
    }));
  },

  getMessagesByRequest: (requestId: string) => {
    return get().messages.filter(m => m.requestId === requestId);
  },

  sendMessage: (messageData) => {
    const newMessage: Message = {
      ...messageData,
      id: `msg-${Date.now()}`,
      createdAt: new Date()
    };
    set(state => ({
      messages: [...state.messages, newMessage]
    }));
  },

  getStats: () => {
    const { depanneurs, requests } = get();
    return {
      totalUsers: 150,
      totalClients: 120,
      totalDepanneurs: depanneurs.length,
      pendingDepanneurs: depanneurs.filter(d => d.status === 'pending').length,
      totalMissions: requests.length,
      completedMissions: requests.filter(r => r.status === 'completed').length,
      totalRevenue: requests
        .filter(r => r.status === 'completed' && r.price)
        .reduce((acc, r) => acc + (r.price || 0) * 0.1, 0),
      activeUsers: 45
    };
  }
}));
