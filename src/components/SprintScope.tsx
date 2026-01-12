import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Plus, X } from 'lucide-react';
import type { SprintScope } from '../types';

interface SprintScopeProps {
  sprintScope: SprintScope;
  isEditing: boolean;
  onUpdate: (sprintScope: SprintScope) => void;
  onDeleteUpdate?: (sprintScope: SprintScope) => void;
}

export function SprintScopeComponent({ sprintScope, isEditing, onUpdate, onDeleteUpdate }: SprintScopeProps) {
  const updateSprintScope = (updates: Partial<SprintScope>) => {
    onUpdate({ ...sprintScope, ...updates });
  };

  const addFeature = () => {
    const newFeature = {
      id: Date.now().toString(),
      name: 'New Feature',
      owner: '',
      description: '',
    };
    updateSprintScope({
      features: [...(sprintScope.features || []), newFeature],
    });
  };

  const removeFeature = (id: string) => {
    const updatedFeatures = (sprintScope.features || []).filter((f) => f.id !== id);
    const updatedSprintScope = { ...sprintScope, features: updatedFeatures };
    if (onDeleteUpdate) {
      onDeleteUpdate(updatedSprintScope);
    } else {
      updateSprintScope({ features: updatedFeatures });
    }
  };

  const updateFeature = (id: string, updates: Partial<{ name: string; owner: string; description: string }>) => {
    updateSprintScope({
      features: (sprintScope.features || []).map((f) =>
        f.id === id ? { ...f, ...updates } : f
      ),
    });
  };

  return (
    <div className="flex h-full flex-col p-6">
      <h3 className="mb-4 text-[10px] font-sans uppercase tracking-widest text-orange-600 dark:text-orange-500 font-bold">
        Current Sprint Scope
      </h3>
      
      {/* Sprint Dates */}
      <div className="mb-6 space-y-3">
        <div className="space-y-2">
          <label className="text-[10px] font-sans uppercase tracking-wider text-gray-600 dark:text-neutral-400">
            Sprint Start Date
          </label>
          {isEditing ? (
            <Input
              type="date"
              value={sprintScope.startDate || ''}
              onChange={(e) => updateSprintScope({ startDate: e.target.value })}
              className="text-[10px] font-sans h-7"
            />
          ) : (
            <div className="text-[11px] font-sans text-gray-900 dark:text-white">
              {sprintScope.startDate
                ? new Date(sprintScope.startDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Not set'}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-sans uppercase tracking-wider text-gray-600 dark:text-neutral-400">
            Sprint End Date
          </label>
          {isEditing ? (
            <Input
              type="date"
              value={sprintScope.endDate || ''}
              onChange={(e) => updateSprintScope({ endDate: e.target.value })}
              className="text-[10px] font-sans h-7"
            />
          ) : (
            <div className="text-[11px] font-sans text-gray-900 dark:text-white">
              {sprintScope.endDate
                ? new Date(sprintScope.endDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Not set'}
            </div>
          )}
        </div>
      </div>

      {/* Features List */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2">
          {(sprintScope.features || []).map((feature) => (
            <div
              key={feature.id}
              className="border border-gray-200 dark:border-white/10 p-3 bg-white dark:bg-transparent rounded-none"
            >
              {isEditing ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Input
                      value={feature.name}
                      onChange={(e) => updateFeature(feature.id, { name: e.target.value })}
                      className="text-[10px] font-bold h-7"
                      placeholder="Feature name"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFeature(feature.id)}
                      className="ml-2 h-5 w-5 p-0 text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-transparent"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <Input
                    value={feature.owner}
                    onChange={(e) => updateFeature(feature.id, { owner: e.target.value })}
                    className="text-[10px] font-sans h-7"
                    placeholder="Owner"
                  />
                  <Textarea
                    value={feature.description || ''}
                    onChange={(e) => updateFeature(feature.id, { description: e.target.value })}
                    className="text-[10px] font-sans min-h-[60px] resize-none"
                    placeholder="Description"
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-gray-900 dark:text-white font-sans">
                    {feature.name || 'Unnamed Feature'}
                  </div>
                  <div className="text-[10px] text-gray-600 dark:text-neutral-400 font-sans">
                    Owner: {feature.owner || 'Unassigned'}
                  </div>
                  {feature.description && (
                    <div className="text-[10px] text-gray-600 dark:text-neutral-400 font-sans leading-relaxed mt-2">
                      {feature.description}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        {isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={addFeature}
            className="mt-3 w-full text-[10px] h-7"
          >
            <Plus className="mr-1 h-3 w-3" />
            Add Feature
          </Button>
        )}
      </div>
    </div>
  );
}
