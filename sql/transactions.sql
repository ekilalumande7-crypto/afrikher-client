create extension if not exists pgcrypto;

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  transaction_id text not null unique,
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  item_id text,
  order_id text,
  amount numeric(10,2) not null,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  constraint transactions_type_check check (type in ('subscription', 'magazine', 'order')),
  constraint transactions_status_check check (status in ('pending', 'done'))
);

alter table public.transactions
  add column if not exists order_id text null;

create index if not exists transactions_user_id_idx
  on public.transactions (user_id);

create index if not exists transactions_type_idx
  on public.transactions (type);

create index if not exists transactions_status_idx
  on public.transactions (status);

create index if not exists transactions_created_at_idx
  on public.transactions (created_at desc);

create index if not exists transactions_order_id_idx
  on public.transactions (order_id)
  where order_id is not null;
