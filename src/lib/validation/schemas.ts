import { z } from 'zod';

export const CategorySchema = z.enum([
  'pothole',
  'garbage',
  'footpath',
  'drainage',
  'infrastructure',
]);

export const WorkStatusSchema = z.enum([
  'SUBMITTED',
  'UNDER_REVIEW',
  'ASSIGNED',
  'IN_PROGRESS',
  'REPAIR_CLAIMED',
  'VERIFICATION_PENDING',
  'VERIFIED_RESOLVED',
  'PARTIALLY_RESOLVED',
  'NOT_RESOLVED',
  'DISPUTED',
  'CLOSED',
]);

export const VerificationResultSchema = z.enum([
  'VERIFIED_RESOLVED',
  'PARTIALLY_RESOLVED',
  'NOT_RESOLVED',
  'SAME_SCENE_UNCERTAIN',
  'INSUFFICIENT_EVIDENCE',
  'DUPLICATE_EVIDENCE',
  'HUMAN_REVIEW_REQUIRED',
]);

export const RoleSchema = z.enum(['citizen', 'authority', 'moderator', 'admin', 'public']);

// Register input schema
export const RegisterSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  role: RoleSchema.default('citizen'),
  organizationId: z.string().optional(),
});

// Login input schema
export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Report creation schema
export const CreateReportSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(150),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  category: CategorySchema,
  address: z.string().min(3, 'Address is required').max(255),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  locationAccuracyMeters: z.number().optional().default(5.0),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  citizenId: z.string().optional(),
  citizenName: z.string().optional(),
  imageUrl: z.string().optional(),
  sha256Hash: z.string().optional(),
  perceptualHash: z.string().optional(),
});

// Repair claim submission schema
export const CreateRepairClaimSchema = z.object({
  reportId: z.string().min(1, 'Report ID is required'),
  description: z.string().min(5, 'Repair description is required').max(1000),
  materialsUsed: z.string().min(2, 'Materials used description is required').max(255),
  contractorName: z.string().optional().default('Municipal Maintenance Division'),
  afterImageUrl: z.string().min(1, 'After repair photograph is required'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  accuracyMeters: z.number().optional(),
  capturedAt: z.string().optional(),
});

// Citizen challenge submission schema
export const CreateChallengeSchema = z.object({
  reportId: z.string().min(1, 'Report ID is required'),
  reason: z.string().min(5, 'Reason must be at least 5 characters').max(255),
  description: z.string().min(10, 'Description must provide clear details').max(2000),
  reinspectionImageUrl: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

// Human review & dispute resolution schema
export const ResolveReviewSchema = z.object({
  decision: z.enum([
    'VERIFIED_RESOLVED',
    'NOT_RESOLVED',
    'PARTIALLY_RESOLVED',
    'HUMAN_VERIFIED_RESOLVED',
    'HUMAN_VERIFIED_UNRESOLVED',
    'REQUIRES_MORE_EVIDENCE',
  ]),
  notes: z.string().min(5, 'Documented reasoning is mandatory').max(1000),
  overrideAi: z.boolean().default(false),
});

