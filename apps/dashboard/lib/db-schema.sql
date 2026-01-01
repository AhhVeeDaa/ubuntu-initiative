-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create nodes table
create table nodes (
  id uuid default uuid_generate_v4() primary key,
  cluster_id text not null,
  region text not null,
  status text check (status in ('online', 'offline', 'maintenance')),
  load integer check (load >= 0 and load <= 100),
  temperature integer,
  last_updated timestamp with time zone default timezone('utc', now())
);

-- Insert dummy seed data (Idempotent)
INSERT INTO nodes (cluster_id, region, status, load, temperature)
SELECT v.cluster_id, v.region, v.status, v.load, v.temperature
FROM (VALUES
  ('alpha-01','Kinshasa-A','online',85,62),
  ('alpha-02','Kinshasa-A','online',92,68),
  ('alpha-03','Kinshasa-A','maintenance',0,24),
  ('beta-01','Inga-Site','online',45,55),
  ('beta-02','Inga-Site','online',48,56),
  ('beta-03','Inga-Site','offline',0,21),
  ('gamma-01','Inga-Site','online',78,60)
) AS v(cluster_id, region, status, load, temperature)
WHERE NOT EXISTS (
  SELECT 1 FROM nodes n WHERE n.cluster_id = v.cluster_id
);
