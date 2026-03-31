'use client';

import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import TopNav from '@/components/layout/TopNav';
import Sidebar from '@/components/layout/Sidebar';
import AlertFeed from '@/components/layout/AlertFeed';
import SettingsDrawer from '@/components/layout/SettingsDrawer';
import { useProcessSimulation } from '@/hooks/useProcessSimulation';
import { useAlerts } from '@/hooks/useAlerts';
import type { Process, SystemMetrics, Settings } from '@/types';

interface AppContextType {
  processes: Process[];
  systemMetrics: SystemMetrics;
  settings: Settings;
  killProcess: (pid: number) => void;
  pauseProcess: (pid: number) => void;
  resumeProcess: (pid: number) => void;
  setPriority: (pid: number, priority: number) => void;
  isRunning: boolean;
  togglePause: () => void;
  updateSettings: (partial: Partial<Settings>) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function useAppContext(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppShell');
  return ctx;
}

/** App shell wrapper providing layout + data context to all pages */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const simulation = useProcessSimulation();
  const {
    alerts,
    acknowledgeAlert,
    dismissAlert,
    clearAll,
    unacknowledgedCount,
  } = useAlerts(simulation.systemMetrics, simulation.processes, simulation.settings);

  const [alertsOpen, setAlertsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleAlertClick = useCallback(() => setAlertsOpen(prev => !prev), []);
  const handleSettingsClick = useCallback(() => setSettingsOpen(prev => !prev), []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case 'Escape':
          setAlertsOpen(false);
          setSettingsOpen(false);
          break;
        case 'r':
          simulation.togglePause();
          break;
        case '/':
          e.preventDefault();
          const search = document.querySelector<HTMLInputElement>('[data-search-input]');
          search?.focus();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simulation.togglePause]);

  return (
    <AppContext.Provider
      value={{
        processes: simulation.processes,
        systemMetrics: simulation.systemMetrics,
        settings: simulation.settings,
        killProcess: simulation.killProcess,
        pauseProcess: simulation.pauseProcess,
        resumeProcess: simulation.resumeProcess,
        setPriority: simulation.setPriority,
        isRunning: simulation.isRunning,
        togglePause: simulation.togglePause,
        updateSettings: simulation.updateSettings,
      }}
    >
      <TopNav
        alertCount={unacknowledgedCount}
        onSettingsClick={handleSettingsClick}
        onAlertClick={handleAlertClick}
      />

      <div className="flex" style={{ paddingTop: 88 }}>
        <Sidebar />
        <main className="flex-1" style={{ marginLeft: 220 }}>
          <div className="p-8 page-enter">{children}</div>
        </main>
      </div>

      <AlertFeed
        isOpen={alertsOpen}
        onClose={() => setAlertsOpen(false)}
        alerts={alerts}
        onAcknowledge={acknowledgeAlert}
        onDismiss={dismissAlert}
        onClearAll={clearAll}
      />

      <SettingsDrawer
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={simulation.settings}
        onUpdateSettings={simulation.updateSettings}
      />
    </AppContext.Provider>
  );
}
