-- Fix the function search path security issue
CREATE OR REPLACE FUNCTION generate_unique_display_name()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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