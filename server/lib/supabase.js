import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Map Supabase snake_case fields to camelCase expected by the frontend
export function toSession(row) {
  if (!row) return null;
  const { created_at, updated_at, session_date, selected_products, ...rest } = row;
  return {
    ...rest,
    createdAt: created_at,
    updatedAt: updated_at,
    sessionDate: session_date,
    selectedProducts: selected_products || [],
  };
}
