/*
# Create companies table for investment analysis platform

1. New Tables
- `companies`
  - `id` (uuid, primary key)
  - `name` (text, not null) — name of the company/stock being analyzed
  - `sector` (text, nullable) — optional sector classification
  - `notes` (text, nullable) — optional free-form notes about the investment
  - `ratings` (jsonb, not null, default '{}') — stores star ratings for each of the 10 evaluation criteria, e.g. {"profit_growth": 5, "roe": 4, ...}
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `companies`.
- Single-tenant app with no sign-in screen: allow anon + authenticated full CRUD
  because the data is intentionally shared/public.

3. Notes
- The 10 evaluation criteria and their maximum star values are defined in the
  frontend. The `ratings` JSONB stores the currently-selected star count (0 to max)
  for each criterion key. The investment score percentage is computed in the
  frontend as (sum of selected stars / sum of maximum possible stars) * 100.
*/

CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sector text,
  notes text,
  ratings jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_companies" ON companies;
CREATE POLICY "anon_select_companies" ON companies FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_companies" ON companies;
CREATE POLICY "anon_insert_companies" ON companies FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_companies" ON companies;
CREATE POLICY "anon_update_companies" ON companies FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_companies" ON companies;
CREATE POLICY "anon_delete_companies" ON companies FOR DELETE
  TO anon, authenticated USING (true);
