import { Input } from './ui/input';

interface MechanicalCounterProps {
  value: number | undefined | null;
  label: string;
  isEditing: boolean;
  onChange: (value: number) => void;
  digits?: number; // Number of digits to display (default: 4)
}

export function MechanicalCounter({ value, label, isEditing, onChange, digits = 4 }: MechanicalCounterProps) {
  // Ensure value is always a number, defaulting to 0 if undefined or null
  const safeValue = value ?? 0;

  const formatNumber = (num: number): string => {
    const str = num.toString().padStart(digits, '0');
    return str;
  };

  const renderNumber = (num: number) => {
    const formatted = formatNumber(num);
    const digitArray = formatted.split('');
    const numStr = num.toString();
    const numDigits = numStr.length;
    const leadingZeroCount = digits - numDigits;
    
    return (
      <span className="inline-block">
        {digitArray.map((digit, index) => {
          // Leading zeros are those before the actual number digits
          const isLeadingZero = index < leadingZeroCount;
          return (
            <span
              key={index}
              className={isLeadingZero ? 'text-gray-200 dark:text-white/10' : 'text-gray-900 dark:text-white'}
            >
              {digit}
            </span>
          );
        })}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="text-8xl font-mono font-light leading-none">
        {isEditing ? (
          <Input
            type="number"
            value={safeValue}
            onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
            className="text-8xl font-mono font-light bg-transparent border-gray-200 dark:border-white/10 text-gray-900 dark:text-white p-0 h-auto w-40"
          />
        ) : (
          renderNumber(safeValue)
        )}
      </div>
      <div className="text-xs font-sans text-gray-600 dark:text-neutral-400 mt-2 break-words">
        {label}
      </div>
    </div>
  );
}

