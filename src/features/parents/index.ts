export { ParentDetailPage } from './pages/ParentDetailPage';
export { ParentEditPage } from './pages/ParentEditPage';
export { ParentListPage } from './pages/ParentListPage';
export { ParentRegistrationPage } from './pages/ParentRegistrationPage';
export { ParentForm } from './components/ParentForm';
export { useParents, useParent, useCreateParent, useUpdateParent, useLinkChild } from './hooks/useParents';
export type { CreateParentInput, LinkChildInput, LinkChildResult, Parent, ParentStatus, UpdateParentInput } from './types/parent';
export { createParentsService } from './api/parents.service';
