-- Create storage bucket for hotdog photos
INSERT INTO storage.buckets (id, name)
VALUES ('hotdog-photos', 'hotdog-photos')
ON CONFLICT (id) DO NOTHING;

-- Storage policies for hotdog-photos bucket
CREATE POLICY "Users can view their own photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'hotdog-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'hotdog-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own photos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'hotdog-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'hotdog-photos' AND auth.uid()::text = (storage.foldername(name))[1]);