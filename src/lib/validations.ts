import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const bookingSchema = z.object({
  serviceId: z.string().min(1, 'Service is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
  clientName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  clientEmail: z.string().email('Invalid email address'),
  clientPhone: z.string().optional(),
  notes: z.string().max(500).optional(),
});

export const availabilityRuleSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  isActive: z.boolean().optional().default(true),
});

export const availabilityExceptionSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  type: z.enum(['BLOCKED', 'CUSTOM']),
  startTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  endTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  reason: z.string().max(200).optional(),
});

export const serviceSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().min(10).max(1000),
  durationMin: z.number().min(15).max(240),
  price: z.number().min(0),
  depositPrice: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type AvailabilityRuleInput = z.infer<typeof availabilityRuleSchema>;
export type AvailabilityExceptionInput = z.infer<typeof availabilityExceptionSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
