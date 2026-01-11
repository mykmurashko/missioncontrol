import * as React from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full border border-gray-200 dark:border-white/10 bg-white dark:bg-transparent px-3 py-2 text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 dark:focus-visible:ring-orange-500 focus-visible:border-orange-600 dark:focus-visible:border-orange-500 disabled:cursor-not-allowed disabled:opacity-50 rounded-none',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };

