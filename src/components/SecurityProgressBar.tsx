import React from 'react';
import { cn } from '@/lib/utils';

interface SecurityProgressBarProps {
  score: number;
  label: string;
  className?: string;
}

const SecurityProgressBar: React.FC<SecurityProgressBarProps> = ({ 
  score, 
  label, 
  className 
}) => {
  const getProgressColor = (label: string) => {
    switch (label.toLowerCase()) {
      case 'very weak':
        return 'bg-security-weak';
      case 'weak':
        return 'bg-security-weak';
      case 'fair':
        return 'bg-security-fair';
      case 'good':
        return 'bg-security-good';
      case 'strong':
        return 'bg-security-strong';
      case 'very strong':
        return 'bg-security-very-strong';
      default:
        return 'bg-security-weak';
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between text-sm">
        <span>Strength: {label}</span>
        <span>{Math.round(score)}%</span>
      </div>
      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-500 ease-out',
            getProgressColor(label)
          )}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};

export default SecurityProgressBar;