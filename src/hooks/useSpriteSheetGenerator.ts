import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useSpriteSheetGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSprites = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke(
        'generate-sprite-sheet',
        {
          method: 'POST',
        }
      );

      if (functionError) {
        throw functionError;
      }

      toast.success('Sprite sheet generated successfully! Globe will load much faster now.', {
        description: `Processed ${data.hotdogsProcessed} hotdogs in ${data.gridSize}x${data.gridSize} grid (stored in database)`,
        duration: 5000,
      });

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate sprite sheet';
      setError(errorMessage);
      toast.error('Failed to generate sprite sheet', {
        description: errorMessage,
        duration: 5000,
      });
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateSprites,
    isGenerating,
    error,
  };
}
