-- Run this in Supabase SQL Editor to create the tables

CREATE TABLE IF NOT EXISTS rsvp (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_key text NOT NULL,
  display_name text NOT NULL,
  attendance text NOT NULL CHECK (attendance IN ('yes', 'no', 'maybe')),
  note text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS guestbook (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_key text NOT NULL,
  display_name text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Realtime for guestbook
ALTER PUBLICATION supabase_realtime ADD TABLE guestbook;

-- RLS policies (allow anonymous insert + select)
ALTER TABLE rsvp ENABLE ROW LEVEL SECURITY;
ALTER TABLE guestbook ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert" ON rsvp FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous select" ON rsvp FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert" ON guestbook FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous select" ON guestbook FOR SELECT USING (true);
