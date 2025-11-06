-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_profiles
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Create hotdog_stamps table
CREATE TABLE IF NOT EXISTS public.hotdog_stamps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  hotdog_id TEXT NOT NULL,
  tried BOOLEAN DEFAULT false,
  rating INTEGER,
  review TEXT,
  photo_url TEXT,
  timestamp BIGINT NOT NULL,
  last_modified BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, hotdog_id)
);

-- Enable RLS on hotdog_stamps
ALTER TABLE public.hotdog_stamps ENABLE ROW LEVEL SECURITY;

-- RLS policies for hotdog_stamps
CREATE POLICY "Users can view their own stamps"
  ON public.hotdog_stamps FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stamps"
  ON public.hotdog_stamps FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stamps"
  ON public.hotdog_stamps FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stamps"
  ON public.hotdog_stamps FOR DELETE
  USING (auth.uid() = user_id);

-- Create revealed_facts table
CREATE TABLE IF NOT EXISTS public.revealed_facts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  hotdog_id TEXT NOT NULL,
  fact_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, hotdog_id, fact_index)
);

-- Enable RLS on revealed_facts
ALTER TABLE public.revealed_facts ENABLE ROW LEVEL SECURITY;

-- RLS policies for revealed_facts
CREATE POLICY "Users can view their own revealed facts"
  ON public.revealed_facts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own revealed facts"
  ON public.revealed_facts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own revealed facts"
  ON public.revealed_facts FOR DELETE
  USING (auth.uid() = user_id);