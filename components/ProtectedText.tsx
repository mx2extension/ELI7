
import React from 'react';

interface ProtectedTextProps {
  children: React.ReactNode;
  className?: string;
}

export default function ProtectedText({
  children,
  className = '',
}: ProtectedTextProps) {
  return (
    <span
      translate="no"
      className={`notranslate ${className}`}
    >
      {children}
    </span>
  );
}
