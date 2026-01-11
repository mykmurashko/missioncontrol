import { useState, useEffect } from 'react';
import { useLocalStorageState } from './hooks/useLocalStorageState';
import { useTheme } from './hooks/useTheme';
import { useAuth } from './hooks/useAuth';
import { TopBar } from './components/TopBar';
import { OrgPanel } from './components/OrgPanel';
import { FooterBar } from './components/FooterBar';
import { Login } from './components/Login';
// import { ActiveGridBackground } from './components/ActiveGridBackground';
import { AuroraBackground } from './components/AuroraBackground';

function MaestroLogo({ theme }: { theme: 'light' | 'dark' }) {
  // Use white logo in dark mode, regular logo in light mode
  const logoPath = theme === 'dark' 
    ? '/logos/maestrotech-logo-white.svg'
    : '/logos/maestrotech-logo.svg';
  const [usePlaceholder, setUsePlaceholder] = useState(false);

  useEffect(() => {
    // Check if logo exists by trying to load it
    const img = new Image();
    img.onload = () => setUsePlaceholder(false);
    img.onerror = () => setUsePlaceholder(true);
    img.src = logoPath;
  }, [logoPath]);

  if (usePlaceholder) {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M8 16 L16 8 L24 16" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M8 16 L16 24 L24 16" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    );
  }

  return (
    <img 
      src={logoPath} 
      alt="Maestro Technologies" 
      className="w-8 h-8"
      onError={() => setUsePlaceholder(true)}
    />
  );
}

function OpcodeLogo({ theme }: { theme: 'light' | 'dark' }) {
  // Use white logo in dark mode, regular logo in light mode
  const logoPath = theme === 'dark'
    ? '/logos/opcode-logo-white.png'
    : '/logos/opcode-logo.png';
  const [usePlaceholder, setUsePlaceholder] = useState(false);

  useEffect(() => {
    // Check if logo exists by trying to load it
    const img = new Image();
    img.onload = () => setUsePlaceholder(false);
    img.onerror = () => setUsePlaceholder(true);
    img.src = logoPath;
  }, [logoPath]);

  if (usePlaceholder) {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M12 16 L16 12 L20 16 L16 20 Z" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    );
  }

  return (
    <img 
      src={logoPath} 
      alt="OPCODE" 
      className="w-8 h-8"
      onError={() => setUsePlaceholder(true)}
    />
  );
}

function App() {
  const { isAuthenticated, login } = useAuth();
  const [state, updateState] = useLocalStorageState();
  const { theme, toggleTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isKioskMode, setIsKioskMode] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsKioskMode(params.get('kiosk') === '1');
  }, []);

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={login} />;
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-white dark:bg-[#050505]">
      {/* <ActiveGridBackground /> */}
      <AuroraBackground />
      {/* Main content */}
      <div className="relative z-10 flex h-full w-full flex-col">
        <TopBar />

        <main className="flex-1 overflow-auto p-8 pb-24">
          <div className="mx-auto max-w-[1800px] h-full">
            {/* Company Cards */}
            <div className="grid grid-cols-2 gap-8 h-full">
              <div className="border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-transparent">
                <OrgPanel
                  org={state.orgs.maestro}
                  orgName="Maestro Technologies"
                  logo={<MaestroLogo theme={theme} />}
                  isEditing={isEditing}
                  onUpdate={(org) =>
                    updateState((prev) => ({
                      ...prev,
                      orgs: { ...prev.orgs, maestro: org },
                    }))
                  }
                />
              </div>
              <div className="border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-transparent">
                <OrgPanel
                  org={state.orgs.opcode}
                  orgName="OPCODE"
                  logo={<OpcodeLogo theme={theme} />}
                  isEditing={isEditing}
                  onUpdate={(org) =>
                    updateState((prev) => ({
                      ...prev,
                      orgs: { ...prev.orgs, opcode: org },
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      <FooterBar 
        isEditing={isEditing} 
        onToggleEdit={toggleEdit} 
        isKioskMode={isKioskMode}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    </div>
  );
}

export default App;
