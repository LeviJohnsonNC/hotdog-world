-- Remove sprite sheet columns from hotdogs table
ALTER TABLE public.hotdogs 
DROP COLUMN IF EXISTS sprite_x,
DROP COLUMN IF EXISTS sprite_y,
DROP COLUMN IF EXISTS sprite_width,
DROP COLUMN IF EXISTS sprite_height,
DROP COLUMN IF EXISTS sprite_sheet_version,
DROP COLUMN IF EXISTS needs_sprite_update;

-- Drop the sprite_sheets table entirely
DROP TABLE IF EXISTS public.sprite_sheets;