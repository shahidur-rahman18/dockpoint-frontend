import { useState } from 'react';
import { UserRound } from 'lucide-react';

interface DoctorAvatarProps {
  src: string;
  alt?: string;
  imageClassName: string;
  fallbackClassName: string;
  iconClassName: string;
}

export function DoctorAvatar({
  src,
  alt = '',
  imageClassName,
  fallbackClassName,
  iconClassName,
}: DoctorAvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);

  if (src && !imageFailed) {
    return (
      <img
        src={src}
        alt={alt}
        onError={() => setImageFailed(true)}
        className={imageClassName}
      />
    );
  }

  return (
    <span className={fallbackClassName}>
      <UserRound aria-hidden="true" className={iconClassName} />
    </span>
  );
}
