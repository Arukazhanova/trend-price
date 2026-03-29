import { z } from 'zod';

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email('Enter a valid email address'),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters long')
        .max(64, 'Password is too long'),
});

export const registerSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(2, 'Name must be at least 2 characters long')
            .max(50, 'Name is too long'),
        email: z
            .string()
            .trim()
            .toLowerCase()
            .email('Enter a valid email address'),
        password: z
            .string()
            .min(6, 'Password must be at least 6 characters long')
            .max(64, 'Password is too long'),
        confirmPassword: z
            .string()
            .min(6, 'Please confirm your password'),
        acceptTerms: z.boolean().refine((value) => value === true, {
            message: 'You must confirm that you have read and accepted the documents',
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;