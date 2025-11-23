// app/(main)/schemas/client.schema.ts
import { z } from "zod";

export const clientFormSchema = z.object({
  name: z.string().min(1, "Client name is required"),
  email: z.string().email("Invalid email address"),
  company: z.string().min(1, "Company name is required"),
  status: z.enum(["active", "inactive", "pending"]),
  serviceType: z.enum([
    "wordpress",
    "shopify",
    "mern",
    "java",
    "python",
    "react",
    "nextjs",
    "nodejs",
  ]),
  logo: z.string().url("Invalid URL").optional().or(z.literal("")),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format"),
});

export type ClientFormSchema = z.infer<typeof clientFormSchema>;
