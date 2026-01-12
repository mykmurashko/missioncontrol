import { useState, useEffect } from 'react';
import { Textarea } from './ui/textarea';

interface TextUpdatesProps {
  text: string;
  isEditing: boolean;
  onChange: (text: string) => void;
}

export function TextUpdates({ text, isEditing, onChange }: TextUpdatesProps) {
  const [localText, setLocalText] = useState(text);

  // Only sync from props when NOT editing to prevent overwriting user input
  useEffect(() => {
    if (!isEditing) {
      setLocalText(text);
    }
  }, [text, isEditing]);

  // Initialize local state when entering edit mode
  useEffect(() => {
    if (isEditing) {
      setLocalText(text);
    }
  }, [isEditing]);

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
          className="min-h-[120px] resize-none"
          placeholder="Enter text updates..."
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {text.split('\n').map((line, i) => (
        <p key={i} className="text-sm font-medium leading-relaxed text-gray-600 font-sans">
          {line || '\u00A0'}
        </p>
      ))}
    </div>
  );
}

