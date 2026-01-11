import { useEffect } from 'react';
import { Button } from './ui/button';

interface EditButtonProps {
  isEditing: boolean;
  onToggle: () => void;
  isKioskMode: boolean;
}

export function EditButton({ isEditing, onToggle, isKioskMode }: EditButtonProps) {
  useEffect(() => {
    if (isKioskMode) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'e' || e.key === 'E') {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          return;
        }
        e.preventDefault();
        onToggle();
      }
      if (e.key === 'Escape' && isEditing) {
        onToggle();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isEditing, onToggle, isKioskMode]);

  if (isKioskMode) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={onToggle}
        variant="default"
      >
        {isEditing ? 'Done' : 'Edit'}
      </Button>
    </div>
  );
}

