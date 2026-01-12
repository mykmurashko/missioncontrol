import type { MaestroProject } from '../types';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Plus, X } from 'lucide-react';

// Calculate completion percentage based on start date and number of weeks
function calculateCompletionPercentage(startDate: string, numberOfWeeks: number): number {
  if (!startDate || numberOfWeeks <= 0) return 0;
  
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0); // Normalize to start of day
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Normalize to start of day
  const end = new Date(start);
  end.setDate(end.getDate() + (numberOfWeeks * 7));
  
  // If project hasn't started yet
  if (now < start) return 0;
  
  // If project is complete
  if (now >= end) return 100;
  
  // Calculate percentage
  const totalMs = end.getTime() - start.getTime();
  const elapsedMs = now.getTime() - start.getTime();
  const percentage = Math.round((elapsedMs / totalMs) * 100);
  
  return Math.min(100, Math.max(0, percentage));
}

// Calculate current week number (0-indexed, where 0 is the first week)
function calculateCurrentWeek(startDate: string, numberOfWeeks: number): number {
  if (!startDate || numberOfWeeks <= 0) return 0;
  
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  // If project hasn't started yet
  if (now < start) return -1;
  
  // Calculate days elapsed
  const daysElapsed = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const currentWeek = Math.floor(daysElapsed / 7);
  
  // If project is complete
  if (currentWeek >= numberOfWeeks) return numberOfWeeks;
  
  return currentWeek;
}

// Calculate progress within current week (0-1)
function calculateWeekProgress(startDate: string, currentWeek: number): number {
  if (currentWeek < 0) return 0;
  
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  // Calculate the start of the current week
  const weekStart = new Date(start);
  weekStart.setDate(weekStart.getDate() + (currentWeek * 7));
  
  // Calculate the end of the current week
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  
  // If we're past the week end, return 1
  if (now >= weekEnd) return 1;
  
  // Calculate progress within the week
  const weekTotalMs = weekEnd.getTime() - weekStart.getTime();
  const weekElapsedMs = now.getTime() - weekStart.getTime();
  
  return Math.min(1, Math.max(0, weekElapsedMs / weekTotalMs));
}

interface MaestroProjectsProps {
  projects: MaestroProject[];
  isEditing: boolean;
  onUpdate: (projects: MaestroProject[]) => void;
  onDeleteUpdate?: (projects: MaestroProject[]) => void;
}

export function MaestroProjects({ projects, isEditing, onUpdate, onDeleteUpdate }: MaestroProjectsProps) {
  const updateProjects = (updater: (prev: MaestroProject[]) => MaestroProject[]) => {
    onUpdate(updater([...projects]));
  };

  const addProject = () => {
    const today = new Date().toISOString().split('T')[0];
    const newProject: MaestroProject = {
      id: Date.now().toString(),
      name: 'New Project',
      phase: 'Planning',
      startDate: today,
      numberOfWeeks: 4,
      completionPercentage: 0,
    };
    updateProjects((prev) => [...prev, newProject]);
  };

  const removeProject = (id: string) => {
    const updatedProjects = projects.filter((p) => p.id !== id);
    if (onDeleteUpdate) {
      onDeleteUpdate(updatedProjects);
    } else {
      updateProjects(() => updatedProjects);
    }
  };

  const updateProject = (id: string, updates: Partial<MaestroProject>) => {
    updateProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  // Progress bar component with week divisions
  const ProgressBar = ({ 
    startDate, 
    numberOfWeeks 
  }: { 
    startDate: string; 
    numberOfWeeks: number;
  }) => {
    const currentWeek = calculateCurrentWeek(startDate, numberOfWeeks);
    const weekProgress = calculateWeekProgress(startDate, currentWeek);
    const weekWidth = 100 / numberOfWeeks;
    
    // Calculate total progress width
    let progressWidth = 0;
    if (currentWeek >= numberOfWeeks) {
      // Project is complete
      progressWidth = 100;
    } else if (currentWeek >= 0) {
      // Project is in progress
      // Completed weeks + current week progress
      progressWidth = (currentWeek * weekWidth) + (weekWidth * weekProgress);
    }
    
    return (
      <div className="w-full h-4 bg-gray-200 relative overflow-hidden rounded-none">
        {/* Week dividers */}
        {Array.from({ length: numberOfWeeks - 1 }).map((_, index) => (
          <div
            key={index}
            className="absolute top-0 bottom-0 w-0.5 bg-gray-300 z-10"
            style={{ left: `${(index + 1) * weekWidth}%` }}
          />
        ))}
        
        {/* Progress fill */}
        {progressWidth > 0 && (
          <div
            className="absolute top-0 bottom-0 bg-orange-600 dark:shadow-[0_0_10px_rgba(249,115,22,0.5)] transition-all duration-300 z-0 rounded-none"
            style={{ width: `${progressWidth}%` }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <h3 className="text-[10px] font-sans uppercase tracking-widest text-orange-600 dark:text-orange-500 font-bold mb-6">
        ACTIVE PROJECTS
      </h3>
      <div className="space-y-6 flex-1 overflow-y-auto">
        {projects.map((project) => {
          // Handle backward compatibility - if no startDate or numberOfWeeks, use defaults
          const startDate = project.startDate || new Date().toISOString().split('T')[0];
          const numberOfWeeks = project.numberOfWeeks || 4;
          
          // Calculate completion percentage from start date and weeks
          const calculatedPercentage = calculateCompletionPercentage(startDate, numberOfWeeks);
          
          return (
            <div key={project.id} className="space-y-3">
              <div className="flex items-center justify-between">
                {isEditing ? (
                  <div className="flex-1 space-y-3">
                    <Input
                      value={project.name}
                      onChange={(e) => updateProject(project.id, { name: e.target.value })}
                      className="text-sm font-bold"
                      placeholder="Project Name"
                    />
                    <Input
                      value={project.phase}
                      onChange={(e) => updateProject(project.id, { phase: e.target.value })}
                      className="text-xs"
                      placeholder="Project Phase"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-gray-600 dark:text-neutral-400 font-sans mb-1 block">Start Date</label>
                        <Input
                          type="date"
                          value={project.startDate || new Date().toISOString().split('T')[0]}
                          onChange={(e) => updateProject(project.id, { startDate: e.target.value })}
                          className="text-xs font-sans"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-600 dark:text-neutral-400 font-sans mb-1 block">Weeks</label>
                        <Input
                          type="number"
                          min="1"
                          value={project.numberOfWeeks || 1}
                          onChange={(e) =>
                            updateProject(project.id, {
                              numberOfWeeks: parseInt(e.target.value, 10) || 1,
                            })
                          }
                          className="text-xs font-sans"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1">
                    <div className="text-sm font-bold text-gray-900 dark:text-white font-sans tracking-tight">{project.name}</div>
                    <div className="text-xs text-gray-600 dark:text-neutral-400 font-sans">{project.phase}</div>
                  </div>
                )}
                {isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeProject(project.id)}
                    className="ml-2 h-6 w-6 p-0 text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-transparent"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                {!isEditing && (
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-600 dark:text-neutral-400 font-sans">
                      {calculatedPercentage}% completion
                    </div>
                    <div className="text-xs text-gray-600 dark:text-neutral-400 font-sans">
                      {numberOfWeeks} {numberOfWeeks === 1 ? 'week' : 'weeks'} total
                    </div>
                  </div>
                )}
                <ProgressBar startDate={startDate} numberOfWeeks={numberOfWeeks} />
              </div>
            </div>
          );
        })}
      </div>
      {isEditing && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={addProject} 
          className="w-full text-xs"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      )}
    </div>
  );
}

