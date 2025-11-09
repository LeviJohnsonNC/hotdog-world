-- Add display_name column to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN display_name TEXT;

-- Create a function to generate unique display names for existing users without one
CREATE OR REPLACE FUNCTION generate_unique_display_name()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  new_name TEXT;
  counter INT := 1;
  exists_check BOOLEAN;
BEGIN
  LOOP
    new_name := 'Traveler' || LPAD(counter::TEXT, 4, '0');
    
    SELECT EXISTS(
      SELECT 1 FROM public.user_profiles 
      WHERE display_name = new_name
    ) INTO exists_check;
    
    EXIT WHEN NOT exists_check;
    counter := counter + 1;
  END LOOP;
  
  RETURN new_name;
END;
$$;

-- Update existing profiles without display names
UPDATE public.user_profiles
SET display_name = generate_unique_display_name()
WHERE display_name IS NULL;

-- Make display_name NOT NULL now that all existing records have values
ALTER TABLE public.user_profiles 
ALTER COLUMN display_name SET NOT NULL;

-- Add unique constraint to display_name
ALTER TABLE public.user_profiles
ADD CONSTRAINT user_profiles_display_name_unique UNIQUE (display_name);

-- Update the handle_new_user function to include display_name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'User' || substring(NEW.id::text from 1 for 8))
  );
  RETURN NEW;
END;
$$;