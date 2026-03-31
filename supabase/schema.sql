-- ============================================================
-- Digital 360 CTT — Schema da Base de Dados
-- Executar no Supabase SQL Editor para recriar a estrutura.
-- ============================================================

-- Extensão para geração de UUIDs (activa por defeito no Supabase)
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- Tabela: sessions
-- Armazena sessões de revisão digital com dados dos produtos.
-- ------------------------------------------------------------
create table if not exists public.sessions (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  period           text,
  audience         text,
  status           text not null default 'draft'
                     check (status in ('draft', 'review', 'ready', 'presented')),
  session_date     date,
  -- Objecto JSON com dados de cada produto indexado por productId
  products         jsonb not null default '{}',
  -- Array com os IDs dos produtos seleccionados para a sessão
  selected_products jsonb not null default '[]',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Índice para ordenação no dashboard
create index if not exists sessions_created_at_idx on public.sessions (created_at desc);

-- Trigger para actualizar updated_at automaticamente
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists sessions_set_updated_at on public.sessions;
create trigger sessions_set_updated_at
  before update on public.sessions
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- Row Level Security
-- O servidor usa a service_role key (bypass ao RLS).
-- O acesso directo via anon key fica completamente bloqueado.
-- ------------------------------------------------------------
alter table public.sessions enable row level security;

-- Sem policies públicas: apenas a service_role key tem acesso.
-- Para adicionar acesso autenticado no futuro:
--
--   create policy "Utilizadores autenticados podem ler sessões"
--     on public.sessions for select
--     using (auth.role() = 'authenticated');
