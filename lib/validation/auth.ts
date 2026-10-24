import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters long'),
  rememberMe: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, 'Enter your first name.')
      .max(50, 'First name is too long (maximum 50 characters).'),
    lastName: z
      .string()
      .trim()
      .min(1, 'Enter your last name.')
      .max(50, 'Last name is too long (maximum 50 characters).'),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, 'Enter a valid work email address.')
      .email('Enter a valid work email address.'),
    organization: z
      .string()
      .trim()
      .min(2, 'Enter your organization or company name.')
      .max(100, 'Organization name is too long.'),
    jobTitle: z.string().trim().max(100).optional().default(''),
    role: z.enum(['project_engineer', 'read_only_stakeholder']).optional(),
    accountType: z.enum(['engineer', 'stakeholder']).optional(),
    password: z
      .string()
      .min(1, 'Enter a password.')
      .min(6, 'Password must be at least 6 characters long.'),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
    invitationCode: z.string().trim().optional(),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: 'Please accept the required terms to continue.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'The passwords do not match.',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const onboardingStep1Schema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'Enter your first name.')
    .max(50, 'First name is too long.'),
  lastName: z
    .string()
    .trim()
    .min(1, 'Enter your last name.')
    .max(50, 'Last name is too long.'),
  displayName: z.string().trim().max(100).optional(),
  jobTitle: z.string().trim().max(100).optional(),
  phone: z.string().trim().max(30).optional(),
  timeZone: z.string().trim().optional(),
});

export type OnboardingStep1Values = z.infer<typeof onboardingStep1Schema>;

export const onboardingStep2Schema = z.object({
  organization: z.string().trim().max(100).optional(),
  department: z.string().trim().max(100).optional(),
  primaryResponsibility: z.string().trim().max(100).optional(),
  defaultProject: z.string().trim().optional(),
  reportingPreferences: z.array(z.string()).optional(),
});

export type OnboardingStep2Values = z.infer<typeof onboardingStep2Schema>;
