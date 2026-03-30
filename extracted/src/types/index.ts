// Types d'utilisateurs
export type UserRole = 'client' | 'depanneur' | 'admin';

// Types de services
export type ServiceType = 
  | 'electricite' 
  | 'plomberie' 
  | 'mecanique' 
  | 'climatisation' 
  | 'informatique' 
  | 'autres';

// Statut de la demande
export type RequestStatus = 
  | 'pending' 
  | 'accepted' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled';

// Statut du dépanneur
export type DepanneurStatus = 'pending' | 'approved' | 'rejected' | 'blocked';

export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
}

export interface Client extends User {
  role: 'client';
}

export interface Depanneur extends User {
  role: 'depanneur';
  services: ServiceType[];
  description: string;
  identityDoc?: string;
  status: DepanneurStatus;
  rating: number;
  totalReviews: number;
  priceRange: {
    min: number;
    max: number;
  };
  isAvailable: boolean;
  interventionZone: number; // rayon en km
  totalEarnings: number;
  completedMissions: number;
}

export interface ServiceRequest {
  id: string;
  clientId: string;
  clientName: string;
  depanneurId?: string;
  depanneurName?: string;
  serviceType: ServiceType;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  status: RequestStatus;
  price?: number;
  createdAt: Date;
  acceptedAt?: Date;
  completedAt?: Date;
  rating?: number;
  review?: string;
}

export interface Message {
  id: string;
  requestId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  type: 'request' | 'message' | 'system';
  data?: Record<string, unknown>;
}

export interface Stats {
  totalUsers: number;
  totalClients: number;
  totalDepanneurs: number;
  pendingDepanneurs: number;
  totalMissions: number;
  completedMissions: number;
  totalRevenue: number;
  activeUsers: number;
}
