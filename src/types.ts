export interface TodoItem {
  id: string;
  text: string;
  done: boolean;
}

export interface TodoList {
  id: string;
  name: string;
  items: TodoItem[];
}

export interface Photo {
  id: string;
  image_url: string;
  caption: string;
  sort: number;
}

export interface OpCodeMetrics {
  tasksCompletedThisWeek: number;
  uniqueActiveUsersThisHour: number;
  componentsParsedSince2026: number;
}

export interface MaestroProject {
  id: string;
  name: string;
  phase: string;
  startDate: string; // ISO date string
  numberOfWeeks: number;
  completionPercentage: number; // Calculated, but kept for backward compatibility
}

export interface Post {
  id: string;
  content: string;
  author: string;
  timestamp: string; // ISO date string
}

export interface SprintFeature {
  id: string;
  name: string;
  owner: string;
  description: string;
}

export interface SprintScope {
  startDate: string; // ISO date string (YYYY-MM-DD)
  endDate: string; // ISO date string (YYYY-MM-DD)
  features: SprintFeature[];
}

export interface Org {
  strategicTargets: string;
  todoLists: TodoList[];
  photos: Photo[];
  // OpCode specific
  opCodeMetrics?: OpCodeMetrics;
  sprintScope?: SprintScope;
  // Maestro specific
  maestroProjects?: MaestroProject[];
  // Posts (shared)
  posts?: Post[];
}

export interface AppState {
  version: string;
  settings?: {
    [key: string]: unknown;
  };
  orgs: {
    maestro: Org;
    opcode: Org;
  };
}

export const DEFAULT_STATE: AppState = {
  version: '1.1.0',
  orgs: {
    maestro: {
      strategicTargets: 'Q1 Product Launch\n\nTeam Alignment\n\nCustomer Acquisition',
      todoLists: [],
      photos: [
        {
          id: '1',
          image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200',
          caption: 'Office workspace',
          sort: 0,
        },
      ],
      maestroProjects: [
        {
          id: '1',
          name: 'Academic Building',
          phase: 'Schematic Design',
          startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 weeks ago
          numberOfWeeks: 8,
          completionPercentage: 25,
        },
        {
          id: '2',
          name: 'Greenehaven',
          phase: 'Pre-Engineering Study',
          startDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 4 weeks ago
          numberOfWeeks: 6,
          completionPercentage: 67,
        },
        {
          id: '3',
          name: 'Riverside Plaza',
          phase: 'Design Development',
          startDate: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 6 weeks ago
          numberOfWeeks: 8,
          completionPercentage: 75,
        },
        {
          id: '4',
          name: 'Metro Station',
          phase: 'Construction Documents',
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week ago
          numberOfWeeks: 12,
          completionPercentage: 8,
        },
      ],
      posts: [
        {
          id: '1',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
          author: 'John Doe',
          timestamp: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
        },
        {
          id: '2',
          content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          author: 'Jane Smith',
          timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
        },
        {
          id: '3',
          content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
          author: 'Mike Johnson',
          timestamp: new Date(Date.now() - 5 * 3600000).toISOString(), // 5 hours ago
        },
        {
          id: '4',
          content: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          author: 'Sarah Williams',
          timestamp: new Date(Date.now() - 24 * 3600000).toISOString(), // 1 day ago
        },
        {
          id: '5',
          content: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
          author: 'Robert Chen',
          timestamp: new Date(Date.now() - 36 * 3600000).toISOString(), // 1.5 days ago
        },
      ],
    },
    opcode: {
      strategicTargets: 'Platform Stability\n\nFeature Development\n\nTeam Growth',
      todoLists: [],
      photos: [
        {
          id: '1',
          image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200',
          caption: 'Development progress',
          sort: 0,
        },
      ],
      opCodeMetrics: {
        tasksCompletedThisWeek: 127,
        uniqueActiveUsersThisHour: 43,
        componentsParsedSince2026: 55020,
      },
      sprintScope: {
        startDate: new Date().toISOString().split('T')[0], // Today
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 weeks from now
        features: [
          {
            id: '1',
            name: 'User Authentication System',
            owner: 'John Doe',
            description: 'Implement secure user authentication with OAuth2 and JWT tokens. Includes login, logout, and password reset functionality.',
          },
          {
            id: '2',
            name: 'Dashboard Analytics',
            owner: 'Jane Smith',
            description: 'Build comprehensive analytics dashboard with real-time metrics, charts, and data visualization components.',
          },
          {
            id: '3',
            name: 'API Rate Limiting',
            owner: 'Mike Johnson',
            description: 'Add rate limiting middleware to prevent API abuse and ensure fair usage across all endpoints.',
          },
        ],
      },
      posts: [
        {
          id: '1',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore.',
          author: 'Jane Smith',
          timestamp: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
        },
        {
          id: '2',
          content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          author: 'Alex Chen',
          timestamp: new Date(Date.now() - 1 * 3600000).toISOString(), // 1 hour ago
        },
        {
          id: '3',
          content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
          author: 'David Kim',
          timestamp: new Date(Date.now() - 3 * 3600000).toISOString(), // 3 hours ago
        },
        {
          id: '4',
          content: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          author: 'Lisa Park',
          timestamp: new Date(Date.now() - 6 * 3600000).toISOString(), // 6 hours ago
        },
        {
          id: '5',
          content: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
          author: 'Tom Wilson',
          timestamp: new Date(Date.now() - 12 * 3600000).toISOString(), // 12 hours ago
        },
      ],
    },
  },
};

