// src/constants/constants.ts
import { createClient } from "@supabase/supabase-js";

export const allowedOrigins = [
  "https://mycompany.co",
  "https://dev.mycompany.co",
  "http://localhost:3000",
  "http://localhost:3001",
];

export const umamiUrl = process.env.UMAMI_URL;
export const umamiWebsiteId = process.env.UMAMI_WEBSITE_ID;

export const supabaseUrl = process.env.SUPABASE_URL || "";
export const supabaseKey = process.env.SUPABASE_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Supabase URL and Key must be defined in environment variables"
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
