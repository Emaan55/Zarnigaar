-- Optional article content, editable only through existing product admin policies.
alter table public.products
  add column if not exists fabric_details text,
  add column if not exists additional_details text,
  add column if not exists care_instructions text,
  add column if not exists design_philosophy text;
