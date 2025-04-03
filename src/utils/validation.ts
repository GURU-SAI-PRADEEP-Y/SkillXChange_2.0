import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const emailSchema = z
  .string()
  .email('Please enter a valid email address');

export type ValidationError = {
  path: string[];
  message: string;
};

export const validatePassword = (password: string): ValidationError | null => {
  const result = passwordSchema.safeParse(password);
  if (!result.success) {
    return result.error.errors[0];
  }
  return null;
};

export const validateEmail = (email: string): ValidationError | null => {
  const result = emailSchema.safeParse(email);
  if (!result.success) {
    return result.error.errors[0];
  }
  return null;
};