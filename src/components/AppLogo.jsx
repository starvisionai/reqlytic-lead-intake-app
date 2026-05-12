import { useAuth } from '@/lib/AuthContext';
import { Zap } from 'lucide-react';

/**
 * Renders the app logo from platform settings, with a Zap icon fallback.
 * size: 'sm' (28px) | 'md' (32px, default) | 'lg' (40px)
 */
export default function AppLogo({ size = 'md', className = '' }) {
  const { appPublicSettings } = useAuth();
  const logoUrl = appPublicSettings?.public_settings?.logo_url;

  const sizeMap = {
    sm: 'h-7 w-7',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  };
  const iconSizeMap = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const containerClass = `${sizeMap[size]} rounded-lg overflow-hidden shrink-0 ${className}`;

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt="App logo"
        className={`${containerClass} object-cover`}
      />
    );
  }

  return (
    <div className={`${containerClass} bg-primary flex items-center justify-center`}>
      <Zap className={`${iconSizeMap[size]} text-white`} />
    </div>
  );
}