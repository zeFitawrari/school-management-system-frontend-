import { authHandlers } from '@/tests/mocks/handlers/auth';
import { parentHandlers } from '@/tests/mocks/handlers/parents';
import { studentHandlers } from '@/tests/mocks/handlers/students';
import { tutorHandlers } from '@/tests/mocks/handlers/tutors';
import { userHandlers } from '@/tests/mocks/handlers/users';
import { vacancyHandlers } from '@/tests/mocks/handlers/vacancies';

/**
 * Request handlers follow docs/api-contract.md. One file per domain; domains
 * are added as their feature is built.
 */
export const handlers = [...authHandlers, ...parentHandlers, ...studentHandlers, ...tutorHandlers, ...userHandlers, ...vacancyHandlers];
