import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

export type UIDensity = 'comfortable' | 'compact';

export type PipelineView = 'board' | 'table';

export type UIState = {
  sidebarCollapsed: boolean;
  mobileNavOpen: boolean;
  density: UIDensity;
  pipelineView: PipelineView;
  activeAcademicYearId: string | null;
  toggleSidebar: () => void;
  setMobileNav: (open: boolean) => void;
  setDensity: (density: UIDensity) => void;
  setPipelineView: (view: PipelineView) => void;
  setActiveAcademicYear: (id: string | null) => void;
  reset: () => void;
};

const initialState: Pick<UIState, 'sidebarCollapsed' | 'mobileNavOpen' | 'density' | 'pipelineView' | 'activeAcademicYearId'> = {
  sidebarCollapsed: false,
  mobileNavOpen: false,
  density: 'comfortable',
  pipelineView: 'board',
  activeAcademicYearId: null,
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
        setActiveAcademicYear: (id) =>
          set({ activeAcademicYearId: id }, false, 'ui/setActiveAcademicYear'),
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
          activeAcademicYearId: state.activeAcademicYearId,
        }),
      },
    ),
    { name: 'ui', enabled: import.meta.env.DEV },
  ),
);
