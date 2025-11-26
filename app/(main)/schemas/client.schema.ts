// app/(main)/schemas/client.schema.ts
import { z } from "zod";

export const clientFormSchema = z.object({
  name: z
    .string()
    .min(3, "Client name must be at least 3 characters")
    .max(100, "Client name must be less than 100 characters")
    .trim(),
  email: z
    .string()
    .email("Invalid email address")
    .toLowerCase()
    .trim(),
  company: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be less than 100 characters")
    .trim(),
  status: z.enum(["active", "inactive", "pending"], {
    message: "Status must be active, inactive, or pending",
  }),
  serviceType: z.enum(
    [
      "wordpress",
      "ppc",
      "seo",
      "ai-automation",
      "content",
      "social-media",
    ],
    {
      message: "Please select a valid service type",
    }
  ),
  logo: z
    .string()
    .url("Logo must be a valid URL")
    .optional()
    .or(z.literal(""))
    .transform((val) => val || ""),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Color must be a valid hex code (e.g., #3B82F6)")
    .default("#3B82F6"),
  // Optional fields for extended client data
  subscriptionTier: z
    .enum(["basic", "professional", "enterprise"])
    .optional()
    .default("basic"),
  billingCycle: z
    .enum(["monthly", "quarterly", "annual"])
    .optional()
    .default("monthly"),
  industry: z
    .string()
    .max(50, "Industry must be less than 50 characters")
    .optional(),
  phone: z
    .string()
    .regex(/^[\d\s\-\+\(\)]+$/, "Invalid phone number format")
    .optional()
    .or(z.literal("")),
  website: z
    .string()
    .url("Website must be a valid URL")
    .optional()
    .or(z.literal("")),
  notes: z
    .string()
    .max(1000, "Notes must be less than 1000 characters")
    .optional(),
});

export type ClientFormSchema = z.infer<typeof clientFormSchema>;
