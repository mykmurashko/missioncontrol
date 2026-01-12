# Mission Control Dashboard

A production-quality single-page dashboard UI for two businesses (Maestro Technologies + OPCODE) with a clean Swiss design aesthetic.

## Features

- **Google SSO Authentication**: Secure login with domain restrictions (@maestro-tech.com, @opcode.systems)
- **Personalized Greeting**: Time-based greeting with user's name in the footer
- **Clean Swiss Design**: Strong grid layout, generous whitespace, consistent typography
- **Real-time World Clocks**: Italy, London, New York, San Francisco
- **ISO Week Display**: Prominent week number indicator
- **Dual Business Panels**: Side-by-side on large screens, stacked on mobile
- **Text Updates**: Rich text area for updates (plain text with line breaks)
- **To-do Lists**: Multiple named lists per organization with inline editing
- **Photo Carousel**: Auto-rotating image carousel with captions
- **Edit Mode**: Toggle editing with "E" key or Edit button
- **Kiosk Mode**: Hide all edit controls via `?kiosk=1` URL parameter
- **Burn-in Protection**: Subtle drift animation every 90 seconds
- **Local Persistence**: All data saved to localStorage with debounced saves

## Tech Stack

- React 19 + Vite + TypeScript
- Tailwind CSS
- shadcn/ui-style components
- framer-motion for animations
- luxon for time zones and ISO week numbers
- embla-carousel-react for photo carousel
- zod + react-hook-form for form validation (ready for future use)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Google OAuth 2.0 Client ID (see setup below)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up Google OAuth:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Google+ API
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
   - Choose "Web application"
   - Add your domain to "Authorized JavaScript origins" (e.g., `http://localhost:5173` for dev)
   - Copy the Client ID

3. Create a `.env` file in the root directory:
```bash
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id-here
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser to the URL shown (typically `http://localhost:5173`)

### Authentication

The application uses Google Single Sign-On (SSO) with domain restrictions:
- Only users with `@maestro-tech.com` or `@opcode.systems` email addresses can access
- Users will see a personalized greeting in the footer (e.g., "Good Morning John")
- The greeting changes based on time of day (Morning/Afternoon/Evening)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Usage

### Normal Mode

- Click the "Edit" button in the bottom-left corner or press "E" to enter edit mode
- Press "Escape" or click "Done" to exit edit mode
- All changes are automatically saved to localStorage

### Kiosk Mode

Add `?kiosk=1` to the URL to hide all edit controls:
```
http://localhost:5173?kiosk=1
```

### Editing Features

- **Text Updates**: Click to edit, changes save on blur
- **To-do Lists**: 
  - Add/remove lists and items
  - Rename lists
  - Check/uncheck items
  - Reorder items with up/down buttons
- **Photos**: 
  - Add photos with image URLs
  - Add optional captions
  - Delete photos
  - Carousel auto-advances every 15 seconds when not editing

## Design Philosophy

- **Swiss Design**: Minimal, functional, typography-focused
- **Subtle Animations**: Slow, non-distracting motion
- **Glass Morphism**: Semi-translucent cards with backdrop blur
- **Readability**: Crisp text on translucent backgrounds
- **Responsive**: Works on large displays and mobile devices

## Project Structure

```
src/
├── components/
│   ├── ui/          # shadcn/ui-style primitives
│   ├── TopBar.tsx   # Date, week, clocks
│   ├── OrgPanel.tsx # Business panel container
│   ├── TextUpdates.tsx
│   ├── TodoLists.tsx
│   ├── PhotoCarousel.tsx
│   └── EditButton.tsx
├── hooks/
│   ├── useLocalStorageState.ts
│   ├── useWorldClocks.ts
│   └── useDrift.ts
├── lib/
│   ├── utils.ts     # Utility functions
│   └── time.ts      # Time formatting utilities
├── types.ts         # TypeScript type definitions
├── App.tsx          # Main application component
└── main.tsx         # Entry point
```

## Data Persistence

All application state is stored in localStorage under the key `mission-control-state`. The state includes:

- Version number for migration support
- Settings (optional)
- Organization data (Maestro Technologies and OPCODE)
  - Text updates
  - To-do lists with items
  - Photos with URLs and captions

Changes are debounced (500ms) to avoid excessive writes.

## Browser Support

Modern browsers with ES2020+ support:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

Private project - All rights reserved.
