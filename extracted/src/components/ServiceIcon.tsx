import { 
  Zap, 
  Droplets, 
  Car, 
  Wind, 
  Monitor, 
  Wrench 
} from 'lucide-react';
import type { ServiceType } from '@/types';

interface ServiceIconProps {
  service: ServiceType;
  size?: number;
  className?: string;
}

export const serviceConfig: Record<ServiceType, { 
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  color: string;
  bgColor: string;
}> = {
  electricite: {
    icon: Zap,
    label: 'Électricité',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100'
  },
  plomberie: {
    icon: Droplets,
    label: 'Plomberie',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  mecanique: {
    icon: Car,
    label: 'Mécanique',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100'
  },
  climatisation: {
    icon: Wind,
    label: 'Climatisation',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100'
  },
  informatique: {
    icon: Monitor,
    label: 'Informatique',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  autres: {
    icon: Wrench,
    label: 'Autres',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  }
};

export function ServiceIcon({ service, size = 24, className }: ServiceIconProps) {
  const config = serviceConfig[service];
  const Icon = config.icon;
  
  return <Icon size={size} className={className || config.color} />;
}
