CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS conversation_sessions (
  id UUID PRIMARY KEY,
  alias TEXT NOT NULL,
  mode TEXT NOT NULL DEFAULT 'support',
  summary TEXT,
  last_mood_label TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS conversation_turns (
  id UUID PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES conversation_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  message TEXT NOT NULL,
  risk_level TEXT,
  response_mode TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mood_check_ins (
  id UUID PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES conversation_sessions(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score BETWEEN 1 AND 5),
  label TEXT NOT NULL,
  note TEXT,
  phase TEXT NOT NULL CHECK (phase IN ('pre', 'post')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS support_exercises (
  id UUID PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  summary TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_published BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS knowledge_documents (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  source TEXT NOT NULL,
  source_url TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  tags TEXT[] NOT NULL DEFAULT '{}',
  embedding VECTOR(1536),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS resource_directory_entries (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  urgency TEXT NOT NULL,
  phone TEXT,
  text_line TEXT,
  website TEXT,
  description TEXT NOT NULL,
  audience TEXT NOT NULL DEFAULT 'teen'
);

CREATE TABLE IF NOT EXISTS risk_events (
  id UUID PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES conversation_sessions(id) ON DELETE CASCADE,
  risk_level TEXT NOT NULL,
  reason TEXT NOT NULL,
  matched_signals TEXT[] NOT NULL DEFAULT '{}',
  excerpt TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversation_turns_session_id
  ON conversation_turns(session_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_mood_check_ins_session_id
  ON mood_check_ins(session_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_risk_events_created_at
  ON risk_events(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_knowledge_documents_status
  ON knowledge_documents(status);
