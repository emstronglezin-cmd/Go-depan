import { cn } from '@/utils/cn';
import { User } from 'lucide-react';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-xl'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 28,
    xl: 40
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={cn(
          'rounded-full object-cover',
          sizes[size],
          className
        )}
      />
    );
  }

  if (name) {
    return (
      <div
        className={cn(
          'rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-semibold',
          sizes[size],
          className
        )}
      >
        {getInitials(name)}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-full bg-gray-100 text-gray-400 flex items-center justify-center',
        sizes[size],
        className
      )}
    >
      <User size={iconSizes[size]} />
    </div>
  );
}
