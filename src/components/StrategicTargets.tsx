import { useState, useEffect } from 'react';
import { Textarea } from './ui/textarea';

interface StrategicTargetsProps {
  text: string;
  isEditing: boolean;
  onChange: (text: string) => void;
}

export function StrategicTargets({ text, isEditing, onChange }: StrategicTargetsProps) {
  const [localText, setLocalText] = useState(text);

  useEffect(() => {
    setLocalText(text);
  }, [text]);

  const handleSave = () => {
    onChange(localText);
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        <Textarea
          value={localText}
          onChange={(e) => setLocalText(e.target.value)}
          onBlur={handleSave}
          className="min-h-[200px] resize-none text-xs"
          placeholder="Enter strategic targets..."
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {text.split('\n').map((line, i) => (
        <p key={i} className="text-xs font-medium leading-relaxed text-gray-600 font-sans">
          {line || '\u00A0'}
        </p>
      ))}
    </div>
  );
}

