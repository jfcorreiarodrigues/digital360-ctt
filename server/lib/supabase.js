import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    '[supabase] ERRO: SUPABASE_URL e/ou SUPABASE_SERVICE_ROLE_KEY não estão definidos.\n' +
    'Define estas variáveis de ambiente no Vercel (Settings → Environment Variables).'
  );
}

// Usar a service_role key no servidor para bypass seguro do RLS.
// NUNCA expor esta chave no frontend.
export const supabase = createClient(url ?? '', key ?? '');

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
