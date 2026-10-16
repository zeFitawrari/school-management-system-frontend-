import { useAttendanceDraftStore } from '@/stores/attendance-draft.store';
import { useAuthStore } from '@/stores/auth.store';
import { useBranchStore } from '@/stores/branch.store';
import { useCalendarViewStore } from '@/stores/calendar-view.store';
import { useChildContextStore } from '@/stores/child-context.store';
import { useDashboardLayoutStore } from '@/stores/dashboard-layout.store';
import { useEnrollmentDraftStore } from '@/stores/enrollment-draft.store';
import { useMarksDraftStore } from '@/stores/marks-draft.store';
import { useNotificationStore } from '@/stores/notification.store';
import { usePaymentDraftStore } from '@/stores/payment-draft.store';
import { usePayrollWizardStore } from '@/stores/payroll-wizard.store';
import { useReportFilterStore } from '@/stores/report-filter.store';
import { useStudentDraftStore } from '@/stores/student-draft.store';
import { useTablePrefsStore } from '@/stores/table-prefs.store';
import { useToastStore } from '@/stores/toast.store';
import { useUIStore } from '@/stores/ui.store';
import { useUploadStore } from '@/stores/upload.store';

export function resetBranchScopedStores(): void {
  useAttendanceDraftStore.getState().reset();
  useCalendarViewStore.getState().reset();
  useChildContextStore.getState().reset();
  useDashboardLayoutStore.getState().reset();
  useEnrollmentDraftStore.getState().reset();
  useMarksDraftStore.getState().reset();
  useNotificationStore.getState().reset();
  usePaymentDraftStore.getState().reset();
  usePayrollWizardStore.getState().reset();
  useReportFilterStore.getState().reset();
  useStudentDraftStore.getState().reset();
  useTablePrefsStore.getState().reset();
  useToastStore.getState().reset();
  useUploadStore.getState().reset();
}

export function resetAllStores(): void {
  useAuthStore.getState().clear();
  useBranchStore.getState().reset();
  useUIStore.getState().reset();
  resetBranchScopedStores();
}
