import { neon } from "@neondatabase/serverless";

// This creates a SQL tagged template literal using the Neon client
// We provide a fallback dummy string to prevent Next.js build from crashing during static analysis
const connectionString = process.env.POSTGRES_URL || "postgres://dummy:dummy@dummy/dummy";
export const sql = neon(connectionString);

export interface Applicant {
  id?: number;
  name: string;
  email: string;
  phone: string;
  year: string;
  college: string | null;
  interest: string;
  experience: string;
  linkedin: string | null;
  skills: string;
  questions: string | null;
  created_at?: string;
}
