-- Change sprite_sheet_version column to bigint to support large timestamp values
ALTER TABLE hotdogs 
ALTER COLUMN sprite_sheet_version TYPE bigint;