import { MechanicalCounter } from './MechanicalCounter';

interface OpCodeMetricsProps {
  metrics: {
    tasksCompletedThisWeek: number;
    uniqueActiveUsersThisHour: number;
    componentsParsedSince2026: number;
  };
  isEditing: boolean;
  onChange: (metrics: { tasksCompletedThisWeek: number; uniqueActiveUsersThisHour: number; componentsParsedSince2026: number }) => void;
}

export function OpCodeMetrics({ metrics, isEditing, onChange }: OpCodeMetricsProps) {
  const updateMetric = (field: 'tasksCompletedThisWeek' | 'uniqueActiveUsersThisHour' | 'componentsParsedSince2026', value: number) => {
    onChange({ ...metrics, [field]: value });
  };

  return (
    <div className="grid grid-rows-3 divide-y divide-gray-200 dark:divide-white/10 h-full relative">
      <div className="p-6">
        <MechanicalCounter
          value={metrics.tasksCompletedThisWeek}
          label="Tasks Completed This Week"
          isEditing={isEditing}
          onChange={(value) => updateMetric('tasksCompletedThisWeek', value)}
        />
      </div>
      <div className="p-6">
        <MechanicalCounter
          value={metrics.uniqueActiveUsersThisHour}
          label="Unique Active Users (This Hour)"
          isEditing={isEditing}
          onChange={(value) => updateMetric('uniqueActiveUsersThisHour', value)}
        />
      </div>
      <div className="p-6">
        <MechanicalCounter
          value={metrics.componentsParsedSince2026}
          label="Components Parsed Since 01.01.2026"
          isEditing={isEditing}
          onChange={(value) => updateMetric('componentsParsedSince2026', value)}
          digits={5}
        />
      </div>
      {/* COMING SOON Banner */}
      <div className="absolute bottom-4 right-4 bg-yellow-500 dark:bg-yellow-500 text-gray-900 dark:text-gray-900 px-3 py-1.5 text-[9px] font-sans tracking-widest font-bold">
        Live Dashboard coming soon
      </div>
    </div>
  );
}

