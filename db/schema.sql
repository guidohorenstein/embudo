create table if not exists content (
  key         text primary key,
  value       jsonb       not null,
  updated_at  timestamptz not null default now()
);

create table if not exists media (
  id          text        primary key,
  filename    text        not null,
  mime        text        not null,
  bytes       bytea       not null,
  size        integer     not null,
  created_at  timestamptz not null default now()
);

create table if not exists leads (
  id            bigserial   primary key,
  name          text        not null,
  phone         text        not null,
  email         text,
  style         text,
  placement     text,
  idea          text,
  status        text        not null default 'new',
  notes         text        not null default '',
  utm_source    text,
  utm_medium    text,
  utm_campaign  text,
  utm_term      text,
  utm_content   text,
  referrer      text,
  visitor_id    text,
  user_agent    text,
  ip            text,
  mail_status   text        not null default 'pending',
  mail_error    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists leads_created_idx on leads (created_at desc);
create index if not exists leads_status_idx  on leads (status);

create table if not exists events (
  id            bigserial   primary key,
  name          text        not null,
  path          text,
  referrer      text,
  utm_source    text,
  utm_medium    text,
  utm_campaign  text,
  visitor_id    text,
  created_at    timestamptz not null default now()
);
create index if not exists events_created_idx on events (created_at desc);
create index if not exists events_name_idx    on events (name, created_at desc);

-- Estado del mail de confirmacion que recibe quien deja los datos.
-- 'skipped' = no correspondia enviarlo (sin email, o desactivado en el panel).
alter table leads add column if not exists client_mail_status text not null default 'skipped';
alter table leads add column if not exists client_mail_error  text;

-- Idioma en el que navegaba la persona: define en que idioma se le responde.
alter table leads add column if not exists lang text not null default 'he';
