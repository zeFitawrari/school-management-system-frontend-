export { StudentListPage } from './pages/StudentListPage';
export { StudentRegistrationPage } from './pages/StudentRegistrationPage';
export { StudentDetailPage } from './pages/StudentDetailPage';
export {
  useStudents,
  useStudent,
  useStudentDuplicateCheck,
  useCreateStudent,
  useUpdateStudent,
  useTransferStudent,
  useGraduateStudent,
  useSuspendStudent,
} from './hooks/useStudents';
export type {
  Student,
  StudentStatus,
  CreateStudentInput,
  UpdateStudentInput,
  DuplicateCheckInput,
  DuplicateCheckResult,
} from './types/student';
export { createStudentsService } from './api/students.service';