import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

export type UIDensity = 'comfortable' | 'compact';

export type PipelineView = 'board' | 'table';

export type UIState = {
  sidebarCollapsed: boolean;
  mobileNavOpen: boolean;
  density: UIDensity;
  pipelineView: PipelineView;
  toggleSidebar: () => void;
  setMobileNav: (open: boolean) => void;
  setDensity: (density: UIDensity) => void;
  setPipelineView: (view: PipelineView) => void;
  reset: () => void;
};

const initialState: Pick<UIState, 'sidebarCollapsed' | 'mobileNavOpen' | 'density' | 'pipelineView'> = {
  sidebarCollapsed: false,
  mobileNavOpen: false,
  density: 'comfortable',
  pipelineView: 'board',
};

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        toggleSidebar: () =>
          set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }), false, 'ui/toggleSidebar'),
        setMobileNav: (open) => set({ mobileNavOpen: open }, false, 'ui/setMobileNav'),
        setDensity: (density) => set({ density }, false, 'ui/setDensity'),
        setPipelineView: (view) => set({ pipelineView: view }, false, 'ui/setPipelineView'),
        reset: () => set(initialState, false, 'ui/reset'),
      }),
      {
        name: 'sms-ui',
        version: 1,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          sidebarCollapsed: state.sidebarCollapsed,
          density: state.density,
          pipelineView: state.pipelineView,
        }),
      },
    ),
    { name: 'ui', enabled: import.meta.env.DEV },
  ),
);
