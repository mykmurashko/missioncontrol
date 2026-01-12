import type { Org } from '../types';
import { Card, CardTitle } from './ui/card';
import { OpCodeMetrics } from './OpCodeMetrics';
import { MaestroProjects } from './MaestroProjects';
import { Posts } from './Posts';
import { SprintScopeComponent } from './SprintScope';

interface OrgPanelProps {
  org: Org;
  orgName: string;
  logo: React.ReactNode;
  isEditing: boolean;
  onUpdate: (org: Org) => void;
  onDeleteUpdate?: (org: Org) => void;
}

function ensureOrgData(org: Org, orgName: string): Org {
  if (orgName === 'OPCODE') {
    return {
      ...org,
      opCodeMetrics: {
        tasksCompletedThisWeek: org.opCodeMetrics?.tasksCompletedThisWeek ?? 0,
        uniqueActiveUsersThisHour: org.opCodeMetrics?.uniqueActiveUsersThisHour ?? 0,
        componentsParsedSince2026: org.opCodeMetrics?.componentsParsedSince2026 ?? 0,
      },
      sprintScope: org.sprintScope || {
        startDate: '',
        endDate: '',
        features: [],
      },
      posts: org.posts || [],
    };
  } else {
    return {
      ...org,
      maestroProjects: org.maestroProjects || [],
      posts: org.posts || [],
    };
  }
}

export function OrgPanel({ org, orgName, logo, isEditing, onUpdate, onDeleteUpdate }: OrgPanelProps) {
  const updateOrg = (updater: (prev: Org) => Org) => {
    onUpdate(updater({ ...org }));
  };
  
  const updateOrgImmediate = (updater: (prev: Org) => Org) => {
    if (onDeleteUpdate) {
      onDeleteUpdate(updater({ ...org }));
    } else {
      onUpdate(updater({ ...org }));
    }
  };

  const orgWithDefaults = ensureOrgData(org, orgName);
  const isOpCode = orgName === 'OPCODE';

  return (
    <Card className="h-full flex flex-col">
      {/* Header Row */}
      <div className="border-b border-gray-200 dark:border-white/10 px-8 py-6">
        <CardTitle className="flex items-center gap-6">
          {logo}
          <span className="font-normal dark:text-white">{orgName}</span>
        </CardTitle>
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-2 divide-x divide-gray-200 dark:divide-white/10 flex-1 min-h-0">
        {/* Left: OpCode Metrics or Maestro Projects */}
        <section className="flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            {isOpCode ? (
              <OpCodeMetrics
                metrics={orgWithDefaults.opCodeMetrics!}
                isEditing={isEditing}
                onChange={(metrics) =>
                  updateOrg((prev) => ({ ...prev, opCodeMetrics: metrics }))
                }
              />
            ) : (
              <MaestroProjects
                projects={orgWithDefaults.maestroProjects!}
                isEditing={isEditing}
                onUpdate={(projects) =>
                  updateOrg((prev) => ({ ...prev, maestroProjects: projects }))
                }
                onDeleteUpdate={(projects) =>
                  updateOrgImmediate((prev) => ({ ...prev, maestroProjects: projects }))
                }
              />
            )}
          </div>
        </section>

        {/* Right: Sprint Scope (OpCode) or Updates (Maestro) */}
        <section className="flex flex-col overflow-hidden">
          <div className="flex-1 min-h-0 flex flex-col">
            {isOpCode ? (
              <SprintScopeComponent
                sprintScope={orgWithDefaults.sprintScope!}
                isEditing={isEditing}
                onUpdate={(sprintScope) =>
                  updateOrg((prev) => ({ ...prev, sprintScope }))
                }
                onDeleteUpdate={(sprintScope) =>
                  updateOrgImmediate((prev) => ({ ...prev, sprintScope }))
                }
              />
            ) : (
              <Posts
                posts={orgWithDefaults.posts!}
                isEditing={isEditing}
                onUpdate={(posts) => updateOrg((prev) => ({ ...prev, posts }))}
                onDeleteUpdate={(posts) => updateOrgImmediate((prev) => ({ ...prev, posts }))}
                orgName={orgName}
              />
            )}
          </div>
        </section>
      </div>
    </Card>
  );
}
