export { CurriculumListPage } from './pages/CurriculumListPage';
export { CurriculumRegistrationPage } from './pages/CurriculumRegistrationPage';
export { CurriculumDetailPage } from './pages/CurriculumDetailPage';
export { CurriculumEditPage } from './pages/CurriculumEditPage';
export { CurriculumForm } from './components/CurriculumForm';
export {
  useCurriculum,
  useCurriculumItem,
  useCreateCurriculum,
  useUpdateCurriculum,
} from './hooks/useCurriculum';
export type {
  Curriculum,
  CurriculumStatus,
  CreateCurriculumInput,
  UpdateCurriculumInput,
} from './types/curriculum';
export { createCurriculumService } from './api/curriculum.service';
export {
  curriculumSchema,
  type CurriculumFormData,
} from './schemas/curriculum.schema';
