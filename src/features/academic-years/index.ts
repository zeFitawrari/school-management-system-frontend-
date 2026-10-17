export { AcademicYearListPage } from './pages/AcademicYearListPage';
export { AcademicYearRegistrationPage } from './pages/AcademicYearRegistrationPage';
export { AcademicYearDetailPage } from './pages/AcademicYearDetailPage';
export { AcademicYearEditPage } from './pages/AcademicYearEditPage';
export { AcademicYearForm } from './components/AcademicYearForm';
export {
  useAcademicYears,
  useAcademicYear,
  useCreateAcademicYear,
  useUpdateAcademicYear,
  useSetCurrentAcademicYear,
} from './hooks/useAcademicYears';
export type {
  AcademicYear,
  AcademicYearStatus,
  CreateAcademicYearInput,
  UpdateAcademicYearInput,
} from './types/academic-year';
export { createAcademicYearsService } from './api/academic-year.service';
