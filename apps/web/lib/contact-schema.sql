-- Create contacts table
create table contacts (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  organization text,
  message text not null,
  created_at timestamp with time zone default timezone('utc', now())
);
